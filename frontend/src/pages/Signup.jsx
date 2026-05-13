import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 mb-4 shadow-lg animate-float">
            <span className="text-2xl font-bold text-white">AR</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Create Account</h1>
          <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>Start creating viral content</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5 animate-slide-up">
          <div>
            <label htmlFor="signup-name" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
              <input id="signup-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-10" placeholder="Your name" required />
            </div>
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
              <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@example.com" autoComplete="email" required />
            </div>
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
              <input id="signup-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10 pr-10" placeholder="Min 6 characters" autoComplete="new-password" minLength={6} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading && <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
