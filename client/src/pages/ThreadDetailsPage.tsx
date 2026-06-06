import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config';
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

const ThreadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const res = await axios.get(`${API_BASE}/community/threads/${id}`);
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
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/community/comments`, {
        thread: id,
        content: newComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh
      const res = await axios.get(`${API_BASE}/community/threads/${id}`);
      setComments(res.data.data.comments);
      setNewComment('');
    } catch (err) {
      alert('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Loading Discussion...</div>;
  if (!thread) return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Thread not found</div>;

  return (
    <div className="min-h-screen bg-dark py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-text-muted hover:text-white mb-10 transition-colors">
          <ArrowLeft size={20} /> Back to Community
        </button>

        <div className="glass-morphism p-10 rounded-[3rem] border border-glass-border mb-12">
          <div className="flex justify-between items-start mb-8">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
              {thread.category}
            </span>
            <div className="flex items-center gap-6 text-sm opacity-40">
              <span className="flex items-center gap-2"><Eye size={16} /> {thread.views}</span>
              <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(thread.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight">{thread.title}</h1>
          
          <div className="flex items-center gap-4 mb-10 pb-10 border-b border-glass-border">
            <div className="w-12 h-12 bg-glass-border rounded-full flex items-center justify-center text-primary">
              <User size={24} />
            </div>
            <div>
              <div className="font-black text-lg">{thread.author.name}</div>
              <div className="text-sm opacity-40">Community Member</div>
            </div>
          </div>

          <div className="text-xl text-text-muted leading-relaxed whitespace-pre-wrap">
            {thread.content}
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-8">
          <h3 className="text-3xl font-black flex items-center gap-3 mb-10">
            <MessageCircle className="text-primary" /> {comments.length} Comments
          </h3>

          <div className="glass-morphism p-8 rounded-[2.5rem] border border-glass-border mb-12">
            <form onSubmit={handleSubmitComment} className="flex flex-col gap-4">
              <textarea 
                rows={3} required
                className="w-full bg-glass border border-glass-border rounded-2xl p-6 outline-none focus:border-primary resize-none text-lg"
                placeholder="Share your thoughts..."
                value={newComment} onChange={e => setNewComment(e.target.value)}
              ></textarea>
              <button 
                disabled={submitting}
                className="btn-primary self-end px-10 py-4 rounded-xl font-black flex items-center gap-2"
              >
                {submitting ? 'Posting...' : <><Send size={18} /> Post Comment</>}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment._id} className="glass-morphism p-8 rounded-[2rem] border border-glass-border">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-glass-border rounded-full flex items-center justify-center text-xs opacity-60">
                      <User size={16} />
                    </div>
                    <span className="font-bold">{comment.author.name}</span>
                  </div>
                  <span className="text-xs opacity-40">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-text-muted leading-relaxed">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadDetailsPage;
