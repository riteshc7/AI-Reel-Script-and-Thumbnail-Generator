import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Lock, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-surface)' }}>
      <button
        onClick={toggle}
        className="fixed top-4 right-4 p-2.5 rounded-xl transition-all active:scale-90 z-10"
        style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 mb-4 shadow-lg animate-float">
            <span className="text-2xl font-bold text-white">AR</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>AI Reel Studio</h1>
          <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>Sign in to your creator dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5 animate-slide-up">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 pr-10"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors active:scale-90"
                style={{ color: 'var(--color-text-muted)' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading && <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
