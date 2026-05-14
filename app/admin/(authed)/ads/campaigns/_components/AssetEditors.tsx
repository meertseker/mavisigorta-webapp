'use client';

import { Plus, Trash2 } from 'lucide-react';
import type {
  SitelinkAsset,
  CalloutAsset,
  CallAsset,
  AdScheduleEntry,
} from '@/lib/google-ads/types';

// ─── Sitelinks ────────────────────────────────────────────────────────────

export function SitelinksEditor({
  value,
  onChange,
}: {
  value: SitelinkAsset[];
  onChange: (v: SitelinkAsset[]) => void;
}) {
  function update(i: number, patch: Partial<SitelinkAsset>) {
    onChange(value.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-600">
          Google önerisi: en az 4 sitelink. ≤25 karakter başlık, 2×35 karakter açıklama.
        </p>
        {value.length < 8 && (
          <button
            type="button"
            onClick={() =>
              onChange([
                ...value,
                {
                  text: '',
                  description1: '',
                  description2: '',
                  finalUrl: 'https://tamamlayicisaglikbeylikduzu.com/',
                },
              ])
            }
            className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> Sitelink ekle
          </button>
        )}
      </div>

      {value.length === 0 ? (
        <p className="text-xs text-gray-500 italic">Henüz sitelink yok.</p>
      ) : (
        <ul className="space-y-3">
          {value.map((sl, i) => (
            <li key={i} className="border rounded-lg p-3 bg-gray-50/50 space-y-2">
              <div className="flex items-start gap-2">
                <div className="flex-1 grid sm:grid-cols-2 gap-2">
                  <CharInput
                    label="Başlık"
                    max={25}
                    value={sl.text}
                    onChange={(v) => update(i, { text: v })}
                    placeholder="Örn: TSS Detayı"
                  />
                  <CharInput
                    label="Final URL"
                    value={sl.finalUrl}
                    onChange={(v) => update(i, { finalUrl: v })}
                    placeholder="https://..."
                    type="url"
                  />
                  <CharInput
                    label="Açıklama 1"
                    max={35}
                    value={sl.description1 || ''}
                    onChange={(v) => update(i, { description1: v })}
                  />
                  <CharInput
                    label="Açıklama 2"
                    max={35}
                    value={sl.description2 || ''}
                    onChange={(v) => update(i, { description2: v })}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                  className="text-red-500 hover:bg-red-50 rounded p-1.5 mt-5"
                  title="Sitelink sil"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Callouts ─────────────────────────────────────────────────────────────

export function CalloutsEditor({
  value,
  onChange,
}: {
  value: CalloutAsset[];
  onChange: (v: CalloutAsset[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-600">
          Google önerisi: en az 4, ideal 8+ callout. ≤25 karakter.
        </p>
        {value.length < 20 && (
          <button
            type="button"
            onClick={() => onChange([...value, { text: '' }])}
            className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> Callout ekle
          </button>
        )}
      </div>

      {value.length === 0 ? (
        <p className="text-xs text-gray-500 italic">Henüz callout yok.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-2">
          {value.map((co, i) => (
            <li key={i} className="flex items-center gap-2">
              <div className="flex-1">
                <CharInput
                  max={25}
                  value={co.text}
                  onChange={(v) =>
                    onChange(value.map((c, idx) => (idx === i ? { text: v } : c)))
                  }
                  placeholder="Örn: 60 Saniyede Teklif"
                />
              </div>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
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

// ─── Call Asset ───────────────────────────────────────────────────────────

export function CallEditor({
  value,
  onChange,
}: {
  value: CallAsset | undefined;
  onChange: (v: CallAsset | undefined) => void;
}) {
  const enabled = !!value;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="call-enabled"
          checked={enabled}
          onChange={(e) =>
            onChange(
              e.target.checked
                ? value || { phoneNumber: '+905324807617', countryCode: 'TR' }
                : undefined,
            )
          }
          className="mt-1"
        />
        <label htmlFor="call-enabled" className="text-sm">
          <span className="font-medium text-gray-900">Call (telefon) extension aktif</span>
          <p className="text-xs text-gray-500 mt-0.5">
            Mobil reklamlarda doğrudan ara butonu gösterir. Mavi Sigorta için CTR'ı önemli
            ölçüde artırır.
          </p>
        </label>
      </div>

      {enabled && value && (
        <div className="grid sm:grid-cols-2 gap-3 pl-6">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
              Telefon (E.164)
            </label>
            <input
              type="tel"
              value={value.phoneNumber}
              onChange={(e) => onChange({ ...value, phoneNumber: e.target.value })}
              className="form-input"
              placeholder="+905324807617"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
              Ülke Kodu
            </label>
            <input
              type="text"
              maxLength={2}
              value={value.countryCode}
              onChange={(e) => onChange({ ...value, countryCode: e.target.value.toUpperCase() })}
              className="form-input"
              placeholder="TR"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Ad Schedule ──────────────────────────────────────────────────────────

const DAY_LABELS: Record<AdScheduleEntry['dayOfWeek'], string> = {
  MONDAY: 'Pzt',
  TUESDAY: 'Sal',
  WEDNESDAY: 'Çar',
  THURSDAY: 'Per',
  FRIDAY: 'Cum',
  SATURDAY: 'Cmt',
  SUNDAY: 'Paz',
};

export function AdScheduleEditor({
  value,
  onChange,
}: {
  value: AdScheduleEntry[];
  onChange: (v: AdScheduleEntry[]) => void;
}) {
  function update(i: number, patch: Partial<AdScheduleEntry>) {
    onChange(value.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-600">
          Hafta içi/sonu saat aralıkları ve bid modifier'ları. Boş bırakırsanız 7/24 yayınlanır.
        </p>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...value,
              { dayOfWeek: 'MONDAY', startHour: 9, endHour: 18, bidModifier: 1.0 },
            ])
          }
          className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
        >
          <Plus className="h-3.5 w-3.5" /> Saat dilimi ekle
        </button>
      </div>

      {value.length === 0 ? (
        <p className="text-xs text-gray-500 italic">Saat kısıtı yok — 7/24 yayında.</p>
      ) : (
        <div className="space-y-1">
          {value.map((entry, i) => (
            <div
              key={i}
              className="flex items-center gap-2 border rounded-md p-2 bg-gray-50/50"
            >
              <select
                value={entry.dayOfWeek}
                onChange={(e) =>
                  update(i, { dayOfWeek: e.target.value as AdScheduleEntry['dayOfWeek'] })
                }
                className="form-input w-24 py-1"
              >
                {Object.entries(DAY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                max={23}
                value={entry.startHour}
                onChange={(e) => update(i, { startHour: Number(e.target.value) })}
                className="form-input w-16 py-1 tabular-nums"
              />
              <span className="text-xs text-gray-500">→</span>
              <input
                type="number"
                min={1}
                max={24}
                value={entry.endHour}
                onChange={(e) => update(i, { endHour: Number(e.target.value) })}
                className="form-input w-16 py-1 tabular-nums"
              />
              <label className="text-xs text-gray-600 ml-auto">Bid ×</label>
              <input
                type="number"
                min={0.1}
                max={10}
                step={0.05}
                value={entry.bidModifier ?? 1.0}
                onChange={(e) => update(i, { bidModifier: Number(e.target.value) })}
                className="form-input w-20 py-1 tabular-nums"
              />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="text-red-500 hover:bg-red-50 rounded p-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shared char-counted input ────────────────────────────────────────────

function CharInput({
  label,
  max,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label?: string;
  max?: number;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      {label && (
        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-0.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          value={value}
          maxLength={max}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`form-input ${max ? 'pr-12' : ''}`}
        />
        {max && (
          <span
            className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] tabular-nums ${
              value.length > max ? 'text-red-600' : 'text-gray-400'
            }`}
          >
            {value.length}/{max}
          </span>
        )}
      </div>
    </div>
  );
}
