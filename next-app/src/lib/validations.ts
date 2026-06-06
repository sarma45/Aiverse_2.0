import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const ToolSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  category: z.enum(['chat', 'image', 'video', 'audio', 'code', 'writing', 'research', 'productivity', 'marketing', 'other']),
  url: z.string().url(),
  pricingModel: z.enum(['free', 'freemium', 'paid', 'subscription']).default('free'),
  features: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export const AgentSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  category: z.string(),
  capabilities: z.array(z.string()),
  systemInstruction: z.string(),
  baseModel: z.string().default('gemini-1.5-flash'),
});

export const AiModelSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  developer: z.string(),
  category: z.string(),
  parameters: z.string().optional(),
  contextWindow: z.string().optional(),
  license: z.string().optional(),
  url: z.string().url(),
});

export const JobSchema = z.object({
  title: z.string().min(2),
  company: z.string().min(2),
  location: z.string(),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Freelance']),
  category: z.string(),
  description: z.string().min(10),
  salary: z.string().optional(),
  url: z.string().url(),
});

export const ResearchPaperSchema = z.object({
  title: z.string().min(2),
  authors: z.array(z.string()),
  abstract: z.string().min(10),
  category: z.string(),
  url: z.string().url(),
  publishedAt: z.string().optional(), // ISO string
});
