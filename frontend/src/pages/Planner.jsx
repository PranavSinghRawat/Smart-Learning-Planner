import React from "react";
import {
  Box, Typography, Container, Grid, Card, CardContent,
  Button, TextField, MenuItem, FormControl, InputLabel, Select,
  Chip, Box as MuiBox, LinearProgress, Paper, Divider,
  InputAdornment, Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemText, Dialog, DialogTitle,
  DialogContent, DialogActions, Tooltip, useTheme
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HistoryIcon from "@mui/icons-material/History";
import TimerIcon from "@mui/icons-material/Timer";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TuneIcon from "@mui/icons-material/Tune";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PsychologyIcon from "@mui/icons-material/Psychology";
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar,
  XAxis, YAxis, ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = {
  ahead: "#10B981", track: "#F59E0B", behind: "#EF4444",
  primary: "#0F766E", secondary: "#06B6D4",
};

export default function Planner({
  currentUserId, currentUsername,
  studyHistory, setStudyHistory,
  plan, setPlan,
  subject, setSubject,
  days, setDays,
  hours, setHours,
  level, setLevel,
  loading,
  timerActive, setTimerActive,
  timerSeconds, setTimerSeconds,
  showHistory, setShowHistory,
  generatePlan, handleDeleteHistory,
  toggleSubtopic, exportStudyPlanPDF,
  allSubjects, currentSubjectData,
  barData, pieData, totalProgress,
  setSmartPlanContext, setActiveTab,
  showCustomDialog, setShowCustomDialog,
  handleCreateCustomSubject, customSubjectName, setCustomSubjectName,
  customLevelTab, setCustomLevelTab, customTopics, setCustomTopics,
  resumeDialogOpen, setResumeDialogOpen, duplicatePlan,
  formatTimer, statusInfo, dayProgress,
  isTopicLocked, completedFlash
}) {
  const theme = useTheme();

  return (
    <Box className="tab-content">
      {/* ── BENTO HEADER ────────────────────────────────────────────── */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: -1 }}>
            Morning, {currentUsername || "Student"}!
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#64748b', fontWeight: 500 }}>
            You have {plan.reduce((s, d) => s + d.topics.filter(x => !x.completed).length, 0)} modules left to master today.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={() => setShowHistory(!showHistory)}
            startIcon={<HistoryIcon />}
            sx={{ borderRadius: 3, border: '2px solid rgba(0,0,0,0.05)', color: '#64748b' }}
          >
            History
          </Button>
          <Button
            variant="contained"
            onClick={() => exportStudyPlanPDF({
              username: currentUsername,
              subject, level, days, hours, plan,
              dailyScores: JSON.parse(localStorage.getItem(`dailyScores_${currentUserId}`) || "[]"),
            })}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            Export PDF
          </Button>
        </Box>
      </Box>

      {/* ── BENTO GRID ─────────────────────────────────────────────── */}
      <Grid container spacing={3}>
        
        {/* Persistence Guard / Controls */}
        <Grid item xs={12} lg={8}>
          <Card className="glass-card" sx={{ height: '100%', p: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.main', color: '#fff' }}><TuneIcon /></Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Sprint Configuration</Typography>
              </Box>
              
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="What are you learning?"
                    placeholder="e.g. React Architecture, Italian A1, Quantum Mechanics..."
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && generatePlan()}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Days" type="number" value={days}
                    onChange={e => setDays(Math.max(1, parseInt(e.target.value) || 1))} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Hours/Day" type="number" value={hours}
                    onChange={e => setHours(Math.max(0.5, parseFloat(e.target.value) || 0.5))} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Level</InputLabel>
                    <Select value={level} onChange={e => setLevel(e.target.value)} label="Level">
                      <MenuItem value="Beginner">Beginner</MenuItem>
                      <MenuItem value="Intermediate">Intermediate</MenuItem>
                      <MenuItem value="Advanced">Advanced</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button fullWidth variant="contained" size="large" onClick={() => generatePlan()} disabled={loading}>
                    {loading ? 'Synthesizing...' : 'Initialize AI Sprint'}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button fullWidth variant="outlined" size="large" onClick={() => setShowCustomDialog(true)} sx={{ border: '2px solid' }}>
                    Setup Custom Path
                  </Button>
                </Grid>
              </Grid>

              {currentSubjectData && subject.trim() && (
                <MuiBox sx={{ 
                  mt: 3, p: 2, borderRadius: 3, 
                  background: 'rgba(15, 118, 110, 0.05)', 
                  border: '1px solid rgba(15, 118, 110, 0.1)',
                  display: 'flex', alignItems: 'center', gap: 2 
                }}>
                  <Box sx={{ fontSize: '2rem' }}>🎓</Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{currentSubjectData.fullName}</Typography>
                    <Typography variant="caption" color="textSecondary">{currentSubjectData.description}</Typography>
                  </Box>
                </MuiBox>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Timer Bento */}
        <Grid item xs={12} sm={6} lg={4}>
          <Card className="glass-card" sx={{ 
            height: '100%', 
            background: timerActive ? 'linear-gradient(135deg, rgba(15, 118, 110, 0.1) 0%, rgba(255,255,255,0.8) 100%)' : 'rgba(255,255,255,0.8)',
            transition: 'all 0.5s ease'
          }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 2 }}>Cognitive Timer</Typography>
              <Typography variant="h2" sx={{ 
                fontWeight: 900, mb: 3, 
                fontFamily: 'monospace', color: '#1e293b',
                textShadow: timerActive ? '0 0 20px rgba(15, 118, 110, 0.2)' : 'none'
              }}>
                {formatTimer(timerSeconds)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  startIcon={timerActive ? <PauseIcon /> : <PlayArrowIcon />}
                  color={timerActive ? "warning" : "primary"}
                  onClick={() => setTimerActive(!timerActive)}
                  sx={{ borderRadius: 3, px: 4 }}
                >
                  {timerActive ? "Pause" : "Start"}
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => { setTimerSeconds(0); setTimerActive(false); }}
                  sx={{ borderRadius: 3 }}
                >
                  <StopIcon />
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats Bento */}
        {plan.length > 0 && (
          <>
            <Grid item xs={12} sm={6} lg={4}>
              <Card className="glass-card" sx={{ height: '100%' }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                  <Typography variant="overline" sx={{ fontWeight: 800, color: COLORS.ahead, letterSpacing: 2 }}>Topic Velocity</Typography>
                  <Box sx={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', zIndex: 1 }}>{totalProgress}%</Typography>
                    <Box sx={{ position: 'absolute', inset: 0 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie 
                            data={pieData} 
                            dataKey="value" 
                            innerRadius={55} 
                            outerRadius={68} 
                            startAngle={90} 
                            endAngle={450}
                            animationDuration={1000}
                          >
                            <Cell fill={COLORS.ahead} />
                            <Cell fill="rgba(0,0,0,0.05)" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    {pieData[0].value} of {pieData[0].value + pieData[1].value} modules mastered
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={8}>
              <Card className="glass-card" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="overline" sx={{ fontWeight: 800, color: COLORS.secondary, letterSpacing: 2, mb: 2, display: 'block' }}>Daily Trajectory</Typography>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                      />
                      <Bar dataKey="progress" fill={COLORS.secondary} radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Day Cards - Full Width */}
        {plan.map((day, dIdx) => {
          const status = statusInfo(day);
          return (
            <Grid item xs={12} key={dIdx}>
              <Accordion 
                defaultExpanded={dIdx === 0} 
                className="glass-card"
                sx={{ 
                  borderRadius: '24px !important', 
                  '&:before': { display: 'none' },
                  mb: 2
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="large" />} sx={{ px: 4, py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%' }}>
                    <Box sx={{ 
                      width: 50, height: 50, borderRadius: 4, 
                      bgcolor: `${status.color}15`, border: `2px solid ${status.color}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, color: status.color, fontSize: '1.2rem'
                    }}>
                      {day.day}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>Day {day.day} Modules</Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 0.5 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={dayProgress(day)} 
                          sx={{ width: 100, height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.05)', '& .MuiLinearProgress-bar': { bgcolor: status.color } }} 
                        />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: status.color }}>{status.text}</Typography>
                      </Box>
                    </Box>
                    <Button 
                      onClick={(e) => { e.stopPropagation(); setSmartPlanContext({ day: day.day, topics: day.topics.map(t => t.name), subject, hours }); setActiveTab(1); }}
                      variant="text" 
                      startIcon={<PsychologyIcon />} 
                      sx={{ mr: 2, fontWeight: 700, borderRadius: 3 }}
                    >
                      Smart Plan
                    </Button>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 4, pb: 4 }}>
                  <Grid container spacing={2}>
                    {day.topics.map((topic, tIdx) => (
                      <Grid item xs={12} md={6} key={tIdx}>
                        <Box
                          component={motion.div}
                          whileHover={{ scale: 1.01 }}
                          sx={{
                            p: 2.5, borderRadius: 4,
                            background: topic.completed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.4)',
                            border: `1px solid ${topic.completed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)'}`,
                            display: 'flex', alignItems: 'center', gap: 2,
                            position: 'relative', overflow: 'hidden'
                          }}
                        >
                          <MuiBox sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: topic.completed ? '#065F46' : '#1e293b' }}>
                              {topic.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Chip label={`${topic.hours}h`} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                              {topic.verified && <Chip label="Verified" size="small" color="success" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />}
                            </Box>
                          </MuiBox>
                          <Button
                            variant={topic.completed ? "contained" : "outlined"}
                            color="success"
                            onClick={() => toggleSubtopic(dIdx, tIdx)}
                            sx={{ borderRadius: 3, fontWeight: 700, minWidth: 100 }}
                          >
                            {topic.completed ? "Mastered" : "Learn"}
                          </Button>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          );
        })}
      </Grid>

      {/* ── DIALOGS ─────────────────────────────────────────────── */}
      <Dialog open={resumeDialogOpen} onClose={() => setResumeDialogOpen(false)} PaperProps={{ sx: { borderRadius: 6, p: 2 } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem' }}>Resume Momentum?</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.7 }}>
            You are currently midway through **{duplicatePlan?.subject}**. 
            Professional learners prioritize completion over novelty. Would you like to continue?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => { setResumeDialogOpen(false); generatePlan(true); }} sx={{ color: '#94a3b8', fontWeight: 700 }}>Start Fresh</Button>
          <Button variant="contained" onClick={() => { /* resume logic handled in App.jsx via prop if needed */ setResumeDialogOpen(false); }} sx={{ borderRadius: 3 }}>Continue Sprint</Button>
        </DialogActions>
      </Dialog>
      
      {/* ... other dialogs would go here if extracted ... */}
    </Box>
  );
}
