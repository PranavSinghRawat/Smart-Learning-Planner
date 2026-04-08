import React, { useMemo } from "react";
import {
  Box, Card, CardContent, Typography, Grid, LinearProgress,
  Chip, Divider, Avatar, List, ListItem, ListItemText, Button,
} from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";

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

export default function Profile({ userId, username, studyHistory, plan, subject, level, days, hours, onResumeCourse }) {

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
          <SchoolIcon sx={{ fontSize: 26, color: C.primary }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
            My Profile
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748B" }}>
            Your learning journey at a glance
          </Typography>
        </Box>
      </Box>

      {/* Profile card */}
      <Card elevation={0} sx={{ mb: 3, borderRadius: 3, border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <Box sx={{
          px: 3, py: 3,
          background: `linear-gradient(135deg, ${C.primary}10, ${C.secondary}08)`,
          borderBottom: "1px solid #E2E8F0",
          display: "flex", alignItems: "center", gap: 2.5,
        }}>
          <Avatar sx={{
            width: 56, height: 56, fontSize: "1.4rem", fontWeight: 800,
            background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
          }}>
            {(username || "U").charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>{username}</Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              {studyHistory.length} course{studyHistory.length !== 1 ? "s" : ""} started
            </Typography>
          </Box>
          {streak > 0 && (
            <Box sx={{
              display: "flex", alignItems: "center", gap: 0.5,
              px: 2, py: 1, borderRadius: 2,
              background: "#FEF3C7", border: "1px solid #FDE68A",
            }}>
              <LocalFireDepartmentIcon sx={{ color: "#F59E0B", fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#92400E" }}>
                {streak} day streak
              </Typography>
            </Box>
          )}
        </Box>
      </Card>

      {/* Stats row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard icon={<LocalFireDepartmentIcon />} label="Current Streak" value={`${streak}d`} color="#F59E0B" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard icon={<EmojiEventsIcon />} label="Longest Streak" value={`${longestStreak}d`} color={C.accent} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard icon={<MenuBookIcon />} label="Courses Started" value={studyHistory.length} color={C.primary} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard icon={<TrendingUpIcon />} label="Avg Daily Score" value={`${avgScore}%`} color={C.secondary} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Current plan progress */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", height: "100%" }}>
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 1.5 }}>
              <CheckCircleIcon sx={{ color: C.primary, fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B" }}>
                Current Plan
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              {plan.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#94A3B8", textAlign: "center", py: 3 }}>
                  No active plan. Generate one in Study Planner.
                </Typography>
              ) : (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#1E293B" }}>{subject}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: C.primary }}>{completionPct}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={completionPct}
                      sx={{ height: 8, borderRadius: 4, background: "#E2E8F0",
                        "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})`, borderRadius: 4 } }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                      <Typography variant="caption" sx={{ color: "#64748B" }}>{completedCount}/{totalTopics} topics</Typography>
                      <Typography variant="caption" sx={{ color: "#64748B" }}>{level}</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={1.5}>
                    {[
                      { label: "Days", value: days },
                      { label: "Hours/day", value: hours },
                      { label: "Verified", value: verifiedCount },
                      { label: "Remaining", value: totalTopics - completedCount },
                    ].map(s => (
                      <Grid item xs={6} key={s.label}>
                        <Box sx={{ p: 1.5, background: "#F8FAFC", borderRadius: 2, textAlign: "center" }}>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: C.primary, lineHeight: 1 }}>{s.value}</Typography>
                          <Typography variant="caption" sx={{ color: "#64748B" }}>{s.label}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Last 7 days activity */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", height: "100%" }}>
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 1.5 }}>
              <CalendarTodayIcon sx={{ color: C.primary, fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B" }}>
                Last 7 Days Activity
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end", height: 80, mb: 1 }}>
                {last7.map((d, i) => (
                  <Box key={i} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                    {d.score !== null ? (
                      <>
                        <Typography sx={{ fontSize: "0.55rem", color: "#64748B", fontWeight: 700 }}>
                          {Math.round(d.score * 100)}%
                        </Typography>
                        <Box sx={{
                          width: "100%",
                          height: `${Math.max(d.score * 60, 4)}px`,
                          background: `linear-gradient(180deg, ${scoreColor(d.score)}, ${scoreColor(d.score)}99)`,
                          borderRadius: "3px 3px 0 0",
                          transition: "height 0.4s",
                        }} />
                      </>
                    ) : (
                      <>
                        <Typography sx={{ fontSize: "0.55rem", color: "#CBD5E1" }}>—</Typography>
                        <Box sx={{ width: "100%", height: "4px", background: "#E2E8F0", borderRadius: "3px 3px 0 0" }} />
                      </>
                    )}
                    <Typography sx={{ fontSize: "0.55rem", color: "#94A3B8", fontWeight: 600 }}>{d.label}</Typography>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {[
                  { color: "#10B981", label: "On Track (≥70%)" },
                  { color: "#F59E0B", label: "At Risk (40-69%)" },
                  { color: "#EF4444", label: "Needs Attention (<40%)" },
                ].map(l => (
                  <Box key={l.label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                    <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.65rem" }}>{l.label}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Study history */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0" }}>
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 1.5 }}>
              <MenuBookIcon sx={{ color: C.primary, fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B" }}>
                Courses Started
              </Typography>
              <Chip label={studyHistory.length} size="small"
                sx={{ background: `${C.primary}15`, color: C.primary, fontWeight: 700, fontSize: "0.7rem" }} />
            </Box>
            <CardContent sx={{ p: 0 }}>
              {studyHistory.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#94A3B8", textAlign: "center", py: 4 }}>
                  No courses yet. Start studying to see your history here.
                </Typography>
              ) : (
                <List sx={{ p: 0 }}>
                  {studyHistory.slice(0, 8).map((entry, i) => {
                    const entryTotal     = entry.plan ? entry.plan.reduce((s, d) => s + (d.topics?.length || 0), 0) : 0;
                    const entryCompleted = entry.plan ? entry.plan.reduce((s, d) => s + (d.topics?.filter(t => t.completed).length || 0), 0) : 0;
                    const entryPct       = entryTotal > 0 ? Math.round((entryCompleted / entryTotal) * 100) : 0;

                    return (
                      <ListItem key={entry.id} sx={{
                        px: 3, py: 2,
                        borderBottom: i < Math.min(studyHistory.length, 8) - 1 ? "1px solid #F1F5F9" : "none",
                        "&:hover": { background: "#F8FAFC" },
                        display: "flex", alignItems: "center", flexWrap: { xs: "wrap", sm: "nowrap" }, gap: 1
                      }}>
                        <Box sx={{
                          width: 36, height: 36, borderRadius: 2, mr: 1, flexShrink: 0,
                          background: `${C.primary}12`, border: `1px solid ${C.primary}20`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <MenuBookIcon sx={{ fontSize: 18, color: C.primary }} />
                        </Box>
                        
                        <ListItemText
                          sx={{ flex: 1, minWidth: { xs: "100%", sm: "auto" }, mb: { xs: 1, sm: 0 } }}
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 700, color: "#1E293B" }}>
                              {entry.subject}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                              {entry.createdAt} · {entry.days}d · {entry.hours}h/d
                            </Typography>
                          }
                        />

                        {entry.plan && (
                          <Box sx={{ width: { xs: "100%", sm: 100 }, mr: { sm: 2 }, mb: { xs: 1, sm: 0 } }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                              <Typography variant="caption" sx={{ fontWeight: 700, color: C.primary, fontSize: "0.6rem" }}>
                                {entryPct}%
                              </Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={entryPct} sx={{ height: 4, borderRadius: 2, background: "#E2E8F0", "& .MuiLinearProgress-bar": { background: C.primary, borderRadius: 2 } }} />
                          </Box>
                        )}

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>
                          <Chip label={entry.level} size="small" sx={{
                            background: entry.level === "Beginner" ? "#F0FDF4" : entry.level === "Intermediate" ? "#EFF6FF" : "#F5F3FF",
                            color: entry.level === "Beginner" ? "#065F46" : entry.level === "Intermediate" ? "#1D4ED8" : "#6D28D9",
                            fontWeight: 600, fontSize: "0.65rem", height: 20
                          }} />
                          <Button 
                            variant="contained" 
                            size="small" 
                            onClick={() => onResumeCourse(entry)}
                            sx={{ 
                              textTransform: "none", 
                              fontWeight: 700, 
                              fontSize: "0.7rem", 
                              background: C.primary,
                              borderRadius: 1.5,
                              px: 1.5,
                              minWidth: 70,
                              "&:hover": { background: C.secondary }
                            }}
                          >
                            Resume
                          </Button>
                        </Box>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
