import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, BookOpen, Settings, ShieldCheck, MessageCircle } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Questions', icon: HelpCircle },
  { id: 'academic', name: 'Academic', icon: BookOpen },
  { id: 'technical', name: 'Technical', icon: Settings },
  { id: 'account', name: 'Account & Security', icon: ShieldCheck },
];

const FAQS = [
  {
    category: 'academic',
    question: "How do I find questions for a specific subject?",
    answer: "You can use the 'Select Subject' dropdown on the dashboard to filter by your specific MMU subject code (e.g., FCS0011). You can further narrow it down by selecting the specific chapter or topic."
  },
  {
    category: 'academic',
    question: "What is the ranking system on the feed?",
    answer: "StudyBuddy uses a quality-first ranking algorithm. Your feed is ordered by a score calculated as Upvotes minus Downvotes. This ensures that accurate, helpful answers from the community are always seen first."
  },
  {
    category: 'technical',
    question: "Is there a mobile app available?",
    answer: "Currently, StudyBuddy MMU is a Progressive Web App (PWA) optimized for mobile browsers. You can 'Add to Home Screen' on your iOS or Android device for a native-like experience with quick access."
  },
  {
    category: 'account',
    question: "Can I join if I'm not a Foundation student?",
    answer: "While we prioritize Foundation students due to the structure of the platform, any student with an active MMU email address can join. However, the subject codes and chapters are currently curated specifically for the Foundation curriculum."
  },
  {
    category: 'technical',
    question: "How do I report a bug or incorrect information?",
    answer: "If you find a technical bug or factually incorrect information in a post, you can use the 'Report' button on the specific thread, or contact our support team directly through the 'Contact Us' page."
  },
  {
    category: 'account',
    question: "How secure is my data on StudyBuddy?",
    answer: "We use enterprise-grade encryption for all user data. Your MMU credentials are never stored directly on our servers; we use secure authentication tokens to ensure your privacy remains protected."
  }
];

function FAQItem({ question, answer, isOpen, onClick, index }: { question: string, answer: string, isOpen: boolean, onClick: () => void, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card !p-0 overflow-hidden mb-4 group border-white/5 hover:border-white/20 transition-colors"
    >
      <button
        onClick={onClick}
        className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-6 focus:outline-none"
      >
        <span className="text-[18px] md:text-[20px] font-semibold tracking-tight leading-tight group-hover:text-apple-blue transition-colors">
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full liquid-glass flex items-center justify-center transition-transform duration-500 ${isOpen ? 'rotate-180 bg-apple-blue/20 text-apple-blue' : 'opacity-40 group-hover:opacity-100'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="px-8 pb-8 text-[16px] md:text-[17px] opacity-60 leading-relaxed max-w-4xl">
              <div className="pt-2 border-t border-white/10 mt-2">
                {answer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredFaqs = activeCategory === 'all' 
    ? FAQS 
    : FAQS.filter(faq => faq.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="pt-[180px] pb-32 px-4 max-w-6xl mx-auto w-full"
    >
      <div className="text-center mb-20 space-y-4">
        <motion.span 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 rounded-full bg-apple-blue/10 text-apple-blue text-[13px] font-bold tracking-widest uppercase mb-4"
        >
          Knowledge Base
        </motion.span>
        <h1 className="text-[48px] md:text-[64px] font-bold tracking-tight mb-4 leading-[1.1]">
          How can we help?
        </h1>
        <p className="text-[19px] md:text-[21px] opacity-60 max-w-2xl mx-auto font-medium">
          Find answers to frequently asked questions about the platform, academic features, and your account.
        </p>
      </div>

      {/* Category Selection */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndex(null);
              }}
              className={`h-[44px] px-6 rounded-[22px] flex items-center gap-2.5 transition-all text-[15px] font-semibold ${
                isActive 
                  ? 'bg-apple-blue text-white shadow-lg shadow-apple-blue/20' 
                  : 'liquid-glass opacity-60 hover:opacity-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-apple-blue'}`} />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredFaqs.map((faq, i) => (
            <FAQItem
              key={faq.question}
              index={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </AnimatePresence>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-20 opacity-40 italic">
            No questions found in this category.
          </div>
        )}
      </div>

      {/* Contact CTA */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-32 pt-24 border-t border-white/10"
      >
        <div className="glass-card !p-12 md:!p-20 text-center relative overflow-hidden group">
          {/* Subtle animate glow */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-apple-blue via-apple-indigo to-apple-purple opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative z-10 space-y-8">
            <div className="w-16 h-16 rounded-[20px] bg-apple-blue/10 flex items-center justify-center mx-auto text-apple-blue">
               <MessageCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tight mb-4">Still have questions?</h3>
              <p className="opacity-60 max-w-xl mx-auto text-[18px]">
                Can't find the answer you're looking for? Our student support team is always ready to help you navigate StudyBuddy.
              </p>
            </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="apple-button-primary min-w-[220px]">Contact Support</button>
              <button
                className="apple-button-secondary min-w-[220px]"
                onClick={() => { onNavigate?.('feedback'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                Feedback
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}