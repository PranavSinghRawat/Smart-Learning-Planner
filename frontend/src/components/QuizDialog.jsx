import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, CircularProgress, Alert,
  RadioGroup, FormControlLabel, Radio, LinearProgress, Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import QuizIcon from "@mui/icons-material/Quiz";

const C = { primary: "#0F766E", secondary: "#06B6D4" };
const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export default function QuizDialog({ open, topicName, subject, onPass, onFail, onClose }) {
  const [questions, setQuestions]   = useState([]);
  const [answers, setAnswers]       = useState({});
  const [loading, setLoading]       = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [score, setScore]           = useState(0);
  const [error, setError]           = useState("");

  useEffect(() => {
    if (open && topicName) fetchQuiz();
  }, [open, topicName]);

  const fetchQuiz = async () => {
    setLoading(true);
    setError("");
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    try {
      const res = await fetch(`${API}/resources/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicName, subject }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate quiz");
      setQuestions(data.questions || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      const userAnswer = answers[i];
      if (userAnswer && userAnswer.startsWith(q.correct)) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    // Pass if 2 or more correct out of 3
    if (correct >= 2) {
      setTimeout(() => onPass(correct, questions.length), 1500);
    }
  };

  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;
  const passed = submitted && score >= 2;
  const failed = submitted && score < 2;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}>

      {/* Header */}
      <Box sx={{
        px: 3, py: 2,
        background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
        display: "flex", alignItems: "center", gap: 1.5,
      }}>
        <QuizIcon sx={{ color: "#fff", fontSize: 22 }} />
        <Box>
          <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, lineHeight: 1.2 }}>
            Knowledge Check
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
            {topicName}
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {loading && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress sx={{ color: C.primary, mb: 2 }} />
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Generating questions for "{topicName}"...
            </Typography>
          </Box>
        )}

        {error && (
          <Box>
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
              Could not generate quiz: {error}
            </Alert>
            <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }}>
              You can still mark this topic complete without a quiz.
            </Typography>
          </Box>
        )}

        {!loading && !error && questions.length > 0 && (
          <>
            {/* Progress */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Answer all 3 questions — need 2/3 to verify completion
              </Typography>
              <Chip
                label={`${Object.keys(answers).length}/3 answered`}
                size="small"
                sx={{ background: "#F0FDF4", color: C.primary, fontWeight: 600, fontSize: "0.7rem" }}
              />
            </Box>

            {/* Result banner */}
            {submitted && (
              <Alert
                severity={passed ? "success" : "error"}
                icon={passed ? <CheckCircleIcon /> : <CancelIcon />}
                sx={{ mb: 3, borderRadius: 2, fontWeight: 600 }}
              >
                {passed
                  ? `${score}/3 correct — Topic verified! Great work.`
                  : `${score}/3 correct — Review this topic and try again.`
                }
              </Alert>
            )}

            {/* Questions */}
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const isCorrect  = submitted && userAnswer?.startsWith(q.correct);
              const isWrong    = submitted && userAnswer && !userAnswer.startsWith(q.correct);

              return (
                <Box key={i} sx={{
                  mb: 3, p: 2.5, borderRadius: 2.5,
                  border: submitted
                    ? isCorrect ? "1px solid #A7F3D0" : isWrong ? "1px solid #FECACA" : "1px solid #E2E8F0"
                    : "1px solid #E2E8F0",
                  background: submitted
                    ? isCorrect ? "#F0FDF4" : isWrong ? "#FFF5F5" : "#F8FAFC"
                    : "#F8FAFC",
                  transition: "all 0.2s",
                }}>
                  <Box sx={{ display: "flex", gap: 1, mb: 1.5, alignItems: "flex-start" }}>
                    <Box sx={{
                      width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                      background: submitted
                        ? isCorrect ? "#10B981" : isWrong ? "#EF4444" : `${C.primary}20`
                        : `${C.primary}20`,
                      color: submitted && (isCorrect || isWrong) ? "#fff" : C.primary,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.75rem", fontWeight: 800,
                    }}>
                      {submitted ? (isCorrect ? "✓" : isWrong ? "✗" : i + 1) : i + 1}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B", lineHeight: 1.5 }}>
                      {q.question}
                    </Typography>
                  </Box>

                  <RadioGroup
                    value={answers[i] || ""}
                    onChange={(e) => {
                      if (!submitted) setAnswers(prev => ({ ...prev, [i]: e.target.value }));
                    }}
                  >
                    {q.options.map((opt, j) => {
                      const optLetter = opt.charAt(0);
                      const isOptCorrect = submitted && optLetter === q.correct;
                      const isOptWrong   = submitted && answers[i]?.charAt(0) === optLetter && optLetter !== q.correct;

                      return (
                        <FormControlLabel
                          key={j}
                          value={opt}
                          control={<Radio size="small" sx={{ color: C.primary, "&.Mui-checked": { color: C.primary } }} />}
                          label={
                            <Typography variant="body2" sx={{
                              color: isOptCorrect ? "#065F46" : isOptWrong ? "#991B1B" : "#374151",
                              fontWeight: isOptCorrect ? 700 : 400,
                            }}>
                              {opt}
                            </Typography>
                          }
                          disabled={submitted}
                          sx={{
                            mb: 0.5, mx: 0, px: 1, borderRadius: 1.5,
                            background: isOptCorrect ? "#D1FAE5" : isOptWrong ? "#FEE2E2" : "transparent",
                          }}
                        />
                      );
                    })}
                  </RadioGroup>

                  {/* Explanation after submit */}
                  {submitted && q.explanation && (
                    <Box sx={{ mt: 1.5, p: 1.5, background: "#EFF6FF", borderRadius: 1.5, border: "1px solid #BFDBFE" }}>
                      <Typography variant="caption" sx={{ color: "#1D4ED8", fontWeight: 600 }}>
                        Explanation: {q.explanation}
                      </Typography>
                    </Box>
                  )}
                </Box>
              );
            })}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        {/* Only Close allowed — no skip path */}
        <Button onClick={onClose} variant="text"
          sx={{ color: "#94A3B8", textTransform: "none", fontSize: "0.8rem" }}>
          Close
        </Button>

        {!loading && !error && !submitted && questions.length > 0 && (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            variant="contained"
            sx={{
              background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
              borderRadius: 2, textTransform: "none", fontWeight: 700,
              "&:disabled": { opacity: 0.5 },
            }}
          >
            Submit Answers
          </Button>
        )}

        {submitted && failed && (
          <>
            <Button onClick={fetchQuiz} variant="outlined"
              sx={{ borderColor: C.primary, color: C.primary, textTransform: "none", borderRadius: 2 }}>
              Try Again
            </Button>
            <Button onClick={() => onFail()} variant="text"
              sx={{ color: "#94A3B8", textTransform: "none", fontSize: "0.8rem" }}>
              Mark incomplete
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
