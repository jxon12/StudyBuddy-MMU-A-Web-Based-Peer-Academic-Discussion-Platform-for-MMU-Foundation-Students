import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  MessageCircle, 
  Plus, 
  Bell,
  CheckCircle2,
  MoreHorizontal,
  ArrowLeft,
  Triangle,
  Star,
  Share2
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
}

// --- Mock Data ---

const SUBJECTS = [
  { id: 'english', name: 'LAE1113 Academic English', color: 'bg-[#AF52DE]', cover: 'https://i.pinimg.com/736x/91/6d/76/916d761e2e8ce1a515ec2234557c38e4.jpg', chapters: ['Writing Skills', 'Academic Reading', 'Presentation'] },
  { id: 'math', name: 'CMT 1134 Mathematics III', color: 'bg-[#5856D6]', cover: 'https://i.pinimg.com/736x/82/66/1e/82661e73c6b7c7f45e316531d4bc895d.jpg', chapters: ['Calculus', 'Linear Algebra', 'Statistics'] },
  { id: 'digital', name: 'CDS1114\nIntro to Digital System', color: 'bg-[#7D7AFF]', cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', chapters: ['Binary Logic', 'Gates', 'Circuit Design'] },
  { id: 'physics', name: 'CPP1113 Principles of Physics', color: 'bg-[#BF5AF2]', cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600', chapters: ['Mechanics', 'Thermodynamics', 'Electricity'] },
  { id: 'critical', name: 'LCT1113 Critical Thinking', color: 'bg-[#3634A3]', cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600', chapters: ['Logic', 'Arguments', 'Fallacies'] },
  { id: 'mini-it', name: 'CSP1123 Mini IT Project', color: 'bg-[#DA8FFF]', cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600', chapters: ['Project Planning', 'Development', 'Documentation'] },
];

const MOCK_POSTS: Post[] = [
  // Shuffled for a more natural feed feel
  {
    id: 'mi1',
    author: 'Brendan Tan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brendan',
    subject: 'CSP1123 Mini IT Project',
    chapter: 'Development',
    content: 'Successfully integrated our database with the frontend! Hardest part of the project so far. Anyone else using Firebase?',
    likes: 78,
    replies: 30,
    timestamp: '2h ago',
  },
  {
    id: 'e1',
    author: 'Nurul Huda',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nurul',
    subject: 'LAE1113 Academic English',
    chapter: 'Academic Reading',
    content: 'Struggling with scanning techniques for academic journals. Does anyone have tips for quickly identifying thesis statements in dense articles?',
    likes: 12,
    replies: 5,
    timestamp: '1h ago',
  },
  {
    id: 'm1',
    author: 'Lim Wei Ming',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lim',
    subject: 'CMT 1134 Mathematics III',
    chapter: 'Calculus',
    content: 'Solving the triple integrals in spherical coordinates. The Jacobian factor is always tricky—don\'t forget it!',
    likes: 45,
    replies: 7,
    timestamp: '2h ago',
  },
  {
    id: 'd1',
    author: 'Ahmad Faiz',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
    subject: 'CDS1114 Intro to Digital System',
    chapter: 'Gates',
    content: 'Can someone explain the universal property of NAND gates? Trying to implement a XOR using only NAND gates for the lab.',
    likes: 28,
    replies: 12,
    timestamp: '3h ago',
  },
  {
    id: 'p1',
    author: 'Michael Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    subject: 'CPP1113 Principles of Physics',
    chapter: 'Mechanics',
    content: 'Need help understanding Newton\'s Third Law in circular motion. How does centripetal force factor in?',
    likes: 38,
    replies: 9,
    timestamp: '4h ago',
  },
  {
    id: 'c1',
    author: 'Priya Sharma',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    subject: 'LCT1113 Critical Thinking',
    chapter: 'Fallacies',
    content: 'Spotted a "Straw Man" argument in a recent news article. It\'s cool being able to identify these in the real world!',
    likes: 64,
    replies: 8,
    timestamp: '10h ago',

  },
  {
    id: 'e2',
    author: 'Daniel Tan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel',
    subject: 'LAE1113 Academic English',
    chapter: 'Writing Skills',
    content: 'Just finished my draft for the persuasive essay. Would anyone like to peer-review each other\'s work before submission tomorrow?',
    likes: 8,
    replies: 14,
    timestamp: '4h ago'
  },
  {
    id: 'm2',
    author: 'Arun Kumar',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arun',
    subject: 'CMT 1134 Mathematics III',
    chapter: 'Statistics',
    content: 'Does anyone have a cheat sheet for probability distributions? Getting confused between Poisson and Binomial for the upcoming quiz.',
    likes: 32,
    replies: 18,
    timestamp: '5h ago'
  },
  {
    id: 'd2',
    author: 'Chloe Ng',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe',
    subject: 'CDS1114 Intro to Digital System',
    chapter: 'Binary Logic',
    content: 'Binary subtraction using 2\'s complement is giving me a headache. Why do we ignore the final carry again?',
    likes: 19,
    replies: 22,
    timestamp: '7h ago'
  },
  {
    id: 'p2',
    author: 'Sarah Jenkins',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    subject: 'CPP1113 Principles of Physics',
    chapter: 'Thermodynamics',
    content: 'Entropy concept is so abstract. How do we relate it to disorder in everyday life examples for our reflection paper?',
    likes: 22,
    replies: 15,
    timestamp: '9h ago'
  },
  {
    id: 'c2',
    author: 'Kevin Wong',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin',
    subject: 'LCT1113 Critical Thinking',
    chapter: 'Arguments',
    content: 'What is the main difference between inductive and deductive reasoning again? My lecture notes seem to overlap them.',
    likes: 31,
    replies: 13,
    timestamp: '12h ago'
  },
  {
    id: 'mi2',
    author: 'Zulkipli Ali',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zul',
    subject: 'CSP1123 Mini IT Project',
    chapter: 'Documentation',
    content: 'The Gantt chart for our project plan is ready. Highly suggest using Trello or Notion for team coordination!',
    likes: 29,
    replies: 11,
    timestamp: '6h ago'
  },
  {
    id: 'e3',
    author: 'Siti Aminah',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
    subject: 'LAE1113 Academic English',
    chapter: 'Presentation',
    content: 'Tips for reducing anxiety during the oral presentation? This is my first time presenting in a large hall at MMU!',
    likes: 25,
    replies: 10,
    timestamp: '6h ago'
  },
  {
    id: 'm3',
    author: 'Jason Low',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason',
    subject: 'CMT 1134 Mathematics III',
    chapter: 'Linear Algebra',
    content: 'Finally understood Eigenvalues! It clicked when I visualized them as scaling factors. Happy to help if someone is struggling.',
    likes: 56,
    replies: 4,
    timestamp: '8h ago'
  },
  {
    id: 'd3',
    author: 'Ravi Teja',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi',
    subject: 'CDS1114 Intro to Digital System',
    chapter: 'Circuit Design',
    content: 'Look at my Karnaugh map simplification for Exercise 4. Did I miss any groupings? The 4x4 grid is huge!',
    likes: 14,
    replies: 6,
    timestamp: '1d ago'
  },
  {
    id: 'p3',
    author: 'Tan Mei Ling',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mei',
    subject: 'CPP1113 Principles of Physics',
    chapter: 'Electricity',
    content: 'Confusion with Kirchhoff\'s Voltage Law when multiple power sources are present. Anyone can check my loop equations?',
    likes: 17,
    replies: 21,
    timestamp: '2d ago'
  },
  {
    id: 'c3',
    author: 'Aisha Razak',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    subject: 'LCT1113 Critical Thinking',
    chapter: 'Logic',
    content: 'Does anyone want to practice syllogisms? I found a website with cool practice sets for our upcoming test.',
    likes: 42,
    replies: 5,
    timestamp: '1d ago'
  },
  {
    id: 'mi3',
    author: 'Emily Watson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    subject: 'CSP1123 Mini IT Project',
    chapter: 'Project Planning',
    content: 'Struggling to define our project scope. We keep adding features! How are you guys managing "Feature Creep"?',
    likes: 45,
    replies: 25,
    timestamp: '1d ago'
  },
  // Adding 2 more for each subject to reach 5
  {
    id: 'e4',
    author: 'James Tan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    subject: 'LAE1113 Academic English',
    chapter: 'Writing Skills',
    content: 'Tips for APA referencing? I always get the indentation and italics wrong for the bibliography section.',
    likes: 15,
    replies: 8,
    timestamp: '2d ago'
  },
  {
    id: 'e5',
    author: 'Liza Wong',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liza',
    subject: 'LAE1113 Academic English',
    chapter: 'Presentation',
    content: 'Anyone want to practice our final presentation together? I have a small classroom booked for tomorrow afternoon.',
    likes: 33,
    replies: 12,
    timestamp: '3d ago'
  },
  {
    id: 'm4',
    author: 'Rajesh G.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    subject: 'CMT 1134 Mathematics III',
    chapter: 'Statistics',
    content: 'Normal distribution table vs calculator—which one is faster for the exam? I find the table more reliable but slow.',
    likes: 21,
    replies: 15,
    timestamp: '15h ago'
  },
  {
    id: 'm5',
    author: 'Su Lin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sulin',
    subject: 'CMT 1134 Mathematics III',
    chapter: 'Linear Algebra',
    content: 'Vector space axioms are confusing. How many do we actually need to prove in a standard test environment?',
    likes: 19,
    replies: 6,
    timestamp: '1d ago'
  },
  {
    id: 'd4',
    author: 'Taufiq H.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taufiq',
    subject: 'CDS1114 Intro to Digital System',
    chapter: 'Circuit Design',
    content: 'Difference between Mealy and Moore machines? My state diagram keeps looking like a tangled mess. Help!',
    likes: 37,
    replies: 11,
    timestamp: '5h ago'
  },
  {
    id: 'd5',
    author: 'Ying Yue',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ying',
    subject: 'CDS1114 Intro to Digital System',
    chapter: 'Binary Logic',
    content: 'Floating point representation (IEEE 754) is coming out for the quiz. Make sure you know the exponent bias!',
    likes: 24,
    replies: 9,
    timestamp: '2d ago'
  },
  {
    id: 'p4',
    author: 'Vikram S.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    subject: 'CPP1113 Principles of Physics',
    chapter: 'Mechanics',
    content: 'Projectile motion at an angle. Is the vertical velocity always zero at the peak height? My calculations say yes.',
    likes: 29,
    replies: 4,
    timestamp: '10h ago'
  },
  {
    id: 'p5',
    author: 'Hana Z.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hana',
    subject: 'CPP1113 Principles of Physics',
    chapter: 'Thermodynamics',
    content: 'Heat engines and efficiency. Why is 100% efficiency impossible? Carnot cycle explained simply please.',
    likes: 41,
    replies: 18,
    timestamp: '1d ago'
  },
  {
    id: 'c4',
    author: 'Ivan K.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
    subject: 'LCT1113 Critical Thinking',
    chapter: 'Logic',
    content: 'Truth tables with 3 variables (p, q, r). 8 rows is a lot of manual work. Any shortcuts for the final exam?',
    likes: 18,
    replies: 22,
    timestamp: '14h ago'
  },
  {
    id: 'c5',
    author: 'Bella M.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
    subject: 'LCT1113 Critical Thinking',
    chapter: 'Arguments',
    content: 'Recognizing implicit premises. This is the hardest part of argument mapping for me. Any good examples?',
    likes: 26,
    replies: 5,
    timestamp: '2d ago'
  },
  {
    id: 'mi4',
    author: 'Chris L.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
    subject: 'CSP1123 Mini IT Project',
    chapter: 'Documentation',
    content: 'How detailed should the User Manual be? Do we need screenshots for every single button or just main flows?',
    likes: 31,
    replies: 9,
    timestamp: '1d ago'
  },
  {
    id: 'mi5',
    author: 'Maya N.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    subject: 'CSP1123 Mini IT Project',
    chapter: 'Development',
    content: 'GitHub merge conflicts are the worst during final submission week. Team, please pull before you push!',
    likes: 85,
    replies: 14,
    timestamp: '2d ago',
  },
];

// --- Components ---

const Navbar = ({ onPostClick, onSubjectsClick, currentView }: { 
  onPostClick?: () => void; 
  onSubjectsClick?: () => void;
  currentView: 'feed' | 'subjects';
}) => {
  // Hide navbar when viewing subjects
  if (currentView === 'subjects') {
    return null;
  }

  return (
    <>
      {/* Vertical Sidebar (Left) */}
      <div className="fixed top-0 left-0 bottom-0 w-24 z-50 bg-transparent flex flex-col items-center pt-48 gap-10">
        
        {/* Nav Items */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={onSubjectsClick}
            className={`p-3 rounded-2xl border transition-all group relative ${
              currentView === 'subjects' 
                ? 'bg-zinc-100 text-zinc-950 border-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                : 'bg-transparent border-transparent text-zinc-500 hover:bg-white/[0.05]'
            }`}
          >
            <BookOpen className="w-6 h-6" />
            <div className="absolute left-[calc(100%+12px)] px-2.5 py-1.5 bg-zinc-100 text-zinc-950 text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Subjects
            </div>
          </button>

          <button 
             onClick={onPostClick}
             className="bg-white text-zinc-950 p-3 rounded-2xl shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all active:scale-95 group relative"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            <div className="absolute left-[calc(100%+12px)] px-2.5 py-1.5 bg-zinc-100 text-zinc-950 text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Post
            </div>
          </button>

          <button className="p-3 rounded-2xl border border-transparent text-zinc-500 hover:bg-white/[0.05] transition-all group relative">
            <Bell className="w-6 h-6" />
            <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full border-2 border-zinc-950" />
            <div className="absolute left-[calc(100%+12px)] px-2.5 py-1.5 bg-zinc-100 text-zinc-950 text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Notifications
            </div>
          </button>
        </div>

      </div>
    </>
  );
};


const getSubjectTagStyles = (subjectName: string) => {
  const name = subjectName.toLowerCase();
  
  if (name.includes('lae1113') || name.includes('english')) {
    return "text-purple-400 bg-purple-400/10 border border-purple-400/20";
  }
  if (name.includes('cmt 1134') || name.includes('mathematics')) {
    return "text-blue-400 bg-blue-400/10 border border-blue-400/20";
  }
  if (name.includes('cds1114') || name.includes('digital')) {
    return "text-indigo-400 bg-indigo-400/10 border border-indigo-400/20";
  }
  if (name.includes('cpp1113') || name.includes('physics')) {
    return "text-violet-400 bg-violet-400/10 border border-violet-400/20";
  }
  if (name.includes('lct1113') || name.includes('critical')) {
    return "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20";
  }
  if (name.includes('csp1123') || name.includes('mini it')) {
    return "text-rose-400 bg-rose-400/10 border border-rose-400/20";
  }
  
  return "text-zinc-500 bg-white/5 border border-white/10";
};

interface PostCardProps {
  post: Post;
  key?: string;
}

const PostCard = ({ post }: PostCardProps) => {
  const [upvoted, setUpvoted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [showMenu, setShowMenu] = useState(false);
  const [shared, setShared] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleUpvote = () => {
    if (upvoted) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setUpvoted(!upvoted);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShared(true);
    setTimeout(() => {
      setShared(false);
      setShowMenu(false);
    }, 2000);
  };

  const subjectTagStyles = getSubjectTagStyles(post.subject);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white/[0.03] backdrop-blur-2xl p-7 rounded-[32px] border border-white/[0.08] mb-6 hover:shadow-2xl hover:border-white/[0.15] transition-all cursor-default group relative"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full border border-white/10" referrerPolicy="no-referrer" />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-[15px] font-bold text-white tracking-tight">{post.author}</h4>
              {post.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/10" />}
            </div>
            <p className="text-[12px] text-zinc-500 font-bold uppercase tracking-wider">{post.timestamp}</p>
          </div>
        </div>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2.5 rounded-full transition-colors ${showMenu ? 'bg-white/10' : 'hover:bg-white/5'}`}
          >
            <MoreHorizontal className="w-4 h-4 text-zinc-500" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/[0.08] p-2 z-50 origin-top-right overflow-hidden"
              >
                <button 
                  onClick={handleShare}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-all text-left group/item"
                >
                  {shared ? (
                    <div className="flex items-center gap-2 text-green-400 w-full">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[13px] font-bold">Link Copied!</span>
                    </div>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-zinc-400 group-hover/item:text-white transition-colors" />
                      <span className="text-[13px] font-bold text-zinc-400 group-hover/item:text-white transition-colors">Share Post</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 mb-5">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${subjectTagStyles}`}>
            {post.subject.match(/^[A-Z]{2,4}\s?\d{4}/)?.[0] || post.subject}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-white/[0.05] px-3 py-1.5 rounded-full border border-white/[0.02]">
            Chapter {post.chapter}
          </span>
        </div>
        <p className="text-[17px] text-zinc-200 leading-relaxed font-medium">
          {post.content}
        </p>
      </div>

      <div className="flex items-center gap-8 pt-6 border-t border-white/[0.05]">
        <button 
          onClick={toggleUpvote}
          className={`flex items-center gap-2 transition-colors group ${upvoted ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
        >
          <Triangle className={`w-4 h-4 transition-all ${upvoted ? 'text-white fill-white' : 'group-hover:scale-110'}`} />
          <span className="text-[14px] font-bold">{likes} Upvoted</span>
        </button>
        <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
          <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-[14px] font-bold">{post.replies} Replies</span>
        </button>
        <button 
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-2 transition-colors group ${saved ? 'text-yellow-500' : 'text-zinc-500 hover:text-white'}`}
        >
          <Star className={`w-4 h-4 transition-all ${saved ? 'fill-yellow-500' : 'group-hover:scale-110'}`} />
          <span className="text-[14px] font-bold">{saved ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </motion.div>
  );
};

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
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden bg-zinc-950"
    >
      <button 
        onClick={onBack}
        className="absolute top-8 left-32 p-4 rounded-full shadow-2xl hover:shadow-white/5 transition-all active:scale-90 z-50 group backdrop-blur-2xl border bg-white/5 border-white/10"
      >
        <ArrowLeft className="w-6 h-6 transition-colors text-zinc-500 group-hover:text-white" />
      </button>

      <div className="text-center mb-16 relative">
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-medium text-zinc-500"
        >
          Explore More About MMU Subjects
        </motion.p>
      </div>

      <div 
        ref={scrollRef}
        className="w-full h-[600px] flex items-center gap-12 overflow-x-auto no-scrollbar px-[10vw] cursor-grab active:cursor-grabbing pb-20"
        style={{ scrollSnapType: 'x proximity' }}
      >
        {SUBJECTS.map((subject, index) => {
          // Calculate rotation and position for fanned-out look
          const rotation = (index - (SUBJECTS.length - 1) / 2) * 2;
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
              className="relative flex-shrink-0 w-[240px] h-[360px] transition-all duration-300 ease-out"
              style={{ perspective: '1000px' }}
            >
              {/* Book Shadow */}
              <div className="absolute inset-x-8 -bottom-10 h-8 rounded-full blur-2xl bg-black/40" />

              {/* Book Cover */}
              <div 
                className={`w-full h-full rounded-[24px] overflow-hidden shadow-2xl relative border-l-8 transition-all border-black/20 ${subject.color}`}
              >
                <img 
                  src={subject.cover} 
                  alt={subject.name} 
                  className="w-full h-full object-cover mix-blend-overlay opacity-60"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white text-left">
                  <div>
                    <h3 className="text-2xl font-bold leading-tight tracking-tight whitespace-pre-line">
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
                    <span className="text-[14px] font-black uppercase tracking-[0.3em] text-white">
                      {subject.name.replace('\n', ' ')}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Background Graphic */}
      <h2 className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[15vw] font-black pointer-events-none whitespace-nowrap select-none text-white/[0.02]">
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
    <div className="min-h-screen font-sans selection:bg-blue-500/30 overflow-x-hidden bg-zinc-950 text-zinc-100">
      
      <Navbar 
        currentView={view}
        onPostClick={() => setView('feed')}
        onSubjectsClick={() => setView('subjects')} 
      />

      {/* Background Mesh - Cinematic Luminous Glows */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] rounded-full bg-purple-600/15 blur-[100px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-indigo-600/10 blur-[80px]" />
      </div>

      <AnimatePresence mode="wait">
        {view === 'feed' ? (
          <motion.main 
            key="feed"
            initial={{ opacity: 0, x: -60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="pt-32 pb-48 pl-32 pr-8 max-w-5xl mx-auto relative z-10"
          >
            {/* Feed Heading - Simplified */}
            {activeSubjectData && (
              <div className="mb-8">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setActiveSubject(null)}
                    className="p-3 rounded-full transition-colors hover:bg-white/5"
                  >
                    <ArrowLeft className="w-5 h-5 text-zinc-500 hover:text-white" />
                  </button>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white whitespace-pre-line">
                      {activeSubjectData.name}
                    </h2>
                    <p className="font-medium text-zinc-500">Recently shared chapters and discussions</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Discussion Feed */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {MOCK_POSTS
                  .filter(p => {
                    if (!activeSubject) return true;
                    if (!activeSubjectData) return true;
                    
                    const pName = p.subject.toLowerCase();
                    const sName = activeSubjectData.name.toLowerCase();
                    
                    // Match course code if possible (e.g., CDS1114)
                    const pCode = pName.match(/[a-z]{2,4}\s?\d{4}/)?.[0];
                    const sCode = sName.match(/[a-z]{2,4}\s?\d{4}/)?.[0];
                    
                    if (pCode && sCode && pCode === sCode) return true;
                    
                    // Fallback to fuzzy substring match
                    const cleanP = pName.replace(/\s+/g, ' ').trim();
                    const cleanS = sName.replace(/\s+/g, ' ').trim();
                    return cleanP.includes(cleanS) || cleanS.includes(cleanP);
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

      {/* Ambient Background Elements - Secondary Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,102,204,0.08)_0%,transparent_70%)]" />

    </div>
  );
}
