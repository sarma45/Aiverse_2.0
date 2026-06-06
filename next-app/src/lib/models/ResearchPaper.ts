import mongoose from 'mongoose';

const researchPaperSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  authors: [String],
  abstract: { type: String, required: true },
  category: { type: String, required: true }, // e.g., "NLP", "Robotics"
  url: { type: String, required: true },
  publishedAt: { type: Date },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ResearchPaper || mongoose.model('ResearchPaper', researchPaperSchema);
