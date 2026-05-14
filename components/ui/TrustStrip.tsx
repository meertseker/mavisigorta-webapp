import type { Partner } from '@/lib/types';

interface TrustStripProps {
  partners: Partner[];
  yearsActive?: number;
  phone?: string;
  variant?: 'light' | 'dark';
  showLicense?: boolean;
}

export default function TrustStrip({
  partners,
  yearsActive = 25,
  phone,
  variant = 'light',
  showLicense = true,
}: TrustStripProps) {
  const bg = variant === 'light' ? 'bg-white/70 dark:bg-gray-900/60' : 'bg-black/30';
  const fg = 'text-gray-700 dark:text-gray-200';

  return (
    <div className={`relative ${bg} backdrop-blur-xl border-y border-white/30 dark:border-white/10`}>
      <div className="container mx-auto px-4 py-5 md:py-6">
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 justify-between">
          <div className="flex items-center gap-3 text-center lg:text-left">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-gold to-secondary-amber flex items-center justify-center text-xl font-bold text-white shadow-lg shrink-0">
              {yearsActive}
            </div>
            <div className="min-w-0">
              <div className={`font-bold text-sm md:text-base ${fg}`}>
                {yearsActive} yıllık deneyim, {partners.length} anlaşmalı şirket
              </div>
              {showLicense && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  SEDDK lisanslı acente · KVKK uyumlu
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 flex-1 max-w-3xl">
            {partners.map((p) =>
              p.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={p.name}
                  src={p.logo}
                  alt={`${p.name} logosu`}
                  title={p.name}
                  className="h-8 md:h-10 w-auto object-contain opacity-80 hover:opacity-100 grayscale hover:grayscale-0 transition duration-200 dark:brightness-110"
                  loading="lazy"
                />
              ) : (
                <span
                  key={p.name}
                  className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-wide"
                  title={p.name}
                >
                  {p.name}
                </span>
              )
            )}
          </div>

          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-red text-white font-semibold text-sm hover:bg-primary-red-dark transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {phone}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
