import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/admin/auth';
import { setCampaignStatus } from '@/lib/google-ads/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { id } = await params;
  const { status, resourceName } = (await request.json()) as {
    status?: 'ENABLED' | 'PAUSED' | 'REMOVED';
    resourceName?: string;
  };

  if (!status || !['ENABLED', 'PAUSED', 'REMOVED'].includes(status)) {
    return NextResponse.json({ error: 'invalid status' }, { status: 400 });
  }
  if (!resourceName) {
    return NextResponse.json({ error: 'resourceName required' }, { status: 400 });
  }

  try {
    const result = await setCampaignStatus(resourceName, status);
    return NextResponse.json({ success: true, id, result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Bilinmeyen hata' },
      { status: 502 },
    );
  }
}
