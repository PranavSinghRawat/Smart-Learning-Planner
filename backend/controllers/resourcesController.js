const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getResources = async (req, res) => {
  const { topic, subject } = req.query;

  if (!topic) {
    return res.status(400).json({ error: 'topic is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a study resource expert. A student needs to study "${topic}"${subject ? ` as part of ${subject}` : ''}.

Give exactly 3 study steps in this exact JSON format (no markdown, no extra text, just raw JSON):
{
  "steps": [
    {
      "what": "short action description of what to do in this step",
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
- Use real platforms: YouTube, Khan Academy, freeCodeCamp, LeetCode, Coursera, MDN, GeeksforGeeks, etc.
- URLs must be real working search or page URLs
- Keep "what" under 15 words
- Each step should build on the previous (beginner → intermediate → advanced)`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown code blocks if present
    const cleaned = text.replace(/^```json\n?/, '').replace(/^```\n?/, '').replace(/\n?```$/, '').trim();
    const data = JSON.parse(cleaned);

    res.status(200).json(data);
  } catch (error) {
    console.error('Gemini error:', error.message);
    res.status(500).json({ error: 'Failed to generate resources' });
  }
};

const generateStudyPlan = async (req, res) => {
  const { subject, days, hours, level } = req.body;

  if (!subject || !days || !hours || !level) {
    return res.status(400).json({ error: 'subject, days, hours, and level are required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert study planner. Create a ${days}-day study plan for "${subject}" at ${level} level with ${hours} hours per day.

Return ONLY raw JSON (no markdown, no explanation) in this exact format:
{
  "subject": "${subject}",
  "level": "${level}",
  "totalDays": ${days},
  "hoursPerDay": ${hours},
  "plan": [
    {
      "day": 1,
      "topics": [
        {
          "name": "specific topic name",
          "hours": 1.0,
          "completed": false
        }
      ]
    }
  ]
}

Rules:
- Each day must have topics that fit within ${hours} hours total
- Topics must be in logical learning order (fundamentals first)
- Topic names must be specific and actionable (e.g. "Arrays - Two Pointer Technique" not just "Arrays")
- Distribute topics evenly across ${days} days
- Level is ${level} so adjust complexity accordingly
- Return exactly ${days} day objects`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json\n?/, '').replace(/^```\n?/, '').replace(/\n?```$/, '').trim();
    const data = JSON.parse(cleaned);

    res.status(200).json(data);
  } catch (error) {
    console.error('Gemini study plan error:', error.message);
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
};

module.exports = { getResources, generateStudyPlan };
