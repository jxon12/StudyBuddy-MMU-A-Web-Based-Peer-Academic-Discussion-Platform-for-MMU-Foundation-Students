import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, AlertTriangle, Scale, Lock, FileText } from 'lucide-react';

const SECTIONS = [
  {
    title: "Educational Project Statement",
    icon: Info,
    content: "StudyBuddy MMU is developed strictly for academic and project purposes as part of a software development initialization. It is NOT an official MMU application and is not endorsed by Multimedia University. The platform serves as a prototype to demonstrate civic intelligence and collaborative learning interfaces."
  },
  {
    title: "No Liability & Disclaimer",
    icon: AlertTriangle,
    content: "The developers provide this platform 'as-is' without any warranties. We are not responsible for any academic outcomes, data loss, or misinformation shared within the community. Users should verify all study materials with official university sources."
  },
  {
    title: "Data Privacy",
    icon: Lock,
    content: "While we implement modern security practices, this is a testing environment. Please do not share sensitive personal information or official university credentials that are not intended for public/project use. Data may be cleared periodically as the project evolves."
  },
  {
    title: "Community Conduct",
    icon: Scale,
    content: "Users are expected to maintain academic integrity. Harassment, plagiarism, or the sharing of leaked examination materials is strictly prohibited. We reserve the right to remove content that violates these principles."
  }
];

export function TermsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="pt-[180px] pb-32 px-4 max-w-5xl mx-auto w-full"
    >
      <div className="text-center mb-20">
        <h1 className="text-[48px] md:text-[56px] font-bold tracking-tight mb-4 leading-tight">
          Terms & Conditions
        </h1>
        <p className="text-[19px] opacity-60 max-w-2xl mx-auto font-medium">
          Legal information regarding the use of StudyBuddy MMU during its project phase.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {SECTIONS.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card group hover:border-apple-blue/30 transition-colors"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center text-apple-blue group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-[20px] font-bold tracking-tight">{section.title}</h3>
              </div>
              <p className="text-[16px] opacity-60 leading-relaxed font-medium">
                {section.content}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-card !p-10 md:!p-16 border-white/5">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3 text-apple-blue">
               <FileText className="w-6 h-6" />
               <span className="text-[14px] font-bold tracking-widest uppercase">Official Notice</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Project Transparency</h2>
            <p className="text-[17px] opacity-60 leading-relaxed">
              By using this application, you acknowledge that you are participating in a <strong>demonstrative student project</strong>. 
              The codebase, features, and identity of StudyBuddy are simulations created to solve specific academic pain points for 
              Foundation students at MMU.
            </p>
          </div>
          <div className="w-full md:w-[300px] aspect-square rounded-[32px] liquid-glass flex items-center justify-center overflow-hidden relative group">
             <img
               src="/images/ebee-mascot.jpg"
               alt="MMU campus"
               className="absolute inset-0 w-full h-full object-cover opacity-80"
             />
             <div className="absolute inset-0 bg-transparent transition-colors" />
             <div className="text-center relative z-10 px-6">
             </div>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center opacity-40 text-[13px] font-medium">
        Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • Cyberjaya, Malaysia
      </div>
    </motion.div>
  );
}