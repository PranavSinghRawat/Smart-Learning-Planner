import React, { useState, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, Button, Grid, Chip,
  List, ListItem, ListItemIcon, ListItemText, LinearProgress,
  Alert, FormControl, InputLabel, Select, MenuItem, Rating, Dialog,
  DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import BoltIcon from "@mui/icons-material/Bolt";
import { CAREER_ROADMAPS } from "./CareerGoals";

const API = import.meta.env.VITE_API_URL;
const C = { primary: "#0F766E", secondary: "#06B6D4" };
const daysUntil = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));

export default function SmartPlan({ token, userId }) {
  const [exams, setExams] = useState([]);
  const [career, setCareer] = useState("Android Developer");
  const [careerProgress, setCareerProgress] = useState({});
  const [sessions, setSessions] = useState([]);
  const [generated, setGenerated] = useState(false);
  const [ratingDialog, setRatingDialog] = useState({ open: false, idx: null });
  const [pendingRating, setPendingRating] = useState(3);
  const [hoursAvailable, setHoursAvailable] = useState(4);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${API}/exams`, { headers }).then(r => r.json()).then(d => { if (d.exams) setExams(d.exams); }).catch(() => {});
    try {
      const cp = localStorage.getItem(`careerProgress_${userId}`);
      if (cp) setCareerProgress(JSON.parse(cp));
    } catch {}
  }, []);

  const generate = () => {
    const result = [];
    const totalMins = hoursAvailable * 60;
    let usedMins = 0;
    const sorted = [...exams].sort((a, b) => daysUntil(a.examDate) - daysUntil(b.examDate));
    sorted.forEach(exam => {
      const d = daysUntil(exam.examDate);
      const mins = d <= 3 ? 60 : d <= 7 ? 45 : 30;
      const urgency = d <= 3 ? "Urgent" : d <= 7 ? "Soon" : "Planned";
      (exam.weakTopics || []).forEach(topic => {
        if (usedMins + mins <= totalMins) {
          result.push({ type: "exam", label: `${exam.examName} - ${topic}`, duration: mins, urgency, daysLeft: d, completed: false, confidence: 0 });
          usedMins += mins;
        }
      });
    });
    const rm = CAREER_ROADMAPS[career];
    if (rm) {
      let added = 0;
      rm.phases.forEach((phase, pi) => {
        phase.topics.forEach((topic, ti) => {
          if (!careerProgress[`${career}_${pi}_${ti}`] && added < 3 && usedMins + 60 <= totalMins) {
            result.push({ type: "career", label: `${career} - ${topic}`, duration: 60, phase: phase.phase, completed: false, confidence: 0 });
            usedMins += 60;
            added++;
          }
        });
      });
    }
    if (!result.length) { alert("Add exams with weak topics or select a career goal first."); return; }
    setSessions(result);
    setGenerated(true);
  };

  const openRating = (idx) => { setRatingDialog({ open: true, idx }); setPendingRating(3); };
  const confirmRating = () => {
    setSessions(prev => prev.map((s, i) => i !== ratingDialog.idx ? s : { ...s, completed: true, confidence: pendingRating }));
    setRatingDialog({ open: false, idx: null });
  };
  const toggleSession = (idx) => {
    if (!sessions[idx].completed) openRating(idx);
    else setSessions(prev => prev.map((s, i) => i !== idx ? s : { ...s, completed: false, confidence: 0 }));
  };

  const done = sessions.filter(s => s.completed).length;
  const totalMins = sessions.reduce((s, x) => s + x.duration, 0);
  const doneMins = sessions.filter(s => s.completed).reduce((s, x) => s + x.duration, 0);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: C.primary, mb: 3 }}>Smart Plan for Today</Typography>
      <Card sx={{ mb: 3, borderRadius: 3, border: "1px solid #E2E8F0" }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: C.primary }}>Plan Settings</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Career Goal</InputLabel>
                <Select value={career} onChange={e => setCareer(e.target.value)} label="Career Goal" sx={{ borderRadius: 2 }}>
                  {Object.entries(CAREER_ROADMAPS).map(([k, v]) => (
                    <MenuItem key={k} value={k}>{v.emoji} {k}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Hours Available Today</InputLabel>
                <Select value={hoursAvailable} onChange={e => setHoursAvailable(e.target.value)} label="Hours Available Today" sx={{ borderRadius: 2 }}>
                  {[1,2,3,4,5,6,8].map(h => <MenuItem key={h} value={h}>{h} hour{h > 1 ? "s" : ""}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button fullWidth variant="contained" startIcon={<BoltIcon />} onClick={generate}
                sx={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, borderRadius: 2, fontWeight: 700, py: 1.8 }}>
                Generate Smart Plan
              </Button>
            </Grid>
          </Grid>
          <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
            Smart Plan mixes your exam prep (weak topics, sorted by urgency) and career learning (next incomplete roadmap topics) into one focused day.
          </Alert>
        </CardContent>
      </Card>

      {generated && sessions.length > 0 && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: "Total Sessions", value: sessions.length, color: C.primary },
              { label: "Completed", value: done, color: "#10B981" },
              { label: "Total Time", value: `${Math.floor(totalMins/60)}h ${totalMins%60}m`, color: C.secondary },
              { label: "Time Done", value: `${Math.floor(doneMins/60)}h ${doneMins%60}m`, color: "#F59E0B" },
            ].map(s => (
              <Grid item xs={6} sm={3} key={s.label}>
                <Card sx={{ borderRadius: 3, textAlign: "center", border: `2px solid ${s.color}30` }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
                    <Typography variant="caption" color="textSecondary">{s.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <LinearProgress variant="determinate" value={sessions.length ? Math.round((done/sessions.length)*100) : 0}
            sx={{ height: 10, borderRadius: 5, mb: 3, background: "#E2E8F0", "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})` } }} />
          <Card sx={{ borderRadius: 3, border: "1px solid #E2E8F0" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Today's Sessions</Typography>
              <List sx={{ p: 0 }}>
                {sessions.map((s, i) => (
                  <ListItem key={i} onClick={() => toggleSession(i)}
                    sx={{ py: 1.5, borderBottom: "1px solid #E2E8F0", "&:last-child": { borderBottom: "none" }, cursor: "pointer", "&:hover": { background: "#F0F9FF" } }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {s.completed
                        ? <CheckCircleIcon sx={{ color: "#10B981", fontSize: 24 }} />
                        : <RadioButtonUncheckedIcon sx={{ color: "#CBD5E1", fontSize: 24 }} />}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 600, textDecoration: s.completed ? "line-through" : "none", color: s.completed ? "#94A3B8" : "#1E293B" }}>
                          {s.type === "exam" ? "Exam: " : "Career: "}{s.label}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
                          <Chip label={`${s.duration} mins`} size="small" />
                          {s.type === "exam" && <Chip label={s.urgency} size="small" sx={{ background: s.daysLeft <= 3 ? "#FEE2E2" : s.daysLeft <= 7 ? "#FEF3C7" : "#D1FAE5" }} />}
                          {s.type === "career" && <Chip label={s.phase} size="small" sx={{ background: "#EFF6FF", color: C.primary }} />}
                          {s.completed && s.confidence > 0 && <Chip label={`Confidence: ${s.confidence}/5`} size="small" sx={{ background: "#FEF9C3" }} />}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </>
      )}

      {generated && sessions.length === 0 && (
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          No sessions generated. Add exams with weak topics in the Exam Planner, or check your Career Goals progress.
        </Alert>
      )}

      <Dialog open={ratingDialog.open} onClose={() => setRatingDialog({ open: false, idx: null })} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color: "#fff" }}>
          Rate Your Confidence
        </DialogTitle>
        <DialogContent sx={{ pt: 3, textAlign: "center" }}>
          <Typography variant="body1" sx={{ mb: 2 }}>How confident do you feel after this session?</Typography>
          <Rating value={pendingRating} onChange={(_, v) => setPendingRating(v)} size="large" />
          <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 1 }}>
            {["", "Not confident", "Slightly confident", "Moderately confident", "Confident", "Very confident"][pendingRating] || ""}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRatingDialog({ open: false, idx: null })}>Skip</Button>
          <Button variant="contained" onClick={confirmRating} sx={{ background: C.primary, fontWeight: 600 }}>Mark Complete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
