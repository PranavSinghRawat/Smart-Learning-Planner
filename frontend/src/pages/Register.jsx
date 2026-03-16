import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

export default function Register({ onLoginSuccess }) {
  const [form, setForm]         = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const navigate = useNavigate();

  const set = k => e => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: '' }));
    setApiError('');
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Enter a username';
    else if (form.username.length < 3) e.username = 'Use 3 or more characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = 'Letters, numbers and underscores only';
    if (!form.email.trim()) e.email = 'Enter an email';
    else if (!/^[(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Enter a password';
    more characters';
d !== form.confirm) e.confirm = "Those passwords didn't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setApiError(''); setLoading(true);
    try {
      const res  = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.sm.email, password: form.password }),
      });
      const dwait res.json();
      if (!res.ok) return setApiError(data.error || 'Something went wrong. Try again.');
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setApiError('Could not connect. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0fdfa]">
        <div class">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, #0F766E20, #0891b220)' }}>
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#0F766E" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Account created</h2>
Name="text-sm text-slate-500">Taking you to sign in...</p>
        </div>
      </div>
    );
  }

n (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0fdfa] py-8">
      <div className="w-full max-w-[440px] mx-4">

        <div className="bg-white rounded-[28px] px-10 py-10 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_24px_rgba(15,118,110,0.10)] border border-teal-100">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              styldient(135deg, #0F766E, #0891b2)' }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h1 classNamxt-2xl font-semibold text-slate-800 mb-1">Create your account</h1>
            <p className="text-sm text-slate-500">to continue to <span className="font-medium text-slate-700">StudyPlanner AI</span></p>
          </div>

          {apiError && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
 onChange={set('username')}
                error={errors.username} autoComplete="username" autoFocus />
              <FloatField id="email" label="Email" type="email" value={form.email} onChange={set('email')}
                error={errors.email} autoComplete="email" />
            </div>

            <div>
              <FloatField id="password" label="Password" type={showPass ? 'text' : 'password'}
                value={form.password} onChange={set('password')} error={errors.password}
                autoComplete="new-password"
                suffix={
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                }
              />
              {!errors.password && <p className="text-xs text-slate-400 mt-1.5 ml-1">Use 6 or more characters</p>}
            </div>

            <FloatField id="confirm" label="Confirm password" type={showConf ? 'text' : 'password'}
              value={form.confirm} onChange={set('confirm')} error={errors.confirm}
              autoComplete="new-password"
              suffix={
                <button type="button" onClick={() => setShowConf(v => !v)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                  {showConf ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />

            <div className="flex items-center justify-between pt-2">
              <Link to="/login"
                className="text-sm font-medium text-teal-600 hover:bg-teal-50 px-3 py-2 rounded-lg transition-colors">
                Sign in instead
              </Link>
              <button type="submit" disabled={loading}
                className="h-9 px-6 rounded-lg text-sm font-semibold text-white flex items-center gap-2 transition-all hover:opacity-90 hover:shadow-md active:scale-[0.98] disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #0F766E, #0891b2)' }}>
                {loading ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : 'Next'}
              </button>
            </div>
          </form>
        </div>

    ify-between mt-5 px-1">
          <select className="text-xs text-slate-400 bg-transparent border-none outline-none cursor-pointer">
            <option>English (United States)</option>
          </select>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-slate-400 hover:text-slate-600 hover:underline">Help</a>
            <a href="#" className="text-xs text-slate-400 hover:text-slate-600 hover:underline">Privacy</a>
            <a400 hover:text-slate-600 hover:underline">Terms</a>
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
r-focus:text-teal-600
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
            peer-focus:top-[14px] peer-focus:text-[11px] peer-focus:font-medium pee