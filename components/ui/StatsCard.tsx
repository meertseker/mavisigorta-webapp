'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { springs, entranceAnimations } from '@/lib/spring-animations';
import { glassCard } from '@/lib/glass-effects';

interface StatsCardProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon?: React.ReactNode;
  delay?: number;
}

export default function StatsCard({
  value,
  label,
  suffix = '',
  prefix = '',
  icon,
  delay = 0,
}: StatsCardProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  return (
    <motion.div
      variants={entranceAnimations}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onViewportEnter={() => setIsVisible(true)}
      transition={{ delay, ...springs.smooth }}
      whileHover={{ y: -8, scale: 1.05 }}
      className="relative group"
    >
      <div className="relative backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-3xl p-8 shadow-glass-lg border border-white/30 dark:border-white/10 overflow-hidden">
        {/* Icon */}
        {icon && (
          <motion.div 
            className="inline-flex p-3 bg-gradient-to-br from-primary-red to-secondary-orange rounded-2xl mb-4 shadow-glow-red overflow-hidden relative"
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={springs.bouncy}
          >
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
            
            <div className="text-white relative z-10">{icon}</div>
          </motion.div>
        )}

        {/* Value with counter animation */}
        <div className="mb-2 relative">
          <motion.span 
            className="text-5xl font-bold text-white"
          >
            {prefix}
            {count.toLocaleString('tr-TR')}
            {suffix}
          </motion.span>
        </div>

        {/* Label */}
        <p className="text-white dark:text-white font-medium relative z-10">{label}</p>

        {/* Glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent group-hover:from-white/20 rounded-3xl transition-all duration-500 pointer-events-none"></div>
        
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary-red/0 to-secondary-orange/0 rounded-3xl blur-xl"
          whileHover={{
            background: 'linear-gradient(to bottom right, rgba(0,102,204,0.15), rgba(0,163,224,0.15))',
          }}
          transition={springs.smooth}
        />
      </div>
    </motion.div>
  );
}
