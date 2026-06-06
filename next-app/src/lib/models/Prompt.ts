import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Prompt || mongoose.model('Prompt', promptSchema);
