'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Send,
  Save,
  Eye,
  EyeOff,
  Trash,
  Sparkles,
} from 'lucide-react';
import type {
  Campaign,
  AdGroup,
  ResponsiveSearchAd,
  KeywordItem,
  BiddingStrategy,
} from '@/lib/google-ads/types';
import { tryToMicros } from '@/lib/google-ads/types';
import {
  SitelinksEditor,
  CalloutsEditor,
  CallEditor,
  AdScheduleEditor,
} from './AssetEditors';
import AdPreview from './AdPreview';
import PreflightChecklist, { runPreflight } from './PreflightChecklist';

type DraftCampaign = Omit<Campaign, 'id' | 'resourceName' | 'metrics'>;

const DRAFT_STORAGE_PREFIX = 'mavi.ads.draft.';

type Tab = 'settings' | 'ads' | 'assets' | 'schedule';

export default function CampaignBuilder({
  initial,
  draftKey,
}: {
  initial: DraftCampaign;
  /** Unique key per template (ör: "new:tamamlayici-saglik") for localStorage autosave. */
  draftKey: string;
}) {
  const router = useRouter();
  const storageKey = `${DRAFT_STORAGE_PREFIX}${draftKey}`;
  const [draft, setDraft] = useState<DraftCampaign>(initial);
  const [tab, setTab] = useState<Tab>('settings');
  const [showPreview, setShowPreview] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showChecklist, setShowChecklist] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [restored, setRestored] = useState(false);
  const initialLoadRef = useRef(true);

  // ── localStorage autosave ────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { draft: DraftCampaign; savedAt: string };
        setDraft(parsed.draft);
        setSavedAt(new Date(parsed.savedAt));
        setRestored(true);
      }
    } catch {
      /* ignore */
    }
    initialLoadRef.current = false;
  }, [storageKey]);

  useEffect(() => {
    if (initialLoadRef.current) return;
    if (typeof window === 'undefined') return;
    const t = setTimeout(() => {
      try {
        const now = new Date();
        localStorage.setItem(
          storageKey,
          JSON.stringify({ draft, savedAt: now.toISOString() }),
        );
        setSavedAt(now);
      } catch {
        /* quota error fine */
      }
    }, 600);
    return () => clearTimeout(t);
  }, [draft, storageKey]);

  function clearDraft() {
    if (!confirm('Bu taslağı tamamen sıfırlamak istediğinize emin misiniz?')) return;
    localStorage.removeItem(storageKey);
    setDraft(initial);
    setRestored(false);
    setSavedAt(null);
  }

  // ── Setters ──────────────────────────────────────────────────────────────
  function updateField<K extends keyof DraftCampaign>(key: K, value: DraftCampaign[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function updateAdGroup(i: number, patch: Partial<AdGroup>) {
    setDraft((d) => ({
      ...d,
      adGroups: d.adGroups.map((ag, idx) => (idx === i ? { ...ag, ...patch } : ag)),
    }));
  }

  function addAdGroup() {
    setDraft((d) => ({
      ...d,
      adGroups: [
        ...d.adGroups,
        {
          name: 'Yeni Reklam Grubu',
          status: 'PAUSED',
          keywords: [],
          ads: [
            {
              finalUrl: 'https://tamamlayicisaglikbeylikduzu.com/teklif',
              headlines: [],
              descriptions: [],
            },
          ],
        },
      ],
    }));
  }

  function removeAdGroup(i: number) {
    setDraft((d) => ({
      ...d,
      adGroups: d.adGroups.filter((_, idx) => idx !== i),
    }));
  }

  // ── Publish flow ─────────────────────────────────────────────────────────
  const preflight = useMemo(() => runPreflight(draft), [draft]);
  const errorCount = preflight.filter((p) => p.status === 'error').length;
  const warningCount = preflight.filter((p) => p.status === 'warning').length;

  async function actuallyPublish() {
    setError(null);
    setSuccess(null);
    setPublishing(true);
    try {
      const res = await fetch('/api/admin/ads/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaign: draft }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Yayınlama başarısız.');
        setShowChecklist(false);
      } else {
        setSuccess(
          data.result?.warnings?.length
            ? `Yayınlandı. Not: ${data.result.warnings.join(' ')}`
            : `Yayınlandı — Google Ads'de PAUSED olarak hazır.`,
        );
        setShowChecklist(false);
        localStorage.removeItem(storageKey);
        setTimeout(() => router.push('/admin/ads/campaigns'), 2500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beklenmedik hata.');
      setShowChecklist(false);
    } finally {
      setPublishing(false);
    }
  }

  // ── UI ───────────────────────────────────────────────────────────────────
  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      <div className="space-y-5 min-w-0">
        {restored && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 flex items-start gap-2">
            <Sparkles className="h-4 w-4 mt-0.5 shrink-0" />
            <div className="flex-1">
              <strong>Kaydedilmiş taslak geri yüklendi.</strong> En son düzenleme:{' '}
              {savedAt?.toLocaleString('tr-TR')}.
              <button
                type="button"
                onClick={clearDraft}
                className="ml-2 text-blue-700 hover:underline"
              >
                Sıfırla
              </button>
            </div>
            <button
              type="button"
              onClick={() => setRestored(false)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Tab nav */}
        <nav className="flex flex-wrap gap-1 border-b">
          {(
            [
              ['settings', 'Ayarlar', null],
              ['ads', 'Reklam Grupları', draft.adGroups.length],
              [
                'assets',
                'Asset\'ler',
                (draft.sitelinks?.length || 0) +
                  (draft.callouts?.length || 0) +
                  (draft.call ? 1 : 0),
              ],
              ['schedule', 'Saat & Zamanlama', draft.adSchedule?.length || 0],
            ] as const
          ).map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`relative px-4 py-2 text-sm font-medium transition border-b-2 ${
                tab === key
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
              {count !== null && count !== undefined && (
                <span
                  className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                    tab === key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        {tab === 'settings' && (
          <SettingsTab draft={draft} updateField={updateField} />
        )}

        {tab === 'ads' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Reklam Grupları ({draft.adGroups.length})
              </h2>
              <button
                type="button"
                onClick={addAdGroup}
                className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Yeni grup
              </button>
            </div>

            {draft.adGroups.map((ag, i) => (
              <AdGroupEditor
                key={i}
                adGroup={ag}
                onChange={(patch) => updateAdGroup(i, patch)}
                onRemove={() => removeAdGroup(i)}
                canRemove={draft.adGroups.length > 1}
              />
            ))}
          </div>
        )}

        {tab === 'assets' && (
          <div className="space-y-6">
            <section className="bg-white border rounded-xl p-5 space-y-3">
              <SectionHeader title="Sitelinks" count={draft.sitelinks?.length || 0} />
              <SitelinksEditor
                value={draft.sitelinks || []}
                onChange={(v) => updateField('sitelinks', v)}
              />
            </section>

            <section className="bg-white border rounded-xl p-5 space-y-3">
              <SectionHeader title="Callouts" count={draft.callouts?.length || 0} />
              <CalloutsEditor
                value={draft.callouts || []}
                onChange={(v) => updateField('callouts', v)}
              />
            </section>

            <section className="bg-white border rounded-xl p-5 space-y-3">
              <SectionHeader title="Call (Telefon)" />
              <CallEditor value={draft.call} onChange={(v) => updateField('call', v)} />
            </section>
          </div>
        )}

        {tab === 'schedule' && (
          <section className="bg-white border rounded-xl p-5 space-y-3">
            <SectionHeader
              title="Yayın Saatleri (Ad Schedule)"
              count={draft.adSchedule?.length || 0}
            />
            <AdScheduleEditor
              value={draft.adSchedule || []}
              onChange={(v) => updateField('adSchedule', v)}
            />
          </section>
        )}

        {/* Sticky publish bar */}
        <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-white/95 border-t backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-gray-500">
                <Save className="h-3.5 w-3.5" />
                {savedAt
                  ? `Otomatik kaydedildi · ${savedAt.toLocaleTimeString('tr-TR')}`
                  : 'Henüz kaydedilmedi'}
              </span>
              {errorCount > 0 ? (
                <span className="text-red-600 font-medium">{errorCount} hata</span>
              ) : warningCount > 0 ? (
                <span className="text-amber-600">{warningCount} uyarı</span>
              ) : (
                <span className="text-green-600 font-medium">Yayına hazır</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push('/admin/ads/campaigns')}
                className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={clearDraft}
                className="rounded-md border px-3 py-2 text-sm text-red-600 hover:bg-red-50 inline-flex items-center gap-1"
                title="Taslağı sıfırla"
              >
                <Trash className="h-3.5 w-3.5" /> Sıfırla
              </button>
              <button
                type="button"
                onClick={() => setShowChecklist(true)}
                disabled={errorCount > 0}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                Önizle & Yayınla
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-700 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </p>
          )}
          {success && (
            <p className="mt-2 text-sm text-green-700 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </p>
          )}
        </div>
      </div>

      {/* Right sidebar: preview */}
      <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className="text-xs text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
        >
          {showPreview ? (
            <>
              <EyeOff className="h-3.5 w-3.5" /> Önizlemeyi gizle
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" /> Önizlemeyi göster
            </>
          )}
        </button>
        {showPreview && <AdPreview draft={draft} />}
      </aside>

      {showChecklist && (
        <PreflightChecklist
          draft={draft}
          onPublish={actuallyPublish}
          onCancel={() => setShowChecklist(false)}
          publishing={publishing}
        />
      )}
    </div>
  );
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-base font-semibold text-gray-900">
        {title}
        {count !== undefined && (
          <span className="ml-2 text-xs font-normal text-gray-500">({count})</span>
        )}
      </h3>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────

function SettingsTab({
  draft,
  updateField,
}: {
  draft: DraftCampaign;
  updateField: <K extends keyof DraftCampaign>(key: K, value: DraftCampaign[K]) => void;
}) {
  return (
    <section className="bg-white border rounded-xl p-5 space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Kampanya Ayarları</h2>

      <Field label="Kampanya Adı">
        <input
          type="text"
          value={draft.name}
          onChange={(e) => updateField('name', e.target.value)}
          className="form-input"
          maxLength={120}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Günlük Bütçe (TL)"
          hint="Aylık tutar = günlük × 30.4. Öneri: en az 30 TL/gün."
        >
          <input
            type="number"
            min="10"
            step="5"
            value={draft.budgetDailyTry}
            onChange={(e) => updateField('budgetDailyTry', Number(e.target.value))}
            className="form-input"
          />
        </Field>

        <Field label="Bidding Stratejisi">
          <BiddingPicker
            value={draft.biddingStrategy}
            onChange={(bs) => updateField('biddingStrategy', bs)}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Başlangıç Tarihi (opsiyonel)">
          <input
            type="date"
            value={draft.startDate || ''}
            onChange={(e) => updateField('startDate', e.target.value || undefined)}
            className="form-input"
          />
        </Field>
        <Field label="Bitiş Tarihi (opsiyonel)">
          <input
            type="date"
            value={draft.endDate || ''}
            onChange={(e) => updateField('endDate', e.target.value || undefined)}
            className="form-input"
          />
        </Field>
      </div>

      <Field
        label="Final URL Suffix (opsiyonel)"
        hint="Tüm reklamların final URL'sine eklenecek tracking parametreleri (ör: utm_term={keyword})."
      >
        <input
          type="text"
          value={draft.finalUrlSuffix || ''}
          onChange={(e) => updateField('finalUrlSuffix', e.target.value || undefined)}
          className="form-input"
          placeholder="utm_term={keyword}&utm_content={adgroupid}"
        />
      </Field>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function BiddingPicker({
  value,
  onChange,
}: {
  value: BiddingStrategy;
  onChange: (bs: BiddingStrategy) => void;
}) {
  return (
    <div className="space-y-2">
      <select
        value={value.type}
        onChange={(e) => {
          const type = e.target.value as BiddingStrategy['type'];
          switch (type) {
            case 'MAXIMIZE_CONVERSIONS':
              onChange({ type });
              break;
            case 'MAXIMIZE_CONVERSION_VALUE':
              onChange({ type });
              break;
            case 'TARGET_CPA':
              onChange({ type, targetCpaMicros: tryToMicros(150) });
              break;
            case 'TARGET_ROAS':
              onChange({ type, targetRoas: 3 });
              break;
            case 'MANUAL_CPC':
              onChange({ type });
              break;
          }
        }}
        className="form-input"
      >
        <option value="MAXIMIZE_CONVERSIONS">Maximize Conversions</option>
        <option value="TARGET_CPA">Target CPA</option>
        <option value="MAXIMIZE_CONVERSION_VALUE">Maximize Conversion Value</option>
        <option value="TARGET_ROAS">Target ROAS</option>
        <option value="MANUAL_CPC">Manuel CPC</option>
      </select>

      {value.type === 'TARGET_CPA' && (
        <div>
          <label className="block text-xs text-gray-600 mb-1">Hedef CPA (TL)</label>
          <input
            type="number"
            min="10"
            step="10"
            value={value.targetCpaMicros / 1_000_000}
            onChange={(e) =>
              onChange({ type: 'TARGET_CPA', targetCpaMicros: tryToMicros(Number(e.target.value)) })
            }
            className="form-input"
          />
        </div>
      )}
      {value.type === 'TARGET_ROAS' && (
        <div>
          <label className="block text-xs text-gray-600 mb-1">Hedef ROAS (örn 3 = 300%)</label>
          <input
            type="number"
            min="0.5"
            step="0.1"
            value={value.targetRoas}
            onChange={(e) => onChange({ type: 'TARGET_ROAS', targetRoas: Number(e.target.value) })}
            className="form-input"
          />
        </div>
      )}
    </div>
  );
}

// ─── Ad Group + RSA + Keywords ────────────────────────────────────────────

function AdGroupEditor({
  adGroup,
  onChange,
  onRemove,
  canRemove,
}: {
  adGroup: AdGroup;
  onChange: (patch: Partial<AdGroup>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="bg-white border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <input
          type="text"
          value={adGroup.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="flex-1 text-base font-semibold border-b border-transparent hover:border-gray-200 focus:border-blue-500 focus:outline-none px-1 py-0.5"
        />
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 hover:bg-red-50 rounded p-1.5"
            title="Reklam grubunu sil"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Responsive Search Ad</h3>
        {adGroup.ads.map((ad, i) => (
          <RSAEditor
            key={i}
            ad={ad}
            onChange={(patch) =>
              onChange({
                ads: adGroup.ads.map((a, idx) => (idx === i ? { ...a, ...patch } : a)),
              })
            }
          />
        ))}
      </div>

      <KeywordsEditor
        keywords={adGroup.keywords}
        onChange={(keywords) => onChange({ keywords })}
      />
    </div>
  );
}

function RSAEditor({
  ad,
  onChange,
}: {
  ad: ResponsiveSearchAd;
  onChange: (patch: Partial<ResponsiveSearchAd>) => void;
}) {
  return (
    <div className="space-y-3">
      <Field label="Final URL">
        <input
          type="url"
          value={ad.finalUrl}
          onChange={(e) => onChange({ finalUrl: e.target.value })}
          className="form-input"
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Path 1 (≤15 char)">
          <input
            type="text"
            maxLength={15}
            value={ad.path1 || ''}
            onChange={(e) => onChange({ path1: e.target.value })}
            className="form-input"
          />
        </Field>
        <Field label="Path 2 (≤15 char)">
          <input
            type="text"
            maxLength={15}
            value={ad.path2 || ''}
            onChange={(e) => onChange({ path2: e.target.value })}
            className="form-input"
          />
        </Field>
      </div>

      <StringListEditor
        label={`Başlıklar (${ad.headlines.length}/15, ≤30 karakter)`}
        max={15}
        maxLength={30}
        values={ad.headlines}
        onChange={(headlines) => onChange({ headlines })}
        placeholder="Örn: TSS Teklif - 60 Saniyede"
      />
      <StringListEditor
        label={`Açıklamalar (${ad.descriptions.length}/4, ≤90 karakter)`}
        max={4}
        maxLength={90}
        values={ad.descriptions}
        onChange={(descriptions) => onChange({ descriptions })}
        placeholder="Örn: 60 saniyede online formu doldurun, Allianz ürünleri için teklif sürecini başlatın."
      />
    </div>
  );
}

function StringListEditor({
  label,
  values,
  onChange,
  max,
  maxLength,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  max: number;
  maxLength: number;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {values.length < max && (
          <button
            type="button"
            onClick={() => onChange([...values, ''])}
            className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> Ekle
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {values.map((v, i) => (
          <li key={i} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={v}
                maxLength={maxLength}
                onChange={(e) =>
                  onChange(values.map((val, idx) => (idx === i ? e.target.value : val)))
                }
                placeholder={placeholder}
                className="form-input pr-12"
              />
              <span
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] tabular-nums ${
                  v.length > maxLength ? 'text-red-600' : 'text-gray-400'
                }`}
              >
                {v.length}/{maxLength}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="text-red-500 hover:bg-red-50 rounded p-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function KeywordsEditor({
  keywords,
  onChange,
}: {
  keywords: KeywordItem[];
  onChange: (k: KeywordItem[]) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-700">
          Anahtar Kelimeler ({keywords.length})
        </h3>
        <button
          type="button"
          onClick={() => onChange([...keywords, { text: '', matchType: 'PHRASE' }])}
          className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
        >
          <Plus className="h-3.5 w-3.5" /> Ekle
        </button>
      </div>

      {keywords.length === 0 ? (
        <p className="text-xs text-gray-500">Henüz anahtar kelime yok.</p>
      ) : (
        <ul className="space-y-1">
          {keywords.map((kw, i) => (
            <li key={i} className="flex items-center gap-2">
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  kw.negative
                    ? 'bg-red-100 text-red-700'
                    : kw.matchType === 'EXACT'
                    ? 'bg-purple-100 text-purple-700'
                    : kw.matchType === 'PHRASE'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {kw.negative ? 'NEG' : kw.matchType}
              </span>
              <input
                type="text"
                value={kw.text}
                onChange={(e) =>
                  onChange(
                    keywords.map((k, idx) => (idx === i ? { ...k, text: e.target.value } : k)),
                  )
                }
                className="form-input flex-1"
              />
              <select
                value={kw.negative ? 'NEG' : kw.matchType}
                onChange={(e) => {
                  const v = e.target.value;
                  onChange(
                    keywords.map((k, idx) =>
                      idx === i
                        ? v === 'NEG'
                          ? { ...k, negative: true }
                          : { ...k, matchType: v as KeywordItem['matchType'], negative: false }
                        : k,
                    ),
                  );
                }}
                className="form-input w-28"
              >
                <option value="BROAD">Broad</option>
                <option value="PHRASE">Phrase</option>
                <option value="EXACT">Exact</option>
                <option value="NEG">Negative</option>
              </select>
              <button
                type="button"
                onClick={() => onChange(keywords.filter((_, idx) => idx !== i))}
                className="text-red-500 hover:bg-red-50 rounded p-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
