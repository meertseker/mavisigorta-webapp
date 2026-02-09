'use client';

import { motion } from 'framer-motion';
import { springs, entranceAnimations } from '@/lib/spring-animations';
import { glassCard } from '@/lib/glass-effects';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export default function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      variants={entranceAnimations}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay, ...springs.smooth }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-3xl p-8 shadow-glass-lg border border-white/30 dark:border-white/10 overflow-hidden"
    >
      {/* Icon with glass effect */}
      <motion.div 
        className="relative inline-flex p-4 bg-gradient-to-br from-primary-red to-secondary-orange rounded-2xl mb-6 shadow-glow-red overflow-hidden"
        whileHover={{ scale: 1.15, rotate: 5 }}
        transition={springs.bouncy}
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
        
        {/* Pulsing glow */}
        <motion.div
          className="absolute inset-0 bg-primary-red rounded-2xl opacity-50 blur-lg"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <div className="text-white w-8 h-8 relative z-10">{icon}</div>
      </motion.div>

      {/* Title */}
      <h3 className="text-h3 font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-red dark:group-hover:text-primary-red-light transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>

      {/* Glass reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-500 pointer-events-none"></div>

      {/* Decorative corner glow */}
      <motion.div 
        className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-red/20 to-secondary-orange/20 rounded-bl-full blur-2xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={springs.smooth}
      />
    </motion.div>
  );
}
