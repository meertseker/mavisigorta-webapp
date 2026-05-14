'use client';

import { useEffect, useState } from 'react';
import { buildWaUrl, buildTelHref, type WhatsappContext } from '@/lib/whatsapp';
import { trackPhoneClick, trackWhatsappClick } from '@/lib/analytics';

interface FloatingCTAStackProps {
  phone: string;
  whatsapp: string;
  product?: WhatsappContext;
  /** Hide on mobile (where MobileStickyBar handles the same CTAs). */
  hideOnMobile?: boolean;
}

export default function FloatingCTAStack({
  phone,
  whatsapp,
  product = 'genel',
  hideOnMobile = true,
}: FloatingCTAStackProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const waUrl = buildWaUrl({ product, number: whatsapp });

  return (
    <div
      aria-hidden={!visible}
      className={`fixed right-4 bottom-24 md:bottom-8 z-40 flex flex-col gap-3 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      } ${hideOnMobile ? 'hidden md:flex' : 'flex'}`}
    >
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile teklif al"
        onClick={() => trackWhatsappClick('floating_cta', product)}
        className="group relative h-14 w-14 md:h-16 md:w-16 rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/40 flex items-center justify-center hover:scale-110 transition-transform"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 group-hover:opacity-0" />
        <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 relative" fill="currentColor">
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.5 5.265l-.999 3.648 3.988-.612zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
        </svg>
      </a>

      <a
        href={buildTelHref(phone)}
        aria-label={`Hemen ara: ${phone}`}
        onClick={() => trackPhoneClick('floating_cta')}
        className="group relative h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary-red text-white shadow-2xl shadow-primary-red/40 flex items-center justify-center hover:scale-110 transition-transform"
      >
        <span className="absolute inset-0 rounded-full bg-primary-red animate-ping opacity-30 group-hover:opacity-0" />
        <svg className="w-6 h-6 md:w-7 md:h-7 relative" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      </a>
    </div>
  );
}
