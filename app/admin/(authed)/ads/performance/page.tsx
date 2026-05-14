import { listCampaigns } from '@/lib/google-ads/client';
import { microsToTry } from '@/lib/google-ads/types';

function tlFormat(amount: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount);
}

export default async function PerformancePage() {
  let campaigns: Awaited<ReturnType<typeof listCampaigns>> = [];
  let error: string | null = null;
  try {
    campaigns = await listCampaigns();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Bilinmeyen hata';
  }

  // Aggregate
  const totals = campaigns.reduce(
    (acc, c) => {
      acc.impressions += c.metrics?.impressions || 0;
      acc.clicks += c.metrics?.clicks || 0;
      acc.cost += microsToTry(c.metrics?.costMicros);
      acc.conversions += c.metrics?.conversions || 0;
      acc.conversionValue += c.metrics?.conversionValue || 0;
      return acc;
    },
    { impressions: 0, clicks: 0, cost: 0, conversions: 0, conversionValue: 0 },
  );

  const cpa = totals.conversions > 0 ? totals.cost / totals.conversions : 0;
  const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
  const cpc = totals.clicks > 0 ? totals.cost / totals.clicks : 0;
  const roas = totals.cost > 0 ? totals.conversionValue / totals.cost : 0;

  // Sorted by cost
  const byCost = [...campaigns].sort(
    (a, b) => microsToTry(b.metrics?.costMicros) - microsToTry(a.metrics?.costMicros),
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Performans Raporu</h1>
        <p className="text-sm text-gray-600 mt-1">Son 30 günün hesap özeti.</p>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Google Ads API hatası:</strong> {error}
        </div>
      )}

      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Metric label="Harcama" value={tlFormat(totals.cost)} />
        <Metric label="Tıklama" value={totals.clicks.toLocaleString('tr-TR')} sub={`CTR ${ctr.toFixed(2)}%`} />
        <Metric label="CPC" value={tlFormat(cpc)} />
        <Metric label="Dönüşüm" value={totals.conversions.toFixed(0)} sub={cpa ? `CPA ${tlFormat(cpa)}` : '—'} />
        <Metric
          label="ROAS"
          value={roas > 0 ? `${roas.toFixed(2)}x` : '—'}
          sub={totals.conversionValue ? tlFormat(totals.conversionValue) + ' değer' : '—'}
        />
      </section>

      {campaigns.length > 0 && (
        <section className="bg-white border rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Kampanyaların Harcama Sıralaması
          </h2>
          <div className="space-y-2">
            {byCost.map((c) => {
              const cost = microsToTry(c.metrics?.costMicros);
              const pct = totals.cost > 0 ? (cost / totals.cost) * 100 : 0;
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-900 truncate pr-3">{c.name}</span>
                    <span className="text-gray-600 tabular-nums shrink-0">
                      {tlFormat(cost)} · {(c.metrics?.conversions || 0).toFixed(0)} dnş
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        c.status === 'ENABLED' ? 'bg-blue-600' : 'bg-gray-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="bg-white border rounded-xl p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Karşılaştırma Tablosu</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-600 uppercase tracking-wide border-b">
              <tr>
                <th className="text-left py-2">Kampanya</th>
                <th className="text-right py-2">Gösterim</th>
                <th className="text-right py-2">Tıklama</th>
                <th className="text-right py-2">CTR</th>
                <th className="text-right py-2">CPC</th>
                <th className="text-right py-2">Harcama</th>
                <th className="text-right py-2">Dönüşüm</th>
                <th className="text-right py-2">CPA</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {campaigns.map((c) => {
                const cost = microsToTry(c.metrics?.costMicros);
                const ctrC = c.metrics?.impressions
                  ? ((c.metrics.clicks / c.metrics.impressions) * 100).toFixed(2)
                  : '0.00';
                const cpcC = c.metrics?.clicks ? cost / c.metrics.clicks : 0;
                const cpaC = c.metrics?.conversions ? cost / c.metrics.conversions : 0;
                return (
                  <tr key={c.id}>
                    <td className="py-2 text-gray-900 font-medium">{c.name}</td>
                    <td className="py-2 text-right tabular-nums">
                      {(c.metrics?.impressions || 0).toLocaleString('tr-TR')}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      {(c.metrics?.clicks || 0).toLocaleString('tr-TR')}
                    </td>
                    <td className="py-2 text-right tabular-nums text-gray-600">{ctrC}%</td>
                    <td className="py-2 text-right tabular-nums">{tlFormat(cpcC)}</td>
                    <td className="py-2 text-right tabular-nums font-medium">{tlFormat(cost)}</td>
                    <td className="py-2 text-right tabular-nums">
                      {(c.metrics?.conversions || 0).toFixed(0)}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      {cpaC ? tlFormat(cpaC) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-xl font-bold text-gray-900 tabular-nums">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}
