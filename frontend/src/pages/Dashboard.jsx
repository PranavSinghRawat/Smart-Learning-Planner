import { useState, useEffect } from 'react';
import { getExams } from '../services/examService';
import { getSubjects } from '../services/subjectService';
import { 
  Rocket, 
  Target, 
  Zap, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Trophy,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ReadinessDial from '../components/ReadinessDial';

const Dashboard = () => {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsData, subjectsData] = await Promise.all([
          getExams(),
          getSubjects()
        ]);
        setExams(examsData.exams);
        setSubjects(subjectsData.subjects);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-terracotta-500/20 border-t-terracotta-500 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Calibrating workspace...</p>
      </div>
    );
  }

  const weakSubjects = subjects.filter(s => s.isWeak);
  const readinessValue = exams.length > 0 ? Math.min(85, 40 + (subjects.length * 5)) : 0; // Mock logic for design

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-20 mt-4"
    >
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div variants={itemVariants}>
          <h2 className="text-5xl font-black text-slate-100 tracking-tight leading-none italic">
            Cognitive <span className="text-terracotta-500 not-italic">Control</span>
          </h2>
          <p className="text-xl text-slate-400 mt-4 font-medium max-w-lg">
            Focus is a precious resource. We've optimized your path to mastery.
          </p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex gap-4">
          <Card padding="px-6 py-3" hover={false} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Engine Online</span>
          </Card>
        </motion.div>
      </section>

      {/* Main Asymmetric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Readiness Dial Card - Span 2 */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full flex flex-col items-center justify-center py-16 group">
            <ReadinessDial score={readinessValue} />
            <div className="mt-12 text-center px-8">
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Based on <span className="text-slate-100 font-bold">{subjects.length} active modules</span> and 
                <span className="text-slate-100 font-bold"> {weakSubjects.length} focus areas</span>.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Badge variant="primary">Updated Just Now</Badge>
                <Badge variant="success">Improving +12%</Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Focus Track - Span 3 */}
        <motion.div variants={itemVariants} className="lg:col-span-3 space-y-8">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-terracotta-500/10 text-terracotta-500 rounded-2xl">
                  <Zap size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-100 italic tracking-tight">Today's <span className="text-terracotta-500 not-italic">Focus Track</span></h3>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">All Tasks <ChevronRight size={16}/></Button>
            </div>

            <div className="space-y-4">
              {subjects.slice(0, 3).map((sub, idx) => (
                <motion.div 
                  key={sub._id}
                  whileHover={{ x: 8 }}
                  className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-terracotta-500/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-2xl font-black text-slate-700 group-hover:text-terracotta-500/20 transition-colors">0{idx + 1}</span>
                    <div>
                      <h4 className="font-bold text-slate-100 text-lg">{sub.subjectName}</h4>
                      <p className="text-sm text-slate-500 font-medium">Deep Work • 90 mins</p>
                    </div>
                  </div>
                  <Badge variant={sub.difficulty === 'hard' ? 'danger' : 'primary'}>{sub.difficulty}</Badge>
                </motion.div>
              ))}
              {subjects.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-slate-500 font-bold italic">Inject data to generate your track</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Mastery Heatmap Placeholder */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <h4 className="text-lg font-black text-slate-100 mb-8 flex items-center gap-3 italic">
              <Activity size={20} className="text-sage-500 not-italic" /> Mastery <span className="not-italic">Heatmap</span>
            </h4>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(28)].map((_, i) => (
                <div 
                  key={i} 
                  className={`aspect-square rounded-md transition-all duration-500 hover:scale-110 ${
                    i % 3 === 0 ? 'bg-sage-500/40 shadow-sm shadow-sage-500/20' : 
                    i % 5 === 0 ? 'bg-terracotta-500/30' : 
                    'bg-slate-800'
                  }`}
                />
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">28 Day Consistency</span>
              <span className="text-xs font-bold text-sage-500 flex items-center gap-1"><ArrowUpRight size={14} /> +40% Growth</span>
            </div>
          </Card>
        </motion.div>

        {/* Milestone Card */}
        <motion.div variants={itemVariants}>
          <Card className="h-full bg-terracotta-500/5 border-terracotta-500/10 hover:border-terracotta-500/30">
            <Trophy size={32} className="text-terracotta-500 mb-6" />
            <h4 className="text-xl font-black text-slate-100 mb-2 italic">Next <span className="not-italic">Milestone</span></h4>
            <p className="text-3xl font-black text-terracotta-500 leading-tight">
              {exams[0]?.examName || 'No Exams'}
            </p>
            <div className="mt-8 pt-8 border-t border-terracotta-500/10">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Target Score</p>
              <p className="text-xl font-black text-slate-100">{exams[0]?.targetScore || '0'}%</p>
            </div>
          </Card>
        </motion.div>

        {/* Quick Action / Session Timer */}
        <motion.div variants={itemVariants}>
          <Card className="h-full flex flex-col justify-between group overflow-hidden relative">
            <div className="relative z-10">
              <Clock size={32} className="text-slate-500 mb-6 group-hover:text-terracotta-500 transition-colors" />
              <h4 className="text-xl font-black text-slate-100 mb-4 italic">Session <span className="not-italic">Timer</span></h4>
              <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">
                Start a timed deep-work session to feed the AI engine.
              </p>
            </div>
            <Button variant="primary" className="w-full gap-3 relative z-10">
              Initialize <Rocket size={20} />
            </Button>
            {/* Abstract Background Element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-terracotta-500/5 rounded-full blur-3xl group-hover:bg-terracotta-500/10 transition-all duration-700" />
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
