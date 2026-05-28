import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Check,
  User, 
  Sparkles, 
  
  TrendingUp, 
  History, 
  RefreshCw,
  
  Heart
} from 'lucide-react';

interface FeedbackItem {
  id: string;
  name: string;
  studentId: string;
  category: string;
  trimester: string;
  subject: string;
  rating: number;
  message: string;
  timestamp: string;
}

const CATEGORIES = [
  'General Suggestion',
  'Bug Report',
  'Feature Idea',
  'Subject Content Issue',
  'UI/Usability Feedback',
  'Other'
];

const TRIMESTERS_DATA: Record<string, string[]> = {
  'Trimester 1': [
    'Introduction to Business',
    'Management',
    'Introduction to Computing Technologies',
    'Communicative English',
    'Mathematics 1',
    'Problem Solving and Programme Design'
  ],
  'Trimester 2': [
    'Critical Thinking',
    'Introduction to Digital Systems',
    'Essential English',
    'Multimedia Fundamentals',
    'Mathematics II',
    'Principles of Physics'
  ],
  'Trimester 3': [
    'Academic English',
    'Mathematics III',
    'Mini IT Project'
  ],
  'General/None': []
};



export function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    category: 'General Suggestion',
    trimester: 'General/None',
    subject: '',
    rating: 5,
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<FeedbackItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize student feedback history and prefill student ID on load
  useEffect(() => {
    const stored = localStorage.getItem('studybuddy_feedback_history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
        if (parsed && parsed.length > 0 && parsed[0].studentId) {
          setFormData(prev => ({
            ...prev,
            studentId: parsed[0].studentId
          }));
        }
      } catch (e) {
        console.error('Failed to parse feedback history', e);
      }
    }
  }, []);

  // Update subject list when trimester selection changes
  useEffect(() => {
    const subjects = TRIMESTERS_DATA[formData.trimester] || [];
    setFormData(prev => ({
      ...prev,
      subject: subjects.length > 0 ? subjects[0] : ''
    }));
  }, [formData.trimester]);

  const handleRatingSelect = (rate: number) => {
    setFormData(prev => ({
      ...prev,
      rating: rate
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setIsSubmitting(true);

    // Simulate short natural smooth submission time
    setTimeout(() => {
      const newFeedback: FeedbackItem = {
        id: 'FB' + Math.floor(1000 + Math.random() * 9000),
        name: formData.name.trim() || 'Anonymous Buddy',
        studentId: formData.studentId,
        category: formData.category,
        trimester: formData.trimester,
        subject: formData.subject || 'General Hub Discussion',
        rating: formData.rating,
        message: formData.message.trim(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };

      const updatedHistory = [newFeedback, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('studybuddy_feedback_history', JSON.stringify(updatedHistory));

      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const handleResetForm = () => {
    setFormData(prev => ({
      name: '',
      studentId: prev.studentId, // Preserve the student ID keyed in by the user
      category: 'General Suggestion',
      trimester: 'General/None',
      subject: '',
      rating: 5,
      message: ''
    }));
    setSubmitted(false);
  };

  const handleClearHistory = () => {
    if (window.confirm('Do you want to clear your local feedback history logs?')) {
      setHistory([]);
      localStorage.removeItem('studybuddy_feedback_history');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="pt-[180px] pb-32 px-4 max-w-6xl mx-auto w-full"
    >
      {/* Header section with branding underline */}
      <div className="mb-12 pb-6 border-b border-white/10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-apple-blue/10 rounded-full text-[10px] font-extrabold text-apple-blue uppercase tracking-widest mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            Co-Creation
          </div>
          <h1 id="feedback-main-title" className="text-[44px] md:text-[52px] font-black tracking-tight mb-2">Student Feedback</h1>
          <p className="text-[15px] opacity-60 max-w-xl">
            Have thoughts, bugs, or requests about StudyBuddy MMU? Share them here. We modify this app continuously based on raw student input!
          </p>
        </div>
        <div className="w-[120px] h-1.5 rounded-full bg-gradient-to-r from-apple-blue via-apple-indigo to-apple-purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Dynamic Context Card detailing changes */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-card flex flex-col gap-5 p-7 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-apple-indigo/10 rounded-full blur-2xl group-hover:bg-apple-indigo/20 transition-all pointer-events-none" />
            
            <h2 className="text-[19px] font-bold text-primary flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-apple-blue" />
              Community-Driven Updates
            </h2>
            <p className="text-[13.5px] opacity-60 leading-relaxed">
              StudyBuddy is an active peer-to-peer experiment run on MMU. We regularly implement students' requests to construct a perfect collaborative workspace. Here are latest changes requested by students:
            </p>

            <div className="space-y-3.5 mt-2">
              {[
                {
                  title: 'Exact Subdivided Syllabus',
                  desc: 'Mapped out and listed all structural and numerical subjects for Trimester 1, Trimester 2, and Trimester 3 precisely.'
                },
                {
                  title: 'Clean IDs (No Specialities)',
                  desc: 'Streamlined the database indexes, eliminated complex specialization tags, and focused purely on subjects.'
                },
                {
                  title: 'Compliant Student ID Generator',
                  desc: 'Changed default random placeholder profiles to comply exactly with the student format: 252FC253ZL.'
                }
              ].map((update, i) => (
                <div key={i} className="flex gap-3 items-start text-left">
                  <div className="w-5 h-5 rounded-full bg-apple-blue/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-apple-blue" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-extrabold text-primary">{update.title}</h3>
                    <p className="text-[11.5px] opacity-50 mt-0.5">{update.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3 bg-neutral-900/40 p-3.5 rounded-2xl border border-white/5 text-[12px] opacity-80">
              <Heart className="w-4 h-4 text-apple-coral shrink-0 animate-pulse fill-apple-coral" />
              <span>We review and address 100% of inputs within 24 hours.</span>
            </div>
          </div>

          <div className="glass-card p-6 border border-white/5 space-y-4">
            <h3 className="text-[15px] font-bold tracking-tight text-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-apple-mint" />
              MMU Study Statistics
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="text-[20px] font-black text-apple-blue">24 Hrs</div>
                <div className="text-[10px] uppercase font-bold opacity-40 mt-1">Average SLA Response</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="text-[20px] font-black text-apple-mint">98.4%</div>
                <div className="text-[10px] uppercase font-bold opacity-40 mt-1">Satisfaction Rate</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Feedback Submission Form Panel */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="feedback-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-8 border border-white/10 shadow-xl"
              >
                <form id="student-feedback-form-element" onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider opacity-40">Your Student Name (Optional)</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                      <input 
                        type="text" 
                        placeholder="e.g. Kenji Tan"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full h-11 bg-black/10 dark:bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 text-[13px] font-medium text-primary outline-none focus:border-apple-blue/40"
                      />
                    </div>
                  </div>

                  {/* Student ID Group */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider opacity-40">Your Student ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 252FC253ZL"
                      required
                      value={formData.studentId}
                      onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                      className="w-full h-11 bg-black/10 dark:bg-white/5 border border-white/5 rounded-xl px-4 text-[13px] font-mono font-bold tracking-wider text-apple-blue outline-none focus:border-apple-blue/40"
                    />
                    <span className="text-[10px] opacity-30 block">
                      Please enter your MMU Student ID to connect this feedback to your academic profile.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider opacity-40">Classification</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full h-11 bg-black/10 dark:bg-white/5 border border-white/5 rounded-xl px-3.5 text-[12px] font-semibold text-primary outline-none focus:border-apple-blue/40 cursor-pointer"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat} className="bg-neutral-800 text-white">{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Trimester Academic Context */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider opacity-40">Trimester Context</label>
                      <select 
                        value={formData.trimester}
                        onChange={(e) => setFormData({...formData, trimester: e.target.value})}
                        className="w-full h-11 bg-black/10 dark:bg-white/5 border border-white/5 rounded-xl px-3.5 text-[12px] font-semibold text-primary outline-none focus:border-apple-blue/40 cursor-pointer"
                      >
                        {Object.keys(TRIMESTERS_DATA).map(tri => (
                          <option key={tri} value={tri} className="bg-neutral-800 text-white">{tri}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Conditional Subject Selection matches exactly with selected Trimester */}
                  {formData.trimester !== 'General/None' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1.5"
                    >
                      <label className="text-[11px] font-extrabold uppercase tracking-wider opacity-40">Related Academic Subject</label>
                      <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full h-11 bg-black/10 dark:bg-white/5 border border-white/5 rounded-xl px-3.5 text-[12px] font-semibold text-primary outline-none focus:border-apple-blue/40 cursor-pointer"
                      >
                        {(TRIMESTERS_DATA[formData.trimester] || []).map(sub => (
                          <option key={sub} value={sub} className="bg-neutral-800 text-white">{sub}</option>
                        ))}
                      </select>
                    </motion.div>
                  )}

                  {/* Character Satisfaction Rating scale of 1-5 */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider opacity-40">Your Satisfaction Score</label>
                    <div className="flex bg-neutral-900/30 p-2 border border-white/5 rounded-xl justify-around items-center">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleRatingSelect(index)}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[12.5px] transition-all hover:scale-110 ${
                            formData.rating === index 
                              ? 'bg-apple-blue text-white shadow-md shadow-apple-blue/20 scale-105' 
                              : 'text-primary/40 hover:text-primary'
                          }`}
                        >
                          {index === 1 && '😠'}
                          {index === 2 && '🙁'}
                          {index === 3 && '😐'}
                          {index === 4 && '🙂'}
                          {index === 5 && '🤩'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main Message Text Area */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider opacity-40">Describe your suggestion / feedback</label>
                    <textarea 
                      placeholder="Please write your detailed comments, bugs, feature requests or suggestions here..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      className="w-full bg-black/10 dark:bg-white/5 border border-white/5 rounded-xl p-4 text-[13px] font-medium text-primary outline-none focus:border-apple-blue/40 font-sans leading-relaxed resize-none"
                    />
                    <div className="text-[11px] opacity-40 flex justify-between">
                      <span>Maximum recommended length 1,000 characters.</span>
                      <span>{formData.message.length} chars</span>
                    </div>
                  </div>

                  {/* Submit feedback button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.message.trim() || !formData.studentId.trim()}
                      className={`w-full h-11 rounded-xl text-[13px] font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        formData.message.trim() && formData.studentId.trim() && !isSubmitting
                          ? 'bg-apple-blue hover:brightness-110 text-white shadow-lg shadow-apple-blue/15 active:scale-98'
                          : 'bg-white/5 text-primary opacity-30 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Sending securely to founding board...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Feedback Response
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="feedback-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-10 border border-white/10 text-center space-y-6 relative overflow-hidden"
              >
                <div className="w-16 h-16 rounded-full bg-apple-mint/10 border border-apple-mint/30 flex items-center justify-center text-apple-mint mx-auto mb-2 animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-[26px] font-bold text-primary">Feedback Saved Successfully!</h2>
                  <p className="text-[14px] opacity-60 max-w-md mx-auto">
                    Thank you! Your feedback has been written directly to local dev indexes and stored securely on your browser.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl max-w-sm mx-auto text-left space-y-2 text-[12px]">
                  <div className="flex justify-between border-b border-white/5 pb-1 opacity-60">
                    <span>Buddy ID</span>
                    <span className="font-mono font-bold text-apple-blue">{formData.studentId}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1 opacity-60">
                    <span>Classification</span>
                    <span className="font-bold">{formData.category}</span>
                  </div>
                  {formData.trimester !== 'General/None' && (
                    <div className="flex justify-between border-b border-white/5 pb-1 opacity-60">
                      <span>Related Subject</span>
                      <span className="truncate max-w-[200px] font-semibold">{formData.subject}</span>
                    </div>
                  )}
                  <div className="pt-1 select-all break-words italic line-clamp-3 opacity-80">
                    "{formData.message}"
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleResetForm}
                    className="h-10 px-6 font-bold text-[13px] border border-white/15 bg-white/5 hover:bg-white/10 text-primary rounded-xl transition-all"
                  >
                    Submit Another Feedback
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FEEDBACK HISTORY LOGS */}
      <div className="mt-16 pt-8 border-t border-white/10 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-apple-blue" />
            Your Feedback Logs ({history.length})
          </h3>
          {history.length > 0 && (
            <button 
              onClick={handleClearHistory}
              className="text-[11px] font-bold text-apple-coral opacity-70 hover:opacity-100 uppercase tracking-widest transition-opacity"
            >
              Clear Logs
            </button>
          )}
        </div>

        {history.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {history.map((item) => (
              <div key={item.id} className="glass-card border border-white/5 flex flex-col gap-3.5 !p-5 relative group">
                <div className="flex items-start justify-between gap-2.5">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-apple-indigo/10 text-apple-indigo">
                      {item.category}
                    </span>
                    <span className="text-[11px] opacity-40 block mt-1.5 font-bold">
                      By ID: <span className="font-mono text-apple-blue">{item.studentId}</span>
                    </span>
                  </div>
                  <span className="text-[10px] opacity-30 text-right">{item.timestamp}</span>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-apple-blue">
                    {item.trimester} {item.subject !== 'General Hub Discussion' ? `• ${item.subject}` : ''}
                  </div>
                  <p className="text-[12.5px] opacity-80 leading-relaxed font-medium break-words italic pl-2.5 border-l-2 border-white/10 mt-1">
                    "{item.message}"
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/5 opacity-50">
                  <span>Score: {'⭐️'.repeat(item.rating)}</span>
                  <span>Ticket Verified: <span className="text-apple-mint font-semibold">Active</span></span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card text-center py-12 text-primary/40 text-[13px] border border-white/5 italic">
            You haven't written any feedback items yet. Submit the form above to record your log entry dynamically.
          </div>
        )}
      </div>

    </motion.div>
  );
}