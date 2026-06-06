import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { Newspaper, Zap, Calendar, ArrowUpRight, TrendingUp } from 'lucide-react';

interface NewsItem {
  _id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
}

const NewsFeed = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${API_BASE}/news`);
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
      {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-glass-border rounded-2xl"></div>)}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black flex items-center gap-2">
          <Newspaper className="text-primary" /> Daily AI Briefing
        </h3>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold animate-pulse">
          <Zap size={14} fill="currentColor" /> LIVE UPDATES
        </div>
      </div>

      {news.length > 0 ? news.map((item) => (
        <div key={item._id} className="glass-morphism p-6 rounded-2xl group cursor-pointer hover:border-primary/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-glass-border px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest opacity-60">
              {item.category}
            </span>
            <div className="flex items-center gap-1 text-text-muted text-xs">
              <Calendar size={12} /> {new Date(item.publishedAt).toLocaleDateString()}
            </div>
          </div>
          <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors flex justify-between items-start gap-4">
            {item.title}
            <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-all text-primary shrink-0" />
          </h4>
          <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
            {item.summary}
          </p>
        </div>
      )) : (
        <div className="text-center py-20 bg-glass rounded-3xl border border-dashed border-glass-border">
          <TrendingUp className="mx-auto mb-4 opacity-20" size={48} />
          <p className="text-text-muted">The briefing is being prepared. Check back shortly.</p>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
