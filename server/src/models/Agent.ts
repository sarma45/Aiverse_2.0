import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['coding', 'writing', 'research', 'marketing', 'legal', 'finance', 'healthcare', 'general'],
    default: 'general',
  },
  capabilities: [String],
  systemInstruction: {
    type: String,
    required: true,
  },
  baseModel: {
    type: String,
    default: 'gemini-1.5-flash',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  avgRating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

agentSchema.index({ category: 1 });
agentSchema.index({ author: 1 });
agentSchema.index({ isPremium: -1 });

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;
