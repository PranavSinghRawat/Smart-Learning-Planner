const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
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
  // Strip markdown code fences if present
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  // Find the first { or [ to handle any leading text the LLM adds
  const jsonStart = cleaned.search(/[{[]/);
  if (jsonStart === -1) throw new Error('LLM returned no JSON object');
  return JSON.parse(cleaned.slice(jsonStart));
}

const getResources = async (req, res) => {
  const { topic, subject } = req.query;
  if (!topic) return res.status(400).json({ error: 'topic is required' });

  try {
    const data = await askGroq(`You are a study resource expert. A student needs to study "${topic}"${subject ? ` as part of ${subject}` : ''}.

Give exactly 3 study steps in this exact JSON format (no markdown, no extra text, just raw JSON):
{
  "steps": [
    {
      "what": "short action description under 15 words",
      "resource": {
        "label": "Platform Name – specific resource title",
        "url": "https://actual-working-url.com",
        "type": "video"
      },
      "problems": [
        {
          "label": "Practice resource name",
          "url": "https://actual-working-url.com",
          "difficulty": "Easy"
        }
      ]
    }
  ]
}

Rules:
- type must be one of: video, article, interactive, practice
- difficulty must be one of: Easy, Medium, Hard
- Use real platforms: YouTube, Khan Academy, freeCodeCamp, LeetCode, Coursera, MDN, GeeksforGeeks
- Each step builds on the previous (beginner to advanced)
- Return ONLY the JSON object`);

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
    const data = await askGroq(`You are an expert study planner. Create a high-intensity ${days}-day learning sprint for "${subject}" at ${level} level with ${hours} hours per day.

IMPORTANT: Frame this as a "Focus Sprint" or "Foundations Module", as it is part of a larger journey. Focus on the most critical, high-impact topics that can actually be mastered in this short timeframe.

Return ONLY raw JSON in this exact format:
{
  "subject": "${subject}",
  "level": "${level}",
  "totalDays": ${days},
  "hoursPerDay": ${hours},
  "phaseTitle": "e.g., Phase 1: Core Foundations",
  "plan": [
    {
      "day": 1,
      "topics": [
        { "name": "specific topic name", "hours": 1.0, "completed": false }
      ]
    }
  ]
}

Rules:
- Each day topics must fit within ${hours} hours total
- Focus on foundational and high-impact concepts first
- Topic names must be specific and actionable
- Return exactly ${days} day objects
- Return ONLY the JSON object`);

    res.status(200).json(data);
  } catch (error) {
    console.error('Groq study plan error:', error.message);
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
};

const generateSmartPlan = async (req, res) => {
  const { day, topics, subject, hours } = req.body;
  if (!topics || !topics.length) return res.status(400).json({ error: 'topics are required' });

  try {
    const topicList = topics.map(t => `- ${t.name} (${t.hours || 1}h)`).join('\n');

    const data = await askGroq(`You are an expert study coach. A student needs to study these topics for Day ${day || 1} of their ${subject || 'subject'} plan. They have ${hours || 2} hours total.

Topics:
${topicList}

Return ONLY raw JSON:
{
  "overview": "2-3 sentence strategy overview",
  "schedule": [
    { "time": "9:00 - 9:45", "activity": "specific activity", "type": "study", "tip": "one actionable tip" }
  ],
  "topicBreakdown": [
    { "topic": "topic name", "duration": 45, "approach": "active recall", "resources": "suggested resource" }
  ],
  "tips": ["tip 1", "tip 2", "tip 3"]
}

Rules:
- type: study, revision, break, or practice
- Schedule fits within ${hours || 2} hours
- Include 1 break per 90 mins
- Return ONLY the JSON object`);

    res.status(200).json(data);
  } catch (error) {
    console.error('Groq smart plan error:', error.message);
    res.status(500).json({ error: 'Failed to generate smart plan' });
  }
};

const generateQuiz = async (req, res) => {
  const { topic, subject, level = 'Beginner' } = req.body;
  if (!topic) return res.status(400).json({ error: 'topic is required' });

  try {
    const data = await askGroq(`You are a professional academic examiner. A student has studied "${topic}"${subject ? ` (part of ${subject})` : ''} at an ${level} level.

Generate exactly 3 multiple choice questions that specifically test ${level}-level depth.

Return ONLY raw JSON:
{
  "questions": [
    {
      "question": "clear question text",
      "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
      "correct": "A",
      "explanation": "brief explanation"
    }
  ]
}

Rules:
- Questions MUST be calibrated to ${level} level.
- Avoid obvious or overly generic questions. Focus on practical scenarios.
- Do NOT repeat common introductory facts. 
- Ensure questions for ${level} require actual logic or reasoning.
- Return ONLY the JSON object`);

    res.status(200).json(data);
  } catch (error) {
    console.error('Groq quiz error:', error.message);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
};

const generateCodingChallenge = async (req, res) => {
  const { topic, subject, level = 'Beginner', language = 'javascript' } = req.body;
  if (!topic) return res.status(400).json({ error: 'topic is required' });

  try {
    const data = await askGroq(`You are an expert technical interviewer. A student has studied "${topic}"${subject ? ` (part of ${subject})` : ''}.
    The student wants to solve a challenge in ${language} at an ${level} level.

Generate a JSON object for a unique coding challenge.

Return ONLY raw JSON:
{
  "title": "challenge title",
  "description": "clear problem description",
  "examples": [
    { "input": "input", "output": "output", "explanation": "why" }
  ],
  "starterCode": "full code signature here",
  "testCases": [
    { "input": "input", "expected": "expected_output" }
  ],
  "hint": "helpful hint",
  "language": "${language}",
  "difficulty": "${level}"
}

Rules:
- FOR JAVASCRIPT: Provide ONLY the "function solution(...) { ... }" signature.
- FOR PYTHON, JAVA, C++: Provide a FULL SELF-CONTAINED SCRIPT.
- Python: Include "def solution(...):" AND a "if __name__ == '__main__':" block that reads inputs using input() and prints the result.
- Java: Include "public class Solution { public static void main(String[] args) { ... } }" that reads from Scanner(System.in).
- C++: Include "int main() { ... }" that reads from std::cin.
- ENSURE the code handles the exact format of the testCases input.
- DIVERSITY GUARD: Avoid overused classic problems. Focus on ${topic}.
- starterCode must use "\\n" for newlines. Return only the JSON.`);

    res.status(200).json(data);
  } catch (error) {
    console.error('Groq coding challenge error:', error.message);
    res.status(500).json({ error: 'Failed to generate coding challenge' });
  }
};

const analyzeCodeLogic = async (req, res) => {
  const { topic, description, code, language, level } = req.body;
  if (!description || !code) return res.status(400).json({ error: 'Description and code are required' });

  try {
    const data = await askGroq(`You are the "AI Zen Mentor", a wise senior developer and teacher. A student is stuck on a coding challenge about "${topic}" in ${language}.

PROBLEM DESCRIPTION:
${description}

STUDENT'S CURRENT CODE:
\`\`\`${language}
${code}
\`\`\`

YOUR TASK:
Provide a "Zen Diagnostic" that helps the student find their own solution. 

RULES:
- DO NOT PROVIDE ANY CODE FIXES OR SOLUTIONS.
- Identify 2-3 specific "Conceptual Hurdles" or "Logic Gaps" in their current approach.
- Provide a overarching "Zen Tip" to point them toward the right data structure or algorithm.
- Tone: Wise, encouraging, and serene.

FORMAT (Return ONLY raw JSON):
{
  "analysis": [
    "bullet point 1",
    "bullet point 2"
  ],
  "zenTip": "one sentence of high-level advice"
}`);

    res.status(200).json(data);
  } catch (error) {
    console.error('Zen Mentor Error:', error.message);
    res.status(500).json({ error: 'The Zen Mentor is currently meditiating. Try again soon.' });
  }
};

const executeCode = async (req, res) => {
  const { language, code, testCases } = req.body;
  if (!code || !language || !testCases) return res.status(400).json({ error: 'Missing code, language, or testCases' });

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
      runCmd = 'java Solution';
    } else if (language === 'cpp') {
      fileName = 'solution.cpp';
      compileCmd = `g++ ${fileName} -o solution.out`;
      runCmd = './solution.out';
    } else {
      throw new Error('Language not supported for local execution');
    }

    fs.writeFileSync(path.join(tempDir, fileName), code);

    // Compile if needed
    if (compileCmd) {
      try {
        execSync(compileCmd, { cwd: tempDir, stdio: 'pipe' });
      } catch (e) {
        return res.status(200).json({ 
          passed: false, 
          message: 'Compilation Error', 
          error: e.stderr.toString() 
        });
      }
    }

    // Run test cases
    const results = [];
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const input = tc.input;
      
      const startTime = Date.now();
      try {
        // Execute with input piped to stdin
        const output = execSync(runCmd, { 
          cwd: tempDir, 
          input: String(input), 
          stdio: ['pipe', 'pipe', 'pipe'],
          timeout: 5000 // 5s timeout
        }).toString().trim();

        const duration = Date.now() - startTime;
        const expected = String(tc.expected).trim();
        const passed = output === expected;

        results.push({ i: i + 1, input, expected, output, passed, runtime: duration });
      } catch (e) {
        results.push({ 
          i: i + 1, 
          passed: false, 
          output: e.stderr?.toString() || e.message, 
          expected: tc.expected, 
          input 
        });
      }
    }

    const allPassed = results.every(r => r.passed);
    res.status(200).json({ passed: allPassed, testResults: results });

  } catch (error) {
    console.error('Execution Error:', error.message);
    res.status(500).json({ error: 'Failed to execute code locally' });
  } finally {
    // Cleanup
    try {
      if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) { console.error('Cleanup Error:', e.message); }
  }
};

module.exports = { getResources, generateStudyPlan, generateSmartPlan, generateQuiz, generateCodingChallenge, analyzeCodeLogic, executeCode };
