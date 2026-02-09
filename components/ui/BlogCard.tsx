'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { springs, entranceAnimations } from '@/lib/spring-animations';
import { glassCard } from '@/lib/glass-effects';

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  slug: string;
  tags: string[];
  image?: string;
  delay?: number;
}

export default function BlogCard({
  title,
  excerpt,
  category,
  date,
  slug,
  tags,
  image,
  delay = 0,
}: BlogCardProps) {
  return (
    <motion.div
      variants={entranceAnimations}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay, ...springs.smooth }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <Link href={`/blog/${slug}`} className="block">
        <div className="relative backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-glass-lg border border-white/30 dark:border-white/10 overflow-hidden">
          {/* Image with glass gradient */}
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
                className="absolute inset-0 bg-gradient-to-br from-primary-red via-secondary-orange to-accent-rose"
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
                {/* Blog image placeholder */}
                <svg viewBox="0 0 400 200" className="w-full h-full opacity-20" fill="white">
                  <rect x="50" y="80" width="300" height="80" rx="10" />
                  <circle cx="100" cy="50" r="20" />
                  <path d="M 100 120 L 150 80 L 200 100 L 250 70 L 300 90 L 300 160 L 100 160 Z" opacity="0.5"/>
                </svg>
              </motion.div>
            )}
            
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300 backdrop-blur-sm"></div>
            
            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
            
            {/* Category badge with glass */}
            <div className="absolute top-4 left-4">
              <motion.span 
                className="px-4 py-2 backdrop-blur-xl bg-white/90 dark:bg-depth-dark-floating text-primary-red dark:text-primary-red-light text-sm font-semibold rounded-full shadow-glass border border-white/30 dark:border-white/20"
                whileHover={{ scale: 1.05 }}
                transition={springs.snappy}
              >
                {category}
              </motion.span>
            </div>

            {/* Overlay icon with glass effect */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1 }}
              transition={springs.bouncy}
            >
              <div className="w-16 h-16 backdrop-blur-2xl bg-white/90 dark:bg-depth-dark-floating rounded-full flex items-center justify-center shadow-glass-lg border border-white/30 dark:border-white/20">
                <svg
                  className="w-8 h-8 text-primary-red dark:text-primary-red-light"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6 relative">
            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{date}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-red dark:group-hover:text-primary-red-light transition-colors duration-300 line-clamp-2">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">{excerpt}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag, index) => (
                <motion.span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs rounded-full font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: delay + 0.1 * index, ...springs.bouncy }}
                  whileHover={{ scale: 1.1 }}
                >
                  #{tag}
                </motion.span>
              ))}
            </div>

            {/* Read more */}
            <div className="flex items-center gap-2 text-primary-red dark:text-primary-red-light font-semibold group-hover:gap-3 transition-all duration-300">
              <span>Devamını Oku</span>
              <motion.svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </div>
          </div>
          
          {/* Glass reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-3xl"></div>
        </div>
      </Link>
    </motion.div>
  );
}
