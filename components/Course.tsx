import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Terminal, 
  Binary, 
  Cpu, 
  Globe, 
  FolderGit2, 
  Briefcase,
  ChevronRight,
  Sparkles,
  Award,
  BookMarked,
  Layers,
  Info
} from 'lucide-react';

interface CourseSubject {
  name: string;
  code: string;
  category: 'programming' | 'math' | 'humanities' | 'electronics' | 'business' | 'project';
  description: string;
  skills: string[];
}

const TRIMESTERS_SUBJECTS: Record<string, CourseSubject[]> = {
  'Trimester 1': [
    {
      name: 'Introduction to Business Management',
      code: 'FBM1014',
      category: 'business',
      description: 'Understanding foundational business structures, management principles, financial and operational frameworks within modern corporations.',
      skills: ['Strategic Planning', 'Leadership', 'Organizational Behavior', 'Business Ethics']
    },
    {
      name: 'Introduction to Computing Technologies',
      code: 'FCS1014',
      category: 'programming',
      description: 'A study of core hardware, software systems, internet infrastructure, operating models, cloud computing, and baseline programming notions.',
      skills: ['System Architecture', 'CLI Navigation', 'Cloud Concepts', 'Hardware Basics']
    },
    {
      name: 'Communicative English',
      code: 'FLE1014',
      category: 'humanities',
      description: 'Developing professional writing, research referencing, visual presentation techniques, and active listening in academic and corporate settings.',
      skills: ['Public Speaking', 'Technical Writing', 'Citation Standards', 'Interpersonal Skills']
    },
    {
      name: 'Mathematics I',
      code: 'FMA1014',
      category: 'math',
      description: 'Algebraic functions, advanced trigonometric equations, matrix transformations, limits, and introduction to differential calculus.',
      skills: ['Algebra', 'Analytical Geometry', 'Trigonometry', 'Limit Theory']
    },
    {
      name: 'Problem Solving and Program Design',
      code: 'FCS1024',
      category: 'programming',
      description: 'Core concepts of structured programming logic, algorithmic flows, flowcharts, pseudocode, and debugging methodologies in C/C++.',
      skills: ['Sequence Control', 'Loops & Decisions', 'Data Types', 'Array Data Handling']
    }
  ],
  'Trimester 2': [
    {
      name: 'Critical Thinking',
      code: 'FCP1024',
      category: 'humanities',
      description: 'Fostering rational deductive thinking, cognitive bias avoidance, structured analytical frameworks, and evaluating rhetorical evidence.',
      skills: ['Logical Fallacies', 'Argument Reconstruction', 'Evidence Evaluation', 'Problem Formulation']
    },
    {
      name: 'Introduction to Digital Systems',
      code: 'FEE1014',
      category: 'electronics',
      description: 'Investigating binary representations, Boolean algebra minimization, Karnaugh maps, combinational logic gates, and sequential flip-flop hardware design.',
      skills: ['Gates & Circuits', 'Binary Arithmetic', 'Karnaugh Maps', 'Sequential Logic']
    },
    {
      name: 'Essential English',
      code: 'FLE1024',
      category: 'humanities',
      description: 'Refining stylistic composition, advanced academic research synthesis, argument formulation, and presentation skills.',
      skills: ['Rhetoric', 'Academic Research', 'Lexicon Enhancement', 'Oral Defence']
    },
    {
      name: 'Multimedia Fundamentals',
      code: 'FMM1014',
      category: 'programming',
      description: 'Examines digital media compression algorithms, typography rules, web usability design, layout grids, and interactive vector frameworks.',
      skills: ['UI Wireframing', 'Interactivity Design', 'Graphic Compression', 'Web Styling']
    },
    {
      name: 'Mathematics II',
      code: 'FMA1024',
      category: 'math',
      description: 'Focuses heavily on integral calculus, integration methods, vector spaces, polar equations, and basic differential modeling.',
      skills: ['Integration Methods', 'Area & Volume Integral', 'Vector Matrices', 'Analytic Calculus']
    },
    {
      name: 'Principles of Physics',
      code: 'FPH1014',
      category: 'math',
      description: 'Covering classical Newtonian mechanics, kinematics forces, work energy processes, wave oscillations, and electrical charge structures.',
      skills: ['Newtonian Mechanics', 'Electric Potentials', 'Oscillographic Waves', 'Vector Physics']
    }
  ],
  'Trimester 3': [
    {
      name: 'Academic English',
      code: 'FLE1034',
      category: 'humanities',
      description: 'Mastery of advanced scholarly literature analysis, synthesizing peer-reviewed articles, formatting thesis structures, and research referencing.',
      skills: ['Scholarly Referencing', 'Literature Synthesis', 'Thesis Compilation', 'Peer Peer Reviews']
    },
    {
      name: 'Mathematics III',
      code: 'FMA1034',
      category: 'math',
      description: 'Explores discrete mathematical structures, probability and sets, graph theory algorithms, and combinatorial combinatorics calculations.',
      skills: ['Discrete Logic', 'Probability Distribution', 'Set Theory', 'Shortest-Path Graphs']
    },
    {
      name: 'Mini IT Project',
      code: 'FCS1034',
      category: 'project',
      description: 'Capstone team project integrating software design, architectural engineering, project scheduling, and final operational software validation.',
      skills: ['Team Lifecycle', 'Software Delivery', 'Product Presentation', 'GitHub Code Auditing']
    }
  ]
};

const CATEGORIES_INFO = {
  programming: { label: 'Software & Code', icon: Terminal, color: 'text-apple-blue bg-apple-blue/10 border-apple-blue/20' },
  math: { label: 'Mathematics & Science', icon: Binary, color: 'text-cyan-teal bg-apple-purple/10 border-apple-purple/20' },
  humanities: { label: 'Communication & Logic', icon: Globe, color: 'text-apple-mint bg-apple-mint/10 border-apple-mint/20' },
  electronics: { label: 'Hardware Systems', icon: Cpu, color: 'text-apple-coral bg-apple-coral/10 border-apple-coral/20' },
  business: { label: 'Corporate Management', icon: Briefcase, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' },
  project: { label: 'Capstone Project', icon: FolderGit2, color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' }
};

export function CoursePage() {
  const [activeTrimester, setActiveTrimester] = useState<'All' | 'Trimester 1' | 'Trimester 2' | 'Trimester 3'>('All');
  const [selectedSubject, setSelectedSubject] = useState<CourseSubject | null>(TRIMESTERS_SUBJECTS['Trimester 1'][1]); // Default to Intro to Computing

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="pt-[180px] pb-32 px-4 max-w-6xl mx-auto w-full font-sans"
    >
      {/* HEADER HERO AREA */}
      <div className="mb-12 pb-8 border-b border-white/10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative">
        <div className="space-y-3.5">
          <h1 className="text-[44px] md:text-[56px] font-black tracking-tight leading-none text-primary">
            Foundation in Computing
          </h1>
        </div>

        <div className="h-0.5 w-[160px] bg-gradient-to-r from-apple-purple via-apple-indigo to-apple-blue rounded-full" />
      </div>

      {/* OVERVIEW CONTENT AND FOCUS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
        <div className="lg:col-span-8 flex flex-col justify-between glass-card p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-44 h-44 bg-apple-purple/10 rounded-full blur-[80px] group-hover:bg-apple-purple/15 transition-all pointer-events-none" />
          
          <div className="space-y-4">
            <h2 className="text-[20px] font-black tracking-tight flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-cyan-teal" />
              Programme Synopsis
            </h2>
            <p className="text-[15px] leading-relaxed opacity-70 text-justify">
              In an ever-changing, technologically-dependent world, our one-year <strong>Foundation in Computing</strong> programme aims to produce students who are well-equipped with core computer skills as well as logical, mathematical, and practical problem-solving capabilities.
            </p>
            <p className="text-[15px] leading-relaxed opacity-75 text-justify">
              Deliverable through structural, interactive lectures and intensive laboratory tutorials, the pathway targets building fundamental engineering architectures and hands-on coding skills from day one. Upon successful completion of this foundation year, graduates can directly transition into prestigious undergraduate degree programs at either the **Faculty of Computing and Informatics (FCI)** or the **Faculty of Information Science and Technology (FIST)**.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-apple-purple/10 flex items-center justify-center text-cyan-teal shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <p className="text-[12px] opacity-50 max-w-sm">
                *The above programme structure serves as an academic guide. Courses and specific elective codes may differ according to intake semesters.*
              </p>
            </div>
            
            <div className="flex gap-2">
              <div className="px-3 py-1.5 bg-neutral-900 border border-white/5 rounded-xl text-center">
                <div className="text-[11px] opacity-40 uppercase font-bold leading-none">Duration</div>
                <div className="text-[14px] font-black text-cyan-teal mt-0.5">1 Year (3 Trimesters)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 glass-card p-7 flex flex-col justify-between bg-gradient-to-br from-white/5 to-transparent border border-white/5">
          <h3 className="text-[16px] font-extrabold text-primary flex items-center gap-2 mb-4">
            <Award className="w-4.5 h-4.5 text-cyan-teal" />
            Progression Faculties
          </h3>
          
          <div className="space-y-3">
            {[
              {
                abbr: 'FCI',
                full: 'Faculty of Computing & Informatics',
                location: 'Cyberjaya Campus',
                degrees: ['Software Engineering', 'Data Science', 'Game Design']
              },
              {
                abbr: 'FIST',
                full: 'Faculty of Info Science & Tech',
                location: 'Melaka Campus',
                degrees: ['Information Technology', 'Security & Networking', 'Business Intelligence']
              }
            ].map((fac, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-black/20 border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[16px] font-black text-cyan-teal">{fac.abbr}</span>
                  <span className="text-[9px] font-black bg-white/5 tracking-wider uppercase px-2 py-0.5 rounded border border-white/10 opacity-70">{fac.location}</span>
                </div>
                <div className="text-[12px] font-bold opacity-80">{fac.full}</div>
                <p className="text-[10px] opacity-40">Core Specialisms: {fac.degrees.join(' • ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS & TRIDUUM STRUCTURE CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPACT MAP LIST OF TRIMESTERS */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[19px] font-extrabold text-primary flex items-center gap-2">
                <Layers className="w-4.5 h-4.5 text-cyan-teal" />
                Academic Structure
              </h3>
              
              {/* Filter Tabs */}
              <div className="flex gap-1 bg-black/20 p-1 border border-white/5 rounded-xl">
                {['All', 'Trimester 1', 'Trimester 2', 'Trimester 3'].map((tri) => (
                  <button
                    key={tri}
                    onClick={() => setActiveTrimester(tri as any)}
                    className={`h-7 px-3 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      activeTrimester === tri 
                        ? 'bg-apple-purple text-white shadow'
                        : 'text-primary opacity-50 hover:opacity-100'
                    }`}
                  >
                    {tri}
                  </button>
                ))}
              </div>
            </div>
            
            <p className="text-[12px] opacity-40 leading-normal">
              Click any specific subject module below to review syllabus overview, typical course code tags, and key capabilities gained upon completion.
            </p>
          </div>

          {/* TRIMESTERS GRID */}
          <div className="space-y-8">
            {Object.entries(TRIMESTERS_SUBJECTS)
              .filter(([triName]) => activeTrimester === 'All' || triName === activeTrimester)
              .map(([triName, list]) => (
                <div key={triName} className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-black uppercase tracking-widest text-cyan-teal bg-apple-purple/10 border border-apple-purple/20 px-3 py-1 rounded-full">
                      {triName}
                    </span>
                    <div className="h-px bg-white/5 flex-grow" />
                    <span className="text-[10.5px] font-mono opacity-40 font-bold">{list.length} Modules</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {list.map((sub, idx) => {
                      const isSelected = selectedSubject?.name === sub.name;
                      const catInfo = CATEGORIES_INFO[sub.category];
                      const IconComponent = catInfo.icon;

                      return (
                        <motion.button
                          key={idx}
                          onClick={() => setSelectedSubject(sub)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                            isSelected
                              ? 'bg-apple-purple/10 border-apple-purple/40 shadow-lg scale-[1.01]'
                              : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
                          }`}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5 ${catInfo.color}`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-[14px] font-extrabold truncate text-primary group-hover:text-cyan-teal transition-colors ${isSelected ? 'text-cyan-teal font-black' : ''}`}>
                                  {sub.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10.5px] font-mono font-bold opacity-45">{sub.code}</span>
                                <span className="text-[10px] opacity-35">•</span>
                                <span className="text-[10px] uppercase font-extrabold tracking-wider opacity-45">{catInfo.label}</span>
                              </div>
                            </div>
                          </div>

                          <ChevronRight className={`w-4 h-4 opacity-30 group-hover:opacity-75 transition-all shrink-0 ${
                            isSelected ? 'translate-x-1 opacity-100 text-cyan-teal' : ''
                          }`} />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>

        </div>

        {/* RIGHT DETAILED PREVIEW CONTAINER */}
        <div className="lg:col-span-5 sticky top-36">
          <AnimatePresence mode="wait">
            {selectedSubject ? (
              <motion.div
                key={selectedSubject.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-6 border border-white/10 relative overflow-hidden flex flex-col gap-6"
              >
                {/* Micro Ambient Glow */}
                <div className="absolute top-[-40px] right-[-40px] w-24 h-24 bg-apple-purple/15 rounded-full blur-2xl pointer-events-none" />

                {/* Classification label */}
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-white/5 ${CATEGORIES_INFO[selectedSubject.category].color}`}>
                      {React.createElement(CATEGORIES_INFO[selectedSubject.category].icon, { className: 'w-4 h-4' })}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-40">Classification</span>
                      <div className="text-[12px] font-bold leading-none mt-0.5">{CATEGORIES_INFO[selectedSubject.category].label}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono bg-neutral-900 border border-white/5 px-2.5 py-1 rounded-md text-cyan-teal font-extrabold">
                    {selectedSubject.code}
                  </span>
                </div>

                {/* Main descriptors */}
                <div className="space-y-3">
                  <h4 className="text-[18px] font-black tracking-tight text-primary leading-snug">
                    {selectedSubject.name}
                  </h4>
                  <p className="text-[12.5px] opacity-65 leading-relaxed">
                    {selectedSubject.description}
                  </p>
                </div>

                {/* Capabilities and skills list */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-40 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-teal" />
                    Key Capabilities Mastered
                  </span>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {selectedSubject.skills.map((skill, i) => (
                      <span key={i} className="text-[10.5px] font-semibold bg-white/5 hover:bg-apple-purple/5 border border-white/5 hover:border-apple-purple/25 text-primary/80 hover:text-cyan-teal px-2.5 py-1 rounded-xl transition-all">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-white/5 bg-neutral-950/40 p-4 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-apple-purple/10 text-cyan-teal flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-[11.5px] font-bold">Have questions about this subject?</div>
                    <div className="text-[10.5px] opacity-40">Discuss syllabus questions on our leaderboards instantly.</div>
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="glass-card text-center py-16 text-primary/40 text-[13.5px] italic border border-white/5">
                Select any academic subject module on the left key map to view advanced course structures.
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </motion.div>
  );
}
