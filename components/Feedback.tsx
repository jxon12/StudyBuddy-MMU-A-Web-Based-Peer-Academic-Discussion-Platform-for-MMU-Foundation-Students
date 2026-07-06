import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Check,
  User, 
  Sparkles, 
  TrendingUp, 
  RefreshCw,
  History,
  Lock,
  Database,
  AlertTriangle,
  Server,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../src/services/supabaseClient';

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
    'Introduction to Business Management',
    'Introduction to Computing Technologies',
    'Communicative English',
    'Mathematics I',
    'Problem Solving and Program Design'
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

const playSpatialTap = (freq = 600, duration = 0.08) => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq / 2.1, ctx.currentTime + duration);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // ignore
  }
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
  const [dbErrorNotice, setDbErrorNotice] = useState<string | null>(null);
  const [isLiveSynced, setIsLiveSynced] = useState(false);

  const loadFromLocalStorage = () => {
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
  };

  const fetchFeedbackFromSupabase = async () => {
    try {
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('studybuddy_feedbacks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase table error, falling back to local:', error.message);
        // Table probably doesn't exist yet, we show a nice helper in the UI
        setDbErrorNotice(error.message);
        setIsLiveSynced(false);
        loadFromLocalStorage();
        return;
      }

      if (data) {
        const mappedData: FeedbackItem[] = data.map((item: any) => ({
          id: item.id?.toString() || 'FB' + Math.floor(1000 + Math.random() * 9000),
          name: item.name || 'Anonymous Buddy',
          studentId: item.student_id || '',
          category: item.category || 'General Suggestion',
          trimester: item.trimester || 'General/None',
          subject: item.subject || 'General Hub Discussion',
          rating: item.rating ?? 5,
          message: item.message || '',
          timestamp: item.created_at 
            ? new Date(item.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : 'Just Now'
        }));
        setHistory(mappedData);
        setIsLiveSynced(true);
        setDbErrorNotice(null);
        if (mappedData.length > 0 && mappedData[0].studentId) {
          setFormData(prev => ({
            ...prev,
            studentId: mappedData[0].studentId
          }));
        }
      }
    } catch (e: any) {
      console.error('Fetch exception:', e);
      setIsLiveSynced(false);
      loadFromLocalStorage();
    }
  };

  // Initialize student feedback history and prefill student ID on load
  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchFeedbackFromSupabase();
    } else {
      loadFromLocalStorage();
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
    // Pitch rises depending on high rating! Delightful touch.
    playSpatialTap(420 + rate * 70, 0.09);
    setFormData(prev => ({
      ...prev,
      rating: rate
    }));
  };

  const saveLocally = (newFeedback: FeedbackItem) => {
    const updatedHistory = [newFeedback, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('studybuddy_feedback_history', JSON.stringify(updatedHistory));
    setIsSubmitting(false);
    setSubmitted(true);
    playSpatialTap(800, 0.25);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim() || !formData.studentId.trim()) return;

    playSpatialTap(720, 0.15);
    setIsSubmitting(true);

    const newFeedbackLocal: FeedbackItem = {
      id: 'FB' + Math.floor(1000 + Math.random() * 9000),
      name: formData.name.trim() || 'Anonymous Buddy',
      studentId: formData.studentId.trim().toUpperCase(),
      category: formData.category,
      trimester: formData.trimester,
      subject: formData.subject || 'General Hub Discussion',
      rating: formData.rating,
      message: formData.message.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('studybuddy_feedbacks')
          .insert([
            {
              name: newFeedbackLocal.name,
              student_id: newFeedbackLocal.studentId,
              category: newFeedbackLocal.category,
              trimester: newFeedbackLocal.trimester,
              subject: newFeedbackLocal.subject,
              rating: newFeedbackLocal.rating,
              message: newFeedbackLocal.message
            }
          ]);

        if (error) {
          console.error('Supabase save failed:', error.message);
          setDbErrorNotice(error.message);
          // Save locally as safe fallback
          saveLocally(newFeedbackLocal);
        } else {
          // Success! Fetch the latest list
          await fetchFeedbackFromSupabase();
          setIsSubmitting(false);
          setSubmitted(true);
          playSpatialTap(800, 0.25);
        }
      } catch (err: any) {
        console.error('Supabase exception:', err);
        setDbErrorNotice(err.message || 'Unknown network error');
        saveLocally(newFeedbackLocal);
      }
    } else {
      // Direct local simulation timeout for beautiful responsive feedback
      setTimeout(() => {
        saveLocally(newFeedbackLocal);
      }, 850);
    }
  };


  const handleResetForm = () => {
    playSpatialTap(450, 0.1);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="pt-[180px] pb-32 px-4 max-w-6xl mx-auto w-full font-sans animate-fade-in-up"
    >
      {/* Header section with branding underline */}
      <div className="mb-12 pb-8 border-b border-white/10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative">
        <div className="space-y-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/5 border border-white/15 text-primary/85 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
              <MessageSquare className="w-3.5 h-3.5 text-apple-blue" />
              Co-Creation Box
            </div>

            {/* Supabase Integration State Bar */}
            {!isSupabaseConfigured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-500/10 border border-white/10 text-zinc-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                Local Persistence Mode
              </span>
            )}
          </div>
          
          <h1 className="text-[44px] md:text-[56px] font-black tracking-tight leading-none text-primary">
            Student Feedback
          </h1>
          
          <p className="text-[15px] opacity-60 max-w-xl">
            Help improve StudyBuddy. Share high-fidelity feature ideas, system bug reports, or questions directly with our founding academic board.
          </p>
        </div>

        <div className="h-0.5 w-[160px] bg-gradient-to-r from-apple-blue via-apple-indigo to-apple-purple rounded-full" />
      </div>

      {/* Supabase Error & Table Creation Helper */}
      {dbErrorNotice && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-[14px]">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              Supabase Table Configuration Needed
            </div>
            <p className="text-[12px] opacity-75 max-w-2xl leading-relaxed">
              We parsed your environment keys correctly, but Supabase returned: <code className="bg-black/30 px-1 py-0.5 rounded font-mono text-amber-300">{dbErrorNotice}</code>. 
              To fix this, please run the following query in your <strong>Supabase SQL Editor</strong> to construct the target database matching your schema:
            </p>
            <pre className="text-[11px] font-mono p-3 bg-black/40 rounded-xl mt-2 select-all overflow-x-auto text-primary/80 border border-white/5 max-h-32">
{`CREATE TABLE studybuddy_feedbacks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  student_id text NOT NULL,
  category text NOT NULL,
  trimester text,
  subject text,
  rating integer,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);`}
            </pre>
          </div>
          <button 
            onClick={() => {
              playSpatialTap(600, 0.1);
              fetchFeedbackFromSupabase();
            }}
            className="shrink-0 h-9 px-4 bg-white/10 hover:bg-white/15 text-primary border border-white/10 rounded-xl text-[11px] font-bold flex items-center gap-1.5 active:scale-95 transition-all text-center self-end md:self-center"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Table Check
          </button>
        </motion.div>
      )}

      {/* Supabase Config Setup Instructions Indicator */}
      {!isSupabaseConfigured && (
        <div className="mb-8 p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-4">
          <Database className="w-8 h-8 text-apple-blue shrink-0 animate-pulse" />
          <div className="space-y-1">
            <h4 className="text-[13px] font-extrabold text-primary">Want to persist this and sync to Supabase Cloud?</h4>
            <p className="text-[11.5px] opacity-60 leading-relaxed">
              Connect your online database instantly! Select the <strong>Secrets</strong> menu in AI Studio and add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>. StudyBuddy will automatically migrate live and read/write real-time cloud items.
            </p>
          </div>
        </div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* Left Side: Dynamic Context Card detailing changes */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-card flex flex-col gap-5 p-7 relative overflow-hidden group border border-white/10 shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-apple-blue/10 rounded-full blur-2xl group-hover:bg-apple-blue/20 transition-all pointer-events-none" />
            
            <h2 className="text-[19px] font-bold text-primary flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-apple-blue animate-pulse" />
              Community-Driven Updates
            </h2>
            <p className="text-[13.5px] opacity-60 leading-relaxed text-justify">
              StudyBuddy is an active peer-to-peer workspace run at MMU. We regularly address and implement student feedback to build a highly streamlined system. Here are the latest changes requested by our community:
            </p>

            <div className="space-y-4 mt-2">
              {[
                {
                  title: 'Precise Modular Syllabus Map',
                  desc: 'Mapped and categorized the structure of each computing course across all three trimesters.'
                },
                {
                  title: 'Streamlined Navigation Structure',
                  desc: 'Designed sleek Apple-like tabs for academics, leaderboards, and support lines.'
                },
                {
                  title: 'Reliable Profile Connection',
                  desc: 'Bound academic contributions to standard formats matching MMU student structures.'
                }
              ].map((update, i) => (
                <div key={i} className="flex gap-3 text-left items-start">
                  <div className="w-5 h-5 rounded-full bg-apple-blue/10 flex items-center justify-center shrink-0 mt-0.5 border border-apple-blue/20">
                    <Check className="w-3 h-3 text-apple-blue" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold text-primary leading-tight">{update.title}</h3>
                    <p className="text-[11.5px] opacity-50 mt-1 leading-normal">{update.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 border border-white/10 space-y-4 shadow-lg">
            <h3 className="text-[11px] font-bold tracking-widest text-primary flex items-center gap-2 uppercase opacity-45">
              <TrendingUp className="w-4 h-4 text-apple-mint animate-pulse" />
              Academic Hub Performance
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl shadow-sm">
                <div className="text-[22px] font-black text-apple-blue font-mono">24h</div>
                <div className="text-[10px] uppercase font-extrabold opacity-40 mt-1">Average Response SLA</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl shadow-sm">
                <div className="text-[22px] font-black text-apple-mint font-mono">98.4%</div>
                <div className="text-[10px] uppercase font-extrabold opacity-40 mt-1">Satisfaction Rate</div>
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
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="glass-card p-8 border border-white/10 shadow-xl"
              >
                <form id="student-feedback-form-element" onSubmit={handleSubmit} className="space-y-6">
                  {/* Name field (optional) */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider opacity-40">Your Student Name (Optional)</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-35 text-primary" />
                      <input 
                        type="text" 
                        placeholder="e.g. Tan Kenji"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        onFocus={() => playSpatialTap(450, 0.05)}
                        className="w-full h-12 bg-white/5 dark:bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl pl-10 pr-4 text-[13px] font-medium text-primary outline-none focus:border-white/20 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Student ID block */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider opacity-40">Your Student ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 252FC253ZL"
                      required
                      value={formData.studentId}
                      onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                      onFocus={() => playSpatialTap(480, 0.05)}
                      className="w-full h-12 bg-white/5 dark:bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl px-4 text-[13px] font-mono font-bold tracking-widest text-apple-blue outline-none focus:border-white/20 transition-all uppercase shadow-inner"
                    />
                    <span className="text-[10.5px] opacity-35 block leading-normal">
                      Connecting your student ID binds this feedback record safely to your contributor score.
                    </span>
                  </div>

                  {/* Classification grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider opacity-40">Classification</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => {
                          playSpatialTap(550, 0.08);
                          setFormData({...formData, category: e.target.value});
                        }}
                        className="w-full h-12 bg-white/5 dark:bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl px-3.5 text-[12px] font-bold text-primary outline-none focus:border-white/20 cursor-pointer shadow-sm appearance-none"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat} className="bg-neutral-950 text-white">{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider opacity-40">Trimester Context</label>
                      <select 
                        value={formData.trimester}
                        onChange={(e) => {
                          playSpatialTap(560, 0.08);
                          setFormData({...formData, trimester: e.target.value});
                        }}
                        className="w-full h-12 bg-white/5 dark:bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl px-3.5 text-[12px] font-bold text-primary outline-none focus:border-white/20 cursor-pointer shadow-sm appearance-none"
                      >
                        {Object.keys(TRIMESTERS_DATA).map(tri => (
                          <option key={tri} value={tri} className="bg-neutral-950 text-white">{tri}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Subject selector conditional */}
                  {formData.trimester !== 'General/None' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <label className="text-[11px] font-extrabold uppercase tracking-wider opacity-40">Related Academic Subject</label>
                      <select 
                        value={formData.subject}
                        onChange={(e) => {
                          playSpatialTap(580, 0.08);
                          setFormData({...formData, subject: e.target.value});
                        }}
                        className="w-full h-12 bg-white/5 dark:bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl px-3.5 text-[12px] font-bold text-primaryoutline-none focus:border-white/20 cursor-pointer shadow-sm appearance-none"
                      >
                        {(TRIMESTERS_DATA[formData.trimester] || []).map(sub => (
                          <option key={sub} value={sub} className="bg-neutral-950 text-white">{sub}</option>
                        ))}
                      </select>
                    </motion.div>
                  )}

                  {/* Core rating button scale */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider opacity-40">Your Experience Score</label>
                    <div className="grid grid-cols-5 gap-2 bg-white/5 border border-white/10 p-2 rounded-2xl shadow-inner">
                      {[1, 2, 3, 4, 5].map((index) => {
                        const emoji = index === 1 ? '😠' : index === 2 ? '🙁' : index === 3 ? '😐' : index === 4 ? '🙂' : '🤩';
                        const isSelected = formData.rating === index;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleRatingSelect(index)}
                            className={`h-11 rounded-xl flex items-center justify-center font-extrabold text-[13px] border transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-white/20 border-white/35 text-white shadow-xl scale-105' 
                                : 'bg-transparent border-transparent text-primary opacity-55 hover:opacity-100 hover:bg-white/5'
                            }`}
                          >
                            <span className="mr-1">{emoji}</span>
                            <span>{index}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider opacity-40">Describe your suggestion / feedback</label>
                    <textarea 
                      placeholder="Please write your detailed comments, bugs, feature requests or suggestions here..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      onFocus={() => playSpatialTap(450, 0.05)}
                      required
                      className="w-full bg-white/5 dark:bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-[13px] font-medium text-primary outline-none focus:border-white/20 font-sans leading-relaxed resize-none shadow-inner"
                    />
                    <div className="text-[10px] opacity-35 flex justify-between">
                      <span>Provide description of features or issues.</span>
                      <span>{formData.message.length} characters</span>
                    </div>
                  </div>

                  {/* Submit CTA button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.message.trim() || !formData.studentId.trim()}
                      className={`w-full h-12 rounded-2xl text-[13px] font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        formData.message.trim() && formData.studentId.trim() && !isSubmitting
                          ? 'bg-apple-blue hover:brightness-110 text-white shadow-lg active:scale-98'
                          : 'bg-white/5 text-primary opacity-30 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Submitting securely to founding board...
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
                className="glass-card p-10 border border-white/10 text-center space-y-6 relative overflow-hidden shadow-2xl"
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

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl max-w-sm mx-auto text-left space-y-2.5 text-[12px] shadow-lg">
                  <div className="flex justify-between border-b border-white/5 pb-1 opacity-60">
                    <span>Contributor ID</span>
                    <span className="font-mono font-bold text-apple-blue">{formData.studentId.toUpperCase()}</span>
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
                  <div className="pt-2 select-all break-words italic line-clamp-3 opacity-85 bg-black/15 p-3 rounded-lg border border-white/5 text-[12px] leading-relaxed">
                    "{formData.message}"
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleResetForm}
                    className="h-11 px-6 font-bold text-[13px] border border-white/15 bg-white/5 hover:bg-white/10 text-primary rounded-2xl transition-all cursor-pointer shadow-md"
                  >
                    Submit Another Feedback
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Historical logs display */}
      <div className="glass-card !p-0 border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 dark:bg-black/30 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-apple-blue shrink-0" />
            <h3 className="text-[16px] font-extrabold text-primary">
              {isLiveSynced ? 'Community Sandbox Feedbacks' : 'Your Co-Creation Submissions'} ({history.length})
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] opacity-40 font-mono font-bold uppercase tracking-wider">
            {isLiveSynced ? (
              <>
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                Live Cloud Synced to Supabase
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Locally Saved to Browser Storage
              </>
            )}
          </div>
        </div>

        {history.length > 0 ? (
          <div className="divide-y divide-white/5">
            {history.map((item) => (
              <div key={item.id} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-extrabold px-2 py-0.5 bg-apple-blue/15 border border-apple-blue/20 text-apple-blue rounded">{item.category}</span>
                    {item.trimester !== 'General/None' && (
                      <span className="text-[11px] opacity-60 font-medium">{item.trimester} • {item.subject}</span>
                    )}
                    <span className="text-[11px] font-bold font-mono opacity-40">Contributor: {item.studentId}</span>
                  </div>
                  <p className="text-[13px] text-primary/80 line-clamp-3 leading-relaxed">
                    "{item.message}"
                  </p>
                </div>
                
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between shrink-0 gap-2">
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 h-7 px-2.5 rounded-lg text-[11px] font-bold">
                    <span>Experience Score:</span>
                    <span className="font-black text-apple-cyan">{item.rating}/5</span>
                  </div>
                  <div className="text-[10.5px] opacity-35 font-mono">{item.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-primary/40 space-y-2">
            <div className="w-12 h-12 rounded-full border border-dashed border-white/10 flex items-center justify-center mx-auto mb-2 select-none opacity-40">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div className="text-[14px] font-bold">No Submissions Recorded Yet</div>
            <p className="text-[11.5px] text-primary/30 max-w-xs mx-auto leading-normal">
              Contribute a feature idea or bug report using the workspace form above to initialize files.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
