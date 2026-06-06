import mongoose from 'mongoose';

const aiModelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  developer: { type: String, required: true }, // e.g., "Google", "OpenAI"
  category: { type: String, required: true }, // e.g., "LLM", "Vision", "Audio"
  parameters: { type: String }, // e.g., "1.5T"
  contextWindow: { type: String }, // e.g., "1M tokens"
  license: { type: String }, // e.g., "Proprietary", "Apache-2.0"
  url: { type: String, required: true },
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.AiModel || mongoose.model('AiModel', aiModelSchema);
