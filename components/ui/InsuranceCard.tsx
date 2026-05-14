'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { springs, entranceAnimations } from '@/lib/spring-animations';
import type { InsuranceSlug } from '@/lib/types';

interface InsuranceCardProps {
  id: InsuranceSlug;
  title: string;
  description: string;
  duration: string;
  features: string[];
  popular?: boolean;
  className?: string;
  image?: string;
  priceRange?: { min: number; max: number; unit: 'yillik' | 'aylik' };
}

function formatPrice(n: number): string {
  return n.toLocaleString('tr-TR');
}

export default function InsuranceCard({
  id,
  title,
  description,
  duration,
  features,
  popular = false,
  className = '',
  image,
  priceRange,
}: InsuranceCardProps) {
  const quoteHref = `/teklif/${id}`;
  const detailHref = `/sigortalar/${id}`;

  return (
    <motion.div
      variants={entranceAnimations}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={springs.smooth}
      className={`relative backdrop-blur-xl ${
        popular
          ? 'bg-white/95 dark:bg-gray-900/95 shadow-glass-xl ring-2 ring-secondary-gold/40'
          : 'bg-white/90 dark:bg-gray-900/90 shadow-glass-lg'
      } rounded-3xl border border-white/30 dark:border-white/10 overflow-hidden flex flex-col ${className}`}
    >
      {popular && (
        <motion.div
          className="absolute top-4 right-4 z-10 backdrop-blur-xl bg-gradient-to-r from-secondary-gold to-secondary-amber text-gray-900 px-4 py-2 rounded-full font-bold text-sm shadow-glow-gold overflow-hidden"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={springs.bouncy}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
          <span className="relative z-10">⭐ En Çok Tercih Edilen</span>
        </motion.div>
      )}

      <div className="relative h-44 overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={`absolute inset-0 ${
              popular
                ? 'bg-gradient-to-br from-primary-red via-secondary-orange to-accent-rose'
                : 'bg-gradient-to-br from-primary-red/80 to-secondary-orange/80'
            }`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-h3 font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>

        {priceRange && (
          <div className="mb-4 px-3 py-2 rounded-xl bg-secondary-gold/10 border border-secondary-gold/30">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Tahmini {priceRange.unit === 'yillik' ? 'yıllık' : 'aylık'} prim
            </span>
            <div className="text-base font-bold text-gray-900 dark:text-white">
              ₺{formatPrice(priceRange.min)} – ₺{formatPrice(priceRange.max)}
            </div>
          </div>
        )}

        <ul className="space-y-2 mb-6 flex-1">
          {features.slice(0, 4).map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-secondary-orange flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Link
            href={quoteHref}
            className="text-center px-3 py-3 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-primary-red to-secondary-orange shadow-glow-red hover:scale-105 transition-transform"
          >
            60sn'de Teklif
          </Link>
          <Link
            href={detailHref}
            className="text-center px-3 py-3 rounded-xl font-semibold text-sm border border-white/40 dark:border-white/20 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
          >
            Detay
          </Link>
        </div>
        <span className="mt-2 block text-center text-xs text-gray-500 dark:text-gray-400">
          {duration} poliçe
        </span>
      </div>
    </motion.div>
  );
}
