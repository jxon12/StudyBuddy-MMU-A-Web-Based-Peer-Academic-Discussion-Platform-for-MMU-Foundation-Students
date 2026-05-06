import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  MessageCircle, 
  Search, 
  Plus, 
  Bell,
  CheckCircle2,
  MoreHorizontal,
  ArrowLeft,
  Triangle,
  Star
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- Types ---

interface Post {
  id: string;
  author: string;
  avatar: string;
  subject: string;
  chapter: string;
  content: string;
  likes: number;
  replies: number;
  timestamp: string;
  isVerified?: boolean;
}

// --- Mock Data ---

const SUBJECTS = [
  { id: 'math', name: 'Mathematics', color: 'bg-blue-500', cover: 'https://images.unsplash.com/photo-1509228468518-180dd482180c?auto=format&fit=crop&q=80&w=600', chapters: ['Calculus', 'Linear Algebra', 'Statistics'] },
  { id: 'prog', name: 'Programming', color: 'bg-zinc-800', cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600', chapters: ['Python Basics', 'Control Structures', 'Data Structures'] },
  { id: 'phys', name: 'Physics', color: 'bg-purple-500', cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600', chapters: ['Mechanics', 'Thermodynamics', 'Electricity'] },
  { id: 'biz', name: 'Business', color: 'bg-green-500', cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600', chapters: ['Economics', 'Management', 'Marketing'] },
  { id: 'crit', name: 'Critical Thinking', color: 'bg-orange-500', cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600', chapters: ['Logic', 'Arguments', 'Fallacies'] },
  { id: 'eng', name: 'English', color: 'bg-pink-500', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600', chapters: ['Literature', 'Grammar', 'Composition'] },
  { id: 'hist', name: 'Multimedia Fundamental', color: 'bg-yellow-600', cover: 'https://images.unsplash.com/photo-1461360228754-6e81c478c882?auto=format&fit=crop&q=80&w=600', chapters: ['Ancient Civilizations', 'Modern Era', 'World Wars'] },
];

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'Ahmad Faiz',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
    subject: 'Programming',
    chapter: 'Data Structures',
    content: 'Does anyone have a clear explanation for the difference between a List and a Tuple in Python for MMU Chapter 5? Visual aids would be great!',
    likes: 42,
    replies: 12,
    timestamp: '2h ago',
    isVerified: true
  },
  {
    id: '2',
    author: 'Lim Wei Ming',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lim',
    subject: 'Mathematics',
    chapter: 'Calculus',
    content: 'Solving the differentiation task for Quiz 3. Remember to apply the chain rule correctly! Check out my derivation below.',
    likes: 85,
    replies: 8,
    timestamp: '5h ago'
  },
  {
    id: '3',
    author: 'Sarah Jenkins',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    subject: 'Business',
    chapter: 'Economics',
    content: 'Confused about the Law of Diminishing Returns. My lecture notes are a bit vague. Anyone willing to jump on a study call?',
    likes: 15,
    replies: 24,
    timestamp: '1d ago'
  },
  {
    id: '4',
    author: 'Michael Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    subject: 'Physics',
    chapter: 'Mechanics',
    content: 'Need help understanding Newton\'s Third Law. Can someone explain how action-reaction pairs work in real-world scenarios?',
    likes: 28,
    replies: 15,
    timestamp: '4h ago',
    isVerified: true
  },
  {
    id: '5',
    author: 'Priya Sharma',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    subject: 'Critical',
    chapter: 'Logic',
    content: 'Just completed the critical thinking module assignment. Happy to share my approach if anyone wants to compare notes!',
    likes: 52,
    replies: 9,
    timestamp: '3h ago'
  },
];

// --- Components ---

const Navbar = ({ onPostClick, onSubjectsClick, currentView }: { 
  onPostClick?: () => void; 
  onSubjectsClick?: () => void;
  currentView: 'feed' | 'subjects';
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <>
      {/* Search Bar - Moved Down */}
      <div className="relative left-0 right-0 z-50 flex items-center justify-center px-4 pointer-events-none pt-24 pb-8">
        <div className={`pointer-events-auto glass border border-black/[0.03] rounded-full px-4 py-2.5 shadow-sm flex items-center gap-3 transition-all duration-500 ease-in-out ${isSearchFocused ? 'w-[600px]' : 'w-[500px]'}`}>
          <Search className={`w-4 h-4 transition-colors ${isSearchFocused ? 'text-zinc-900' : 'text-zinc-400'}`} />
          <input 
            type="text" 
            placeholder="Search..." 
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="bg-transparent border-none text-[13px] font-semibold focus:outline-none w-full placeholder:text-zinc-300"
          />
        </div>
      </div>

      {/* Left Sidebar Navigation - Vertical Column Grid */}
      <div className="fixed left-6 top-20 z-50 flex flex-col gap-3 pointer-events-none w-20">
        {/* Subjects Button */}
        <button 
          id="nav-subjects"
          onClick={onSubjectsClick}
          className={`pointer-events-auto glass border border-black/[0.03] rounded-lg px-3 py-3 shadow-sm flex flex-col items-center justify-center gap-1.5 transition-all group h-20 ${
            currentView === 'subjects' ? 'bg-zinc-900 text-white border-zinc-800' : 'hover:bg-white'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${currentView === 'subjects' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-900'} transition-colors`} />
          <span className={`text-[11px] font-bold text-center ${currentView === 'subjects' ? 'text-white' : 'text-zinc-900'}`}>Subjects</span>
        </button>

        {/* Post Button */}
        <button 
          id="nav-post"
          onClick={onPostClick}
          className="pointer-events-auto bg-zinc-900 text-white rounded-lg px-3 py-3 shadow-md flex flex-col items-center justify-center gap-1.5 hover:bg-zinc-800 transition-all active:scale-95 group h-20"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span className="text-[11px] font-bold text-center">Post</span>
        </button>

        {/* Notifications Button */}
        <button id="nav-notifications" className="pointer-events-auto glass border border-black/[0.03] rounded-lg px-3 py-3 shadow-sm group relative hover:bg-white transition-all flex flex-col items-center justify-center gap-1.5 h-20">
          <Bell className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900 transition-colors" />
          <span className="text-[11px] font-bold text-zinc-900 text-center">Notify</span>
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full border border-white" />
        </button>
      </div>
    </>
  );
};

interface PostCardProps {
  post: Post;
  key?: string;
}

const PostCard = ({ post }: PostCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="bg-white/80 backdrop-blur-md p-7 rounded-[32px] border border-black/[0.05] mb-6 hover:shadow-xl hover:border-black/[0.1] transition-all cursor-default group"
  >
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-4">
        <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full border border-black/5" referrerPolicy="no-referrer" />
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="text-[15px] font-bold text-zinc-900 tracking-tight">{post.author}</h4>
            {post.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />}
          </div>
          <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-wider">{post.timestamp}</p>
        </div>
      </div>
      <button className="p-2.5 hover:bg-zinc-50 rounded-full transition-colors">
        <MoreHorizontal className="w-4 h-4 text-zinc-300" />
      </button>
    </div>

    <div className="mb-6">
      <div className="flex gap-2 mb-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50/50 px-3 py-1.5 rounded-full">
          {post.subject}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 px-3 py-1.5 rounded-full border border-black/[0.01]">
          Chapter {post.chapter}
        </span>
      </div>
      <p className="text-[17px] text-zinc-800 leading-relaxed font-medium">
        {post.content}
      </p>
    </div>

    <div className="flex items-center gap-8 pt-6 border-t border-black/[0.01]">
      <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors group">
        <Triangle className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="text-[14px] font-bold">{post.likes} Upvoted</span>
      </button>
      <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors group">
        <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="text-[14px] font-bold">{post.replies} Replies</span>
      </button>
      <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors group">
        <Star className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="text-[14px] font-bold">Save</span>
      </button>
    </div>
  </motion.div>
);

// --- New Subjects Page Component ---

interface SubjectsPageProps {
  onBack: () => void;
  onSelectSubject: (id: string) => void;
  key?: string;
}

const SubjectsPage = ({ onBack, onSelectSubject }: SubjectsPageProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Smooth horizontal scroll with mouse wheel
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 3,
          behavior: 'smooth'
        });
      };
      el.addEventListener('wheel', onWheel);
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#f8f8f8] z-[60] flex flex-col items-center justify-center overflow-hidden"
    >
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-90 z-50 group border border-black/5"
      >
        <ArrowLeft className="w-6 h-6 text-zinc-500 group-hover:text-zinc-900 transition-colors" />
      </button>

      <div className="text-center mb-16 relative">
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-medium text-zinc-400"
        >
          Explore More About MMU Subjects
        </motion.p>
      </div>

      <div 
        ref={scrollRef}
        className="w-full h-[600px] flex items-center gap-0 overflow-x-auto no-scrollbar px-[20vw] cursor-grab active:cursor-grabbing pb-20"
        style={{ scrollSnapType: 'x proximity' }}
      >
        {SUBJECTS.map((subject, index) => {
          // Calculate rotation and position for fanned-out look
          const rotation = (index - (SUBJECTS.length - 1) / 2) * 8;
          const isHovered = hoveredId === subject.id;

          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 50, rotate: rotation }}
              animate={{ 
                opacity: 1, 
                y: isHovered ? -40 : 0, 
                rotate: isHovered ? 0 : rotation,
                scale: isHovered ? 1.1 : 1,
                zIndex: isHovered ? 100 : index 
              }}
              onMouseEnter={() => setHoveredId(subject.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectSubject(subject.id)}
              className="relative flex-shrink-0 w-[240px] h-[360px] -ml-[100px] first:ml-0 transition-all duration-300 ease-out"
              style={{ perspective: '1000px' }}
            >
              {/* Book Shadow */}
              <div className="absolute inset-x-8 -bottom-10 h-8 bg-black/10 rounded-full blur-2xl" />

              {/* Book Cover */}
              <div 
                className={`w-full h-full rounded-[24px] overflow-hidden shadow-2xl relative border-l-8 border-black/10 transition-all ${subject.color}`}
              >
                <img 
                  src={subject.cover} 
                  alt={subject.name} 
                  className="w-full h-full object-cover mix-blend-overlay opacity-60" 
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div>
                    <h3 className="text-2xl font-bold leading-none tracking-tight">
                      {subject.name}
                    </h3>
                  </div>
                </div>

                {/* Aesthetic Detail Lines */}
                <div className="absolute inset-y-0 left-0 w-2 bg-white/10" />
                <div className="absolute right-4 bottom-4 w-8 h-8 bg-white/20 rounded-full blur-xl" />
              </div>

              {/* Reveal Text on Hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -bottom-16 left-0 right-0 text-center pointer-events-none"
                  >
                    <span className="text-[14px] font-black uppercase tracking-[0.3em] text-zinc-900">
                      {subject.name}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Background Graphic */}
      <h2 className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[15vw] font-black text-black/[0.02] pointer-events-none whitespace-nowrap select-none">
        SUBJECTS
      </h2>
    </motion.div>
  );
};

export default function App() {
  const [view, setView] = useState<'feed' | 'subjects'>('feed');
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const activeSubjectData = activeSubject ? SUBJECTS.find(s => s.id === activeSubject) : null;

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-zinc-200 overflow-x-hidden">
      
      <Navbar 
        currentView={view}
        onSubjectsClick={() => setView('subjects')} 
      />

      <AnimatePresence mode="wait">
        {view === 'feed' ? (
          <motion.main 
            key="feed"
            initial={{ opacity: 0, x: -60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="pt-20 pb-48 px-6 max-w-2xl mx-auto relative z-10"
          >
            {/* Feed Heading */}
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {activeSubjectData && (
                  <button 
                    onClick={() => setActiveSubject(null)}
                    className="p-3 rounded-full hover:bg-zinc-100 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-zinc-600 hover:text-zinc-900" />
                  </button>
                )}
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
                    {activeSubjectData ? `${activeSubjectData.name} Hub` : 'Discover Discussions'}
                  </h2>
                  <p className="text-zinc-400 font-medium">{activeSubjectData ? 'Recently shared chapters and discussions' : 'Explore posts from different subjects'}</p>
                </div>
              </div>
            </div>
            
            {/* Discussion Feed */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {MOCK_POSTS
                  .filter(p => {
                    if (!activeSubjectData) return true; // Show all posts if no subject selected
                    const postSubject = p.subject.toLowerCase();
                    const activeSubjectLabel = activeSubjectData.name.toLowerCase();
                    return postSubject.includes(activeSubjectLabel) || activeSubjectLabel.includes(postSubject);
                  })
                  .map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </AnimatePresence>
            </div>
          </motion.main>
        ) : (
          <SubjectsPage 
            key="subjects"
            onBack={() => { 
              setActiveSubject(null);
              setView('feed');
            }} 
            onSelectSubject={(id) => {
              setActiveSubject(id);
              setView('feed');
            }}
          />
        )}
      </AnimatePresence>

      {/* Global CSS for hiding scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Ambient Background Elements */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,102,204,0.04)_0%,transparent_70%)]" />

    </div>
  );
}
