import { useState, useEffect } from 'react';
import { getExams, createExam } from '../services/examService';
import { 
  Rocket, 
  Plus, 
  Calendar, 
  Target, 
  AlertCircle, 
  Loader2, 
  ChevronRight, 
  X,
  Trophy,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newExam, setNewExam] = useState({
    examName: '',
    date: '',
    targetScore: ''
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const data = await getExams();
      setExams(data.exams);
    } catch (err) {
      setError('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await createExam(newExam);
      setNewExam({ examName: '', date: '', targetScore: '' });
      setShowForm(false);
      fetchExams();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create exam');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-terracotta-500" size={40} />
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Accessing Milestones...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-20 mt-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-100 italic tracking-tight leading-none">
            Strategic <span className="text-terracotta-500 not-italic">Milestones</span>
          </h2>
          <p className="text-xl text-slate-400 mt-4 font-medium max-w-lg">
            Define your objectives. The engine will bridge the gap.
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'secondary' : 'primary'}
          className="gap-3"
        >
          {showForm ? <><X size={20} /> Cancel</> : <><Plus size={20} /> New Milestone</>}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card padding="p-10" className="border-terracotta-500/20 bg-terracotta-500/[0.02]">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                <Input
                  label="Mission Name"
                  placeholder="e.g. GRE Quantitative"
                  value={newExam.examName}
                  onChange={(e) => setNewExam({...newExam, examName: e.target.value})}
                  required
                />
                <Input
                  label="Target Date"
                  type="date"
                  value={newExam.date}
                  onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                  required
                  className="[color-scheme:dark]"
                />
                <div className="flex gap-4">
                  <Input
                    label="Target Score %"
                    type="number"
                    placeholder="95"
                    value={newExam.targetScore}
                    onChange={(e) => setNewExam({...newExam, targetScore: e.target.value})}
                    required
                  />
                  <Button type="submit" isLoading={isSubmitting} className="h-[60px] px-10">
                    <Rocket size={20} />
                  </Button>
                </div>
              </form>
              {error && <p className="mt-4 text-red-500 text-sm font-bold flex items-center gap-2"><AlertCircle size={16}/> {error}</p>}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {exams.length === 0 ? (
        <Card className="py-32 text-center flex flex-col items-center">
          <Trophy size={64} className="text-slate-800 mb-8" />
          <h3 className="text-3xl font-black text-slate-100 mb-4 italic">No Objectives Found</h3>
          <p className="text-slate-500 font-medium max-w-sm mb-10 italic">
            "A goal without a plan is just a wish."
          </p>
          <Button onClick={() => setShowForm(true)} variant="outline">Initialize First Mission</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {exams.map((exam) => (
            <Card key={exam._id} className="group relative overflow-hidden">
              <div className="flex justify-between items-start mb-10">
                <div className="p-4 rounded-2xl bg-slate-800 text-terracotta-500 group-hover:bg-terracotta-500 group-hover:text-white transition-all">
                  <Target size={28} />
                </div>
                <Badge variant="success">Active Mission</Badge>
              </div>
              
              <h4 className="text-3xl font-black text-slate-100 mb-4 tracking-tight group-hover:text-terracotta-500 transition-colors uppercase">
                {exam.examName}
              </h4>
              
              <div className="space-y-4 mt-8 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} /> Schedule
                  </span>
                  <span className="text-sm font-black text-slate-100">{new Date(exam.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <ArrowUpRight size={14} /> Objective
                  </span>
                  <span className="text-2xl font-black text-terracotta-500">{exam.targetScore}%</span>
                </div>
              </div>
              
              <div className="mt-10">
                <Button variant="secondary" className="w-full gap-2 justify-between">
                  View Analytics <ChevronRight size={18} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Exams;
