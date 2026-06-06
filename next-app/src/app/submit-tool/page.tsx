'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import axios from 'axios';
import { Sparkles, ArrowLeft, Upload } from 'lucide-react';

export default function SubmitToolPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'chat',
    url: '',
    pricingModel: 'free',
    features: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    try {
      const data = {
        ...formData,
        features: formData.features.split(',').map(f => f.trim()),
        tags: formData.tags.split(',').map(t => t.trim())
      };

      await axios.post(`/api/tools`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Tool submitted successfully for review!');
      router.push('/');
    } catch (err: unknown) {
      setError(err.response?.data?.error || 'Failed to submit tool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <Navbar />
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/60 hover:text-white mb-10 transition-colors">
          <ArrowLeft size={20} /> Back to Hub
        </button>

        <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Upload color="white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight">Submit AI Tool</h1>
              <p className="text-white/40">Launch your creation into the ecosystem.</p>
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 font-bold text-sm uppercase tracking-widest">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-40">Tool Name</label>
                <input 
                  type="text" name="name" required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Hyper-Chat"
                  value={formData.name} onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-40">Category</label>
                <div className="relative">
                  <select 
                    name="category"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:border-indigo-500 outline-none appearance-none transition-all"
                    value={formData.category} onChange={handleChange}
                  >
                    <option value="chat" className="bg-[#111]">Chat & Assistant</option>
                    <option value="image" className="bg-[#111]">Image Generation</option>
                    <option value="video" className="bg-[#111]">Video Generation</option>
                    <option value="audio" className="bg-[#111]">Audio & Music</option>
                    <option value="code" className="bg-[#111]">Developer Tools</option>
                    <option value="writing" className="bg-[#111]">Writing & Copy</option>
                    <option value="research" className="bg-[#111]">Research & Data</option>
                    <option value="productivity" className="bg-[#111]">Productivity</option>
                    <option value="marketing" className="bg-[#111]">Marketing</option>
                    <option value="other" className="bg-[#111]">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-40">Website URL</label>
              <input 
                type="url" name="url" required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:border-indigo-500 outline-none transition-all"
                placeholder="https://yourtool.com"
                value={formData.url} onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-40">Short Description</label>
              <textarea 
                name="description" required rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:border-indigo-500 outline-none resize-none transition-all"
                placeholder="Describe the high-signal value of your tool..."
                value={formData.description} onChange={handleChange}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-40">Pricing Model</label>
                <div className="relative">
                  <select 
                    name="pricingModel"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:border-indigo-500 outline-none appearance-none transition-all"
                    value={formData.pricingModel} onChange={handleChange}
                  >
                    <option value="free" className="bg-[#111]">Free</option>
                    <option value="freemium" className="bg-[#111]">Freemium</option>
                    <option value="paid" className="bg-[#111]">Paid</option>
                    <option value="subscription" className="bg-[#111]">Subscription</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-40">Tags (comma separated)</label>
                <input 
                  type="text" name="tags"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:border-indigo-500 outline-none transition-all"
                  placeholder="ai, chat, gpt4"
                  value={formData.tags} onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-40">Key Features (comma separated)</label>
              <input 
                type="text" name="features"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:border-indigo-500 outline-none transition-all"
                placeholder="High Performance, Secure, Scalable"
                value={formData.features} onChange={handleChange}
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 mt-8 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
            >
              {loading ? 'Submitting...' : <><Sparkles size={20} /> Launch into Ecosystem</>}
            </button>
          </form>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -z-0"></div>
        </div>
      </div>
    </div>
  );
}
