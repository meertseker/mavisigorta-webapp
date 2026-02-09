'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error);
    }
    
    // In production, this will be sent to Sentry
    // Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-primary-red drop-shadow-[0_0_20px_rgba(0,102,204,0.5)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
          Bir Hata Oluştu
        </h1>
        
        <p className="text-lg text-gray-300 mb-8">
          Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin 
          veya ana sayfaya dönün.
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-8 p-4 bg-primary-red/10 border border-primary-red/30 rounded-lg text-left backdrop-blur-sm">
            <p className="text-sm font-mono text-primary-red-light">
              <strong>Error:</strong> {error.message}
            </p>
            {error.digest && (
              <p className="text-sm font-mono text-accent-rose mt-2">
                <strong>Digest:</strong> {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Tekrar Dene
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 backdrop-blur-xl bg-white/10 border-2 border-white/30 hover:bg-white/20 text-white rounded-lg transition-all duration-300 font-semibold hover:scale-105"
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
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-400">
            Sorun devam ederse lütfen bizimle iletişime geçin:{' '}
            <a
              href="mailto:info@mavisigorta.net"
              className="text-secondary-orange hover:text-secondary-amber hover:underline transition-colors"
            >
              info@mavisigorta.net
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
