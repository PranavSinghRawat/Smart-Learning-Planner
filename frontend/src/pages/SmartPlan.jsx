import React, { useState, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, Button, Grid, Chip,
  Alert, CircularProgress, List, ListItem, LinearProgress,
  Divider, Paper, useTheme
} from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const TYPE_STYLE = {
  study:    { bg: "rgba(16, 185, 129, 0.1)", color: "#059669", icon: "📚" },
  revision: { bg: "rgba(37, 99, 235, 0.1)",  color: "#2563eb", icon: "🔄" },
  break:    { bg: "rgba(245, 158, 11, 0.1)", color: "#d97706", icon: "☕" },
  practice: { bg: "rgba(139, 92, 246, 0.1)", color: "#7c3aed", icon: "💻" },
};

export default function SmartPlan({ token, userId, dayContext, onClearDay }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();

  useEffect(() => {
    if (dayContext) generateForDay(dayContext);
  }, [dayContext]);

  const generateForDay = async (ctx) => {
    setLoading(true);
    setError("");
    setPlan(null);
    try {
      const res = await fetch(`${API}/resources/smartplan`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ day: ctx.day, topics: ctx.topics, subject: ctx.subject, hours: ctx.hours }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate smart plan");
      setPlan({ ...data, dayContext: ctx });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!dayContext && !plan && !loading) {
    return (
      <Box className="animate-slide-up">
        <PageHeader
          icon={<PsychologyIcon />}
          title="Smart Plan AI"
          subtitle="Precision hour-by-hour study strategies optimized for your goals"
        />
        <Paper className="glass-panel" sx={{
          mt: 6, textAlign: "center", py: 12,
          border: "1px dashed rgba(15, 118, 110, 0.3)", borderRadius: 8,
          background: "rgba(255, 255, 255, 0.4)",
        }}>
          <Box sx={{
            width: 100, height: 100, borderRadius: 5,
            background: "linear-gradient(135deg, rgba(15, 118, 110, 0.1), rgba(14, 165, 233, 0.1))",
            display: "flex", alignItems: "center", justifyContent: "center",
            mx: "auto", mb: 4, fontSize: "3rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.05)"
          }}>
            🧠
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", mb: 2 }}>
            Awaiting Strategy Definition
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b", maxWidth: 450, mx: "auto", lineHeight: 1.8 }}>
            Navigate to the <Box component="span" sx={{ color: "primary.main", fontWeight: 700 }}>Study Planner</Box>, 
            configure your sprint, and initiate the 
            <Box component="span" sx={{ fontWeight: 700 }}> Smart Plan </Box> generator for any specific day.
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box className="animate-slide-up">
        <PageHeader
          icon={<PsychologyIcon />}
          title="AI Synthesis"
          subtitle="Processing peak-performance neural strategies..."
        />
        <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[1, 2, 3].map(i => (
            <Card key={i} className="glass-card" sx={{ opacity: 0.6 + (i * 0.1) }}>
              <CardContent sx={{ p: 4 }}>
                <Box className="shimmer-loader" sx={{ height: 32, width: '40%', borderRadius: 2, mb: 3 }} />
                <Box className="shimmer-loader" sx={{ height: 16, width: '90%', borderRadius: 1, mb: 1.5 }} />
                <Box className="shimmer-loader" sx={{ height: 16, width: '70%', borderRadius: 1 }} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box className="animate-slide-up">
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 6, gap: 2 }}>
        <PageHeader
          icon={<PsychologyIcon />}
          title="Cognitive Strategy"
          subtitle={plan ? `Session Analysis for ${plan.dayContext?.subject} · Day ${plan.dayContext?.day}` : "Advanced Study Architecture"}
        />
        {onClearDay && plan && (
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onClearDay}
            sx={{
              borderRadius: 3, border: "2px solid rgba(15, 118, 110, 0.2)",
              fontWeight: 700, px: 3,
              "&:hover": { border: "2px solid #0f766e", background: "rgba(15, 118, 110, 0.05)" }
            }}
          >
            Back to Overview
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 4, fontWeight: 600 }}>{error}</Alert>}

      {plan && !loading && (
        <Grid container spacing={3}>
          {/* Key Metrics Bento */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {[
                { label: "Complexity", value: plan.dayContext?.subject, color: "#1e293b", bg: "rgba(255,255,255,0.6)" },
                { label: "Target Modules", value: plan.dayContext?.topics?.length, color: "#0f766e", bg: "rgba(15, 118, 110, 0.05)" },
                { label: "Neural Load", value: `${plan.dayContext?.hours}h Total`, color: "#0ea5e9", bg: "rgba(14, 165, 233, 0.05)" },
                { label: "Status", value: "Optimized", color: "#10b981", bg: "rgba(16, 185, 129, 0.05)" },
              ].map((s, idx) => (
                <Grid item xs={6} sm={3} key={idx}>
                  <Box className="glass-card" component={motion.div} whileHover={{ y: -4 }} sx={{
                    p: 3, borderRadius: 5, textAlign: "center",
                  }}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: s.color, mt: 0.5 }}>{s.value}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* AI Strategy Overview */}
          <Grid item xs={12}>
            <Card className="glass-card" component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 2, background: 'rgba(15, 118, 110, 0.1)', color: 'primary.main', display: 'flex' }}>
                    <AutoAwesomeIcon />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>AI Strategic Narrative</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: "#334155", lineHeight: 1.8, fontStyle: 'italic' }}>
                  "{plan.overview}"
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Timeline & Breakdown Side-by-Side */}
          <Grid item xs={12} lg={7}>
            <Card className="glass-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccessTimeIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Precision Schedule</Typography>
              </Box>
              <List sx={{ p: 0, flexGrow: 1 }}>
                {plan.schedule.map((slot, i) => {
                  const s = TYPE_STYLE[slot.type] || TYPE_STYLE.study;
                  return (
                    <ListItem key={i} sx={{ 
                      px: 3, py: 3, borderBottom: '1px solid rgba(0,0,0,0.03)',
                      '&:last-child': { borderBottom: 'none' }
                    }}>
                      <Box sx={{ display: 'flex', gap: 3, width: '100%', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ minWidth: 80, fontWeight: 800, color: 'primary.main', opacity: 0.8 }}>
                          {slot.time}
                        </Typography>
                        <Box sx={{ fontSize: '1.5rem', opacity: 0.8 }}>{s.icon}</Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>{slot.activity}</Typography>
                          {slot.tip && <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>{slot.tip}</Typography>}
                        </Box>
                        <Chip label={slot.type} size="small" sx={{ 
                          bgcolor: s.bg, color: s.color, fontWeight: 800, 
                          fontSize: '0.65rem', textTransform: 'uppercase', height: 24 
                        }} />
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            </Card>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Detailed Topics Breakdown */}
              <Card className="glass-card">
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Module Breakdown</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {plan.topicBreakdown?.map((t, i) => (
                      <Box key={i} sx={{ p: 2.5, borderRadius: 4, background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>{t.topic}</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Chip label={`${t.duration}m`} size="small" variant="outlined" sx={{ fontWeight: 700, height: 22 }} />
                          <Chip label={t.approach} size="small" sx={{ bgcolor: 'primary.main', color: '#fff', fontWeight: 700, height: 22 }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5, display: 'block' }}>{t.resources}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Cognitive Anchors (Tips) */}
              <Card sx={{ bgcolor: '#0f766e', color: '#fff', borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(20px)' }} />
                <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleIcon /> Cognitive Anchors
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {plan.tips?.map((tip, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                        <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.7, fontWeight: 500 }}>• {tip}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      )}
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
