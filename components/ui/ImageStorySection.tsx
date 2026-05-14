'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { springs } from '@/lib/spring-animations';

interface ImageStorySectionProps {
  eyebrow?: string;
  title: string;
  description: string;
  bullets?: string[];
  image: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  variant?: 'light' | 'tinted';
}

export default function ImageStorySection({
  eyebrow,
  title,
  description,
  bullets,
  image,
  imageAlt,
  imagePosition = 'right',
  primaryCta,
  secondaryCta,
  variant = 'light',
}: ImageStorySectionProps) {
  const sectionBg =
    variant === 'tinted'
      ? 'bg-gradient-to-br from-primary-red/5 via-secondary-orange/5 to-accent-rose/5 dark:from-primary-red/10 dark:via-secondary-orange/10 dark:to-accent-rose/10'
      : '';

  return (
    <section className={`relative py-16 md:py-24 overflow-hidden ${sectionBg}`}>
      <div className="container mx-auto px-4">
        <div
          className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center max-w-6xl mx-auto ${
            imagePosition === 'left' ? 'md:[&>*:first-child]:order-2' : ''
          }`}
        >
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: imagePosition === 'left' ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ...springs.smooth }}
          >
            {eyebrow && (
              <div className="inline-block mb-4 px-4 py-1.5 bg-primary-red/10 dark:bg-primary-red/20 text-primary-red dark:text-primary-red-light rounded-full text-sm font-semibold border border-primary-red/20">
                {eyebrow}
              </div>
            )}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
              {title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {description}
            </p>

            {bullets && bullets.length > 0 && (
              <ul className="space-y-3 mb-8">
                {bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08, ...springs.smooth }}
                    className="flex items-start gap-3"
                  >
                    <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-primary-red to-secondary-orange flex items-center justify-center shadow-glow-red">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-700 dark:text-gray-200 font-medium">{b}</span>
                  </motion.li>
                ))}
              </ul>
            )}

            {(primaryCta || secondaryCta) && (
              <div className="flex flex-wrap gap-3">
                {primaryCta && (
                  <Link
                    href={primaryCta.href}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-primary-red to-secondary-orange text-white rounded-2xl font-semibold shadow-glow-red hover:scale-105 transition-transform"
                  >
                    {primaryCta.text}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
                {secondaryCta && (
                  <Link
                    href={secondaryCta.href}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-white dark:bg-white/10 border-2 border-primary-red/20 dark:border-white/20 text-primary-red dark:text-white rounded-2xl font-semibold hover:bg-primary-red/5 dark:hover:bg-white/20 transition-colors"
                  >
                    {secondaryCta.text}
                  </Link>
                )}
              </div>
            )}
          </motion.div>

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: imagePosition === 'left' ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ...springs.smooth }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={imageAlt}
                className="w-full h-full object-cover object-[center_19.5%] transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Color tint overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-red/20 via-transparent to-secondary-orange/20 mix-blend-multiply pointer-events-none" />
              {/* Bottom gradient for depth */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>

            {/* Decorative floating accent shapes */}
            <motion.div
              aria-hidden="true"
              className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary-red to-secondary-orange rounded-2xl opacity-80 -z-10 blur-xl"
              animate={{ rotate: [0, 6, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-accent-rose to-primary-red rounded-full opacity-60 -z-10 blur-2xl"
              animate={{ rotate: [0, -8, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
