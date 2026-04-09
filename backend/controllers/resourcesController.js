const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

async function askGroq(prompt) {
  const res = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });
  const text = res.choices[0]?.message?.content?.trim() || '';
  
  // Robust JSON extraction: find first '{' or '[' and last '}' or ']'
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');
  let start = -1;
  if (firstBrace !== -1 && firstBracket !== -1) start = Math.min(firstBrace, firstBracket);
  else start = firstBrace !== -1 ? firstBrace : firstBracket;

  const lastBrace = text.lastIndexOf('}');
  const lastBracket = text.lastIndexOf(']');
  let end = -1;
  if (lastBrace !== -1 && lastBracket !== -1) end = Math.max(lastBrace, lastBracket);
  else end = lastBrace !== -1 ? lastBrace : lastBracket;

  if (start === -1 || end === -1 || end < start) {
    console.error('LLM Output with no JSON:', text);
    throw new Error('LLM returned no valid JSON object');
  }

  const cleaned = text.substring(start, end + 1);
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('JSON Parse Error. Cleaned text:', cleaned);
    throw new Error('LLM returned invalid JSON structure');
  }
}

const getResources = async (req, res) => {
  const { topic, subject } = req.query;
  if (!topic) return res.status(400).json({ error: 'topic is required' });

  try {
    const prompt = `Provide a list of 5 high-quality learning resources for "${topic}"${subject ? ` in the context of ${subject}` : ''}.
Return ONLY a raw JSON array: [{"title": "...", "url": "...", "type": "...", "description": "..."}]`;
    const data = await askGroq(prompt);
    res.status(200).json(data);
  } catch (error) {
    console.error('Groq resources error:', error.message);
    res.status(500).json({ error: 'Failed to generate resources' });
  }
};

const generateStudyPlan = async (req, res) => {
  const { subject, days, hours, level } = req.body;
  if (!subject || !days || !hours || !level)
    return res.status(400).json({ error: 'subject, days, hours, and level are required' });

  try {
    const data = await askGroq(`Create a high-intensity ${days}-day learning sprint for "${subject}" at ${level} level.
Return ONLY raw JSON:
{
  "subject": "${subject}",
  "plan": [
    { "day": 1, "topics": [{ "name": "topic name", "hours": 1.0, "completed": false }] }
  ]
}`);
    res.status(200).json(data);
  } catch (error) {
    console.error('Groq study plan error:', error.message);
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
};

const generateQuiz = async (req, res) => {
  const { topic, subject, level = 'Beginner' } = req.body;
  if (!topic) return res.status(400).json({ error: 'topic is required' });

  try {
    const data = await askGroq(`Generate exactly 3 multiple choice questions that test "${topic}" at ${level} level.
Return ONLY raw JSON:
{
  "questions": [
    { "question": "...", "options": ["A) ..", "B) .."], "correct": "A", "explanation": "..." }
  ]
}`);
    res.status(200).json(data);
  } catch (error) {
    console.error('Groq quiz error:', error.message);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
};

const { generateStarterCode, generateDriverCode } = require('../utils/codeHarnessUtil');

const generateCodingChallenge = async (req, res) => {
  const { topic, subject, level = 'Beginner', language = 'javascript' } = req.body;
  if (!topic) return res.status(400).json({ error: 'topic is required' });

  try {
    const data = await askGroq(`You are a senior software engineer generating coding challenges for an online judge.
Topic: ${topic}
Difficulty: ${level}

RULES:
1. Focus only on logic and problem-solving.
2. Do NOT include classes, imports, or boilerplate in your response.
3. Return ONLY valid JSON (no markdown).

SCHEMA:
{
  "title": "string",
  "description": "string",
  "function_signature": {
    "name": "string",
    "parameters": [{ "name": "string", "type": "string" }],
    "return_type": "string"
  },
  "input_format": "string",
  "output_format": "string",
  "constraints": ["string"],
  "examples": [{ "input": { "p1": "v1" }, "output": "v", "explanation": "s" }],
  "edge_cases": ["string"],
  "test_cases": {
    "public": [{ "input": { "p1": "v1" }, "output": "v" }],
    "hidden": [{ "input": { "p1": "v1" }, "output": "v" }]
  }
}`);

    // Post-process: Generate the starter and driver code based on the signature
    const sig = data.function_signature;
    const testCases = data.test_cases;
    
    data.starterCode = generateStarterCode(sig, language);
    data.driverCode = generateDriverCode(sig, testCases, language);
    
    // Flatten test cases for the existing execution engine compatibility if needed
    data.testCases = [
      ...(testCases.public || []).map(tc => ({ 
        input: JSON.stringify(tc.input), 
        expected: JSON.stringify(tc.output) 
      })),
      ...(testCases.hidden || []).map(tc => ({ 
        input: JSON.stringify(tc.input), 
        expected: JSON.stringify(tc.output) 
      }))
    ];

    res.status(200).json(data);
  } catch (error) {
    console.error('Groq coding challenge error:', error.message);
    res.status(500).json({ error: 'Failed to generate professional coding challenge' });
  }
};

const analyzeCodeLogic = async (req, res) => {
  const { topic, description, code, language } = req.body;
  try {
    const data = await askGroq(`You are the "AI Zen Mentor". Provide Socratic logic clues (no code) for:
PROBLEM: ${description}
CODE: ${code}
Return ONLY JSON: {"analysis": [".."], "zenTip": ".."}`);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Zen Mentor is meditiating.' });
  }
};

const sanitizeError = (stderr, language, importOffset = 0) => {
  if (!stderr) return '';
  let cleaned = stderr.toString();

  // Remove mentions of the temporary runner files and classes
  cleaned = cleaned.replace(/Solution\.java/g, 'Source');
  cleaned = cleaned.replace(/solution\.py/g, 'Source');
  cleaned = cleaned.replace(/solution\.cpp/g, 'Source');
  cleaned = cleaned.replace(/Runner/g, '');

  // Line number recalibration for Java/C++
  if (importOffset > 0 && (language === 'java' || language === 'cpp')) {
    cleaned = cleaned.replace(/Source:(\d+)/g, (match, lineNum) => {
      const adjusted = parseInt(lineNum) - importOffset - 1; // -1 for the extra newline we added
      return `Line ${adjusted > 0 ? adjusted : 1}`;
    });
  }

  // General cleanup of noisy paths
  cleaned = cleaned.replace(/\/Users\/[^\s:]+/g, '...');
  
  return cleaned.trim();
};

const executeCode = async (req, res) => {
  const { language, code, driverCode, testCases } = req.body;
  if (!code || !language || !testCases) return res.status(400).json({ error: 'Missing logic' });

  const runId = crypto.randomBytes(8).toString('hex');
  const tempDir = path.join(__dirname, '..', 'temp', `run_${runId}`);
  
  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'temp'))) fs.mkdirSync(path.join(__dirname, '..', 'temp'));
    fs.mkdirSync(tempDir);

    let fileName, compileCmd, runCmd;
    if (language === 'python') {
      fileName = 'solution.py';
      runCmd = `python3 ${fileName}`;
    } else if (language === 'java') {
      fileName = 'Solution.java';
      compileCmd = `javac ${fileName}`;
      runCmd = driverCode ? 'java Runner' : 'java Solution';
    } else if (language === 'cpp') {
      fileName = 'solution.cpp';
      compileCmd = `g++ ${fileName} -o solution.out`;
      runCmd = './solution.out';
    } else {
      throw new Error('Unsupported language');
    }

    let fullCode = driverCode ? `${code}\n\n${driverCode}` : code;
    let importOffset = 0;

    // Smart Merge for Java/C++: Move imports to the top and sanitize public classes
    if (language === 'java' || language === 'cpp') {
      const lines = fullCode.split('\n');
      const importLines = [];
      const contentLines = [];
      lines.forEach(line => {
        let l = line;
        const trimmed = l.trim();
        if (language === 'java' && trimmed.startsWith('public class ') && !trimmed.includes('class Solution')) {
          l = l.replace('public class ', 'class ');
        }
        if (language === 'java' && (trimmed.startsWith('import ') || trimmed.startsWith('package '))) {
          importLines.push(l);
        } else if (language === 'cpp' && (trimmed.startsWith('#include') || trimmed.startsWith('using namespace'))) {
          importLines.push(l);
        } else {
          contentLines.push(l);
        }
      });
      importOffset = importLines.length;
      fullCode = [...importLines, '', ...contentLines].join('\n');
    }

    fs.writeFileSync(path.join(tempDir, fileName), fullCode);

    if (compileCmd) {
      try {
        execSync(compileCmd, { cwd: tempDir, stdio: 'pipe' });
      } catch (e) {
        const washedError = sanitizeError(e.stderr, language, importOffset);
        return res.status(200).json({ passed: false, message: 'Compilation Error', error: washedError });
      }
    }

    const results = [];
    if (driverCode) {
      // Hardcoded architecture: Run once, script prints all outputs
      try {
        const fullOutput = execSync(runCmd, {
          cwd: tempDir,
          stdio: ['pipe', 'pipe', 'pipe'],
          timeout: 5000
        }).toString().trim();
        const outputLines = fullOutput.split('\n').map(l => l.trim());
        
        testCases.forEach((tc, i) => {
          const expected = String(tc.expected).trim();
          // Remove surrounding quotes from expected and output to compare purely logically
          const cleanExpected = expected.replace(/^"|"$/g, '').trim();
          const cleanOutput = (outputLines[i] || '').replace(/^"|"$/g, '').trim();
          results.push({
            input: tc.input,
            expected: tc.expected,
            output: outputLines[i] || "No output",
            passed: cleanOutput === cleanExpected
          });
        });
      } catch (e) {
        const washedError = sanitizeError(e.stderr || e.message, language, importOffset);
        testCases.forEach(tc => {
          results.push({ passed: false, error: washedError, expected: tc.expected, input: tc.input });
        });
      }
    } else {
      // Legacy generative architecture
      for (const tc of testCases) {
        try {
          const output = execSync(runCmd, {
            cwd: tempDir,
            input: String(tc.input),
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 5000
          }).toString().trim();
          const expected = String(tc.expected).trim();
          const cleanExpected = expected.replace(/^"|"$/g, '').trim();
          const cleanOutput = output.replace(/^"|"$/g, '').trim();
          results.push({ input: tc.input, expected: tc.expected, output, passed: cleanOutput === cleanExpected });
        } catch (e) {
          const washedError = sanitizeError(e.stderr || e.message, language, importOffset);
          results.push({ passed: false, error: washedError, expected: tc.expected, input: tc.input });
        }
      }
    }

    res.status(200).json({ passed: results.every(r => r.passed), testResults: results });

  } catch (error) {
    console.error('Execution Engine Error:', error);
    res.status(500).json({ error: 'System level execution failure', details: error.message });
  } finally {
    try {
      if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) { console.error('Cleanup Error:', e.message); }
  }
};

const generateSmartPlan = async (req, res) => {
  const { subject, days, hours, level } = req.body;
  try {
    const data = await askGroq(`Create a ${days}-day smart plan for ${subject} at ${level}. Return ONLY JSON: {"plan": []}`);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

module.exports = {
  getResources,
  generateStudyPlan,
  generateSmartPlan,
  generateQuiz,
  generateCodingChallenge,
  analyzeCodeLogic,
  executeCode
};
