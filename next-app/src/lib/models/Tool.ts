import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  url: { type: String, required: true },
  pricingModel: { type: String, enum: ['free', 'freemium', 'paid', 'subscription'], default: 'free' },
  features: [String],
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Tool || mongoose.model('Tool', toolSchema);
