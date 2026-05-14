import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'mavi_admin_session';
const DEFAULT_TTL = 24 * 60 * 60; // 24h

export interface AdminSession {
  email: string;
  issuedAt: number;
  expiresAt: number;
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'ADMIN_SESSION_SECRET environment variable is not set or too short (need 32+ chars).',
    );
  }
  return secret;
}

function sign(value: string): string {
  return createHmac('sha256', getSecret()).update(value).digest('base64url');
}

function b64encode(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj), 'utf8').toString('base64url');
}

function b64decode<T>(value: string): T | null {
  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export function createSessionCookieValue(email: string, ttlSeconds = DEFAULT_TTL): string {
  const now = Math.floor(Date.now() / 1000);
  const session: AdminSession = {
    email,
    issuedAt: now,
    expiresAt: now + ttlSeconds,
  };
  const payload = b64encode(session);
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifySessionCookieValue(value: string | undefined): AdminSession | null {
  if (!value) return null;
  const dot = value.lastIndexOf('.');
  if (dot < 0) return null;

  const payload = value.slice(0, dot);
  const sig = value.slice(dot + 1);

  let expected: string;
  try {
    expected = sign(payload);
  } catch {
    return null;
  }
  if (!safeEqual(expected, sig)) return null;

  const session = b64decode<AdminSession>(payload);
  if (!session) return null;
  if (session.expiresAt < Math.floor(Date.now() / 1000)) return null;
  return session;
}

export async function getServerSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const cookie = store.get(COOKIE_NAME);
  return verifySessionCookieValue(cookie?.value);
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  const salt = process.env.ADMIN_PASSWORD_SALT;

  if (!expectedEmail || !expectedHash || !salt) {
    throw new Error('ADMIN_EMAIL, ADMIN_PASSWORD_HASH and ADMIN_PASSWORD_SALT must be set.');
  }
  if (email.trim().toLowerCase() !== expectedEmail.trim().toLowerCase()) return false;

  const hash = createHash('sha256').update(password + salt).digest('hex');
  return safeEqual(hash, expectedHash);
}

export { COOKIE_NAME as ADMIN_COOKIE_NAME };
