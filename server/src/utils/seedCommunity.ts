import mongoose from 'mongoose';
import Thread from '../models/Thread.js';
import dotenv from 'dotenv';

dotenv.config();

const threads = [
  {
    title: 'Which AI Agent is best for TypeScript refactoring?',
    content: 'I have a large legacy codebase and I am looking for an agent that can handle complex type transformations safely. Any recommendations?',
    category: 'agents',
    tags: ['typescript', 'refactoring', 'agents'],
    views: 1205
  },
  {
    title: 'Showcase: My Automated Research Workflow',
    content: 'I built a workflow that chains Research Sage with a summarization prompt. It saves me 4 hours a day on market analysis!',
    category: 'showcase',
    tags: ['workflow', 'automation', 'productivity'],
    views: 3420
  },
  {
    title: 'Future of Gemini 1.5 Flash vs Pro',
    content: 'Do you think the low latency of Flash makes it better for real-time agents compared to the deep reasoning of Pro?',
    category: 'news',
    tags: ['gemini', 'google', 'llm'],
    views: 890
  },
  {
    title: 'AIVerse v2.0 Community Launch!',
    content: 'Welcome to the official community hub. Share your tools, agents, and workflows here.',
    category: 'general',
    tags: ['launch', 'community', 'announcement'],
    views: 5600
  }
];

const seedCommunity = async () => {
  try {
    const User = mongoose.model('User');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aiverse');
    
    // Get an admin user to be the author
    const admin = await User.findOne({ role: 'admin' });
    const authorId = admin ? admin._id : new mongoose.Types.ObjectId();

    await Thread.deleteMany({});
    await Thread.insertMany(threads.map(t => ({ ...t, author: authorId })));
    
    console.log('Community Hub Seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedCommunity();
