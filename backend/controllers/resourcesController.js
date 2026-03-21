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

const generateSmartPlan = async (req, res) => {
  const { day, topics, subject, hours } = req.body;
  if (!topics || !topics.length) return res.status(400).json({ error: 'topics are required' });

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const topicList = topics.map(t => `- ${t.name} (${t.hours || 1}h)`).join('\n');

    const prompt = `You are an expert study coach. A student needs to study the following topics for Day ${day || 1} of their ${subject || 'subject'} plan. They have ${hours || 2} hours total.

Topics to cover:
${topicList}

Create a detailed smart study plan. Return ONLY raw JSON (no markdown, no code blocks, no extra text):
{
  "overview": "2-3 sentence strategy overview for this day",
  "schedule": [
    {
      "time": "9:00 - 9:45",
      "activity": "specific activity description",
      "type": "study",
      "tip": "one actionable tip for this slot"
    }
  ],
  "topicBreakdown": [
    {
      "topic": "topic name",
      "duration": 45,
      "approach": "active recall",
      "resources": "suggested resource or technique"
    }
  ],
  "tips": ["tip 1", "tip 2", "tip 3"]
}

Rules:
- type must be one of: study, revision, break, practice
- Schedule must fit within ${hours || 2} hours total
- Include 1 short break per 90 mins
- approach should be specific: active recall, spaced repetition, practice problems, concept mapping, etc.
- tips should be practical and specific to these topics
- Return ONLY the JSON object, nothing else`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    const data = JSON.parse(cleaned);
    res.status(200).json(data);
  } catch (error) {
    console.error('Smart plan error:', error.message);
    res.status(500).json({ error: 'Failed to generate smart plan: ' + error.message });
  }
};

module.exports = { getResources, generateStudyPlan, generateSmartPlan };
