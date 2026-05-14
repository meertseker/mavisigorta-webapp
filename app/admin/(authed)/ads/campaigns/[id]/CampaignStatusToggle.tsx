'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Play, Pause } from 'lucide-react';
import type { CampaignStatus } from '@/lib/google-ads/types';

export default function CampaignStatusToggle({
  id,
  resourceName,
  status,
}: {
  id: string;
  resourceName: string;
  status: CampaignStatus;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState<CampaignStatus>(status);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function toggle() {
    const next: CampaignStatus = current === 'ENABLED' ? 'PAUSED' : 'ENABLED';
    const action = next === 'ENABLED' ? 'aktif et' : 'duraklat';
    if (!confirm(`Kampanyayı ${action}eyecek misiniz?`)) return;

    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/ads/campaigns/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next, resourceName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || 'İşlem başarısız.');
      } else {
        setCurrent(next);
        router.refresh();
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Hata.');
    } finally {
      setBusy(false);
    }
  }

  const isEnabled = current === 'ENABLED';
  const isRemoved = current === 'REMOVED';

  return (
    <div className="flex items-center gap-3">
      <span
        className={`text-xs font-semibold px-2 py-1 rounded ${
          isEnabled
            ? 'bg-green-100 text-green-800'
            : current === 'PAUSED'
            ? 'bg-amber-100 text-amber-800'
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        {current}
      </span>
      {!isRemoved && (
        <button
          onClick={toggle}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isEnabled ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isEnabled ? 'Duraklat' : 'Aktif Et'}
        </button>
      )}
      {err && <span className="text-xs text-red-600">{err}</span>}
    </div>
  );
}
