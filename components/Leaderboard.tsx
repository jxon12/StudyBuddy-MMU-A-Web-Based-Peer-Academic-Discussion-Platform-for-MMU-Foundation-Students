import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Award, 
  Star, 
  Flame, 
  ThumbsUp, 
  Search, 
  UserCheck, 
  X, 
  BookOpen
} from 'lucide-react';

// Type definitions matching MMU Student profile attributes
export interface Student {
  rank: number;
  id: string; // Randomized according to format 252FC253ZL (3 digits, 2 letters, 3 digits, 2 letters)
  name: string;
  avatar: string;
  avatarBg: string;
  points: number;
  streak: number;
  questionsSolved: number;
  upvotes: number;
  subject: string; // The specific academic subject they are leading in
  badges: Array<{ name: string; icon: string; color: string; desc: string }>;
  recentContribution: string;
  isCurrentUser?: boolean;
}

// Interactive challenges matched with the exact requested Trimester subjects
const STUDY_CHALLENGES = [
  {
    id: 'quiz-1',
    subject: 'Mathematics 1',
    question: 'What is the limit of (sin x) / x as x approaches 0?',
    options: ['0', '1', 'Infinity', 'Undefined'],
    correctIndex: 1,
    explanation: 'By L’Hôpital’s rule or fundamental trigonometric limits, the limit as x approaches 0 of sin(x)/x is 1.',
  },
  {
    id: 'quiz-2',
    subject: 'Problem Solving and Programme Design',
    question: 'In Object-Oriented Programming, what mechanism allows a class to inherit state and behavior from another class?',
    options: ['Polymorphism', 'Encapsulation', 'Inheritance', 'Abstraction'],
    correctIndex: 2,
    explanation: 'Inheritance is a key concept of OOP that represents an "IS-A" relationship and lets a class inherit code from a parent class.',
  },
  {
    id: 'quiz-3',
    subject: 'Introduction to Computing Technologies',
    question: 'Which of the following data structures operates on a FIFO (First-In, First-Out) principle?',
    options: ['Stack', 'Queue', 'Binary Tree', 'Max Heap'],
    correctIndex: 1,
    explanation: 'A Queue adds items to the back and removes from the front, representing a First-In-First-Out behavior.',
  },
  {
    id: 'quiz-4',
    subject: 'Multimedia Fundamentals',
    question: 'Inside which HTML element do we put JavaScript reference?',
    options: ['<scripting>', '<js>', '<javascript>', '<script>'],
    correctIndex: 3,
    explanation: 'The standard HTML tag to declare or link interactive JavaScript is <script>.',
  },
  {
    id: 'quiz-5',
    subject: 'Mathematics II',
    question: 'What is the average time complexity of searching a value in an unsorted array of size N?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
  }
];

// Seed initial student data matching randomized ID format [3 digits][2 letters][3 digits][2 letters] and requested subjects
const INITIAL_STUDENTS: Student[] = [
  {
    rank: 1,
    id: '821AX345KW',
    name: 'Siddharth Nair',
    avatar: 'SN',
    avatarBg: 'from-orange-500 to-amber-700',
    points: 2950,
    streak: 18,
    questionsSolved: 47,
    upvotes: 189,
    subject: 'Problem Solving and Programme Design',
    badges: [
      { name: 'Algorithmic Virtuoso', icon: '⚡', color: 'orange', desc: 'Solved over 40+ advanced programming and algorithm structures.' },
      { name: 'Elite Mentor', icon: '🎓', color: 'blue', desc: 'Received more than 100 upvotes answering design problems.' },
      { name: 'Daily Dev', icon: '🔥', color: 'red', desc: 'Maintained a 15+ day study streak.' }
    ],
    recentContribution: 'Explained Red-Black Tree self-balancing rotation in Problem Solving and Programme Design.'
  },
  {
    rank: 2,
    id: '502ND847YJ',
    name: 'Sarah Lim Jin',
    avatar: 'SL',
    avatarBg: 'from-pink-500 to-rose-600',
    points: 2710,
    streak: 12,
    questionsSolved: 39,
    upvotes: 142,
    subject: 'Mathematics II',
    badges: [
      { name: 'Calculus Champion', icon: '📐', color: 'pink', desc: 'Aced all Mathematics II chapter discussions.' },
      { name: 'First Responder', icon: '⚡', color: 'purple', desc: 'Replied to unanswered math queries in under 5 mins.' }
    ],
    recentContribution: 'Provided a step-by-step optimization solution for Lagrange Multipliers in Mathematics II.'
  },
  {
    rank: 3,
    id: '409LT551PK',
    name: 'Amirul Azeem',
    avatar: 'AA',
    avatarBg: 'from-blue-500 to-indigo-600',
    points: 2540,
    streak: 9,
    questionsSolved: 31,
    upvotes: 110,
    subject: 'Introduction to Computing Technologies',
    badges: [
      { name: 'Web Architect', icon: '🌐', color: 'cyan', desc: 'Shared multiple responsive web layout templates.' },
      { name: 'Star contributor', icon: '⭐', color: 'yellow', desc: 'Top ranked in Introductory Computer Systems.' }
    ],
    recentContribution: 'Created an offline-first storage guide using Service Workers for Intro to Computing Technologies.'
  },
  {
    rank: 4,
    id: '252FC253ZL',
    name: 'Sophia Chang',
    avatar: 'SC',
    avatarBg: 'from-emerald-500 to-teal-600',
    points: 2260,
    streak: 7,
    questionsSolved: 25,
    upvotes: 94,
    subject: 'Multimedia Fundamentals',
    badges: [
      { name: 'Vaporwave Visionary', icon: '🎨', color: 'teal', desc: 'Designed custom interactive wireframe assets.' }
    ],
    recentContribution: 'Published layout grids detailing beautiful Apple UI and glassmorphic designs.'
  },
  {
    rank: 5,
    id: '731SB619MR',
    name: 'Darren Siew',
    avatar: 'DS',
    avatarBg: 'from-purple-500 to-fuchsia-600',
    points: 1980,
    streak: 15,
    questionsSolved: 22,
    upvotes: 75,
    subject: 'Introduction to Digital Systems',
    badges: [
      { name: 'Query Guru', icon: '💾', color: 'indigo', desc: 'Demonstrated deep understanding of SQL multi-table joins.' }
    ],
    recentContribution: 'Resolved structural logic gate and boolean algebra redundancy.'
  },
  {
    rank: 6,
    id: '814QT492VJ',
    name: 'Melissa Tan',
    avatar: 'MT',
    avatarBg: 'from-teal-400 to-emerald-600',
    points: 1840,
    streak: 5,
    questionsSolved: 19,
    upvotes: 61,
    subject: 'Problem Solving and Programme Design',
    badges: [
      { name: 'Code Artisan', icon: '💻', color: 'emerald', desc: 'Maintained 100% test coverage projects on GitHub.' }
    ],
    recentContribution: 'Explained memory pointers and pointers/arrays arithmetic in C++.'
  },
  {
    rank: 7,
    id: '303HL915BC',
    name: 'Kenji (You)',
    avatar: 'KJ',
    avatarBg: 'from-apple-blue to-apple-indigo',
    points: 1720,
    streak: 4,
    questionsSolved: 16,
    upvotes: 52,
    subject: 'Introduction to Computing Technologies',
    badges: [
      { name: 'Junior Academic', icon: '🚀', color: 'blue', desc: 'Contributed 15+ approved answers to peer questions.' }
    ],
    recentContribution: 'Answered a question about HMR configuration and CSS transitions in Vite.',
    isCurrentUser: true
  },
  {
    rank: 8,
    id: '616ZN430EP',
    name: 'Amina Ali',
    avatar: 'AA',
    avatarBg: 'from-violet-500 to-indigo-700',
    points: 1610,
    streak: 3,
    questionsSolved: 14,
    upvotes: 49,
    subject: 'Mathematics 1',
    badges: [],
    recentContribution: 'Shared comprehensive study notes on trigonometry identities.'
  },
  {
    rank: 9,
    id: '925MX391WD',
    name: 'Ethan Hunt',
    avatar: 'EH',
    avatarBg: 'from-cyan-500 to-blue-600',
    points: 1540,
    streak: 8,
    questionsSolved: 12,
    upvotes: 38,
    subject: 'Introduction to Computing Technologies',
    badges: [
      { name: 'SysAdmin Star', icon: '🐧', color: 'sky', desc: 'Resolved complex VM command problems.' }
    ],
    recentContribution: 'Explained pipeline performance metrics in simple, high-visibility diagram.'
  },
  {
    rank: 10,
    id: '108VR847UY',
    name: 'Patricia Lim',
    avatar: 'PL',
    avatarBg: 'from-amber-400 to-yellow-600',
    points: 1420,
    streak: 2,
    questionsSolved: 10,
    upvotes: 31,
    subject: 'Multimedia Fundamentals',
    badges: [],
    recentContribution: 'Reviewed 5 other student vector wireframes with precise constructive reviews.'
  }
];

export const Leaderboard: React.FC = () => {
  const [students] = useState<Student[]>(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTimeframe, setActiveTimeframe] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Custom non-blocking feedback message for contributions action
  const [contributionNavMessage, setContributionNavMessage] = useState<string | null>(null);



  // Filter and Search Logic
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Query filter (Search by Name, Student ID, or Subject)
    if (searchQuery.trim() !== '') {
      result = result.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Subject Dropdown Filter
    if (selectedSubject !== 'All') {
      result = result.filter(student => 
        student.subject.toLowerCase() === selectedSubject.toLowerCase() ||
        student.isCurrentUser
      );
    }

    // Timeframe multiplier simulation for upvotes
    return result.map(student => {
      let upvoteMultiplier = 1;
      if (activeTimeframe === 'weekly') upvoteMultiplier = 0.3;
      if (activeTimeframe === 'monthly') upvoteMultiplier = 0.7;

      return {
        ...student,
        upvotes: Math.round(student.upvotes * upvoteMultiplier)
      };
    }).sort((a, b) => b.upvotes - a.upvotes)
      .map((student, index) => ({
        ...student,
        rank: index + 1
      }));
  }, [students, searchQuery, activeTimeframe, selectedSubject]);

  // Current user's stats
  const currentUser = useMemo(() => {
    return filteredStudents.find(s => s.isCurrentUser);
  }, [filteredStudents]);



  // Top 3 Podium Extraction
  const podiumStudents = useMemo(() => {
    const top3 = filteredStudents.slice(0, 3);
    const result: (Student | null)[] = [null, null, null]; // [2nd, 1st, 3rd]

    if (top3[1]) result[0] = top3[1]; // 2nd Place
    if (top3[0]) result[1] = top3[0]; // 1st Place
    if (top3[2]) result[2] = top3[2]; // 3rd Place

    return result;
  }, [filteredStudents]);

  // Rest of students for the listing
  const listStudents = useMemo(() => {
    return filteredStudents.slice(3);
  }, [filteredStudents]);

  return (
    <div id="leaderboard-page-container" className="pt-32 pb-24 w-full max-w-6xl mx-auto px-4 relative">
      
      {/* HEADER SECTION */}
      <div id="leaderboard-header-section" className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass bg-apple-blue/10 text-apple-blue text-[11px] font-semibold tracking-wide uppercase border-apple-blue/20">
            
          </div>
          <h1 id="leaderboard-main-title" className="text-[36px] md:text-[44px] font-bold tracking-tight leading-tight">
            Academic Leaderboard
          </h1>
          <p className="text-[15px] opacity-60 max-w-2xl">
            Meet the leading academic contributors of Multimedia University (MMU). Solve topics, post answers, get upvotes, and build credentials.
          </p>
        </div>
      </div>

      {/* FILTER & INTERACTION PANEL */}
      <div id="leaderboard-filter-panel" className="glass-card !p-4 mb-8 flex flex-col md:flex-row items-center gap-4 justify-between">
        
        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <input 
            id="leaderboard-search-input"
            type="text" 
            placeholder="Search student, subject, or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-black/10 dark:bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 text-[13px] font-medium outline-none focus:border-apple-blue/40 focus:ring-1 focus:ring-apple-blue/20 transition-all text-primary"
          />
          {searchQuery && (
            <X 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 hover:opacity-80 cursor-pointer"
              onClick={() => setSearchQuery('')}
            />
          )}
        </div>

        {/* Categories togglers */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Timeframe */}
          <div id="timeframe-toggle-group" className="flex bg-black/15 dark:bg-black/40 p-1 rounded-xl border border-white/5 gap-0.5">
            {[
              { id: 'weekly', label: 'Weekly' },
              { id: 'monthly', label: 'Monthly' },
              { id: 'alltime', label: 'All-Time' }
            ].map(tf => (
              <button
                key={tf.id}
                id={`timeframe-btn-${tf.id}`}
                onClick={() => setActiveTimeframe(tf.id as 'weekly' | 'monthly' | 'alltime')}
                className={`h-[32px] px-4 rounded-lg text-[12px] font-semibold transition-all ${
                  activeTimeframe === tf.id 
                    ? 'bg-apple-blue text-white shadow-sm' 
                    : 'text-primary opacity-50 hover:opacity-150'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Subject Filter Dropdown grouped by Trimesters */}
          <div id="subject-filter-select-container" className="flex items-center gap-1.5 bg-black/15 dark:bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
            <span className="text-[11px] font-bold opacity-30 uppercase tracking-wider">Subject:</span>
            <select
              id="subject-filter-dropdown"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-transparent border-none outline-none text-[12px] font-semibold text-primary cursor-pointer pr-1"
            >
              <option value="All" className="bg-neutral-800 text-white">All Subjects</option>
              
              <optgroup label="Trimester 1" className="bg-neutral-800 text-gray-400 font-bold">
                <option value="Introduction to Business" className="text-white">Introduction to Business Management</option>
                <option value="Introduction to Computing Technologies" className="text-white">Intro to Computing Technologies</option>
                <option value="Communicative English" className="text-white">Communicative English</option>
                <option value="Mathematics 1" className="text-white">Mathematics 1</option>
                <option value="Problem Solving and Programme Design" className="text-white">Problem Solving & Programme Design</option>
              </optgroup>
              
              <optgroup label="Trimester 2" className="bg-neutral-800 text-gray-400 font-bold">
                <option value="Critical Thinking" className="text-white">Critical Thinking</option>
                <option value="Introduction to Digital Systems" className="text-white">Intro to Digital Systems</option>
                <option value="Essential English" className="text-white">Essential English</option>
                <option value="Multimedia Fundamentals" className="text-white">Multimedia Fundamentals</option>
                <option value="Mathematics II" className="text-white">Mathematics II</option>
                <option value="Principles of Physics" className="text-white">Principles of Physics</option>
              </optgroup>
              
              <optgroup label="Trimester 3" className="bg-neutral-800 text-gray-400 font-bold">
                <option value="Academic English" className="text-white">Academic English</option>
                <option value="Mathematics III" className="text-white">Mathematics III</option>
              </optgroup>
            </select>   
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: PODIUM AND WORKSPACE / QUIZ */}
      <div id="leaderboard-grid-layout" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
        
        {/* LEFT & CENTER PANEL (PODIUM & TABULAR LIST) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PODIUM DISPLAY (Top 3 Users) */}
          <div id="podium-display" className="grid grid-cols-3 gap-4 md:gap-6 items-end pt-12 pb-4 px-4 bg-gradient-to-t from-white/5 to-transparent rounded-[32px] border border-white/5 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {/* 2ND PLACE */}
            {podiumStudents[0] ? (
              <motion.div 
                id="podium-card-rank-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => { setSelectedStudent(podiumStudents[0]); setContributionNavMessage(null); }}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-[20px] bg-gradient-to-tr from-stone-400 to-zinc-500 flex items-center justify-center p-0.5 shadow-xl relative">
                    <div className="w-full h-full rounded-[18px] bg-neutral-900 flex items-center justify-center text-lg font-bold text-zinc-300">
                      {podiumStudents[0].avatar}
                    </div>
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 scale-90">
                    <Award className="w-5 h-5 text-zinc-300 drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]" />
                  </div>
                  <div className="absolute -bottom-1 right-[-4px] bg-zinc-300 text-neutral-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-neutral-900 shadow-md">
                    2
                  </div>
                </div>

                <div className="text-center max-w-full">
                  <span className="block text-[13px] font-bold truncate text-primary group-hover:text-apple-blue transition-colors">
                    {podiumStudents[0].name}
                  </span>
                  <span className="block text-[10px] opacity-40 font-semibold uppercase tracking-widest leading-none mt-0.5 truncate px-1">
                    {podiumStudents[0].subject}
                  </span>
                </div>

                {/* 2nd place Podium column block */}
                <div className="w-full h-24 mt-4 bg-zinc-600/10 hover:bg-zinc-600/15 border-t border-x border-zinc-500/20 rounded-t-[20px] flex flex-col justify-center items-center backdrop-blur-md transition-all">
                  <ThumbsUp className="w-4 h-4 text-zinc-400 mb-1" />
                  <span className="text-[14px] font-black leading-tight text-zinc-300">
                    {podiumStudents[0].upvotes}
                  </span>
                  <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-md mt-1 flex items-center gap-0.5">
                    <Flame className="w-2.5 h-2.5" />
                    {podiumStudents[0].streak}d
                  </span>
                </div>
              </motion.div>
            ) : <div className="h-20" />}

            {/* 1ST PLACE */}
            {podiumStudents[1] ? (
              <motion.div 
                id="podium-card-rank-1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                onClick={() => { setSelectedStudent(podiumStudents[1]); setContributionNavMessage(null); }}
                className="flex flex-col items-center cursor-pointer group z-10"
              >
                <div className="relative mb-4">
                  {/* Floating effect ring */}
                  <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 blur-md opacity-40 animate-pulse" />
                  
                  <div className="w-20 h-20 rounded-[24px] bg-gradient-to-tr from-amber-300 via-amber-400 to-yellow-500 flex items-center justify-center p-0.5 shadow-2xl relative z-10">
                    <div className="w-full h-full rounded-[22px] bg-neutral-900 flex items-center justify-center text-xl font-bold text-amber-300">
                      {podiumStudents[1].avatar}
                    </div>
                  </div>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Trophy className="w-7 h-7 text-amber-400 drop-shadow-[0_4px_12px_rgba(251,191,36,0.6)]" />
                  </div>
                  <div className="absolute -bottom-1.5 right-[-4px] bg-amber-400 text-neutral-950 font-black text-[11px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-neutral-900 shadow-xl z-20">
                    1
                  </div>
                </div>

                <div className="text-center max-w-full z-10">
                  <div className="flex items-center gap-1 justify-center">
                    <span className="text-[15px] font-black tracking-tight text-primary group-hover:text-amber-400 transition-colors truncate">
                      {podiumStudents[1].name}
                    </span>
                    <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  </div>
                  <span className="block text-[10px] opacity-50 font-bold uppercase tracking-widest leading-none mt-0.5 truncate px-1">
                    {podiumStudents[1].subject}
                  </span>
                </div>

                {/* 1st place Podium column block */}
                <div className="w-full h-32 mt-4 bg-gradient-to-b from-amber-500/10 to-amber-600/5 hover:from-amber-500/15 border-t border-x border-amber-400/20 rounded-t-[24px] flex flex-col justify-center items-center backdrop-blur-md shadow-[0_-10px_30px_rgba(251,191,36,0.05)] transition-all">
                  <ThumbsUp className="w-4.5 h-4.5 text-amber-400 mb-1" />
                  <span className="text-[17px] font-black leading-none text-amber-300">
                    {podiumStudents[1].upvotes}
                  </span>
                  <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-lg mt-1.5 flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {podiumStudents[1].streak}d Streak
                  </span>
                </div>
              </motion.div>
            ) : <div className="h-20" />}

            {/* 3RD PLACE */}
            {podiumStudents[2] ? (
              <motion.div 
                id="podium-card-rank-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -4 }}
                onClick={() => { setSelectedStudent(podiumStudents[2]); setContributionNavMessage(null); }}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-[20px] bg-gradient-to-tr from-amber-700 to-amber-900 flex items-center justify-center p-0.5 shadow-xl relative">
                    <div className="w-full h-full rounded-[18px] bg-neutral-900 flex items-center justify-center text-lg font-bold text-amber-600">
                      {podiumStudents[2].avatar}
                    </div>
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 scale-90">
                    <Award className="w-5 h-5 text-amber-700 drop-shadow-[0_2px_8px_rgba(180,83,9,0.4)]" />
                  </div>
                  <div className="absolute -bottom-1 right-[-4px] bg-amber-700 text-neutral-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-neutral-900 shadow-md">
                    3
                  </div>
                </div>

                <div className="text-center max-w-full">
                  <span className="block text-[13px] font-bold truncate text-primary group-hover:text-apple-blue transition-colors">
                    {podiumStudents[2].name}
                  </span>
                  <span className="block text-[10px] opacity-40 font-semibold uppercase tracking-widest leading-none mt-0.5 truncate px-1">
                    {podiumStudents[2].subject}
                  </span>
                </div>

                {/* 3rd place Podium column block */}
                <div className="w-full h-20 mt-4 bg-amber-900/10 hover:bg-amber-900/15 border-t border-x border-amber-800/15 rounded-t-[20px] flex flex-col justify-center items-center backdrop-blur-md transition-all">
                  <ThumbsUp className="w-4 h-4 text-amber-600 mb-1" />
                  <span className="text-[14px] font-black leading-tight text-amber-500">
                    {podiumStudents[2].upvotes}
                  </span>
                  <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-md mt-1 flex items-center gap-0.5">
                    <Flame className="w-2.5 h-2.5" />
                    {podiumStudents[2].streak}d
                  </span>
                </div>
              </motion.div>
            ) : <div className="h-20" />}

          </div>

          {/* TABULAR LIST (Ranks 4+) */}
          <div id="leaderboard-table-container" className="glass-card !p-0 overflow-hidden border border-white/5 shadow-xl">
            
            {/* Header row */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 dark:bg-black/40 border-b border-white/5 text-[11px] font-black uppercase tracking-wider text-primary opacity-50">
              <div className="col-span-2 text-center">Rank</div>
              <div className="col-span-5">Buddy</div>
              <div className="col-span-3">Subject Name</div>
              <div className="col-span-2 text-right">Upvotes</div>
            </div>

            {/* List Rows */}
            <div id="leaderboard-dynamic-rows-list" className="divide-y divide-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {filteredStudents.length > 3 ? (
                  listStudents.map((student) => (
                    <motion.div
                      key={student.id}
                      id={`student-row-rank-${student.rank}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                      onClick={() => { setSelectedStudent(student); setContributionNavMessage(null); }}
                      className={`grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer transition-all ${
                        student.isCurrentUser 
                          ? 'bg-apple-blue/10 border-y border-apple-blue/20' 
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {/* Rank Column */}
                      <div className="col-span-2 flex items-center justify-center">
                        <span className={`text-[14px] font-black ${
                          student.isCurrentUser ? 'text-apple-blue font-black underline decoration-2' : 'text-primary/70'
                        }`}>
                          #{student.rank}
                        </span>
                      </div>

                      {/* Buddy Details Column */}
                      <div className="col-span-5 flex items-center gap-3.5 min-w-0">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${student.avatarBg} p-0.5 shadow-md flex-shrink-0`}>
                          <div className="w-full h-full rounded-[10px] bg-neutral-900 flex items-center justify-center text-[12px] font-bold text-white">
                            {student.avatar}
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[14px] font-bold truncate text-primary ${
                              student.isCurrentUser ? 'font-black text-apple-blue' : ''
                            }`}>
                              {student.name}
                            </span>
                            {student.isCurrentUser && (
                              <span className="text-[9px] font-black bg-apple-blue text-white px-1.5 py-0.5 rounded-full uppercase scale-90">
                                You
                              </span>
                            )}
                            {student.streak >= 10 && (
                              <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                            )}
                          </div>
                          
                          <div className="text-[11px] opacity-40 leading-none mt-1 truncate">
                            Student ID: {student.id}
                          </div>
                        </div>
                      </div>

                      {/* Subject Name Column */}
                      <div className="col-span-3 min-w-0">
                        <span className="block text-[13px] text-primary/80 truncate font-semibold" title={student.subject}>
                          {student.subject}
                        </span>
                        <span className="block text-[10px] opacity-45 uppercase font-bold tracking-wider truncate mt-0.5">
                          Academic Subject
                        </span>
                      </div>

                      {/* Upvotes Column */}
                      <div className="col-span-2 text-right">
                        <span className="text-[15px] font-black text-primary/95 block leading-none">
                          {student.upvotes}
                        </span>
                        <span className="text-[9px] font-bold text-apple-blue mt-1 inline-block opacity-75">
                          Upvotes
                        </span>
                      </div>

                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-16 text-primary/40 text-[14px]">
                    No students match your active filters or query.
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Current logged-in student position sticky mini-badge */}
            {currentUser && (
              <div id="sticky-current-user-badge" className="p-4 bg-apple-blue/5 border-t border-white/10 flex items-center justify-between text-[13px] px-6">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-apple-blue" />
                  <span>Your current placement: <strong className="text-apple-blue">Rank #{currentUser.rank}</strong> with <strong>{currentUser.upvotes} upvotes</strong></span>
                </div>
                <div className="flex items-center gap-1 text-[11px] bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-lg font-bold">
                  <Flame className="w-3 h-3" />
                  {currentUser.streak} Day consecutive help streak
                </div>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: CONTRIBUTOR PATHWAY */}
        <div className="space-y-8">
          
          {/* HOW TO CLIMB WORKFLOW WIDGET */}
          <div id="contributor-pathways-panel" className="glass-card p-6 border border-white/5">
            <h3 className="text-[17px] font-bold mb-4 flex items-center gap-2">
              <Star className="w-4.5 h-4.5 text-apple-blue" />
              Contributor Pathway
            </h3>
            
            <div className="space-y-4">
              {[
                { 
                  action: 'Respond to academic queries', 
                  points: '+100 upvotes per answer', 
                  desc: 'A peer upvotes your answer on specific subject chapters.' 
                },
                { 
                  action: 'Resolve open questions', 
                  points: '+250 upvotes per solution', 
                  desc: 'A student marks your reply as the single verified solution.' 
                },
                { 
                  action: 'Post structured notes', 
                  points: '+80 upvotes per chapter', 
                  desc: 'Publish comprehensive study summaries tagged with course code.' 
                },
                { 
                  action: 'Help peers in discussions', 
                  points: '+5 upvotes per attempt', 
                  desc: 'Clear the interactive study challenges and share your knowledge.' 
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-3.5 items-start">
                  <div className="w-6 h-6 rounded-full bg-apple-indigo/10 flex items-center justify-center text-[11px] font-black text-apple-indigo shrink-0 mt-0.5">
                    {i+1}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-x-2">
                      <span className="text-[13px] font-extrabold text-primary">{item.action}</span>
                      <span className="text-[10px] font-black bg-apple-indigo/10 text-apple-indigo px-1.5 py-0.5 rounded-full whitespace-nowrap mt-0.5 sm:mt-0">
                        {item.points}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-40 leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* FLOATING DETAILED PROFILE OVERLAY DRAWER */}
      <AnimatePresence>
        {selectedStudent && (
          <div id="student-detail-overlay-backdrop" className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
            <motion.div
              id="student-detail-card-container"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} // Retain clicks inside card
              className="w-full max-w-lg glass-card !p-0 overflow-hidden relative border border-white/20 shadow-2xl"
            >
              
              {/* Card top banner */}
              <div className="h-28 bg-gradient-to-tr from-apple-blue/30 via-apple-indigo/30 to-apple-purple/30 relative flex items-end px-6 pb-4">
                <button 
                  id="detail-close-btn"
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-black/25 rounded-full text-[10px] font-extrabold text-white uppercase tracking-wider">
                  <BookOpen className="w-3 h-3 text-apple-blue" />
                  MMU Academic Credential
                </div>
              </div>

              {/* Avatar position offset */}
              <div className="px-6 pb-6 relative">
                <div className="flex justify-between items-start">
                  <div className="-mt-[36px] relative z-10">
                    <div className={`w-20 h-20 rounded-[24px] bg-gradient-to-tr ${selectedStudent.avatarBg} p-1 shadow-2xl`}>
                      <div className="w-full h-full rounded-[20px] bg-neutral-950 flex items-center justify-center text-2xl font-bold text-white uppercase">
                        {selectedStudent.avatar}
                      </div>
                    </div>
                  </div>

                  <div className="text-right pt-2.5">
                    <span className="text-[12px] font-bold text-apple-blue bg-apple-blue/10 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                      Rank #{selectedStudent.rank} on MMU
                    </span>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="mt-4 space-y-1">
                  <h2 className="text-[22px] font-bold tracking-tight text-primary flex items-center gap-2">
                    {selectedStudent.name}
                    {selectedStudent.isCurrentUser && (
                      <span className="text-[9px] font-black bg-apple-blue text-white px-2 py-0.5 rounded-full uppercase">
                        Active Account
                      </span>
                    )}
                  </h2>
                  <div className="text-[13px] opacity-50 font-bold uppercase tracking-wide leading-none text-apple-indigo">
                    Enrolled: {selectedStudent.subject}
                  </div>
                  <div className="text-[11px] opacity-40 font-semibold tracking-wider uppercase">
                    Student ID: {selectedStudent.id}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3.5 mt-6 mb-6">
                  <div className="bg-black/10 dark:bg-white/5 border border-white/5 p-3 rounded-[18px] text-center">
                    <div className="text-[10px] font-semibold opacity-30 uppercase tracking-widest leading-none">Total Upvotes</div>
                    <div className="text-[17px] font-black mt-1 text-primary">{selectedStudent.upvotes}</div>
                  </div>
                  <div className="bg-black/10 dark:bg-white/5 border border-white/5 p-3 rounded-[18px] text-center">
                    <div className="text-[10px] font-semibold opacity-30 uppercase tracking-widest leading-none">Daily Streak</div>
                    <div className="text-[17px] font-black mt-1 text-orange-500 flex items-center justify-center gap-1">
                      <Flame className="w-4 h-4 shrink-0" />
                      {selectedStudent.streak}d
                    </div>
                  </div>
                  <div className="bg-black/10 dark:bg-white/5 border border-white/5 p-3 rounded-[18px] text-center">
                    <div className="text-[10px] font-semibold opacity-30 uppercase tracking-widest leading-none">Upvotes Calc</div>
                    <div className="text-[17px] font-black mt-1 text-apple-blue flex items-center justify-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 shrink-0" />
                      {selectedStudent.upvotes}
                    </div>
                  </div>
                </div>

                {/* Badges section */}
                <div className="space-y-2.5 pt-4 border-t border-white/5">
                  <span className="text-[11px] font-bold opacity-30 uppercase tracking-widest block">Earned Badges & Micro-Credentials</span>
                  
                  {selectedStudent.badges.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {selectedStudent.badges.map((badge, idx) => (
                        <div key={idx} className="flex gap-3 items-start p-2 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-[18px] shrink-0 mt-0.5">{badge.icon}</span>
                          <div>
                            <span className="block text-[12px] font-extrabold text-primary">{badge.name}</span>
                            <span className="block text-[11px] opacity-40 leading-tight mt-0.5">{badge.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[12px] opacity-35 leading-tight py-2 bg-white/5 rounded-xl text-center border border-dashed border-white/5">
                      Answer peer queries to unlock subjects micro-credentials!
                    </div>
                  )}
                </div>

                {/* Recent Contribution */}
                <div className="mt-5 pt-4 border-t border-white/5 space-y-1.5 animate-fade-in">
                  <span className="text-[11px] font-bold opacity-30 uppercase tracking-widest block">Recent Academic Contribution:</span>
                  <div className="p-3 bg-black/15 dark:bg-black/30 border border-white/5 rounded-xl text-[12px] italic leading-relaxed opacity-90 text-primary">
                    "{selectedStudent.recentContribution}"
                  </div>
                </div>

                {/* Inline Nav Message Success */}
                {contributionNavMessage && (
                  <div className="mt-4 p-2.5 text-[11px] font-semibold rounded-lg bg-apple-mint/10 border border-apple-mint/25 text-apple-mint text-center transition-all animate-spring-in">
                     {contributionNavMessage}
                  </div>
                )}

                {/* Footer Action */}
                <div className="mt-6 flex gap-3">
                  <button 
                    id="detail-view-posts-btn"
                    onClick={() => {
                      setContributionNavMessage(`Pulling academic posts Authored by ${selectedStudent.name}. Found ${selectedStudent.questionsSolved} verified contributions!`);
                    }}
                    className="flex-1 h-11 rounded-xl bg-apple-blue text-white text-[13px] font-extrabold shadow-md hover:brightness-110 active:scale-98 transition-all cursor-pointer"
                  >
                    View Contributions
                  </button>
                  <button 
                    id="detail-close-card-btn"
                    onClick={() => setSelectedStudent(null)}
                    className="h-11 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-primary border border-white/10 text-[13px] font-bold transition-all active:scale-98 cursor-pointer"
                  >
                    Close Profile
                  </button>
                </div>

              </div>
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
