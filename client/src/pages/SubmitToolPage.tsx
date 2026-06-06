import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config';
import { Sparkles, ArrowLeft, Upload } from 'lucide-react';

const SubmitToolPage = () => {
  const navigate = useNavigate();
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
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const data = {
        ...formData,
        features: formData.features.split(',').map(f => f.trim()),
        tags: formData.tags.split(',').map(t => t.trim())
      };

      await axios.post(`${API_BASE}/tools`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Tool submitted successfully for review!');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit tool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-white mb-10 transition-colors">
          <ArrowLeft size={20} /> Back to Hub
        </button>

        <div className="glass-morphism p-10 rounded-[3rem] border border-glass-border">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Upload color="white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black">Submit AI Tool</h1>
              <p className="text-text-muted">Share your creation with the global AI community.</p>
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wider opacity-60">Tool Name</label>
                <input 
                  type="text" name="name" required
                  className="w-full bg-glass border border-glass-border rounded-xl py-4 px-6 focus:border-primary outline-none"
                  placeholder="e.g. Hyper-Chat"
                  value={formData.name} onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wider opacity-60">Category</label>
                <select 
                  name="category"
                  className="w-full bg-glass border border-glass-border rounded-xl py-4 px-6 focus:border-primary outline-none appearance-none"
                  value={formData.category} onChange={handleChange}
                >
                  <option value="chat">Chat & Assistant</option>
                  <option value="image">Image Generation</option>
                  <option value="video">Video Generation</option>
                  <option value="audio">Audio & Music</option>
                  <option value="code">Developer Tools</option>
                  <option value="writing">Writing & Copy</option>
                  <option value="research">Research & Data</option>
                  <option value="productivity">Productivity</option>
                  <option value="marketing">Marketing</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wider opacity-60">Website URL</label>
              <input 
                type="url" name="url" required
                className="w-full bg-glass border border-glass-border rounded-xl py-4 px-6 focus:border-primary outline-none"
                placeholder="https://yourtool.com"
                value={formData.url} onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wider opacity-60">Short Description</label>
              <textarea 
                name="description" required rows={3}
                className="w-full bg-glass border border-glass-border rounded-xl py-4 px-6 focus:border-primary outline-none resize-none"
                placeholder="What does your tool do?"
                value={formData.description} onChange={handleChange}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wider opacity-60">Pricing Model</label>
                <select 
                  name="pricingModel"
                  className="w-full bg-glass border border-glass-border rounded-xl py-4 px-6 focus:border-primary outline-none appearance-none"
                  value={formData.pricingModel} onChange={handleChange}
                >
                  <option value="free">Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                  <option value="subscription">Subscription</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wider opacity-60">Tags (comma separated)</label>
                <input 
                  type="text" name="tags"
                  className="w-full bg-glass border border-glass-border rounded-xl py-4 px-6 focus:border-primary outline-none"
                  placeholder="ai, chat, gpt4"
                  value={formData.tags} onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wider opacity-60">Key Features (comma separated)</label>
              <input 
                type="text" name="features"
                className="w-full bg-glass border border-glass-border rounded-xl py-4 px-6 focus:border-primary outline-none"
                placeholder="Feature 1, Feature 2, Feature 3"
                value={formData.features} onChange={handleChange}
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full btn-primary py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : <><Sparkles size={20} /> Submit Tool for Verification</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitToolPage;
