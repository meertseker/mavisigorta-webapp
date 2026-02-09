'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { springs, entranceAnimations } from '@/lib/spring-animations';
import { glassCard } from '@/lib/glass-effects';

interface CourseCardProps {
  title: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  className?: string;
  image?: string;
}

export default function CourseCard({
  title,
  description,
  price,
  duration,
  features,
  popular = false,
  className = '',
  image,
}: CourseCardProps) {
  return (
    <motion.div
      variants={entranceAnimations}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={springs.smooth}
      className={`relative backdrop-blur-xl ${popular ? 'bg-white/95 dark:bg-gray-900/95 shadow-glass-xl' : 'bg-white/90 dark:bg-gray-900/90 shadow-glass-lg'} rounded-3xl border border-white/30 dark:border-white/10 overflow-hidden flex flex-col ${className}`}
    >
      {/* Popular badge with glass effect */}
      {popular && (
        <motion.div
          className="absolute top-4 right-4 z-10 backdrop-blur-xl bg-gradient-to-r from-secondary-gold to-secondary-amber text-gray-900 px-4 py-2 rounded-full font-bold text-sm shadow-glow-gold overflow-hidden"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={springs.bouncy}
        >
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          
          <span className="relative z-10">⭐ Popüler</span>
        </motion.div>
      )}

      {/* Glass header with image or gradient */}
      <div className="relative h-48 overflow-hidden">
        {image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </>
        ) : (
          <motion.div 
            className={`absolute inset-0 ${popular ? 'bg-gradient-to-br from-primary-red via-secondary-orange to-accent-rose' : 'bg-gradient-to-br from-primary-red/80 to-secondary-orange/80'}`}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            <svg viewBox="0 0 400 200" className="w-full h-full opacity-20" fill="white">
              <circle cx="100" cy="140" r="35" />
              <circle cx="300" cy="140" r="35" />
              <rect x="60" y="80" width="280" height="80" rx="15" />
            </svg>
          </motion.div>
        )}
        
        {/* Glass overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent backdrop-blur-sm"></div>
        
        {/* Glass reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-h3 font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">{description}</p>

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-1">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, ...springs.smooth }}
              className="flex items-start gap-3"
            >
              <motion.div
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={springs.bouncy}
              >
                <svg
                  className="w-full h-full text-secondary-orange"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
              <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link href="/iletisim">
          <motion.div
            className={`relative w-full py-4 rounded-2xl font-semibold text-center overflow-hidden ${
              popular
                ? 'bg-gradient-to-r from-primary-red to-secondary-orange text-white shadow-glow-red'
                : 'bg-gradient-to-r from-primary-red-dark to-accent-crimson text-white shadow-glow-red'
            }`}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 50px rgba(0, 102, 204, 0.7)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={springs.smooth}
          >
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            
            <span className="relative z-10">Teklif Al →</span>
          </motion.div>
        </Link>
      </div>

      {/* Glass card reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 hover:opacity-100 pointer-events-none transition-all duration-500 rounded-3xl"></div>
    </motion.div>
  );
}
