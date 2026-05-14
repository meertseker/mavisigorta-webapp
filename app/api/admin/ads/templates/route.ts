import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/admin/auth';
import { listTemplates, getTemplate } from '@/lib/google-ads/templates';
import type { InsuranceSlug } from '@/lib/types';

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const product = searchParams.get('product') as InsuranceSlug | null;

  if (product) {
    const tpl = getTemplate(product);
    if (!tpl) return NextResponse.json({ error: 'template not found' }, { status: 404 });
    return NextResponse.json({ template: { ...tpl, campaign: tpl.build() } });
  }

  return NextResponse.json({
    templates: listTemplates().map((t) => ({
      product: t.product,
      label: t.label,
      defaultBudgetTry: t.defaultBudgetTry,
      defaultTargetCpaTry: t.defaultTargetCpaTry,
    })),
  });
}
