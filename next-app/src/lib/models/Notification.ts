import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['system', 'purchase', 'review', 'mention'], default: 'system' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  link: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
