import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '@/lib/db';
import Transaction from '@/lib/models/Transaction';
import User from '@/lib/models/User';
import Tool from '@/lib/models/Tool';
import Purchase from '@/lib/models/Purchase';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    // Note: In production, this should be protected by a secure cron secret or admin token
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Fetch payments from the last 24 hours
    const fromTime = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
    
    // Using razorpay SDK to fetch payments
    // Note: The razorpay SDK type definitions might not perfectly map `from` but it's supported.
    const payments = await razorpay.payments.all({
      from: fromTime,
    });

    let reconciledCount = 0;

    for (const payment of payments.items) {
      if (payment.status !== 'captured') continue;

      // Check if we already processed this payment
      const existing = await Transaction.findOne({ razorpayPaymentId: payment.id });
      if (existing) continue; // Already processed

      // Reconcile missing payment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const notes: any = payment.notes || {};
      const { type, toolId, assetId, assetType, userId } = notes;
      
      let user = null;
      if (payment.email) {
        user = await User.findOne({ email: payment.email });
      } else if (userId) {
        user = await User.findById(userId);
      }

      if (!user && !userId) continue; // Cannot reconcile without user context

      const finalUserId = user ? user._id : userId;

      let transaction;

      if (type === 'promotion' && toolId) {
        await Tool.findByIdAndUpdate(toolId, { isFeatured: true });
        transaction = await Transaction.create({
          user: finalUserId,
          amount: (payment.amount as number) / 100,
          type: 'promotion',
          tool: toolId,
          razorpayOrderId: payment.order_id,
          razorpayPaymentId: payment.id
        });
        reconciledCount++;
      } else if (type === 'subscription') {
        await User.findByIdAndUpdate(finalUserId, { subscription: 'pro' });
        transaction = await Transaction.create({
          user: finalUserId,
          amount: (payment.amount as number) / 100,
          type: 'subscription',
          razorpayOrderId: payment.order_id,
          razorpayPaymentId: payment.id
        });
        reconciledCount++;
      } else if (type === 'purchase' && assetId) {
        transaction = await Transaction.create({
          user: finalUserId,
          amount: (payment.amount as number) / 100,
          type: 'purchase',
          razorpayOrderId: payment.order_id,
          razorpayPaymentId: payment.id
        });

        // Ensure we don't insert duplicate purchase
        const existingPurchase = await Purchase.findOne({ user: finalUserId, assetId });
        if (!existingPurchase) {
          await Purchase.create({
            user: finalUserId,
            assetType,
            assetId,
            transaction: transaction._id
          });
        }
        reconciledCount++;
      }
    }

    return NextResponse.json({ status: 'success', reconciledCount });
  } catch (error: unknown) {
    console.error('Reconciliation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
