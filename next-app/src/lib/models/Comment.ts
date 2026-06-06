import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema);
