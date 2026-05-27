import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Lock, ShieldCheck, Database, Share2, Trash2 } from 'lucide-react';

const PRIVACY_SECTIONS = [
  {
    title: "Project Scope & Data",
    icon: Database,
    content: "As a student-led project, StudyBuddy MMU collects minimal data primarily for testing core features. This includes your name, MMU email prefix, and academic interests. We do not store real-world sensitive data like bank details or national ID numbers."
  },
  {
    title: "Information Protection",
    icon: Lock,
    content: "While we use modern encryption standards for data in transit, please remember this is a prototype. We recommend using unique, project-specific credentials if you are concerned about security across multiple platforms."
  },
  {
    title: "Third-Party Services",
    icon: Share2,
    content: "We use Gemini AI for smart features and Firebase/Cloud services for storage. These services have their own privacy standards. We do not sell your project data to third-party advertisers."
  },
  {
    title: "Your Data Rights",
    icon: Trash2,
    content: "Since this is an alpha build, you have the right to request data deletion at any time. Data may also be wiped automatically during major system updates as we iterate on the platform's architecture."
  }
];

export function PrivacyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="pt-[180px] pb-32 px-4 max-w-5xl mx-auto w-full"
    >
      <div className="text-center mb-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-apple-mint/10 blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-16 h-16 rounded-[20px] bg-apple-mint/10 flex items-center justify-center mx-auto text-apple-mint mb-6 relative z-10"
        >
          <Eye className="w-8 h-8" />
        </motion.div>
        
        <h1 className="text-[48px] md:text-[56px] font-bold tracking-tight mb-4 leading-tight relative z-10">
          Privacy Policy
        </h1>
        <p className="text-[19px] opacity-60 max-w-2xl mx-auto font-medium relative z-10">
          Transparency about how we handle information in the StudyBuddy MMU project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {PRIVACY_SECTIONS.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
              className="glass-card group hover:border-apple-mint/30 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl liquid-glass flex items-center justify-center text-apple-mint mb-6 group-hover:scale-110 transition-transform duration-500">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-[22px] font-bold tracking-tight mb-3">{section.title}</h3>
              <p className="text-[16px] opacity-60 leading-relaxed font-medium">
                {section.content}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-card border-apple-mint/10 bg-apple-mint/[0.02] !p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-[4] rotate-12 pointer-events-none">
          <ShieldCheck className="w-24 h-24" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Commitment to Anonymity</h2>
          <div className="space-y-4 text-[17px] opacity-70 leading-relaxed font-medium">
            <p>
              We believe in creating a safe digital space for students. During this project phase, 
              we prioritize anonymous usage where possible. Your contributions to academic feeds 
              are designed to highlight the <strong>quality of knowledge</strong> over individual profiles.
            </p>
            <p>
              By participating, you help us refine how civic intelligence can work at MMU while 
              respecting the digital boundaries of our student community.
            </p>
          </div>
          
          <div className="mt-10 flex items-center gap-4">
             <div className="h-[1px] flex-grow bg-white/10" />
             <div className="text-[14px] font-bold tracking-widest uppercase text-apple-mint opacity-80">
               Privacy First Design
             </div>
             <div className="h-[1px] flex-grow bg-white/10" />
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center gap-6">
        <div className="px-6 py-3 rounded-full liquid-glass border-apple-mint/20 text-apple-mint text-[14px] font-bold">
           Protocol: PB-2026-ALPHA
        </div>
        <div className="text-center opacity-40 text-[13px] font-medium uppercase tracking-widest">
          Build Ref: {Math.random().toString(36).substring(7).toUpperCase()} • Security Layer v1.2
        </div>
      </div>
    </motion.div>
  );
}
