import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    enum: ['general', 'tools', 'agents', 'workflows', 'news', 'showcase'],
    default: 'general',
  },
  tags: [String],
  views: { type: Number, default: 0 },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Thread || mongoose.model('Thread', threadSchema);
