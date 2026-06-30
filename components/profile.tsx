import { motion } from 'framer-motion';
import { X, LogOut, Award, User, Mail, Shield, BookOpen, Clock } from 'lucide-react';

interface ProfilePageProps {
  key?: string;
  onBack: () => void;
  onSignOut: () => void;
  currentUser?: {
    name: string;
    studentId: string;
    email: string;
    major: string;
    likes: number;
    dominant_subject?: string;
  } | null;
  onNavigateToLeaderboard?: () => void;
}

export function ProfilePage({ onBack, onSignOut, currentUser, onNavigateToLeaderboard }: ProfilePageProps) {
  // Clean custom tap audio effect
  const playCustomTap = (freq = 600, duration = 0.08) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  // Get active user data
  const name = currentUser?.name || 'You (Student Buddy)';
  const studentId = currentUser?.studentId || '252FC999SB';
  const email = currentUser?.email || 'student.buddy@student.mmu.edu.my';
  const major = currentUser?.major || 'Foundation in Computing (FCI)';
  const likes = currentUser?.likes !== undefined ? currentUser.likes : 31;
  const helperScore = likes * 10;
  const avatarText = name.slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/60 backdrop-blur-sm">
      {/* Background overlay click closes panel */}
      <div 
        className="absolute inset-0 cursor-default" 
        onClick={() => {
          playCustomTap(450, 0.08);
          onBack();
        }}
      />

      {/* Slide-over Profile Panel */}
      <motion.div
        initial={{ x: '100%', opacity: 0.9 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0.9 }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="w-full max-w-md h-full bg-zinc-950/95 border-l border-white/10 p-8 flex flex-col justify-between relative z-[110] shadow-2xl backdrop-blur-2xl"
      >
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black tracking-widest text-white uppercase">Profile Center</h3>
            <button
              onClick={() => {
                playCustomTap(400, 0.08);
                onBack();
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Badge Info */}
          <div className="flex flex-col items-center text-center space-y-4 py-4 rounded-3xl bg-white/[0.03] border border-white/[0.05] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-apple-blue/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-apple-blue to-apple-purple p-0.5 shadow-xl">
              <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-lg text-white">
                {avatarText}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold text-white tracking-tight">{name}</h4>
              <p className="text-xs text-zinc-400 font-mono mt-1">ID: {studentId}</p>
            </div>

            <div className="flex gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-apple-blue/10 border border-apple-blue/20 text-apple-blue">
                Computing
              </span>
            </div>
          </div>

          {/* Details / Contribution Stats */}
          <div className="space-y-4">
            <div 
              onClick={() => {
                playCustomTap(650, 0.08);
                if (onNavigateToLeaderboard) onNavigateToLeaderboard();
              }}
              className="group cursor-pointer"
            >
              <h5 className="text-xs font-black text-zinc-500 uppercase tracking-widest group-hover:text-apple-blue transition-colors flex items-center gap-2">
                Academic Badges
                <span className="text-[10px] text-apple-blue font-semibold lowercase tracking-normal group-hover:underline opacity-80">(view leaderboard)</span>
              </h5>
              
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] transition-colors">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Helper score</div>
                  <div className="text-2xl font-black text-white mt-1">{helperScore} <span className="text-xs text-zinc-500">pts</span></div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] transition-colors">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Posts Rank</div>
                  <div className="text-2xl font-black text-white mt-1">#{likes > 0 ? Math.max(1, 10 - Math.floor(likes / 3)) : 12} <span className="text-xs text-zinc-500 font-normal">buddy</span></div>
                </div>
              </div>
            </div>

            {/* List Details */}
            <div className="space-y-3.5 pt-4">
              <div className="flex items-center gap-3.5 text-sm">
                <Mail className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-300 break-all">{email}</span>
              </div>
              <div className="flex items-center gap-3.5 text-sm">
                <BookOpen className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-300">{major}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="space-y-4">
          <button
            onClick={() => {
              playCustomTap(350, 0.12);
              onSignOut();
            }}
            className="w-full h-12 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-red-500/20 active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4" />
            Sign Out Accounts
          </button>
          
          <div className="h-4"></div>
        </div>
      </motion.div>
    </div>
  );
}
