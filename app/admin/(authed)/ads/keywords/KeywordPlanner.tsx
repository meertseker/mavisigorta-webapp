'use client';

import { useState } from 'react';
import { Loader2, Search, Copy, Check, ExternalLink } from 'lucide-react';
import type { KeywordIdea } from '@/lib/google-ads/types';

const SEED_PRESETS: { label: string; seeds: string[] }[] = [
  { label: 'Tamamlayıcı Sağlık', seeds: ['tamamlayıcı sağlık sigortası', 'tss teklif', 'özel hastane fark'] },
  { label: 'Kasko', seeds: ['kasko teklif', 'kasko fiyat', 'plaka ile kasko'] },
  { label: 'Trafik', seeds: ['trafik sigortası', 'trafik sigortası fiyat'] },
  { label: 'Konut', seeds: ['konut sigortası', 'ev sigortası'] },
  { label: 'DASK', seeds: ['dask', 'zorunlu deprem sigortası'] },
  { label: 'Seyahat', seeds: ['schengen vize sigortası', 'seyahat sağlık sigortası'] },
];

function microsToTry(m?: number): number {
  return m ? m / 1_000_000 : 0;
}

function tlFormat(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function KeywordPlanner() {
  const [seedInput, setSeedInput] = useState('tamamlayıcı sağlık sigortası');
  const [urlInput, setUrlInput] = useState('');
  const [ideas, setIdeas] = useState<KeywordIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [sort, setSort] = useState<'volume' | 'comp' | 'cpc'>('volume');

  async function search() {
    setError(null);
    setLoading(true);
    try {
      const seeds = seedInput
        .split(/[,\n]+/g)
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/admin/ads/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seedKeywords: seeds.length > 0 ? seeds : undefined,
          url: urlInput.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Arama başarısız.');
      } else {
        setIdeas(data.ideas || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata.');
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  }

  const sorted = [...ideas].sort((a, b) => {
    if (sort === 'volume') return b.avgMonthlySearches - a.avgMonthlySearches;
    if (sort === 'comp') return (b.competitionIndex || 0) - (a.competitionIndex || 0);
    return microsToTry(b.highTopOfPageBidMicros) - microsToTry(a.highTopOfPageBidMicros);
  });

  return (
    <div className="space-y-6">
      <section className="bg-white border rounded-xl p-5 space-y-4">
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tohum kelimeler (virgül ile)
            </label>
            <textarea
              rows={3}
              value={seedInput}
              onChange={(e) => setSeedInput(e.target.value)}
              className="form-input"
              placeholder="ör: tamamlayıcı sağlık sigortası, tss teklif"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Veya URL (opsiyonel)
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="form-input"
              placeholder="https://tamamlayicisaglikbeylikduzu.com/sigortalar/tamamlayici-saglik"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL verilirse o sayfanın içeriğinden ilham alınır.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {SEED_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setSeedInput(p.seeds.join(', '))}
              className="text-xs rounded-full border px-3 py-1 hover:bg-gray-50"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-gray-500">
            Dil: Türkçe (1037) · Bölge: Türkiye (2792)
          </p>
          <button
            type="button"
            onClick={search}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Fikir Getir
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </section>

      {ideas.length > 0 && (
        <section className="bg-white border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
            <h2 className="text-base font-semibold text-gray-900">
              {ideas.length} sonuç
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Sırala:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as 'volume' | 'comp' | 'cpc')}
                className="form-input w-auto py-1"
              >
                <option value="volume">Arama Hacmi</option>
                <option value="comp">Rekabet</option>
                <option value="cpc">Tahmini CPC</option>
              </select>
              <button
                type="button"
                onClick={() => copy(ideas.map((i) => i.text).join('\n'))}
                className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-gray-50"
              >
                <Copy className="h-3.5 w-3.5" /> Hepsini kopyala
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-600 uppercase tracking-wide border-b">
                <tr>
                  <th className="text-left py-2 pr-3">Anahtar Kelime</th>
                  <th className="text-right py-2 px-3">Aylık Arama</th>
                  <th className="text-right py-2 px-3">Rekabet</th>
                  <th className="text-right py-2 px-3">Tahmini CPC</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sorted.map((idea) => {
                  const lowBid = microsToTry(idea.lowTopOfPageBidMicros);
                  const highBid = microsToTry(idea.highTopOfPageBidMicros);
                  return (
                    <tr key={idea.text} className="hover:bg-gray-50">
                      <td className="py-2 pr-3 text-gray-900">{idea.text}</td>
                      <td className="py-2 px-3 text-right tabular-nums">
                        {idea.avgMonthlySearches.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            idea.competition === 'HIGH'
                              ? 'bg-red-100 text-red-700'
                              : idea.competition === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-700'
                              : idea.competition === 'LOW'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {idea.competition}
                          {idea.competitionIndex !== undefined ? ` · ${idea.competitionIndex}` : ''}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right tabular-nums text-gray-600">
                        {lowBid && highBid
                          ? `${tlFormat(lowBid)} – ${tlFormat(highBid)}`
                          : '—'}
                      </td>
                      <td className="py-2 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => copy(idea.text)}
                            className="text-xs text-blue-600 hover:underline inline-flex items-center gap-0.5"
                          >
                            {copied === idea.text ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            kopyala
                          </button>
                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(idea.text)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-gray-500 hover:text-gray-700 inline-flex items-center gap-0.5"
                            title="Google'da ara"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
