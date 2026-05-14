import Link from 'next/link';
import { Plus } from 'lucide-react';
import { listCampaigns } from '@/lib/google-ads/client';
import { microsToTry } from '@/lib/google-ads/types';

function tlFormat(amount: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount);
}

export default async function CampaignsListPage() {
  let campaigns: Awaited<ReturnType<typeof listCampaigns>> = [];
  let error: string | null = null;
  try {
    campaigns = await listCampaigns();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Bilinmeyen hata';
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kampanyalar</h1>
          <p className="text-sm text-gray-600 mt-1">
            Google Ads hesabındaki kampanyalar — son 30 gün metrikleriyle.
          </p>
        </div>
        <Link
          href="/admin/ads/campaigns/new"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Yeni Kampanya
        </Link>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Google Ads API hatası:</strong> {error}
        </div>
      )}

      {campaigns.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <p className="text-gray-600 mb-4">Henüz kampanya yok.</p>
          <Link
            href="/admin/ads/campaigns/new"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Şablondan Kampanya Oluştur
          </Link>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-xs text-gray-600 uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">Kampanya</th>
                  <th className="text-left px-4 py-3">Durum</th>
                  <th className="text-right px-4 py-3">Gösterim</th>
                  <th className="text-right px-4 py-3">Tıklama</th>
                  <th className="text-right px-4 py-3">CTR</th>
                  <th className="text-right px-4 py-3">Harcama</th>
                  <th className="text-right px-4 py-3">Dönüşüm</th>
                  <th className="text-right px-4 py-3">CPA</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {campaigns.map((c) => {
                  const cost = microsToTry(c.metrics?.costMicros);
                  const ctr = c.metrics?.impressions
                    ? ((c.metrics.clicks / c.metrics.impressions) * 100).toFixed(2)
                    : '0.00';
                  const cpa = c.metrics?.conversions
                    ? cost / c.metrics.conversions
                    : 0;

                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{c.name}</div>
                        <div className="text-xs text-gray-500">
                          {c.advertisingChannelType}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            c.status === 'ENABLED'
                              ? 'bg-green-100 text-green-800'
                              : c.status === 'PAUSED'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {(c.metrics?.impressions || 0).toLocaleString('tr-TR')}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {(c.metrics?.clicks || 0).toLocaleString('tr-TR')}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-gray-600">
                        {ctr}%
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium">
                        {tlFormat(cost)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {(c.metrics?.conversions || 0).toFixed(0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-gray-600">
                        {cpa ? tlFormat(cpa) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/ads/campaigns/${c.id}`}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Detay →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
