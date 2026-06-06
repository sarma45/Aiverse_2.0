import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tools: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tool',
  }],
  category: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
