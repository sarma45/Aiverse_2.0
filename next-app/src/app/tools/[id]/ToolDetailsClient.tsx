'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Star, MessageSquare, ExternalLink, ShieldCheck, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: { name: string };
  createdAt: string;
}

interface Tool {
  _id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  avgRating: number;
  reviewCount: number;
  features: string[];
  isVerified: boolean;
}

export default function ToolDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const [tool, setTool] = useState<Tool | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [toolRes, reviewsRes] = await Promise.all([
          axios.get(`/api/tools/${id}`),
          axios.get(`/api/reviews/tool/${id}`)
        ]);
        setTool(toolRes.data.data.tool);
        setReviews(reviewsRes.data.data.reviews);
      } catch (err) {
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    setSubmitting(true);
    try {
      await axios.post(`/api/reviews`, {
        tool: id,
        ...newReview
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh
      const reviewsRes = await axios.get(`/api/reviews/tool/${id}`);
      setReviews(reviewsRes.data.data.reviews);
      setNewReview({ rating: 5, comment: '' });
      alert('Review posted!');
    } catch (err) {
      alert('Failed to post review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!tool) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-2xl font-black text-white">Tool Not Found</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/60 hover:text-white mb-10 transition-colors">
          <ArrowLeft size={20} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-3xl mb-12 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-5xl font-black tracking-tighter uppercase">{tool.name}</h1>
                {tool.isVerified && <ShieldCheck className="text-indigo-400" size={32} />}
              </div>
              <p className="text-xl text-white/60 leading-relaxed mb-10">{tool.description}</p>
              
              <div className="flex flex-wrap gap-3 mb-12">
                {tool.features.map((f, i) => (
                  <span key={i} className="bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest">
                    {f}
                  </span>
                ))}
              </div>

              <a 
                href={tool.url} target="_blank" rel="noopener noreferrer"
                className="bg-indigo-600 hover:bg-indigo-700 text-white inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
              >
                Launch Website <ExternalLink size={20} />
              </a>
              
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 blur-3xl -z-0"></div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-3xl">
              <h3 className="text-3xl font-black mb-10 flex items-center gap-3 tracking-tighter uppercase">
                <MessageSquare className="text-indigo-500" /> Community Intel
              </h3>

              <div className="space-y-10">
                {reviews.length > 0 ? reviews.map((rev) => (
                  <div key={rev._id} className="border-b border-white/5 pb-10 last:border-0">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-black text-lg uppercase tracking-tight">{rev.user.name}</span>
                      <div className="flex gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < rev.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-white/60 leading-relaxed text-lg">{rev.comment}</p>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-20 mt-6 block">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                )) : (
                   <div className="text-center py-20 opacity-20 italic">
                      No field reports yet. Be the first to analyze this tool.
                   </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Submit Review */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl sticky top-32 shadow-xl">
              <h4 className="text-2xl font-black mb-8 uppercase tracking-tighter">Submit Analysis</h4>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-40">Rating Level</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-indigo-500 transition-all appearance-none text-white font-bold"
                      value={newReview.rating}
                      onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                    >
                      {[5, 4, 3, 2, 1].map(n => <option key={n} value={n} className="bg-[#111]">{n} Stars - {n === 5 ? 'Superior' : n === 1 ? 'Failed' : 'Optimal'}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-40">Observations</label>
                  <textarea 
                    rows={5} required
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-indigo-500 transition-all resize-none text-white/80"
                    placeholder="Provide your technical findings..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  disabled={submitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {submitting ? 'Transmitting...' : <><Send size={18} /> Deploy Review</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
