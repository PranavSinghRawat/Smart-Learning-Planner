import React, { useState, useEffect } from "react";
import {
  Dialog, Button, Typography, Box, CircularProgress, Alert, Chip, Divider,
  Tabs, Tab, List, ListItem, ListItemIcon, ListItemText,
} from "@mui/material";
import TerminalIcon from "@mui/icons-material/Terminal";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import PsychologyIcon from "@mui/icons-material/Psychology";
import Editor from "@monaco-editor/react";

const C = { primary: "#0F766E", secondary: "#06B6D4", dark: "#0F172A", paper: "#1E293B", text: "#94A3B8" };
const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export function isCodingTopic(topicName) {
  if (!topicName) return false;
  const t = topicName.toLowerCase();
  return /array|string|linked list|stack|queue|hash|tree|graph|sort|search|dynamic programming|recursion|algorithm|function|loop|variable|class|object|pointer|javascript|python|java|c\+\+|react|node|sql|api|rest|async|promise|closure|prototype|oop|inheritance|polymorphism|binary|heap|trie|backtrack|greedy|dp|bfs|dfs|regex|dom|event|hook|component|module|import|export|decorator|generator|iterator|comprehension|exception|thread|async|coroutine|pandas|numpy|dataframe|matplotlib/.test(t);
}

export default function CodingChallengeDialog({ open, topicName, subject, level = 'Beginner', onPass, onFail, onClose }) {
  const [challenge, setChallenge] = useState(null);
  const [language, setLanguage]   = useState("javascript");
  const [code, setCode]           = useState("");
  const [loading, setLoading]     = useState(false);
  const [running, setRunning]     = useState(false);
  const [result, setResult]       = useState(null);
  const [showHint, setShowHint]   = useState(false);
  const [error, setError]         = useState("");
  
  const [consoleTab, setConsoleTab] = useState(0);
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [zenFeedback, setZenFeedback] = useState(null);
  const [zenLoading, setZenLoading] = useState(false);

  useEffect(() => {
    if (open && topicName) {
      fetchChallenge();
      setZenFeedback(null);
    }
  }, [open, topicName, language]);

  const askZenMentor = async () => {
    if (!challenge || !code.trim()) return;
    setZenLoading(true);
    try {
      const res = await fetch(`${API}/resources/analyze-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicName,
          description: challenge.description,
          code,
          language,
          level
        }),
      });
      const data = await res.json();
      setZenFeedback(data);
    } catch (e) {
      console.error(e);
    } finally {
      setZenLoading(false);
    }
  };

  const fetchChallenge = async () => {
    setLoading(true);
    setError("");
    setChallenge(null);
    setCode("");
    setResult(null);
    setActiveCaseIdx(0);
    setConsoleTab(0);
    try {
      const res = await fetch(`${API}/resources/coding-challenge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicName, subject, level, language }),
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
    setConsoleTab(1);

    if (language === "javascript") {
      setTimeout(() => {
        try {
          // eslint-disable-next-line no-new-func
          const fn = new Function(`
            ${code}
            return typeof solution !== 'undefined' ? solution : null;
          `)();

          if (!fn) throw new Error("'solution' function not found. Make sure to name your function 'solution'.");

          const testResults = challenge.testCases.map((tc, i) => {
            try {
              let input;
              try { 
                input = JSON.parse(tc.input); 
              } catch { 
                input = tc.input; 
              }
              
              let output;
              if (Array.isArray(input)) {
                output = fn.length > 1 ? fn(...input) : fn(input);
              } else {
                output = fn(input);
              }

              const outputStr = JSON.stringify(output);
              const expectedStr = JSON.stringify(tc.expected);
              const passed = outputStr === expectedStr;
              return { i: i + 1, input: tc.input, expected: tc.expected, output: output, passed };
            } catch (e) {
              return { i: i + 1, passed: false, output: `Error: ${e.message}`, expected: tc.expected, input: tc.input };
            }
          });

          const allPassed = testResults.every(t => t.passed);
          setResult({ passed: allPassed, testResults, runtime: Math.floor(Math.random() * 30) + 5 });
        } catch (e) {
          setResult({ passed: false, message: e.message });
        } finally {
          setRunning(false);
        }
      }, 800);
    } else {
      const callBackendRunner = async () => {
        try {
          const res = await fetch(`${API}/resources/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ language, code, testCases: challenge.testCases }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Execution failed");
          setResult(data);
        } catch (e) {
          setResult({ passed: false, message: e.message });
        } finally {
          setRunning(false);
        }
      };
      callBackendRunner();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth
      PaperProps={{ sx: { borderRadius: 0, height: "100vh", maxHeight: "100vh", background: C.dark } }}>

      <Box sx={{
        px: 3, py: 1, background: C.paper, borderBottom: "1px solid #334155",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TerminalIcon sx={{ color: C.secondary, fontSize: 18 }} />
            <Typography variant="caption" sx={{ color: "#fff", fontWeight: 900, letterSpacing: 1, textTransform: "uppercase" }}>Coding Lab</Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ borderColor: "#334155", height: 16, my: "auto" }} />
          <Typography variant="body2" sx={{ color: "#94A3B8", fontWeight: 700 }}>{topicName}</Typography>
        </Box>
        
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {["javascript", "python", "java", "cpp"].map(lang => (
            <Button key={lang} size="small" onClick={() => setLanguage(lang)}
              sx={{
                minWidth: 40, px: 2, height: 28, fontSize: "0.65rem", fontWeight: 900,
                background: language === lang ? `${C.secondary}20` : "transparent",
                color: language === lang ? C.secondary : "#64748B",
                border: `1px solid ${language === lang ? C.secondary : "transparent"}`,
                borderRadius: 1, textTransform: "uppercase"
              }}>
              {lang === "javascript" ? "JS" : lang.toUpperCase()}
            </Button>
          ))}
          <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: "#334155" }} />
          <Button onClick={onClose} size="small" sx={{ color: "#EF4444", fontWeight: 800, fontSize: "0.7rem" }}>EXIT</Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Box sx={{ width: "35%", p: 3, overflowY: "auto", borderRight: "1px solid #334155", background: C.dark }}>
          {loading ? (
            <Box sx={{ textAlign: "center", mt: 15 }}>
              <CircularProgress size={24} sx={{ color: C.secondary }} />
              <Typography variant="caption" sx={{ display: "block", mt: 2, color: "#475569" }}>Initializing workspace...</Typography>
            </Box>
          ) : challenge ? (
            <>
              <Typography variant="h5" sx={{ color: "#F1F5F9", fontWeight: 900, mb: 1, letterSpacing: -0.5 }}>{challenge.title}</Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 4 }}>
                <Chip label={challenge.difficulty || "Medium"} size="small" sx={{ background: "#1E293B", color: C.secondary, fontWeight: 900, fontSize: "0.65rem", height: 20 }} />
                <Chip label="Algorithm" size="small" sx={{ background: "#1E293B", color: "#94A3B8", fontWeight: 900, fontSize: "0.65rem", height: 20 }} />
              </Box>
              
              <Typography variant="body2" sx={{ color: "#CBD5E1", lineHeight: 1.8, mb: 4, whiteSpace: "pre-wrap" }}>
                {challenge.description}
              </Typography>

              <Typography variant="subtitle2" sx={{ color: "#F1F5F9", fontWeight: 800, mb: 2, fontSize: "0.8rem", textTransform: "uppercase" }}>Examples</Typography>
              {challenge.examples?.map((ex, i) => (
                <Box key={i} sx={{ mb: 3, p: 2, background: C.paper, borderRadius: 2, border: "1px solid #334155" }}>
                  <Typography variant="caption" sx={{ color: C.secondary, display: "block", mb: 1, fontWeight: 900, fontSize: "0.6rem" }}>EXAMPLE {i+1}</Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>Input:</Typography>
                    <Typography variant="caption" sx={{ color: "#E2E8F0", fontFamily: "monospace" }}>{ex.input}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>Output:</Typography>
                    <Typography variant="caption" sx={{ color: "#86EFAC", fontFamily: "monospace" }}>{ex.output}</Typography>
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 4, borderColor: "#334155" }} />
              <Button startIcon={<LightbulbIcon sx={{ fontSize: 16 }} />} onClick={() => setShowHint(!showHint)} size="small" sx={{ color: "#F59E0B", textTransform: "none", fontWeight: 700, p: 0 }}>
                {showHint ? "Hide Hint" : "Get a hint"}
              </Button>
              {showHint && (
                <Alert severity="info" sx={{ mt: 2, background: "#1E293B", color: "#FCD34D", border: "1px solid #F59E0B30", fontSize: "0.75rem", borderRadius: 2 }}>
                  {challenge.hint}
                </Alert>
              )}
            </>
          ) : <Alert severity="error" sx={{ borderRadius: 2 }}>{error || "Failed to sync with challenge server."}</Alert>}
        </Box>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", background: "#1E293B" }}>
          <Box sx={{ flex: 1, overflow: "hidden", position: "relative", borderBottom: "4px solid #0F172A" }}>
            <Box sx={{ position: "absolute", top: 10, right: 20, zIndex: 10, display: "flex", gap: 1 }}>
              <Button size="small" onClick={runCode} disabled={running || !code.trim() || !challenge}
                sx={{ background: "#334155", color: "#fff", textTransform: "none", px: 2, fontWeight: 700, "&:hover": { background: "#475569" } }}>
                {running ? <CircularProgress size={12} sx={{ color: "#fff" }} /> : "Run"}
              </Button>
              {result?.passed && (
                <Button size="small" onClick={() => onPass(1, 1)}
                  sx={{ background: "#22C55E", color: "#fff", textTransform: "none", px: 2, fontWeight: 900, "&:hover": { background: "#16A34A" } }}>
                  Submit
                </Button>
              )}
            </Box>
            <Editor height="100%" language={language === "cpp" ? "cpp" : language} value={code}
               onChange={(val) => setCode(val || "")} theme="vs-dark"
               options={{ fontSize: 15, minimap: { enabled: false }, padding: { top: 20 }, lineNumbers: "on", automaticLayout: true, fontFamily: "Menlo, Monaco, 'Courier New', monospace" }} />
          </Box>

          <Box sx={{ height: "35%", background: C.dark, display: "flex", flexDirection: "column" }}>
            <Box sx={{ background: "#1E293B", display: "flex", justifyContent: "space-between", px: 1 }}>
               <Tabs value={consoleTab} onChange={(e, v) => setConsoleTab(v)} sx={{ minHeight: 36, "& .MuiTab-root": { minHeight: 36, py: 0, color: "#64748B", fontWeight: 800, fontSize: "0.65rem", textTransform: "uppercase" } }}>
                 <Tab label="Testcase" />
                 <Tab label={`Result ${result ? (result.passed ? "✓" : "✗") : ""}`} />
               </Tabs>
               {running && <CircularProgress size={12} sx={{ my: "auto", mr: 2, color: C.secondary }} />}
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
              {consoleTab === 0 ? (
                challenge ? (
                  <Box>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      {challenge.testCases.map((tc, idx) => (
                        <Button key={idx} size="small" onClick={() => setActiveCaseIdx(idx)}
                          sx={{ 
                            minWidth: 40, px: 1.5, height: 24, fontSize: "0.6rem", fontWeight: 900,
                            background: activeCaseIdx === idx ? "#334155" : "transparent",
                            color: activeCaseIdx === idx ? "#fff" : "#475569", borderRadius: 1
                          }}>
                          Case {idx + 1}
                        </Button>
                      ))}
                    </Box>
                    <Box sx={{ p: 2, background: "#1E293B", borderRadius: 2 }}>
                       <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 0.5 }}>Input =</Typography>
                       <Typography variant="caption" sx={{ color: "#E2E8F0", fontFamily: "monospace", wordBreak: "break-all" }}>
                        {challenge.testCases[activeCaseIdx].input}
                       </Typography>
                    </Box>
                  </Box>
                ) : <Typography variant="caption" sx={{ color: "#475569" }}>No testcases loaded.</Typography>
              ) : (
                !result ? (
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#475569" }}>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>Run your code to see results</Typography>
                  </Box>
                ) : (
                  <Box>
                    {result.passed ? (
                      <Box sx={{ mb: 2, p: 2, background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: "#22C55E", fontWeight: 900, fontSize: "1.1rem" }}>Accepted</Typography>
                        <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                          <Typography variant="caption" sx={{ color: "#94A3B8" }}>Runtime: <Box component="span" sx={{ color: "#fff" }}>{result.runtime || 0} ms</Box></Typography>
                          <Typography variant="caption" sx={{ color: "#94A3B8" }}>Memory: <Box component="span" sx={{ color: "#fff" }}>14.2 MB</Box></Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ mb: 2, p: 2, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 2 }}>
                         <Typography variant="subtitle2" sx={{ color: "#EF4444", fontWeight: 900, fontSize: "1.1rem" }}>Wrong Answer</Typography>
                         <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", mt: 0.5 }}>
                           {result.message || `Failed on test case ${activeCaseIdx + 1}`}
                         </Typography>
                         {result.error && (
                            <Box sx={{ mt: 2, p: 1.5, background: "#0F172A", borderRadius: 1.5, borderLeft: "4px solid #EF4444" }}>
                               <Typography variant="caption" sx={{ color: "#FCA5A5", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                                 {result.error}
                               </Typography>
                            </Box>
                         )}
                      </Box>
                    )}

                    {!result.passed && (
                      <Box sx={{ mb: 2, textAlign: "right" }}>
                        <Button variant="outlined" size="small" onClick={askZenMentor} disabled={zenLoading}
                          startIcon={zenLoading ? <CircularProgress size={14} /> : <PsychologyIcon sx={{ fontSize: 16 }} />}
                          sx={{ 
                            color: "#818CF8", borderColor: "#818CF830", textTransform: "none", 
                            fontWeight: 800, fontSize: "0.7rem", "&:hover": { borderColor: "#818CF8", background: "#818CF805" } 
                          }}>
                          {zenLoading ? "Zen Mentor is meditiating..." : "Ask Zen Mentor for Logic Clues"}
                        </Button>
                      </Box>
                    )}

                    {zenFeedback && (
                      <Box sx={{ 
                        mt: 2, mb: 3, p: 2, background: "linear-gradient(135deg, #1E293B, #0F172A)", 
                        borderLeft: "4px solid #818CF8", borderRadius: 1.5,
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                      }}>
                        <Typography variant="caption" sx={{ color: "#818CF8", fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, display: "block", mb: 1 }}>
                          Zen Mentor Diagnostics
                        </Typography>
                        <List size="small" sx={{ p: 0, mb: 2 }}>
                          {zenFeedback.analysis?.map((point, i) => (
                            <ListItem key={i} sx={{ p: 0, px: 0, alignItems: "flex-start", mb: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 20, mt: 0.5 }}>
                                <Box sx={{ width: 4, height: 4, bgcolor: "#818CF8", borderRadius: "50%" }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={point} 
                                primaryTypographyProps={{ sx: { color: "#CBD5E1", fontSize: "0.75rem", lineHeight: 1.5 } }} 
                              />
                            </ListItem>
                          ))}
                        </List>
                        <Alert icon={false} sx={{ background: "#818CF810", color: "#818CF8", border: "1px dashed #818CF830", fontSize: "0.75rem", py: 0.5 }}>
                          <Typography variant="caption" sx={{ fontStyle: "italic", fontWeight: 700 }}>
                            Zen Tip: {zenFeedback.zenTip}
                          </Typography>
                        </Alert>
                      </Box>
                    )}

                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      {result.testResults?.map((t, idx) => (
                        <Button key={idx} size="small" onClick={() => setActiveCaseIdx(idx)}
                          sx={{ 
                            minWidth: 50, px: 2, height: 26, fontSize: "0.65rem", fontWeight: 900,
                            color: t.passed ? "#22C55E" : "#EF4444",
                            background: activeCaseIdx === idx ? `${t.passed ? "#22C55E" : "#EF4444"}15` : "transparent",
                            border: activeCaseIdx === idx ? `1px solid ${t.passed ? "#22C55E50" : "#EF444450"}` : "none",
                          }}>
                          Case {idx + 1} {!t.passed && "✗"}
                        </Button>
                      ))}
                    </Box>

                    {result.testResults && (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 800, textTransform: "uppercase", fontSize: "0.6rem", display: "block", mb: 0.5 }}>Input</Typography>
                          <Box sx={{ p: 1.5, background: "#0F172A", borderRadius: 1.5, border: "1px solid #334155" }}>
                            <Typography variant="caption" sx={{ color: "#E2E8F0", fontFamily: "monospace", fontSize: "0.75rem" }}>{result.testResults[activeCaseIdx].input}</Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: "flex", gap: 2 }}>
                           <Box sx={{ flex: 1 }}>
                              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 800, textTransform: "uppercase", fontSize: "0.6rem", display: "block", mb: 0.5 }}>Your Output</Typography>
                              <Box sx={{ p: 1.5, background: "#0F172A", borderRadius: 1.5, border: "1px solid #334155" }}>
                                <Typography variant="caption" sx={{ color: result.testResults[activeCaseIdx].passed ? "#22C55E" : "#EF4444", fontFamily: 'monospace', fontSize: "0.75rem", wordBreak: "break-all" }}>
                                  {JSON.stringify(result.testResults[activeCaseIdx].output) || "No output"}
                                </Typography>
                              </Box>
                           </Box>
                           <Box sx={{ flex: 1 }}>
                              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 800, textTransform: "uppercase", fontSize: "0.6rem", display: "block", mb: 0.5 }}>Expected</Typography>
                              <Box sx={{ p: 1.5, background: "#0F172A", borderRadius: 1.5, border: "1px solid #334155" }}>
                                <Typography variant="caption" sx={{ color: "#22C55E", fontFamily: 'monospace', fontSize: "0.75rem", wordBreak: "break-all" }}>
                                  {JSON.stringify(result.testResults[activeCaseIdx].expected || result.testResults[activeCaseIdx].output) || "n/a"}
                                </Typography>
                              </Box>
                           </Box>
                        </Box>
                        
                        {!result.testResults[activeCaseIdx].passed && (
                          <Alert severity="error" icon={false} sx={{ background: "transparent", color: "#EF4444", border: "1px dashed #EF444430", py: 0.2, fontSize: "0.7rem", fontWeight: 700 }}>
                            Mismatch detected: Double check your logic for this input.
                          </Alert>
                        )}
                      </Box>
                    )}
                  </Box>
                )
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
