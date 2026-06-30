import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Search, 
  Award, 
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  ThumbsUp
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../src/services/supabaseClient';

interface LeaderboardUser {
  rank: number;
  name: string;
  studentId: string;
  avatar: string;
  likes: number;
  dominantSubject: string;
  major: string;
}

const LEADERBOARD_DATA: Omit<LeaderboardUser, 'rank'>[] = [
  {
    name: 'Tan Kenji',
    studentId: '252FC253ZL',
    avatar: 'TK',
    likes: 192,
    dominantSubject: 'Problem Solving & Program Design',
    major: 'Software Engineering'
  },
  {
    name: 'Sarah Lim',
    studentId: '251FC124AM',
    avatar: 'SL',
    likes: 154,
    dominantSubject: 'Introduction to Digital Systems',
    major: 'Data Science'
  },
  {
    name: 'Natesh Kumar',
    studentId: '252FC887KL',
    avatar: 'NK',
    likes: 122,
    dominantSubject: 'Mathematics II',
    major: 'Security & Networking'
  },
  {
    name: 'Chloe Wong',
    studentId: '252FC459ZL',
    avatar: 'CW',
    likes: 98,
    dominantSubject: 'Multimedia Fundamentals',
    major: 'Game Design'
  },
  {
    name: 'Amirul Hakim',
    studentId: '251FC665ML',
    avatar: 'AH',
    likes: 87,
    dominantSubject: 'Communicative English',
    major: 'Business Intelligence'
  },
  {
    name: 'Evelyn Tan',
    studentId: '252FC321NL',
    avatar: 'ET',
    likes: 74,
    dominantSubject: 'Introduction to Business Management',
    major: 'Corporate Management'
  },
  {
    name: 'Marcus Teoh',
    studentId: '251FC942AL',
    avatar: 'MT',
    likes: 62,
    dominantSubject: 'Mathematics I',
    major: 'Software Engineering'
  },
  {
    name: 'Aisha Al-Haddad',
    studentId: '252FC113ZL',
    avatar: 'AA',
    likes: 53,
    dominantSubject: 'Critical Thinking',
    major: 'Data Science'
  },
  {
    name: 'Darren Siew',
    studentId: '251FC228ML',
    avatar: 'DS',
    likes: 41,
    dominantSubject: 'Problem Solving & Program Design',
    major: 'Information Technology'
  }
];

const playSpatialTap = (freq = 600, duration = 0.08) => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq / 2.2, ctx.currentTime + duration);
    
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

interface LeaderboardPageProps {
  key?: string;
  currentUser?: any;
  onNavigate?: (page: any) => void;
}

export function LeaderboardPage({ currentUser, onNavigate }: LeaderboardPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [leaderboardData, setLeaderboardData] = useState<Omit<LeaderboardUser, 'rank'>[]>(LEADERBOARD_DATA);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const fetchProfiles = async () => {
        try {
          const { data, error } = await supabase
            .from('studybuddy_profiles')
            .select('*')
            .order('likes', { ascending: false });
          if (data && data.length > 0) {
            const mappedProfiles = data.map((d: any) => ({
              name: d.name,
              studentId: d.student_id,
              avatar: d.avatar || d.name.slice(0, 2).toUpperCase(),
              likes: d.likes || 0,
              dominantSubject: d.dominant_subject || 'All Subjects',
              major: d.major || 'FCI Student'
            }));
            setLeaderboardData(mappedProfiles);
          }
        } catch (err) {
          console.warn('Failed to load profiles from Supabase, using mock fallback:', err);
        }
      };
      fetchProfiles();
    }
  }, []);

  // Filter, sort by likes in descending order, and dynamically map ranks
  const processedData = [...leaderboardData]
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            user.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => b.likes - a.likes)
    .map((user, index) => ({
      ...user,
      rank: index + 1
    }));

  const podiumUsers = processedData.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="pt-[180px] pb-32 px-4 max-w-6xl mx-auto w-full font-sans animate-fade-in-up"
    >
      {/* HEADER HERO AREA */}
      <div className="mb-12 pb-8 border-b border-white/10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative">
        <div className="space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/5 border border-white/15 text-primary/80 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-apple-blue" />
            Social Influence Standings
          </div>
          
          <h1 className="text-[44px] md:text-[56px] font-black tracking-tight leading-none text-primary">
            Academic Champions
          </h1>
          
          <p className="text-[15px] opacity-60 max-w-xl">
            Celebrating peer-to-peer excellence. Earn top spots by gaining likes and upvotes from fellow students for your high-quality homepage contributions.
          </p>
        </div>

        <div className="h-0.5 w-[160px] bg-gradient-to-r from-apple-blue via-apple-indigo to-apple-purple rounded-full" />
      </div>

      {/* SEARCH CONTROL (Faculty Filter Deleted as requested) */}
      <div className="mb-12 max-w-xl mx-auto">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 text-primary" />
          <input 
            type="text" 
            placeholder="Search by student name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => playSpatialTap(500, 0.05)}
            className="w-full h-12 bg-white/5 dark:bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl pl-12 pr-4 text-[13px] font-medium text-primary outline-none focus:border-white/30 focus:bg-white/10 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* PODIUM (TOP 3 INDIVIDUALS) with high-fidelity glass-cards */}
      <AnimatePresence mode="wait">
        {podiumUsers.length > 0 && searchQuery === '' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end"
          >
            {/* Rank 2 (Left side) */}
            {podiumUsers[1] && (
              <motion.div 
                whileHover={{ y: -6, scale: 1.01 }}
                onClick={() => playSpatialTap(520, 0.08)}
                className="glass-card flex flex-col items-center text-center p-8 border border-white/15 relative overflow-hidden order-2 md:order-1 h-[280px] justify-between shadow-xl cursor-pointer"
              >
                <div className="absolute top-4 left-4 font-mono font-black text-white/10 text-4xl select-none">02</div>
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-500 shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-center justify-center font-bold text-white border-2 border-white/20 select-none text-[18px]">
                    {podiumUsers[1].avatar}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-primary">{podiumUsers[1].name}</h3>
                    <p className="text-[11px] font-mono opacity-40 font-bold">{podiumUsers[1].studentId}</p>
                  </div>
                </div>
                
                <div className="w-full pt-4 border-t border-white/10 flex justify-between items-center bg-white/5 dark:bg-black/20 p-3 rounded-2xl border border-white/5 shadow-inner">
                  <span className="text-[11px] font-bold opacity-40">Specialty</span>
                  <span className="text-[12px] font-black text-apple-blue font-mono flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {podiumUsers[1].likes} Likes
                  </span>
                </div>
              </motion.div>
            )}

            {/* Rank 1 (Center premium card) */}
            {podiumUsers[0] && (
              <motion.div 
                whileHover={{ scale: 1.03, y: -8 }}
                onClick={() => playSpatialTap(650, 0.15)}
                className="glass-card flex flex-col items-center text-center p-10 border border-white/25 relative overflow-hidden order-1 md:order-2 h-[330px] justify-between shadow-[0_30px_60px_-15px_rgba(10,132,255,0.25)] bg-gradient-to-b from-white/15 via-white/5 to-transparent cursor-pointer"
              >
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="absolute top-4 left-4 font-mono font-black text-white/20 text-5xl select-none">01</div>
                <div className="absolute top-4 right-4 text-apple-yellow animate-bounce">
                  <Award className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                </div>
                
                <div className="space-y-4 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-apple-blue to-apple-purple flex items-center justify-center font-bold text-white border-4 border-white/20 select-none shadow-[0_8px_32px_rgba(10,132,255,0.3)] relative text-[22px]">
                    {podiumUsers[0].avatar}
                    <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-apple-blue text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-black dark:border-white shadow-sm">
                      Champion
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <h3 className="text-[20px] font-black text-primary flex items-center justify-center gap-1">
                      {podiumUsers[0].name}
                      <Sparkles className="w-4 h-4 text-apple-purple shrink-0 animate-pulse" />
                    </h3>
                    <p className="text-[12px] font-mono opacity-40 font-bold">{podiumUsers[0].studentId}</p>
                  </div>
                </div>
                
                <div className="w-full pt-4 border-t border-white/15 flex justify-between items-center bg-white/10 dark:bg-black/30 p-3.5 rounded-2xl border border-white/10 shadow-lg">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary/70">Total Likes</span>
                  <span className="text-[14px] font-black text-apple-blue font-mono drop-shadow-[0_0_4px_rgba(10,132,255,0.4)] flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {podiumUsers[0].likes} Likes
                  </span>
                </div>
              </motion.div>
            )}

            {/* Rank 3 (Right side) */}
            {podiumUsers[2] && (
              <motion.div 
                whileHover={{ y: -6, scale: 1.01 }}
                onClick={() => playSpatialTap(500, 0.08)}
                className="glass-card flex flex-col items-center text-center p-8 border border-white/15 relative overflow-hidden order-3 h-[260px] justify-between shadow-xl cursor-pointer"
              >
                <div className="absolute top-4 left-4 font-mono font-black text-white/10 text-4xl select-none">03</div>
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-700 to-amber-900 shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-center justify-center font-bold text-white border-2 border-white/10 select-none text-[18px]">
                    {podiumUsers[2].avatar}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-primary">{podiumUsers[2].name}</h3>
                    <p className="text-[11px] font-mono opacity-40 font-bold">{podiumUsers[2].studentId}</p>
                  </div>
                </div>
                
                <div className="w-full pt-4 border-t border-white/10 flex justify-between items-center bg-white/5 dark:bg-black/20 p-3 rounded-2xl border border-white/5 shadow-inner">
                  <span className="text-[11px] font-bold opacity-40">Specialty</span>
                  <span className="text-[12px] font-black text-apple-blue font-mono flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {podiumUsers[2].likes} Likes
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE LEADERBOARD LIST CONTAINER */}
      <div className="glass-card !p-0 border border-white/10 overflow-hidden shadow-2xl relative animate-fade-in">
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 dark:bg-black/30 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-apple-blue" />
            <h3 className="text-[16px] font-extrabold text-primary">Student Leaderboard Rankings</h3>
          </div>
          <span className="text-[11px] opacity-40 font-mono font-bold">Showing {processedData.length} active MMU partners</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-extrabold uppercase tracking-widest text-primary opacity-40">
                <th className="py-4 px-6 text-center w-16">Rank</th>
                <th className="py-4 px-6 min-w-[200px]">Student Buddy</th>
                <th className="py-4 px-6">Dominant Elective Area</th>
                <th className="py-4 px-6 min-w-[120px]">Specialty Major</th>
                <th className="py-4 px-6 text-center">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {processedData.map((user) => (
                  <motion.tr 
                    key={user.studentId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={() => playSpatialTap(580, 0.07)}
                    className="hover:bg-white/[0.04] dark:hover:bg-white/[0.02] transition-all cursor-pointer group"
                  >
                    {/* Rank cell */}
                    <td className="py-4 px-6 text-center">
                      <span className={`font-mono text-[14px] font-black ${
                        user.rank === 1 ? 'text-apple-blue' :
                        user.rank === 2 ? 'text-gray-350 dark:text-zinc-300' :
                        user.rank === 3 ? 'text-amber-600' : 'opacity-40'
                      }`}>
                        #{user.rank}
                      </span>
                    </td>

                    {/* Student Identity cell */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-primary opacity-80 text-[13px] shadow-sm">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="text-[14px] font-extrabold text-primary group-hover:text-apple-blue transition-colors">{user.name}</div>
                          <div className="text-[10.5px] opacity-35 font-mono font-bold tracking-tight">{user.studentId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Dominant topic cell (Badges completely removed) */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[13px] font-semibold text-primary/80 line-clamp-1">{user.dominantSubject}</span>
                      </div>
                    </td>

                    {/* Department cell */}
                    <td className="py-4 px-6">
                      <span className="text-[12px] font-bold opacity-60">{user.major}</span>
                    </td>

                    {/* Performance likes score */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-[14px] font-black text-apple-blue font-mono flex items-center gap-1.5 justify-center">
                          <ThumbsUp className="w-3.5 h-3.5 opacity-70 shrink-0" />
                          {user.likes}
                        </div>
                        <div className="text-[9px] uppercase font-bold opacity-30 tracking-widest leading-none mt-1">
                          Likes
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {processedData.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="max-w-sm mx-auto space-y-2">
                      <p className="text-[16px] font-bold text-primary opacity-60">No Academic Buddy Found</p>
                      <p className="text-[12px] opacity-40 leading-relaxed">
                        We couldn't locate any students matching matches query. Ensure names are formatted properly.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* BOTTOM SPOTLIGHT HIGHLIGHTS */}
        <div className="p-6 bg-white/5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="flex items-center gap-3 max-w-xl">
            <div className="w-10 h-10 rounded-xl bg-apple-blue/10 text-apple-blue flex items-center justify-center shrink-0 border border-apple-blue/10">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[12.5px] font-bold">Want to see your name on the board?</div>
              <p className="text-[11px] opacity-45 leading-relaxed">
                Connect and help resolve fellow student questions. Generating likes from peers bumps your score immediately!
              </p>
            </div>
          </div>

          {currentUser ? (
            <button 
              onClick={() => {
                playSpatialTap(700, 0.1);
                alert("Contribution Guidelines:\n\n1. Be helpful, polite, and encouraging to peers.\n2. Do not spam or post duplicate question contents.\n3. Generating likes from other students boosts your leaderboard rank!");
              }}
              className="h-10 px-5 bg-apple-blue hover:brightness-110 text-white rounded-xl text-[12px] font-black flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-lg"
            >
              Read Contribution Guidelines
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button 
              onClick={() => {
                playSpatialTap(700, 0.1);
                if (onNavigate) onNavigate('auth-login');
              }}
              className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[12px] font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-lg animate-pulse"
            >
              To learn more, please log in
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
