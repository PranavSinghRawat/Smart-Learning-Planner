import React, { useState, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, Button, Slider,
  Alert, Chip, Grid, CircularProgress, Divider, Paper, useTheme
} from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import RefreshIcon from "@mui/icons-material/Refresh";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import StorageIcon from "@mui/icons-material/Storage";
import ScienceIcon from "@mui/icons-material/Science";
import HubIcon from "@mui/icons-material/Hub";
import { motion, AnimatePresence } from "framer-motion";

const ML_URL = import.meta.env.VITE_ML_URL || "http://localhost:5002";
const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const STATUS_CONFIG = {
  "On Track":        { color: "#10B981", bg: "rgba(16, 185, 129, 0.05)", border: "rgba(16, 185, 129, 0.2)", icon: <TrendingUpIcon /> },
  "At Risk":         { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.05)", border: "rgba(245, 158, 11, 0.2)", icon: <TrendingFlatIcon /> },
  "Needs Attention": { color: "#EF4444", bg: "rgba(239, 68, 68, 0.05)",  border: "rgba(239, 68, 68, 0.2)", icon: <TrendingDownIcon /> },
};

export default function PerformancePredictor({ userId, token }) {
  const [scores, setScores] = useState([0.55, 0.58, 0.60, 0.62, 0.61, 0.64, 0.67]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataSource, setDataSource] = useState("demo");
  const [loadingData, setLoadingData] = useState(true);
  const [realScoreCount, setRealScoreCount] = useState(0);
  const theme = useTheme();

  useEffect(() => { loadScores(); }, [userId, token]);

  const loadScores = async () => {
    setLoadingData(true);
    setResult(null);
    setError("");
    if (userId) {
      const saved = JSON.parse(localStorage.getItem(`dailyScores_${userId}`) || "[]");
      if (saved.length >= 7) {
        setScores(saved.slice(-7).map(e => e.score));
        setDataSource("real");
        setRealScoreCount(saved.length);
        setLoadingData(false);
        return;
      }
    }
    setDataSource("demo");
    setLoadingData(false);
  };

  const predict = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${ML_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scores }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Prediction failed");
      setResult(data);
    } catch (e) {
      setError(e.message.includes("fetch") ? "ML Analytics Offline. Connect to PyTorch core." : e.message);
    } finally {
      setLoading(false);
    }
  };

  const status = result ? STATUS_CONFIG[result.status] : null;

  return (
    <Box className="animate-slide-up">
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PageHeader 
          icon={<AutoGraphIcon />}
          title="Predictive Analytics"
          subtitle="LSTM Neural Network processing your study throughput"
        />
        <Chip 
          icon={<HubIcon />} 
          label={`Model: LSTM-v2 (${scores.length} Sequence)`} 
          sx={{ fontWeight: 800, bgcolor: 'rgba(15, 118, 110, 0.1)', color: 'primary.main', border: '1px solid rgba(15, 118, 110, 0.2)' }}
        />
      </Box>

      {/* Lab Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { icon: <StorageIcon />, title: "Data Ingestion", desc: "Automated sync from Study Planner history", color: "primary.main" },
          { icon: <ScienceIcon />, title: "Tensor Processing", desc: "Backpropagation through 7-day time series", color: "#6366f1" },
          { icon: <PsychologyIcon />, title: "Inference Engine", desc: "LSTM gate analysis for Day 8 projection", color: "#0ea5e9" },
        ].map((item, idx) => (
          <Grid item xs={12} md={4} key={idx}>
            <Box className="glass-card" component={motion.div} whileHover={{ scale: 1.02 }} sx={{
              p: 3, borderRadius: 5, display: 'flex', gap: 2, alignItems: 'flex-start'
            }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${item.color}10`, color: item.color, display: 'flex' }}>
                {item.icon}
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>{item.title}</Typography>
                <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>{item.desc}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Main Console */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card className="glass-card" sx={{ height: '100%', overflow: 'visible' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TrendingUpIcon color="primary" /> Ingestion Sequence
              </Typography>
              <Button size="small" startIcon={<RefreshIcon />} onClick={loadScores} variant="text" sx={{ fontWeight: 700 }}>
                Reset Tensors
              </Button>
            </Box>
            <CardContent sx={{ p: 4 }}>
              {/* Visual Sequence */}
              <Box sx={{ 
                p: 4, mb: 4, borderRadius: 6, 
                background: 'rgba(15, 118, 110, 0.03)', 
                border: '1px solid rgba(15, 118, 110, 0.1)',
                display: 'flex', gap: 2, alignItems: 'flex-end', height: 160
              }}>
                {scores.map((s, i) => (
                  <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box component={motion.div} initial={{ height: 0 }} animate={{ height: `${s * 100}px` }} sx={{ 
                      width: '100%', borderRadius: '8px 8px 4px 4px',
                      background: 'linear-gradient(180deg, #0f766e 0%, #06b6d4 100%)',
                      boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)'
                    }} />
                    <Typography variant="caption" sx={{ textAlign: 'center', fontWeight: 800, color: 'primary.main', fontSize: '0.65rem' }}>D{i+1}</Typography>
                  </Box>
                ))}
                <Divider orientation="vertical" flexItem sx={{ mx: 1, borderStyle: 'dashed' }} />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, opacity: result ? 1 : 0.4 }}>
                  <Box component={motion.div} animate={{ height: result ? `${result.predicted_percentage}px` : '40px' }} sx={{ 
                    width: '100%', borderRadius: '8px 8px 4px 4px',
                    bgcolor: result ? status.color : '#cbd5e1',
                    border: '2px dashed rgba(0,0,0,0.1)'
                  }} />
                  <Typography variant="caption" sx={{ textAlign: 'center', fontWeight: 900, color: result ? status.color : '#94a3b8', fontSize: '0.65rem' }}>P8</Typography>
                </Box>
              </Box>

              <Typography variant="overline" sx={{ fontWeight: 800, mb: 2, display: 'block', color: 'text.secondary' }}>Sequence Manipulation</Typography>
              <Grid container spacing={2}>
                {scores.map((score, i) => (
                  <Grid item xs={6} sm={4} key={i}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.4)', borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>D{i+1}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main' }}>{Math.round(score * 100)}%</Typography>
                      </Box>
                      <Slider 
                        size="small" value={score} min={0} max={1} step={0.05} 
                        onChange={(_, v) => { setScores(prev => prev.map((s, idx) => idx === i ? v : s)); setResult(null); }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Button
                fullWidth variant="contained" size="large" onClick={predict} disabled={loading}
                sx={{ mt: 4, py: 2, borderRadius: 4, fontWeight: 800, letterSpacing: 1 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "EXECUTE INFERENCE"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <AnimatePresence mode="wait">
            {!result ? (
              <Box component={motion.div} key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} sx={{ height: '100%' }}>
                <Paper className="glass-panel" sx={{ p: 6, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: 6 }}>
                  <Box sx={{ fontSize: '4rem', mb: 2 }}>🌀</Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Neural Void</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Standard weight matrices initialized. Awaiting sequence throughput for LSTM gate activation.
                  </Typography>
                </Paper>
              </Box>
            ) : (
              <Box component={motion.div} key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Status Result Card */}
                <Card sx={{ borderRadius: 6, bgcolor: status.bg, border: `2px solid ${status.border}`, p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#fff', color: status.color, boxShadow: `0 8px 16px ${status.color}20` }}>
                      {status.icon}
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: status.color }}>{result.status}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Confidence Metric: Optimized</Typography>
                    </Box>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>PROJECTION</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b' }}>{result.predicted_percentage}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>VELOCITY</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: result.trend >= 0 ? '#10b981' : '#ef4444' }}>
                        {result.trend >= 0 ? '+' : ''}{(result.trend * 100).toFixed(1)}%
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 3, opacity: 0.1 }} />
                  <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.8, fontWeight: 500 }}>
                    "{result.message}"
                  </Typography>
                </Card>

                {/* Technical Specs Bento */}
                <Card className="glass-card" sx={{ bgcolor: '#1e293b', color: '#fff', p: 0 }}>
                  <Box sx={{ p: 2, px: 3, background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', fontFamily: 'monospace' }}>MODEL_SPECS.LOG</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444' }} />
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                    </Box>
                  </Box>
                  <Box sx={{ p: 3, fontFamily: 'monospace' }}>
                    <Typography variant="caption" sx={{ color: '#0ea5e9', display: 'block', mb: 1 }}>{result.model_info?.architecture}</Typography>
                    <Grid container spacing={2}>
                      {Object.entries(result.model_info?.gates || {}).map(([g, eq]) => (
                        <Grid item xs={12} key={g}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', minWidth: 60, fontWeight: 800 }}>{g.toUpperCase()}:</Typography>
                            <Typography variant="caption" sx={{ color: '#cbd5e1', fontSize: '0.65rem' }}>{eq}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.05)' }} />
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                      <Chip size="small" label={`PARAMS: ${result.model_info?.trainable_params?.toLocaleString()}`} sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.6rem', fontWeight: 700 }} />
                      <Chip size="small" label={`R²: ${result.model_info?.metrics?.r2?.toFixed(4)}`} sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontSize: '0.6rem', fontWeight: 700 }} />
                    </Box>
                  </Box>
                </Card>
              </Box>
            )}
          </AnimatePresence>
        </Grid>
      </Grid>
    </Box>
  );
}

function PageHeader({ icon, title, subtitle }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
      <Box sx={{
        width: 60, height: 60, borderRadius: 4,
        background: "rgba(15, 118, 110, 0.1)",
        color: "primary.main",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "2rem", flexShrink: 0,
        boxShadow: "0 8px 16px rgba(15, 118, 110, 0.1)"
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -1, color: "#0f172a" }}>{title}</Typography>
        <Typography variant="subtitle1" sx={{ color: "#64748b", fontWeight: 500, mt: 0.5 }}>{subtitle}</Typography>
      </Box>
    </Box>
  );
}
