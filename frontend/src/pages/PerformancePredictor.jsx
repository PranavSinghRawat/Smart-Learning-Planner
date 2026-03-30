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
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import StorageIcon from "@mui/icons-material/Storage";
import ScienceIcon from "@mui/icons-material/Science";
import ViewListIcon from "@mui/icons-material/ViewList";

const C = { primary: "#0F766E", secondary: "#06B6D4" };
const ML_URL = import.meta.env.VITE_ML_URL || "http://localhost:5002";
const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const STATUS_CONFIG = {
  "On Track":        { color: "#10B981", bg: "#F0FDF4", border: "#A7F3D0", icon: <TrendingUpIcon />,   emoji: "" },
  "At Risk":         { color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", icon: <TrendingFlatIcon />, emoji: "" },
  "Needs Attention": { color: "#EF4444", bg: "#FFF5F5", border: "#FECACA", icon: <TrendingDownIcon />, emoji: "" },
};

function generateSyntheticScores(exams) {
  if (!exams || exams.length === 0) {
    return Array(7).fill(0).map((_, i) =>
      parseFloat((0.55 + i * 0.02 + (Math.random() * 0.06 - 0.03)).toFixed(2))
    );
  }
  const now = new Date();
  const withDays = exams.map(e => ({ ...e, daysLeft: Math.max(0, Math.ceil((new Date(e.examDate) - now) / 86400000)) }));
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
    parseFloat(Math.max(0.1, Math.min(0.98, baseScore + trend * i + (Math.random() * 0.08 - 0.04))).toFixed(2))
  );
}

const scoreColor = (s) => s >= 0.7 ? "#10B981" : s >= 0.4 ? "#F59E0B" : "#EF4444";
const scoreBg    = (s) => s >= 0.7 ? "#D1FAE5" : s >= 0.4 ? "#FEF3C7" : "#FEE2E2";
const scoreText  = (s) => s >= 0.7 ? "#065F46" : s >= 0.4 ? "#92400E" : "#991B1B";

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
    if (userId) {
      const saved = JSON.parse(localStorage.getItem(`dailyScores_${userId}`) || "[]");
      if (saved.length >= 1) {
        const avg = saved.reduce((s, e) => s + e.score, 0) / saved.length;
        const padded = Array(7).fill(parseFloat(avg.toFixed(2)));
        saved.slice(-7).forEach((entry, i) => { padded[7 - Math.min(saved.length, 7) + i] = entry.score; });
        setScores(padded);
        setDataSource("real");
        setRealScoreCount(saved.length);
        setLoadingData(false);
        return;
      }
    }
    if (token) {
      try {
        const res = await fetch(`${API}/exams`, { headers: { Authorization: `Bearer ${token}` } });
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
      } catch (_) {}
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
    real:      { label: `Live Data (${realScoreCount} days)`, bg: "#D1FAE5", color: "#065F46" },
    synthetic: { label: "From Exam Data",                     bg: "#EFF6FF", color: "#1D4ED8" },
    demo:      { label: "Demo Mode",                          bg: "#FEF3C7", color: "#92400E" },
  }[dataSource];

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: 2.5,
          background: "linear-gradient(135deg, #F0FDF4, #F0F9FF)",
          border: "1px solid #D1FAE5",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <PsychologyIcon sx={{ fontSize: 26, color: C.primary }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
            LSTM Performance Predictor
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748B" }}>
            PyTorch LSTM · 66,049 trainable params · 46K sequences · Stacked 2-layer
          </Typography>
        </Box>
      </Box>

      {/* How it works — 3 compact steps */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { n: "1", title: "Study Planner feeds data", desc: "Daily completion % saved automatically", color: C.primary },
          { n: "2", title: "LSTM reads 7-day sequence", desc: "Forget/input/output gates capture patterns", color: C.secondary },
          { n: "3", title: "Day 8 prediction", desc: "On Track / At Risk / Needs Attention", color: "#8B5CF6" },
        ].map(s => (
          <Grid item xs={12} sm={4} key={s.n}>
            <Box sx={{
              p: 2, borderRadius: 3,
              background: `${s.color}08`, border: `1px solid ${s.color}20`,
              display: "flex", gap: 1.5, alignItems: "flex-start",
            }}>
              <Box sx={{
                width: 28, height: 28, borderRadius: "50%",
                background: `${s.color}20`, color: s.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: "0.8rem", flexShrink: 0,
              }}>{s.n}</Box>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#1E293B", display: "block" }}>{s.title}</Typography>
                <Typography variant="caption" sx={{ color: "#64748B" }}>{s.desc}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Alerts */}
      {dataSource === "real" && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2, fontSize: "0.85rem" }}>
          Using your real study data — {realScoreCount} day{realScoreCount !== 1 ? "s" : ""} recorded from Study Planner.
        </Alert>
      )}
      {dataSource === "synthetic" && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2, fontSize: "0.85rem" }}>
          Scores generated from your exam data{examContext ? ` — "${examContext.examName}" in ${examContext.daysLeft} days` : ""}.
        </Alert>
      )}
      {dataSource === "demo" && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2, fontSize: "0.85rem" }}>
          Demo mode — complete topics in Study Planner to get personalized predictions.
        </Alert>
      )}

      {loadingData ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
          <CircularProgress sx={{ color: C.primary }} />
        </Box>
      ) : (
        <Card sx={{ mb: 3, borderRadius: 3, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          {/* Card header */}
          <Box sx={{
            px: 3, py: 2, borderBottom: "1px solid #F1F5F9",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <AutoGraphIcon sx={{ color: C.primary, fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B" }}>
                7-Day Study Performance
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Chip label={sourceChip.label} size="small"
                sx={{ background: sourceChip.bg, color: sourceChip.color, fontWeight: 600, fontSize: "0.7rem" }} />
              <Button size="small" startIcon={<RefreshIcon sx={{ fontSize: 16 }} />} onClick={loadScores}
                sx={{ color: "#64748B", fontSize: "0.75rem", textTransform: "none", minWidth: "auto" }}>
                Refresh
              </Button>
            </Box>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* Bar chart */}
            <Box sx={{ p: 2.5, background: "#F8FAFC", borderRadius: 2.5, border: "1px solid #E2E8F0", mb: 3 }}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-end", height: 100 }}>
                {scores.map((s, i) => (
                  <Box key={i} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                    <Typography sx={{ fontSize: "0.6rem", color: "#64748B", fontWeight: 700 }}>
                      {Math.round(s * 100)}%
                    </Typography>
                    <Box sx={{
                      width: "100%",
                      height: `${Math.max(s * 80, 6)}px`,
                      background: `linear-gradient(180deg, ${scoreColor(s)}, ${scoreColor(s)}99)`,
                      borderRadius: "4px 4px 0 0",
                      transition: "height 0.4s cubic-bezier(0.4,0,0.2,1)",
                    }} />
                    <Typography sx={{ fontSize: "0.6rem", color: "#94A3B8", fontWeight: 600 }}>D{i + 1}</Typography>
                  </Box>
                ))}
                {/* Day 8 placeholder */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                  <Typography sx={{
                    fontSize: "0.6rem", fontWeight: 800,
                    color: result ? STATUS_CONFIG[result.status]?.color : "#94A3B8",
                  }}>
                    {result ? `${result.predicted_percentage}%` : "?"}
                  </Typography>
                  <Box sx={{
                    width: "100%",
                    height: result ? `${Math.max(result.predicted_score * 80, 6)}px` : "10px",
                    background: result ? STATUS_CONFIG[result.status]?.color : "#E2E8F0",
                    borderRadius: "4px 4px 0 0",
                    border: "2px dashed #CBD5E1",
                    transition: "height 0.5s cubic-bezier(0.4,0,0.2,1)",
                  }} />
                  <Typography sx={{ fontSize: "0.6rem", color: C.primary, fontWeight: 800 }}>D8</Typography>
                </Box>
              </Box>
            </Box>

            {/* Sliders */}
            <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 2 }}>
              Adjust sliders to simulate different study patterns:
            </Typography>
            <Grid container spacing={2}>
              {scores.map((score, i) => (
                <Grid item xs={6} sm={6} md={3} key={i}>
                  <Box sx={{
                    px: 2, py: 1.5, borderRadius: 2,
                    background: "#F8FAFC", border: "1px solid #E2E8F0",
                    transition: "border-color 0.2s",
                    "&:hover": { borderColor: scoreColor(score) },
                  }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151" }}>Day {i + 1}</Typography>
                      <Box sx={{
                        px: 1, py: 0.2, borderRadius: 1,
                        background: scoreBg(score), color: scoreText(score),
                        fontSize: "0.65rem", fontWeight: 700,
                      }}>
                        {Math.round(score * 100)}%
                      </Box>
                    </Box>
                    <Slider
                      value={score} min={0} max={1} step={0.05}
                      onChange={(_, v) => { setScores(prev => prev.map((s, idx) => idx === i ? v : s)); setResult(null); }}
                      sx={{
                        color: scoreColor(score), py: 0.5,
                        "& .MuiSlider-thumb": { width: 14, height: 14 },
                        "& .MuiSlider-rail": { opacity: 0.3 },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Button
              fullWidth variant="contained" onClick={predict} disabled={loading}
              sx={{
                mt: 3,
                background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                borderRadius: 2, fontWeight: 700, py: 1.6, fontSize: "0.95rem",
                textTransform: "none", boxShadow: `0 4px 16px ${C.primary}40`,
                transition: "all 0.2s",
                "&:hover": { transform: "translateY(-1px)", boxShadow: `0 8px 24px ${C.primary}50` },
                "&:disabled": { opacity: 0.7 },
              }}
            >
              {loading
                ? <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={18} sx={{ color: "#fff" }} />
                    <span>Analyzing sequence...</span>
                  </Box>
                : "Predict Day 8 Performance"
              }
            </Button>
          </CardContent>
        </Card>
      )}

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* Result card */}
      {result && status && (
        <Card sx={{ borderRadius: 3, border: `1px solid ${status.border}`, background: status.bg, overflow: "hidden" }}>
          <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${status.border}`, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ color: status.color, display: "flex" }}>{status.icon}</Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: status.color }}>
              {result.status}
            </Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: "center", p: 2.5, background: "#fff", borderRadius: 2.5, border: `1px solid ${status.border}` }}>
                  <Typography variant="h2" sx={{ fontWeight: 800, color: status.color, lineHeight: 1 }}>
                    {result.predicted_percentage}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748B", mt: 0.5, display: "block" }}>
                    Predicted Day 8 Score
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: "center", p: 2.5, background: "#fff", borderRadius: 2.5, border: `1px solid ${status.border}` }}>
                  <Typography variant="h2" sx={{
                    fontWeight: 800, lineHeight: 1,
                    color: result.trend >= 0 ? "#10B981" : "#EF4444",
                  }}>
                    {result.trend >= 0 ? "+" : ""}{(result.trend * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748B", mt: 0.5, display: "block" }}>
                    7-Day Trend
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2.5, background: "#fff", borderRadius: 2.5, border: `1px solid ${status.border}`, height: "100%", display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B", lineHeight: 1.6 }}>
                    {result.message}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 2.5 }} />

            <Box sx={{ p: 2.5, background: "#fff", borderRadius: 2.5, border: "1px solid #E2E8F0" }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", display: "block", mb: 1.5 }}>
                LSTM Architecture (PyTorch)
              </Typography>

              {/* Architecture string */}
              <Box sx={{ p: 1.5, background: "#F8FAFC", borderRadius: 1.5, border: "1px solid #E2E8F0", mb: 1.5, fontFamily: "monospace" }}>
                <Typography variant="caption" sx={{ color: "#1E293B", fontFamily: "monospace", fontSize: "0.7rem" }}>
                  {result.model_info?.architecture}
                </Typography>
              </Box>

              {/* Gate equations */}
              {result.model_info?.gates && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", display: "block", mb: 0.5 }}>
                    Gate Equations:
                  </Typography>
                  {Object.entries(result.model_info.gates).map(([gate, eq]) => (
                    <Box key={gate} sx={{ display: "flex", gap: 1, mb: 0.3 }}>
                      <Typography variant="caption" sx={{ color: "#6366F1", fontWeight: 700, minWidth: 52, textTransform: "capitalize" }}>
                        {gate}:
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#475569", fontFamily: "monospace", fontSize: "0.65rem" }}>
                        {eq}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Metrics row */}
              {result.model_info?.metrics && (
                <Box sx={{ display: "flex", gap: 1.5, mb: 1.5, flexWrap: "wrap" }}>
                  {[
                    { label: "R²",   value: result.model_info.metrics.r2?.toFixed(4)  },
                    { label: "RMSE", value: result.model_info.metrics.rmse?.toFixed(4) },
                    { label: "MAE",  value: result.model_info.metrics.mae?.toFixed(4)  },
                  ].map(m => (
                    <Box key={m.label} sx={{ px: 1.5, py: 0.5, background: "#EFF6FF", borderRadius: 1, border: "1px solid #BFDBFE" }}>
                      <Typography variant="caption" sx={{ color: "#1D4ED8", fontWeight: 700, fontSize: "0.7rem" }}>
                        {m.label}: {m.value}
                      </Typography>
                    </Box>
                  ))}
                  <Box sx={{ px: 1.5, py: 0.5, background: "#F5F3FF", borderRadius: 1, border: "1px solid #DDD6FE" }}>
                    <Typography variant="caption" sx={{ color: "#6D28D9", fontWeight: 700, fontSize: "0.7rem" }}>
                      Params: {result.model_info.trainable_params?.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ px: 1.5, py: 0.5, background: "#F0FDF4", borderRadius: 1, border: "1px solid #A7F3D0" }}>
                    <Typography variant="caption" sx={{ color: "#065F46", fontWeight: 700, fontSize: "0.7rem" }}>
                      Trained on: {result.model_info.training_sequences?.toLocaleString()} sequences
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {["Forget Gate", "Input Gate", "Output Gate", "Cell State", "BPTT", "Vanishing Gradient Fix", "PyTorch"].map(tag => (
                  <Chip key={tag} label={tag} size="small"
                    sx={{ background: "#EFF6FF", color: "#1D4ED8", fontSize: "0.65rem", fontWeight: 600, height: 22 }} />
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
