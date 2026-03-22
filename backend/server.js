const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Guard critical env vars at startup
if (!process.env.JWT_SECRET) throw new Error('FATAL: JWT_SECRET is not set in .env');
if (!process.env.GROQ_API_KEY) console.warn('WARNING: GROQ_API_KEY is not set — AI features will fail');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow requests from the Vite dev server and any localhost port
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'https://smart-learning-planner-psi.vercel.app',
    /\.vercel\.app$/,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(helmet({ contentSecurityPolicy: false })); // CSP off — API only, no HTML served
app.use(express.json({ limit: '10kb' })); // Reject oversized payloads

// Rate limiting — protect AI endpoints from abuse
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: 'Too many requests, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/resources', aiLimiter);

// ── Connect to MongoDB Atlas ──────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/exams',     require('./routes/exams'));
app.use('/api/subjects',  require('./routes/subjects'));
app.use('/api/smartplan', require('./routes/smartPlan'));
app.use('/api/resources', require('./routes/resources'));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.status(200).json({
    status: 'ok',
    db: states[mongoose.connection.readyState] || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ message: 'Internal server error.' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 MongoDB URI: ${process.env.MONGO_URI ? '✅ loaded' : '❌ missing'}`);
  });
}

module.exports = app;
