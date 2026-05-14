'use client';

import { CheckCircle2, XCircle, AlertCircle, Send, X, Loader2 } from 'lucide-react';
import type { Campaign } from '@/lib/google-ads/types';

type DraftCampaign = Omit<Campaign, 'id' | 'resourceName' | 'metrics'>;

export interface PreflightItem {
  label: string;
  status: 'ok' | 'warning' | 'error';
  detail?: string;
}

export function runPreflight(draft: DraftCampaign): PreflightItem[] {
  const items: PreflightItem[] = [];

  // Campaign basics
  items.push({
    label: 'Kampanya adı',
    status: draft.name.trim() ? 'ok' : 'error',
    detail: draft.name.trim() || 'Eksik',
  });
  items.push({
    label: 'Günlük bütçe',
    status: draft.budgetDailyTry >= 30 ? 'ok' : draft.budgetDailyTry >= 10 ? 'warning' : 'error',
    detail: `${draft.budgetDailyTry} TL/gün ${
      draft.budgetDailyTry < 30 ? '(öneri: en az 30 TL/gün)' : ''
    }`,
  });
  items.push({
    label: 'Bidding stratejisi',
    status: 'ok',
    detail: draft.biddingStrategy.type,
  });
  items.push({
    label: 'Geo hedefleme',
    status: draft.geoTargets.length > 0 ? 'ok' : 'error',
    detail: draft.geoTargets.map((g) => g.label).join(', ') || 'Eksik',
  });

  // Ad groups
  const adGroupCount = draft.adGroups.length;
  items.push({
    label: 'Reklam grupları',
    status: adGroupCount > 0 ? 'ok' : 'error',
    detail: `${adGroupCount} grup`,
  });

  // RSA validation per ad group
  draft.adGroups.forEach((ag, i) => {
    const ad = ag.ads[0];
    if (!ad) {
      items.push({
        label: `Grup ${i + 1}: reklam`,
        status: 'error',
        detail: 'Reklam yok',
      });
      return;
    }
    const validHL = ad.headlines.filter((h) => h.trim() && h.length <= 30);
    const validDesc = ad.descriptions.filter((d) => d.trim() && d.length <= 90);
    items.push({
      label: `Grup ${i + 1}: başlıklar`,
      status: validHL.length >= 8 ? 'ok' : validHL.length >= 3 ? 'warning' : 'error',
      detail: `${validHL.length}/15 ${
        validHL.length < 8 ? '(öneri: 10+ farklı başlık)' : ''
      }`,
    });

    // Tekrarlı başlık kontrolü: Google'ın RSA combination motoru için en az 12
    // farklı (case-insensitive, boşluk normalize edilmiş) başlık olmalı.
    // Çok tekrarlanan başlıklar Ad Strength'i düşürür ve combination çeşitliliği
    // kaybolur.
    const normalizedHL = validHL.map((h) => h.trim().toLowerCase().replace(/\s+/g, ' '));
    const uniqueHL = new Set(normalizedHL);
    items.push({
      label: `Grup ${i + 1}: başlık çeşitliliği`,
      status: uniqueHL.size >= 12 ? 'ok' : uniqueHL.size >= 8 ? 'warning' : 'error',
      detail:
        uniqueHL.size === normalizedHL.length
          ? `${uniqueHL.size} farklı başlık`
          : `${uniqueHL.size}/${normalizedHL.length} farklı (${
              normalizedHL.length - uniqueHL.size
            } tekrar)`,
    });

    items.push({
      label: `Grup ${i + 1}: açıklamalar`,
      status: validDesc.length >= 4 ? 'ok' : validDesc.length >= 2 ? 'warning' : 'error',
      detail: `${validDesc.length}/4`,
    });
    const positiveKw = ag.keywords.filter((k) => !k.negative && k.text.trim()).length;
    const negativeKw = ag.keywords.filter((k) => k.negative && k.text.trim()).length;
    items.push({
      label: `Grup ${i + 1}: anahtar kelimeler`,
      status: positiveKw >= 5 ? 'ok' : positiveKw > 0 ? 'warning' : 'error',
      detail: `${positiveKw} pozitif, ${negativeKw} negatif`,
    });
  });

  // Assets
  const sitelinkCount = draft.sitelinks?.filter((s) => s.text.trim() && s.finalUrl).length || 0;
  items.push({
    label: 'Sitelinks',
    status: sitelinkCount >= 4 ? 'ok' : sitelinkCount >= 2 ? 'warning' : 'error',
    detail: `${sitelinkCount} sitelink ${sitelinkCount < 4 ? '(öneri: en az 4)' : ''}`,
  });
  const calloutCount = draft.callouts?.filter((c) => c.text.trim()).length || 0;
  items.push({
    label: 'Callouts',
    status: calloutCount >= 4 ? 'ok' : calloutCount >= 1 ? 'warning' : 'error',
    detail: `${calloutCount} callout ${calloutCount < 4 ? '(öneri: en az 4)' : ''}`,
  });
  items.push({
    label: 'Call (telefon) extension',
    status: draft.call ? 'ok' : 'warning',
    detail: draft.call?.phoneNumber || 'Yok (mobil CTR için öneririz)',
  });
  items.push({
    label: 'Ad schedule',
    status: draft.adSchedule?.length ? 'ok' : 'warning',
    detail: draft.adSchedule?.length
      ? `${draft.adSchedule.length} saat dilimi`
      : 'Yok (7/24 yayınlanır)',
  });

  return items;
}

export default function PreflightChecklist({
  draft,
  onPublish,
  onCancel,
  publishing,
}: {
  draft: DraftCampaign;
  onPublish: () => void;
  onCancel: () => void;
  publishing: boolean;
}) {
  const items = runPreflight(draft);
  const errors = items.filter((i) => i.status === 'error');
  const warnings = items.filter((i) => i.status === 'warning');
  const oks = items.filter((i) => i.status === 'ok');

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
        <header className="flex items-start justify-between p-5 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Yayın Öncesi Kontrol Listesi</h2>
            <p className="text-sm text-gray-600 mt-1">
              Kampanya Google Ads&apos;e <strong>PAUSED</strong> olarak gönderilecek. Yayına almak
              için Google Ads arayüzünden son onayı kendiniz vereceksiniz.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1"
            disabled={publishing}
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex items-center gap-4 px-5 py-3 border-b bg-gray-50 text-sm">
          <span className="flex items-center gap-1 text-green-700">
            <CheckCircle2 className="h-4 w-4" /> <strong>{oks.length}</strong> tamam
          </span>
          {warnings.length > 0 && (
            <span className="flex items-center gap-1 text-amber-700">
              <AlertCircle className="h-4 w-4" /> <strong>{warnings.length}</strong> uyarı
            </span>
          )}
          {errors.length > 0 && (
            <span className="flex items-center gap-1 text-red-700">
              <XCircle className="h-4 w-4" /> <strong>{errors.length}</strong> hata
            </span>
          )}
        </div>

        <ul className="flex-1 overflow-y-auto divide-y">
          {items.map((item, i) => (
            <li key={i} className="px-5 py-3 flex items-start gap-3">
              {item.status === 'ok' && (
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              )}
              {item.status === 'warning' && (
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              )}
              {item.status === 'error' && (
                <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{item.label}</div>
                {item.detail && (
                  <div className="text-xs text-gray-600 mt-0.5 break-words">{item.detail}</div>
                )}
              </div>
            </li>
          ))}
        </ul>

        <footer className="p-5 border-t flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-gray-500">
            {errors.length > 0
              ? 'Hataları düzeltene kadar yayınlama açılmayacak.'
              : warnings.length > 0
              ? 'Uyarılarla devam edebilirsiniz, ancak performans için düzeltmenizi öneririz.'
              : 'Tüm kontrolleri geçti. Yayınlamaya hazır.'}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={publishing}
              className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
            >
              Geri dön
            </button>
            <button
              type="button"
              onClick={onPublish}
              disabled={publishing || errors.length > 0}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {publishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {publishing ? 'Yayınlanıyor...' : 'Google Ads\'e yolla (PAUSED)'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
