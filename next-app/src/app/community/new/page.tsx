'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { MessageSquare, ArrowLeft, Send } from 'lucide-react';

export default function CreateThreadPage() {
  const router = useRouter();
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
      router.push('/login');
      return;
    }

    try {
      await axios.post(`/api/community/threads`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Thread posted successfully!');
      router.push('/community');
    } catch (err) {
      alert('Failed to post thread');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/60 hover:text-white mb-10 transition-colors">
          <ArrowLeft size={20} /> Back to Community
        </button>

        <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <MessageSquare color="white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">New Discussion</h1>
              <p className="text-white/40">Engage with the global AI network.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 uppercase opacity-40">Discussion Title</label>
              <input 
                type="text" required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:border-indigo-500 outline-none text-lg transition-all"
                placeholder="What's on your mind?"
                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase opacity-40">Category</label>
              <div className="relative">
                <select 
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:border-indigo-500 outline-none appearance-none transition-all"
                  value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="general" className="bg-[#111]">General</option>
                  <option value="tools" className="bg-[#111]">Tools & Resources</option>
                  <option value="agents" className="bg-[#111]">AI Agents</option>
                  <option value="workflows" className="bg-[#111]">Workflows</option>
                  <option value="news" className="bg-[#111]">AI News</option>
                  <option value="showcase" className="bg-[#111]">Showcase</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase opacity-40">Content</label>
              <textarea 
                required rows={8}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:border-indigo-500 outline-none resize-none transition-all"
                placeholder="Deep dive into your topic..."
                value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}
              ></textarea>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 mt-8 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
            >
              {loading ? 'Posting...' : <><Send size={20} /> Publish Discussion</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
