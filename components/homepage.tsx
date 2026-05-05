import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  MessageCircle, 
  Search, 
  TrendingUp, 
  Plus, 
  ThumbsUp,
  Bell,
  CheckCircle2,
  MoreHorizontal
} from 'lucide-react';
import { useState } from 'react';

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
  { id: 'math', name: 'Mathematics', icon: 'Σ', color: 'bg-blue-500', chapters: ['Calculus', 'Linear Algebra', 'Statistics'] },
  { id: 'prog', name: 'Programming', icon: '⌨️', color: 'bg-zinc-800', chapters: ['Python Basics', 'Control Structures', 'Data Structures'] },
  { id: 'phys', name: 'Physics', icon: '⚛️', color: 'bg-purple-500', chapters: ['Mechanics', 'Thermodynamics', 'Electricity'] },
  { id: 'biz', name: 'Business', icon: '📈', color: 'bg-green-500', chapters: ['Economics', 'Management', 'Marketing'] },
  { id: 'crit', name: 'Critical', icon: '💡', color: 'bg-orange-500', chapters: ['Logic', 'Arguments', 'Fallacies'] },
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
  }
];

// --- Components ---

const Navbar = ({ onPostClick }: { onPostClick?: () => void }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="fixed top-8 left-0 right-0 z-50 flex items-center justify-center gap-3 px-4 pointer-events-none sm:scale-100 scale-90 origin-top">
      {/* Search Pill */}
      <div className={`pointer-events-auto glass border border-black/[0.03] rounded-full px-4 py-2.5 shadow-sm flex items-center gap-3 transition-all duration-500 ease-in-out ${isSearchFocused ? 'w-[450px]' : 'w-[280px]'}`}>
        <Search className={`w-4 h-4 transition-colors ${isSearchFocused ? 'text-zinc-900' : 'text-zinc-400'}`} />
        <input 
          type="text" 
          placeholder="Search..." 
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className="bg-transparent border-none text-[13px] font-semibold focus:outline-none w-full placeholder:text-zinc-300"
        />
      </div>

      {/* Subjects Pill */}
      <button className="pointer-events-auto glass border border-black/[0.03] rounded-full px-5 py-2.5 shadow-sm flex items-center gap-2 hover:bg-white transition-all group">
        <BookOpen className="w-4 h-4 text-zinc-500 group-hover:text-zinc-900 transition-colors" />
        <span className="text-[13px] font-bold text-zinc-900">Subjects</span>
      </button>

      {/* Post Action Pill */}
      <button 
        onClick={onPostClick}
        className="pointer-events-auto bg-zinc-900 text-white rounded-full px-6 py-2.5 shadow-md flex items-center gap-2 hover:bg-zinc-800 transition-all active:scale-95 group"
      >
        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
        <span className="text-[13px] font-bold">Post</span>
      </button>

      {/* Notifications Pill */}
      <button className="pointer-events-auto glass border border-black/[0.03] rounded-full p-3 shadow-sm group relative hover:bg-white transition-all">
        <Bell className="w-4 h-4 text-zinc-500 group-hover:text-zinc-900 transition-colors" />
        <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full border border-white" />
      </button>

      {/* Profile Pill */}
      <button className="pointer-events-auto glass border border-black/[0.03] rounded-full pl-2 pr-5 py-1.5 shadow-sm flex items-center gap-2.5 group hover:bg-white transition-all">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user8" alt="Profile" />
        </div>
        <span className="text-[13px] font-bold text-zinc-900 hidden sm:block">Felix</span>
      </button>
    </div>
  );
};

const SubjectDock = ({ activeSubject, onSelectSubject }: { activeSubject: string, onSelectSubject: (id: string) => void }) => {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 glass border border-black/5 rounded-[32px] p-2 shadow-2xl flex items-center gap-2">
      {SUBJECTS.map((subject) => {
        const isActive = activeSubject === subject.id;
        return (
          <div key={subject.id} className="relative group">
            {/* Tooltip Label */}
            <motion.div 
               initial={{ opacity: 0, y: 10, scale: 0.8 }}
               whileHover={{ opacity: 1, y: -45, scale: 1 }}
               className="absolute left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-900 text-white rounded-xl text-[12px] font-bold pointer-events-none shadow-lg flex flex-col items-center"
            >
              {subject.name}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 rotate-45 rounded-sm" />
            </motion.div>

            <button
              onClick={() => onSelectSubject(subject.id)}
              className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-300 ${
                isActive 
                  ? 'bg-zinc-900 shadow-xl' 
                  : 'bg-white/50 hover:bg-white group-hover:-translate-y-2'
              }`}
            >
              <span className={`text-[20px] ${isActive ? 'grayscale-0' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'} transition-all`}>
                {subject.icon}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

const PostCard = ({ post }: { post: Post }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="bg-white p-7 rounded-[32px] border border-black/[0.02] mb-6 hover:shadow-xl hover:border-black/[0.05] transition-all cursor-default group"
  >
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-4">
        <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full border border-black/5" />
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="text-[15px] font-bold text-zinc-900 tracking-tight">{post.author}</h4>
            {post.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />}
          </div>
          <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-wider">{post.subject} • {post.timestamp}</p>
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
        <div className="p-2.5 px-4 rounded-full bg-zinc-50 group-hover:bg-zinc-100 flex items-center gap-2.5 transition-all">
           <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
           <span className="text-[14px] font-bold">{post.likes}</span>
        </div>
      </button>
      <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors group">
        <div className="p-2.5 px-4 rounded-full bg-zinc-50 group-hover:bg-zinc-100 flex items-center gap-2.5 transition-all">
           <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
           <span className="text-[14px] font-bold">{post.replies} Replies</span>
        </div>
      </button>
    </div>
  </motion.div>
);

const UserStats = () => (
  <div className="fixed top-24 right-8 w-64 hidden xl:flex flex-col gap-4">
    <div className="bg-zinc-900 p-7 rounded-[40px] text-white overflow-hidden relative shadow-2xl">
      <div className="relative z-10">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Weekly Ranking</p>
        <h3 className="text-[22px] font-bold mb-5 tracking-tight">Top Contributor</h3>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[17px] font-bold">Level 12</p>
            <p className="text-[11px] text-white/50 font-medium">Next level in 214 XP</p>
          </div>
        </div>
        <button className="w-full bg-white text-zinc-900 py-4 rounded-2xl text-[14px] font-bold hover:bg-zinc-100 active:scale-95 transition-all shadow-lg">
          View Leaderboard
        </button>
      </div>
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500/20 rounded-full blur-[50px]" />
    </div>
  </div>
);

export default function Homepage() {
  const [activeSubject, setActiveSubject] = useState('math');
  const activeSubjectData = SUBJECTS.find(s => s.id === activeSubject);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-zinc-200">
      
      <Navbar />

      <main className="pt-20 pb-48 px-6 max-w-2xl mx-auto relative z-10">
        
        {/* Discussion Feed */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {MOCK_POSTS
              .filter(p => p.subject.toLowerCase() === activeSubjectData?.name.toLowerCase())
              .map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </AnimatePresence>
        </div>

      </main>
      
      <SubjectDock activeSubject={activeSubject} onSelectSubject={setActiveSubject} />

      {/* Ambient Background Elements */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,102,204,0.04)_0%,transparent_70%)]" />
      <div className="fixed inset-0 -z-20 bg-[#fafafa]" />

    </div>
  );
}