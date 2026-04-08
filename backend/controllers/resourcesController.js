const Groq = require('groq-sdk');

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
    const data = await askGroq(`You are an expert study planner. Create a ${days}-day study plan for "${subject}" at ${level} level with ${hours} hours per day.

Return ONLY raw JSON in this exact format:
{
  "subject": "${subject}",
  "level": "${level}",
  "totalDays": ${days},
  "hoursPerDay": ${hours},
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
- Topics in logical learning order (fundamentals first)
- Topic names specific and actionable
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
  const { topic, subject } = req.body;
  if (!topic) return res.status(400).json({ error: 'topic is required' });

  try {
    const data = await askGroq(`You are a quiz generator. A student just finished studying "${topic}"${subject ? ` (part of ${subject})` : ''}.

Generate exactly 3 multiple choice questions to verify their understanding.

Return ONLY raw JSON:
{
  "questions": [
    {
      "question": "clear question text",
      "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
      "correct": "A",
      "explanation": "brief explanation of why this is correct"
    }
  ]
}

Rules:
- Questions must test actual understanding, not just memorization
- One correct answer per question (A, B, C, or D)
- Options must be plausible — no obviously wrong answers
- Keep questions concise and clear
- Return ONLY the JSON object`);

    res.status(200).json(data);
  } catch (error) {
    console.error('Groq quiz error:', error.message);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
};

module.exports = { getResources, generateStudyPlan, generateSmartPlan, generateQuiz };
