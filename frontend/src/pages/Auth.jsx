import React, { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Container, Tab, Tabs, Alert, InputAdornment, IconButton, Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PsychologyIcon from "@mui/icons-material/Psychology";
import BarChartIcon from "@mui/icons-material/BarChart";
import LockIcon from "@mui/icons-material/Lock";

const API_URL = import.meta.env.VITE_API_URL;
const C = { primary: '#0F766E', secondary: '#06B6D4' };

function Auth({ onLoginSuccess }) {
  const [tab, setTab] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validateUsername = (u) => u.length >= 3 && /^[a-zA-Z0-9_]+$/.test(u);
  const validatePassword = (p) => p.length >= 6;

  const validateRegisterForm = () => {
    const e = {};
    if (!username.trim()) e.username = 'Username is required';
    else if (!validateUsername(username)) e.username = 'Min 3 chars, alphanumeric only';
    if (!email.trim()) e.email = 'Email is required';
    else if (!validateEmail(email)) e.email = 'Enter a valid email';
    if (!password.trim()) e.password = 'Password is required';
    else if (!validatePassword(password)) e.password = 'Min 6 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateLoginForm = () => {
    const e = {};
    if (!username.trim()) e.username = 'Username is required';
    if (!password.trim()) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed'); return; }
      setSuccess('Account created! Switching to login...');
      setUsername(''); setEmail(''); setPassword(''); setConfirmPassword(''); setErrors({});
      setTimeout(() => { setTab(0); setSuccess(''); }, 1800);
    } catch {
      setError('Network error. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLoginSuccess();
    } catch {
      setError('Network error. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_, value) => {
    setTab(value); setError(''); setSuccess(''); setErrors({});
    setUsername(''); setEmail(''); setPassword(''); setConfirmPassword('');
  };

  const inputSx = {
    mb: 2.5,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      background: '#F8FAFC',
      '&:hover fieldset': { borderColor: C.primary },
      '&.Mui-focused fieldset': { borderColor: C.primary },
    },
    '& label.Mui-focused': { color: C.primary },
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      background: '#080D1A',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background orbs — matches landing page */}
      <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <Box sx={{
          position: 'absolute', top: '-10%', left: '-5%',
          width: 600, height: 600, borderRadius: '50%',
          background: `radial-gradient(circle, ${C.primary}20 0%, transparent 70%)`,
        }} />
        <Box sx={{
          position: 'absolute', bottom: '-10%', right: '-5%',
          width: 500, height: 500, borderRadius: '50%',
          background: `radial-gradient(circle, ${C.secondary}18 0%, transparent 70%)`,
        }} />
      </Box>

      {/* Left panel — branding (hidden on mobile) */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        px: 8,
        position: 'relative', zIndex: 1,
      }}>
        <Typography variant="h3" sx={{
          fontWeight: 900, color: '#fff', mb: 2, lineHeight: 1.2,
          fontSize: '2.8rem',
        }}>
          Smart Learning Planner
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 4, lineHeight: 1.8, maxWidth: 340 }}>
          AI-powered study plans, LSTM performance prediction, and hour-by-hour daily strategies.
        </Typography>
        {[
          { icon: <SmartToyIcon sx={{ fontSize: 18, color: C.primary }} />, text: 'Groq LLaMA 3.3 study plans' },
          { icon: <PsychologyIcon sx={{ fontSize: 18, color: C.primary }} />, text: 'LSTM neural network predictor' },
          { icon: <BarChartIcon sx={{ fontSize: 18, color: C.primary }} />, text: 'Real-time progress analytics' },
        ].map(f => (
          <Box key={f.text} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: 2,
              background: `${C.primary}25`, border: `1px solid ${C.primary}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{f.icon}</Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{f.text}</Typography>
          </Box>
        ))}
      </Box>

      {/* Right panel — form */}
      <Box sx={{
        flex: { xs: 1, md: '0 0 460px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, md: 0 },
        pr: { md: 6 },
        position: 'relative', zIndex: 1,
      }}>
        <Card sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 4,
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
          background: '#fff',
          overflow: 'hidden',
        }}>
          {/* Card top accent */}
          <Box sx={{ height: 4, background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})` }} />

          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            {/* Mobile logo */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{
                fontWeight: 800,
                background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Smart Learning Planner
              </Typography>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.5 }}>
              {tab === 0 ? 'Welcome back' : 'Create account'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
              {tab === 0 ? 'Sign in to continue your learning journey' : 'Start your AI-powered learning journey'}
            </Typography>

            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                mb: 3,
                background: '#F1F5F9',
                borderRadius: 2,
                p: 0.5,
                minHeight: 40,
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTab-root': {
                  minHeight: 36, borderRadius: 1.5, fontWeight: 600,
                  fontSize: '0.85rem', textTransform: 'none', color: '#64748B',
                  transition: 'all 0.2s',
                },
                '& .Mui-selected': {
                  color: `${C.primary} !important`,
                  background: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.85rem' }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.85rem' }}>
                {success}
              </Alert>
            )}

            {tab === 0 ? (
              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth label="Username" value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!errors.username} helperText={errors.username}
                  placeholder="Enter your username"
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: '#94A3B8', fontSize: 20 }} /></InputAdornment> }}
                  sx={inputSx}
                />
                <TextField
                  fullWidth label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password} helperText={errors.password}
                  placeholder="Enter your password"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#94A3B8', fontSize: 20 }} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <Visibility sx={{ fontSize: 18 }} /> : <VisibilityOff sx={{ fontSize: 18 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ ...inputSx, mb: 3 }}
                />
                <Button
                  fullWidth variant="contained" type="submit" disabled={loading}
                  sx={{
                    background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                    fontWeight: 700, py: 1.5, fontSize: '0.95rem', borderRadius: 2,
                    textTransform: 'none', boxShadow: `0 4px 16px ${C.primary}40`,
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-1px)', boxShadow: `0 8px 24px ${C.primary}50` },
                    '&:disabled': { opacity: 0.7 },
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <TextField
                  fullWidth label="Username" value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!errors.username} helperText={errors.username || 'Min 3 chars, alphanumeric'}
                  placeholder="Choose a username"
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: '#94A3B8', fontSize: 20 }} /></InputAdornment> }}
                  sx={inputSx}
                />
                <TextField
                  fullWidth label="Email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email} helperText={errors.email}
                  placeholder="your@email.com"
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: '#94A3B8', fontSize: 20 }} /></InputAdornment> }}
                  sx={inputSx}
                />
                <TextField
                  fullWidth label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password} helperText={errors.password || 'Min 6 characters'}
                  placeholder="Create a password"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#94A3B8', fontSize: 20 }} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <Visibility sx={{ fontSize: 18 }} /> : <VisibilityOff sx={{ fontSize: 18 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
                <TextField
                  fullWidth label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!errors.confirmPassword} helperText={errors.confirmPassword}
                  placeholder="Confirm your password"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#94A3B8', fontSize: 20 }} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                          {showConfirmPassword ? <Visibility sx={{ fontSize: 18 }} /> : <VisibilityOff sx={{ fontSize: 18 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ ...inputSx, mb: 3 }}
                />
                <Button
                  fullWidth variant="contained" type="submit" disabled={loading}
                  sx={{
                    background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                    fontWeight: 700, py: 1.5, fontSize: '0.95rem', borderRadius: 2,
                    textTransform: 'none', boxShadow: `0 4px 16px ${C.primary}40`,
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-1px)', boxShadow: `0 8px 24px ${C.primary}50` },
                    '&:disabled': { opacity: 0.7 },
                  }}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            )}

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" sx={{ color: '#94A3B8', px: 1 }}>
                Secured with JWT
              </Typography>
            </Divider>

            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#94A3B8' }}>
              {tab === 0 ? "Don't have an account? " : 'Already have an account? '}
              <Box
                component="span"
                onClick={() => handleTabChange(null, tab === 0 ? 1 : 0)}
                sx={{ color: C.primary, fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              >
                {tab === 0 ? 'Register here' : 'Sign in'}
              </Box>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Auth;
