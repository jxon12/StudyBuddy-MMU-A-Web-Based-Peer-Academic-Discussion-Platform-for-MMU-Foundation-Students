import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Heart, Rocket, Users, Coffee, Cpu } from 'lucide-react';

const MISSION_PILLARS = [
  {
    title: "Democratizing Knowledge",
    icon: Users,
    content: "We believe that the best explanations don't always come from textbooks, but from peers who just finished the same chapter. Our mission is to make that student-to-student knowledge transfer seamless."
  },
  {
    title: "Spatial Learning",
    icon: Cpu,
    content: "We're tired of clunky portals from the 2000s. We're building a futuristic, spatial interface that makes studying feel like exploring a digital world, not just reading PDFs."
  },
  {
    title: "Academic Integrity",
    icon: Target,
    content: "Our goal isn't to provide shortcuts, but to provide clarity. We want to help MMU students understand the 'why' behind the 'what' through high-quality community curation."
  }
];

type MissionPageProps = {
  onGetInvolved: () => void;
};

export function MissionPage({ onGetInvolved }: MissionPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="pt-[180px] pb-32 px-4 max-w-6xl mx-auto w-full"
    >
      {/* Hero Section */}
      <div className="text-center mb-32 relative">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-block px-4 py-1.5 rounded-full bg-apple-blue/10 text-apple-blue text-[13px] font-bold tracking-widest uppercase mb-8"
        >
          Our Purpose
        </motion.div>
        <h1 className="text-[54px] md:text-[82px] font-bold tracking-tighter mb-8 leading-[1.05]">
          A new era for <br /> <span className="text-apple-blue">civic intelligence.</span>
        </h1>
        <p className="text-[20px] md:text-[24px] opacity-60 max-w-3xl mx-auto leading-relaxed font-medium">
          StudyBuddy MMU was born from a simple observation: students at Multimedia University deserve better digital tools.
        </p>
      </div>

      {/* Honesty Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-40">
        <div className="space-y-8">
          <div className="w-14 h-14 rounded-2xl bg-apple-coral/10 flex items-center justify-center text-apple-coral">
             <Heart className="w-7 h-7" />
          </div>
          <h2 className="text-[40px] font-bold tracking-tight leading-tight">Born from frustration, built with love.</h2>
          <div className="space-y-6 text-[18px] opacity-70 leading-relaxed font-medium">
            <p>
              Let's be honest: university portals are often where good design goes to die. They are slow, confusing, and feel like they were built for an era before the iPhone existed.
            </p>
            <p>
              We started StudyBuddy as a project to prove that academic software can be beautiful, fast, and actually enjoyable to use. We wanted to build something that felt like a seamless extension of the devices we use every day.
            </p>
          </div>
        </div>
        <div className="glass-card !p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
            <Coffee className="w-32 h-32" />
          </div>
          <div className="space-y-6 relative z-10">
            <div className="text-[14px] font-bold tracking-widest uppercase text-apple-blue">Current Status</div>
            <h3 className="text-2xl font-bold">The Honest Truth</h3>
            <p className="text-[17px] opacity-60 leading-relaxed">
              We aren't a multi-million dollar corporation. We're a team of developers and students trying to solve our own problems. This is an alpha project—there will be bugs, and features will evolve. But every line of code is written with the goal of making your academic life at MMU just a little bit easier.
            </p>
            <div className="pt-4">
               <div className="flex items-center gap-3 text-apple-blue">
                 <Rocket className="w-5 h-5" />
                 <span className="font-bold">Beta testing in Cyberjaya</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {MISSION_PILLARS.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card"
            >
              <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center text-apple-blue mb-6">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-[22px] font-bold tracking-tight mb-4">{pillar.title}</h3>
              <p className="opacity-60 leading-relaxed font-medium">
                {pillar.content}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Final Statement */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-40 text-center py-20 border-t border-white/10"
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Join the movement.</h2>
        <p className="text-[19px] opacity-60 mb-10 max-w-2xl mx-auto">
          We're just getting started. If you're an MMU student who cares about better tools, help us build the future of study platforms.
        </p>
        <button className="apple-button-primary mx-auto" onClick={onGetInvolved}>Get Involved</button>
      </motion.div>
    </motion.div>
  );
}