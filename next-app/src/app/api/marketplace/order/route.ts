import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '@/lib/db';
import Prompt from '@/lib/models/Prompt';
import Dataset from '@/lib/models/Dataset';
import Agent from '@/lib/models/Agent';
import { getCurrentUser } from '@/lib/authUtils';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = await getCurrentUser();
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { assetId, assetType } = await req.json();
    
    let asset;
    if (assetType === 'prompt') asset = await Prompt.findById(assetId);
    if (assetType === 'dataset') asset = await Dataset.findById(assetId);
    if (assetType === 'agent') asset = await Agent.findById(assetId);

    if (!asset) return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    
    const amount = (asset.price || 0) * 100;
    if (amount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });

    const options = {
      amount,
      currency: 'INR',
      receipt: `purchase_${Date.now()}`,
      notes: {
        userId: decoded.id,
        assetId,
        assetType,
        type: 'purchase'
      }
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);

  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
