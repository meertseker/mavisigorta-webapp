'use client';

import { motion } from 'framer-motion';
import { springs, entranceAnimations } from '@/lib/spring-animations';
import { glassCard } from '@/lib/glass-effects';

interface TrustBadgeProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: 'blue' | 'green' | 'orange' | 'purple';
  delay?: number;
}

export default function TrustBadge({ 
  icon, 
  title, 
  description, 
  color = 'blue',
  delay = 0 
}: TrustBadgeProps) {
  const colorClasses = {
    blue: {
      gradient: 'from-primary-red to-secondary-orange',
      text: 'text-primary-red',
      iconBg: 'bg-primary-red/10 dark:bg-primary-red/20',
      glow: 'shadow-glow-red',
    },
    green: {
      gradient: 'from-secondary-orange to-secondary-amber',
      text: 'text-secondary-orange',
      iconBg: 'bg-secondary-orange/10 dark:bg-secondary-orange/20',
      glow: 'shadow-glow-orange',
    },
    orange: {
      gradient: 'from-secondary-amber to-secondary-gold',
      text: 'text-secondary-amber',
      iconBg: 'bg-secondary-amber/10 dark:bg-secondary-amber/20',
      glow: 'shadow-glow-gold',
    },
    purple: {
      gradient: 'from-accent-rose to-primary-red-light',
      text: 'text-accent-rose',
      iconBg: 'bg-accent-rose/10 dark:bg-accent-rose/20',
      glow: 'shadow-glow-red',
    },
  };

  const classes = colorClasses[color];

  return (
    <motion.div
      variants={entranceAnimations}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay, ...springs.smooth }}
      whileHover={{ y: -8, scale: 1.05 }}
      className="relative group"
    >
      <div className="relative backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-3xl p-6 shadow-glass border border-white/30 dark:border-white/10 overflow-hidden">
        {/* Icon with glass effect */}
        <motion.div 
          className={`inline-flex p-4 ${classes.iconBg} backdrop-blur-lg rounded-2xl mb-4 overflow-hidden relative`}
          whileHover={{ scale: 1.15, rotate: 5 }}
          transition={springs.bouncy}
        >
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
          
          <div className={`${classes.text} relative z-10`}>{icon}</div>
        </motion.div>

        {/* Badge with glass effect */}
        <motion.div 
          className={`inline-block px-3 py-1 bg-gradient-to-r ${classes.gradient} text-white text-xs font-bold rounded-full mb-3 ${classes.glow} overflow-hidden relative`}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2, ...springs.bouncy }}
        >
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
          
          <span className="relative z-10">✓ Güvenilir</span>
        </motion.div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 relative z-10">{title}</h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">{description}</p>

        {/* Glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none rounded-3xl"></div>
        
        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-200%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}
