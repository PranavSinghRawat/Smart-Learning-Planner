import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar,
  XAxis, YAxis, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  ChevronDown, ChevronUp, CheckCircle2, Circle,
  Play, Pause, RotateCcw, X, Plus, Clock,
  LogOut, BookOpen, Sparkles, Target, TrendingUp,
  Calendar, BarChart2, History, GraduationCap,
} from 'lucide-react';

const TEAL  = '#0F766E';
const CYAN  = '#0891b2';
const GREEN = '#059669';
const AMBER = '#d97706';
const RED   = '#dc2626';

const SUBJECTS_DB = {
  DSA: { emoji: '📊', fullName: 'Data Structures & Algorithms', color: '#6366f1',
    description: 'Master CS fundamentals — data structures and algorithms from ground up',
    Beginner:     ['Arrays & Strings — Indexing, searching, sorting basics','Linked Lists — Singly linked list, operations','Stacks & Queues — LIFO/FIFO operations','Hash Tables — Hashing, collision handling','Sorting Basics — Bubble, selection, insertion sort','Big O Notation — Time & space complexity analysis'],
    Intermediate: ['Binary Search Trees — BST operations, traversals','Graphs & BFS/DFS — Graph representations, traversals','Dynamic Programming Intro — Memoization basics','Greedy Algorithms — Activity selection, fractional knapsack','Backtracking — N-Queens, permutations, combinations','Heaps & Priority Queues — Min/Max heap implementation'],
    Advanced:     ['Advanced DP — Longest subsequences, matrix chain multiplication','Network Flow — Max flow, Ford-Fulkerson algorithm','Segment Trees — Range queries, updates','Tries & String Matching — KMP, Rabin-Karp algorithms','NP-Complete Problems — Recognition & approximation','Graph Algorithms — Dijkstra, Floyd-Warshall, Bellman-Ford'],
  },
  Python: { emoji: '🐍', fullName: 'Python Programming', color: '#f59e0b',
    description: 'Python from basics to advanced OOP, web development, and data science',
    Beginner:     ['Syntax & Variables — Data types, variable assignment','Control Flow — if/else statements, loops (for, while)','Functions & Scope — Function definition, parameters, return values','Data Types — Lists, tuples, dictionaries, sets','String Operations — String methods, f-strings, formatting','File I/O — Reading, writing, file operations'],
    Intermediate: ['OOP Basics — Classes, objects, inheritance, polymorphism','Modules & Packages — Import system, creating modules','Exception Handling — Try-except blocks, custom exceptions','Decorators & Closures — Function decorators, nested functions','Generators & Iterators — yield keyword, generator functions','List Comprehensions — Concise list creation, nested comprehensions'],
    Advanced:     ['Async Programming — asyncio, async/await, event loops','Metaclasses — Class creation, __new__, __init__','Performance Optimization — Profiling, caching, optimization','Testing & Debugging — unittest, pytest, debugging techniques','Design Patterns — Singleton, Factory, Observer, Strategy','Memory Management — Garbage collection, optimization tips'],
  },
  'Web Dev': { emoji: '🌐', fullName: 'Web Development', color: '#0891b2',
    description: 'Full-stack web development — frontend, backend, and deployment',
    Beginner:     ['HTML Basics — Semantic HTML, forms, accessibility','CSS Styling — Flexbox, Grid, responsive design','JavaScript Fundamentals — Variables, functions, DOM','DOM Manipulation — querySelector, event listeners','Forms & Validation — Form handling, client-side validation','Responsive Design — Media queries, mobile-first approach'],
    Intermediate: ['React Hooks — useState, useEffect, custom hooks','Component Architecture — Composition, reusable components','REST APIs — Fetch API, axios, error handling','Routing — React Router, navigation, params','CSS Frameworks — Tailwind CSS, Bootstrap integration','Local Storage & Session — Browser storage APIs'],
    Advanced:     ['Performance Optimization — Code splitting, lazy loading, memoization','Testing — Jest, React Testing Library, E2E testing','Deployment — Vercel, Netlify, GitHub Pages, CI/CD','Security — CORS, XSS prevention, CSRF tokens, authentication','Advanced Patterns — HOC, Render Props, Compound Components','Server-Side Rendering — Next.js, SSR concepts'],
  },
  'Machine Learning': { emoji: '🤖', fullName: 'Machine Learning & AI', color: '#8b5cf6',
    description: 'Comprehensive guide to ML, deep learning, and AI applications',
    Beginner:     ['Python for ML — NumPy arrays, Pandas dataframes','Data Preprocessing — Cleaning, handling missing values','Exploratory Data Analysis — Statistics, visualization','Linear Regression — Cost function, gradient descent','Logistic Regression — Binary classification, probability','Decision Trees — Tree construction, pruning, visualization'],
    Intermediate: ['Random Forests — Ensemble methods, bagging, feature importance','K-Means Clustering — Unsupervised learning, centroid updates','Principal Component Analysis — Dimensionality reduction','Support Vector Machines — Kernel methods, margin maximization','Neural Networks Basics — Perceptron, backpropagation','Model Evaluation — Confusion matrix, precision, recall, F1-score'],
    Advanced:     ['Deep Learning — CNNs for image recognition, RNNs for sequences','Natural Language Processing — Tokenization, embeddings, BERT','Computer Vision — Image classification, object detection','Reinforcement Learning — Q-learning, policy gradient','Transfer Learning — Pre-trained models, fine-tuning','Model Deployment — TensorFlow Serving, containerization'],
  },
  JavaScript: { emoji: '⚡', fullName: 'JavaScript Mastery', color: '#eab308',
    description: 'Deep dive into JavaScript ES6+, async programming, and modern frameworks',
    Beginner:     ['Variables & Scope — var, let, const, block scope','Data Types & Operators — Primitives, type coercion','Functions & Arrow Functions — Function declarations, arrow syntax','Objects & Arrays — Object methods, array manipulation','DOM & Events — Event handling, event delegation','Promise Basics — Promise creation, then/catch chaining'],
    Intermediate: ['Async/Await — Async functions, error handling with try-catch','Closures & Hoisting — Variable hoisting, closure patterns','Prototypes & Inheritance — Prototype chain, constructor functions','Modules — ES6 import/export, module patterns','Error Handling — Custom errors, error stack traces','Regular Expressions — Regex patterns, exec, match, replace'],
    Advanced:     ['Advanced Closures — Module pattern, data privacy','Event Loop & Microtasks — Execution context, call stack','Web Workers — Multi-threading in JavaScript','Memory Leaks — Detecting and preventing memory issues','Design Patterns — Singleton, Observer, Module pattern','Advanced Async — Race conditions, concurrent operations'],
  },
  React: { emoji: '⚛️', fullName: 'React & Frontend', color: '#06b6d4',
    description: 'Master React for building modern, scalable, performant web applications',
    Beginner:     ['JSX & Components — Function components, JSX syntax','Props & State — Component props, useState hook','Hooks (useState, useEffect) — Managing component lifecycle','Conditional Rendering — if/else, ternary, logical AND','Lists & Keys — Rendering lists, key prop importance','Form Handling — Controlled components, input handling'],
    Intermediate: ['Context API — Creating context, useContext hook','Custom Hooks — Building reusable hooks, hook rules','useReducer — Complex state management, reducer pattern','Performance Optimization — useMemo, useCallback, React.memo','Code Splitting — Dynamic imports, lazy loading','Error Boundaries — Error handling in components'],
    Advanced:     ['Advanced Patterns — HOC, Render Props, composition','Server Components — RSC concepts, async components','Suspense & Lazy Loading — Code splitting, data fetching','Concurrent Features — Transitions, startTransition','React Testing — Component testing, hooks testing','State Management — Redux, Zustand, Jotai integration'],
  },
};

const fmtTimer = s => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
};
const dayProgress = day => {
  const total = day.topics.length, done = day.topics.filter(t => t.completed).length;
  return total === 0 ? 0 : Math.round((done / total) * 100);
};
const statusInfo = day => {
  const p = dayProgress(day);
  if (p === 100) return { label: 'Complete',    color: GREEN,      bg: '#f0fdf4', border: '#bbf7d0' };
  if (p > 0)    return { label: 'In Progress', color: AMBER,      bg: '#fffbeb', border: '#fde68a' };
  return               { label: 'Pending',     color: '#94a3b8',  bg: '#f8fafc', border: '#e2e8f0' };
};

/* ── Day Card ── */
const DayCard = ({ day, dayIndex, onToggle }) => {
  const [open, setOpen] = useState(dayIndex === 0);
  const { label, color, bg, border } = statusInfo(day);
  const pct  = dayProgress(day);
  const done = day.topics.filter(t => t.completed).length;

  return (
    <div className="rounded-xl border overflow-hidden bg-white transition-all hover:shadow-sm" style={{ borderColor: border }}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-slate-50/80 transition-colors">
        <div className="w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 text-white"
          style={{ background: `linear-gradient(135deg, ${TEAL}, ${CYAN})` }}>
          <span className="text-[9px] font-semibold opacity-75 leading-none">DAY</span>
          <span className="text-sm font-bold leading-tight">{day.day}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-slate-700">{done} / {day.topics.length} topics</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={{ color, background: bg, borderColor: border }}>
              {label}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: pct === 100 ? GREEN : `linear-gradient(90deg, ${TEAL}, ${CYAN})` }} />
          </div>
        </div>
        <span className="text-sm font-bold w-10 text-right shrink-0" style={{ color: pct === 100 ? GREEN : TEAL }}>{pct}%</span>
        {open ? <ChevronUp size={15} className="text-slate-400 shrink-0" /> : <ChevronDown size={15} className="text-slate-400 shrink-0" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="border-t border-slate-100 divide-y divide-slate-50">
              {day.topics.map((topic, j) => {
                const [title, desc] = topic.name.split(' — ');
                return (
                  <div key={j} onClick={() => onToggle(dayIndex, j)}
                    className={`flex items-start gap-3 px-5 py-3 cursor-pointer transition-colors select-none ${topic.completed ? 'bg-emerald-50/40' : 'hover:bg-slate-50'}`}>
                    {topic.completed
                      ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" style={{ color: GREEN }} />
                      : <Circle size={18} className="shrink-0 mt-0.5 text-slate-300" />}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-snug ${topic.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{title}</p>
                      {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
                    </div>
                    <span className="text-xs text-slate-400 shrink-0 mt-0.5 tabular-nums">{topic.hours}h</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Custom Subject Dialog ── */
const CustomDialog = ({ onClose, onCreate }) => {
  const [name, setName]     = useState('');
  const [tab, setTab]       = useState(0);
  const [topics, setTopics] = useState({ Beginner: '', Intermediate: '', Advanced: '' });
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleCreate = () => {
    if (!name.trim()) return;
    const parse = t => t.split('\n').map(s => s.trim()).filter(Boolean);
    onCreate(name.trim(), {
      emoji: '🎯', fullName: name.trim(), color: '#6366f1',
      description: `Custom learning path for ${name.trim()}`,
      Beginner: parse(topics.Beginner), Intermediate: parse(topics.Intermediate), Advanced: parse(topics.Advanced),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0F766E, #0891b2)' }}>
              <Sparkles size={14} className="text-white" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Create Custom Subject</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
            <X size={15} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subject Name</label>
            <input type="text" placeholder="e.g. Advanced Databases" value={name} onChange={e => setName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Topics by Level</label>
            <div className="flex rounded-xl border border-slate-200 overflow-hidden mb-3">
              {levels.map((l, i) => (
                <button key={l} onClick={() => setTab(i)}
                  className={`flex-1 py-2 text-xs font-semibold transition-colors ${tab === i ? 'text-white' : 'text-slate-500 hover:text-slate-700 bg-white'}`}
                  style={tab === i ? { background: 'linear-gradient(135deg, #0F766E, #0891b2)' } : {}}>
                  {l}
                </button>
              ))}
            </div>
            <textarea rows={5} placeholder="One topic per line" value={topics[levels[tab]]}
              onChange={e => setTopics(t => ({ ...t, [levels[tab]]: e.target.value }))}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={handleCreate} disabled={!name.trim()}
              className="flex-1 h-10 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #0F766E, #0891b2)' }}>
              Create Subject
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ── Main Component ── */
export default function StudyPlanner({ user, onLogout }) {
  const [subject, setSubject]         = useState('DSA');
  const [days, setDays]               = useState(7);
  const [hours, setHours]             = useState(2);
  const [level, setLevel]             = useState('Beginner');
  const [plan, setPlan]               = useState([]);
  const [customSubjects, setCustom]   = useState({});
  const [showCustom, setShowCustom]   = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory]         = useState([]);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSecs, setTimerSecs]     = useState(0);
  const [toast, setToast]             = useState(null);
  const timerRef = useRef(null);

  const allSubjects = { ...SUBJECTS_DB, ...customSubjects };

  useEffect(() => {
    if (!user?.id) return;
    const h = localStorage.getItem(`sp_history_${user.id}`);
    const c = localStorage.getItem(`sp_custom_${user.id}`);
    if (h) try { setHistory(JSON.parse(h)); } catch {}
    if (c) try { setCustom(JSON.parse(c)); } catch {}
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) localStorage.setItem(`sp_history_${user.id}`, JSON.stringify(history));
  }, [history, user?.id]);

  useEffect(() => {
    if (user?.id) localStorage.setItem(`sp_custom_${user.id}`, JSON.stringify(customSubjects));
  }, [customSubjects, user?.id]);

  useEffect(() => {
    if (timerActive) timerRef.current = setInterval(() => setTimerSecs(s => s + 1), 1000);
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const generatePlan = () => {
    const subData = allSubjects[subject];
    if (!subData) return;
    const topics = subData[level] || [];
    if (!topics.length) return;
    const topicsPerDay = Math.ceil(topics.length / days);
    const hoursPerTopic = (hours / topicsPerDay).toFixed(1);
    const planData = [];
    let idx = 0;
    for (let d = 1; d <= days && idx < topics.length; d++) {
      const dayTopics = [];
      for (let i = 0; i < topicsPerDay && idx < topics.length; i++) {
        dayTopics.push({ name: topics[idx++], completed: false, hours: hoursPerTopic });
      }
      planData.push({ day: d, topics: dayTopics });
    }
    setPlan(planData);
    setHistory(prev => [{ id: Date.now(), subject, level, days, hours, createdAt: new Date().toLocaleDateString() }, ...prev.slice(0, 19)]);
    showToast('Study plan generated');
  };

  const toggleTopic = (dayIdx, topicIdx) => {
    setPlan(prev => prev.map((d, di) =>
      di !== dayIdx ? d : { ...d, topics: d.topics.map((t, ti) => ti !== topicIdx ? t : { ...t, completed: !t.completed }) }
    ));
  };

  const handleCreateCustom = (name, data) => {
    setCustom(prev => ({ ...prev, [name]: data }));
    setSubject(name);
    setShowCustom(false);
    showToast(`"${name}" added`);
  };

  const totalDone  = plan.reduce((s, d) => s + d.topics.filter(t => t.completed).length, 0);
  const totalLeft  = plan.reduce((s, d) => s + d.topics.filter(t => !t.completed).length, 0);
  const totalPct   = totalDone + totalLeft > 0 ? Math.round((totalDone / (totalDone + totalLeft)) * 100) : 0;
  const totalHours = plan.reduce((s, d) => s + d.topics.reduce((a, t) => a + parseFloat(t.hours), 0), 0);
  const pieData    = [{ name: 'Completed', value: totalDone || 0 }, { name: 'Remaining', value: totalLeft || 1 }];
  const barData    = plan.map(d => ({ name: `D${d.day}`, progress: dayProgress(d) }));
  const currentSub = allSubjects[subject];

  /* ── Layout: full-height, fixed sidebar + scrollable main ── */
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">

      {/* ── Top Navbar ── */}
      <header className="shrink-0 h-14 border-b border-slate-200 bg-white flex items-center px-6 gap-4 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #0F766E, #0891b2)' }}>
            <GraduationCap size={15} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">StudyPlanner AI</span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #0F766E, #0891b2)' }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-medium text-slate-700">{user?.username}</span>
          </div>

          <button onClick={() => setShowHistory(v => !v)}
            className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold border transition-colors ${showHistory ? 'bg-teal-50 border-teal-200 text-teal-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            <History size={13} /> History
            {history.length > 0 && <span className="ml-0.5 bg-teal-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{history.length}</span>}
          </button>

          <button onClick={onLogout}
            className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors">
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </header>

      {/* ── Body: sidebar + content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left Sidebar (fixed width, scrollable) ── */}
        <aside className="w-80 shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-y-auto">

          {/* Plan Builder */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <Target size={14} className="text-teal-600" />
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Build Study Plan</h2>
            </div>

            {/* Subject preview card */}
            <div className="rounded-xl p-3.5 mb-4 border" style={{ background: `${currentSub?.color}08`, borderColor: `${currentSub?.color}30` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{currentSub?.emoji}</span>
                <p className="text-sm font-semibold text-slate-800 leading-tight">{currentSub?.fullName}</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{currentSub?.description}</p>
            </div>

            {/* Form fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Subject</label>
                <select value={subject} onChange={e => setSubject(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all">
                  {Object.entries(allSubjects).map(([k, v]) => (
                    <option key={k} value={k}>{v.emoji} {v.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Skill Level</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                    <button key={l} onClick={() => setLevel(l)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition-all ${level === l ? 'text-white border-transparent' : 'text-slate-500 border-slate-200 hover:border-slate-300 bg-white'}`}
                      style={level === l ? { background: 'linear-gradient(135deg, #0F766E, #0891b2)', borderColor: 'transparent' } : {}}>
                      {l === 'Beginner' ? '🌱' : l === 'Intermediate' ? '📈' : '🚀'} {l.slice(0, l === 'Intermediate' ? 6 : 99)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Days</label>
                  <input type="number" min={1} max={365} value={days}
                    onChange={e => setDays(Math.max(1, +e.target.value))}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Hrs / Day</label>
                  <input type="number" min={0.5} step={0.5} value={hours}
                    onChange={e => setHours(Math.max(0.5, +e.target.value))}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" />
                </div>
              </div>

              <button onClick={generatePlan}
                className="w-full h-10 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] mt-1"
                style={{ background: 'linear-gradient(135deg, #0F766E, #0891b2)' }}>
                <Sparkles size={14} /> Generate Plan
              </button>

              <button onClick={() => setShowCustom(true)}
                className="w-full h-9 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors">
                <Plus size={13} /> Add Custom Subject
              </button>
            </div>
          </div>

          {/* Timer */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-teal-600" />
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Study Timer</h2>
            </div>
            <p className="text-3xl font-bold font-mono tracking-tight mb-3" style={{ color: TEAL }}>{fmtTimer(timerSecs)}</p>
            <div className="flex gap-2">
              <button onClick={() => setTimerActive(v => !v)}
                className="flex-1 h-9 rounded-lg text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
                style={{ background: timerActive ? RED : GREEN }}>
                {timerActive ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Start</>}
              </button>
              <button onClick={() => { setTimerSecs(0); setTimerActive(false); }}
                className="h-9 px-3 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50 transition-colors">
                <RotateCcw size={13} /> Reset
              </button>
            </div>
          </div>

          {/* Stats */}
          {plan.length > 0 && (
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-teal-600" />
                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Overview</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Days',      value: plan.length,              color: TEAL },
                  { label: 'Topics',    value: totalDone + totalLeft,    color: '#6366f1' },
                  { label: 'Done',      value: totalDone,                color: GREEN },
                  { label: 'Hours',     value: `${totalHours.toFixed(1)}h`, color: AMBER },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="text-xs text-slate-500 mb-1">{label}</p>
                    <p className="text-xl font-bold" style={{ color }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* ── Right Content (scrollable) ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">

            {/* History panel */}
            <AnimatePresence>
              {showHistory && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <History size={14} className="text-teal-600" />
                      <span className="text-sm font-semibold text-slate-800">Study History</span>
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{history.length}</span>
                    </div>
                    <button onClick={() => setShowHistory(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  {history.length === 0
                    ? <p className="px-5 py-8 text-sm text-slate-400 text-center">No history yet. Generate your first plan.</p>
                    : <div className="divide-y divide-slate-50 max-h-56 overflow-y-auto">
                        {history.map(e => (
                          <div key={e.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                            <span className="text-base">{allSubjects[e.subject]?.emoji || '📚'}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-700">{e.subject} — {e.level}</p>
                              <p className="text-xs text-slate-400">{e.days} days · {e.hours}h/day · {e.createdAt}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                  }
                </motion.div>
              )}
            </AnimatePresence>

            {/* Charts */}
            {plan.length > 0 && (
              <div className="grid grid-cols-5 gap-5">
                {/* Donut */}
                <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={14} className="text-teal-600" />
                    <p className="text-sm font-semibold text-slate-800">Overall Progress</p>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{subject} · {level}</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" innerRadius={42} outerRadius={68} strokeWidth={0}>
                        <Cell fill={GREEN} />
                        <Cell fill="#e2e8f0" />
                      </Pie>
                      <Tooltip formatter={(v, n) => [v, n]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center -mt-1">
                    <p className="text-4xl font-bold" style={{ color: TEAL }}>{totalPct}%</p>
                    <p className="text-xs text-slate-400 mt-1">{totalDone} of {totalDone + totalLeft} topics</p>
                  </div>
                </div>

                {/* Bar */}
                <div className="col-span-3 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart2 size={14} className="text-teal-600" />
                    <p className="text-sm font-semibold text-slate-800">Day-by-Day Progress</p>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{plan.length} days planned</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={barData} barSize={Math.max(6, Math.min(28, 180 / barData.length))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip formatter={v => [`${v}%`, 'Progress']} cursor={{ fill: '#f8fafc' }} />
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={TEAL} />
                          <stop offset="100%" stopColor={CYAN} />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="progress" fill="url(#barGrad)" radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Day Cards */}
            {plan.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={14} className="text-teal-600" />
                  <h3 className="text-sm font-semibold text-slate-900">{plan.length}-Day Study Plan</h3>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{subject} · {level}</span>
                </div>
                <div className="space-y-2">
                  {plan.map((day, i) => (
                    <DayCard key={i} day={day} dayIndex={i} onToggle={toggleTopic} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {plan.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: 'linear-gradient(135deg, #0F766E15, #0891b215)' }}>
                  <BookOpen size={26} style={{ color: TEAL }} strokeWidth={1.5} />
                </div>
                <p className="text-base font-semibold text-slate-700 mb-2">No plan generated yet</p>
                <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                  Configure your subject, level, and schedule in the panel on the left, then click Generate Plan.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Custom Dialog */}
      {showCustom && <CustomDialog onClose={() => setShowCustom(false)} onCreate={handleCreateCustom} />}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium text-white"
            style={{ background: toast.type === 'error' ? RED : GREEN }}>
            <CheckCircle2 size={14} />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
