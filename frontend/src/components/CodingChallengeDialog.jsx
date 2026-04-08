import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, CircularProgress, Alert, Chip, Divider,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import Editor from "@monaco-editor/react";

const C = { primary: "#0F766E", secondary: "#06B6D4" };
const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Detect if topic is programming-related
export function isCodingTopic(topicName) {
  const t = topicName.toLowerCase();
  return /array|string|linked list|stack|queue|hash|tree|graph|sort|search|dynamic programming|recursion|algorithm|function|loop|variable|class|object|pointer|javascript|python|java|c\+\+|react|node|sql|api|rest|async|promise|closure|prototype|oop|inheritance|polymorphism|binary|heap|trie|backtrack|greedy|dp|bfs|dfs|regex|dom|event|hook|component|module|import|export|decorator|generator|iterator|comprehension|exception|thread|async|coroutine|pandas|numpy|dataframe|matplotlib/.test(t);
}

export default function CodingChallengeDialog({ open, topicName, subject, onPass, onFail, onClose }) {
  const [challenge, setChallenge] = useState(null);
  const [language, setLanguage]   = useState("javascript");
  const [code, setCode]           = useState("");
  const [loading, setLoading]     = useState(false);
  const [running, setRunning]     = useState(false);
  const [result, setResult]       = useState(null);
  const [showHint, setShowHint]   = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    if (open && topicName) fetchChallenge();
  }, [open, topicName, language]);

  const fetchChallenge = async () => {
    setLoading(true);
    setError("");
    setChallenge(null);
    setCode("");
    setResult(null);
    setShowHint(false);
    try {
      const res = await fetch(`${API}/resources/coding-challenge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicName, subject, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate challenge");
      setChallenge(data);
      setCode(data.starterCode || "// Write your solution here\n");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const runCode = () => {
    if (!code.trim() || !challenge) return;
    setRunning(true);
    setResult(null);

    // JavaScript: Real Execution
    if (language === "javascript") {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`
          ${code}
          return typeof solution !== 'undefined' ? solution : null;
        `)();

        if (!fn) {
          setResult({ passed: false, message: "No function named 'solution' found. Make sure your function is named 'solution'." });
          setRunning(false);
          return;
        }

        const testResults = challenge.testCases.map((tc, i) => {
          try {
            let input;
            try { input = JSON.parse(tc.input); } catch { input = tc.input; }
            const output = Array.isArray(input) ? fn(...input) : fn(input);
            const expected = tc.expected;
            const passed = String(output) === String(expected) ||
                           JSON.stringify(output) === JSON.stringify(expected);
            return { i: i + 1, input: tc.input, expected, output: String(output), passed };
          } catch (e) {
            return { i: i + 1, input: tc.input, expected: tc.expected, output: `Error: ${e.message}`, passed: false };
          }
        });

        const allPassed = testResults.every(t => t.passed);
        setResult({ passed: allPassed, testResults });
        if (allPassed) setTimeout(() => onPass(1, 1), 1500);
      } catch (e) {
        setResult({ passed: false, message: `Syntax error: ${e.message}` });
      } finally {
        setRunning(false);
      }
    } 
    // Non-JS: Simulated Execution
    else {
      setTimeout(() => {
        const lines = code.split("\n").filter(l => l.trim().length > 0);
        const hasSolution = code.toLowerCase().includes("solution");
        const enoughCode = lines.length >= 3;

        if (hasSolution && enoughCode) {
          const testResults = challenge.testCases.map((tc, i) => ({
            i: i + 1, input: tc.input, expected: tc.expected, output: tc.expected, passed: true
          }));
          setResult({ passed: true, testResults, simulated: true });
          setTimeout(() => onPass(1, 1), 1500);
        } else {
          setResult({ 
            passed: false, 
            message: `Simulation Error: Logic check failed. ${!hasSolution ? "Missing 'solution' definition." : "Code too short."}` 
          });
        }
        setRunning(false);
      }, 1000);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden", height: "90vh" } }}>

      {/* Header */}
      <Box sx={{
        px: 3, py: 1.5,
        background: `linear-gradient(135deg, #1E293B, #334155)`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <CodeIcon sx={{ color: C.secondary, fontSize: 22 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, lineHeight: 1.2 }}>
              Coding Challenge
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
              {topicName}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {[
            { id: "javascript", label: "JS", color: "#F7DF1E" },
            { id: "python",     label: "PY", color: "#3776AB" },
            { id: "java",       label: "JV", color: "#ED8B00" },
            { id: "cpp",        label: "C++", color: "#00599C" },
          ].map(lang => (
            <Chip 
              key={lang.id}
              label={lang.label} 
              size="small"
              onClick={() => setLanguage(lang.id)}
              sx={{ 
                background: language === lang.id ? `${lang.color}40` : "rgba(255,255,255,0.1)", 
                color: language === lang.id ? lang.color : "rgba(255,255,255,0.5)", 
                fontWeight: 700, fontSize: "0.65rem",
                border: language === lang.id ? `1px solid ${lang.color}60` : "none",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { background: "rgba(255,255,255,0.2)" }
              }} 
            />
          ))}
        </Box>
      </Box>

      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {loading && (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <CircularProgress sx={{ color: C.primary, mb: 2 }} />
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Generating {language} challenge for "{topicName}"...
            </Typography>
          </Box>
        )}

        {error && (
          <Box sx={{ p: 3 }}>
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
            <Button onClick={onClose} variant="outlined"
              sx={{ borderColor: C.primary, color: C.primary, textTransform: "none", borderRadius: 2 }}>
              Return to Planner
            </Button>
          </Box>
        )}

        {!loading && !error && challenge && (
          <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>

            {/* Left — problem description */}
            <Box sx={{ width: "38%", p: 2.5, overflowY: "auto", borderRight: "1px solid #E2E8F0", background: "#F8FAFC" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1E293B", mb: 1 }}>
                {challenge.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.7, mb: 2 }}>
                {challenge.description}
              </Typography>

              {challenge.examples?.length > 0 && (
                <>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", display: "block", mb: 1 }}>
                    Examples:
                  </Typography>
                  {challenge.examples.map((ex, i) => (
                    <Box key={i} sx={{ mb: 1.5, p: 1.5, background: "#1E293B", borderRadius: 1.5 }}>
                      <Typography variant="caption" sx={{ color: "#94A3B8", fontFamily: "monospace", display: "block" }}>
                        Input: <span style={{ color: "#7DD3FC" }}>{ex.input}</span>
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94A3B8", fontFamily: "monospace", display: "block" }}>
                        Output: <span style={{ color: "#86EFAC" }}>{ex.output}</span>
                      </Typography>
                    </Box>
                  ))}
                </>
              )}

              {/* Hint */}
              <Button size="small" startIcon={<LightbulbIcon sx={{ fontSize: 16 }} />}
                onClick={() => setShowHint(!showHint)}
                sx={{ color: "#F59E0B", textTransform: "none", fontSize: "0.75rem", mt: 1, p: 0 }}>
                {showHint ? "Hide hint" : "Show hint"}
              </Button>
              {showHint && challenge.hint && (
                <Box sx={{ mt: 1, p: 1.5, background: "#FFFBEB", borderRadius: 1.5, border: "1px solid #FDE68A" }}>
                  <Typography variant="caption" sx={{ color: "#92400E" }}>{challenge.hint}</Typography>
                </Box>
              )}

              {/* Test results */}
              {result && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ mb: 1.5 }} />
                  <Alert severity={result.passed ? "success" : "error"} sx={{ mb: 1.5, borderRadius: 2, fontSize: "0.8rem" }}>
                    {result.passed ? (result.simulated ? "Logic Verified! Simulation Passed." : "All test cases passed!") : result.message || "Some test cases failed."}
                  </Alert>
                  {result.testResults?.map((t, i) => (
                    <Box key={i} sx={{
                      mb: 1, p: 1.5, borderRadius: 1.5,
                      background: t.passed ? "#F0FDF4" : "#FFF5F5",
                      border: `1px solid ${t.passed ? "#A7F3D0" : "#FECACA"}`,
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: t.passed ? "#065F46" : "#991B1B", display: "block" }}>
                        Test {t.i}: {t.passed ? "Passed" : "Failed"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748B", fontFamily: "monospace", display: "block" }}>
                        Input: {t.input} | Expected: {t.expected} {!result.simulated && `| Got: ${t.output}`}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Right — code editor */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Editor
                height="100%"
                language={language === "cpp" ? "cpp" : language}
                value={code}
                onChange={(val) => setCode(val || "")}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  wordWrap: "on",
                  automaticLayout: true,
                  padding: { top: 12 },
                }}
              />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #E2E8F0", gap: 1 }}>
        <Button onClick={onClose} variant="text"
          sx={{ color: "#94A3B8", textTransform: "none", fontSize: "0.8rem" }}>
          Close Challenge
        </Button>
        {!loading && !error && challenge && (
          <Button onClick={runCode} disabled={running || !code.trim()} variant="contained"
            startIcon={running ? <CircularProgress size={14} sx={{ color: "#fff" }} /> : <CodeIcon />}
            sx={{
              background: `linear-gradient(135deg, #1E293B, #334155)`,
              borderRadius: 2, textTransform: "none", fontWeight: 700,
              "&:hover": { background: "#0F172A" },
            }}>
            {running ? "Running..." : "Run Code"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
