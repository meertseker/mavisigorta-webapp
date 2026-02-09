import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Sayfa Bulunamadı',
  description: 'Aradığınız sayfa bulunamadı.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-red mb-4 drop-shadow-[0_0_30px_rgba(0,102,204,0.5)]">404</h1>
          <div className="relative">
            <svg
              className="w-32 h-32 mx-auto text-secondary-orange opacity-60 drop-shadow-[0_0_20px_rgba(0,163,224,0.4)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
          Sayfa Bulunamadı
        </h2>
        
        <p className="text-lg text-gray-300 mb-8">
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir. 
          Lütfen URL'yi kontrol edin veya ana sayfaya dönün.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-red text-white rounded-lg hover:bg-primary-red-dark transition-all duration-300 font-semibold shadow-glow hover:shadow-glow-lg hover:scale-105"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Anasayfaya Dön
          </Link>

          <Link
            href="/kurslar"
            className="inline-flex items-center justify-center px-6 py-3 backdrop-blur-xl bg-white/10 border-2 border-white/30 hover:bg-white/20 text-white rounded-lg transition-all duration-300 font-semibold hover:scale-105"
          >
            Ürünlerimizi İncele
          </Link>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-glass-xl p-6">
          <h3 className="font-semibold text-white mb-4">Popüler Sayfalar:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link
              href="/kurslar"
              className="text-secondary-orange hover:text-secondary-amber hover:underline text-left transition-colors"
            >
              → Hizmetlerimiz
            </Link>
            <Link
              href="/hakkimizda"
              className="text-secondary-orange hover:text-secondary-amber hover:underline text-left transition-colors"
            >
              → Hakkımızda
            </Link>
            <Link
              href="/blog"
              className="text-secondary-orange hover:text-secondary-amber hover:underline text-left transition-colors"
            >
              → Blog
            </Link>
            <Link
              href="/iletisim"
              className="text-secondary-orange hover:text-secondary-amber hover:underline text-left transition-colors"
            >
              → İletişim
            </Link>
            <Link
              href="/sss"
              className="text-secondary-orange hover:text-secondary-amber hover:underline text-left transition-colors"
            >
              → SSS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
