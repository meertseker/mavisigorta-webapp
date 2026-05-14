import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/admin/auth';
import { generateKeywordIdeas } from '@/lib/google-ads/client';

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const body = (await request.json()) as {
      seedKeywords?: string[];
      url?: string;
      language?: string;
      geoTargetConstants?: string[];
    };

    const ideas = await generateKeywordIdeas(body);
    return NextResponse.json({ ideas });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Bilinmeyen hata', ideas: [] },
      { status: 502 },
    );
  }
}
