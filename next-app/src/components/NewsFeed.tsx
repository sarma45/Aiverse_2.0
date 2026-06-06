'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Newspaper, Zap, Calendar, ArrowUpRight, TrendingUp } from 'lucide-react';

interface NewsItem {
  _id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
}

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`/api/news`);
        setNews(res.data.data.news);
      } catch (err) {
        console.error('News fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return (
    <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-white/5 border border-white/10 rounded-2xl"></div>)}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black flex items-center gap-2 uppercase tracking-tighter">
          <Newspaper className="text-indigo-500" /> Daily Briefing
        </h3>
        <div className="flex items-center gap-2 bg-indigo-600/10 text-indigo-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse border border-indigo-500/20">
          <Zap size={12} fill="currentColor" /> LIVE
        </div>
      </div>

      {news.length > 0 ? news.map((item) => (
        <div key={item._id} className="bg-white/5 border border-white/10 p-6 rounded-3xl group cursor-pointer hover:border-indigo-500/50 transition-all backdrop-blur-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="bg-white/5 border border-white/5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/40">
              {item.category}
            </span>
            <div className="flex items-center gap-1 text-white/20 text-[10px] font-bold">
              <Calendar size={12} /> {new Date(item.publishedAt).toLocaleDateString()}
            </div>
          </div>
          <h4 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors flex justify-between items-start gap-4 relative z-10 uppercase tracking-tight leading-tight">
            {item.title}
            <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-all text-indigo-500 shrink-0" />
          </h4>
          <p className="text-sm text-white/60 leading-relaxed line-clamp-2 relative z-10">
            {item.summary}
          </p>
          
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600/5 blur-xl -z-0"></div>
        </div>
      )) : (
        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10 backdrop-blur-xl">
          <TrendingUp className="mx-auto mb-4 opacity-20" size={48} />
          <p className="text-white/40 font-bold uppercase text-xs tracking-widest italic">Syncing Briefing...</p>
        </div>
      )}
    </div>
  );
}
