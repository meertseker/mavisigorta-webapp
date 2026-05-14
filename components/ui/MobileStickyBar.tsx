'use client';

import Link from 'next/link';
import { buildWaUrl, buildTelHref, type WhatsappContext } from '@/lib/whatsapp';
import { trackPhoneClick, trackWhatsappClick, trackCTAClick } from '@/lib/analytics';

interface MobileStickyBarProps {
  phone: string;
  whatsapp: string;
  product?: WhatsappContext;
  /** Override the "Teklif Al" link (e.g. anchor to embedded form on landing page). */
  quoteHref?: string;
}

export default function MobileStickyBar({
  phone,
  whatsapp,
  product = 'genel',
  quoteHref,
}: MobileStickyBarProps) {
  const waUrl = buildWaUrl({ product, number: whatsapp });
  const href = quoteHref || (product === 'genel' ? '/teklif' : `/teklif/${product}`);

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 grid grid-cols-3 gap-px bg-white/20 dark:bg-black/40 backdrop-blur-xl border-t border-white/10"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsappClick('mobile_sticky', product)}
        className="flex flex-col items-center justify-center py-3 bg-[#25D366] text-white font-semibold text-xs"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 mb-0.5" fill="currentColor">
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z" />
        </svg>
        WhatsApp
      </a>

      <a
        href={buildTelHref(phone)}
        onClick={() => trackPhoneClick('mobile_sticky')}
        className="flex flex-col items-center justify-center py-3 bg-primary-red text-white font-semibold text-xs"
      >
        <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
        Ara
      </a>

      <Link
        href={href}
        onClick={() => trackCTAClick('teklif_al', 'mobile_sticky')}
        className="flex flex-col items-center justify-center py-3 bg-gradient-to-br from-secondary-orange to-secondary-amber text-white font-bold text-xs"
      >
        <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Teklif Al
      </Link>
    </div>
  );
}
