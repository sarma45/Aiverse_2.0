import dbConnect from '@/lib/db';
import Tool from '@/lib/models/Tool';
import { Metadata } from 'next';
import ToolDetailsClient from './ToolDetailsClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  await dbConnect();
  const { id } = await params;
  const tool = await Tool.findById(id);

  if (!tool) return { title: 'Tool Not Found' };

  return {
    title: `${tool.name} - AIVerse Intelligence`,
    description: `${tool.description.substring(0, 160)}... Discover reviews, features, and pricing for ${tool.name}.`,
    openGraph: {
      title: tool.name,
      description: tool.description,
      type: 'website',
    }
  };
}

export default async function ToolDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ToolDetailsClient id={id} />;
}
