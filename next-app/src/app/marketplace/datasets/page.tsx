'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, Search, Filter, HardDrive, ShoppingCart, ChevronRight, User, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

interface Dataset {
  _id: string;
  name: string;
  description: string;
  size: string;
  format: string;
  category: string;
  price: number;
  author: { name: string };
  isVerified: boolean;
}

export default function DatasetMarketplacePage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchDatasets = async (search = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/marketplace/datasets`, { params: { search } });
      setDatasets(res.data.data.datasets);
    } catch (err) {
      console.error('Datasets fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDatasets(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">
            Dataset <span className="text-indigo-500">Vault</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            High-quality proprietary data for fine-tuning models and deep research. Fuel the intelligence machine.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for Image, Text, Audio, or Multimodal datasets..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:border-indigo-500 transition-all text-lg shadow-xl backdrop-blur-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-white/5 border border-white/10 px-8 py-5 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all backdrop-blur-xl">
            <Filter size={20} /> Data Format
          </button>
        </div>

        {/* Dataset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             <div className="col-span-full text-center py-20">
               <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
             </div>
          ) : datasets.length > 0 ? datasets.map((dataset) => (
            <div key={dataset._id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden backdrop-blur-xl">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                  <Database size={32} />
                </div>
                <div className="text-xl font-black text-white uppercase tracking-tight">
                   {dataset.price === 0 ? 'FREE' : `₹${dataset.price}`}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-1 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{dataset.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                 {dataset.isVerified && <Shield size={14} className="text-indigo-400" />}
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{dataset.category}</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-8 line-clamp-3">{dataset.description}</p>

              <div className="flex gap-4 mb-8">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                   <HardDrive size={14} className="opacity-40" />
                   <span className="text-xs font-bold">{dataset.size}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Format:</span>
                   <span className="text-xs font-bold text-indigo-400">{dataset.format}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                      <User size={14} className="opacity-40" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{dataset.author.name}</span>
                </div>
                <button 
                  onClick={() => router.push(`/marketplace/datasets/${dataset._id}`)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/10 transition-all active:scale-95"
                >
                  Download <ShoppingCart size={16} />
                </button>
              </div>
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 blur-2xl -z-0"></div>
            </div>
          )) : (
            <div className="col-span-full text-center py-40 bg-white/5 rounded-[4rem] border border-dashed border-white/10 backdrop-blur-xl">
               <Database className="mx-auto mb-6 opacity-20" size={64} />
               <p className="text-xl text-white/40 italic">No intelligence vaults found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
