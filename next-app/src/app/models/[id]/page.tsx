import dbConnect from '@/lib/db';
import AiModel from '@/lib/models/AiModel';
import { Metadata } from 'next';
import ModelDetailsClient from './ModelDetailsClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  await dbConnect();
  const { id } = await params;
  const model = await AiModel.findById(id);

  if (!model) return { title: 'Model Not Found' };

  return {
    title: `${model.name} - AI Model Intelligence`,
    description: `${model.description.substring(0, 160)}... Review specs, developer info, and benchmarks for ${model.name}.`,
    openGraph: {
      title: model.name,
      description: model.description,
      type: 'website',
    }
  };
}

export default async function ModelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ModelDetailsClient id={id} />;
}
