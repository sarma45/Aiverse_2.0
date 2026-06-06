import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Freelance'], default: 'Full-time' },
  category: { type: String, required: true }, // e.g., "ML Engineer", "AI Researcher"
  description: { type: String, required: true },
  salary: { type: String },
  url: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Job || mongoose.model('Job', jobSchema);
