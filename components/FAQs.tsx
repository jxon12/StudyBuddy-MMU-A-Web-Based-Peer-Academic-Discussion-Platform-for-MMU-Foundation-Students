import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft } from 'lucide-react';

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-slate-100 rounded-3xl overflow-hidden mb-4 bg-white/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between group"
      >
        <span className="font-bold text-lg text-slate-900 pr-4">{question}</span>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-slate-900 text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-900'}`}>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronRight size={18} className="rotate-90" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-slate-500 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQScreen = ({ onBack }: { onBack: () => void }) => {
  const faqs = [
    {
      question: "What exactly is MMU StudyBuddy?",
      answer: "StudyBuddy is a student-led initiative designed to make Multimedia University a more collaborative place. It allows you to find partners for projects, discovery study groups for difficult subjects, and share notes in a verified environment."
    },
    {
      question: "Is this portal officially connected to CamSys?",
      answer: "While we use official subject codes and curriculum data, StudyBuddy is a separate companion platform focused on student interaction and peer-to-peer learning, rather than administrative tasks like tuition or grades."
    },
    {
      question: "Can I use a personal Gmail to sign up?",
      answer: "To ensure a safe and exclusive community for MMU students, we only allow registrations using official @student.mmu.edu.my email addresses. This verifies every user is a current student."
    },
    {
      question: "How do I find a study partner for my specific course?",
      answer: "Once you log in and select your current subjects, the portal will automatically suggest students who are taking the same classes. You can then reach out to them to form a 'Buddy Group'."
    },
    {
      question: "Is there a mobile app for StudyBuddy?",
      answer: "We are currently a web-based platform optimized for both desktop and mobile browsers. You can 'Add to Home Screen' on your phone for a native app-like experience!"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-20 px-6">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="mb-12 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold uppercase tracking-widest text-xs group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to portal
      </motion.button>

      <div className="w-full max-w-2xl">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6"
          >
            StudyBuddy - Student Portal
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-display text-5xl font-bold text-slate-900 tracking-tighter uppercase"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </motion.div>

        <footer className="mt-20 text-center">
          <p className="text-slate-400 text-sm font-medium">Still have questions?</p>
          <button className="mt-4 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-widest text-xs">
            Contact Student Support
          </button>
        </footer>
      </div>
    </div>
  );
};
