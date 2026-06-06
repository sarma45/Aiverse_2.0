import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  assetType: { type: String, enum: ['tool', 'agent', 'prompt', 'dataset'], required: true },
  eventType: { type: String, enum: ['view', 'click'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional: track logged-in user
  ip: { type: String }, // For deduplication/rate limiting
  timestamp: { type: Date, default: Date.now },
});

// Index for fast time-series aggregation
analyticsSchema.index({ assetId: 1, eventType: 1, timestamp: -1 });

export default mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);
