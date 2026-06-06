import mongoose from 'mongoose';

const deploymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  apiKey: { type: String, required: true, unique: true },
  namespace: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'active', 'failed'], default: 'active' },
  endpointUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Deployment || mongoose.model('Deployment', deploymentSchema);
