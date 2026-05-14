import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { listTemplates, getTemplate } from '@/lib/google-ads/templates';
import type { InsuranceSlug } from '@/lib/types';
import CampaignBuilder from '../_components/CampaignBuilder';

function tlFormat(amount: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount);
}

export default async function NewCampaignPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: InsuranceSlug }>;
}) {
  const { product } = await searchParams;
  const tpl = product ? getTemplate(product) : null;
  const templates = listTemplates();

  if (!product) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/ads"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" /> Reklamlar
        </Link>

        <header>
          <h1 className="text-2xl font-bold text-gray-900">Yeni Kampanya</h1>
          <p className="text-sm text-gray-600 mt-1">
            Hangi ürün için kampanya oluşturmak istiyorsunuz? Tüm şablonlar PAUSED olarak oluşturulur —
            siz son kontrolden geçirip yayına alacaksınız.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map((t) => (
            <Link
              key={t.product}
              href={`/admin/ads/campaigns/new?product=${t.product}`}
              className="group bg-white border rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition"
            >
              <div className="text-base font-semibold text-gray-900 group-hover:text-blue-700">
                {t.label}
              </div>
              <div className="mt-2 space-y-0.5 text-xs text-gray-600">
                <div>Günlük bütçe: <span className="font-medium">{tlFormat(t.defaultBudgetTry)}</span></div>
                {t.defaultTargetCpaTry && (
                  <div>Hedef CPA: <span className="font-medium">{tlFormat(t.defaultTargetCpaTry)}</span></div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (!tpl) {
    return (
      <div className="bg-white border rounded-xl p-8 text-center">
        <p className="text-gray-600">Şablon bulunamadı.</p>
        <Link href="/admin/ads/campaigns/new" className="text-blue-600 hover:underline text-sm">
          ← Şablon seç
        </Link>
      </div>
    );
  }

  const initial = tpl.build();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/ads/campaigns/new"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> Şablon değiştir
      </Link>

      <header>
        <h1 className="text-2xl font-bold text-gray-900">Yeni Kampanya: {tpl.label}</h1>
        <p className="text-sm text-gray-600 mt-1">
          Şablondan başlatıldı. Tüm alanlar düzenlenebilir; <strong>Önizle & Yayınla</strong>{' '}
          dediğinizde checklist gösterilir, onayladıktan sonra kampanya{' '}
          <span className="font-semibold">PAUSED</span> olarak Google Ads'e gönderilir.
        </p>
      </header>

      <CampaignBuilder initial={initial} draftKey={`new:${product}`} />
    </div>
  );
}
