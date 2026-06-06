import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { Layers, Bookmark, ArrowRight } from 'lucide-react';

interface Collection {
  _id: string;
  name: string;
  description: string;
  tools: any[];
}

const CollectionsWidget = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get(`${API_BASE}/collections`);
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
        <h3 className="text-3xl font-black flex items-center gap-2">
          <Layers className="text-primary" /> Curated Collections
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((col) => (
          <div key={col._id} className="glass-morphism p-8 rounded-[2rem] border border-glass-border hover:border-primary/50 transition-all group cursor-pointer">
            <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest mb-4">
              <Bookmark size={14} /> {col.tools.length} Tools
            </div>
            <h4 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{col.name}</h4>
            <p className="text-text-muted text-sm leading-relaxed mb-8 line-clamp-2">{col.description}</p>
            <button className="flex items-center gap-2 font-bold text-sm text-primary group-hover:gap-4 transition-all">
              Explore Collection <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionsWidget;
