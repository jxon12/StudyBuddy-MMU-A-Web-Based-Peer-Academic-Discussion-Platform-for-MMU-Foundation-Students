<<<<<<< HEAD
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, Award, User, Mail, Shield, BookOpen, Clock } from 'lucide-react';
=======
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Camera, 
  MapPin, 
  Save, 
  LogOut, 
  Check,
  MessageCircle,
  FileText
} from 'lucide-react';
import { CreatePostPage } from './createpost';
>>>>>>> 331adfb541e95bad51a4d491b94bba295b70eae6

interface ProfilePageProps {
  key?: string;
  onBack: () => void;
  onSignOut: () => void;
}

<<<<<<< HEAD
export function ProfilePage({ onBack, onSignOut }: ProfilePageProps) {
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
=======

const PROFILE_SUBJECTS = [
  { id: 'all', name: 'All Subjects' },
  { id: 'CMT1114', name: 'CMT1114 Mathematics 1' },
  { id: 'CMF1114', name: 'CMF1114 Multimedia' },
  { id: 'CDS1114', name: 'CDS1114 Digital System' },
  { id: 'CSP1114', name: 'CSP1114 Program Design' },
  { id: 'CSP1123', name: 'CSP1123 Mini IT Project' },
  { id: 'GNB1114', name: 'GNB1114 Business Management' },
  { id: 'LAE1113', name: 'LAE1113 Academic English' },
  { id: 'CMT1124', name: 'CMT1124 Mathematics 2' },
  { id: 'LCT1113', name: 'LCT1113 Critical Thinking' },
];

export function ProfilePage({ onBack, onSignOut }: ProfileProps) {
  // --- Persistent Profile State ---
  const [name, setName] = useState(() => {
    return localStorage.getItem('profile-name') || 'Ling Yi Yon';
  });
  
  const [location] = useState(() => {
    return localStorage.getItem('profile-location') || 'MMU Cyberjaya Campus';
  });

  const [avatarSeed, setAvatarSeed] = useState(() => {
    return localStorage.getItem('profile-avatar-seed') || 'real-photo';
  });

  const [bookmarksCount] = useState(() => {
    const saved = localStorage.getItem('profile-bookmarks-count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [likesReceived] = useState(() => {
    const saved = localStorage.getItem('profile-likes-count');
    return saved ? parseInt(saved, 10) : 0;
  });

  // --- Dynamic dropdown menus UI ---
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // --- Dynamic Subject Filtering & New Post State ---

  // --- Mock posts created by this profile ---
  const [myPosts, setMyPosts] = useState<Array<{id: string, content: string, timestamp: string, likes: number, replies: number, image?: string, subject?: string}>>(() => {
    const saved = localStorage.getItem('profile-my-posts');
    return saved ? JSON.parse(saved) : [];
  });
  const [showPostModal, setShowPostModal] = useState(false);

  // Handle Save profile info
  const handleSave = () => {
    localStorage.setItem('profile-name', name);
    localStorage.setItem('profile-location', location);
    localStorage.setItem('profile-avatar-seed', avatarSeed);
    localStorage.setItem('profile-bookmarks-count', bookmarksCount.toString());
    localStorage.setItem('profile-likes-count', likesReceived.toString());
    localStorage.setItem('profile-my-posts', JSON.stringify(myPosts));

    setAlertMessage('Profile changes saved successfully! 💾');
    setTimeout(() => setAlertMessage(null), 3000);
  };


  // Delete a post
  const handleDeletePost = (id: string) => {
    const updated = myPosts.filter(p => p.id !== id);
    setMyPosts(updated);
    localStorage.setItem('profile-my-posts', JSON.stringify(updated));
  };

  // Change avatar seed randomly
  const handleRandomizeAvatar = () => {
    const randomSeeds = ['real-photo', 'Lucky', 'Spooky', 'Snuggles', 'Tiger', 'Cookie', 'Precious', 'Willow', 'Buster', 'Milo', 'Cody', 'Me', 'StudyTime', 'MMUStar'];
    const currentIdx = randomSeeds.indexOf(avatarSeed);
    let nextIdx = Math.floor(Math.random() * randomSeeds.length);
    if (nextIdx === currentIdx) {
      nextIdx = (nextIdx + 1) % randomSeeds.length;
    }
    setAvatarSeed(randomSeeds[nextIdx]);
    localStorage.setItem('profile-avatar-seed', randomSeeds[nextIdx]);
>>>>>>> 331adfb541e95bad51a4d491b94bba295b70eae6
  };

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

<<<<<<< HEAD
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
                <img src="/images/team/liou-zi-en.jpeg" alt="Liou Zi En" className="w-full h-full rounded-full object-cover" />
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold text-white tracking-tight">Liou Zi En</h4>
              <p className="text-xs text-zinc-400 font-mono mt-1">ID: 252FC251LC</p>
            </div>

            <div className="flex gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center gap-1">
                <Award className="w-3 h-3" />
                Silver Tier
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-apple-blue/10 border border-apple-blue/20 text-apple-blue">
                Computing
              </span>
            </div>
          </div>

          {/* Details / Contribution Stats */}
          <div className="space-y-4">
            <h5 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Academic Badges</h5>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Helper score</div>
                <div className="text-2xl font-black text-white mt-1">310 <span className="text-xs text-zinc-500">pts</span></div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Posts Rank</div>
                <div className="text-2xl font-black text-white mt-1">#4 <span className="text-xs text-zinc-500">buddy</span></div>
=======
      {/* Floating Save/Alert Banner */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white font-bold text-sm px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-blue-500/30"
          >
            <Check className="w-4 h-4" />
            <span>{alertMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Main Container - Borderless Seamless Layout */}
      <div className="space-y-8">
        
        {/* Interactive Profile Header Area */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-white/[0.05]">
          
          {/* Avatar Container */}
          <div className="relative group cursor-pointer animate-pulse-slow" onClick={handleRandomizeAvatar} title="Click to randomize your avatar!">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 bg-zinc-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xl shadow-black/50">
              <img 
                src={avatarSeed === 'real-photo' ? 'https://www.image2url.com/r2/default/images/1779863184214-810fc126-789a-442f-831b-06cda160f159.jpeg' : `https://www.image2url.com/r2/default/images/1779863184214-810fc126-789a-442f-831b-06cda160f159.jpeg`} 
                alt="Profile Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-500 p-2 rounded-full border border-zinc-950 shadow-md text-white transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* User Details Form & Display */}
          <div className="flex-1 w-full space-y-4">
            
            {/* User Name input/text */}
            <div className="space-y-1">
              <input 
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  localStorage.setItem('profile-name', e.target.value);
                }}
                placeholder="Enter Your Name"
                className="bg-transparent border-b border-transparent hover:border-white/10 focus:border-blue-500 hover:bg-white/[0.02] focus:bg-white/[0.04] px-2 py-1 rounded text-2xl font-black text-white w-full max-w-md focus:outline-none transition-all"
              />
              <div className="flex items-center gap-2 px-2 pt-0.5">
                <span className="text-[10px] font-bold text-white tracking-wider uppercase">Student ID</span>
                <span className="text-xs font-mono font-bold text-white">
                  252FC253TM
                </span>
              </div>
            </div>

            {/* Location Line */}
            <div className="flex items-center gap-2 px-2 text-left">
              <MapPin className="w-4 h-4 text-zinc-400" />
              <span className="text-sm text-white font-medium">MMU Cyberjaya Campus</span>
            </div>

          </div>
        </div>

        {/* Profile Statistics */}
        <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/10 rounded-2xl p-4 transition-all text-left">
          {/* Saved Stat */}
          <div>
            <p className="text-[11px] font-bold text-zinc-500 tracking-wider uppercase">Saved</p>
            <h4 className="text-2xl font-black text-white">{likesReceived}</h4>
          </div>
        </div>

        {/* My Posts Activity Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-400" />
              <h3 className="text-sm font-bold tracking-wider uppercase text-zinc-300">My Post</h3>
            </div>
          </div>

          {/* Quick Post Creator Modal (replaced with CreatePostPage) */}
          <AnimatePresence>
            {showPostModal && (
              <CreatePostPage
                subjects={PROFILE_SUBJECTS.filter(s => s.id !== 'all').map(s => ({ id: s.id, name: s.name, chapters: ['General'] }))}
                onBack={() => setShowPostModal(false)}
                onPublish={(postData) => {
                  const newPost = {
                    id: `user-post-${Date.now()}`,
                    content: postData.content || postData.title || '',
                    timestamp: 'Just now',
                    likes: 0,
                    replies: 0,
                    image: postData.image,
                    subject: postData.subject,
                  };
                  const updated = [newPost, ...myPosts];
                  setMyPosts(updated);
                  localStorage.setItem('profile-my-posts', JSON.stringify(updated));
                  setShowPostModal(false);
                  setAlertMessage('Posted successfully! Check your Discussion Feed.');
                  setTimeout(() => setAlertMessage(null), 3000);
                }}
              />
            )}
          </AnimatePresence>

          {/* Posts Feed or Placeholder */}
          <div className="space-y-3 min-h-[120px] flex flex-col justify-center">
            {myPosts.length === 0 ? (
              <div className="text-zinc-600 py-8 text-center text-sm font-semibold pointer-events-none">
                No posts published yet.
              </div>
            ) : (
              <div className="space-y-3">
                {myPosts.map((p) => (
                  <motion.div 
                    key={p.id}
                    layoutId={p.id}
                    className="p-4 bg-white/[0.02] border border-white/[0.05] hover:border-white/10 rounded-2xl flex flex-col gap-3 group/post"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">{p.timestamp}</span>
                        {p.subject && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/5 border border-white/10 text-zinc-400">
                            {p.subject}
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleDeletePost(p.id)}
                        className="opacity-0 group-hover/post:opacity-100 text-xs font-bold text-rose-500 hover:text-rose-400 px-2 py-1 rounded transition-opacity"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-[13px] font-semibold text-zinc-300 leading-relaxed text-left">
                      {p.content}
                    </p>
                    {p.image && (
                      <div className="rounded-xl overflow-hidden border border-white/5 max-h-40 bg-zinc-950/40 mt-1">
                        <img 
                          src={p.image} 
                          alt="Post photo" 
                          className="w-full h-full object-cover max-h-40"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-6 pt-2 border-t border-white/[0.03]">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <TriangleIcon className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{p.likes} Upvoted</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <MessageCircle className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{p.replies} Replies</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
>>>>>>> 331adfb541e95bad51a4d491b94bba295b70eae6
              </div>
            </div>

            {/* List Details */}
            <div className="space-y-3.5 pt-4">
              <div className="flex items-center gap-3.5 text-sm">
                <Mail className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-300">LIOU.ZI.EN@student.mmu.edu.my</span>
              </div>
              <div className="flex items-center gap-3.5 text-sm">
                <BookOpen className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-300">Foundation in Computing (FCI)</span>
              </div>
              <div className="flex items-center gap-3.5 text-sm">
                <Clock className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-300">Joined MMU Semester 3, 2026</span>
              </div>
              <div className="flex items-center gap-3.5 text-sm">
                
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
          
          <div className="text-center text-[10px] text-zinc-600 font-mono uppercase tracking-wider">
            StudyBuddy MMU - Mini IT Project | 2026 &copy; All rights reserved.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
