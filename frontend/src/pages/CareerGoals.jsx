import React, { useState } from "react";
import {
  Box, Card, CardContent, Typography, Button, Grid, Chip,
  LinearProgress, Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemIcon, ListItemText, Select, MenuItem,
  FormControl, InputLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

const C = { primary: "#0F766E", secondary: "#06B6D4" };

export const CAREER_ROADMAPS = {
  "Android Developer": {
    emoji: "📱", description: "Build native Android apps with Kotlin & Jetpack Compose",
    phases: [
      { phase: "Phase 1 – Foundations", topics: ["Kotlin Basics – syntax, null safety, lambdas", "Android Studio setup & project structure", "Activities & Intents – navigation, lifecycle", "Layouts & Views – XML, ConstraintLayout, RecyclerView", "Resources & Themes – strings, colors, styles"] },
      { phase: "Phase 2 – Core Android", topics: ["Fragments & Navigation Component", "ViewModel & LiveData – MVVM pattern", "Room Database – local persistence, DAOs", "Retrofit & REST APIs – network calls, Gson", "Coroutines & Flow – async programming"] },
      { phase: "Phase 3 – Advanced", topics: ["Jetpack Compose – declarative UI", "Dependency Injection – Hilt/Dagger", "WorkManager – background tasks", "Firebase – Auth, Firestore, FCM push notifications", "Play Store deployment – signing, release builds"] },
    ],
  },
  "MERN Developer": {
    emoji: "🌐", description: "Full-stack JavaScript with MongoDB, Express, React, Node",
    phases: [
      { phase: "Phase 1 – Foundations", topics: ["JavaScript ES6+ – arrow functions, promises, async/await", "Node.js basics – modules, fs, http", "Express.js – routing, middleware, REST APIs", "MongoDB & Mongoose – schemas, CRUD, aggregation", "React fundamentals – JSX, components, hooks"] },
      { phase: "Phase 2 – Full Stack", topics: ["JWT Authentication – login, register, protected routes", "React Router – SPA navigation, params", "State Management – Context API or Redux Toolkit", "File uploads – Multer, Cloudinary", "Environment variables & dotenv"] },
      { phase: "Phase 3 – Production", topics: ["Error handling & validation – Joi, express-validator", "Testing – Jest, Supertest, React Testing Library", "Deployment – Render/Railway backend, Vercel frontend", "CI/CD – GitHub Actions basics", "Security – CORS, helmet, rate limiting, XSS prevention"] },
    ],
  },
  "Data Scientist": {
    emoji: "📊", description: "Python-powered data analysis, ML models, and insights",
    phases: [
      { phase: "Phase 1 – Python & Data", topics: ["Python for Data – NumPy, Pandas, Matplotlib", "Data Cleaning – missing values, outliers, encoding", "Exploratory Data Analysis – statistics, visualizations", "SQL for Data – joins, aggregations, window functions", "Git & Jupyter Notebooks workflow"] },
      { phase: "Phase 2 – Machine Learning", topics: ["Supervised Learning – regression, classification", "Unsupervised Learning – clustering, PCA", "Model Evaluation – cross-validation, metrics", "Feature Engineering – selection, transformation", "Scikit-learn pipelines"] },
      { phase: "Phase 3 – Advanced ML", topics: ["Deep Learning – neural networks with TensorFlow/Keras", "NLP – tokenization, embeddings, transformers", "Time Series – ARIMA, LSTM forecasting", "Model Deployment – Flask API, Docker, cloud", "MLOps – experiment tracking with MLflow"] },
    ],
  },
  "DevOps Engineer": {
    emoji: "⚙️", description: "CI/CD, containers, cloud infrastructure & automation",
    phases: [
      { phase: "Phase 1 – Foundations", topics: ["Linux CLI – bash scripting, file system, permissions", "Git & GitHub – branching, PRs, workflows", "Networking basics – TCP/IP, DNS, HTTP, firewalls", "Docker – images, containers, Dockerfile, Compose", "YAML & JSON – config file formats"] },
      { phase: "Phase 2 – CI/CD & Cloud", topics: ["GitHub Actions – pipelines, secrets, matrix builds", "AWS/GCP basics – EC2, S3, IAM, VPC", "Kubernetes – pods, deployments, services, Helm", "Terraform – infrastructure as code", "Monitoring – Prometheus, Grafana, alerting"] },
      { phase: "Phase 3 – Advanced", topics: ["Service mesh – Istio, traffic management", "Security – secrets management, SAST/DAST scanning", "Cost optimization – right-sizing, spot instances", "Disaster recovery – backups, RTO/RPO planning", "SRE practices – SLOs, error budgets, postmortems"] },
    ],
  },
  "Flutter Developer": {
    emoji: "🦋", description: "Cross-platform mobile apps with Flutter & Dart",
    phases: [
      { phase: "Phase 1 – Dart & Flutter Basics", topics: ["Dart fundamentals – types, functions, OOP, async", "Flutter widgets – Stateless vs Stateful", "Layouts – Row, Column, Stack, Expanded", "Navigation – Navigator 2.0, go_router", "State management basics – setState, Provider"] },
      { phase: "Phase 2 – App Development", topics: ["BLoC / Riverpod – scalable state management", "REST APIs – http package, Dio, JSON parsing", "Local storage – SharedPreferences, Hive, SQLite", "Firebase integration – Auth, Firestore, Storage", "Custom animations – AnimationController, Tween"] },
      { phase: "Phase 3 – Production", topics: ["Platform channels – native Android/iOS code", "Testing – unit, widget, integration tests", "Performance profiling – DevTools, jank detection", "App signing & release – Play Store, App Store", "CI/CD – Fastlane, Codemagic"] },
    ],
  },
};

export default function CareerGoals({ userId }) {
  const storageKey = `careerProgress_${userId}`;
  const [selected, setSelected] = useState("Android Developer");
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch { return {}; }
  });

  const toggle = (career, pi, ti) => {
    const k = `${career}_${pi}_${ti}`;
    const updated = { ...progress, [k]: !progress[k] };
    setProgress(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const phaseProgress = (career, pi) => {
    const phase = CAREER_ROADMAPS[career]?.phases[pi];
    if (!phase) return 0;
    const done = phase.topics.filter((_, ti) => progress[`${career}_${pi}_${ti}`]).length;
    return Math.round((done / phase.topics.length) * 100);
  };

  const totalProgress = (career) => {
    const rm = CAREER_ROADMAPS[career];
    if (!rm) return 0;
    const total = rm.phases.reduce((s, p) => s + p.topics.length, 0);
    const done  = rm.phases.reduce((s, p, pi) => s + p.topics.filter((_, ti) => progress[`${career}_${pi}_${ti}`]).length, 0);
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  const roadmap = CAREER_ROADMAPS[selected];
  const overall = totalProgress(selected);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: C.primary }}>🎯 Career Goals & Roadmaps</Typography>
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Career Goal</InputLabel>
          <Select value={selected} onChange={e => setSelected(e.target.value)} label="Career Goal" sx={{ borderRadius: 2 }}>
            {Object.entries(CAREER_ROADMAPS).map(([k, v]) => (
              <MenuItem key={k} value={k}>{v.emoji} {k}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Overview card */}
      <Card sx={{ mb: 3, borderRadius: 3, background: `linear-gradient(135deg, ${C.primary}10, ${C.secondary}10)`, border: `2px solid ${C.secondary}` }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography variant="h3">{roadmap.emoji}</Typography>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{selected}</Typography>
              <Typography variant="body2" color="textSecondary">{roadmap.description}</Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: C.primary }}>{overall}%</Typography>
              <Typography variant="caption" color="textSecondary">Overall</Typography>
            </Box>
          </Box>
          <LinearProgress variant="determinate" value={overall}
            sx={{ height: 10, borderRadius: 5, background: "#E2E8F0", "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})` } }} />
          <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
            {roadmap.phases.map((_, pi) => (
              <Chip key={pi} label={`Phase ${pi + 1}: ${phaseProgress(selected, pi)}%`} size="small"
                sx={{ background: phaseProgress(selected, pi) === 100 ? "#D1FAE5" : "#F1F5F9", color: phaseProgress(selected, pi) === 100 ? "#065F46" : "#475569", fontWeight: 600 }} />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Phase accordions */}
      {roadmap.phases.map((phase, pi) => (
        <Accordion key={pi} defaultExpanded={pi === 0} sx={{ mb: 2, borderRadius: 2, border: "1px solid #E2E8F0", "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ background: "#F9FAFB", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
              <Typography sx={{ fontWeight: 700, color: C.primary, minWidth: 180 }}>{phase.phase}</Typography>
              <Box sx={{ flex: 1 }}>
                <LinearProgress variant="determinate" value={phaseProgress(selected, pi)}
                  sx={{ height: 6, borderRadius: 3, background: "#E2E8F0", "& .MuiLinearProgress-bar": { background: C.secondary } }} />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: C.primary, minWidth: 36 }}>{phaseProgress(selected, pi)}%</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ background: "#FAFBFC" }}>
            <List sx={{ p: 0 }}>
              {phase.topics.map((topic, ti) => {
                const done = !!progress[`${selected}_${pi}_${ti}`];
                return (
                  <ListItem key={ti} onClick={() => toggle(selected, pi, ti)}
                    sx={{ py: 1.5, borderBottom: "1px solid #E2E8F0", "&:last-child": { borderBottom: "none" }, cursor: "pointer", "&:hover": { background: "#F0F9FF" }, borderRadius: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {done
                        ? <CheckCircleIcon sx={{ color: "#10B981", fontSize: 22 }} />
                        : <RadioButtonUncheckedIcon sx={{ color: "#CBD5E1", fontSize: 22 }} />}
                    </ListItemIcon>
                    <ListItemText primary={
                      <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", textDecoration: done ? "line-through" : "none", color: done ? "#94A3B8" : "#1E293B" }}>
                        {topic}
                      </Typography>
                    } />
                    {done && <Chip label="Done" size="small" sx={{ background: "#D1FAE5", color: "#065F46", fontWeight: 600 }} />}
                  </ListItem>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
