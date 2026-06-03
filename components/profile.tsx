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

interface ProfileProps {
  key?: string;
  onBack: () => void;
  onSignOut?: () => void;
}


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
  };

  return (
    <div className="min-h-screen text-zinc-100 font-sans pb-32 pt-28 pl-4 pr-4 md:pl-32 md:pr-12 max-w-4xl mx-auto relative z-10">
      
      {/* Back button and title */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-3 rounded-full transition-colors hover:bg-white/5 border border-white/5 bg-zinc-900/50"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-400 hover:text-white" />
        </button>
      </div>

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
              </div>
            )}
          </div>
        </div>

        {/* Global Action Controls: Save & Sign out */}
        <div className="space-y-3 pt-4">
          <button 
            onClick={handleSave}
            className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-black text-xs py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>

          <button 
            onClick={onSignOut}
            className="w-full bg-zinc-900 hover:bg-red-950/20 border border-white/[0.05] hover:border-red-500/20 text-zinc-500 hover:text-red-500 font-bold text-xs py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>

      </div>
    </div>
  );
}

// Simple Mini Triangle Icon replacement
function TriangleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 20h18L12 4z" />
    </svg>
  );
}
