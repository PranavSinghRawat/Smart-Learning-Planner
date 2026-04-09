import React, { useState, useEffect, useMemo } from "react";
import {
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent,
  Button, TextField, MenuItem, FormControl, InputLabel, Select,
  Chip, Box, LinearProgress, Paper, Snackbar, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, Tabs, Tab,
  List, ListItem, ListItemText, ListItemIcon, Accordion,
  AccordionSummary, AccordionDetails, Divider,
  InputAdornment, Skeleton, Fade, CssBaseline, ThemeProvider,
  Drawer, IconButton, ListItemButton, useMediaQuery, useTheme
} from "@mui/material";
import theme from "./theme";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
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
import LockIcon from "@mui/icons-material/Lock";
import Planner from "./pages/Planner";
import SmartPlan from "./pages/SmartPlan";
import PerformancePredictor from "./pages/PerformancePredictor";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import QuizDialog from "./components/QuizDialog";
import CodingChallengeDialog from "./components/CodingChallengeDialog";
import { exportStudyPlanPDF } from "./utils/exportPDF";
import { SUBJECTS_DB as CATALOG_DB } from "./data/subjects";

const COLORS = {
  ahead: "#10B981", track: "#F59E0B", behind: "#EF4444",
  primary: "#0F766E", secondary: "#06B6D4",
  bg: "#F8FAFC", cardBg: "#FFFFFF",
};

const isCodingTopic = (name) => {
  const n = name.toLowerCase();
  return n.includes('build') || n.includes('coding') || n.includes('implement') || n.includes('create') || n.includes('program') || n.includes('develop');
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
  const [quizOpen, setQuizOpen]           = useState(false);
  const [codingOpen, setCodingOpen]       = useState(false);
  const [quizTopic, setQuizTopic]         = useState({ name: "", subject: "", dayIdx: 0, topicIdx: 0 });
  const [duplicatePlan, setDuplicatePlan] = useState(null);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const DRAWER_WIDTH = 280;

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

  // Persist active plan + sync to history so resume works
  useEffect(() => {
    if (currentUserId && plan.length > 0) {
      localStorage.setItem(getActivePlanKey(currentUserId), JSON.stringify(plan));
      localStorage.setItem(getActivePlanMetaKey(currentUserId), JSON.stringify({ subject, days, hours, level }));
      
      // Sync the latest plan state to study history
      setStudyHistory(prev => {
        const idx = prev.findIndex(h => h.subject === subject);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], plan };
          return updated;
        }
        return prev;
      });
    }
  }, [plan, currentUserId, subject, days, hours, level]);

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

  const generatePlan = async (forceNew = false) => {
    const subData = resolveSubject(subject);
    if (!subject.trim()) { showSnackbar('Please enter a subject name', 'error'); return; }

    // DEDUPLICATION: Check if this exact course already exists
    if (!forceNew) {
      const existing = studyHistory.find(h => h.subject.toLowerCase() === subject.toLowerCase() && h.level === level);
      if (existing) {
        setDuplicatePlan(existing);
        setResumeDialogOpen(true);
        return;
      }
    }

    setLoading(true);
    showSnackbar('Generating your learning sprint...', 'info');
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
          const newPlan = data.plan.map(d => ({ ...d, topics: d.topics.map(t => ({ ...t, completed: false })) }));
          const historyEntry = { id: Date.now(), subject, level, days, hours, createdAt: new Date().toLocaleDateString(), plan: newPlan };
          
          setPlan(newPlan);
          // Deduplicate: Remove any existing history entry with the same config
          setStudyHistory(prev => {
            const filtered = prev.filter(h => 
              !(h.subject === subject && h.level === level && h.days === days && h.hours === hours)
            );
            return [historyEntry, ...filtered];
          });
          
          showSnackbar('AI study plan generated!');
          setLoading(false);
          return;
        }
      }
    } catch (e) {}

    // Fallback logic
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
    const historyEntry2 = { id: Date.now(), subject, level, days, hours, createdAt: new Date().toLocaleDateString(), plan: planData };
    
    setPlan(planData);
    // Deduplicate: Remove any existing history entry with the same config
    setStudyHistory(prev => {
      const filtered = prev.filter(h => 
        !(h.subject === subject && h.level === level && h.days === days && h.hours === hours)
      );
      return [historyEntry2, ...filtered];
    });
    
    showSnackbar('Study plan generated!');
    setLoading(false);
  };

  const handleDeleteHistory = (id) => {
    setStudyHistory(prev => prev.filter(h => h.id !== id));
    showSnackbar("Course removed from history", "info");
  };

  // Save today's study score to localStorage for LSTM predictor
  // quizBonus: extra weight added when topic is verified by quiz (0 = unverified, 1 = perfect quiz)
  const saveDailyScore = (updatedPlan, quizBonus = 0) => {
    const total    = updatedPlan.reduce((s, d) => s + d.topics.length, 0);
    const done     = updatedPlan.reduce((s, d) => s + d.topics.filter(t => t.completed).length, 0);
    const verified = updatedPlan.reduce((s, d) => s + d.topics.filter(t => t.verified).length, 0);
    // Base score: completion ratio. Verified topics add a 10% bonus per verified topic
    const baseScore    = total === 0 ? 0 : done / total;
    const verifyBonus  = total === 0 ? 0 : (verified / total) * 0.1;
    const score        = parseFloat(Math.min(1, baseScore + verifyBonus + quizBonus * 0.05).toFixed(2));
    const key          = `dailyScores_${currentUserId}`;
    const today        = new Date().toISOString().split('T')[0];
    const existing     = JSON.parse(localStorage.getItem(key) || '[]');
    const idx          = existing.findIndex(e => e.date === today);
    if (idx >= 0) existing[idx].score = score;
    else existing.push({ date: today, score });
    const sorted = existing.sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
    localStorage.setItem(key, JSON.stringify(sorted));
  };

  const toggleSubtopic = (dayIndex, subIndex) => {
    const topic = plan[dayIndex].topics[subIndex];
    // If unchecking — just uncheck directly
    if (topic.completed) {
      const updated = plan.map((d, di) =>
        di !== dayIndex ? d : { ...d, topics: d.topics.map((t, ti) => ti !== subIndex ? t : { ...t, completed: false, verified: false }) }
      );
      setPlan(updated);
      saveDailyScore(updated);
      showSnackbar('Topic uncompleted');
      return;
    }
    // If checking — open coding challenge for coding topics, quiz for others
    setQuizTopic({ name: topic.name, subject, dayIdx: dayIndex, topicIdx: subIndex });
    if (isCodingTopic(topic.name)) {
      setCodingOpen(true);
    } else {
      setQuizOpen(true);
    }
  };

  const handleQuizPass = (correct, total, skipped = false) => {
    setQuizOpen(false);
    if (skipped) {
      showSnackbar('Skill verification required to progress', 'warning');
      return;
    }
    const { dayIdx, topicIdx } = quizTopic;
    const quizScore = total > 0 ? correct / total : 0;
    const passed = total > 0 && (correct / total) >= 0.6;
    
    if (!passed) {
      showSnackbar('Minimum mastery not met. Try again!', 'error');
      return;
    }

    const updated = plan.map((d, di) =>
      di !== dayIdx ? d : {
        ...d, topics: d.topics.map((t, ti) =>
          ti !== topicIdx ? t : { ...t, completed: true, verified: true, quizScore }
        )
      }
    );
    setPlan(updated);
    saveDailyScore(updated, quizScore);
    const key = `${dayIdx}-${topicIdx}`;
    setCompletedFlash(key);
    setTimeout(() => setCompletedFlash(null), 700);
    showSnackbar(`Module mastered! ${correct}/${total} correct`);
  };

  const handleQuizFail = () => {
    setQuizOpen(false);
    showSnackbar('Mastery check failed. Review concepts and try again.', 'warning');
  };

  const isTopicLocked = (dayIdx, topicIdx) => {
    if (dayIdx === 0 && topicIdx === 0) return false;
    
    // Get all previous topics in a flat list
    const flatTopics = plan.flatMap(d => d.topics);
    const currentIdx = plan.slice(0, dayIdx).reduce((acc, d) => acc + d.topics.length, 0) + topicIdx;
    
    // Locked if any previous topic is not completed
    return !flatTopics[currentIdx - 1].completed;
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

  const navItems = [
    { label: "Study Planner", icon: <DashboardIcon />, idx: 0 },
    { label: "Smart Plan AI", icon: <AutoFixHighIcon />, idx: 1 },
    { label: "AI Predictor", icon: <AssessmentIcon />, idx: 2 },
    { label: "Profile", icon: <PersonIcon />, idx: 3 },
  ];

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ mb: 4, mt: 2, display: 'flex', alignItems: 'center', gap: 1.5, px: 2 }}>
        <Box sx={{ 
          width: 40, height: 40, borderRadius: 3, 
          background: 'linear-gradient(135deg, #0f766e 0%, #06b6d4 100%)',
          display: 'flex', alignItems: 'center', justifyCenter: 'center',
          color: '#fff', fontSize: '1.5rem'
        }}>
          🎓
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -1, color: muiTheme.palette.primary.dark }}>
          MasteryUI
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1, px: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.idx} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => { setActiveTab(item.idx); setSidebarOpen(false); }}
              selected={activeTab === item.idx}
              sx={{
                borderRadius: 4,
                py: 1.5,
                px: 2.5,
                '&.Mui-selected': {
                  background: 'rgba(15, 118, 110, 0.08)',
                  color: muiTheme.palette.primary.main,
                  '&:hover': { background: 'rgba(15, 118, 110, 0.12)' },
                  '& .MuiListItemIcon-root': { color: muiTheme.palette.primary.main }
                },
                color: '#64748b',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontWeight: activeTab === item.idx ? 700 : 500 }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2, opacity: 0.5 }} />
      
      <Box sx={{ p: 2, background: 'rgba(255,255,255,0.4)', borderRadius: 4, mb: 2 }}>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>
          LOGGED IN AS
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
          {currentUsername || "Student"}
        </Typography>
      </Box>

      <Button
        fullWidth
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{ 
          justifyContent: 'flex-start', color: '#ef4444', 
          py: 1.5, px: 2.5, borderRadius: 4, 
          '&:hover': { background: '#fef2f2' } 
        }}
      >
        Sign Out
      </Button>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        
        {/* GLOBAL TEMPORARY DRAWER */}
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ModalProps={{ keepMounted: true }} // Better open performance on mobile.
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH, 
              border: 'none',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          {sidebarContent}
        </Drawer>

        {/* MAIN CONTENT AREA */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* TOP APP BAR (Global) */}
          <AppBar 
            position="sticky" 
            elevation={0} 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.7)', 
              backdropFilter: 'blur(15px)',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              color: 'text.primary'
            }}
          >
            <Toolbar>
              <IconButton 
                color="inherit" 
                edge="start" 
                onClick={() => setSidebarOpen(true)} 
                sx={{ 
                  mr: 2,
                  bgcolor: 'rgba(15, 118, 110, 0.05)',
                  '&:hover': { bgcolor: 'rgba(15, 118, 110, 0.1)' }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                {navItems.find(i => i.idx === activeTab)?.label}
              </Typography>
            </Toolbar>
          </AppBar>

          <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, mb: 4, flexGrow: 1 }}>
            <Fade in timeout={500}>
              <Box>
                {/* ── ROUTING ────────────────────────────────────────────────── */}
                {activeTab === 0 && (
                  <Planner
                    currentUserId={currentUserId}
                    currentUsername={currentUsername}
                    studyHistory={studyHistory}
                    setStudyHistory={setStudyHistory}
                    plan={plan}
                    setPlan={setPlan}
                    subject={subject}
                    setSubject={setSubject}
                    days={days}
                    setDays={setDays}
                    hours={hours}
                    setHours={setHours}
                    level={level}
                    setLevel={setLevel}
                    loading={loading}
                    timerActive={timerActive}
                    setTimerActive={setTimerActive}
                    timerSeconds={timerSeconds}
                    setTimerSeconds={setTimerSeconds}
                    showHistory={showHistory}
                    setShowHistory={setShowHistory}
                    generatePlan={generatePlan}
                    handleDeleteHistory={handleDeleteHistory}
                    toggleSubtopic={toggleSubtopic}
                    exportStudyPlanPDF={exportStudyPlanPDF}
                    allSubjects={BASE_SUBJECTS}
                    currentSubjectData={currentSubjectData}
                    barData={barData}
                    pieData={pieData}
                    totalProgress={totalProgress}
                    setSmartPlanContext={setSmartPlanContext}
                    setActiveTab={setActiveTab}
                    showCustomDialog={showCustomDialog}
                    setShowCustomDialog={setShowCustomDialog}
                    handleCreateCustomSubject={handleCreateCustomSubject}
                    customSubjectName={customSubjectName}
                    setCustomSubjectName={setCustomSubjectName}
                    customLevelTab={customLevelTab}
                    setCustomLevelTab={setCustomLevelTab}
                    customTopics={customTopics}
                    setCustomTopics={setCustomTopics}
                    resumeDialogOpen={resumeDialogOpen}
                    setResumeDialogOpen={setResumeDialogOpen}
                    duplicatePlan={duplicatePlan}
                    formatTimer={formatTimer}
                    statusInfo={statusInfo}
                    dayProgress={dayProgress}
                    isTopicLocked={isTopicLocked}
                    completedFlash={completedFlash}
                  />
                )}
                
                {activeTab === 1 && (
                  <SmartPlan 
                    token={token} 
                    userId={currentUserId} 
                    dayContext={smartPlanContext} 
                    onClearDay={() => { setSmartPlanContext(null); setActiveTab(0); }} 
                  />
                )}
                
                {activeTab === 2 && (
                  <PerformancePredictor 
                    userId={currentUserId} 
                    token={token} 
                  />
                )}
                
                {activeTab === 3 && (
                  <Profile
                    userId={currentUserId}
                    username={currentUsername}
                    studyHistory={studyHistory}
                    plan={plan}
                    subject={subject}
                    level={level}
                    days={days}
                    hours={hours}
                    onDeleteHistory={handleDeleteHistory}
                    onResumeCourse={(entry) => {
                      if (entry.plan) {
                        setPlan(entry.plan);
                        setSubject(entry.subject);
                        setLevel(entry.level);
                        setDays(entry.days);
                        setHours(entry.hours);
                        setSmartPlanContext(null);
                        setStudyHistory(prev => {
                          const filtered = prev.filter(h => h.id !== entry.id);
                          return [entry, ...filtered];
                        });
                      }
                      setActiveTab(0);
                    }}
                  />
                )}
              </Box>
            </Fade>
          </Container>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.type} variant="filled" sx={{ borderRadius: 3, fontWeight: 600 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <QuizDialog
        open={quizOpen}
        topicName={quizTopic.name}
        subject={quizTopic.subject || subject}
        level={level}
        onPass={handleQuizPass}
        onFail={handleQuizFail}
        onClose={() => setQuizOpen(false)}
      />

      <CodingChallengeDialog
        open={codingOpen}
        topicName={quizTopic.name}
        subject={quizTopic.subject || subject}
        level={level}
        onPass={(correct, total, skipped) => { setCodingOpen(false); handleQuizPass(correct, total, skipped); }}
        onFail={() => { setCodingOpen(false); handleQuizFail(); }}
        onClose={() => setCodingOpen(false)}
      />
      </Box>
    </Box>
  </ThemeProvider>
);
}

export default App;
