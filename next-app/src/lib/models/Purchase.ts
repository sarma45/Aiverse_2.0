import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assetType: { type: String, enum: ['prompt', 'dataset', 'agent'], required: true },
  assetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Compound index to prevent duplicate purchases
purchaseSchema.index({ user: 1, assetId: 1 }, { unique: true });

export default mongoose.models.Purchase || mongoose.model('Purchase', purchaseSchema);
