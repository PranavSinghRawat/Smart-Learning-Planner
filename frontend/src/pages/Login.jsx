import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep]         = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    if (!username.trim()) return setError('Enter a username or email');
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return setError('Enter your password');
    setError(''); setLoading(true);
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Wrong password. Try again.');
      onLoginSuccess(data.user, data.token);
      navigate('/');
    } catch {
      setError('Could not connect. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0fdfa]">

      {/* Card */}
      <div className="w-full max-w-[400px] mx-4">
        <div className="bg-white rounded-[28px] px-10 py-10 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_24px_rgba(15,118,110,0.10)] border border-teal-100">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0F766E, #0891b2)' }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-1">Sign in</h1>
            <p className="text-sm text-slate-500">to continue to <span className="font-medium text-slate-700">StudyPlanner AI</span></p>
          </div>

          {/* Step 1 — username */}
          {step === 1 && (
            <form onSubmit={handleNext} noValidate>
              <div className="mb-5">
                <FloatField
                  id="username" label="Username or email"
                  value={username} onChange={e => { setUsername(e.target.value); setError(''); }}
                  error={error} autoFocus autoComplete="username"
                />
              </div>

              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Not your device?{' '}
                <span className="text-teal-600 cursor-pointer hover:underline">Use a private window</span>{' '}
                to sign in.
              </p>

              <div className="flex items-center justify-between">
                <Link to="/register"
                  className="text-sm font-medium text-teal-600 hover:bg-teal-50 px-3 py-2 rounded-lg transition-colors">
                  Create account
                </Link>
                <button type="submit"
                  className="h-9 px-6 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #0F766E, #0891b2)' }}>
                  Next
                </button>
              </div>
            </form>
          )}

          {/* Step 2 — password */}
          {step === 2 && (
            <form onSubmit={handleSubmit} noValidate>
              {/* Username chip */}
              <button type="button" onClick={() => { setStep(1); setError(''); }}
                className="flex items-center gap-2.5 border border-slate-200 rounded-full px-3 py-1.5 mb-6 hover:bg-slate-50 transition-colors w-auto">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0F766E, #0891b2)' }}>
                  {username[0]?.toUpperCase()}
                </div>
                <span className="text-sm text-slate-700 font-medium">{username}</span>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="mb-2">
                <FloatField
                  id="password" label="Enter your password"
                  type={showPass ? 'text' : 'password'}
                  value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                  error={error} autoFocus autoComplete="current-password"
                  suffix={
                    <button type="button" onClick={() => setShowPass(v => !v)}
                      className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  }
                />
              </div>

              <a href="#" className="text-sm text-teal-600 hover:underline block mb-6">Forgot password?</a>

              <div className="flex items-center justify-between">
                <Link to="/register"
                  className="text-sm font-medium text-teal-600 hover:bg-teal-50 px-3 py-2 rounded-lg transition-colors">
                  Create account
                </Link>
                <button type="submit" disabled={loading}
                  className="h-9 px-6 rounded-lg text-sm font-semibold text-white flex items-center gap-2 transition-all hover:opacity-90 hover:shadow-md active:scale-[0.98] disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #0F766E, #0891b2)' }}>
                  {loading ? <><Loader2 size={14} className="animate-spin" /> Signing in...</> : 'Next'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5 px-1">
          <select className="text-xs text-slate-400 bg-transparent border-none outline-none cursor-pointer">
            <option>English (United States)</option>
          </select>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-slate-400 hover:text-slate-600 hover:underline">Help</a>
            <a href="#" className="text-xs text-slate-400 hover:text-slate-600 hover:underline">Privacy</a>
            <a href="#" className="text-xs text-slate-400 hover:text-slate-600 hover:underline">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatField({ id, label, type = 'text', value, onChange, error, suffix, autoComplete, autoFocus }) {
  return (
    <div>
      <div className={`relative border rounded-xl transition-all ${
        error
          ? 'border-red-400 focus-within:border-red-500'
          : 'border-slate-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/15'
      }`}>
        <input
          id={id} type={type} autoComplete={autoComplete} autoFocus={autoFocus}
          value={value} onChange={onChange} placeholder=" "
          className={`w-full h-14 px-4 pt-5 pb-1 ${suffix ? 'pr-12' : ''} text-sm text-slate-800 bg-transparent outline-none peer`}
        />
        <label htmlFor={id}
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none transition-all duration-150
            peer-focus:top-[14px] peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-teal-600
            peer-[:not(:placeholder-shown)]:top-[14px] peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-medium
            ${error ? 'text-red-400' : 'text-slate-400'}`}>
          {label}
        </label>
        {suffix && <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5 ml-1">{error}</p>}
    </div>
  );
}
