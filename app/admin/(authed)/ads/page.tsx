import Link from 'next/link';
import {
  ArrowRight,
  Megaphone,
  Plus,
  BarChart3,
  Search,
  AlertCircle,
} from 'lucide-react';
import { getClientStatus, listCampaigns } from '@/lib/google-ads/client';
import { microsToTry } from '@/lib/google-ads/types';
import { listTemplates } from '@/lib/google-ads/templates';

function tlFormat(amount: number, opts?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
    ...opts,
  }).format(amount);
}

export default async function AdsOverviewPage() {
  const status = getClientStatus();
  const templates = listTemplates();

  let campaigns: Awaited<ReturnType<typeof listCampaigns>> = [];
  let error: string | null = null;
  try {
    campaigns = await listCampaigns();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Bilinmeyen hata';
  }

  const totals = campaigns.reduce(
    (acc, c) => {
      acc.impressions += c.metrics?.impressions || 0;
      acc.clicks += c.metrics?.clicks || 0;
      acc.cost += microsToTry(c.metrics?.costMicros);
      acc.conversions += c.metrics?.conversions || 0;
      return acc;
    },
    { impressions: 0, clicks: 0, cost: 0, conversions: 0 },
  );

  const cpa = totals.conversions > 0 ? totals.cost / totals.conversions : 0;
  const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reklamlar</h1>
          <p className="text-sm text-gray-600 mt-1">
            Google Ads kampanya yönetimi — son 30 gün özeti.
          </p>
        </div>
        <Link
          href="/admin/ads/campaigns/new"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Yeni Kampanya
        </Link>
      </header>

      {/* API status */}
      <ApiStatusBanner status={status} />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Google Ads API hatası:</strong> {error}
        </div>
      )}

      {/* Top metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Gösterim" value={totals.impressions.toLocaleString('tr-TR')} />
        <MetricCard
          label="Tıklama"
          value={totals.clicks.toLocaleString('tr-TR')}
          sub={`CTR: ${ctr.toFixed(2)}%`}
        />
        <MetricCard
          label="Harcama"
          value={tlFormat(totals.cost)}
          sub={`${campaigns.length} kampanya`}
        />
        <MetricCard
          label="Dönüşüm"
          value={totals.conversions.toFixed(0)}
          sub={cpa ? `CPA: ${tlFormat(cpa)}` : '—'}
        />
      </section>

      {/* Campaigns mini-list */}
      <section className="bg-white border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Kampanyalar</h2>
          <Link
            href="/admin/ads/campaigns"
            className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            Tümü <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">
            Henüz kampanya yok. Şablondan yeni bir kampanya oluşturarak başlayın.
          </p>
        ) : (
          <ul className="divide-y">
            {campaigns.slice(0, 5).map((c) => (
              <li key={c.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">{c.name}</div>
                  <div className="text-xs text-gray-500">
                    {c.advertisingChannelType} ·{' '}
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded ${
                        c.status === 'ENABLED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 tabular-nums">
                    {tlFormat(microsToTry(c.metrics?.costMicros))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {c.metrics?.conversions || 0} dönüşüm
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Templates */}
      <section className="bg-white border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Hazır Şablonlar</h2>
          <span className="text-xs text-gray-500">
            {templates.length} ürün şablonu kullanıma hazır
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map((tpl) => (
            <Link
              key={tpl.product}
              href={`/admin/ads/campaigns/new?product=${tpl.product}`}
              className="group rounded-lg border p-3 hover:border-blue-300 hover:bg-blue-50/30 transition"
            >
              <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                {tpl.label}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {tlFormat(tpl.defaultBudgetTry)}/gün
                {tpl.defaultTargetCpaTry ? ` · CPA hedef ${tlFormat(tpl.defaultTargetCpaTry)}` : ''}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid sm:grid-cols-3 gap-4">
        <QuickLink
          href="/admin/ads/keywords"
          icon={Search}
          title="Anahtar Kelime Planlayıcı"
          desc="Yeni keyword fikirleri, arama hacmi, rekabet."
        />
        <QuickLink
          href="/admin/ads/performance"
          icon={BarChart3}
          title="Performans Raporu"
          desc="30 günlük kampanya metrikleri ve karşılaştırma."
        />
        <QuickLink
          href="/admin/ads/campaigns"
          icon={Megaphone}
          title="Tüm Kampanyalar"
          desc="Kampanya listesi, durağa al/aç, detay."
        />
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

function ApiStatusBanner({ status }: { status: ReturnType<typeof getClientStatus> }) {
  if (status.configured) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900 flex items-start gap-3">
        <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
        <div>
          <strong>Google Ads bağlantısı aktif.</strong> Customer ID:{' '}
          <code className="font-mono text-xs">{status.customerId}</code>
          {status.loginCustomerId && (
            <>
              {' '}
              · Login (MCC): <code className="font-mono text-xs">{status.loginCustomerId}</code>
            </>
          )}{' '}
          · API {status.apiVersion}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Google Ads API yapılandırılmadı.</strong> Aşağıdaki env değişkenleri eksik:{' '}
          <code className="font-mono text-xs">{status.missing.join(', ')}</code>.
          <br />
          <span className="text-xs">
            Yapılandırılana kadar bu sayfada örnek (mock) veriler görüntülenir. Kurulum için{' '}
            <a
              className="underline"
              href="https://developers.google.com/google-ads/api/docs/get-started/introduction"
              target="_blank"
              rel="noreferrer"
            >
              Google Ads API başlangıç kılavuzu
            </a>
            'na bakın.
          </span>
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-white border rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <Icon className="h-5 w-5 text-blue-600 mb-2" />
          <div className="font-semibold text-gray-900 group-hover:text-blue-700">{title}</div>
          <div className="text-sm text-gray-600 mt-1">{desc}</div>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition shrink-0 mt-1" />
      </div>
    </Link>
  );
}
