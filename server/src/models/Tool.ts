import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
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
    enum: ['chat', 'image', 'video', 'audio', 'code', 'writing', 'research', 'productivity', 'marketing', 'other'],
  },
  url: {
    type: String,
    required: true,
  },
  pricingModel: {
    type: String,
    enum: ['free', 'freemium', 'paid', 'subscription'],
    default: 'free',
  },
  features: [String],
  tags: [String],
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
  views: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

toolSchema.index({ category: 1 });
toolSchema.index({ tags: 1 });
toolSchema.index({ author: 1 });
toolSchema.index({ isFeatured: -1, createdAt: -1 });

const Tool = mongoose.model('Tool', toolSchema);

export default Tool;
