import React, { useMemo } from "react";
import {
  Box, Card, CardContent, Typography, Grid, LinearProgress,
  Chip, Divider, Avatar, List, ListItem, ListItemText, Button,
  Tooltip as MuiTooltip, IconButton
} from "@mui/material";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
} from "recharts";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import StarIcon from "@mui/icons-material/Star";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const C = { primary: "#0F766E", secondary: "#06B6D4", accent: "#8B5CF6" };

function StatCard({ icon, label, value, color, bg }) {
  return (
    <Box sx={{
      p: 2.5, borderRadius: 3,
      background: bg || "#F8FAFC",
      border: `1px solid ${color}20`,
      display: "flex", alignItems: "center", gap: 2,
      transition: "transform 0.2s",
      "&:hover": { transform: "translateY(-2px)" },
    }}>
      <Box sx={{
        width: 44, height: 44, borderRadius: 2.5,
        background: `${color}15`, border: `1px solid ${color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 22, color } })}
      </Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color, lineHeight: 1 }}>{value}</Typography>
        <Typography variant="caption" sx={{ color: "#64748B" }}>{label}</Typography>
      </Box>
    </Box>
  );
}

export default function Profile({ userId, username, studyHistory, plan, subject, level, days, hours, onResumeCourse, onDeleteHistory }) {

  // ── Compute streak from daily scores ──────────────────────────────────────
  const { streak, longestStreak, dailyScores } = useMemo(() => {
    const saved = JSON.parse(localStorage.getItem(`dailyScores_${userId}`) || "[]");
    if (saved.length === 0) return { streak: 0, longestStreak: 0, dailyScores: [] };

    const sorted = [...saved].sort((a, b) => b.date.localeCompare(a.date));
    const today  = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    // Current streak
    let current = 0;
    let checkDate = sorted[0].date === today || sorted[0].date === yesterday ? sorted[0].date : null;
    if (checkDate) {
      for (const entry of sorted) {
        const expected = new Date(new Date(checkDate).getTime() - current * 86400000)
          .toISOString().split("T")[0];
        if (entry.date === expected) current++;
        else break;
      }
    }

    // Longest streak
    let longest = 0, cur = 1;
    const asc = [...saved].sort((a, b) => a.date.localeCompare(b.date));
    for (let i = 1; i < asc.length; i++) {
      const prev = new Date(asc[i - 1].date);
      const curr = new Date(asc[i].date);
      const diff = (curr - prev) / 86400000;
      if (diff === 1) { cur++; longest = Math.max(longest, cur); }
      else cur = 1;
    }
    longest = Math.max(longest, current);

    return { streak: current, longestStreak: longest, dailyScores: asc };
  }, [userId]);

  // ── Current plan stats ─────────────────────────────────────────────────────
  const totalTopics    = plan.reduce((s, d) => s + d.topics.length, 0);
  const completedCount = plan.reduce((s, d) => s + d.topics.filter(t => t.completed).length, 0);
  const verifiedCount  = plan.reduce((s, d) => s + d.topics.filter(t => t.verified).length, 0);
  const completionPct  = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // ── Average daily score ────────────────────────────────────────────────────
  const avgScore = dailyScores.length > 0
    ? Math.round(dailyScores.reduce((s, e) => s + e.score, 0) / dailyScores.length * 100)
    : 0;

  // ── Last 7 days for mini chart ─────────────────────────────────────────────
  const last7 = useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
      const entry = dailyScores.find(e => e.date === d);
      result.push({ date: d, score: entry ? entry.score : null, label: `D${7 - i}` });
    }
    return result;
  }, [dailyScores]);

  const scoreColor = (s) => s >= 0.7 ? "#10B981" : s >= 0.4 ? "#F59E0B" : "#EF4444";

  // ── Mastery Data for Radar ─────────────────────────────────────────────────
  const radarData = useMemo(() => {
    const accuracy    = completedCount > 0 ? (verifiedCount / completedCount) * 100 : 0;
    const consistency = Math.min(100, (streak / 10) * 100);
    const breadth     = Math.min(100, (studyHistory.length / 5) * 100);
    const depth       = studyHistory.filter(h => h.level !== "Beginner").length / (studyHistory.length || 1) * 100;
    const performance = avgScore;

    return [
      { subject: 'Consistency', A: consistency, fullMark: 100 },
      { subject: 'Accuracy',    A: accuracy,    fullMark: 100 },
      { subject: 'Breadth',     A: breadth,     fullMark: 100 },
      { subject: 'Performance', A: performance, fullMark: 100 },
      { subject: 'Depth',       A: depth,       fullMark: 100 },
    ];
  }, [streak, studyHistory, completedCount, verifiedCount, avgScore]);

  // ── Activity Heatmap (Last 28 Days) ────────────────────────────────────────
  const heatmap = useMemo(() => {
    const cells = [];
    for (let i = 27; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
        const entry = dailyScores.find(e => e.date === d);
        cells.push({ date: d, score: entry ? entry.score : 0 });
    }
    return cells;
  }, [dailyScores]);

  const activeCourse = studyHistory[0] || null;

  return (
    <Box sx={{ animation: "fadeIn 0.6s ease-out" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      
      {/* Page header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 4 }}>
        <Avatar 
          sx={{ 
            width: 56, height: 56, 
            background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
            fontWeight: 800, fontSize: "1.2rem",
            boxShadow: "0 4px 12px rgba(15, 118, 110, 0.2)"
          }}
        >
          {username ? username[0].toUpperCase() : "U"}
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A", lineHeight: 1, letterSpacing: -0.5 }}>
            {username || "Learner"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5, fontWeight: 500 }}>
            Mastery Dashboard • {studyHistory.length} Journey{studyHistory.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
      </Box>

      {/* Hero: Continue Learning */}
      {activeCourse && (
        <Card elevation={0} sx={{ 
          mb: 4, borderRadius: 4, 
          background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
          color: "#fff", p: 0, overflow: "hidden",
          position: "relative",
          boxShadow: "0 10px 30px rgba(15, 118, 110, 0.2)"
        }}>
          <Box sx={{ p: 4, zIndex: 2, position: "relative" }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Chip label="ACTIVE COURSE" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, mb: 1.5, backdropFilter: "blur(4px)" }} />
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>{activeCourse.subject}</Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500, mb: 3 }}>
                  Level: {activeCourse.level} • {activeCourse.days} Day Plan
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                   <Button 
                    variant="contained" 
                    onClick={() => onResumeCourse(activeCourse)}
                    startIcon={<PlayCircleFilledIcon />}
                    sx={{ 
                      background: "#fff", color: C.primary, fontWeight: 800, px: 4, py: 1.5, borderRadius: 3,
                      "&:hover": { background: "#f0f0f0", transform: "scale(1.02)" },
                      transition: "all 0.2s"
                    }}
                  >
                    Continue Learning
                  </Button>
                  <Box>
                    <Typography variant="caption" sx={{ display: "block", opacity: 0.8, fontWeight: 700 }}>PROGRESS</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>{completionPct}%</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
                 <Box sx={{ 
                    width: 140, height: 140, borderRadius: "50%", 
                    border: "8px solid rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative"
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 900 }}>{completionPct}%</Typography>
                    <Box sx={{ 
                        position: "absolute", top: -10, right: -10, 
                        background: "#fff", color: C.primary, p: 1, borderRadius: "50%",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}>
                        <AutoAwesomeIcon />
                    </Box>
                 </Box>
              </Grid>
            </Grid>
          </Box>
          {/* Abstract background shapes */}
          <Box sx={{ position: "absolute", top: -50, right: -50, width: 250, height: 250, background: "rgba(255,255,255,0.1)", borderRadius: "50%" }} />
          <Box sx={{ position: "absolute", bottom: -20, left: 100, width: 100, height: 100, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
        </Card>
      )}

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* LEFT COLUMN: Activity & History */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            
            {/* Stats row */}
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <StatCard icon={<LocalFireDepartmentIcon />} label="Streak" value={`${streak}d`} color="#F59E0B" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatCard icon={<EmojiEventsIcon />} label="Best" value={`${longestStreak}d`} color={C.accent} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatCard icon={<MenuBookIcon />} label="Plans" value={studyHistory.length} color={C.primary} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatCard icon={<StarIcon />} label="Verify" value={verifiedCount} color={C.secondary} />
              </Grid>
            </Grid>

            {/* Activity Heatmap */}
            <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#1E293B" }}>Activity Intensity</Typography>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>Last 28 Days</Typography>
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: 1 }}>
                  {heatmap.map((cell, idx) => (
                      <MuiTooltip key={idx} title={`${cell.date}: ${Math.round(cell.score * 100)}%`}>
                          <Box sx={{ 
                              pt: "100%", borderRadius: 1.5, 
                              background: cell.score === 0 ? "#F1F5F9" : scoreColor(cell.score),
                              opacity: cell.score === 0 ? 1 : 0.6 + (cell.score * 0.4),
                              transition: "transform 0.1s",
                              "&:hover": { transform: "scale(1.2)", zIndex: 1, cursor: "pointer" }
                          }} />
                      </MuiTooltip>
                  ))}
              </Box>
            </Card>

            {/* Detailed Study History */}
            <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0" }}>
              <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 1.5, justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <MenuBookIcon sx={{ color: C.primary, fontSize: 18 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#1E293B" }}>My Learning History</Typography>
                </Box>
                <Chip label={`${studyHistory.length} Courses`} size="small" sx={{ background: `${C.primary}15`, color: C.primary, fontWeight: 700, fontSize: "0.65rem" }} />
              </Box>
              <CardContent sx={{ p: 0 }}>
                {studyHistory.length === 0 ? (
                  <Typography variant="body2" sx={{ color: "#94A3B8", textAlign: "center", py: 4 }}>
                    No sessions yet. Time to start the journey!
                  </Typography>
                ) : (
                  <List sx={{ p: 0 }}>
                    {studyHistory.slice(0, 6).map((entry, i) => {
                      const entryTotal     = entry.plan ? entry.plan.reduce((s, d) => s + (d.topics?.length || 0), 0) : 0;
                      const entryCompleted = entry.plan ? entry.plan.reduce((s, d) => s + (d.topics?.filter(t => t.completed).length || 0), 0) : 0;
                      const entryPct       = entryTotal > 0 ? Math.round((entryCompleted / entryTotal) * 100) : 0;

                      return (
                        <ListItem key={entry.id} sx={{
                          px: 3, py: 1.5,
                          borderBottom: i < Math.min(studyHistory.length, 6) - 1 ? "1px solid #F1F5F9" : "none",
                          "&:hover": { background: "#F8FAFC" },
                          display: "flex", alignItems: "center", gap: 2
                        }}>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: "#1E293B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {entry.subject}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                              {entry.createdAt} • {entry.level}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ width: 80, display: { xs: "none", sm: "block" } }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: C.primary, fontSize: "0.6rem" }}>{entryPct}%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={entryPct} sx={{ height: 4, borderRadius: 2, background: "#E2E8F0", "& .MuiLinearProgress-bar": { background: C.primary } }} />
                          </Box>

                          <Button size="small" onClick={() => onResumeCourse(entry)}
                            sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.7rem", color: C.primary, mr: 1, "&:hover": { background: `${C.primary}10` } }}>
                            Resume
                          </Button>
                          
                          <IconButton size="small" onClick={() => onDeleteHistory(entry.id)} sx={{ color: "#94A3B8", "&:hover": { color: "#EF4444", background: "#FFF5F5" } }}>
                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* RIGHT COLUMN: Mastery & Progress */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            
            {/* Radar Chart Card */}
            <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", p: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#1E293B", mb: 2 }}>Learning Profile</Typography>
              <Box sx={{ height: 260, width: "100%", display: "flex", justifyContent: "center" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#E2E8F0" strokeWidth={1} />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 800, fill: "#64748B" }} />
                    <Radar
                      name="Student" dataKey="A"
                      stroke={C.primary} strokeWidth={2}
                      fill={C.primary} fillOpacity={0.2}
                      animationBegin={100} animationDuration={800}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </Card>

            {/* Achievement Badges */}
            <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", p: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#1E293B", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <EmojiEventsIcon sx={{ color: "#F59E0B", fontSize: 18 }} /> Achievements
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                  {[
                      { icon: <LocalFireDepartmentIcon />, active: streak >= 3, color: "#F59E0B" },
                      { icon: <SchoolIcon />, active: studyHistory.length >= 3, color: C.primary },
                      { icon: <CheckCircleIcon />, active: verifiedCount >= 5, color: "#10B981" },
                      { icon: <TrendingUpIcon />, active: completionPct >= 50, color: C.secondary },
                      { icon: <StarIcon />, active: studyHistory.some(h => h.level === "Advanced"), color: C.accent },
                  ].map((badge, i) => (
                    <Box key={i} sx={{ 
                        p: 1.25, borderRadius: 2, border: "1px solid",
                        borderColor: badge.active ? `${badge.color}30` : "#F1F5F9",
                        background: badge.active ? `${badge.color}08` : "#F8FAFC",
                        color: badge.active ? badge.color : "#CBD5E1",
                        opacity: badge.active ? 1 : 0.5,
                        display: "flex",
                        transition: "all 0.2s"
                    }}>{React.cloneElement(badge.icon, { sx: { fontSize: 20 } })}</Box>
                  ))}
              </Box>
            </Card>

            {/* Active Plan Card */}
            {plan.length > 0 && (
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", p: 2.5, background: "#F8FAFC" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#1E293B", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircleIcon sx={{ color: C.primary, fontSize: 18 }} /> Current Progress
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: "#475569" }}>{subject}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: C.primary }}>{completionPct}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={completionPct}
                    sx={{ height: 6, borderRadius: 3, background: "#E2E8F0", "& .MuiLinearProgress-bar": { background: C.primary } }} />
                </Box>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, background: "#fff", borderRadius: 2, border: "1px solid #F1F5F9" }}>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: C.primary, lineHeight: 1 }}>{verifiedCount}</Typography>
                      <Typography variant="caption" sx={{ color: "#94A3B8" }}>Verified</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, background: "#fff", borderRadius: 2, border: "1px solid #F1F5F9" }}>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: "#475569", lineHeight: 1 }}>{totalTopics - completedCount}</Typography>
                      <Typography variant="caption" sx={{ color: "#94A3B8" }}>Left</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
