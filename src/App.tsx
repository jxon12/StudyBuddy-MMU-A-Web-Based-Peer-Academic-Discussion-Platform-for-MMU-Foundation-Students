/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Team } from '../components/team';
import Homepage from '../components/homepage';
import { 
  Search, 
  ChevronDown, 
  BookOpen, 
  Play, 
  Moon,
  Sun,
  User
} from 'lucide-react';

const ACCENT_COLORS = [
  { name: 'Blue', value: '#0A84FF', secondary: '#007AFF' },
  { name: 'Indigo', value: '#5E5CE6', secondary: '#4D4BC5' },
  { name: 'Mint', value: '#63E6BE', secondary: '#30D158' },
  { name: 'Coral', value: '#FF6961', secondary: '#FF453A' },
  { name: 'Purple', value: '#BF5AF2', secondary: '#AF52DE' },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'team' | 'discussion'>('home');
  const [accentColor] = useState(ACCENT_COLORS[0]);
  const [showDocsMenu, setShowDocsMenu] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.setProperty('--color-brand-blue', accentColor.value);
    document.documentElement.style.setProperty('--color-brand-purple', accentColor.secondary);
  }, [theme, accentColor]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className={`min-h-screen relative flex flex-col items-center selection:bg-apple-blue/30 overflow-x-hidden ${theme}`}>
      {/* Background Mesh — Cinematic Luminous Glows */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-apple-blue/20 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] rounded-full bg-apple-purple/15 blur-[100px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-apple-indigo/10 blur-[80px]" />
      </div>
      
      {/* Global Navigation — Liquid Glass Tier 1 */}
      <header className="liquid-nav-global px-4 md:px-8">
        <div className="w-full max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img src="/images/mmu-logo.svg" alt="MMU Logo" className="h-[18px] w-auto nav-item" />
            <div className="hidden lg:flex items-center gap-8">
              <span className="nav-item">Get Started</span>
              <span className="nav-item cursor-pointer" onClick={() => setCurrentPage('team')}>About us</span>
              <span className="nav-item cursor-pointer" onClick={() => document.getElementById('academic-help')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>StudyBuddy</span>
              <span className="nav-item cursor-pointer" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>How it works</span>
              <div 
                className="relative"
                onMouseEnter={() => setShowDocsMenu(true)}
                onMouseLeave={() => setShowDocsMenu(false)}
              >
                <span className={`nav-item flex items-center gap-1 ${showDocsMenu ? 'active-accent' : ''}`}>
                  Documentation
                  <ChevronDown className={`w-3 h-3 transition-transform ${showDocsMenu ? 'rotate-180' : ''}`} />
                </span>
                
                <AnimatePresence>
                  {showDocsMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                      className="absolute top-full left-0 pt-3 w-72 -translate-x-1/4"
                    >
                      <div className="glass-card !p-2 !rounded-[24px]">
                        <div className="flex items-start gap-4 p-4 rounded-[18px] hover:bg-white/10 dark:hover:bg-white/5 transition-all cursor-pointer group" onClick={() => { setCurrentPage('team'); setShowDocsMenu(false); }}>
                           <div className="w-10 h-10 rounded-[14px] liquid-glass flex items-center justify-center bg-apple-blue/20 text-apple-blue">
                             <BookOpen className="w-5 h-5" />
                           </div>
                           <div>
                             <div className="text-[15px] font-semibold">About StudyBuddy</div>
                             <div className="text-[13px] opacity-60 leading-tight mt-1">Meet our founders.</div>
                           </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-[18px] hover:bg-white/10 dark:hover:bg-white/5 transition-all cursor-pointer group">
                           <div className="w-10 h-10 rounded-[14px] liquid-glass flex items-center justify-center bg-apple-indigo/20 text-apple-indigo">
                             <Play className="w-5 h-5" />
                           </div>
                           <div>
                             <div className="text-[15px] font-semibold">Youtube user guide</div>
                             <div className="text-[13px] opacity-60 leading-tight mt-1">Explore spatial features.</div>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Search className="w-4 h-4 nav-item" />
            <div className="w-7 h-7 rounded-full liquid-glass flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all">
              <User className="w-3.5 h-3.5 opacity-80" />
            </div>
            <button 
              onClick={toggleTheme}
              className="w-7 h-7 flex items-center justify-center nav-item"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content — HIG Spatial Structure */}
      <main className="flex-grow w-full">
        <AnimatePresence mode="wait">
          {currentPage === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
        {/* HERO SECTION */}
        <section id="hero" className="flex flex-col items-center justify-center text-center px-4 pt-[180px] pb-32 relative overflow-hidden w-full">
          {/* Background Image with Mask */}
          <div 
            className="absolute inset-0 -z-10 w-screen"
            style={{
              backgroundImage: 'url(/images/mmu-campus.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
              WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
          
          <motion.div
             initial={{ opacity: 0, scale: 0.98, y: 30 }}
             whileInView={{ opacity: 1, scale: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
             className="relative z-10 max-w-7xl"
          >
            <div className="mb-4">
               <span className="text-[13px] font-bold tracking-[0.2em] opacity-40 uppercase">Academic peer discussion platform</span>
            </div>
            <h1 className="text-[64px] md:text-[96px] font-bold tracking-tighter leading-[0.9] cursor-default mb-12">
              <span className="block opacity-90">Study Smarter,</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-br from-apple-blue via-apple-indigo to-apple-purple animate-glass-float">
                Together.
              </span>
            </h1>

            <div className="space-y-6 mb-16 max-w-2xl mx-auto">
              <p className="text-[19px] md:text-[22px] opacity-60 font-medium leading-normal">
                A peer academic discussion platform built for <span className="text-apple-blue font-semibold">MMU FCI foundation students</span>. 
                Ask questions, share answers, and discover the best study content — organized by subject and chapter.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24">
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}                 onClick={() => setCurrentPage('discussion')}                 className="apple-button-primary w-full sm:w-auto min-w-[200px]"
               >
                 Get Started
               </motion.button>
               <button className="flex items-center gap-2 text-[17px] font-medium opacity-60 hover:opacity-100 transition-all group">
                 Learn More 
                 <motion.span animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                   ↓
                 </motion.span>
               </button>
            </div>
          </motion.div>
        </section>

        {/* PROBLEM / INTRO SECTION */}
        <section id="academic-help" className="py-32 px-4 bg-black/5 dark:bg-white/5 relative overflow-hidden">
          {/* Subtle cinematic flare */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial-glow opacity-10 pointer-events-none" />
          
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-[40px] md:text-[48px] font-bold leading-tight tracking-tight">
                Academic help shouldn't stop when class ends.
              </h2>
              <p className="text-[19px] opacity-60 leading-relaxed">
                Current study groups on WhatsApp and Telegram are unstructured, messy, and hard to search. Information gets buried in hundreds of messages, leaving students frustrated and lost.
              </p>
              <div className="glass-card !bg-apple-blue/10 !border-apple-blue/20">
                <p className="text-[17px] font-medium text-apple-blue">
                  "StudyBuddy MMU brings structure to FCI foundation studies, making sure every question gets the visibility it deserves."
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card aspect-square flex items-center justify-center p-0 overflow-hidden"
            >
              <div className="w-full h-full bg-gradient-to-tr from-apple-blue/5 to-apple-purple/5 flex flex-col items-center justify-center text-center group">
                <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-700 ease-out">📵</div>
                <span className="text-[14px] font-bold opacity-30 uppercase tracking-widest px-8">
                  [ PHOTO PLACEHOLDER: CHAOTIC CHAT MESSAGES VS ORGANIZED FEED ]
                </span>
                <div className="absolute inset-0 border-[0.5px] border-white/20 rounded-[inherit] pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </section>



        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-32 px-4 overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-[40px] md:text-[56px] font-bold tracking-tight text-center mb-24">How It Works</h2>
            
            <div className="relative">
              {/* Vertical line connecting steps (hidden on mobile) */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-apple-blue via-apple-purple to-transparent hidden md:block" />
              
              <div className="space-y-24">
                {[
                  { step: 1, title: 'Create Account', text: 'Sign up using your MMU student email and set up your academic profile with your major and interests.' },
                  { step: 2, title: 'Browse Feed', text: 'Explore questions filtered by your specific subjects and chapters. Find answers that help you right now.' },
                  { step: 3, title: 'Post Questions', text: 'Stuck on a problem? Post it with mandatory tags. High-quality posts get answered faster.' },
                  { step: 4, title: 'Get Answers', text: 'Receive help from peers, upvote the best responses, and contribute back to climb the leaderboard.' }
                ].map((item, i) => (
                  <motion.div 
                    key={item.step}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="flex-1 text-center md:text-left space-y-4">
                      <div className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center text-xl font-bold bg-apple-blue/20 mx-auto md:mx-0">
                        {item.step}
                      </div>
                      <h3 className="text-3xl font-bold">{item.title}</h3>
                      <p className="text-lg opacity-60 leading-relaxed font-medium">{item.text}</p>
                    </div>
                    <div className="flex-1 w-full flex justify-center">
                       <div className="glass-card w-full aspect-[4/3] flex items-center justify-center">
                          <span className="text-[12px] font-bold opacity-20 uppercase tracking-widest">
                            [ PHOTO: STEP {item.step} VISUAL ]
                          </span>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM VS SOLUTION ALTERNATING */}
        <section className="py-32 px-4 space-y-32">
          {/* Section A */}
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1 order-2 md:order-1">
              <div className="glass-card aspect-[4/3] flex items-center justify-center">
                <span className="text-[12px] font-bold opacity-20 uppercase tracking-widest">[ PHOTO: MESSY WHATSAPP GROUPS VIEW ]</span>
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2 space-y-6">
              <span className="text-[14px] font-bold text-apple-blue tracking-widest uppercase">The Problem</span>
              <h2 className="text-4xl font-bold">No more lost messages.</h2>
              <p className="text-xl opacity-60 leading-relaxed">
                In WhatsApp or Telegram, important academic discussions are sandwiched between memes and small talk. On StudyBuddy, every post is a focused thread.
              </p>
            </div>
          </div>

          {/* Section B */}
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1 space-y-6">
              <span className="text-[14px] font-bold text-apple-indigo tracking-widest uppercase">The Efficiency</span>
              <h2 className="text-4xl font-bold">Find what you need, instantly.</h2>
              <p className="text-xl opacity-60 leading-relaxed">
                Our tag-first approach means you can filter the entire database of questions by subject code and chapter. No more scrolling for hours.
              </p>
            </div>
            <div className="flex-1">
              <div className="glass-card aspect-[4/3] flex items-center justify-center">
                <span className="text-[12px] font-bold opacity-20 uppercase tracking-widest">[ PHOTO: SEARCH & FILTER INTERFACE ]</span>
              </div>
            </div>
          </div>

          {/* Section C */}
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1 order-2 md:order-1">
              <div className="glass-card aspect-[4/3] flex items-center justify-center">
                <span className="text-[12px] font-bold opacity-20 uppercase tracking-widest">[ PHOTO: VOTING MECHANISM IN ACTION ]</span>
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2 space-y-6">
              <span className="text-[14px] font-bold text-apple-purple tracking-widest uppercase">The Quality</span>
              <h2 className="text-4xl font-bold">The best answers surface automatically.</h2>
              <p className="text-xl opacity-60 leading-relaxed">
                Crowd-sourced verification. The community upvotes high-quality answers, pushing them to the top and pushing distractions out of sight.
              </p>
            </div>
          </div>
        </section>
            </motion.div>
          ) : currentPage === 'discussion' ? (
            <Homepage />
          ) : (
            <Team onBackToHome={() => setCurrentPage('home')} />
          )}
        </AnimatePresence>
      </main>

      {/* Footer — Grouped Inset Style */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="text-[20px] font-bold tracking-tight">StudyBuddy MMU</div>
            <p className="text-[14px] opacity-50 leading-relaxed">
              Open-source academic collaboration for MMU FCI foundation students. Built by students, for students.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-[13px] font-bold opacity-30 uppercase tracking-widest">Platform</h4>
            <div className="flex flex-col gap-2">
              <span className="text-[14px] opacity-60 hover:opacity-100 cursor-pointer">Features</span>
              <span className="text-[14px] opacity-60 hover:opacity-100 cursor-pointer">How It Works</span>
              <span className="text-[14px] opacity-60 hover:opacity-100 cursor-pointer">Leaderboard</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[13px] font-bold opacity-30 uppercase tracking-widest">Resources</h4>
            <div className="flex flex-col gap-2">
              <span className="text-[14px] opacity-60 hover:opacity-100 cursor-pointer">Subjects</span>
              <span className="text-[14px] opacity-60 hover:opacity-100 cursor-pointer">Course</span>
              <span className="text-[14px] opacity-60 hover:opacity-100 cursor-pointer">FAQs</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[13px] font-bold opacity-30 uppercase tracking-widest">About</h4>
            <div className="flex flex-col gap-2">
              <span className="text-[14px] opacity-60 hover:opacity-100 cursor-pointer">Our Mission</span>
              <span className="text-[14px] opacity-60 hover:opacity-100 cursor-pointer" onClick={() => setCurrentPage('team')}>Team</span>
              <span className="text-[14px] opacity-60 hover:opacity-100 cursor-pointer">Feedback</span>
            </div>
          </div>
        </div>

        <div className="glass-card flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
            <div className="text-[11px] font-bold opacity-30 tracking-widest uppercase">
              © 2026 STUDYBUDDY MMU COMMUNITY • BUILT FOR MMU FCI FOUNDATION STUDENTS
            </div>
            <div className="flex gap-6">
               <span className="text-[11px] font-medium opacity-50 hover:opacity-100 transition-all cursor-pointer">Terms & Conditions</span>
               <span className="text-[11px] font-medium opacity-50 hover:opacity-100 transition-all cursor-pointer">Privacy Policy</span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
             
             <div className="w-8 h-1 rounded-full bg-gradient-to-r from-apple-blue via-apple-indigo to-apple-purple opacity-40 animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  );
}
