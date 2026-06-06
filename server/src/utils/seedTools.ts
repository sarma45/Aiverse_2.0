import mongoose from 'mongoose';
import Tool from '../models/Tool.js';
import dotenv from 'dotenv';

dotenv.config();

const tools = [
  {
    name: 'Hyper-Chat',
    description: 'Low-latency conversational AI with full memory and document context integration.',
    category: 'chat',
    url: 'https://aiverse.com/chat',
    pricingModel: 'freemium',
    features: ['Context window 1M tokens', 'PDF/Doc analysis', 'Real-time web search'],
    tags: ['chat', 'assistant', 'productivity'],
    isVerified: true
  },
  {
    name: 'Image Forge',
    description: 'High-fidelity neural art generation with Stable-Fusion engine.',
    category: 'image',
    url: 'https://aiverse.com/forge',
    pricingModel: 'freemium',
    features: ['High resolution', 'Custom styles', 'Batch generation'],
    tags: ['image', 'art', 'design'],
    isVerified: true
  },
  {
    name: 'Dev-Forge',
    description: 'Enterprise-grade code generation and refactoring across 50+ languages.',
    category: 'code',
    url: 'https://aiverse.com/code',
    pricingModel: 'paid',
    features: ['Refactoring', 'Unit test generation', 'Security audit'],
    tags: ['code', 'developer', 'software'],
    isVerified: true
  },
  {
    name: 'Deep Research',
    description: 'Real-time web research and knowledge synthesis with verified citations.',
    category: 'research',
    url: 'https://aiverse.com/research',
    pricingModel: 'subscription',
    features: ['Cited sources', 'Structured reports', 'Academic search'],
    tags: ['research', 'data', 'analysis'],
    isVerified: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aiverse');
    await Tool.deleteMany({});
    await Tool.insertMany(tools);
    console.log('Database Seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
