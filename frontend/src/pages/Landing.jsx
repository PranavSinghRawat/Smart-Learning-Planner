import React, { useState, useEffect, useRef } from "react";
import {
  Box, Container, Typography, Button, Grid, Card, CardContent, Chip,
} from "@mui/material";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import PsychologyIcon from "@mui/icons-material/Psychology";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BoltIcon from "@mui/icons-material/Bolt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const C = { primary: "#0F766E", secondary: "#06B6D4", accent: "#8B5CF6" };

const FEATURES = [
  {
    icon: <MenuBookIcon sx={{ fontSize: 28 }} />,
    color: C.primary,
    title: "AI Study Planner",
    desc: "Groq LLM generates a personalized day-by-day study plan for any subject — from DSA to Pottery.",
    tag: "Groq LLaMA 3.3",
  },
  {
    icon: <BoltIcon sx={{ fontSize: 28 }} />,
    color: C.accent,
    title: "Smart Daily Plan",
    desc: "Get an hour-by-hour study strategy for each day with active recall techniques and resource links.",
    tag: "AI Powered",
  },
  {
    icon: <PsychologyIcon sx={{ fontSize: 28 }} />,
    color: C.secondary,
    title: "LSTM Performance Predictor",
    desc: "Deep learning model trained on 46,000 sequences predicts your Day 8 performance from your 7-day pattern.",
    tag: "Deep Learning",
  },
  {
    icon: <AutoGraphIcon sx={{ fontSize: 28 }} />,
    color: "#F59E0B",
    title: "Progress Analytics",
    desc: "Real-time charts showing daily progress, completion rates, and study streaks to keep you on track.",
    tag: "Real-time",
  },
];

const STATS = [
  { value: 46000, display: "46K+", label: "Training Sequences", suffix: "+" },
  { value: 3, display: "3", label: "AI Models" },
  { value: 100, display: "100+", label: "Subjects Supported", suffix: "+" },
  { value: 83, display: "R²=0.83", label: "LSTM Accuracy" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Generate Your Plan", desc: "Type any subject, set your days and hours — Groq AI builds a structured learning path instantly.", color: C.primary },
  { step: "02", title: "Study & Track", desc: "Mark topics complete as you study. Your daily completion % is automatically saved.", color: C.secondary },
  { step: "03", title: "Get Smart Guidance", desc: "Click Smart Plan on any day to get an AI-generated hour-by-hour study strategy.", color: C.accent },
  { step: "04", title: "Predict Performance", desc: "The LSTM model analyzes your 7-day pattern and predicts your next day performance.", color: "#F59E0B" },
];

// Animated counter hook
function useCounter(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function StatCard({ stat, animate }) {
  const count = useCounter(stat.value, 1600, animate);
  const isSpecial = stat.display.startsWith("R²");
  return (
    <Box sx={{
      p: { xs: 2.5, md: 3 },
      borderRadius: 3,
      border: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s",
      "&:hover": { border: "1px solid rgba(6,182,212,0.3)", background: "rgba(6,182,212,0.05)", transform: "translateY(-4px)" },
    }}>
      <Typography variant="h4" sx={{
        fontWeight: 800,
        background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        fontSize: { xs: "1.6rem", md: "2rem" },
      }}>
        {isSpecial ? stat.display : (animate ? `${count}${stat.suffix || ""}` : stat.display)}
      </Typography>
      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>{stat.label}</Typography>
    </Box>
  );
}

export default function Landing({ onGetStarted }) {
  const [heroVisible, setHeroVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box sx={{ background: "#080D1A", minHeight: "100vh", color: "#fff", overflowX: "hidden" }}>

      {/* Animated gradient orbs background */}
      <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <Box sx={{
          position: "absolute", top: "-20%", left: "-10%",
          width: { xs: 400, md: 700 }, height: { xs: 400, md: 700 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.primary}22 0%, transparent 70%)`,
          animation: "float1 8s ease-in-out infinite",
        }} />
        <Box sx={{
          position: "absolute", top: "30%", right: "-15%",
          width: { xs: 300, md: 600 }, height: { xs: 300, md: 600 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.secondary}18 0%, transparent 70%)`,
          animation: "float2 10s ease-in-out infinite",
        }} />
        <Box sx={{
          position: "absolute", bottom: "10%", left: "30%",
          width: { xs: 200, md: 400 }, height: { xs: 200, md: 400 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}15 0%, transparent 70%)`,
          animation: "float3 12s ease-in-out infinite",
        }} />
      </Box>

      <style>{`
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,60px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-50px,40px)} }
        @keyframes float3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-50px)} }
        @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.4);opacity:0} }
      `}</style>

      {/* Navbar */}
      <Box sx={{
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        px: { xs: 2, md: 6 }, py: 1.5,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(8,13,26,0.85)", backdropFilter: "blur(20px)",
      }}>
        <Typography variant="h6" sx={{
          fontWeight: 800, letterSpacing: -0.5,
          background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Smart Learning Planner
        </Typography>
        <Button variant="outlined" onClick={onGetStarted}
          sx={{
            borderColor: `${C.primary}80`, color: C.secondary, borderRadius: 2,
            fontWeight: 600, fontSize: "0.85rem",
            "&:hover": { background: `${C.primary}15`, borderColor: C.secondary },
          }}>
          Login / Register
        </Button>
      </Box>

      {/* Hero */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 14 }, pb: { xs: 6, md: 10 }, textAlign: "center" }}>
          <Box sx={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}>
            <Chip
              label="Groq LLaMA 3.3 + LSTM Deep Learning"
              size="small"
              sx={{
                background: `${C.primary}18`, color: C.secondary,
                border: `1px solid ${C.primary}40`, mb: 3, fontWeight: 600,
                fontSize: "0.75rem", px: 1,
              }}
            />

            <Typography variant="h1" sx={{
              fontWeight: 900, mb: 2,
              fontSize: { xs: "2.2rem", sm: "3rem", md: "4rem" },
              lineHeight: 1.15, letterSpacing: -1,
            }}>
              Study Smarter with{" "}
              <Box component="span" sx={{
                background: `linear-gradient(135deg, ${C.primary}, ${C.secondary}, ${C.accent})`,
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: "shimmer 4s ease infinite",
              }}>
                AI-Powered
              </Box>
              <br />Learning
            </Typography>

            <Typography sx={{
              color: "rgba(255,255,255,0.55)", mb: 5,
              maxWidth: 560, mx: "auto", lineHeight: 1.8,
              fontSize: { xs: "1rem", md: "1.1rem" },
            }}>
              Personalized study plans, LSTM performance prediction, and AI-guided daily strategies — all in one platform.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                variant="contained" size="large" onClick={onGetStarted}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                  fontWeight: 700, px: 4, py: 1.6, borderRadius: 3,
                  fontSize: "1rem", boxShadow: `0 8px 32px ${C.primary}50`,
                  transition: "all 0.25s",
                  "&:hover": { transform: "translateY(-3px)", boxShadow: `0 16px 48px ${C.primary}60` },
                }}>
                Get Started Free
              </Button>
              <Button
                variant="outlined" size="large"
                onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}
                sx={{
                  borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)",
                  fontWeight: 600, px: 4, py: 1.6, borderRadius: 3,
                  "&:hover": { borderColor: C.secondary, background: "rgba(255,255,255,0.04)" },
                }}>
                See Features
              </Button>
            </Box>
          </Box>

          {/* Stats */}
          <Box ref={statsRef} sx={{ mt: { xs: 8, md: 12 } }}>
            <Grid container spacing={2}>
              {STATS.map((s) => (
                <Grid item xs={6} sm={3} key={s.label}>
                  <StatCard stat={s} animate={statsVisible} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>

        {/* Features */}
        <Box id="features" sx={{ py: { xs: 8, md: 12 }, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography variant="overline" sx={{ color: C.secondary, fontWeight: 700, letterSpacing: 3, fontSize: "0.7rem" }}>
                FEATURES
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 2, fontSize: { xs: "1.8rem", md: "2.5rem" } }}>
                Everything you need to learn effectively
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.45)", maxWidth: 500, mx: "auto" }}>
                Built with modern AI and deep learning — not just another study app
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {FEATURES.map((f, idx) => (
                <Grid item xs={12} sm={6} key={f.title}>
                  <Card sx={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 3, height: "100%",
                    transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                    cursor: "default",
                    "&:hover": {
                      border: `1px solid ${f.color}50`,
                      transform: "translateY(-6px)",
                      boxShadow: `0 20px 60px ${f.color}18`,
                      background: `rgba(255,255,255,0.04)`,
                    },
                  }}>
                    <CardContent sx={{ p: 3.5 }}>
                      <Box sx={{
                        width: 52, height: 52, borderRadius: 2.5,
                        background: `${f.color}18`, border: `1px solid ${f.color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: f.color, mb: 2.5,
                      }}>
                        {f.icon}
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>{f.title}</Typography>
                        <Chip label={f.tag} size="small" sx={{
                          background: `${f.color}18`, color: f.color,
                          fontWeight: 600, fontSize: "0.6rem", height: 20,
                        }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>
                        {f.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* How it works */}
        <Box sx={{ py: { xs: 8, md: 12 }, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography variant="overline" sx={{ color: C.secondary, fontWeight: 700, letterSpacing: 3, fontSize: "0.7rem" }}>
                HOW IT WORKS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 2, fontSize: { xs: "1.8rem", md: "2.5rem" } }}>
                From zero to predicted performance
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {HOW_IT_WORKS.map((h, i) => (
                <Grid item xs={12} sm={6} md={3} key={h.step}>
                  <Box sx={{
                    p: 3, borderRadius: 3,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    height: "100%",
                    transition: "all 0.3s",
                    "&:hover": { background: "rgba(255,255,255,0.04)", transform: "translateY(-4px)" },
                  }}>
                    <Typography sx={{
                      fontWeight: 900, fontSize: "3rem", lineHeight: 1,
                      background: `linear-gradient(135deg, ${h.color}, ${h.color}60)`,
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      mb: 2,
                    }}>
                      {h.step}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: "1rem" }}>{h.title}</Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}>{h.desc}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Tech Stack */}
        <Box sx={{ py: 6, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <Container maxWidth="lg">
            <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.25)", display: "block", textAlign: "center", mb: 3, letterSpacing: 3, fontSize: "0.65rem" }}>
              BUILT WITH
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap" }}>
              {["React", "Node.js", "Express", "MongoDB", "JWT Auth", "Groq LLaMA 3.3", "LSTM Neural Network", "Flask", "scikit-learn", "Vercel", "Render"].map(t => (
                <Chip key={t} label={t} size="small"
                  sx={{
                    background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.55)",
                    border: "1px solid rgba(255,255,255,0.08)", fontWeight: 500,
                    transition: "all 0.2s",
                    "&:hover": { background: `${C.primary}20`, color: C.secondary, borderColor: `${C.primary}40` },
                  }} />
              ))}
            </Box>
          </Container>
        </Box>

        {/* CTA */}
        <Box sx={{ py: { xs: 10, md: 16 }, borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center", position: "relative" }}>
          <Box sx={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at center, ${C.primary}12 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />
          <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: "1.8rem", md: "2.5rem" } }}>
              Ready to study smarter?
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.45)", mb: 5, fontSize: "1.05rem" }}>
              Free to use. No credit card required.
            </Typography>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Box sx={{
                position: "absolute", inset: -4, borderRadius: 4,
                background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                animation: "pulse-ring 2s ease-out infinite",
                zIndex: 0,
              }} />
              <Button
                variant="contained" size="large" onClick={onGetStarted}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  position: "relative", zIndex: 1,
                  background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                  fontWeight: 700, px: 6, py: 2, borderRadius: 3,
                  fontSize: "1.1rem", boxShadow: `0 8px 32px ${C.primary}50`,
                  transition: "all 0.25s",
                  "&:hover": { transform: "translateY(-3px)", boxShadow: `0 20px 60px ${C.primary}60` },
                }}>
                Start Learning Now
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Footer */}
        <Box sx={{ py: 3, borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.2)" }}>
            © 2026 Smart Learning Planner — React · Node.js · MongoDB · Groq AI · LSTM
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
