import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/admin/auth';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Admin Giriş',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getServerSession();
  if (session) redirect('/admin');

  return (
    <div className="min-h-screen bg-gray-50 grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-10 w-10 rounded-md bg-blue-600 text-white grid place-items-center font-bold">
              MS
            </div>
            <span className="text-xl font-semibold text-gray-900">Mavi Sigorta Admin</span>
          </div>
          <p className="text-sm text-gray-600">Yönetici paneline giriş yapın</p>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-6 sm:p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Yalnızca yetkili kullanıcılar erişebilir. Yetkisiz giriş denemeleri kayıt altına alınır.
        </p>
      </div>
    </div>
  );
}
