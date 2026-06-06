import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String },
  category: { type: String, enum: ['model', 'research', 'business', 'tools', 'regulation', 'general'], default: 'general' },
  source: { type: String, default: 'AIVerse Intelligence' },
  sourceUrl: { type: String },
  imageUrl: { type: String },
  tags: [String],
  isAIGenerated: { type: Boolean, default: true },
  publishedAt: { type: Date, default: Date.now },
});

export default mongoose.models.News || mongoose.model('News', newsSchema);
