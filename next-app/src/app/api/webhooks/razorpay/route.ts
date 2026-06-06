import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Tool from '@/lib/models/Tool';
import Transaction from '@/lib/models/Transaction';
import Purchase from '@/lib/models/Purchase';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = body.event;
    const payload = body.payload.payment.entity;

    if (event === 'payment.captured') {
      const { email, notes } = payload;
      const { type, toolId, assetId, assetType, userId } = notes;

      let transaction;

      if (type === 'promotion' && toolId) {
        await Tool.findByIdAndUpdate(toolId, { isFeatured: true });
        const user = await User.findOne({ email });
        transaction = await Transaction.create({
          user: user?._id,
          amount: payload.amount / 100,
          type: 'promotion',
          tool: toolId,
          razorpayOrderId: payload.order_id,
          razorpayPaymentId: payload.id
        });
      } else if (type === 'subscription') {
        await User.findOneAndUpdate({ email }, { subscription: 'pro' });
        const user = await User.findOne({ email });
        transaction = await Transaction.create({
          user: user?._id,
          amount: payload.amount / 100,
          type: 'subscription',
          razorpayOrderId: payload.order_id,
          razorpayPaymentId: payload.id
        });
      } else if (type === 'purchase' && assetId) {
        transaction = await Transaction.create({
          user: userId,
          amount: payload.amount / 100,
          type: 'purchase',
          razorpayOrderId: payload.order_id,
          razorpayPaymentId: payload.id
        });

        await Purchase.create({
          user: userId,
          assetType,
          assetId,
          transaction: transaction._id
        });
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: unknown) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
