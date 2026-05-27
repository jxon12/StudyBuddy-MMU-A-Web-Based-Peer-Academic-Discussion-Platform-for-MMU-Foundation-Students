import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Camera, 
  MapPin, 
  Bookmark, 
  Heart, 
  Save, 
  LogOut, 
  ChevronDown, 
  Check,
  Plus,
  MessageCircle,
  FileText
} from 'lucide-react';

interface ProfileProps {
  onBack: () => void;
  onSignOut?: () => void;
}


const LOCATIONS = [
  'Detecting...',
  'MMU Cyberjaya Campus',
  'MMU Melaka Campus',
];

export function ProfilePage({ onBack, onSignOut }: ProfileProps) {
  // --- Persistent Profile State ---
  const [name, setName] = useState(() => {
    return localStorage.getItem('profile-name') || 'Ling Yi Yon';
  });
  
  const [location, setLocation] = useState(() => {
    return localStorage.getItem('profile-location') || 'Detecting...';
  });

  const [avatarSeed, setAvatarSeed] = useState(() => {
    return localStorage.getItem('profile-avatar-seed') || 'Me';
  });

  const [bookmarksCount, setBookmarksCount] = useState(() => {
    const saved = localStorage.getItem('profile-bookmarks-count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [likesReceived, setLikesReceived] = useState(() => {
    const saved = localStorage.getItem('profile-likes-count');
    return saved ? parseInt(saved, 10) : 0;
  });

  // --- Dynamic dropdown menus UI ---
  const [activeDropdown, setActiveDropdown] = useState<'location' | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // --- Mock posts created by this profile ---
  const [myPosts, setMyPosts] = useState<Array<{id: string, content: string, timestamp: string, likes: number, replies: number}>>(() => {
    const saved = localStorage.getItem('profile-my-posts');
    return saved ? JSON.parse(saved) : [];
  });
  const [newPostText, setNewPostText] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);

  // Auto-detect location simulator on component mount if set to Detecting...
  useEffect(() => {
    if (location === 'Detecting...') {
      const timer = setTimeout(() => {
        const randomLoc = LOCATIONS[Math.floor(Math.random() * (LOCATIONS.length - 1)) + 1];
        setLocation(randomLoc);
        localStorage.setItem('profile-location', randomLoc);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [location]);

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

  // Create a new post from the profile
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: `user-post-${Date.now()}`,
      content: newPostText.trim(),
      timestamp: 'Just now',
      likes: 0,
      replies: 0
    };

    const updated = [newPost, ...myPosts];
    setMyPosts(updated);
    localStorage.setItem('profile-my-posts', JSON.stringify(updated));
    setNewPostText('');
    setShowPostModal(false);

    // Increment likes received or simply notify
    setAlertMessage('Posted successfully! Check your Discussion Feed.');
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
    const randomSeeds = ['Lucky', 'Spooky', 'Snuggles', 'Tiger', 'Cookie', 'Precious', 'Willow', 'Buster', 'Milo', 'Cody', 'Me', 'StudyTime', 'MMUStar'];
    const currentIdx = randomSeeds.indexOf(avatarSeed);
    let nextIdx = Math.floor(Math.random() * randomSeeds.length);
    if (nextIdx === currentIdx) {
      nextIdx = (nextIdx + 1) % randomSeeds.length;
    }
    setAvatarSeed(randomSeeds[nextIdx]);
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

      {/* Profile Main Container Card */}
      <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-[32px] border border-white/[0.08] shadow-2xl p-6 md:p-8 space-y-8">
        
        {/* Interactive Profile Header Area */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-white/[0.05]">
          
          {/* Avatar Container */}
          <div className="relative group cursor-pointer" onClick={handleRandomizeAvatar}>
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-zinc-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} 
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
                <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Student ID</span>
                <span className="text-xs font-mono font-bold text-zinc-400">
                  252FC253TM
                </span>
              </div>
            </div>

            {/* Location Line */}
            <div className="relative flex items-center gap-2">
              <MapPin className="w-4 h-4 text-zinc-500" />
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white font-medium hover:bg-white/5 px-2.5 py-1.5 rounded-lg transition-colors border border-transparent hover:border-white/5 text-left"
              >
                <span>{location}</span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              {/* Location Select Dropdown */}
              <AnimatePresence>
                {activeDropdown === 'location' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-10 left-0 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl p-1.5 z-40 w-56 flex flex-col gap-0.5"
                  >
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setLocation(loc);
                          setActiveDropdown(null);
                        }}
                        className={`text-xs font-bold font-sans rounded-lg px-3 py-2 text-left transition-colors flex items-center justify-between ${
                          location === loc ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span>{loc}</span>
                        {location === loc && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>



          </div>
        </div>

        {/* Profile Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Upvoted Stat Card */}
          <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/10 rounded-2xl p-4 flex items-center justify-between transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-600/10 rounded-xl border border-rose-600/20 text-rose-400 group-hover:scale-105 transition-transform">
                <TriangleIcon className="w-5 h-5 text-rose-400" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-zinc-500 tracking-wider uppercase">Upvoted</p>
                <h4 className="text-2xl font-black text-white">{bookmarksCount}</h4>
              </div>
            </div>
          </div>

          {/* Saved Stat Card */}
          <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/10 rounded-2xl p-4 flex items-center justify-between transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-600/20 text-blue-400 group-hover:scale-105 transition-transform">
                <Bookmark className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-zinc-500 tracking-wider uppercase">Saved</p>
                <h4 className="text-2xl font-black text-white">{likesReceived}</h4>
              </div>
            </div>
          </div>

        </div>

        {/* My Posts Activity Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-400" />
              <h3 className="text-sm font-bold tracking-wider uppercase text-zinc-300">My Post</h3>
            </div>
            <button 
              onClick={() => setShowPostModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write Post</span>
            </button>
          </div>

          {/* Quick Post Creator Modal */}
          <AnimatePresence>
            {showPostModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 25 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 25 }}
                  className="bg-zinc-900 border border-white/10 p-6 rounded-[24px] max-w-lg w-full space-y-4 shadow-2xl"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Create a student post</h3>
                    <button 
                      onClick={() => setShowPostModal(false)}
                      className="text-zinc-500 hover:text-white font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <textarea
                      required
                      placeholder="What is your question or thought? (e.g., Struggling with spherical coordinates...)"
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      rows={5}
                      className="w-full bg-zinc-950/80 border border-white/10 rounded-xl p-4 text-[13px] font-semibold text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                      >
                        Publish Post
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Posts Feed or Placeholder */}
          <div className="space-y-3 min-h-[120px] flex flex-col justify-center">
            {myPosts.length === 0 ? (
              <div className="text-zinc-600 py-8 text-center text-sm font-semibold pointer-events-none">
                No posts yet.
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

