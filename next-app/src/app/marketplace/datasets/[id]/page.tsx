import dbConnect from '@/lib/db';
import Dataset from '@/lib/models/Dataset';
import { Metadata } from 'next';
import DatasetDetailsClient from './DatasetDetailsClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  await dbConnect();
  const { id } = await params;
  const dataset = await Dataset.findById(id);

  if (!dataset) return { title: 'Dataset Not Found' };

  return {
    title: `${dataset.name} - AI Dataset Vault`,
    description: `${dataset.description.substring(0, 160)}... Secure high-quality training data for AI models.`,
    openGraph: {
      title: dataset.name,
      description: dataset.description,
      type: 'website',
    }
  };
}

export default async function DatasetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DatasetDetailsClient id={id} />;
}
