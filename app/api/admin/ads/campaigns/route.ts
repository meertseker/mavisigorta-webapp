import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/admin/auth';
import { listCampaigns, publishCampaignAsPaused } from '@/lib/google-ads/client';
import type { Campaign } from '@/lib/google-ads/types';

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const campaigns = await listCampaigns();
    return NextResponse.json({ campaigns });
  } catch (err) {
    console.error('listCampaigns error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Bilinmeyen hata', campaigns: [] },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const body = (await request.json()) as { campaign?: Campaign };
    if (!body.campaign) {
      return NextResponse.json({ error: 'campaign payload required' }, { status: 400 });
    }
    const result = await publishCampaignAsPaused(body.campaign);
    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error('publishCampaignAsPaused error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Bilinmeyen hata' },
      { status: 502 },
    );
  }
}
