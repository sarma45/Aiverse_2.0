import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', zIndex: 0 }}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles color="white" size={28} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white">AIVERSE</h1>
          </Link>
          <h2 className="text-4xl font-extrabold mb-2">Welcome Back</h2>
          <p className="text-text-muted">Enter your credentials to access the hub.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-morphism p-8 md:p-10 rounded-[2.5rem] border border-glass-border space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-text-muted ml-2">EMAIL ADDRESS</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="email"
                required
                placeholder="name@company.com"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-12 py-4 outline-none focus:border-primary/50 transition-all text-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-2">
              <label className="text-sm font-bold text-text-muted">PASSWORD</label>
              <a href="#" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Forgot Password?</a>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-12 py-4 outline-none focus:border-primary/50 transition-all text-white"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-4 rounded-2xl text-lg font-bold group"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Sign In <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </>
            )}
          </button>

          <p className="text-center text-text-muted text-sm font-medium pt-4">
            New to Aiverse?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </form>

        <div className="mt-8 flex items-center gap-4">
           <div className="h-px bg-white/5 flex-1"></div>
           <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Or Continue With</p>
           <div className="h-px bg-white/5 flex-1"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
           <button className="glass-morphism py-3 rounded-xl text-xs font-bold hover:bg-white/5 transition-colors">GOOGLE</button>
           <button className="glass-morphism py-3 rounded-xl text-xs font-bold hover:bg-white/5 transition-colors">GITHUB</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
