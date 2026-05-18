import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Terminal } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError('');
    try {
      await login(email, password);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Authentication sequence failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark bg-[radial-gradient(circle_at_50%_50%,rgba(53,168,242,0.1),transparent_50%)] px-4">
      <div className="max-w-md w-full">
        {/* LOGO AREA */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4 shadow-[0_0_20px_rgba(53,168,242,0.2)]">
            <Shield className="text-primary" size={32} />
          </div>
          <h1 className="font-bebas text-4xl tracking-tight text-white mb-2">
            ADMIN <span className="text-primary">ACCESS</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2">
            <Terminal size={14} className="text-primary" />
            Secure Protocol Connection
          </p>
        </div>

        {/* FORM */}
        <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 ml-1">
                Organization Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="admin@smashstudio.in"
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 ml-1">
                Access Credentials
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 bottom-3 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {localError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                {localError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-dark font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(53,168,242,0.3)] hover:shadow-[0_0_30px_rgba(53,168,242,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin"></span>
              ) : (
                <>Connect System</>
              )}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-slate-600 text-xs uppercase tracking-tighter">
            Authorized Personnel Only — IP Logging Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
