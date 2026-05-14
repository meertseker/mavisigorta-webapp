'use client';

import { useMemo, useState } from 'react';
import { Phone, ChevronDown, Smartphone, Monitor } from 'lucide-react';
import type {
  Campaign,
  ResponsiveSearchAd,
  SitelinkAsset,
  CalloutAsset,
} from '@/lib/google-ads/types';

type DraftCampaign = Omit<Campaign, 'id' | 'resourceName' | 'metrics'>;

/**
 * Google SERP'te reklamın nasıl görüneceğini canlı olarak gösterir.
 * RSA otomatik olarak en uzun 3 başlık + 2 açıklamayı seçer (Google'ın gerçek davranışı
 * algoritmik ama yaklaşık olarak böyledir).
 */
export default function AdPreview({ draft }: { draft: DraftCampaign }) {
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');

  const ad = draft.adGroups[0]?.ads[0];
  if (!ad) {
    return (
      <div className="bg-white border rounded-xl p-5 text-sm text-gray-500 italic">
        Reklam tanımlandığında burada Google SERP önizlemesi görüntülenir.
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Canlı Önizleme</h2>
        <div className="inline-flex rounded-md border p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setView('desktop')}
            className={`px-2 py-1 rounded inline-flex items-center gap-1 ${
              view === 'desktop' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" /> Desktop
          </button>
          <button
            type="button"
            onClick={() => setView('mobile')}
            className={`px-2 py-1 rounded inline-flex items-center gap-1 ${
              view === 'mobile' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" /> Mobil
          </button>
        </div>
      </div>

      <div
        className={`mx-auto ${
          view === 'mobile' ? 'max-w-sm' : 'max-w-2xl'
        } bg-white border rounded-lg p-3 sm:p-4 shadow-sm font-[arial,sans-serif]`}
      >
        <SerpAdMock
          ad={ad}
          sitelinks={draft.sitelinks || []}
          callouts={draft.callouts || []}
          callPhone={draft.call?.phoneNumber}
          isMobile={view === 'mobile'}
        />
      </div>

      <p className="text-xs text-gray-500">
        Bu önizleme yaklaşıktır. Google gerçek SERP'te başlık/açıklama kombinasyonunu kullanıcıya
        ve sorguya göre değiştirir.
      </p>
    </div>
  );
}

function SerpAdMock({
  ad,
  sitelinks,
  callouts,
  callPhone,
  isMobile,
}: {
  ad: ResponsiveSearchAd;
  sitelinks: SitelinkAsset[];
  callouts: CalloutAsset[];
  callPhone?: string;
  isMobile: boolean;
}) {
  // Google başlıklardan ilk 3 dolu olanı, açıklamalardan ilk 2 dolu olanı kullanır
  const validHeadlines = useMemo(
    () => ad.headlines.filter((h) => h.trim()).slice(0, 3),
    [ad.headlines],
  );
  const validDescriptions = useMemo(
    () => ad.descriptions.filter((d) => d.trim()).slice(0, 2),
    [ad.descriptions],
  );

  const displayUrl = useMemo(() => {
    try {
      const u = new URL(ad.finalUrl);
      const host = u.hostname.replace(/^www\./, '');
      const segments = [ad.path1, ad.path2].filter(Boolean).join('/');
      return segments ? `${host}/${segments}` : host;
    } catch {
      return ad.finalUrl;
    }
  }, [ad.finalUrl, ad.path1, ad.path2]);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-[11px]">
        <span className="font-bold text-gray-900">Sponsorlu</span>
        <span className="text-gray-700">·</span>
        <span className="text-gray-700 truncate">{displayUrl}</span>
      </div>

      <div className="text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug">
        <span className={isMobile ? 'text-[18px]' : 'text-[20px]'}>
          {validHeadlines.join(' | ') || 'Reklam başlığı'}
        </span>
      </div>

      <p className={`${isMobile ? 'text-[14px]' : 'text-[14px]'} text-gray-700 leading-snug`}>
        {validDescriptions.join(' ') || 'Reklam açıklaması'}
      </p>

      {/* Callouts (single line) */}
      {callouts.length > 0 && (
        <p className="text-[13px] text-gray-700 leading-snug">
          {callouts
            .filter((c) => c.text.trim())
            .slice(0, 6)
            .map((c) => c.text)
            .join(' · ')}
        </p>
      )}

      {/* Sitelinks */}
      {sitelinks.length > 0 && (
        <div
          className={`mt-2 ${
            isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-2 gap-x-6 gap-y-2'
          }`}
        >
          {sitelinks
            .filter((s) => s.text.trim())
            .slice(0, isMobile ? 4 : 6)
            .map((s, i) => (
              <div key={i}>
                <div className="text-[#1a0dab] hover:underline cursor-pointer text-[13px] font-medium">
                  {s.text}
                </div>
                {(s.description1 || s.description2) && (
                  <div className="text-[12px] text-gray-600 leading-snug">
                    {s.description1}
                    {s.description2 && <span>; {s.description2}</span>}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Call extension (mobile only in reality, but show on both) */}
      {callPhone && isMobile && (
        <div className="mt-3 inline-flex items-center gap-2 border border-[#1a0dab] text-[#1a0dab] rounded-full px-3 py-1.5 text-[13px] font-medium">
          <Phone className="h-3.5 w-3.5" /> Ara: {callPhone}
        </div>
      )}

      {!isMobile && (
        <div className="mt-2 text-[11px] text-gray-500 inline-flex items-center gap-1">
          <ChevronDown className="h-3 w-3" /> Reklam neden gösterildi?
        </div>
      )}
    </div>
  );
}
