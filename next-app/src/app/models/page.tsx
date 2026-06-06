'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Cpu, Search, Filter, Star, ShieldCheck, ChevronRight, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

interface AiModel {
  _id: string;
  name: string;
  description: string;
  developer: string;
  category: string;
  parameters: string;
  contextWindow: string;
  license: string;
  avgRating: number;
  isVerified: boolean;
}

export default function ModelsPage() {
  const [models, setModels] = useState<AiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchModels = async (search = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/models`, { params: { search } });
      setModels(res.data.data.models);
    } catch (err) {
      console.error('Models fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchModels(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">
            AI <span className="text-indigo-500">Models</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Explore the foundational intelligence driving the AI revolution. From LLMs to Multimodal titans.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for GPT-4, Claude, Gemini, Llama..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:border-indigo-500 transition-all text-lg shadow-xl backdrop-blur-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-white/5 border border-white/10 px-8 py-5 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all backdrop-blur-xl">
            <Filter size={20} /> Parameters
          </button>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             <div className="col-span-full text-center py-20">
               <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
             </div>
          ) : models.length > 0 ? models.map((model) => (
            <div key={model._id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden backdrop-blur-xl">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                  <Cpu size={32} />
                </div>
                {model.isVerified && (
                  <div className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck size={10} /> Verified
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-bold mb-1 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{model.name}</h3>
              <div className="text-xs font-black text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Globe size={12} /> {model.developer}
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-2">{model.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Parameters</div>
                  <div className="text-sm font-bold">{model.parameters || 'Unknown'}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Context</div>
                  <div className="text-sm font-bold">{model.contextWindow || 'Standard'}</div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <div className="flex items-center gap-1 text-yellow-500 font-black">
                  <Star size={14} fill="currentColor" /> {model.avgRating.toFixed(1)}
                </div>
                <button 
                  onClick={() => router.push(`/models/${model._id}`)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/10 transition-all active:scale-95"
                >
                  View Details <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 blur-2xl -z-0"></div>
            </div>
          )) : (
            <div className="col-span-full text-center py-20 opacity-20 italic">
              No models found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
