import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/admin/auth';
import { getLeadById, updateLead } from '@/lib/admin/lead-log';
import type { LeadStatus } from '@/lib/types';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { id } = await params;
  const lead = getLeadById(id);
  if (!lead) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ lead });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = (await req.json()) as { status?: LeadStatus; notes?: string };
  const updated = updateLead(id, body);
  if (!updated) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ lead: updated });
}
