import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/admin/auth';
import { getClientStatus } from '@/lib/google-ads/client';

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  return NextResponse.json(getClientStatus());
}
