import React, { useState, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, Button, Grid, Chip,
  Alert, CircularProgress, List, ListItem, LinearProgress,
} from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const C = { primary: "#0F766E", secondary: "#06B6D4", accent: "#8B5CF6" };

const TYPE_STYLE = {
  study:    { bg: "#D1FAE5", color: "#065F46" },
  revision: { bg: "#EFF6FF", color: "#1D4ED8" },
  break:    { bg: "#FEF3C7", color: "#92400E" },
  practice: { bg: "#F5F3FF", color: "#6D28D9" },
};

export default function SmartPlan({ token, userId, dayContext, onClearDay }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  // ── Empty state ──────────────────────────────────────────────────────────
  if (!dayContext && !plan && !loading) {
    return (
      <Box>
        <PageHeader
          icon={<PsychologyIcon sx={{ fontSize: 28, color: C.primary }} />}
          title="Smart Plan"
          subtitle="AI-generated hour-by-hour study strategy for any day"
        />
        <Box sx={{
          mt: 6, textAlign: "center", py: 10,
          border: "1px dashed #CBD5E1", borderRadius: 4,
          background: "linear-gradient(135deg, #F0FDF4, #F0F9FF)",
        }}>
          <Box sx={{
            width: 80, height: 80, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.primary}15, ${C.secondary}15)`,
            border: `2px solid ${C.primary}20`,
            display: "flex", alignItems: "center", justifyContent: "center",
            mx: "auto", mb: 3, fontSize: "2rem",
          }}>
            🧠
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", mb: 1 }}>
            No day selected yet
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", maxWidth: 380, mx: "auto", lineHeight: 1.7 }}>
            Go to Study Planner, generate a plan, then click the
            <Box component="span" sx={{ color: C.primary, fontWeight: 600 }}> 🧠 Smart Plan </Box>
            button on any day card.
          </Typography>
        </Box>
      </Box>
    );
  }

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box>
        <PageHeader
          icon={<PsychologyIcon sx={{ fontSize: 28, color: C.primary }} />}
          title="Smart Plan"
          subtitle="Generating your personalized strategy..."
        />
        <Box sx={{ mt: 4 }}>
          {[1, 2, 3].map(i => (
            <Card key={i} sx={{ mb: 2, borderRadius: 3, border: "1px solid #E2E8F0" }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                  <Box sx={{ width: 60, height: 24, borderRadius: 1, background: "#E2E8F0", animation: "pulse 1.5s ease-in-out infinite" }} />
                  <Box sx={{ flex: 1, height: 16, borderRadius: 1, background: "#E2E8F0", animation: "pulse 1.5s ease-in-out infinite" }} />
                </Box>
                <Box sx={{ height: 12, borderRadius: 1, background: "#F1F5F9", mb: 1.5, animation: "pulse 1.5s ease-in-out infinite" }} />
                <Box sx={{ height: 12, borderRadius: 1, background: "#F1F5F9", width: "70%", animation: "pulse 1.5s ease-in-out infinite" }} />
              </CardContent>
            </Card>
          ))}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <CircularProgress size={28} sx={{ color: C.primary }} />
            <Typography variant="body2" sx={{ color: "#64748B", mt: 1.5 }}>
              Groq AI is building your hour-by-hour schedule...
            </Typography>
          </Box>
        </Box>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 4 }}>
        <PageHeader
          icon={<PsychologyIcon sx={{ fontSize: 28, color: C.primary }} />}
          title="Smart Plan"
          subtitle={plan ? `Day ${plan.dayContext?.day} · ${plan.dayContext?.subject}` : "AI-generated study strategy"}
        />
        {onClearDay && plan && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onClearDay}
            sx={{
              color: "#64748B", fontWeight: 600, textTransform: "none",
              borderRadius: 2, border: "1px solid #E2E8F0",
              "&:hover": { background: "#F8FAFC", borderColor: C.primary, color: C.primary },
            }}
          >
            Back
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {plan && !loading && (
        <>
          {/* Stats row */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: "Day", value: `Day ${plan.dayContext?.day}`, color: C.primary, bg: "#F0FDF4" },
              { label: "Subject", value: plan.dayContext?.subject || "—", color: C.secondary, bg: "#F0F9FF" },
              { label: "Topics", value: `${plan.dayContext?.topics?.length || 0} topics`, color: C.accent, bg: "#F5F3FF" },
              { label: "Duration", value: `${plan.dayContext?.hours}h`, color: "#F59E0B", bg: "#FFFBEB" },
            ].map(s => (
              <Grid item xs={6} sm={3} key={s.label}>
                <Box sx={{
                  p: 2, borderRadius: 3, background: s.bg,
                  border: `1px solid ${s.color}20`, textAlign: "center",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-2px)" },
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: s.color, fontSize: "1rem" }}>{s.value}</Typography>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>{s.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Overview */}
          {plan.overview && (
            <Card sx={{ mb: 3, borderRadius: 3, background: "linear-gradient(135deg, #F0FDF4, #F0F9FF)", border: `1px solid ${C.primary}20` }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <AutoAwesomeIcon sx={{ color: C.primary, fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: C.primary }}>
                    Strategy Overview
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#374151", lineHeight: 1.8 }}>{plan.overview}</Typography>
              </CardContent>
            </Card>
          )}

          {/* Schedule */}
          {plan.schedule?.length > 0 && (
            <Card sx={{ mb: 3, borderRadius: 3, border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 1.5 }}>
                <AccessTimeIcon sx={{ color: C.primary, fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", fontSize: "1rem" }}>
                  Hour-by-Hour Schedule
                </Typography>
              </Box>
              <List sx={{ p: 0 }}>
                {plan.schedule.map((slot, i) => {
                  const ts = TYPE_STYLE[slot.type] || TYPE_STYLE.study;
                  return (
                    <ListItem key={i} sx={{
                      px: 3, py: 2,
                      borderBottom: i < plan.schedule.length - 1 ? "1px solid #F8FAFC" : "none",
                      alignItems: "flex-start",
                      transition: "background 0.15s",
                      "&:hover": { background: "#FAFBFC" },
                    }}>
                      <Box sx={{ minWidth: 90, mr: 2, pt: 0.3 }}>
                        <Typography variant="caption" sx={{
                          fontWeight: 700, color: C.primary,
                          background: `${C.primary}10`, px: 1, py: 0.3,
                          borderRadius: 1, fontSize: "0.7rem", whiteSpace: "nowrap",
                        }}>
                          {slot.time}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B", mb: 0.5 }}>
                          {slot.activity}
                        </Typography>
                        {slot.tip && (
                          <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                            💡 {slot.tip}
                          </Typography>
                        )}
                      </Box>
                      {slot.type && (
                        <Chip
                          label={slot.type}
                          size="small"
                          sx={{ background: ts.bg, color: ts.color, fontSize: "0.65rem", fontWeight: 600, height: 22 }}
                        />
                      )}
                    </ListItem>
                  );
                })}
              </List>
            </Card>
          )}

          {/* Topic breakdown */}
          {plan.topicBreakdown?.length > 0 && (
            <Card sx={{ mb: 3, borderRadius: 3, border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #F1F5F9" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", fontSize: "1rem" }}>
                  📚 Topic Breakdown
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  {plan.topicBreakdown.map((t, i) => (
                    <Grid item xs={12} sm={6} key={i}>
                      <Box sx={{
                        p: 2.5, background: "#F8FAFC", borderRadius: 2.5,
                        border: "1px solid #E2E8F0",
                        transition: "all 0.2s",
                        "&:hover": { border: `1px solid ${C.primary}30`, background: "#F0FDF4" },
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#1E293B", mb: 1.5 }}>
                          {t.topic}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
                          <Chip label={`${t.duration} min`} size="small" sx={{ background: "#EFF6FF", color: C.primary, fontSize: "0.65rem", height: 20 }} />
                          <Chip label={t.approach} size="small" sx={{ background: "#D1FAE5", color: "#065F46", fontSize: "0.65rem", height: 20 }} />
                        </Box>
                        {t.resources && (
                          <Typography variant="caption" sx={{ color: "#64748B" }}>{t.resources}</Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Card>
          )}

          {/* Tips */}
          {plan.tips?.length > 0 && (
            <Card sx={{ borderRadius: 3, background: "#FFFBEB", border: "1px solid #FDE68A", overflow: "hidden" }}>
              <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #FEF3C7" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#92400E" }}>
                  ⚡ Pro Tips for Today
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                {plan.tips.map((tip, i) => (
                  <Box key={i} sx={{ display: "flex", gap: 1.5, mb: i < plan.tips.length - 1 ? 1.5 : 0 }}>
                    <CheckCircleIcon sx={{ color: "#F59E0B", fontSize: 18, mt: 0.2, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: "#78350F", lineHeight: 1.6 }}>{tip}</Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}

// Reusable page header component
function PageHeader({ icon, title, subtitle }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
      <Box sx={{
        width: 48, height: 48, borderRadius: 2.5,
        background: "linear-gradient(135deg, #F0FDF4, #F0F9FF)",
        border: "1px solid #D1FAE5",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: "#64748B" }}>{subtitle}</Typography>
      </Box>
    </Box>
  );
}
