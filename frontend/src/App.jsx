import React, { useState, useEffect, useMemo } from "react";
import {
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent,
  Button, TextField, MenuItem, FormControl, InputLabel, Select,
  Chip, Box, LinearProgress, Paper, Snackbar, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, Tabs, Tab,
  List, ListItem, ListItemText, ListItemIcon, Accordion,
  AccordionSummary, AccordionDetails, Divider,
  InputAdornment, Skeleton, Fade,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TimerIcon from "@mui/icons-material/Timer";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TuneIcon from "@mui/icons-material/Tune";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PsychologyIcon from "@mui/icons-material/Psychology";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar,
  XAxis, YAxis, ResponsiveContainer,
} from "recharts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import SmartPlan from "./pages/SmartPlan";
import PerformancePredictor from "./pages/PerformancePredictor";
import ResourcePanel from "./components/ResourcePanel";
import { SUBJECTS_DB as CATALOG_DB } from "./data/subjects";

const COLORS = {
  ahead: "#10B981", track: "#F59E0B", behind: "#EF4444",
  primary: "#0F766E", secondary: "#06B6D4",
  bg: "#F8FAFC", cardBg: "#FFFFFF",
};

// ── Generic curriculum generator for ANY subject not in the catalog ──────────
function generateTopicsForAnySubject(name) {
  const n = name.trim();
  return {
    emoji: "",
    fullName: n,
    description: `A structured learning path for ${n} — from fundamentals to advanced mastery`,
    category: "custom",
    Beginner: [
      `${n} - What it is, history, and why it matters`,
      `${n} - Core terminology and fundamental concepts`,
      `${n} - Essential tools, setup, and environment`,
      `${n} - Your first hands-on exercise or project`,
      `${n} - Common beginner mistakes and how to avoid them`,
      `${n} - Beginner practice: apply what you've learned`,
    ],
    Intermediate: [
      `${n} - Deeper theory: how and why things work`,
      `${n} - Practical techniques used by practitioners`,
      `${n} - Solving real problems and common challenges`,
      `${n} - Intermediate project: build something meaningful`,
      `${n} - Best practices, standards, and conventions`,
      `${n} - Community, books, and resources to go deeper`,
    ],
    Advanced: [
      `${n} - Advanced theory and specialized sub-topics`,
      `${n} - Expert-level techniques and edge cases`,
      `${n} - Latest research, trends, and innovations`,
      `${n} - Advanced project: portfolio-worthy work`,
      `${n} - Teaching and explaining to solidify mastery`,
      `${n} - Career paths, niches, and professional growth`,
    ],
  };
}

// Merge catalog with any user-created custom subjects
const BASE_SUBJECTS = { ...CATALOG_DB };
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUsername, setCurrentUsername] = useState('');
  const [subject, setSubject] = useState("DSA");
  const [days, setDays] = useState(3);
  const [hours, setHours] = useState(2);
  const [level, setLevel] = useState("Beginner");
  const [plan, setPlan] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' });
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customSubjectName, setCustomSubjectName] = useState("");
  const [customLevelTab, setCustomLevelTab] = useState(0);
  const [customTopics, setCustomTopics] = useState({ Beginner: "", Intermediate: "", Advanced: "" });
  const [customSubjects, setCustomSubjects] = useState({});
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [studyHistory, setStudyHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [smartPlanContext, setSmartPlanContext] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [completedFlash, setCompletedFlash] = useState(null); // "dayIdx-topicIdx"

  const getCustomSubjectsKey = (uid) => `customSubjects_${uid}`;
  const getStudyHistoryKey   = (uid) => `studyHistory_${uid}`;
  const getActivePlanKey     = (uid) => `activePlan_${uid}`;
  const getActivePlanMetaKey = (uid) => `activePlanMeta_${uid}`;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user  = localStorage.getItem('user');
    if (token && user) {
      const userData = JSON.parse(user);
      setCurrentUserId(userData.id);
      setCurrentUsername(userData.username || '');
      setIsAuthenticated(true);
      setShowLanding(false);
      const cs = localStorage.getItem(getCustomSubjectsKey(userData.id));
      if (cs) setCustomSubjects(JSON.parse(cs));
      const sh = localStorage.getItem(getStudyHistoryKey(userData.id));
      if (sh) setStudyHistory(JSON.parse(sh));
      // Restore last active plan
      const ap = localStorage.getItem(getActivePlanKey(userData.id));
      if (ap) setPlan(JSON.parse(ap));
      const apm = localStorage.getItem(getActivePlanMetaKey(userData.id));
      if (apm) {
        const meta = JSON.parse(apm);
        setSubject(meta.subject || 'DSA');
        setDays(meta.days || 3);
        setHours(meta.hours || 2);
        setLevel(meta.level || 'Beginner');
      }
    }
  }, []);

  useEffect(() => {
    if (currentUserId) localStorage.setItem(getCustomSubjectsKey(currentUserId), JSON.stringify(customSubjects));
  }, [customSubjects, currentUserId]);

  useEffect(() => {
    if (currentUserId) localStorage.setItem(getStudyHistoryKey(currentUserId), JSON.stringify(studyHistory));
  }, [studyHistory, currentUserId]);

  // Persist active plan so page refresh doesn't wipe it
  useEffect(() => {
    if (currentUserId && plan.length > 0) {
      localStorage.setItem(getActivePlanKey(currentUserId), JSON.stringify(plan));
      localStorage.setItem(getActivePlanMetaKey(currentUserId), JSON.stringify({ subject, days, hours, level }));
    }
  }, [plan, currentUserId]);

  useEffect(() => {
    let interval;
    if (timerActive) interval = setInterval(() => setTimerSeconds(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (currentUserId) {
      localStorage.removeItem(getActivePlanKey(currentUserId));
      localStorage.removeItem(getActivePlanMetaKey(currentUserId));
    }
    setIsAuthenticated(false);
    setCurrentUserId(null);
    setCurrentUsername('');
    setPlan([]);
    setStudyHistory([]);
    setCustomSubjects({});
  };

  const showSnackbar = (message, type = 'success') => setSnackbar({ open: true, message, type });

  const formatTimer = (seconds) => {
    const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = seconds % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  const handleCreateCustomSubject = () => {
    if (!customSubjectName.trim()) { showSnackbar('Please enter subject name', 'error'); return; }
    if (!customTopics.Beginner.trim() && !customTopics.Intermediate.trim() && !customTopics.Advanced.trim()) {
      showSnackbar('Please add at least one topic', 'error'); return;
    }
    const parse = (t) => t.split('\n').map(x => x.trim()).filter(x => x.length > 0);
    setCustomSubjects({ ...customSubjects, [customSubjectName]: {
      emoji: "", fullName: customSubjectName,
      description: `Custom learning path for ${customSubjectName}`,
      Beginner: parse(customTopics.Beginner),
      Intermediate: parse(customTopics.Intermediate),
      Advanced: parse(customTopics.Advanced),
    }});
    setSubject(customSubjectName);
    setShowCustomDialog(false);
    setCustomSubjectName("");
    setCustomTopics({ Beginner: "", Intermediate: "", Advanced: "" });
    setCustomLevelTab(0);
    showSnackbar(`Custom subject "${customSubjectName}" created`);
  };

  const allSubjects = useMemo(() => ({ ...BASE_SUBJECTS, ...customSubjects }), [customSubjects]);

  // Resolve subject data — catalog hit, custom hit, or auto-generate for anything
  const resolveSubject = (name) => {
    if (allSubjects[name]) return allSubjects[name];
    if (name && name.trim()) return generateTopicsForAnySubject(name.trim());
    return null;
  };

  const generatePlan = async () => {
    const subData = resolveSubject(subject);
    if (!subject.trim()) { showSnackbar('Please enter a subject name', 'error'); return; }
    setLoading(true);
    showSnackbar('Generating your study plan...', 'info');
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const res = await fetch(`${base}/resources/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, days, hours, level }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.plan && data.plan.length > 0) {
          setPlan(data.plan.map(d => ({ ...d, topics: d.topics.map(t => ({ ...t, completed: false })) })));
          setStudyHistory([{ id: Date.now(), subject, level, days, hours, createdAt: new Date().toLocaleDateString(), completionPercentage: 0 }, ...studyHistory]);
          showSnackbar('AI study plan generated!');
          setLoading(false);
          return;
        }
      }
    } catch (e) {}
    // Fallback to local generation if Gemini fails
    const topics = subData?.[level] || [];
    if (!topics.length) { showSnackbar('No topics available for this level', 'error'); setLoading(false); return; }
    const topicsPerDay = Math.ceil(topics.length / days);
    const hoursPerTopic = hours / topicsPerDay;
    const planData = [];
    let idx = 0;
    for (let day = 1; day <= days && idx < topics.length; day++) {
      const dayTopics = [];
      for (let i = 0; i < topicsPerDay && idx < topics.length; i++) {
        dayTopics.push({ name: topics[idx++], completed: false, hours: hoursPerTopic.toFixed(1) });
      }
      planData.push({ day, topics: dayTopics });
    }
    setPlan(planData);
    setStudyHistory([{ id: Date.now(), subject, level, days, hours, createdAt: new Date().toLocaleDateString(), completionPercentage: 0 }, ...studyHistory]);
    showSnackbar('Study plan generated!');
    setLoading(false);
  };

  // Save today's study score to localStorage for LSTM predictor
  const saveDailyScore = (updatedPlan) => {
    const total = updatedPlan.reduce((s, d) => s + d.topics.length, 0);
    const done  = updatedPlan.reduce((s, d) => s + d.topics.filter(t => t.completed).length, 0);
    const score = total === 0 ? 0 : parseFloat((done / total).toFixed(2));
    const key = `dailyScores_${currentUserId}`;
    const today = new Date().toISOString().split('T')[0];
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    // Update today's entry or add new one
    const idx = existing.findIndex(e => e.date === today);
    if (idx >= 0) existing[idx].score = score;
    else existing.push({ date: today, score });
    // Keep only last 30 days
    const sorted = existing.sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
    localStorage.setItem(key, JSON.stringify(sorted));
  };

  const toggleSubtopic = (dayIndex, subIndex) => {
    const updated = plan.map((d, di) =>
      di !== dayIndex ? d : { ...d, topics: d.topics.map((t, ti) => ti !== subIndex ? t : { ...t, completed: !t.completed }) }
    );
    setPlan(updated);
    saveDailyScore(updated);
    const nowCompleted = updated[dayIndex].topics[subIndex].completed;
    if (nowCompleted) {
      const key = `${dayIndex}-${subIndex}`;
      setCompletedFlash(key);
      setTimeout(() => setCompletedFlash(null), 700);
    }
    showSnackbar(nowCompleted ? 'Topic completed!' : 'Topic uncompleted');
  };

  const dayProgress = (day) => {
    const total = day.topics.length, done = day.topics.filter(t => t.completed).length;
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  const statusInfo = (day) => {
    const p = dayProgress(day);
    if (p < 50) return { text: "Behind",   color: COLORS.behind };
    if (p < 80) return { text: "On Track", color: COLORS.track };
    return             { text: "Ahead",    color: COLORS.ahead };
  };

  const barData = plan.map(d => ({ name: `Day ${d.day}`, progress: dayProgress(d) }));
  const pieData = [
    { name: "Completed", value: plan.reduce((s, d) => s + d.topics.filter(x => x.completed).length, 0) || 0 },
    { name: "Remaining", value: plan.reduce((s, d) => s + d.topics.filter(x => !x.completed).length, 0) || 0 },
  ];
  const totalProgress = pieData[0].value + pieData[1].value > 0
    ? Math.round((pieData[0].value / (pieData[0].value + pieData[1].value)) * 100) : 0;

  if (showLanding && !isAuthenticated) return <Landing onGetStarted={() => setShowLanding(false)} />;

  if (!isAuthenticated) return <Auth onLoginSuccess={() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUserId(user.id);
    setCurrentUsername(user.username || '');
    setToken(localStorage.getItem('token') || '');
    const cs = localStorage.getItem(getCustomSubjectsKey(user.id));
    if (cs) setCustomSubjects(JSON.parse(cs));
    const sh = localStorage.getItem(getStudyHistoryKey(user.id));
    if (sh) setStudyHistory(JSON.parse(sh));
    const ap = localStorage.getItem(getActivePlanKey(user.id));
    if (ap) setPlan(JSON.parse(ap));
    const apm = localStorage.getItem(getActivePlanMetaKey(user.id));
    if (apm) {
      const meta = JSON.parse(apm);
      setSubject(meta.subject || 'DSA');
      setDays(meta.days || 3);
      setHours(meta.hours || 2);
      setLevel(meta.level || 'Beginner');
    }
    setIsAuthenticated(true);
  }} />;

  const currentSubjectData = resolveSubject(subject);

  return (
    <Box sx={{ background: COLORS.bg, minHeight: "100vh" }}>
      {/* NAVBAR */}
      <AppBar position="sticky" elevation={0} sx={{
        background: "#fff",
        borderBottom: "1px solid #E2E8F0",
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
      }}>
        <Toolbar sx={{ gap: 1, minHeight: { xs: 56, sm: 64 } }}>
          {/* Logo */}
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography variant="h6" sx={{
              fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2,
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontSize: { xs: "1rem", sm: "1.15rem" },
            }}>
              Smart Learning Planner
            </Typography>
            {currentUsername && (
              <Typography variant="caption" sx={{ color: "#64748B", lineHeight: 1 }}>
                {currentUsername}
              </Typography>
            )}
          </Box>

          {/* Nav tabs */}
          {[["Study Planner", 0], ["Smart Plan", 1], ["AI Predictor", 2]].map(([label, idx]) => (
            <Button
              key={idx}
              onClick={() => setActiveTab(idx)}
              sx={{
                textTransform: "none",
                fontWeight: activeTab === idx ? 700 : 500,
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                color: activeTab === idx ? COLORS.primary : "#64748B",
                background: activeTab === idx ? `${COLORS.primary}10` : "transparent",
                borderRadius: 2,
                px: { xs: 1, sm: 1.5 },
                py: 0.8,
                borderBottom: activeTab === idx ? `2px solid ${COLORS.primary}` : "2px solid transparent",
                transition: "all 0.2s",
                "&:hover": { background: `${COLORS.primary}08`, color: COLORS.primary },
              }}
            >
              {label}
            </Button>
          ))}

          {/* History + Logout */}
          <Button
            onClick={() => setShowHistory(!showHistory)}
            sx={{
              textTransform: "none", color: "#64748B", fontSize: "0.8rem",
              borderRadius: 2, px: 1.5, minWidth: "auto",
              "&:hover": { background: "#F1F5F9", color: COLORS.primary },
            }}
          >
            <HistoryIcon sx={{ fontSize: 20 }} />
          </Button>
          <Button
            onClick={handleLogout}
            variant="outlined"
            sx={{
              textTransform: "none", color: "#64748B", fontSize: "0.8rem",
              borderRadius: 2, px: 1.5, borderColor: "#E2E8F0",
              "&:hover": { borderColor: "#EF4444", color: "#EF4444", background: "#FFF5F5" },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* NEW PAGES */}
        {activeTab === 1 && <Fade in={activeTab === 1} timeout={300}><Box><SmartPlan token={token} userId={currentUserId} dayContext={smartPlanContext} onClearDay={() => { setSmartPlanContext(null); setActiveTab(0); }} /></Box></Fade>}
        {activeTab === 2 && <Fade in={activeTab === 2} timeout={300}><Box><PerformancePredictor userId={currentUserId} token={token} /></Box></Fade>}

        {/* STUDY PLANNER (tab 0) */}
        {activeTab === 0 && (<>
        {/* HISTORY PANEL */}
        {showHistory && (
          <Card elevation={0} sx={{ mb: 3, borderRadius: 3, background: "#fff", border: "1px solid #E2E8F0", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", animation: "slideDown 0.2s ease" }}>
            <CardContent sx={{ pb: "16px !important" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: 2, background: `${COLORS.secondary}15`, border: `1px solid ${COLORS.secondary}25`, display: "flex", alignItems: "center", justifyContent: "center" }}><MenuBookIcon sx={{ fontSize: 18, color: COLORS.secondary }} /></Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>Study History</Typography>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>{studyHistory.length} session{studyHistory.length !== 1 ? "s" : ""} recorded</Typography>
                </Box>
                <Button size="small" onClick={() => setShowHistory(false)} sx={{ color: "#94A3B8", textTransform: "none", fontWeight: 600, "&:hover": { color: "#EF4444", background: "#FFF5F5" } }}>Close</Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {studyHistory.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#94A3B8", textAlign: "center", py: 2 }}>No study history yet. Start planning!</Typography>
              ) : (
                <List sx={{ p: 0 }}>
                  {studyHistory.map(entry => (
                    <ListItem key={entry.id} sx={{ px: 0, py: 1, borderBottom: "1px solid #F1F5F9", "&:last-child": { borderBottom: "none" } }}>
                      <ListItemText
                        primary={<Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>{entry.subject} — {entry.level}</Typography>}
                        secondary={<Typography variant="caption" sx={{ color: "#94A3B8" }}>{entry.createdAt} · {entry.days} days × {entry.hours}h/day</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        )}

        {/* CONTROLS */}
        <Paper elevation={0} sx={{ p: 3, mb: 4, background: COLORS.cardBg, borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: 2,
              background: `${COLORS.primary}12`, border: `1px solid ${COLORS.primary}20`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><TuneIcon sx={{ fontSize: 18, color: COLORS.primary }} /></Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>Plan Your Study</Typography>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Type anything — DSA, Guitar, French, Quantum Physics — and get a full AI plan
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />

          {currentSubjectData && subject.trim() && (
            <Box sx={{ mb: 3, p: 2, background: "#F0F9FF", borderRadius: 2, border: `2px solid ${COLORS.secondary}`, display: "flex", alignItems: "center", gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{currentSubjectData.fullName}</Typography>
                <Typography variant="body2" color="textSecondary">{currentSubjectData.description}</Typography>
                {!CATALOG_DB[subject] && (
                  <Chip label="Auto-generated plan" size="small" sx={{ mt: 0.5, background: "#FEF9C3", color: "#92400E", fontWeight: 600 }} />
                )}
              </Box>
            </Box>
          )}

          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="What do you want to learn?"
                placeholder="e.g. Machine Learning, Guitar, French, Pottery..."
                value={subject}
                onChange={e => setSubject(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && generatePlan()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: COLORS.primary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth label="Days" type="number" value={days}
                onChange={e => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: 365 }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth label="Hours/Day" type="number" value={hours}
                onChange={e => setHours(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                inputProps={{ min: 0.5, step: 0.5 }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select value={level} onChange={e => setLevel(e.target.value)} sx={{ borderRadius: 2 }} label="Level">
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button fullWidth variant="contained"
                sx={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, borderRadius: 2, fontWeight: 600, py: 1.5 }}
                onClick={generatePlan} disabled={loading}>
                {loading ? 'Generating...' : 'Generate'}
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant="outlined"
                sx={{ borderColor: COLORS.primary, color: COLORS.primary, borderRadius: 2, fontWeight: 600, py: 1.5 }}
                onClick={() => setShowCustomDialog(true)}>
                Custom Plan
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* CUSTOM SUBJECT DIALOG */}
        <Dialog open={showCustomDialog} onClose={() => setShowCustomDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 600, fontSize: '1.3rem', background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, color: '#fff' }}>
            Create Custom Study Plan
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField fullWidth label="Subject Name" placeholder="e.g., Advanced Databases, Cloud Computing"
              value={customSubjectName} onChange={e => setCustomSubjectName(e.target.value)} sx={{ mb: 3 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0F172A", mb: 2 }}>Add Topics by Level</Typography>
            {/* Pill-style tab switcher */}
            <Box sx={{ display: "flex", gap: 1, mb: 2.5, p: 0.5, background: "#F1F5F9", borderRadius: 2.5, width: "fit-content" }}>
              {[["Beginner", 0], ["Intermediate", 1], ["Advanced", 2]].map(([label, idx]) => (
                <Button key={idx} size="small" onClick={() => setCustomLevelTab(idx)}
                  sx={{
                    textTransform: "none", fontWeight: 600, fontSize: "0.8rem",
                    borderRadius: 2, px: 2, py: 0.6,
                    background: customLevelTab === idx ? "#fff" : "transparent",
                    color: customLevelTab === idx ? COLORS.primary : "#64748B",
                    boxShadow: customLevelTab === idx ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.2s",
                    "&:hover": { background: customLevelTab === idx ? "#fff" : "#E2E8F0" },
                  }}>
                  {label}
                </Button>
              ))}
            </Box>
            {[["Beginner","beginner"],["Intermediate","intermediate"],["Advanced","advanced"]].map(([key, label], i) => (
              <Box key={key} sx={{ display: customLevelTab === i ? 'block' : 'none' }}>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                  Add {label}-level topics (one per line)
                </Typography>
                <TextField fullWidth multiline rows={5} label={`${key} Topics`} placeholder="Topic 1&#10;Topic 2&#10;Topic 3"
                  value={customTopics[key]} onChange={e => setCustomTopics({ ...customTopics, [key]: e.target.value })} />
              </Box>
            ))}
            <Alert severity="info" sx={{ mt: 2 }}>Tip: Topics will appear exactly as you type them in your study plan!</Alert>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => { setShowCustomDialog(false); setCustomTopics({ Beginner: "", Intermediate: "", Advanced: "" }); setCustomLevelTab(0); }}>Cancel</Button>
            <Button variant="contained" sx={{ background: COLORS.primary }} onClick={handleCreateCustomSubject}>Create Custom Plan</Button>
          </DialogActions>
        </Dialog>

        {/* TIMER — compact inline bar */}
        {plan.length > 0 && (
          <Paper elevation={0} sx={{
            mb: 3, px: 3, py: 1.5, borderRadius: 3,
            border: "1px solid #E2E8F0",
            background: "#fff",
            display: "flex", alignItems: "center", gap: 2,
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
          }}>
            <Box sx={{
              width: 32, height: 32, borderRadius: 2,
              background: `${COLORS.primary}12`, border: `1px solid ${COLORS.primary}20`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}><TimerIcon sx={{ fontSize: 18, color: COLORS.primary }} /></Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748B", flexShrink: 0 }}>Study Timer</Typography>
            <Typography sx={{
              fontWeight: 800, color: COLORS.primary, fontFamily: "monospace",
              fontSize: "1.25rem", letterSpacing: 2, flexShrink: 0,
            }}>
              {formatTimer(timerSeconds)}
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Button size="small" variant="contained"
              sx={{
                background: timerActive ? COLORS.behind : COLORS.ahead,
                borderRadius: 2, textTransform: "none", fontWeight: 600,
                px: 2, py: 0.6, fontSize: "0.8rem",
                boxShadow: "none", "&:hover": { boxShadow: "none" },
              }}
              startIcon={timerActive ? <PauseIcon sx={{ fontSize: "0.9rem !important" }} /> : <PlayArrowIcon sx={{ fontSize: "0.9rem !important" }} />}
              onClick={() => setTimerActive(!timerActive)}>
              {timerActive ? "Pause" : "Start"}
            </Button>
            <Button size="small" variant="outlined"
              sx={{ borderColor: "#E2E8F0", color: "#64748B", borderRadius: 2, textTransform: "none", fontWeight: 600, px: 2, py: 0.6, fontSize: "0.8rem", "&:hover": { borderColor: COLORS.primary, color: COLORS.primary } }}
              startIcon={<StopIcon sx={{ fontSize: "0.9rem !important" }} />}
              onClick={() => { setTimerSeconds(0); setTimerActive(false); showSnackbar('Timer reset'); }}>
              Reset
            </Button>
          </Paper>
        )}

        {/* CHARTS */}
        {plan.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 1px 8px rgba(0,0,0,0.05)", height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: 2, background: `${COLORS.ahead}15`, border: `1px solid ${COLORS.ahead}25`, display: "flex", alignItems: "center", justifyContent: "center" }}><TrendingUpIcon sx={{ fontSize: 18, color: COLORS.ahead }} /></Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>Overall Progress</Typography>
                      <Typography variant="caption" sx={{ color: "#64748B" }}>{pieData[0].value} of {pieData[0].value + pieData[1].value} topics done</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" innerRadius={45} outerRadius={72}>
                        <Cell fill={COLORS.ahead} />
                        <Cell fill="#E2E8F0" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ textAlign: "center", mt: 1 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: COLORS.primary, lineHeight: 1 }}>{totalProgress}%</Typography>
                    <Typography variant="caption" sx={{ color: "#64748B" }}>completion rate</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: 2, background: `${COLORS.secondary}15`, border: `1px solid ${COLORS.secondary}25`, display: "flex", alignItems: "center", justifyContent: "center" }}><TrendingUpIcon sx={{ fontSize: 18, color: COLORS.secondary }} /></Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>Day-wise Progress</Typography>
                      <Typography variant="caption" sx={{ color: "#64748B" }}>Completion % per study day</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                      <Tooltip formatter={v => [`${v}%`, "Progress"]} contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                      <Bar dataKey="progress" fill={COLORS.secondary} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* DAY CARDS */}
        {plan.length > 0 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: 2, background: `${COLORS.primary}12`, border: `1px solid ${COLORS.primary}20`, display: "flex", alignItems: "center", justifyContent: "center" }}><CalendarTodayIcon sx={{ fontSize: 18, color: COLORS.primary }} /></Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0F172A" }}>
                Your Study Plan <Typography component="span" variant="caption" sx={{ color: "#64748B", fontWeight: 500 }}>({days} days)</Typography>
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {plan.map((day, i) => {
                const status = statusInfo(day);
                return (
                  <Grid item xs={12} key={i}>
                    <Accordion defaultExpanded={i === 0} elevation={0} sx={{
                      borderRadius: "12px !important", border: `1px solid #E2E8F0`,
                      overflow: "hidden",
                      transition: "box-shadow 0.2s, border-color 0.2s",
                      "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)", borderColor: `${status.color}50` },
                      "&:before": { display: "none" },
                    }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#64748B" }} />} sx={{
                        background: "#FAFBFC",
                        borderBottom: "1px solid #E2E8F0",
                        py: 1.5, px: 2.5,
                        "&.Mui-expanded": { background: `${status.color}06` },
                      }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                          <Box sx={{
                            width: 36, height: 36, borderRadius: 2, flexShrink: 0,
                            background: `${status.color}15`, border: `1px solid ${status.color}30`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Typography sx={{ fontWeight: 800, fontSize: "0.8rem", color: status.color }}>D{day.day}</Typography>
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A" }}>Day {day.day}</Typography>
                              <Chip label={status.text} size="small" sx={{ background: `${status.color}15`, color: status.color, fontWeight: 700, fontSize: "0.65rem", height: 20, border: `1px solid ${status.color}30` }} />
                            </Box>
                            <LinearProgress variant="determinate" value={dayProgress(day)}
                              sx={{ height: 6, borderRadius: 3, background: "#E2E8F0", "& .MuiLinearProgress-bar": { background: status.color, borderRadius: 3 } }} />
                          </Box>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: status.color, flexShrink: 0 }}>{dayProgress(day)}%</Typography>
                          <Button size="small" variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSmartPlanContext({ day: day.day, topics: day.topics, subject, hours });
                              setActiveTab(1);
                            }}
                            sx={{
                              borderColor: `${COLORS.primary}40`, color: COLORS.primary, borderRadius: 2,
                              fontSize: "0.7rem", py: 0.4, px: 1.2, minWidth: "auto", whiteSpace: "nowrap",
                              textTransform: "none", fontWeight: 600, flexShrink: 0,
                              "&:hover": { background: `${COLORS.primary}08`, borderColor: COLORS.primary },
                            }}>
                            Smart Plan
                          </Button>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 2, pb: 2, px: 2.5, background: "#fff" }}>
                        <List sx={{ p: 0 }}>
                          {day.topics.map((topic, j) => {
                            const flashKey = `${i}-${j}`;
                            const isFlashing = completedFlash === flashKey;
                            return (
                            <ListItem key={j}
                              sx={{
                                py: 1.5, borderBottom: "1px solid #F1F5F9", "&:last-child": { borderBottom: "none" },
                                transition: "all 0.25s", alignItems: "flex-start",
                                background: isFlashing ? `${COLORS.ahead}10` : "transparent",
                                borderRadius: 2,
                                "&:hover": { background: "#F8FAFC" },
                              }}>
                              <ListItemIcon sx={{ minWidth: 40, mt: 0.5, cursor: "pointer" }} onClick={() => toggleSubtopic(i, j)}>
                                {topic.completed
                                  ? <CheckCircleIcon sx={{ color: COLORS.ahead, fontSize: 22, transition: "transform 0.2s", transform: isFlashing ? "scale(1.3)" : "scale(1)" }} />
                                  : <RadioButtonUncheckedIcon sx={{ color: "#CBD5E1", fontSize: 22 }} />}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography
                                    onClick={() => toggleSubtopic(i, j)}
                                    sx={{ fontWeight: 600, fontSize: "0.9rem", textDecoration: topic.completed ? "line-through" : "none", color: topic.completed ? "#94A3B8" : "#1E293B", cursor: "pointer" }}>
                                    {topic.name}
                                  </Typography>
                                }
                                secondary={
                                  <Box component="span">
                                    <Typography variant="caption" sx={{ color: "#94A3B8" }}>{topic.hours}h • Click to mark complete</Typography>
                                    <ResourcePanel topicName={topic.name} />
                                  </Box>
                                }
                              />
                            </ListItem>
                          ); })}
                        </List>
                        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 1 }}>
                          <CheckCircleIcon sx={{ fontSize: 14, color: COLORS.ahead }} />
                          <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748B" }}>
                            {day.topics.filter(t => t.completed).length} of {day.topics.length} completed
                          </Typography>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {plan.length === 0 && loading && (
          <Box sx={{ mt: 2 }}>
            {[1,2,3].map(i => (
              <Card key={i} sx={{ mb: 2, borderRadius: 3 }}>
                <CardContent>
                  <Skeleton variant="text" width="30%" height={32} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4, mb: 2 }} />
                  {[1,2,3].map(j => (
                    <Box key={j} sx={{ display: "flex", gap: 2, mb: 1.5, alignItems: "center" }}>
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="text" width="70%" />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {plan.length === 0 && !loading && (
          <Box sx={{
            mt: 4, textAlign: "center", py: 10,
            border: "1px dashed #CBD5E1", borderRadius: 4,
            background: "linear-gradient(135deg, #F8FAFC, #F0F9FF)",
          }}>
            <Box sx={{
              width: 80, height: 80, borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}15)`,
              border: `2px solid ${COLORS.primary}20`,
              display: "flex", alignItems: "center", justifyContent: "center",
              mx: "auto", mb: 3, fontSize: "2rem",
            }}>
              <MenuBookIcon sx={{ fontSize: 36, color: COLORS.primary }} />
            </Box>
            <Typography variant="h6" sx={{ color: "#1E293B", fontWeight: 700, mb: 1 }}>
              No study plan yet
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mb: 3, maxWidth: 320, mx: "auto" }}>
              Type any subject above and click Generate to get a personalized AI study plan.
            </Typography>
            <Button
              variant="contained"
              onClick={generatePlan}
              disabled={loading || !subject.trim()}
              sx={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                borderRadius: 2, fontWeight: 700, textTransform: "none",
                px: 3, py: 1.2,
              }}
            >
              Generate My Plan
            </Button>
          </Box>
        )}
        </>)}
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.type} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
