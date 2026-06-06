import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String, required: true },
  type: { type: String, enum: ['subscription', 'promotion', 'purchase'], required: true },
  tool: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool' },
  status: { type: String, default: 'captured' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
