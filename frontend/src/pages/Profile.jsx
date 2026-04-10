import React, { useMemo } from "react";
import {
  Box, Card, Typography, Grid, LinearProgress,
  Chip, Avatar, List, ListItem, ListItemText, Button,
  Tooltip as MuiTooltip, IconButton, Paper, CircularProgress
} from "@mui/material";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import StarIcon from "@mui/icons-material/Star";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { motion } from "framer-motion";

export default function Profile({ userId, username, studyHistory = [], plan = [], subject, level, days, hours, onDeleteHistory, onResumeCourse }) {

  // ── Daily scores from localStorage ──
  const { streak, longestStreak, dailyScores } = useMemo(() => {
    const saved = JSON.parse(localStorage.getItem(`dailyScores_${userId}`) || "[]");
    if (saved.length === 0) return { streak: 0, longestStreak: 0, dailyScores: [] };

    const sorted = [...saved].sort((a, b) => b.date.localeCompare(a.date));
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    let current = 0;
    let checkDate = sorted[0]?.date === today || sorted[0]?.date === yesterday ? sorted[0].date : null;
    if (checkDate) {
      for (const entry of sorted) {
        const expected = new Date(new Date(checkDate).getTime() - current * 86400000).toISOString().split("T")[0];
        if (entry.date === expected) current++;
        else break;
      }
    }

    let longest = 0, cur = 1;
    const asc = [...saved].sort((a, b) => a.date.localeCompare(b.date));
    for (let i = 1; i < asc.length; i++) {
      const prev = new Date(asc[i - 1].date);
      const curr = new Date(asc[i].date);
      if ((curr - prev) / 86400000 === 1) { cur++; longest = Math.max(longest, cur); }
      else cur = 1;
    }
    return { streak: current, longestStreak: Math.max(longest, current), dailyScores: asc };
  }, [userId]);

  // ── Current plan stats ──
  const safePlan = Array.isArray(plan) ? plan : [];
  const totalTopics = safePlan.reduce((s, d) => s + (d.topics?.length || 0), 0);
  const completedCount = safePlan.reduce((s, d) => s + (d.topics?.filter(t => t.completed).length || 0), 0);
  const verifiedCount = safePlan.reduce((s, d) => s + (d.topics?.filter(t => t.verified).length || 0), 0);
  const completionPct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
  const avgScore = dailyScores.length > 0
    ? Math.round(dailyScores.reduce((s, e) => s + e.score, 0) / dailyScores.length * 100)
    : 0;

  // ── Radar chart data ──
  const radarData = useMemo(() => {
    const accuracy = completedCount > 0 ? (verifiedCount / completedCount) * 100 : 0;
    const consistency = Math.min(100, (streak / 10) * 100);
    const breadth = Math.min(100, (studyHistory.length / 5) * 100);
    const depth = studyHistory.length > 0
      ? studyHistory.filter(h => h.level !== "Beginner").length / studyHistory.length * 100
      : 0;
    return [
      { subject: "Consistency", A: Math.round(consistency) },
      { subject: "Accuracy", A: Math.round(accuracy) },
      { subject: "Breadth", A: Math.round(breadth) },
      { subject: "Quality", A: avgScore },
      { subject: "Depth", A: Math.round(depth) },
    ];
  }, [streak, studyHistory, completedCount, verifiedCount, avgScore]);

  // ── Heatmap ──
  const heatmap = useMemo(() => {
    const cells = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
      const entry = dailyScores.find(e => e.date === d);
      cells.push({ date: d, score: entry ? entry.score : 0 });
    }
    return cells;
  }, [dailyScores]);

  // ── Active course is the most recent history entry ──
  const activeCourse = studyHistory[0] || null;

  // ── Empty state ──
  if (studyHistory.length === 0 && safePlan.length === 0) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 4 }}>
        <Box sx={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #0f766e20, #06b6d420)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <SchoolIcon sx={{ fontSize: 48, color: '#0f766e' }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', mb: 1 }}>
          No activity yet, {username || "Learner"}!
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mb: 4, maxWidth: 420 }}>
          Head over to the <strong>Study Planner</strong> tab, generate your first AI-powered study plan, and come back here to track your mastery journey.
        </Typography>
        <Chip icon={<RocketLaunchIcon />} label="Go generate your first plan!" color="primary" sx={{ fontWeight: 800, px: 2, py: 3, fontSize: '1rem', borderRadius: 3 }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Header ── */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Avatar sx={{ width: 72, height: 72, background: 'linear-gradient(135deg, #0f766e 0%, #06b6d4 100%)', fontSize: '1.8rem', fontWeight: 900, boxShadow: '0 8px 24px rgba(15,118,110,0.2)' }}>
          {username?.[0]?.toUpperCase() || "U"}
        </Avatar>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1, color: '#1e293b' }}>
            {username || "Learner"}'s Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {studyHistory.length} course{studyHistory.length !== 1 ? "s" : ""} on record • {streak > 0 ? `${streak}-day streak 🔥` : "Start your streak today"}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>

        {/* ── Hero: Active Course ── */}
        {activeCourse && (
          <Grid item xs={12}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{
                p: { xs: 3, md: 5 }, borderRadius: 6,
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: '#fff', position: 'relative', overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
              }}
            >
              <Box sx={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(6,182,212,0.08)', filter: 'blur(60px)' }} />
              <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid item xs={12} md={8}>
                  <Chip icon={<WorkspacePremiumIcon sx={{ color: '#06b6d4 !important' }} />} label="ACTIVE COURSE" sx={{ bgcolor: 'rgba(255,255,255,0.07)', color: '#fff', fontWeight: 800, mb: 2, border: '1px solid rgba(255,255,255,0.1)' }} />
                  <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: -0.5 }}>{activeCourse.subject}</Typography>
                  <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1, fontWeight: 500 }}>
                    Level: {activeCourse.level} &nbsp;•&nbsp; {activeCourse.days} Day Plan
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
                    Started: {activeCourse.createdAt || "Recently"}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained" size="large"
                      onClick={() => onResumeCourse(activeCourse)}
                      startIcon={<PlayCircleFilledIcon />}
                      sx={{ px: 4, py: 1.8, borderRadius: 4, fontWeight: 800, bgcolor: '#fff', color: '#0f172a', '&:hover': { bgcolor: '#e2e8f0', transform: 'scale(1.02)' }, transition: 'all 0.2s' }}
                    >
                      Resume Now
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: '#06b6d4' }}>{completionPct}%</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>COMPLETE</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: 'center', display: { xs: 'none', md: 'block' } }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress variant="determinate" value={completionPct} size={160} thickness={4} sx={{ color: '#06b6d4' }} />
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                      <Typography variant="h3" sx={{ fontWeight: 900 }}>{completionPct}%</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8' }}>DONE</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              {/* Progress bar */}
              <Box sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
                <LinearProgress
                  variant="determinate" value={completionPct}
                  sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: '#06b6d4', borderRadius: 3 } }}
                />
              </Box>
            </Box>
          </Grid>
        )}

        {/* ── Left Column ── */}
        <Grid item xs={12} lg={8}>

          {/* Stat Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { icon: <LocalFireDepartmentIcon />, label: "Daily Streak", value: `${streak}d`, color: "#f59e0b", sub: streak > 0 ? "Keep it up!" : "Start today" },
              { icon: <EmojiEventsIcon />, label: "Best Streak", value: `${longestStreak}d`, color: "#10b981", sub: "Personal best" },
              { icon: <CheckCircleIcon />, label: "Verified", value: verifiedCount, color: "#06b6d4", sub: "Topics mastered" },
              { icon: <AutoAwesomeIcon />, label: "Avg Score", value: `${avgScore}%`, color: "#8b5cf6", sub: "Performance" },
            ].map((stat, i) => (
              <Grid item xs={6} sm={3} key={i}>
                <Paper elevation={0} sx={{
                  p: 2.5, borderRadius: 4, textAlign: 'center',
                  border: '1px solid rgba(0,0,0,0.06)',
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(12px)',
                  transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.07)' }
                }}>
                  <Box sx={{ mx: 'auto', p: 1, borderRadius: 2, bgcolor: `${stat.color}15`, color: stat.color, width: 'fit-content', mb: 1.5, display: 'flex' }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b', lineHeight: 1 }}>{stat.value}</Typography>
                  <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mt: 0.5 }}>{stat.label}</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem' }}>{stat.sub}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Activity Heatmap */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b' }}>Activity Heatmap</Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>Last 28 days</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 1 }}>
              {heatmap.map((cell, i) => (
                <MuiTooltip key={i} title={`${cell.date}: ${Math.round(cell.score * 100)}%`} arrow>
                  <Box sx={{
                    pt: '100%', borderRadius: 1.5,
                    bgcolor: cell.score === 0 ? 'rgba(0,0,0,0.05)' : '#0f766e',
                    opacity: cell.score === 0 ? 1 : 0.25 + (cell.score * 0.75),
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    '&:hover': { transform: 'scale(1.3)', zIndex: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.15)', cursor: 'default' }
                  }} />
                </MuiTooltip>
              ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>Less</Typography>
              {[0.1, 0.3, 0.5, 0.7, 1].map((v, i) => (
                <Box key={i} sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: '#0f766e', opacity: 0.15 + v * 0.85 }} />
              ))}
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>More</Typography>
            </Box>
          </Paper>

          {/* Course History */}
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <MenuBookIcon sx={{ color: '#0f766e', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b' }}>Course History</Typography>
              </Box>
              <Chip label={`${studyHistory.length} Courses`} size="small" sx={{ fontWeight: 800, bgcolor: 'rgba(15,118,110,0.08)', color: '#0f766e', fontSize: '0.72rem' }} />
            </Box>
            <List sx={{ p: 0 }}>
              {studyHistory.length === 0 ? (
                <Box sx={{ py: 5, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>No courses yet. Generate your first plan!</Typography>
                </Box>
              ) : (
                studyHistory.map((course, i) => {
                  const cTotal = (course.plan || []).reduce((s, d) => s + (d.topics?.length || 0), 0);
                  const cDone = (course.plan || []).reduce((s, d) => s + (d.topics?.filter(t => t.completed).length || 0), 0);
                  const cPct = cTotal > 0 ? Math.round((cDone / cTotal) * 100) : 0;
                  return (
                    <ListItem
                      key={course.id || i}
                      sx={{ px: 3, py: 2, borderBottom: i < studyHistory.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none', '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}
                    >
                      <Box sx={{ mr: 2, width: 40, height: 40, borderRadius: 3, bgcolor: 'rgba(15,118,110,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <SchoolIcon sx={{ fontSize: 20, color: '#0f766e' }} />
                      </Box>
                      <ListItemText
                        primary={course.subject}
                        secondary={`${course.level || "Beginner"} • ${course.days || "?"} Days • Started ${course.createdAt || "Recently"}`}
                        primaryTypographyProps={{ fontWeight: 800, color: '#1e293b' }}
                        secondaryTypographyProps={{ fontWeight: 500, fontSize: '0.78rem' }}
                        sx={{ mr: 2 }}
                      />
                      <Box sx={{ width: 80, mr: 2, display: { xs: 'none', sm: 'block' } }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f766e', display: 'block', mb: 0.5 }}>{cPct}%</Typography>
                        <LinearProgress variant="determinate" value={cPct} sx={{ height: 5, borderRadius: 2, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#0f766e' } }} />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Button size="small" variant="outlined" onClick={() => onResumeCourse(course)}
                          sx={{ fontWeight: 800, borderRadius: 2, fontSize: '0.72rem', minWidth: 72 }}>Resume</Button>
                        <IconButton size="small" onClick={() => onDeleteHistory(course.id)}
                          sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', bgcolor: '#fff1f2' } }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                  );
                })
              )}
            </List>
          </Paper>
        </Grid>

        {/* ── Right Column ── */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Radar */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>Cognitive Balance</Typography>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(0,0,0,0.07)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                    <Radar name="You" dataKey="A" stroke="#0f766e" strokeWidth={2.5} fill="#0f766e" fillOpacity={0.12} />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            {/* Badges */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 2.5 }}>Mastery Badges</Typography>
              <Grid container spacing={2}>
                {[
                  { icon: <LocalFireDepartmentIcon />, active: streak >= 3, name: "On Fire", desc: "3-day streak" },
                  { icon: <EmojiEventsIcon />, active: longestStreak >= 7, name: "Elite", desc: "7-day best" },
                  { icon: <CheckCircleIcon />, active: verifiedCount >= 5, name: "Accurate", desc: "5 verified" },
                  { icon: <StarIcon />, active: studyHistory.length >= 2, name: "Scholar", desc: "2+ courses" }
                ].map((badge, i) => (
                  <Grid item xs={6} key={i}>
                    <Box sx={{
                      p: 2, borderRadius: 4, textAlign: 'center',
                      bgcolor: badge.active ? '#1e293b' : 'rgba(0,0,0,0.03)',
                      color: badge.active ? '#fff' : '#cbd5e1',
                      border: badge.active ? 'none' : '1px solid rgba(0,0,0,0.06)',
                      boxShadow: badge.active ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
                      transition: 'all 0.3s'
                    }}>
                      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                        {React.cloneElement(badge.icon, { sx: { fontSize: 28, color: badge.active ? '#06b6d4' : '#cbd5e1' } })}
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', letterSpacing: 0.5 }}>{badge.name.toUpperCase()}</Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.6 }}>{badge.desc}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
