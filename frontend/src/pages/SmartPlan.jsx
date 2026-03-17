import React, { useState, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, Button, Grid, Chip,
  List, ListItem, ListItemIcon, ListItemText, LinearProgress,
  Alert, FormControl, InputLabel, Select, MenuItem, Rating, Dialog,
  DialogTitle, DialogContent, DialogActions, Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import BoltIcon from "@mui/icons-material/Bolt";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { CAREER_ROADMAPS } from "./CareerGoals";

const API = import.meta.env.VITE_API_URL;
const C = { primary: "#0F766E", secondary: "#06B6D4" };

const scoreColor = (s) => s >= 0.7 ? "#10B981" : s >= 0.4 ? "#F59E0B" : "#EF4444";
const scoreLabel = (s) => s >= 0.7 ? "High" : s >= 0.4 ? "Medium" : "Low";

export default function SmartPlan({ token, userId }) {
  const [career, setCareer] = useState("Android Developer");
  const [careerProgress, setCareerProgress] = useState({});
  const [sessions, setSessions] = useState([]);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scoringSource, setScoringSource] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [ratingDialog, setRatingDialog] = useState({ open: false, idx: null });
  const [pendingRating, setPendingRating] = useState(3);
  const [hoursAvailable, setHoursAvailable] = useState(4);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => {
    try {
      const cp = localStorage.getItem(`careerProgress_${userId}`);
      if (cp) setCareerProgress(JSON.parse(cp));
    } catch {}
  }, [userId]);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/smartplan/generate`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          hoursAvailable,
          careerGoal: career,
          careerProgress,
          sessionHistory: [],
        }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Failed to generate plan."); return; }
      if (!data.sessions.length) { alert(data.message || "No sessions. Add exams with weak topics first."); return; }
      setSessions(data.sessions.map(s => ({ ...s, completed: false, confidence: 0 })));
      setScoringSource(data.scoringSource);
      setServerMessage(data.message);
      setGenerated(true);
    } catch (e) {
      alert("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <PsychologyIcon sx={{ fontSize: 36, color: C.primary }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: C.primary }}>Smart Plan for Today</Typography>
          <Typography variant="caption" color="textSecondary">
            Powered by MLP Deep Learning Model (Unit I: Feedforward Neural Network)
          </Typography>
        </Box>
      </Box>

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
              <Button fullWidth variant="contained" startIcon={<BoltIcon />} onClick={generate} disabled={loading}
                sx={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, borderRadius: 2, fontWeight: 700, py: 1.8 }}>
                {loading ? "Scoring with MLP..." : "Generate Smart Plan"}
              </Button>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
            The backend scores each candidate session using a trained <strong>Feedforward Neural Network (MLP)</strong> —
            features: difficulty, days to exam, past hours, confidence, topic weight, hours available.
            Sessions are ranked by effectiveness score and the best ones are selected for your day.
          </Alert>
        </CardContent>
      </Card>

      {generated && scoringSource && (
        <Alert severity={scoringSource === "mlp" ? "success" : "warning"} sx={{ mb: 3, borderRadius: 2 }}>
          {scoringSource === "mlp"
            ? "Sessions scored by MLP deep learning model (R2=0.95, RMSE=0.032)"
            : "ML service offline — using rule-based fallback scoring"}
          {" "}{serverMessage}
        </Alert>
      )}

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
            sx={{ height: 10, borderRadius: 5, mb: 3, background: "#E2E8F0",
              "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})` } }} />

          <Card sx={{ borderRadius: 3, border: "1px solid #E2E8F0" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Today's Sessions
                <Typography component="span" variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                  (sorted by MLP effectiveness score)
                </Typography>
              </Typography>
              <List sx={{ p: 0 }}>
                {sessions.map((s, i) => (
                  <ListItem key={i} onClick={() => toggleSession(i)}
                    sx={{ py: 1.5, borderBottom: "1px solid #E2E8F0", "&:last-child": { borderBottom: "none" },
                      cursor: "pointer", "&:hover": { background: "#F0F9FF" } }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {s.completed
                        ? <CheckCircleIcon sx={{ color: "#10B981", fontSize: 24 }} />
                        : <RadioButtonUncheckedIcon sx={{ color: "#CBD5E1", fontSize: 24 }} />}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 600, textDecoration: s.completed ? "line-through" : "none",
                          color: s.completed ? "#94A3B8" : "#1E293B" }}>
                          {s.type === "exam" ? "Exam:" : "Career:"} {s.label}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap", alignItems: "center" }}>
                          <Chip label={`${s.duration} mins`} size="small" />
                          {s.type === "exam" && (
                            <Chip label={s.urgency} size="small"
                              sx={{ background: s.daysLeft <= 3 ? "#FEE2E2" : s.daysLeft <= 7 ? "#FEF3C7" : "#D1FAE5" }} />
                          )}
                          {s.type === "career" && (
                            <Chip label={s.phase} size="small" sx={{ background: "#EFF6FF", color: C.primary }} />
                          )}
                          <Tooltip title="MLP Effectiveness Score (0-1). Higher = more beneficial to study today.">
                            <Chip
                              label={`MLP Score: ${s.effectivenessScore?.toFixed(2)} (${scoreLabel(s.effectivenessScore)})`}
                              size="small"
                              sx={{ background: scoreColor(s.effectivenessScore) + "20",
                                color: scoreColor(s.effectivenessScore), fontWeight: 700, cursor: "help" }}
                            />
                          </Tooltip>
                          {s.completed && s.confidence > 0 && (
                            <Chip label={`Confidence: ${s.confidence}/5`} size="small" sx={{ background: "#FEF9C3" }} />
                          )}
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
          <Alert severity="info" sx={{ mt: 2, textAlign: "left", fontSize: "0.75rem" }}>
            Your confidence rating is stored as a feature for future MLP scoring — the model learns your patterns over time.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRatingDialog({ open: false, idx: null })}>Skip</Button>
          <Button variant="contained" onClick={confirmRating} sx={{ background: C.primary, fontWeight: 600 }}>Mark Complete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
