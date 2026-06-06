import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['prompt', 'agent', 'tool'], required: true },
  label: { type: String, required: true },
  config: {
    prompt: String,
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
    toolId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool' },
  }
});

const workflowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  steps: [stepSchema],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: false },
  usageCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Workflow || mongoose.model('Workflow', workflowSchema);
