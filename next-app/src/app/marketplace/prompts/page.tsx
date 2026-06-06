'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Search, Filter, Star, ShoppingCart, ChevronRight, User, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

interface Prompt {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  author: { name: string };
  avgRating: number;
  reviewCount: number;
}

export default function PromptMarketplacePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchPrompts = async (search = '') => {
    setLoading(true);
    try {
      // Note: We need a generic marketplace endpoint or specific prompt listing
      const res = await axios.get(`/api/marketplace/prompts`, { params: { search } });
      setPrompts(res.data.data.prompts);
    } catch (err) {
      console.error('Prompts fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPrompts(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">
            Prompt <span className="text-indigo-500">Market</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Acquire precision-engineered prompts for LLMs, Image generators, and AI agents. The language of logic.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for GPT-4, Midjourney, Stable Diffusion prompts..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:border-indigo-500 transition-all text-lg shadow-xl backdrop-blur-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-white/5 border border-white/10 px-8 py-5 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all backdrop-blur-xl">
            <Filter size={20} /> Price Range
          </button>
        </div>

        {/* Prompt Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             <div className="col-span-full text-center py-20">
               <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
             </div>
          ) : prompts.length > 0 ? prompts.map((prompt) => (
            <div key={prompt._id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden backdrop-blur-xl">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                  <Terminal size={32} />
                </div>
                <div className="text-xl font-black text-white uppercase tracking-tight">
                   {prompt.price === 0 ? 'FREE' : `₹${prompt.price}`}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{prompt.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-2">{prompt.description}</p>

              <div className="flex items-center gap-3 mb-8">
                 <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                    <User size={14} className="opacity-40" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{prompt.author.name}</span>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <div className="flex items-center gap-1 text-yellow-500 font-black">
                  <Star size={14} fill="currentColor" /> {prompt.avgRating.toFixed(1)}
                </div>
                <button 
                  onClick={() => router.push(`/marketplace/prompts/${prompt._id}`)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/10 transition-all active:scale-95"
                >
                  Acquire <ShoppingCart size={16} />
                </button>
              </div>
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 blur-2xl -z-0"></div>
            </div>
          )) : (
            <div className="col-span-full text-center py-40 bg-white/5 rounded-[4rem] border border-dashed border-white/10 backdrop-blur-xl">
               <MessageSquare className="mx-auto mb-6 opacity-20" size={64} />
               <p className="text-xl text-white/40 italic">No precision prompts found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
