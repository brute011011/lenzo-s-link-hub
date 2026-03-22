import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError('Invalid credentials. Access denied.');
    } else {
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F5F5F7' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="safari-clean-glass w-full max-w-md p-8 relative z-10"
      >
        <div className="surface-sheen" />
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(0,122,255,0.1)' }}>
              <Lock className="h-8 w-8" style={{ color: '#007AFF' }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#1D1D1F' }}>Admin Access</h1>
            <p className="text-sm mt-1" style={{ color: '#86868B' }}>Lenzo Beam Central Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-2xl p-3 text-sm" style={{ background: 'rgba(255,59,48,0.08)', color: '#FF3B30', border: '1px solid rgba(255,59,48,0.15)' }}>
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: '#1D1D1F' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#86868B' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-full pl-10 pr-4 py-2.5 text-sm outline-none transition-colors"
                  style={{ background: 'rgba(0,0,0,0.04)', color: '#1D1D1F', border: '1px solid rgba(0,0,0,0.06)' }}
                  placeholder="admin@lenzo.dev"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: '#1D1D1F' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#86868B' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-full pl-10 pr-4 py-2.5 text-sm outline-none transition-colors"
                  style={{ background: 'rgba(0,0,0,0.04)', color: '#1D1D1F', border: '1px solid rgba(0,0,0,0.06)' }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full pill-btn py-2.5 font-bold text-white disabled:opacity-50"
              style={{ background: '#007AFF' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
