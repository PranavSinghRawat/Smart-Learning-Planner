/**
 * ML Service client
 * Calls the Python Flask MLP API to score candidate study sessions.
 * Falls back to rule-based scoring if the ML service is unavailable.
 */

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:5002';

/**
 * Rule-based fallback scorer (mirrors the training data logic)
 * Used when the Python ML service is unreachable.
 */
const ruleBasedScore = (session) => {
  const urgency    = Math.max(0, 1 - session.days_to_exam / 30);
  const confGap    = Math.max(0, 1 - session.prev_confidence / 5);
  const weight     = session.topic_weight;
  const diffFit    = session.difficulty === 2
    ? Math.min(session.hours_available / 3, 1)
    : session.difficulty === 1
      ? Math.min(session.hours_available / 2, 1)
      : 1;
  const saturation = Math.max(0.1, 1 - session.past_hours / 20);
  return +(0.35 * urgency + 0.25 * confGap + 0.20 * weight + 0.10 * diffFit + 0.10 * saturation).toFixed(4);
};

/**
 * Score an array of candidate sessions using the MLP model.
 * @param {Array} sessions - array of session feature objects
 * @returns {Promise<{scores: number[], source: string}>}
 */
const scoreSessions = async (sessions) => {
  if (!sessions || sessions.length === 0) return { scores: [], source: 'none' };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const res = await fetch(`${ML_URL}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessions }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`ML service returned ${res.status}`);
    const data = await res.json();
    return { scores: data.scores, source: 'mlp' };

  } catch (err) {
    console.warn(`ML service unavailable (${err.message}), using rule-based fallback.`);
    return {
      scores: sessions.map(ruleBasedScore),
      source: 'fallback',
    };
  }
};

module.exports = { scoreSessions, ruleBasedScore };
