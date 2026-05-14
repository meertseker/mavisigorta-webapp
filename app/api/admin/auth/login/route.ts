import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  createSessionCookieValue,
  verifyAdminCredentials,
} from '@/lib/admin/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'E-posta ve şifre zorunlu.' }, { status: 400 });
    }

    let ok: boolean;
    try {
      ok = verifyAdminCredentials(email, password);
    } catch (err) {
      console.error('Admin auth config error:', err);
      return NextResponse.json(
        { error: 'Admin yapılandırması eksik. .env.local dosyasını kontrol edin.' },
        { status: 500 },
      );
    }

    if (!ok) {
      // Slight artificial delay to slow down brute force attempts.
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json({ error: 'E-posta veya şifre hatalı.' }, { status: 401 });
    }

    const ttl = Number(process.env.ADMIN_SESSION_TTL || 86400);
    const value = createSessionCookieValue(email, ttl);

    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE_NAME, value, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: ttl,
    });
    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Beklenmedik bir hata oluştu.' }, { status: 500 });
  }
}
