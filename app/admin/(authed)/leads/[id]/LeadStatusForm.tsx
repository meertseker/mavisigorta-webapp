'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2 } from 'lucide-react';
import type { LeadStatus } from '@/lib/types';

const STATUSES: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'Yeni' },
  { value: 'contacted', label: 'İletişime geçildi' },
  { value: 'quoted', label: 'Teklif verildi' },
  { value: 'won', label: 'Kazanıldı' },
  { value: 'lost', label: 'Kaybedildi' },
];

export default function LeadStatusForm({
  leadId,
  initialStatus,
  initialNotes,
}: {
  leadId: string;
  initialStatus: LeadStatus;
  initialNotes: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(initialStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        setSavedAt(new Date());
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Durum</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as LeadStatus)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Notlar</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Görüşme notları, teklif detayları, sonraki adımlar..."
        />
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Kaydet
      </button>

      {savedAt && (
        <p className="text-xs text-green-700">
          Kaydedildi · {savedAt.toLocaleTimeString('tr-TR')}
        </p>
      )}
    </div>
  );
}
