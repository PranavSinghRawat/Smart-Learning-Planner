import React, { useState, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, Button, Slider,
  Alert, Chip, Grid, CircularProgress, Divider,
} from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import RefreshIcon from "@mui/icons-material/Refresh";

const C = { primary: "#0F766E", secondary: "#06B6D4" };
const ML_URL = import.meta.env.VITE_ML_URL || "http://localhost:5002";
const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const STATUS_CONFIG = {
  "On Track":        { color: "#10B981", bg: "#D1FAE5", icon: <TrendingUpIcon />,   emoji: "✅" },
  "At Risk":         { color: "#F59E0B", bg: "#FEF3C7", icon: <TrendingFlatIcon />, emoji: "⚠️" },
  "Needs Attention": { color: "#EF4444", bg: "#FEE2E2", icon: <TrendingDownIcon />, emoji: "🚨" },
};

function generateSyntheticScores(exams) {
  if (!exams || exams.length === 0) {
    return Array(7).fill(0).map((_, i) =>
      parseFloat((0.55 + i * 0.02 + (Math.random() * 0.06 - 0.03)).toFixed(2))
    );
  }
  const now = new Date();
  const withDays = exams.map(e => ({
    ...e,
    daysLeft: Math.max(0, Math.ceil((new Date(e.examDate) - now) / 86400000)),
  }));
  const urgent = withDays.sort((a, b) => a.daysLeft - b.daysLeft)[0];
  const daysLeft = urgent.daysLeft;
  const weakCount = (urgent.weakTopics || []).length;
  let baseScore, trend;
  if (daysLeft <= 3)       { baseScore = 0.72; trend = -0.04; }
  else if (daysLeft <= 7)  { baseScore = 0.55; trend = 0.04; }
  else if (daysLeft <= 14) { baseScore = 0.50; trend = 0.03; }
  else                     { baseScore = 0.60; trend = 0.01; }
  baseScore = Math.max(0.2, Math.min(0.85, baseScore - weakCount * 0.03));
  return Array(7).fill(0).map((_, i) =>
    parseFloat(Math.max(0.1, Math.min(0.98,
      baseScore + trend * i + (Math.random() * 0.08 - 0.04)
    )).toFixed(2))
  );
}

export default function PerformancePredictor({ userId, token }) {
  const [scores, setScores] = useState([0.55, 0.58, 0.60, 0.62, 0.61, 0.64, 0.67]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataSource, setDataSource] = useState("demo");
  const [examContext, setExamContext] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [realScoreCount, setRealScoreCount] = useState(0);

  useEffect(() => { loadScores(); }, [userId, token]);

  const loadScores = async () => {
    setLoadingData(true);
    setResult(null);
    setError("");

    // 1. Real scores from Study Planner (localStorage)
    if (userId) {
      const key = `dailyScores_${userId}`;
      const saved = JSON.parse(localStorage.getItem(key) || "[]");
      if (saved.length >= 1) {
        const avg = saved.reduce((s, e) => s + e.score, 0) / saved.length;
        const padded = Array(7).fill(parseFloat(avg.toFixed(2)));
        saved.slice(-7).forEach((entry, i) => {
          padded[7 - Math.min(saved.length, 7) + i] = entry.score;
        });
        setScores(padded);
        setDataSource("real");
        setRealScoreCount(saved.length);
        setLoadingData(false);
        return;
      }
    }

    // 2. Synthetic scores from exam data
    if (token) {
      try {
        const res = await fetch(`${API}/exams`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const exams = data.exams || [];
          if (exams.length > 0) {
            const now = new Date();
            const urgent = exams
              .map(e => ({ ...e, daysLeft: Math.max(0, Math.ceil((new Date(e.examDate) - now) / 86400000)) }))
              .sort((a, b) => a.daysLeft - b.daysLeft)[0];
            setExamContext(urgent);
            setScores(generateSyntheticScores(exams));
            setDataSource("synthetic");
            setLoadingData(false);
            return;
          }
        }
      } catch (_) { /* fall through */ }
    }

    // 3. Demo fallback
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
      const msg = e.message || "";
      setError(
        msg.includes("fetch") || msg.includes("Failed") || msg.includes("NetworkError")
          ? "ML service is not running. Start it: cd ml_service && python app.py"
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  const status = result ? STATUS_CONFIG[result.status] : null;

  const sourceChip = {
    real:      { label: `📊 Live Data (${realScoreCount} day${realScoreCount !== 1 ? "s" : ""})`, bg: "#D1FAE5", color: "#065F46" },
    synthetic: { label: "🤖 AI Generated from Exams", bg: "#EFF6FF", color: "#1D4ED8" },
    demo:      { label: "📋 Demo Mode",               bg: "#FEF3C7", color: "#92400E" },
  }[dataSource];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <PsychologyIcon sx={{ fontSize: 36, color: C.primary }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: C.primary }}>
            LSTM Performance Predictor
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Deep Learning Unit III — Sequence Modeling with LSTM Networks
          </Typography>
        </Box>
      </Box>

      {/* How it works */}
      <Card sx={{ mb: 3, borderRadius: 3, background: "#F0F9FF", border: "1px solid #BAE6FD" }}>
        <CardContent sx={{ py: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: C.primary, mb: 1 }}>
            🧠 How This Works
          </Typography>
          <Grid container spacing={2}>
            {[
              { step: "1️⃣", title: "Study Planner", desc: "Complete topics in Study Planner — each day's completion % is saved automatically to feed the LSTM" },
              { step: "2️⃣", title: "LSTM Reads Sequence", desc: "Your 7-day score sequence is analyzed using forget/input/output gates to capture temporal patterns" },
              { step: "3️⃣", title: "Prediction", desc: "LSTM predicts Day 8 performance + status: On Track / At Risk / Needs Attention" },
            ].map(({ step, title, desc }) => (
              <Grid item xs={12} sm={4} key={title}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <Typography sx={{ fontSize: "1.2rem" }}>{step}</Typography>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, display: "block" }}>{title}</Typography>
                    <Typography variant="caption" color="textSecondary">{desc}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Data source alert */}
      {dataSource === "real" && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          ✅ Using your real study data from Study Planner ({realScoreCount} day{realScoreCount !== 1 ? "s" : ""} recorded).
          Complete more topics to improve prediction accuracy.
        </Alert>
      )}
      {dataSource === "synthetic" && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          🤖 Scores generated from your exam data
          {examContext ? ` — "${examContext.examName}" in ${examContext.daysLeft} days` : ""}.
          Complete topics in Study Planner to use real data instead.
        </Alert>
      )}
      {dataSource === "demo" && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          📋 Demo mode — no study data found. Go to Study Planner, generate a plan, and mark topics complete to get personalized predictions.
        </Alert>
      )}

      {loadingData ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress sx={{ color: C.primary }} />
        </Box>
      ) : (
        <Card sx={{ mb: 3, borderRadius: 3, border: "1px solid #E2E8F0" }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: C.primary }}>
                📅 7-Day Study Performance Input
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Chip label={sourceChip.label} size="small"
                  sx={{ background: sourceChip.bg, color: sourceChip.color, fontWeight: 700 }} />
                <Button size="small" startIcon={<RefreshIcon />} onClick={loadScores}
                  sx={{ color: C.primary, fontSize: "0.75rem" }}>
                  Refresh
                </Button>
              </Box>
            </Box>

            {/* Bar chart */}
            <Box sx={{ p: 2, background: "#F8FAFC", borderRadius: 2, mb: 3 }}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end", height: 90 }}>
                {scores.map((s, i) => (
                  <Box key={i} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                    <Typography variant="caption" sx={{ fontSize: "0.6rem", color: "#64748B", fontWeight: 600 }}>
                      {Math.round(s * 100)}%
                    </Typography>
                    <Box sx={{
                      width: "100%", height: `${Math.max(s * 70, 4)}px`,
                      background: s >= 0.7 ? "#10B981" : s >= 0.4 ? "#F59E0B" : "#EF4444",
                      borderRadius: "4px 4px 0 0", transition: "height 0.3s ease",
                    }} />
                    <Typography variant="caption" sx={{ fontSize: "0.6rem", color: "#94A3B8" }}>D{i + 1}</Typography>
                  </Box>
                ))}
                {/* Day 8 prediction placeholder */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" sx={{ fontSize: "0.6rem", fontWeight: 700,
                    color: result ? STATUS_CONFIG[result.status]?.color : "#94A3B8" }}>
                    {result ? `${result.predicted_percentage}%` : "?"}
                  </Typography>
                  <Box sx={{
                    width: "100%",
                    height: result ? `${Math.max(result.predicted_score * 70, 4)}px` : "8px",
                    background: result ? (STATUS_CONFIG[result.status]?.color || "#94A3B8") : "#E2E8F0",
                    borderRadius: "4px 4px 0 0", border: "2px dashed #94A3B8",
                    transition: "height 0.4s ease",
                  }} />
                  <Typography variant="caption" sx={{ fontSize: "0.6rem", color: C.primary, fontWeight: 700 }}>
                    D8 🔮
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Sliders */}
            <Typography variant="caption" color="textSecondary" sx={{ display: "block", mb: 2 }}>
              Adjust sliders to simulate different study patterns, then click Predict:
            </Typography>
            <Grid container spacing={2}>
              {scores.map((score, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Box sx={{ px: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>Day {i + 1}</Typography>
                      <Chip label={`${Math.round(score * 100)}%`} size="small"
                        sx={{
                          background: score >= 0.7 ? "#D1FAE5" : score >= 0.4 ? "#FEF3C7" : "#FEE2E2",
                          color: score >= 0.7 ? "#065F46" : score >= 0.4 ? "#92400E" : "#991B1B",
                          fontWeight: 700, height: 20, fontSize: "0.65rem",
                        }} />
                    </Box>
                    <Slider value={score} min={0} max={1} step={0.05}
                      onChange={(_, v) => { setScores(prev => prev.map((s, idx) => idx === i ? v : s)); setResult(null); }}
                      sx={{ color: score >= 0.7 ? "#10B981" : score >= 0.4 ? "#F59E0B" : "#EF4444", py: 0.5 }} />
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Button fullWidth variant="contained" onClick={predict} disabled={loading}
              sx={{ mt: 3, background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                borderRadius: 2, fontWeight: 700, py: 1.5, fontSize: "1rem" }}>
              {loading ? "🧠 LSTM Analyzing Sequence..." : "🔮 Predict Day 8 Performance"}
            </Button>
          </CardContent>
        </Card>
      )}

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* Result card */}
      {result && status && (
        <Card sx={{ borderRadius: 3, border: `2px solid ${status.color}`, background: status.bg }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              {status.icon}
              <Typography variant="h5" sx={{ fontWeight: 700, color: status.color }}>
                {status.emoji} {result.status}
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
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
                <Box sx={{ p: 2, background: "#fff", borderRadius: 2, height: "100%", display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                    💡 {result.message}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ p: 2, background: "#fff", borderRadius: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", display: "block", mb: 1 }}>
                🧠 LSTM Model Architecture (Deep Learning Unit III)
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: "block", mb: 0.5 }}>
                {result.model_info?.architecture}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: "block", mb: 1.5 }}>
                {result.model_info?.why_lstm}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {["Forget Gate", "Input Gate", "Output Gate", "Cell State", "Vanishing Gradient Fix"].map(tag => (
                  <Chip key={tag} label={tag} size="small"
                    sx={{ background: "#EFF6FF", color: "#1D4ED8", fontSize: "0.65rem", fontWeight: 600 }} />
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
