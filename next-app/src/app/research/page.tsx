'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Search, Filter, Calendar, User, ExternalLink, Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

interface ResearchPaper {
  _id: string;
  title: string;
  authors: string[];
  abstract: string;
  category: string;
  url: string;
  publishedAt: string;
  createdAt: string;
}

export default function ResearchPage() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchPapers = async (search = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/research`, { params: { search } });
      setPapers(res.data.data.papers);
    } catch (err) {
      console.error('Research fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPapers(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">
            AI <span className="text-indigo-500">Research</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Access the frontiers of knowledge. The latest breakthroughs in LLMs, Neural Networks, and Robotics.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for Attention Is All You Need, LoRA, Flash Attention..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:border-indigo-500 transition-all text-lg shadow-xl backdrop-blur-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-white/5 border border-white/10 px-8 py-5 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all backdrop-blur-xl">
            <Filter size={20} /> Latest First
          </button>
        </div>

        {/* Research Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
             <div className="col-span-full text-center py-20">
               <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
             </div>
          ) : papers.length > 0 ? papers.map((paper) => (
            <div key={paper._id} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] hover:border-indigo-500/50 transition-all group backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {paper.category}
                  </span>
                  <button className="text-white/20 hover:text-indigo-400 transition-colors">
                     <Bookmark size={20} />
                  </button>
                </div>
                <h3 className="text-2xl font-black mb-4 group-hover:text-indigo-400 transition-colors leading-tight uppercase tracking-tight">{paper.title}</h3>
                <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-6">
                   <User size={14} className="text-indigo-500" />
                   <span>{paper.authors.join(', ')}</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-10 line-clamp-4">{paper.abstract}</p>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-8">
                 <div className="flex items-center gap-2 text-white/20 text-[10px] font-black uppercase tracking-widest">
                    <Calendar size={14} />
                    <span>{paper.publishedAt ? new Date(paper.publishedAt).getFullYear() : '2024'}</span>
                 </div>
                 <a 
                   href={paper.url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-indigo-400 font-black uppercase text-xs tracking-widest hover:gap-4 transition-all"
                 >
                   Open Paper <ExternalLink size={16} />
                 </a>
              </div>
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -z-0"></div>
            </div>
          )) : (
            <div className="col-span-full text-center py-40 bg-white/5 rounded-[4rem] border border-dashed border-white/10 backdrop-blur-xl">
               <BookOpen className="mx-auto mb-6 opacity-20" size={64} />
               <p className="text-xl text-white/40 italic">No research papers found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
