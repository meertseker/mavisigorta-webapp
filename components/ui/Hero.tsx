'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { springs } from '@/lib/spring-animations';
import { useEffect, useState } from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  primaryCta: { text: string; href: string };
  secondaryCta: { text: string; href: string };
  stats?: { value: string; label: string }[];
}

export default function Hero({ title, subtitle, primaryCta, secondaryCta, stats }: HeroProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 py-8 md:py-20">
      {/* Animated Blue Gradient Background */}
      <motion.div 
        className="absolute inset-0"
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      >
        <motion.div
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-radial from-primary-red/30 via-primary-red/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: ['0%', '20%', '0%'],
            y: ['0%', '30%', '0%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-secondary-orange/25 via-secondary-orange/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: ['-10%', '10%', '-10%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="relative container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          
          {/* Main Title Card - Spans most of the width */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="md:col-span-8 md:row-span-2 backdrop-blur-2xl bg-white/5 rounded-3xl p-6 md:p-12 border border-white/10 shadow-glass-xl overflow-hidden relative group"
          >
            {/* Background Image with Blur */}
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop"
                alt="Insurance Background"
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-br from-black/80 via-black/70 to-black/80"></div>
            </div>
            
            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-block mb-4 px-4 py-2 backdrop-blur-xl bg-primary-red/20 border border-primary-red/30 rounded-full"
              >
                <span className="text-secondary-orange font-semibold text-sm">🛡️ Sigorta Aracılık Hizmetleri</span>
              </motion.div>

              <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight text-white">
                {title}
              </h1>
              
              <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl leading-relaxed">
                {subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Link href={primaryCta.href}>
                  <motion.div
                    className="relative px-8 py-4 bg-gradient-to-r from-primary-red to-secondary-orange text-white rounded-2xl font-semibold text-lg shadow-glow-red overflow-hidden"
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: '0 0 50px rgba(0, 102, 204, 0.7)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={springs.smooth}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                    <span className="relative z-10">{primaryCta.text}</span>
                  </motion.div>
                </Link>
                
                <a href={secondaryCta.href} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    className="px-8 py-4 backdrop-blur-xl bg-gradient-to-r from-green-500 to-green-600 border-2 border-green-400/50 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-semibold text-lg shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 40px rgba(34, 197, 94, 0.6)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={springs.smooth}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Hızlı Teklif Al
                    </span>
                  </motion.div>
                </a>
              </div>

              {/* Services Preview Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="grid grid-cols-3 gap-4"
              >
                <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10 text-center overflow-hidden relative">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop"
                      alt="Health"
                      className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 backdrop-blur-md bg-primary-red/40"></div>
                  </div>
                  <div className="relative z-10">
                    <div className="text-3xl mb-2">🏥</div>
                    <h4 className="text-white font-bold text-sm mb-1">Sağlık</h4>
                    <p className="text-gray-300 text-xs">Tamamlayıcı & Modüler</p>
                  </div>
                </div>
                
                <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10 text-center overflow-hidden relative">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=400&h=400&fit=crop"
                      alt="Car"
                      className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 backdrop-blur-md bg-secondary-orange/40"></div>
                  </div>
                  <div className="relative z-10">
                    <div className="text-3xl mb-2">🚗</div>
                    <h4 className="text-white font-bold text-sm mb-1">Araç</h4>
                    <p className="text-gray-300 text-xs">Kasko & Trafik</p>
                  </div>
                </div>
                
                <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10 text-center overflow-hidden relative">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop"
                      alt="Home"
                      className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 backdrop-blur-md bg-accent-rose/40"></div>
                  </div>
                  <div className="relative z-10">
                    <div className="text-3xl mb-2">🏠</div>
                    <h4 className="text-white font-bold text-sm mb-1">Konut</h4>
                    <p className="text-gray-300 text-xs">DASK & Konut</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Cards - Bento Style */}
          {stats && stats.length > 0 && (
            <>
              {/* Stat 1 - Top Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="md:col-span-4 backdrop-blur-2xl bg-gradient-to-br from-primary-red/20 to-primary-red/5 rounded-3xl p-6 border border-primary-red/30 shadow-glow-red overflow-hidden relative group"
              >
                {/* Background Image with Blur */}
                <div className="absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                    alt="Experience"
                    className="w-full h-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-primary-red/60 via-primary-red/40 to-primary-red/60"></div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 text-center">
                  <motion.div 
                    className="text-5xl mb-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🏆
                  </motion.div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-white to-secondary-gold bg-clip-text text-transparent mb-2">
                    {stats[0]?.value || '25+'}
                  </div>
                  <div className="text-sm text-white/80 font-medium">{stats[0]?.label || 'Yıl Deneyim'}</div>
                </div>
              </motion.div>

              {/* Stat 2 - Middle Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="md:col-span-2 backdrop-blur-2xl bg-gradient-to-br from-secondary-orange/20 to-secondary-orange/5 rounded-3xl p-6 border border-secondary-orange/30 shadow-glow-orange overflow-hidden relative group"
              >
                {/* Background Image with Blur */}
                <div className="absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&h=600&fit=crop"
                    alt="Success"
                    className="w-full h-full object-cover opacity-25"
                  />
                  <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-secondary-orange/60 via-secondary-orange/40 to-secondary-orange/60"></div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-white to-secondary-amber bg-clip-text text-transparent mb-1">
                    {stats[1]?.value || '%98'}
                  </div>
                  <div className="text-xs text-white/80 font-medium">{stats[1]?.label || 'Memnuniyet'}</div>
                </div>
              </motion.div>

              {/* Stat 3 - Bottom Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="md:col-span-2 backdrop-blur-2xl bg-gradient-to-br from-accent-rose/20 to-accent-rose/5 rounded-3xl p-6 border border-accent-rose/30 shadow-glass-xl overflow-hidden relative group"
              >
                {/* Background Image with Blur */}
                <div className="absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=600&fit=crop"
                    alt="Customers"
                    className="w-full h-full object-cover opacity-25"
                  />
                  <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-accent-rose/60 via-accent-rose/40 to-accent-rose/60"></div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 text-center">
                  <div className="text-3xl mb-2">👥</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-white to-secondary-gold bg-clip-text text-transparent mb-1">
                    {stats[2]?.value || '10K+'}
                  </div>
                  <div className="text-xs text-white/80 font-medium">{stats[2]?.label || 'Müşteri'}</div>
                </div>
              </motion.div>

              {/* Contact Card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="hidden md:block md:col-span-6 backdrop-blur-2xl bg-gradient-to-br from-secondary-orange/20 to-accent-rose/20 rounded-3xl p-6 border border-secondary-orange/30 shadow-glow-orange overflow-hidden relative group"
              >
                {/* Background Image with Blur */}
                <div className="absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&h=600&fit=crop"
                    alt="Contact"
                    className="w-full h-full object-cover opacity-20"
                  />
                  <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-secondary-orange/60 via-accent-rose/40 to-accent-rose/60"></div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl mb-4"
                  >
                    📞
                  </motion.div>
                  <h3 className="text-white font-bold text-xl mb-2">Bize Ulaşın</h3>
                  <p className="text-gray-300 text-sm mb-4">7/24 Danışmanlık</p>
                  <a 
                    href="tel:05324807617"
                    className="block text-secondary-gold hover:text-secondary-amber font-bold text-lg transition-colors"
                  >
                    0532 480 76 17
                  </a>
                </div>
              </motion.div>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="hidden md:block md:col-span-6 backdrop-blur-2xl bg-white/5 rounded-3xl p-6 border border-white/10 shadow-glass-xl overflow-hidden relative group hover:bg-white/10 transition-all"
              >
                {/* Background Image with Blur */}
                <div className="absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop"
                    alt="Trust"
                    className="w-full h-full object-cover opacity-20"
                  />
                  <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-primary-red/60 via-black/50 to-black/70"></div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-accent-rose/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 text-center">
                  <div className="inline-block p-4 backdrop-blur-xl bg-primary-red/20 rounded-2xl border border-primary-red/30 mb-3">
                    <svg className="w-10 h-10 text-secondary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold mb-2">Allianz Yetkili</h3>
                  <p className="text-gray-400 text-sm">Güvenilir sigorta çözümleri</p>
                </div>
              </motion.div>
            </>
          )}

        </div>
      </div>

      {/* Glass Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="rgba(17,24,39,0.5)"
          />
        </svg>
      </div>
    </div>
  );
}
