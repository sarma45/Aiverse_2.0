import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  tool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tool',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Update tool rating when a review is added
reviewSchema.post('save', async function() {
  const Tool = mongoose.model('Tool');
  const reviews = await mongoose.model('Review').find({ tool: this.tool });
  const reviewCount = reviews.length;
  const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviewCount;
  
  await Tool.findByIdAndUpdate(this.tool, { avgRating, reviewCount });
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
