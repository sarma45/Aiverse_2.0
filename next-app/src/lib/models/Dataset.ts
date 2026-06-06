import mongoose from 'mongoose';

const datasetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  size: { type: String }, // e.g., "1.2GB", "1M rows"
  format: { type: String }, // e.g., "JSON", "CSV"
  category: { type: String, required: true },
  price: { type: Number, default: 0 },
  url: { type: String, required: true }, // Link to download
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Dataset || mongoose.model('Dataset', datasetSchema);
