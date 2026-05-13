import { motion } from 'framer-motion';

export function Homepage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-slate-950 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-3xl text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">StudyBuddy Discussion Portal</h1>
        <p className="text-lg opacity-70 leading-relaxed">
          This is the discussion page placeholder. Once your discussion functionality is ready, it will appear here.
        </p>
      </motion.div>
    </div>
  );
}
