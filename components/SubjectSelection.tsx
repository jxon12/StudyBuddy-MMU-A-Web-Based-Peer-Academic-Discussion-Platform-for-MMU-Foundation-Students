import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Braces, 
  Zap, 
  Brush,
  Grid3x3,
  Square,
  Beaker,
  Lightbulb,
  Briefcase,
  MessageSquare,
  CheckCircle2,
  Layers,
  LayoutGrid
} from 'lucide-react';

const SUBJECTS = [
  { id: 'BIT1112', name: 'Introduction to Computing Tech', icon: Braces, color: 'blue' },
  { id: 'CSC1122', name: 'Introduction to Digital System', icon: Zap, color: 'indigo' },
  { id: 'CSC11XX', name: 'Multimedia Fundamentals', icon: Brush, color: 'purple' },
  { id: 'BIT1132', name: 'Mathematics 1', icon: Grid3x3, color: 'mint' },
  { id: 'MTH1112', name: 'Mathematics 2', icon: Grid3x3, color: 'blue' },
  { id: 'MTH11XX', name: 'Mathematics 3', icon: Grid3x3, color: 'blue' },
  { id: 'BIT11XX', name: 'Principles of Physics', icon: Beaker, color: 'indigo' },
  { id: 'COM11XX', name: 'Problem Solving & Program Design', icon: Braces, color: 'purple' },
  { id: 'MGT11XX', name: 'Mini IT Project', icon: LayoutGrid, color: 'mint' },
  { id: 'EEE11XX', name: 'Intro to Business Management', icon: Briefcase, color: 'blue' },
  { id: 'ART11XX', name: 'Academic English', icon: Square, color: 'indigo' },
  { id: 'ART11XX', name: 'Communicative English', icon: MessageSquare, color: 'purple' },
  { id: 'COM11XX', name: 'Critical Thinking', icon: Lightbulb, color: 'mint' },
  { id: 'BIT11XX', name: 'Essential English', icon: Layers, color: 'blue' },
];

interface SubjectSelectionProps {
  onComplete: () => void;
  onPrevious: () => void;
}

export const SubjectSelection: React.FC<SubjectSelectionProps> = ({ onComplete, onPrevious }) => {
  const [selected, setSelected] = useState<string[]>(['BIT1112', 'CSC11XX']);
  const [searchQuery] = useState('');

  const toggleSubject = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const filteredSubjects = SUBJECTS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow w-full flex items-center justify-center px-4 pt-32 pb-24 min-h-screen"
    >
      <motion.div 
        initial={{ y: 30, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[1000px] h-[640px] spatial-glass rounded-[32px] flex overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
      >
        {/* Spatial Highlighting */}
        <div className="absolute inset-0 rounded-[inherit] border-t border-l border-white/30 pointer-events-none z-30" />

        {/* LEFT PANE: Information & Context */}
        <div 
          className="w-1/3 h-full bg-gradient-to-br from-white/10 to-white/5 p-12 flex flex-col justify-between border-r border-white/5 relative z-10"
          style={{
            backgroundImage: 'url(/images/mmu-campus.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            maskImage: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.75) 100%)',
            WebkitMaskImage: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.75) 100%)'
          }}
        >
          <div className="space-y-12">
            <img src="/images/mmu-logo.svg" alt="MMU Logo" className="h-12 w-auto" />
            
            <div className="space-y-4">
              <h1 className="text-[32px] font-bold tracking-tight text-white/80">Onboarding</h1>
              <p className="text-[15px] opacity-60 font-medium leading-relaxed">
                Customize your academic space. Select up to 6 subjects to populate your personalized feed and study groups.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold opacity-40 uppercase tracking-[0.4em]">
            Step 02 / 03
          </div>
        </div>

        {/* RIGHT PANE: Subject Selection Grid */}
        <div className="w-2/3 h-full bg-white/5 backdrop-blur-3xl p-12 flex flex-col relative z-20">
          <div className="mb-10 space-y-1">
            <h2 className="text-[24px] font-bold tracking-tight">Choose your subjects</h2>
            <p className="text-[13px] opacity-40 font-medium">Foundation in IT</p>
          </div>

          <div className="flex-grow overflow-y-auto pr-4 custom-scrollbar">
            <div className="grid grid-cols-2 gap-4 pb-8">
              {filteredSubjects.map((subject) => {
                const isSelected = selected.includes(subject.id);
                return (
                  <motion.div
                    key={subject.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSubject(subject.id)}
                    className={`relative p-5 rounded-[24px] border transition-all duration-500 cursor-pointer flex items-center gap-4 ${
                      isSelected 
                        ? 'bg-white text-black border-white shadow-[0_15px_30px_rgba(255,255,255,0.1)]' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-black/5 text-black' : 'bg-white/5 text-white/40'
                    }`}>
                      <subject.icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="text-[14px] font-bold leading-tight">{subject.name}</div>
                      <div className={`text-[10px] font-bold tracking-widest uppercase mt-1 ${
                        isSelected ? 'opacity-40' : 'opacity-20'
                      }`}>
                        {subject.id}
                      </div>
                    </div>

                    {isSelected && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-black rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                      >
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
            <button 
              onClick={onPrevious}
              className="text-[13px] font-bold opacity-30 hover:opacity-100 transition-opacity uppercase tracking-widest"
            >
              Previous Step
            </button>
            <motion.button 
              onClick={onComplete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 h-[48px] bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-[14px] shadow-2xl hover:brightness-110 transition-all"
            >
              Continue
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
