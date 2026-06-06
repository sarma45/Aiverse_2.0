'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layers, Bookmark, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Collection {
  _id: string;
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tools: any[];
}

export default function CollectionsWidget() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get(`/api/collections`);
        setCollections(res.data.data.collections);
      } catch (err) {
        console.error('Collections fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  if (loading || collections.length === 0) return null;

  return (
    <div className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-black flex items-center gap-3 uppercase tracking-tighter">
          <Layers className="text-indigo-500" /> Curated Intel
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((col) => (
          <div 
            key={col._id} 
            onClick={() => router.push(`/collections/${col._id}`)}
            className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:border-indigo-500/50 transition-all group cursor-pointer backdrop-blur-xl relative overflow-hidden"
          >
            <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <Bookmark size={14} /> {col.tools.length} Sources
            </div>
            <h4 className="text-2xl font-black mb-4 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{col.name}</h4>
            <p className="text-white/40 text-sm leading-relaxed mb-8 line-clamp-2">{col.description}</p>
            <button className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-indigo-400 group-hover:gap-4 transition-all">
              Explore Collection <ArrowRight size={18} />
            </button>
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 blur-2xl -z-0"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
