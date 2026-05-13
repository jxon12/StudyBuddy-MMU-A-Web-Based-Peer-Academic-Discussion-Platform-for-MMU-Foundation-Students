// --- New Profile Page Component ---

const ProfilePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-48 pl-32 pr-8 max-w-5xl mx-auto relative z-10"
    >
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
        <div className="relative">
          <div className="w-32 h-32 rounded-[40px] bg-white p-1 shadow-2xl overflow-hidden border border-black/5">
            <img src={USER_AVATAR} alt="LING YI YON" className="w-full h-full object-cover rounded-[36px]" />
          </div>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">LING YI YON</h1>
          <p className="text-zinc-500 font-medium mb-1">Foundation in Computing</p>
          <p className="text-zinc-400 font-bold text-sm tracking-tight mb-6">Student ID: 252FC253TM</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {[
          { label: 'Total Posts', value: '24', icon: MessageCircle, color: 'text-blue-500' },
          { label: 'Helpful Votes', value: '142', icon: Triangle, color: 'text-orange-500' },
          { label: 'Best Answers', value: '8', icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Study Streak', value: '12d', icon: Activity, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-black/[0.03] shadow-sm flex flex-col items-center justify-center text-center">
            <stat.icon className={`w-6 h-6 mb-3 ${stat.color}`} />
            <p className="text-2xl font-black text-zinc-900 leading-none mb-1">{stat.value}</p>
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Profile Content Tabs */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <History className="w-5 h-5 text-zinc-400" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {MOCK_POSTS.slice(0, 3).map(post => (
              <div key={post.id} className="bg-white/60 p-5 rounded-[28px] border border-black/[0.03] hover:border-black/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Asked in {post.subject}</span>
                  <span className="text-zinc-200">•</span>
                  <span className="text-[10px] font-bold text-zinc-400">{post.timestamp}</span>
                </div>
                <p className="text-[15px] font-medium text-zinc-800 line-clamp-2 group-hover:text-zinc-900">
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-zinc-400" />
            Top Achievements
          </h3>
          <div className="bg-white p-6 rounded-[32px] border border-black/[0.03] shadow-sm space-y-6 text-black">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-2xl">🥇</div>
              <div>
                <p className="text-[13px] font-bold text-zinc-900">First Helpful Hand</p>
                <p className="text-[11px] text-zinc-400 font-medium">Unlocked on Chapter 2 Quiz</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl">📚</div>
              <div>
                <p className="text-[13px] font-bold text-zinc-900">Chapter Crusher</p>
                <p className="text-[11px] text-zinc-400 font-medium">Completed 5 Chapters</p>
              </div>
            </div>
            <div className="flex items-center gap-4 grayscale opacity-40">
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-2xl">🔥</div>
              <div>
                <p className="text-[13px] font-bold text-zinc-900">Expert Mentor</p>
                <p className="text-[11px] text-zinc-400 font-medium">Help 50 students to unlock</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [view, setView] = useState<'feed' | 'subjects' | 'profile'>('feed');
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const activeSubjectData = activeSubject ? SUBJECTS.find(s => s.id === activeSubject) : null;

  return (
    <div className="min-h-screen font-sans selection:bg-zinc-200 overflow-x-hidden bg-[#fafafa]">
      
      <Navbar 
        currentView={view}
        onSubjectsClick={() => setView('subjects')} 
        onProfileClick={() => setView('profile')}
      />

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
            {/* Feed Heading */}
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {activeSubjectData && (
                  <button 
                    onClick={() => setActiveSubject(null)}
                    className="p-3 rounded-full transition-colors hover:bg-zinc-100"
                  >
                    <ArrowLeft className="w-5 h-5 text-zinc-600 hover:text-zinc-900" />
                  </button>
                )}
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                    {activeSubjectData ? `${activeSubjectData.name} Hub` : 'Discover Discussions'}
                  </h2>
                  <p className="font-medium text-zinc-400">{activeSubjectData ? 'Recently shared chapters and discussions' : 'Explore posts from different subjects'}</p>
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
        ) : view === 'subjects' ? (
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
        ) : (
          <ProfilePage key="profile" />
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