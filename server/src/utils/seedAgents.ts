import mongoose from 'mongoose';
import Agent from '../models/Agent.js';
import dotenv from 'dotenv';

dotenv.config();

const agents = [
  {
    name: 'Code Architect Pro',
    description: 'Expert agent for designing scalable system architectures and generating production-ready code.',
    category: 'coding',
    capabilities: ['System Design', 'Code Generation', 'Refactoring', 'Unit Testing'],
    systemInstruction: 'You are a senior software architect. Provide high-level design and clean code.',
    isVerified: true,
    isPremium: true,
    avgRating: 4.9,
    reviewCount: 120
  },
  {
    name: 'Research Sage',
    description: 'Autonomous research agent that synthesizes complex information into actionable reports.',
    category: 'research',
    capabilities: ['Data Synthesis', 'Web Research', 'Citation Management'],
    systemInstruction: 'You are a professional researcher. Provide deep analysis with verified sources.',
    isVerified: true,
    avgRating: 4.7,
    reviewCount: 85
  },
  {
    name: 'Copy Forge',
    description: 'Creative writing assistant for high-conversion marketing copy and professional articles.',
    category: 'writing',
    capabilities: ['SEO Copywriting', 'Email Marketing', 'Brand Voice Alignment'],
    systemInstruction: 'You are a world-class copywriter. Focus on persuasion and brand consistency.',
    isVerified: true,
    isPremium: true,
    avgRating: 4.8,
    reviewCount: 210
  },
  {
    name: 'Legal Guard',
    description: 'Specialized agent for analyzing legal documents and identifying potential risks.',
    category: 'legal',
    capabilities: ['Contract Analysis', 'Risk Assessment', 'Compliance Check'],
    systemInstruction: 'You are a legal research assistant. Help users understand legal concepts.',
    isVerified: true,
    avgRating: 4.5,
    reviewCount: 45
  }
];

const seedAgents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aiverse');
    await Agent.deleteMany({});
    await Agent.insertMany(agents);
    console.log('Agents Seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAgents();
