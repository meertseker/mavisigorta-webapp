'use client';

import { useEffect, useState } from 'react';
import { trackExitIntentShow, trackExitIntentConvert, trackQuoteFormError } from '@/lib/analytics';

interface ExitIntentModalProps {
  /** Storage key used to avoid showing the modal more than once per session. */
  storageKey?: string;
  /** Minimum dwell time (ms) before exit intent fires. */
  delayMs?: number;
}

export default function ExitIntentModal({
  storageKey = 'mavi_exit_intent_v1',
  delayMs = 8000,
}: ExitIntentModalProps) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (window.sessionStorage.getItem(storageKey) === '1') return;
    } catch {
      // Storage access blocked — fall through and allow modal to show.
    }

    let armed = false;
    const armTimer = window.setTimeout(() => {
      armed = true;
    }, delayMs);

    const fire = () => {
      if (!armed || open) return;
      try {
        window.sessionStorage.setItem(storageKey, '1');
      } catch {
        /* ignore */
      }
      setOpen(true);
      trackExitIntentShow();
    };

    const onMouseOut = (e: MouseEvent) => {
      // Cursor leaves top viewport edge (desktop exit intent).
      if (e.clientY <= 0 && !e.relatedTarget) {
        fire();
      }
    };

    let lastTouchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0]?.clientY ?? 0;
      // Aggressive fast swipe down past the very top edge → back button proxy.
      if (window.scrollY < 30 && currentY - lastTouchY > 60) {
        fire();
      }
    };

    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
    };
  }, [delayMs, open, storageKey]);

  const close = () => setOpen(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!/^[0-9 +()-]{10,20}$/.test(phone)) {
      trackQuoteFormError('exit_intent', 'invalid_phone');
      return;
    }
    setSubmitting(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: 'genel',
          name: name || 'Bilinmiyor',
          phone,
          kvkkConsent: true,
          source: 'exit_intent',
        }),
      });
      trackExitIntentConvert();
      setDone(true);
    } catch (err) {
      trackQuoteFormError('exit_intent', 'network');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-gray-900 shadow-2xl p-6 md:p-8 border border-white/20"
      >
        <button
          onClick={close}
          aria-label="Kapat"
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          ✕
        </button>

        {!done ? (
          <>
            <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-gold/15 text-secondary-amber text-xs font-bold">
              ⏰ AYRILMADAN
            </div>
            <h2 id="exit-modal-title" className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Telefonunuzu bırakın, 1 saat içinde arayalım.
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-5 text-sm md:text-base">
              Soner Bey sizi ücretsiz arar, ihtiyacınıza özel en uygun teklifi sunar. Spam yok, sadece sizin için karşılaştırma.
            </p>

            <form onSubmit={onSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Adınız (opsiyonel)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
              />
              <input
                type="tel"
                inputMode="tel"
                placeholder="0532 480 76 17"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
                aria-label="Telefon numarası"
              />
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                Numaranızı 3. taraflarla paylaşmıyoruz; KVKK kapsamında sadece teklif vermek için kullanıyoruz.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-red to-secondary-orange text-white font-bold text-base shadow-glow hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:hover:scale-100"
              >
                {submitting ? 'Gönderiliyor…' : 'Beni Arayın'}
              </button>
            </form>

            <button
              onClick={close}
              className="w-full mt-3 text-xs text-gray-500 dark:text-gray-400 hover:underline"
            >
              Hayır teşekkürler, ayrılmak istiyorum.
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Aldık, teşekkürler!</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Soner Bey 1 saat içinde sizi arayacak. İsterseniz şimdi WhatsApp'tan da yazabilirsiniz.
            </p>
            <button
              onClick={close}
              className="mt-5 px-6 py-3 rounded-xl bg-primary-red text-white font-semibold"
            >
              Kapat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
