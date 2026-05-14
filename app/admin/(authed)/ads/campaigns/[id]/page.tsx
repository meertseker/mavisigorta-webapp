import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getCampaignDetail } from '@/lib/google-ads/client';
import { microsToTry } from '@/lib/google-ads/types';
import CampaignStatusToggle from './CampaignStatusToggle';

function tlFormat(amount: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount);
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await getCampaignDetail(id);
  if (!campaign) notFound();

  const cost = microsToTry(campaign.metrics?.costMicros);
  const ctr = campaign.metrics?.impressions
    ? ((campaign.metrics.clicks / campaign.metrics.impressions) * 100).toFixed(2)
    : '0.00';
  const cpa = campaign.metrics?.conversions
    ? cost / campaign.metrics.conversions
    : 0;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/ads/campaigns"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> Kampanyalar
      </Link>

      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {campaign.advertisingChannelType} · ID: <code className="font-mono text-xs">{campaign.id}</code>
          </p>
        </div>
        <CampaignStatusToggle
          id={campaign.id!}
          resourceName={campaign.resourceName || ''}
          status={campaign.status}
        />
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Gösterim" value={(campaign.metrics?.impressions || 0).toLocaleString('tr-TR')} />
        <MetricCard label="Tıklama" value={(campaign.metrics?.clicks || 0).toLocaleString('tr-TR')} sub={`CTR ${ctr}%`} />
        <MetricCard label="Harcama" value={tlFormat(cost)} />
        <MetricCard
          label="Dönüşüm"
          value={(campaign.metrics?.conversions || 0).toFixed(0)}
          sub={cpa ? `CPA ${tlFormat(cpa)}` : '—'}
        />
      </section>

      <section className="bg-white border rounded-xl p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Kampanya Bilgileri</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <Row label="Günlük Bütçe" value={tlFormat(campaign.budgetDailyTry)} />
          <Row
            label="Bidding"
            value={
              campaign.biddingStrategy.type === 'TARGET_CPA'
                ? `Target CPA ${tlFormat(microsToTry(campaign.biddingStrategy.targetCpaMicros))}`
                : campaign.biddingStrategy.type === 'TARGET_ROAS'
                ? `Target ROAS ${campaign.biddingStrategy.targetRoas}`
                : campaign.biddingStrategy.type
            }
          />
          <Row label="Durum" value={campaign.status} />
          <Row label="Hedef Bölgeler" value={campaign.geoTargets.map((g) => g.label).join(', ') || 'Türkiye'} />
          <Row label="Başlangıç" value={campaign.startDate || '—'} />
          <Row label="Bitiş" value={campaign.endDate || '—'} />
        </dl>
      </section>

      <section className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-semibold mb-1">Düzenleme & detay yönetimi</p>
        <p className="text-xs">
          Reklam grupları, RSA başlıkları ve anahtar kelimelerin detaylı düzenlemesi şu an doğrudan{' '}
          <a
            className="underline"
            href={`https://ads.google.com/aw/campaigns?ocid=&campaignId=${campaign.id}`}
            target="_blank"
            rel="noreferrer"
          >
            Google Ads arayüzünde
          </a>{' '}
          yapılır. Bu paneldeki <strong>Yeni Kampanya</strong> akışıyla şablondan kampanya oluşturun;
          mevcut kampanyada sadece durum yönetimi ve performans takibi yapılır.
        </p>
      </section>
    </div>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-2xl font-bold text-gray-900 tabular-nums">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 font-medium break-words">{value}</dd>
    </div>
  );
}
