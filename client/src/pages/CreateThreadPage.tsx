import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config';
import { MessageSquare, ArrowLeft, Send } from 'lucide-react';

const CreateThreadPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${API_BASE}/community/threads`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Thread posted successfully!');
      navigate('/community');
    } catch (err) {
      alert('Failed to post thread');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-white mb-10 transition-colors">
          <ArrowLeft size={20} /> Back to Community
        </button>

        <div className="glass-morphism p-10 rounded-[3rem] border border-glass-border">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <MessageSquare color="white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">New Discussion</h1>
              <p className="text-text-muted">Engage with the global AI network.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 uppercase opacity-60">Discussion Title</label>
              <input 
                type="text" required
                className="w-full bg-glass border border-glass-border rounded-xl py-4 px-6 focus:border-primary outline-none text-lg"
                placeholder="What's on your mind?"
                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase opacity-60">Category</label>
              <select 
                className="w-full bg-glass border border-glass-border rounded-xl py-4 px-6 focus:border-primary outline-none appearance-none"
                value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="general">General</option>
                <option value="tools">Tools & Resources</option>
                <option value="agents">AI Agents</option>
                <option value="workflows">Workflows</option>
                <option value="news">AI News</option>
                <option value="showcase">Showcase</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase opacity-60">Content</label>
              <textarea 
                required rows={8}
                className="w-full bg-glass border border-glass-border rounded-xl py-4 px-6 focus:border-primary outline-none resize-none"
                placeholder="Deep dive into your topic..."
                value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}
              ></textarea>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full btn-primary py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
            >
              {loading ? 'Posting...' : <><Send size={20} /> Publish Discussion</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateThreadPage;
