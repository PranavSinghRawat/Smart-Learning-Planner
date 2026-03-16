import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-8 font-sans selection:bg-terracotta-500/30">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg"
      >
        {/* Brand Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5 mb-8"
          >
            <ShieldCheck size={16} className="text-terracotta-500" />
            <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Secure Infrastructure</span>
          </motion.div>
          <h1 className="text-6xl font-black text-slate-100 tracking-tighter italic italic">
            Smart<span className="text-terracotta-500 not-italic">Planner</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg font-medium">The Human-Centric Study Engine</p>
        </div>

        <Card padding="p-12">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-100 tracking-tight italic">Welcome <span className="text-terracotta-500 not-italic">Back</span></h2>
            <p className="text-slate-500 mt-2 font-medium">Authentication required to access the engine.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Neural Identifier (Email)"
              type="email"
              placeholder="name@university.edu"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="Secret Key (Password)"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-bold flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </motion.div>
            )}

            <Button 
              type="submit" 
              isLoading={isLoading} 
              className="w-full flex items-center justify-center gap-3"
            >
              Enter Dashboard <ArrowRight size={20} />
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className="text-slate-500 font-medium">
              New to the planner?{' '}
              <Link to="/register" className="text-terracotta-500 font-black hover:text-terracotta-400 transition-colors italic">
                Build your account
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
