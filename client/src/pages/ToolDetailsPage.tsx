import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config';
import { ArrowLeft, Star, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';

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

const ToolDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState<Tool | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [toolRes, reviewsRes] = await Promise.all([
          axios.get(`${API_BASE}/tools/${id}`),
          axios.get(`${API_BASE}/reviews/tool/${id}`)
        ]);
        const toolData = toolRes.data.data.tool;
        setTool(toolData);
        setReviews(reviewsRes.data.data.reviews);
        
        // Dynamic SEO Update
        document.title = `${toolData.name} - AIVerse Intelligence`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', `${toolData.description.substring(0, 160)}... Review, features, and alternatives for ${toolData.name}.`);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'description';
          meta.content = `${toolData.description.substring(0, 160)}...`;
          document.head.appendChild(meta);
        }
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
    if (!token) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/reviews`, {
        tool: id,
        ...newReview
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh reviews
      const reviewsRes = await axios.get(`${API_BASE}/reviews/tool/${id}`);
      setReviews(reviewsRes.data.data.reviews);
      setNewReview({ rating: 5, comment: '' });
      alert('Review submitted!');
    } catch (err) {
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Loading...</div>;
  if (!tool) return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Tool not found</div>;

  return (
    <div className="min-h-screen bg-dark py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-white mb-10 transition-colors">
          <ArrowLeft size={20} /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="md:col-span-2">
            <div className="glass-morphism p-10 rounded-[3rem] mb-12">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-5xl font-black">{tool.name}</h1>
                {tool.isVerified && <ShieldCheck className="text-primary" size={32} />}
              </div>
              <p className="text-xl text-text-muted leading-relaxed mb-8">{tool.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                {tool.features.map((f, i) => (
                  <span key={i} className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm">
                    {f}
                  </span>
                ))}
              </div>

              <a 
                href={tool.url} target="_blank" rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
              >
                Visit Website <ExternalLink size={20} />
              </a>
            </div>

            {/* Reviews Section */}
            <div className="glass-morphism p-10 rounded-[3rem]">
              <h3 className="text-3xl font-black mb-10 flex items-center gap-3">
                <MessageSquare className="text-primary" /> Community Reviews
              </h3>

              <div className="space-y-8">
                {reviews.length > 0 ? reviews.map((rev) => (
                  <div key={rev._id} className="border-b border-glass-border pb-8 last:border-0">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-lg">{rev.user.name}</span>
                      <div className="flex gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < rev.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-text-muted leading-relaxed">{rev.comment}</p>
                    <span className="text-xs opacity-40 mt-4 block">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                )) : <p className="text-text-muted">No reviews yet. Be the first to share your experience!</p>}
              </div>
            </div>
          </div>

          {/* Sidebar: Submit Review */}
          <div className="md:col-span-1">
            <div className="glass-morphism p-8 rounded-[2rem] sticky top-24">
              <h4 className="text-2xl font-bold mb-6">Rate this Tool</h4>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase opacity-60">Rating</label>
                  <select 
                    className="w-full bg-glass border border-glass-border rounded-xl py-3 px-4 outline-none focus:border-primary"
                    value={newReview.rating}
                    onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                  >
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase opacity-60">Your Review</label>
                  <textarea 
                    rows={4} required
                    className="w-full bg-glass border border-glass-border rounded-xl py-3 px-4 outline-none focus:border-primary resize-none"
                    placeholder="Tell us what you think..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  disabled={submitting}
                  className="w-full btn-primary py-4 rounded-xl font-bold disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailsPage;
