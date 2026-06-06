import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';
import Tool from '../models/Tool.js';
import Transaction from '../models/Transaction.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_secret',
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Order creation failed', error });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, toolId } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'mock_secret')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment verified
      const userId = (req as any).user?.id;
      
      if (toolId) {
        // Feature Tool payment
        await Tool.findByIdAndUpdate(toolId, { isFeatured: true });
        await Transaction.create({
          user: userId,
          amount: 499,
          type: 'promotion',
          tool: toolId,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id
        });
      } else {
        // Subscription payment
        const userEmail = (req as any).user?.email;
        if (userEmail) {
           await User.findOneAndUpdate({ email: userEmail }, { subscription: 'pro' });
           await Transaction.create({
             user: userId,
             amount: 999,
             type: 'subscription',
             razorpayOrderId: razorpay_order_id,
             razorpayPaymentId: razorpay_payment_id
           });
        }
      }
      return res.json({ message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Payment verification failed', error });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_webhook_secret';
  
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    const event = req.body.event;
    
    if (event === 'payment.captured') {
      const email = req.body.payload.payment.entity.email;
      const amount = req.body.payload.payment.entity.amount;
      
      const tier = amount >= 99900 ? 'pro' : 'free';
      await User.findOneAndUpdate({ email }, { subscription: tier });
      console.log(`Webhook: Updated ${email} to ${tier}`);
    }
    
    res.json({ status: 'ok' });
  } else {
    res.status(400).send('Invalid signature');
  }
};