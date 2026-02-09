'use client';

import { motion } from 'framer-motion';
import { springs, scaleAnimation } from '@/lib/spring-animations';
import { glassCard } from '@/lib/glass-effects';

interface TestimonialCardProps {
  name: string;
  course: string;
  rating: number;
  text: string;
  image?: string;
  delay?: number;
}

export default function TestimonialCard({
  name,
  course,
  rating,
  text,
  image,
  delay = 0,
}: TestimonialCardProps) {
  return (
    <motion.div
      variants={scaleAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay, ...springs.bouncy }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-3xl p-8 shadow-glass-lg border border-white/30 dark:border-white/10 overflow-hidden"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <motion.svg
            key={i}
            className={`w-5 h-5 ${
              i < rating ? 'text-secondary-gold' : 'text-gray-300 dark:text-gray-600'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + i * 0.1, ...springs.bouncy }}
            whileHover={{ scale: 1.2, rotate: 72 }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </motion.svg>
        ))}
      </div>

      {/* Quote */}
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic text-body">
        <span className="text-primary-red text-2xl">"</span>
        {text}
        <span className="text-primary-red text-2xl">"</span>
      </p>

      {/* Author */}
      <div className="flex items-center gap-4 relative z-10">
        <motion.div 
          className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary-red to-secondary-orange flex items-center justify-center text-white font-bold text-lg shadow-glow-red overflow-hidden"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={springs.bouncy}
        >
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
          
          <span className="relative z-10">{name.charAt(0)}</span>
        </motion.div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{course}</div>
        </div>
      </div>

      {/* Quotation mark decoration with glass effect */}
      <div className="absolute top-6 right-6 text-primary-red/10 dark:text-primary-red/20 opacity-50">
        <motion.svg 
          className="w-16 h-16" 
          fill="currentColor" 
          viewBox="0 0 24 24"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </motion.svg>
      </div>
      
      {/* Glass reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none rounded-3xl" />
    </motion.div>
  );
}
