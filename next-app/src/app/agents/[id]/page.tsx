import dbConnect from '@/lib/db';
import Agent from '@/lib/models/Agent';
import { Metadata } from 'next';
import AgentDetailsClient from './AgentDetailsClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  await dbConnect();
  const { id } = await params;
  const agent = await Agent.findById(id);

  if (!agent) return { title: 'Agent Not Found' };

  return {
    title: `${agent.name} - AI Agent Marketplace`,
    description: `${agent.description.substring(0, 160)}... Deploy this autonomous agent for your ${agent.category} tasks.`,
    openGraph: {
      title: agent.name,
      description: agent.description,
      type: 'website',
    }
  };
}

export default async function AgentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AgentDetailsClient id={id} />;
}
