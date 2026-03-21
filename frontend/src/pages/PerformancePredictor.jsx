import React, { useState, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, Button, Slider,
  Alert, Chip, LinearProgress, Grid,
} from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";

const C = { primary: "#0F766E", secondary: "#06B6D4" };

const STATUS_CONFIG = {
  "On Track":         { color: "#10B981", bg: "#D1FAE5", icon: <TrendingUpIcon />,   emoji: "✅" },
  "At Risk":          { color: "#F59E0B", bg: "#FEF3C7", icon: <TrendingFlatIcon />, emoji: "⚠️" },
  "Needs Attention":  { color: "#EF4444", bg: "#FEE2E2", icon: <TrendingDownIcon />, emoji: "🚨" },
};

const ML_URL = import.meta.env.VITE_ML_URL || "http://localhost:5002";

export default function PerformancePredictor({ userId }) {
  const [scores, setScores] = useState([0.6, 0.62, 0.58, 0.65, 0.60, 0.63, 0.67]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usingRealData, setUsingRealData] = useState(false);
  const [realDates, setRealDates] = useState([]);

  // Load real daily scores from localStorage on mount
  useEffect(() => {
    if (!userId) return;
    const key = `dailyScores_${userId}`;
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (saved.length >= 2) {
      // Use last 7 days, pad with 0.5 if less than 7
      const last7 = saved.slice(-7);
      const padded = Array(7).fill(0.5);
      last7.forEach((entry, i) => {
        padded[7 - last7.length + i] = entry.score;
      });
      setScores(padded);
      setRealDates(last7.map(e => e.date));
      setUsingRealData(true);
    }
  }, [userId]);

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
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError("ML service unavailable. Make sure the Flask server is running.");
    } finally {
      setLoading(false);
    }
  };

  const status = result ? STATUS_CONFIG[result.status] : null;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <PsychologyIcon sx={{ fontSize: 36, color: C.primary }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: C.primary }}>
            LSTM Performance Predictor
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Deep Learning Unit III — Sequence Modeling with LSTM
          </Typography>
        </Box>
      </Box>

      <Alert severity={usingRealData ? "success" : "info"} sx={{ mb: 3, borderRadius: 2 }}>
        {usingRealData
          ? <><strong>✅ Using your real study data</strong> — scores are automatically pulled from your Study Planner activity. The LSTM analyzes your actual performance pattern.</>
          : <><strong>How it works:</strong> Complete topics in the Study Planner daily — your scores are saved automatically. The LSTM model then predicts your next day performance. Currently showing <strong>demo data</strong> (no study history yet).</>
        }
        {" "}LSTM solves the <strong>vanishing gradient problem</strong> of vanilla RNNs using forget, input, and output gates.
      </Alert>

      <Card sx={{ mb: 3, borderRadius: 3, border: "1px solid #E2E8F0" }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: C.primary }}>
            📅 Last 7 Days — Study Performance Scores
            {usingRealData && <Chip label="Live Data" size="small" sx={{ ml: 1, background: "#D1FAE5", color: "#065F46", fontWeight: 700 }} />}
          </Typography>
          <Grid container spacing={3}>
            {scores.map((score, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Box sx={{ px: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Day {i + 1}</Typography>
                    <Chip
                      label={`${Math.round(score * 100)}%`}
                      size="small"
                      sx={{
                        background: score >= 0.7 ? "#D1FAE5" : score >= 0.4 ? "#FEF3C7" : "#FEE2E2",
                        color: score >= 0.7 ? "#065F46" : score >= 0.4 ? "#92400E" : "#991B1B",
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  <Slider
                    value={score}
                    min={0} max={1} step={0.05}
                    onChange={(_, v) => setScores(prev => prev.map((s, idx) => idx === i ? v : s))}
                    sx={{ color: score >= 0.7 ? "#10B981" : score >= 0.4 ? "#F59E0B" : "#EF4444" }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Visual trend bar */}
          <Box sx={{ mt: 3, p: 2, background: "#F8FAFC", borderRadius: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748B", mb: 1, display: "block" }}>
              Performance Trend (last 7 days)
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "flex-end", height: 60 }}>
              {scores.map((s, i) => (
                <Box key={i} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                  <Box sx={{
                    width: "100%",
                    height: `${s * 50}px`,
                    background: s >= 0.7 ? "#10B981" : s >= 0.4 ? "#F59E0B" : "#EF4444",
                    borderRadius: "4px 4px 0 0",
                    minHeight: 4,
                  }} />
                  <Typography variant="caption" sx={{ fontSize: "0.6rem", color: "#94A3B8" }}>D{i + 1}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Button
            fullWidth variant="contained" onClick={predict} disabled={loading}
            sx={{ mt: 3, background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, borderRadius: 2, fontWeight: 700, py: 1.5 }}
          >
            {loading ? "🧠 LSTM Predicting..." : "🔮 Predict Next Day Performance"}
          </Button>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {result && status && (
        <Card sx={{ borderRadius: 3, border: `2px solid ${status.color}`, background: status.bg }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              {status.icon}
              <Typography variant="h5" sx={{ fontWeight: 700, color: status.color }}>
                {status.emoji} {result.status}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: "center", p: 2, background: "#fff", borderRadius: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: status.color }}>
                    {result.predicted_percentage}%
                  </Typography>
                  <Typography variant="caption" color="textSecondary">Predicted Day 8 Score</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: "center", p: 2, background: "#fff", borderRadius: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: result.trend >= 0 ? "#10B981" : "#EF4444" }}>
                    {result.trend >= 0 ? "+" : ""}{(result.trend * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="caption" color="textSecondary">7-Day Trend</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, background: "#fff", borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                    💡 {result.message}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, p: 2, background: "#fff", borderRadius: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", display: "block", mb: 1 }}>
                LSTM Model Info
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {result.model_info?.architecture} | {result.model_info?.why_lstm}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
