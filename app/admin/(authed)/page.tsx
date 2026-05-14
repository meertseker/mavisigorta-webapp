import Link from 'next/link';
import { ArrowRight, Users, Megaphone, TrendingUp, Inbox } from 'lucide-react';
import { leadStats, listLeads } from '@/lib/admin/lead-log';
import { getClientStatus, listCampaigns } from '@/lib/google-ads/client';
import { microsToTry } from '@/lib/google-ads/types';

const PRODUCT_LABEL: Record<string, string> = {
  'tamamlayici-saglik': 'Tamamlayıcı Sağlık',
  'moduler-saglik': 'Modüler Sağlık',
  kasko: 'Kasko',
  trafik: 'Trafik',
  konut: 'Konut',
  isyeri: 'İşyeri',
  dask: 'DASK',
  'seyahat-saglik': 'Seyahat Sağlık',
  genel: 'Genel',
};

function tlFormat(amount: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount);
}

export default async function AdminDashboardPage() {
  const stats = leadStats();
  const recent = listLeads(5);
  const adsStatus = getClientStatus();

  let campaignCount = 0;
  let activeCampaigns = 0;
  let totalCostTry = 0;
  let totalConversions = 0;
  let campaignError: string | null = null;
  try {
    const campaigns = await listCampaigns();
    campaignCount = campaigns.length;
    activeCampaigns = campaigns.filter((c) => c.status === 'ENABLED').length;
    totalCostTry = campaigns.reduce((sum, c) => sum + microsToTry(c.metrics?.costMicros), 0);
    totalConversions = campaigns.reduce((sum, c) => sum + (c.metrics?.conversions || 0), 0);
  } catch (err) {
    campaignError = err instanceof Error ? err.message : 'Bilinmeyen hata';
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          Mavi Sigorta panel özeti — lead ve reklam performansı.
        </p>
      </header>

      {!adsStatus.configured && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Google Ads bağlantısı yapılandırılmadı.</strong> Eksik değişkenler:{' '}
          <code className="font-mono text-xs">{adsStatus.missing.join(', ')}</code>. Yapılandırılana kadar
          reklam ekranları örnek verilerle gösterilir.
        </div>
      )}

      {/* Stat cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Toplam Lead"
          value={String(stats.total)}
          icon={Users}
          tone="blue"
          sub={`${stats.last7d} son 7 gün`}
        />
        <StatCard
          label="Yeni Leadler"
          value={String(stats.newCount)}
          icon={Inbox}
          tone="green"
          sub="bekleyen"
        />
        <StatCard
          label="Ortalama Skor"
          value={String(stats.avgScore)}
          icon={TrendingUp}
          tone="purple"
          sub="0–100"
        />
        <StatCard
          label="Aktif Kampanya"
          value={campaignError ? '—' : `${activeCampaigns}/${campaignCount}`}
          icon={Megaphone}
          tone="orange"
          sub={
            campaignError
              ? 'API hatası'
              : `${tlFormat(totalCostTry)} 30g harcama, ${totalConversions} dönüşüm`
          }
        />
      </section>

      {/* Two-column overview */}
      <section className="grid lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Son Leadler</h2>
            <Link
              href="/admin/leads"
              className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              Tümü <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              Henüz lead yok. /teklif formundan gelen başvurular burada listelenir.
            </p>
          ) : (
            <ul className="divide-y">
              {recent.map((lead) => (
                <li key={lead.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 truncate">{lead.name}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          lead.score >= 70
                            ? 'bg-green-100 text-green-800'
                            : lead.score >= 40
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {lead.score}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {PRODUCT_LABEL[lead.product] || lead.product} ·{' '}
                      {new Date(lead.createdAt).toLocaleString('tr-TR')}
                    </div>
                  </div>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="text-xs text-blue-600 hover:underline shrink-0"
                  >
                    Detay
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* By product */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ürün Bazında Leadler</h2>
          {Object.keys(stats.byProduct).length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">Henüz veri yok.</p>
          ) : (
            <ul className="space-y-2">
              {Object.entries(stats.byProduct)
                .sort((a, b) => b[1] - a[1])
                .map(([product, count]) => {
                  const pct = Math.round((count / stats.total) * 100);
                  return (
                    <li key={product}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-700">
                          {PRODUCT_LABEL[product] || product}
                        </span>
                        <span className="text-gray-500 tabular-nums">
                          {count} · {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid sm:grid-cols-3 gap-4">
        <QuickLink
          href="/admin/ads/campaigns/new"
          title="Yeni Kampanya"
          desc="Şablondan başlayarak Google Ads kampanyası hazırla."
        />
        <QuickLink
          href="/admin/ads/keywords"
          title="Anahtar Kelime Araştırması"
          desc="Yeni keyword fikirleri ve arama hacmi."
        />
        <QuickLink
          href="/admin/ads/performance"
          title="Performans Raporu"
          desc="Son 30 günün CPC, dönüşüm ve maliyetleri."
        />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  sub,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: 'blue' | 'green' | 'purple' | 'orange';
  sub?: string;
}) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700',
  };
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
        <span className={`h-8 w-8 grid place-items-center rounded-md ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

function QuickLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group bg-white border rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition">
            {title}
          </div>
          <div className="text-sm text-gray-600 mt-1">{desc}</div>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition shrink-0 mt-1" />
      </div>
    </Link>
  );
}
