import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/admin/auth';
import { listLeads, leadStats } from '@/lib/admin/lead-log';

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const leads = listLeads(500);
  const stats = leadStats();
  return NextResponse.json({ leads, stats });
}
