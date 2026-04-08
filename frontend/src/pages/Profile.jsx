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

      {/* Hero: Continue Learning */}
      {activeCourse && (
        <Card elevation={0} sx={{ 
          mb: 4, borderRadius: 4, 
          background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
          color: "#fff", p: 0, overflow: "hidden",
          position: "relative",
          boxShadow: "0 10px 30px rgba(15, 118, 110, 0.2)"
        }}>
          <Box sx={{ p: 4, z_index: 2, position: "relative" }}>
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

      {/* Stats row & Mastery Radar */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <StatCard icon={<LocalFireDepartmentIcon />} label="Current Streak" value={`${streak}d`} color="#F59E0B" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard icon={<EmojiEventsIcon />} label="Top Streak" value={`${longestStreak}d`} color={C.accent} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard icon={<MenuBookIcon />} label="Total Plans" value={studyHistory.length} color={C.primary} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard icon={<StarIcon />} label="Verified" value={verifiedCount} color={C.secondary} />
            </Grid>
            
            {/* Activity Heatmap Card */}
            <Grid item xs={12}>
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1E293B" }}>Activity Intensity</Typography>
                    <Typography variant="caption" sx={{ color: "#64748B" }}>Last 28 Days</Typography>
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: 1 }}>
                    {heatmap.map((cell, idx) => (
                        <MuiTooltip key={idx} title={`${cell.date}: ${Math.round(cell.score * 100)}%`}>
                            <Box sx={{ 
                                pt: "100%", 
                                borderRadius: 1.5, 
                                background: cell.score === 0 ? "#F1F5F9" : scoreColor(cell.score),
                                opacity: cell.score === 0 ? 1 : 0.6 + (cell.score * 0.4),
                                transition: "transform 0.1s",
                                "&:hover": { transform: "scale(1.2)", zIndex: 1, cursor: "pointer" }
                            }} />
                        </MuiTooltip>
                    ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1E293B", mb: 2 }}>Learning Profile</Typography>
              <Box sx={{ height: 280, width: "100%", display: "flex", justifyContent: "center" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: "#64748B" }} />
                    <Radar
                      name="Student"
                      dataKey="A"
                      stroke={C.primary}
                      fill={C.primary}
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Achievement Badges */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", p: 3, background: "#fff" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1E293B", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <EmojiEventsIcon sx={{ color: "#F59E0B" }} /> Achievements & Badges
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {[
                    { label: "Consistent Learner", icon: <LocalFireDepartmentIcon />, active: streak >= 3, color: "#F59E0B", text: "3+ Day Streak" },
                    { label: "Course Explorer", icon: <SchoolIcon />, active: studyHistory.length >= 3, color: C.primary, text: "3+ Plans Created" },
                    { label: "Quiz Whiz", icon: <CheckCircleIcon />, active: verifiedCount >= 5, color: "#10B981", text: "5+ Quizzes Passed" },
                    { label: "Deep Diver", icon: <TrendingUpIcon />, active: completionPct >= 50, color: C.secondary, text: "50% Completion" },
                    { label: "Scholar", icon: <StarIcon />, active: studyHistory.some(h => h.level === "Advanced"), color: C.accent, text: "Advanced Level" },
                ].map((badge, i) => (
                    <MuiTooltip key={i} title={badge.text}>
                        <Box sx={{ 
                            p: 1.5, borderRadius: 2, border: "1px solid",
                            borderColor: badge.active ? `${badge.color}30` : "#E2E8F0",
                            background: badge.active ? `${badge.color}08` : "#F8FAFC",
                            display: "flex", alignItems: "center", gap: 1.5,
                            opacity: badge.active ? 1 : 0.4,
                            filter: badge.active ? "none" : "grayscale(100%)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": { transform: badge.active ? "translateY(-4px)" : "none", boxShadow: badge.active ? "0 4px 12px rgba(0,0,0,0.05)" : "none" }
                        }}>
                            <Box sx={{ color: badge.active ? badge.color : "#94A3B8" }}>{badge.icon}</Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: badge.active ? "#1E293B" : "#94A3B8" }}>{badge.label}</Typography>
                        </Box>
                    </MuiTooltip>
                ))}
            </Box>
          </Card>
        </Grid>

        {/* Course Details Grid */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", height: "100%" }}>
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 1.5 }}>
              <CheckCircleIcon sx={{ color: C.primary, fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B" }}>
                Active Plan Progress
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              {plan.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#94A3B8", textAlign: "center", py: 3 }}>
                   No active plan. Start a new study journey!
                </Typography>
              ) : (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: "#1E293B" }}>{activeCourse?.subject || subject}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: C.primary }}>{completionPct}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={completionPct}
                      sx={{ height: 10, borderRadius: 5, background: "#E2E8F0",
                        "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})`, borderRadius: 5 } }} />
                  </Box>

                  <Grid container spacing={2}>
                    {[
                      { label: "Verified Topics", value: verifiedCount, icon: <StarIcon /> },
                      { label: "Remaining", value: totalTopics - completedCount, icon: <MenuBookIcon /> },
                    ].map(s => (
                      <Grid item xs={6} key={s.label}>
                        <Box sx={{ p: 2, background: "#F8FAFC", borderRadius: 2.5, textAlign: "left", border: "1px solid #F1F5F9" }}>
                          <Typography variant="h5" sx={{ fontWeight: 900, color: C.primary, lineHeight: 1, mb: 0.5 }}>{s.value}</Typography>
                          <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>{s.label}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
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
