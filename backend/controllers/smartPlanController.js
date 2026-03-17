/**
 * Smart Plan Controller
 * Generates a personalised daily study plan by:
 * 1. Fetching user's exams and their weak topics
 * 2. Building candidate sessions (exam prep + career roadmap topics)
 * 3. Scoring each session via the MLP model (Unit I: FNN)
 * 4. Sorting by effectiveness score and returning the best fit for today
 */

const Exam = require('../models/Exam');
const { scoreSessions } = require('../services/mlService');

// Difficulty map for ML features
const DIFFICULTY_MAP = { easy: 0, medium: 1, hard: 2 };

const generateSmartPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      hoursAvailable = 4,
      careerGoal = '',
      careerProgress = {},   // { "Android Developer_0_1": true, ... }
      sessionHistory = [],   // [{ topic, subject, totalHours, lastConfidence }]
    } = req.body;

    const totalMinutes = hoursAvailable * 60;
    const candidates = [];

    // ── 1. Exam prep sessions ─────────────────────────────────────────────
    const exams = await Exam.find({ userId }).sort({ examDate: 1 });

    exams.forEach(exam => {
      const daysLeft = Math.max(0, Math.ceil((new Date(exam.examDate) - new Date()) / 86400000));
      const duration = daysLeft <= 3 ? 60 : daysLeft <= 7 ? 45 : 30;

      (exam.weakTopics || []).forEach(topic => {
        const history = sessionHistory.find(h => h.topic === topic && h.subject === exam.examName) || {};
        candidates.push({
          type: 'exam',
          label: `${exam.examName} – ${topic}`,
          examName: exam.examName,
          topic,
          duration,
          daysLeft,
          urgency: daysLeft <= 3 ? 'Urgent' : daysLeft <= 7 ? 'Soon' : 'Planned',
          // ML features
          difficulty: DIFFICULTY_MAP[exam.difficulty] ?? 1,
          days_to_exam: daysLeft,
          past_hours: history.totalHours || 0,
          prev_confidence: history.lastConfidence || 0,
          topic_weight: daysLeft <= 7 ? 0.9 : 0.6,
          hours_available: hoursAvailable,
        });
      });
    });

    // ── 2. Career roadmap sessions ────────────────────────────────────────
    if (careerGoal) {
      const ROADMAP_PHASES = getCareerPhases(careerGoal);
      let added = 0;
      ROADMAP_PHASES.forEach((phase, pi) => {
        phase.topics.forEach((topic, ti) => {
          const key = `${careerGoal}_${pi}_${ti}`;
          if (!careerProgress[key] && added < 4) {
            const history = sessionHistory.find(h => h.topic === topic && h.subject === careerGoal) || {};
            candidates.push({
              type: 'career',
              label: `${careerGoal} – ${topic}`,
              careerGoal,
              topic,
              phase: phase.phase,
              duration: 60,
              daysLeft: 999,
              urgency: 'Planned',
              // ML features
              difficulty: 1,
              days_to_exam: 30,
              past_hours: history.totalHours || 0,
              prev_confidence: history.lastConfidence || 0,
              topic_weight: 0.5,
              hours_available: hoursAvailable,
            });
            added++;
          }
        });
      });
    }

    if (candidates.length === 0) {
      return res.status(200).json({ sessions: [], message: 'No candidates. Add exams or select a career goal.' });
    }

    // ── 3. Score via MLP ──────────────────────────────────────────────────
    const mlFeatures = candidates.map(c => ({
      difficulty: c.difficulty,
      days_to_exam: c.days_to_exam,
      past_hours: c.past_hours,
      prev_confidence: c.prev_confidence,
      topic_weight: c.topic_weight,
      hours_available: c.hours_available,
    }));

    const { scores, source } = await scoreSessions(mlFeatures);

    // Attach scores to candidates
    const scored = candidates.map((c, i) => ({ ...c, effectivenessScore: scores[i] || 0 }));

    // ── 4. Sort by score, pick sessions that fit in available time ────────
    scored.sort((a, b) => b.effectivenessScore - a.effectivenessScore);

    const selected = [];
    let usedMinutes = 0;
    for (const session of scored) {
      if (usedMinutes + session.duration <= totalMinutes) {
        selected.push(session);
        usedMinutes += session.duration;
      }
    }

    res.status(200).json({
      sessions: selected,
      totalMinutes: usedMinutes,
      scoringSource: source,
      message: source === 'mlp'
        ? 'Sessions scored by MLP deep learning model (Unit I: FNN)'
        : 'Sessions scored by rule-based fallback (ML service offline)',
    });

  } catch (err) {
    console.error('Smart Plan Error:', err.message);
    res.status(500).json({ message: 'Server error generating smart plan.' });
  }
};

// ── Career roadmap data (mirrors frontend) ────────────────────────────────
function getCareerPhases(goal) {
  const ROADMAPS = {
    "Android Developer": [
      { phase: "Phase 1 – Foundations", topics: ["Kotlin Basics – syntax, null safety, lambdas","Android Studio setup & project structure","Activities & Intents – navigation, lifecycle","Layouts & Views – XML, ConstraintLayout, RecyclerView","Resources & Themes – strings, colors, styles"] },
      { phase: "Phase 2 – Core Android", topics: ["Fragments & Navigation Component","ViewModel & LiveData – MVVM pattern","Room Database – local persistence, DAOs","Retrofit & REST APIs – network calls, Gson","Coroutines & Flow – async programming"] },
      { phase: "Phase 3 – Advanced", topics: ["Jetpack Compose – declarative UI","Dependency Injection – Hilt/Dagger","WorkManager – background tasks","Firebase – Auth, Firestore, FCM push notifications","Play Store deployment – signing, release builds"] },
    ],
    "MERN Developer": [
      { phase: "Phase 1 – Foundations", topics: ["JavaScript ES6+ – arrow functions, promises, async/await","Node.js basics – modules, fs, http","Express.js – routing, middleware, REST APIs","MongoDB & Mongoose – schemas, CRUD, aggregation","React fundamentals – JSX, components, hooks"] },
      { phase: "Phase 2 – Full Stack", topics: ["JWT Authentication – login, register, protected routes","React Router – SPA navigation, params","State Management – Context API or Redux Toolkit","File uploads – Multer, Cloudinary","Environment variables & dotenv"] },
      { phase: "Phase 3 – Production", topics: ["Error handling & validation – Joi, express-validator","Testing – Jest, Supertest, React Testing Library","Deployment – Render/Railway backend, Vercel frontend","CI/CD – GitHub Actions basics","Security – CORS, helmet, rate limiting, XSS prevention"] },
    ],
    "Data Scientist": [
      { phase: "Phase 1 – Python & Data", topics: ["Python for Data – NumPy, Pandas, Matplotlib","Data Cleaning – missing values, outliers, encoding","Exploratory Data Analysis – statistics, visualizations","SQL for Data – joins, aggregations, window functions","Git & Jupyter Notebooks workflow"] },
      { phase: "Phase 2 – Machine Learning", topics: ["Supervised Learning – regression, classification","Unsupervised Learning – clustering, PCA","Model Evaluation – cross-validation, metrics","Feature Engineering – selection, transformation","Scikit-learn pipelines"] },
      { phase: "Phase 3 – Advanced ML", topics: ["Deep Learning – neural networks with TensorFlow/Keras","NLP – tokenization, embeddings, transformers","Time Series – ARIMA, LSTM forecasting","Model Deployment – Flask API, Docker, cloud","MLOps – experiment tracking with MLflow"] },
    ],
    "DevOps Engineer": [
      { phase: "Phase 1 – Foundations", topics: ["Linux CLI – bash scripting, file system, permissions","Git & GitHub – branching, PRs, workflows","Networking basics – TCP/IP, DNS, HTTP, firewalls","Docker – images, containers, Dockerfile, Compose","YAML & JSON – config file formats"] },
      { phase: "Phase 2 – CI/CD & Cloud", topics: ["GitHub Actions – pipelines, secrets, matrix builds","AWS/GCP basics – EC2, S3, IAM, VPC","Kubernetes – pods, deployments, services, Helm","Terraform – infrastructure as code","Monitoring – Prometheus, Grafana, alerting"] },
      { phase: "Phase 3 – Advanced", topics: ["Service mesh – Istio, traffic management","Security – secrets management, SAST/DAST scanning","Cost optimization – right-sizing, spot instances","Disaster recovery – backups, RTO/RPO planning","SRE practices – SLOs, error budgets, postmortems"] },
    ],
    "Flutter Developer": [
      { phase: "Phase 1 – Dart & Flutter Basics", topics: ["Dart fundamentals – types, functions, OOP, async","Flutter widgets – Stateless vs Stateful","Layouts – Row, Column, Stack, Expanded","Navigation – Navigator 2.0, go_router","State management basics – setState, Provider"] },
      { phase: "Phase 2 – App Development", topics: ["BLoC / Riverpod – scalable state management","REST APIs – http package, Dio, JSON parsing","Local storage – SharedPreferences, Hive, SQLite","Firebase integration – Auth, Firestore, Storage","Custom animations – AnimationController, Tween"] },
      { phase: "Phase 3 – Production", topics: ["Platform channels – native Android/iOS code","Testing – unit, widget, integration tests","Performance profiling – DevTools, jank detection","App signing & release – Play Store, App Store","CI/CD – Fastlane, Codemagic"] },
    ],
  };
  return ROADMAPS[goal] || [];
}

module.exports = { generateSmartPlan };
