import React, { useState, useEffect } from "react";
import {
  Box, Container, Typography, Button, Grid, Card, CardContent, Chip,
} from "@mui/material";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import PsychologyIcon from "@mui/icons-material/Psychology";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BoltIcon from "@mui/icons-material/Bolt";

const C = { primary: "#0F766E", secondary: "#06B6D4" };

const FEATURES = [
  {
    icon: <MenuBookIcon sx={{ fontSize: 32, color: C.primary }} />,
    title: "AI Study Planner",
    desc: "Groq LLM generates a personalized day-by-day study plan for any subject — from DSA to Pottery.",
    tag: "Groq LLaMA 3.3",
  },
  {
    icon: <BoltIcon sx={{ fontSize: 32, color: "#8B5CF6" }} />,
    title: "Smart Plan",
    desc: "Get an hour-by-hour study strategy for each day with active recall techniques and resource recommendations.",
    tag: "AI Powered",
  },
  {
    icon: <PsychologyIcon sx={{ fontSize: 32, color: C.secondary }} />,
    title: "LSTM Performance Predictor",
    desc: "Deep learning model trained on 46,000 sequences predicts your Day 8 performance from your 7-day study pattern.",
    tag: "Deep Learning",
  },
  {
    icon: <AutoGraphIcon sx={{ fontSize: 32, color: "#F59E0B" }} />,
    title: "Progress Analytics",
    desc: "Real-time charts showing daily progress, completion rates, and study streaks to keep you on track.",
    tag: "Real-time",
  },
];

const STATS = [
  { value: "46K+", label: "Training Sequences" },
  { value: "3", label: "AI Models" },
  { value: "100+", label: "Subjects" },
  { value: "R²=0.83", label: "LSTM Accuracy" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Generate Your Plan", desc: "Type any subject, set your days and hours — Groq AI builds a structured learning path instantly." },
  { step: "02", title: "Study & Track", desc: "Mark topics complete as you study. Your daily completion % is automatically saved." },
  { step: "03", title: "Get Smart Guidance", desc: "Click Smart Plan on any day to get an AI-generated hour-by-hour study strategy." },
  { step: "04", title: "Predict Performance", desc: "The LSTM model analyzes your 7-day pattern and predicts your next day performance." },
];

export default function Landing({ onGetStarted }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <Box sx={{ background: "#0A0F1E", minHeight: "100vh", color: "#fff", overflowX: "hidden" }}>

      {/* Navbar */}
      <Box sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)", px: { xs: 2, md: 6 }, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          📚 Smart Learning Planner
        </Typography>
        <Button variant="outlined" onClick={onGetStarted}
          sx={{ borderColor: C.primary, color: C.primary, borderRadius: 2, fontWeight: 600, "&:hover": { background: `${C.primary}20` } }}>
          Login / Register
        </Button>
      </Box>

      {/* Hero */}
      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 }, pb: 8, textAlign: "center" }}>
        <Box sx={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <Chip label="🤖 Powered by Groq LLaMA 3.3 + LSTM Deep Learning" size="small"
            sx={{ background: `${C.primary}20`, color: C.secondary, border: `1px solid ${C.primary}40`, mb: 3, fontWeight: 600 }} />

          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: "2rem", md: "3.5rem" }, lineHeight: 1.2 }}>
            Study Smarter with{" "}
            <Box component="span" sx={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              AI-Powered
            </Box>{" "}
            Learning
          </Typography>

          <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.6)", mb: 4, maxWidth: 600, mx: "auto", fontWeight: 400, lineHeight: 1.7 }}>
            An intelligent learning platform that generates personalized study plans, predicts your performance using LSTM neural networks, and guides you with AI-powered strategies.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="contained" size="large" onClick={onGetStarted}
              sx={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, fontWeight: 700, px: 4, py: 1.5, borderRadius: 3, fontSize: "1rem", boxShadow: `0 8px 32px ${C.primary}40`, "&:hover": { transform: "translateY(-2px)", boxShadow: `0 12px 40px ${C.primary}60` }, transition: "all 0.2s" }}>
              🚀 Get Started Free
            </Button>
            <Button variant="outlined" size="large"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              sx={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600, px: 4, py: 1.5, borderRadius: 3, "&:hover": { borderColor: C.secondary, background: "rgba(255,255,255,0.05)" } }}>
              See Features
            </Button>
          </Box>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mt: 8, mb: 4 }}>
          {STATS.map((s) => (
            <Grid item xs={6} sm={3} key={s.label}>
              <Box sx={{ p: 3, borderRadius: 3, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
                <Typography variant="h4" sx={{ fontWeight: 800, background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {s.value}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features */}
      <Box id="features" sx={{ py: 8, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}>
            Everything you need to learn effectively
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.5)", textAlign: "center", mb: 6 }}>
            Built with modern AI and deep learning — not just another study app
          </Typography>
          <Grid container spacing={3}>
            {FEATURES.map((f) => (
              <Grid item xs={12} sm={6} key={f.title}>
                <Card sx={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3, height: "100%", transition: "all 0.3s", "&:hover": { border: `1px solid ${C.primary}60`, transform: "translateY(-4px)", boxShadow: `0 16px 40px ${C.primary}20` } }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      {f.icon}
                      <Chip label={f.tag} size="small" sx={{ background: `${C.primary}20`, color: C.secondary, fontWeight: 600, fontSize: "0.65rem" }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff", mb: 1 }}>{f.title}</Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{f.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How it works */}
      <Box sx={{ py: 8, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}>How it works</Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.5)", textAlign: "center", mb: 6 }}>
            From zero to predicted performance in 4 steps
          </Typography>
          <Grid container spacing={3}>
            {HOW_IT_WORKS.map((h) => (
              <Grid item xs={12} sm={6} md={3} key={h.step}>
                <Box sx={{ textAlign: "center", p: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", mb: 2 }}>
                    {h.step}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{h.title}</Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{h.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Tech Stack */}
      <Box sx={{ py: 6, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.3)", textAlign: "center", mb: 3, textTransform: "uppercase", letterSpacing: 2 }}>
            Built with
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            {["React", "Node.js", "Express", "MongoDB", "JWT Auth", "Groq LLaMA 3.3", "LSTM Neural Network", "Flask", "Vercel", "Render"].map(t => (
              <Chip key={t} label={t} size="small"
                sx={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", fontWeight: 500 }} />
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ py: 10, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Ready to study smarter?</Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.5)", mb: 4 }}>
            Free to use. No credit card required.
          </Typography>
          <Button variant="contained" size="large" onClick={onGetStarted}
            sx={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, fontWeight: 700, px: 6, py: 1.8, borderRadius: 3, fontSize: "1.1rem", boxShadow: `0 8px 32px ${C.primary}40` }}>
            🚀 Start Learning Now
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 3, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)" }}>
          © 2026 Smart Learning Planner — Built with React, Node.js, MongoDB & AI
        </Typography>
      </Box>
    </Box>
  );
}
