'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Megaphone,
  BarChart3,
  Search,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const NAV: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leadler', icon: Users },
  { href: '/admin/ads', label: 'Reklamlar', icon: Megaphone },
  { href: '/admin/ads/campaigns', label: 'Kampanyalar', icon: ChevronRight },
  { href: '/admin/ads/performance', label: 'Performans', icon: BarChart3 },
  { href: '/admin/ads/keywords', label: 'Anahtar Kelimeler', icon: Search },
];

export default function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3">
        <Link href="/admin" className="font-semibold">Mavi Admin</Link>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menüyü aç/kapat"
          className="p-2"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <div className="md:flex">
        {/* Sidebar */}
        <aside
          className={`${
            mobileOpen ? 'block' : 'hidden'
          } md:block fixed md:sticky inset-x-0 md:inset-x-auto top-12 md:top-0 z-20 w-full md:w-64 bg-white border-r md:h-screen md:overflow-y-auto`}
        >
          <div className="hidden md:flex items-center gap-2 px-6 py-5 border-b">
            <div className="h-9 w-9 rounded-md bg-blue-600 text-white grid place-items-center font-bold">
              MS
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">Mavi Sigorta</div>
              <div className="text-xs text-gray-500">Admin Panel</div>
            </div>
          </div>

          <nav className="px-3 py-4 space-y-1">
            {NAV.map((item) => {
              const active =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                    active
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t px-4 py-4 mt-auto">
            <div className="text-xs text-gray-500 mb-1">Oturum açık</div>
            <div className="text-sm font-medium truncate">{email}</div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" /> Çıkış yap
            </button>
            <Link
              href="/"
              className="mt-2 block text-center text-xs text-gray-500 hover:text-gray-700"
            >
              ← Siteye dön
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
