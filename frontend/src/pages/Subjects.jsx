import { useState, useEffect } from 'react';
import { getSubjects, createSubject } from '../services/subjectService';
import { getExams } from '../services/examService';
import { 
  BookOpen, 
  GraduationCap, 
  Plus, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  X,
  Hash,
  Shapes,
  FlaskConical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newSubject, setNewSubject] = useState({
    subjectName: '',
    examId: '',
    difficulty: 'medium',
    isWeak: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjectsData, examsData] = await Promise.all([
        getSubjects(),
        getExams()
      ]);
      setSubjects(subjectsData.subjects);
      setExams(examsData.exams);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newSubject.examId) return setError('Please select an exam');
    
    setError('');
    setIsSubmitting(true);
    try {
      await createSubject(newSubject);
      setNewSubject({ subjectName: '', examId: '', difficulty: 'medium', isWeak: false });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-terracotta-500" size={40} />
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Organizing Knowledge...</p>
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
            Curriculum <span className="text-terracotta-500 not-italic">Engines</span>
          </h2>
          <p className="text-xl text-slate-400 mt-4 font-medium max-w-lg">
            Decompose complexity into solvable modules.
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'secondary' : 'primary'}
          className="gap-3"
        >
          {showForm ? <><X size={20} /> Cancel</> : <><Plus size={20} /> Add Module</>}
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
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-end">
                <Input
                  label="Module Name"
                  placeholder="e.g. Thermodynamics"
                  value={newSubject.subjectName}
                  onChange={(e) => setNewSubject({...newSubject, subjectName: e.target.value})}
                  required
                />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 block">Milestone</label>
                  <select
                    required
                    value={newSubject.examId}
                    onChange={(e) => setNewSubject({...newSubject, examId: e.target.value})}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 px-6 text-slate-100 focus:border-terracotta-500/50 transition-all font-medium [color-scheme:dark] appearance-none"
                  >
                    <option value="">Select Milestone</option>
                    {exams.map(exam => (
                      <option key={exam._id} value={exam._id}>{exam.examName}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 block">Complexity</label>
                  <select
                    value={newSubject.difficulty}
                    onChange={(e) => setNewSubject({...newSubject, difficulty: e.target.value})}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 px-6 text-slate-100 focus:border-terracotta-500/50 transition-all font-medium [color-scheme:dark] appearance-none"
                  >
                    <option value="easy">Elementary</option>
                    <option value="medium">Intermediate</option>
                    <option value="hard">Expert</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-3 bg-slate-800/50 border border-white/10 rounded-2xl px-6 h-[60px] flex-1">
                    <input
                      type="checkbox"
                      id="isWeak"
                      checked={newSubject.isWeak}
                      onChange={(e) => setNewSubject({...newSubject, isWeak: e.target.checked})}
                      className="w-5 h-5 rounded border-white/10 text-terracotta-500 focus:ring-terracotta-500 bg-slate-900 cursor-pointer"
                    />
                    <label htmlFor="isWeak" className="text-sm font-bold text-slate-500 cursor-pointer select-none">Weak Spot?</label>
                  </div>
                  <Button type="submit" isLoading={isSubmitting} className="h-[60px] px-8">Save</Button>
                </div>
              </form>
              {error && <p className="mt-4 text-red-500 text-sm font-bold flex items-center gap-2"><AlertCircle size={16}/> {error}</p>}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {subjects.length === 0 ? (
        <Card className="py-32 text-center flex flex-col items-center">
          <BookOpen size={64} className="text-slate-800 mb-8" />
          <h3 className="text-3xl font-black text-slate-100 mb-4 italic">No Modules Defined</h3>
          <p className="text-slate-500 font-medium max-w-sm mb-10 italic">
            "Knowledge is an island in the ocean of non-knowledge."
          </p>
          <Button onClick={() => setShowForm(true)} variant="outline">Record First Module</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {subjects.map((subject) => (
            <Card key={subject._id} className="group overflow-hidden">
              <div className="flex justify-between items-start mb-10">
                <div className="p-4 rounded-2xl bg-slate-800 text-sage-500 group-hover:bg-sage-500 group-hover:text-white transition-all">
                  <FlaskConical size={24} />
                </div>
                {subject.isWeak && <Badge variant="danger">High Focus Required</Badge>}
              </div>

              <h4 className="text-2xl font-black text-slate-100 mb-2 truncate uppercase italic">{subject.subjectName}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-2 font-black tracking-widest uppercase mb-10">
                <GraduationCap size={14} className="text-terracotta-500" /> {subject.examId?.examName}
              </p>

              <div className="flex items-center justify-between pt-8 border-t border-white/5">
                <Badge variant={subject.difficulty === 'hard' ? 'danger' : 'primary'}>
                  {subject.difficulty} LEVEL
                </Badge>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-3 h-1.5 rounded-full ${
                        (subject.difficulty === 'easy' && i === 0) ? 'bg-sage-500' :
                        (subject.difficulty === 'medium' && i <= 1) ? 'bg-terracotta-500' :
                        (subject.difficulty === 'hard' && i <= 2) ? 'bg-red-500' :
                        'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Subjects;
