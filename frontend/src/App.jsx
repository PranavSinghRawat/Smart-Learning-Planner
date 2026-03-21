import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent,
  Button, TextField, MenuItem, FormControl, InputLabel, Select,
  Chip, Box, LinearProgress, Paper, Snackbar, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, Tabs, Tab,
  List, ListItem, ListItemText, ListItemIcon, Accordion,
  AccordionSummary, AccordionDetails, Divider,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
import ExamPlanner from "./pages/ExamPlanner";
import CareerGoals from "./pages/CareerGoals";
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
    emoji: "🎯",
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

  const getCustomSubjectsKey = (uid) => `customSubjects_${uid}`;
  const getStudyHistoryKey   = (uid) => `studyHistory_${uid}`;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user  = localStorage.getItem('user');
    if (token && user) {
      const userData = JSON.parse(user);
      setCurrentUserId(userData.id);
      setCurrentUsername(userData.username || '');
      setIsAuthenticated(true);
      const cs = localStorage.getItem(getCustomSubjectsKey(userData.id));
      if (cs) setCustomSubjects(JSON.parse(cs));
      const sh = localStorage.getItem(getStudyHistoryKey(userData.id));
      if (sh) setStudyHistory(JSON.parse(sh));
    }
  }, []);

  useEffect(() => {
    if (currentUserId) localStorage.setItem(getCustomSubjectsKey(currentUserId), JSON.stringify(customSubjects));
  }, [customSubjects, currentUserId]);

  useEffect(() => {
    if (currentUserId) localStorage.setItem(getStudyHistoryKey(currentUserId), JSON.stringify(studyHistory));
  }, [studyHistory, currentUserId]);

  useEffect(() => {
    let interval;
    if (timerActive) interval = setInterval(() => setTimerSeconds(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
      emoji: "🎯", fullName: customSubjectName,
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
    showSnackbar(`✨ Custom subject "${customSubjectName}" created!`);
  };

  const allSubjects = { ...BASE_SUBJECTS, ...customSubjects };

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
    showSnackbar('🤖 Gemini AI is generating your study plan...', 'info');
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
          showSnackbar('✅ AI study plan generated by Gemini!');
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
    showSnackbar('✅ Study plan generated!');
    setLoading(false);
  };

  const toggleSubtopic = (dayIndex, subIndex) => {
    const updated = plan.map((d, di) =>
      di !== dayIndex ? d : { ...d, topics: d.topics.map((t, ti) => ti !== subIndex ? t : { ...t, completed: !t.completed }) }
    );
    setPlan(updated);
    const action = updated[dayIndex].topics[subIndex].completed ? 'completed' : 'uncompleted';
    showSnackbar(`✅ Topic ${action}!`);
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

  if (!isAuthenticated) return <Auth onLoginSuccess={() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUserId(user.id);
    setCurrentUsername(user.username || '');
    setToken(localStorage.getItem('token') || '');
    const cs = localStorage.getItem(getCustomSubjectsKey(user.id));
    if (cs) setCustomSubjects(JSON.parse(cs));
    const sh = localStorage.getItem(getStudyHistoryKey(user.id));
    if (sh) setStudyHistory(JSON.parse(sh));
    setIsAuthenticated(true);
  }} />;

  const currentSubjectData = resolveSubject(subject);

  return (
    <Box sx={{ background: COLORS.bg, minHeight: "100vh" }}>
      {/* NAVBAR */}
      <AppBar position="sticky" sx={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, boxShadow: "0 4px 20px rgba(15,118,110,0.15)" }}>
        <Toolbar sx={{ flexWrap: "wrap", gap: 0.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>📚 Smart Learning Planner</Typography>
            {currentUsername && <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>👋 {currentUsername}</Typography>}
          </Box>
          {[["📖 Study Planner", 0], ["📝 Exam Planner", 1], ["🎯 Career Goals", 2], ["🧠 Smart Plan", 3], ["🔮 AI Predictor", 4]].map(([label, idx]) => (
            <Button key={idx} color="inherit" onClick={() => setActiveTab(idx)}
              sx={{ textTransform: "capitalize", fontWeight: activeTab === idx ? 700 : 400,
                background: activeTab === idx ? "rgba(255,255,255,0.2)" : "transparent",
                borderRadius: 2, "&:hover": { background: "rgba(255,255,255,0.1)" } }}>
              {label}
            </Button>
          ))}
          <Button color="inherit" onClick={() => setShowHistory(!showHistory)}
            sx={{ textTransform: "capitalize", "&:hover": { background: "rgba(255,255,255,0.1)" } }}>
            📋 History
          </Button>
          <Button color="inherit" onClick={handleLogout}
            sx={{ textTransform: "capitalize", "&:hover": { background: "rgba(255,255,255,0.1)" } }}>
            🚪 Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* NEW PAGES */}
        {activeTab === 1 && <ExamPlanner token={token} />}
        {activeTab === 2 && <CareerGoals userId={currentUserId} />}
        {activeTab === 3 && <SmartPlan token={token} userId={currentUserId} />}
        {activeTab === 4 && <PerformancePredictor />}

        {/* STUDY PLANNER (tab 0) */}
        {activeTab === 0 && (<>
        {/* HISTORY PANEL */}
        {showHistory && (
          <Card sx={{ mb: 3, borderRadius: 3, background: "#F0F9FF", border: `2px solid ${COLORS.secondary}` }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>📚 Your Study History</Typography>
                <Button size="small" onClick={() => setShowHistory(false)}>Close</Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {studyHistory.length === 0 ? (
                <Typography color="textSecondary">No study history yet. Start planning!</Typography>
              ) : (
                <List>
                  {studyHistory.map(entry => (
                    <ListItem key={entry.id} sx={{ borderBottom: "1px solid #E2E8F0", "&:last-child": { borderBottom: "none" } }}>
                      <ListItemText
                        primary={`${resolveSubject(entry.subject)?.emoji || "🎯"} ${entry.subject} - ${entry.level}`}
                        secondary={`📅 ${entry.createdAt} | ⏱️ ${entry.days} days × ${entry.hours}h/day`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        )}

        {/* CONTROLS */}
        <Paper elevation={0} sx={{ p: 3, mb: 4, background: COLORS.cardBg, borderRadius: 3, border: "1px solid #E2E8F0" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: COLORS.primary }}>📋 Plan Your Study</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Type <strong>anything</strong> — DSA, Pottery, Urdu, Chess, Cooking, Quantum Physics — and get a full study plan with resources.
          </Typography>

          {currentSubjectData && subject.trim() && (
            <Box sx={{ mb: 3, p: 2, background: "#F0F9FF", borderRadius: 2, border: `2px solid ${COLORS.secondary}`, display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="h4">{currentSubjectData.emoji}</Typography>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{currentSubjectData.fullName}</Typography>
                <Typography variant="body2" color="textSecondary">{currentSubjectData.description}</Typography>
                {!CATALOG_DB[subject] && (
                  <Chip label="✨ Auto-generated plan" size="small" sx={{ mt: 0.5, background: "#FEF9C3", color: "#92400E", fontWeight: 600 }} />
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
                  <MenuItem value="Beginner">🌱 Beginner</MenuItem>
                  <MenuItem value="Intermediate">📈 Intermediate</MenuItem>
                  <MenuItem value="Advanced">🚀 Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button fullWidth variant="contained"
                sx={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, borderRadius: 2, fontWeight: 600, py: 1.5 }}
                onClick={generatePlan} disabled={loading}>
                {loading ? '🤖 Generating...' : '🚀 Generate'}
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant="outlined"
                sx={{ borderColor: COLORS.primary, color: COLORS.primary, borderRadius: 2, fontWeight: 600, py: 1.5 }}
                onClick={() => setShowCustomDialog(true)}>
                ✨ Custom Plan
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* CUSTOM SUBJECT DIALOG */}
        <Dialog open={showCustomDialog} onClose={() => setShowCustomDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 600, fontSize: '1.3rem', background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, color: '#fff' }}>
            ✨ Create Custom Study Plan
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField fullWidth label="Subject Name" placeholder="e.g., Advanced Databases, Cloud Computing"
              value={customSubjectName} onChange={e => setCustomSubjectName(e.target.value)} sx={{ mb: 3 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>📚 Add Topics by Level</Typography>
            <Tabs value={customLevelTab} onChange={(e, v) => setCustomLevelTab(v)} sx={{ mb: 2, borderBottom: `2px solid ${COLORS.secondary}` }}>
              <Tab label="🌱 Beginner" sx={{ fontWeight: 600 }} />
              <Tab label="📈 Intermediate" sx={{ fontWeight: 600 }} />
              <Tab label="🚀 Advanced" sx={{ fontWeight: 600 }} />
            </Tabs>
            {[["Beginner","beginner"],["Intermediate","intermediate"],["Advanced","advanced"]].map(([key, label], i) => (
              <Box key={key} sx={{ display: customLevelTab === i ? 'block' : 'none' }}>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                  💡 Add {label}-level topics (one per line)
                </Typography>
                <TextField fullWidth multiline rows={5} label={`${key} Topics`} placeholder="Topic 1&#10;Topic 2&#10;Topic 3"
                  value={customTopics[key]} onChange={e => setCustomTopics({ ...customTopics, [key]: e.target.value })} />
              </Box>
            ))}
            <Alert severity="info" sx={{ mt: 2 }}>📌 Tip: Topics will appear exactly as you type them in your study plan!</Alert>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => { setShowCustomDialog(false); setCustomTopics({ Beginner: "", Intermediate: "", Advanced: "" }); setCustomLevelTab(0); }}>Cancel</Button>
            <Button variant="contained" sx={{ background: COLORS.primary }} onClick={handleCreateCustomSubject}>Create Custom Plan</Button>
          </DialogActions>
        </Dialog>

        {/* TIMER */}
        {plan.length > 0 && (
          <Card sx={{ mb: 4, borderRadius: 3, background: `linear-gradient(135deg, ${COLORS.primary}10, ${COLORS.secondary}10)`, border: `2px solid ${COLORS.secondary}` }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>⏱️ Study Timer</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: COLORS.primary, fontFamily: "monospace" }}>
                    {formatTimer(timerSeconds)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button variant="contained"
                    sx={{ background: timerActive ? COLORS.behind : COLORS.ahead, borderRadius: 2 }}
                    startIcon={timerActive ? <PauseIcon /> : <PlayArrowIcon />}
                    onClick={() => setTimerActive(!timerActive)}>
                    {timerActive ? "Pause" : "Start"}
                  </Button>
                  <Button variant="outlined"
                    sx={{ borderColor: COLORS.primary, color: COLORS.primary, borderRadius: 2 }}
                    startIcon={<StopIcon />}
                    onClick={() => { setTimerSeconds(0); setTimerActive(false); showSnackbar('⏱️ Timer reset'); }}>
                    Reset
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* CHARTS */}
        {plan.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>📊 Overall Progress</Typography>
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={80}>
                          <Cell fill={COLORS.ahead} />
                          <Cell fill="#E2E8F0" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.primary }}>{totalProgress}%</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {pieData[0].value} of {pieData[0].value + pieData[1].value} completed
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>📈 Day-wise Progress</Typography>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={barData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={v => `${v}%`} />
                      <Bar dataKey="progress" fill={COLORS.secondary} radius={[8, 8, 0, 0]} />
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
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: COLORS.primary }}>
              📅 Your Study Plan ({days} Days)
            </Typography>
            <Grid container spacing={3}>
              {plan.map((day, i) => {
                const status = statusInfo(day);
                return (
                  <Grid item xs={12} key={i}>
                    <Accordion defaultExpanded={i === 0} sx={{ borderRadius: 2, border: `2px solid ${status.color}20` }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ background: "#F9FAFB", py: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.primary, minWidth: 80 }}>
                            Day {day.day}
                          </Typography>
                          <Box sx={{ flex: 1 }}>
                            <LinearProgress variant="determinate" value={dayProgress(day)}
                              sx={{ height: 8, borderRadius: 4, background: "#E2E8F0", "& .MuiLinearProgress-bar": { background: status.color } }} />
                          </Box>
                          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: status.color }}>{dayProgress(day)}%</Typography>
                            <Chip label={status.text} size="small" sx={{ background: status.color, color: "#fff" }} />
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 3, background: "#FAFBFC" }}>
                        <List sx={{ p: 0 }}>
                          {day.topics.map((topic, j) => (
                            <ListItem key={j}
                              sx={{ py: 1.5, borderBottom: "1px solid #E2E8F0", "&:last-child": { borderBottom: "none" }, transition: "all 0.2s", alignItems: "flex-start" }}>
                              <ListItemIcon sx={{ minWidth: 40, mt: 0.5, cursor: "pointer" }} onClick={() => toggleSubtopic(i, j)}>
                                {topic.completed
                                  ? <CheckCircleIcon sx={{ color: COLORS.ahead, fontSize: 24 }} />
                                  : <RadioButtonUncheckedIcon sx={{ color: "#CBD5E1", fontSize: 24 }} />}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography
                                    onClick={() => toggleSubtopic(i, j)}
                                    sx={{ fontWeight: 600, textDecoration: topic.completed ? "line-through" : "none", color: topic.completed ? "#94A3B8" : "#1E293B", cursor: "pointer" }}>
                                    {topic.name}
                                  </Typography>
                                }
                                secondary={
                                  <Box component="span">
                                    <Typography variant="caption" sx={{ color: "#64748B" }}>⏱️ {topic.hours}h • Click to mark complete</Typography>
                                    <ResourcePanel topicName={topic.name} />
                                  </Box>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                        <Box sx={{ mt: 2, pt: 2, borderTop: "2px solid #E2E8F0" }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748B" }}>
                            ✅ {day.topics.filter(t => t.completed).length} of {day.topics.length} completed
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

        {plan.length === 0 && (
          <Paper elevation={0} sx={{ p: 8, textAlign: "center", borderRadius: 3, border: "2px dashed #CBD5E1" }}>
            <Typography variant="h5" sx={{ color: "#64748B", fontWeight: 600, mb: 1 }}>📚 No Plan Generated Yet</Typography>
            <Typography variant="body2" color="textSecondary">Choose a subject and click "Generate Plan" to start learning!</Typography>
          </Paper>
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
