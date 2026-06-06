'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, User, Calendar, Eye, MessageCircle, Send } from 'lucide-react';

interface Comment {
  _id: string;
  content: string;
  author: { name: string };
  createdAt: string;
}

interface Thread {
  _id: string;
  title: string;
  content: string;
  author: { name: string };
  category: string;
  views: number;
  createdAt: string;
}

export default function ThreadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const res = await axios.get(`/api/community/threads/${id}`);
        setThread(res.data.data.thread);
        setComments(res.data.data.comments);
      } catch (err) {
        console.error('Thread fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchThread();
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`/api/community/comments`, {
        thread: id,
        content: newComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh
      const res = await axios.get(`/api/community/threads/${id}`);
      setComments(res.data.data.comments);
      setNewComment('');
    } catch (err) {
      alert('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!thread) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white text-2xl font-black">Thread not found</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/community')} className="flex items-center gap-2 text-white/60 hover:text-white mb-10 transition-colors">
          <ArrowLeft size={20} /> Back to Community
        </button>

        <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl mb-12">
          <div className="flex justify-between items-start mb-8">
            <span className="bg-indigo-600/20 text-indigo-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-500/20">
              {thread.category}
            </span>
            <div className="flex items-center gap-6 text-sm opacity-40">
              <span className="flex items-center gap-2"><Eye size={16} /> {thread.views}</span>
              <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(thread.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tight">{thread.title}</h1>
          
          <div className="flex items-center gap-4 mb-10 pb-10 border-b border-white/10">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-indigo-400 border border-white/10">
              <User size={24} />
            </div>
            <div>
              <div className="font-black text-lg">{thread.author.name}</div>
              <div className="text-sm opacity-40">AI Visionary</div>
            </div>
          </div>

          <div className="text-xl text-white/70 leading-relaxed whitespace-pre-wrap">
            {thread.content}
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-8">
          <h3 className="text-3xl font-black flex items-center gap-3 mb-10">
            <MessageCircle className="text-indigo-500" /> {comments.length} Reflections
          </h3>

          <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl mb-12">
            <form onSubmit={handleSubmitComment} className="flex flex-col gap-4">
              <textarea 
                rows={3} required
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 outline-none focus:border-indigo-500 transition-all resize-none text-lg text-white/80"
                placeholder="Join the intelligence chain..."
                value={newComment} onChange={e => setNewComment(e.target.value)}
              ></textarea>
              <button 
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 self-end px-10 py-4 rounded-xl font-black flex items-center gap-2 shadow-xl shadow-indigo-600/10 transition-all active:scale-95"
              >
                {submitting ? 'Transmitting...' : <><Send size={18} /> Post Reflection</>}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-xs opacity-60 border border-white/10">
                      <User size={16} />
                    </div>
                    <span className="font-bold">{comment.author.name}</span>
                  </div>
                  <span className="text-xs opacity-40">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-white/60 leading-relaxed">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
