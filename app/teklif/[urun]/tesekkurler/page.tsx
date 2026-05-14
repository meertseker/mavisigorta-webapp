import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import { getAgent, getInsuranceById, getInsurances, getSiteSettings } from '@/lib/content';
import { buildWaUrl } from '@/lib/whatsapp';
import type { InsuranceSlug } from '@/lib/types';

export const dynamicParams = false;

export function generateStaticParams() {
  return getInsurances().map((i) => ({ urun: i.id }));
}

interface PageProps {
  params: Promise<{ urun: InsuranceSlug }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { urun } = await params;
  const ins = getInsuranceById(urun);
  return {
    title: `Teklif Talebiniz Alındı${ins ? ` - ${ins.title}` : ''}`,
    description: 'Teklif talebiniz başarıyla alındı, en kısa sürede sizinle iletişime geçeceğiz.',
    robots: { index: false, follow: false },
  };
}

export default async function ThanksPage({ params }: PageProps) {
  const { urun } = await params;
  const ins = getInsuranceById(urun);
  if (!ins) notFound();
  const settings = getSiteSettings();
  const agent = getAgent();
  const waUrl = buildWaUrl({ product: ins.id });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <Navigation siteName={settings.siteName} />
      <div className="h-20" />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 text-4xl mb-5 animate-[bounce_1s_ease-in-out_1]">
              ✓
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
              Talebiniz alındı, teşekkürler!
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              {agent.name} en geç <strong>30 dakika içinde</strong> sizi arayacak ve {ins.title} için en
              uygun teklifi hazırlayacak.
            </p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 shadow-xl p-6 md:p-8 mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Sırada ne var?</h2>
            <ol className="space-y-4">
              {[
                { t: '10 dakika', d: 'WhatsApp\'tan onay mesajı geliyor.' },
                { t: '30 dakika', d: `${agent.name} sizi arayıp ihtiyacınızı dinleyecek.` },
                { t: '24 saat', d: 'E-posta ile yazılı, karşılaştırmalı teklif paylaşılacak.' },
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-red to-secondary-orange text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">+{step.t}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{step.d}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl bg-[#25D366]/10 border border-[#25D366]/40 p-6 md:p-7 text-center mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Beklemek istemiyor musunuz?
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              {agent.name}'le hemen WhatsApp'tan konuşun.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-bold shadow-lg hover:scale-105 transition-transform"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z" />
              </svg>
              WhatsApp ile yaz
            </a>
          </div>

          <div className="rounded-2xl bg-gray-50 dark:bg-white/5 p-6">
            <blockquote className="text-sm md:text-base italic text-gray-700 dark:text-gray-300 mb-3">
              "Soner Bey ilk aramada anlaşmalı hastane listesini ve dezavantajları açıkça anlattı. Hemen
              poliçeyi başlattı, 24 saatte e-posta ile elime ulaştı."
            </blockquote>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              — Zeynep Y., Beylikdüzü · TSS müşterisi
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/"
              className="text-sm font-semibold text-primary-red hover:underline"
            >
              ← Ana sayfaya dön
            </Link>
          </div>
        </div>
      </section>

      <Footer
        siteName={settings.siteName}
        phone={settings.contact.phone}
        email={settings.contact.email}
        address={settings.contact.address}
        socialMedia={settings.socialMedia}
      />
    </div>
  );
}
