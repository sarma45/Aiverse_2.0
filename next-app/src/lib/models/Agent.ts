import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  capabilities: [String],
  systemInstruction: { type: String, required: true },
  baseModel: { type: String, default: 'gemini-1.5-flash' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Agent || mongoose.model('Agent', agentSchema);
