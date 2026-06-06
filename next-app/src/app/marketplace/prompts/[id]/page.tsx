import dbConnect from '@/lib/db';
import Prompt from '@/lib/models/Prompt';
import { Metadata } from 'next';
import PromptDetailsClient from './PromptDetailsClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  await dbConnect();
  const { id } = await params;
  const prompt = await Prompt.findById(id);

  if (!prompt) return { title: 'Prompt Not Found' };

  return {
    title: `${prompt.title} - AI Prompt Marketplace`,
    description: `${prompt.description.substring(0, 160)}... Buy and deploy this precision-engineered prompt.`,
    openGraph: {
      title: prompt.title,
      description: prompt.description,
      type: 'website',
    }
  };
}

export default async function PromptDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PromptDetailsClient id={id} />;
}
