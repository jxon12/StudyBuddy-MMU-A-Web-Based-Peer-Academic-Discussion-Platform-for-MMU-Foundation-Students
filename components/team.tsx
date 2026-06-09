import { motion } from 'framer-motion';
import { User, ChevronLeft } from 'lucide-react';

export function Team({ onBackToHome }: { onBackToHome: () => void }) {
  const teamMembers = [
    { name: 'Liou Zi En', role: 'Full-Stack Developer ', image: '/images/team/liou-zi-en.jpeg', bio: 'Email: LIOU.ZI.EN@student.mmu.edu.my' },
    { name: 'Ling Yi Yon', role: 'UI/UX Designer + Developer', image: '/images/team/ling-yi-yon.jpeg', bio: 'Email: LING.YI.YON@student.mmu.edu.my' },
    { name: 'Tan Kenji', role: 'Frontend Developer', image: '/images/team/tan-kenji.jpeg', bio: 'Email: TAN.KENJI@student.mmu.edu.my' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="pt-[180px] pb-32 px-4 max-w-6xl mx-auto w-full"
    >
      <div className="mb-20 pb-12 border-b border-white/20">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-[13px] md:text-[14px] font-semibold text-apple-blue hover:opacity-100 opacity-70 transition-opacity mb-2 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        <h1 className="text-[56px] md:text-[64px] font-bold tracking-tight">StudyBuddy Leadership</h1>
      </div>

      <div className="space-y-32">
        <section>
          <h2 className="text-[32px] font-semibold tracking-tight mb-16">Founding Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {teamMembers.map((member, i) => (
              <motion.div 
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-6"
              >
                <div className="w-full aspect-square overflow-hidden group cursor-pointer relative rounded-[32px] bg-white/5 shadow-lg border border-white/10 flex items-center justify-center">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-black/10 dark:bg-white/5 flex items-center justify-center relative overflow-hidden">
                      <div className="text-center group-hover:scale-105 transition-transform duration-700">
                        <User className="w-16 h-16 opacity-20 mx-auto" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="text-[18px] font-semibold text-apple-blue cursor-pointer hover:opacity-80 transition-opacity">
                    {member.name}
                  </div>
                  <div className="text-[15px] font-medium opacity-70">
                    {member.role}
                  </div>
                  <p className="text-[14px] opacity-60 leading-relaxed mt-2">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>


      </div>
    </motion.div>
  );
}
