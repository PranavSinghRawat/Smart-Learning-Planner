import React, { useState, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, Button, TextField, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip,
  List, ListItem, ListItemText, IconButton, Alert, LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SchoolIcon from "@mui/icons-material/School";

const API = import.meta.env.VITE_API_URL;
const C = { primary: "#0F766E", secondary: "#06B6D4", bg: "#F8FAFC" };

const daysUntil = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));
const urgencyColor = (d) => d <= 3 ? "#EF4444" : d <= 7 ? "#F59E0B" : "#10B981";
const urgencyLabel = (d) => d <= 3 ? "🔴 Urgent" : d <= 7 ? "🟡 Soon" : "🟢 Planned";

export default function ExamPlanner({ token }) {
  const [exams, setExams] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ examName: "", examDate: "", subjects: "", weakTopics: "", targetScore: 80 });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => { fetchExams(); }, []);

  const fetchExams = async () => {
    try {
      const r = await fetch(`${API}/exams`, { headers });
      const d = await r.json();
      if (r.ok) setExams(d.exams || []);
    } catch { /* silent */ }
  };

  const handleAdd = async () => {
    if (!form.examName.trim() || !form.examDate) { setErr("Exam name and date are required."); return; }
    setLoading(true); setErr("");
    try {
      const r = await fetch(`${API}/exams`, {
        method: "POST", headers,
        body: JSON.stringify({
          examName: form.examName,
          examDate: form.examDate,
          targetScore: Number(form.targetScore) || 80,
          subjects: form.subjects.split(",").map(s => s.trim()).filter(Boolean),
          weakTopics: form.weakTopics.split("\n").map(s => s.trim()).filter(Boolean),
        }),
      });
      const d = await r.json();
      if (!r.ok) { setErr(d.message || "Failed to add exam."); return; }
      setExams(prev => [...prev, d.exam]);
      setOpen(false);
      setForm({ examName: "", examDate: "", subjects: "", weakTopics: "", targetScore: 80 });
    } catch { setErr("Network error."); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/exams/${id}`, { method: "DELETE", headers });
      setExams(prev => prev.filter(e => e._id !== id));
    } catch { /* silent */ }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: C.primary }}>📝 Exam Planner</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}
          sx={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, borderRadius: 2, fontWeight: 600 }}>
          Add Exam
        </Button>
      </Box>

      {exams.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, border: "2px dashed #CBD5E1", borderRadius: 3 }}>
          <SchoolIcon sx={{ fontSize: 56, color: "#CBD5E1", mb: 2 }} />
          <Typography variant="h6" color="textSecondary">No exams added yet.</Typography>
          <Typography variant="body2" color="textSecondary">Add your upcoming exams to get a focused study plan.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {exams.map(exam => {
            const d = daysUntil(exam.examDate);
            return (
              <Grid item xs={12} md={6} key={exam._id}>
                <Card sx={{ borderRadius: 3, border: `2px solid ${urgencyColor(d)}30`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B" }}>{exam.examName}</Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          📅 {new Date(exam.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                          <Chip label={urgencyLabel(d)} size="small" sx={{ background: urgencyColor(d), color: "#fff", fontWeight: 600 }} />
                          <Chip label={`${d} days left`} size="small" variant="outlined" />
                          <Chip label={`Target: ${exam.targetScore}%`} size="small" sx={{ background: "#EFF6FF", color: C.primary }} />
                        </Box>
                        <LinearProgress variant="determinate" value={Math.max(0, 100 - (d / 30) * 100)}
                          sx={{ height: 6, borderRadius: 3, background: "#E2E8F0", mb: 1,
                            "& .MuiLinearProgress-bar": { background: urgencyColor(d) } }} />
                        {exam.subjects?.length > 0 && (
                          <Typography variant="caption" color="textSecondary">
                            📚 Subjects: {exam.subjects.join(", ")}
                          </Typography>
                        )}
                        {exam.weakTopics?.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: "#EF4444" }}>⚠️ Weak Topics:</Typography>
                            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}>
                              {exam.weakTopics.map((t, i) => (
                                <Chip key={i} label={t} size="small" sx={{ background: "#FEF2F2", color: "#EF4444", fontSize: "0.7rem" }} />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                      <IconButton onClick={() => handleDelete(exam._id)} size="small" sx={{ color: "#EF4444" }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={open} onClose={() => { setOpen(false); setErr(""); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color: "#fff", fontWeight: 700 }}>
          📝 Add Upcoming Exam
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
          <TextField fullWidth label="Exam Name" placeholder="e.g., DBMS Mid-Sem, OS End-Sem"
            value={form.examName} onChange={e => setForm({ ...form, examName: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Exam Date" type="date" InputLabelProps={{ shrink: true }}
            value={form.examDate} onChange={e => setForm({ ...form, examDate: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Related Subjects (comma separated)" placeholder="e.g., DBMS, SQL, Normalization"
            value={form.subjects} onChange={e => setForm({ ...form, subjects: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth multiline rows={3} label="Weak Topics (one per line)"
            placeholder={"Normalization\nTransactions\nIndexing"}
            value={form.weakTopics} onChange={e => setForm({ ...form, weakTopics: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Target Score (%)" type="number" inputProps={{ min: 0, max: 100 }}
            value={form.targetScore} onChange={e => setForm({ ...form, targetScore: e.target.value })} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => { setOpen(false); setErr(""); }}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={loading}
            sx={{ background: C.primary, fontWeight: 600 }}>
            {loading ? "Adding..." : "Add Exam"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
