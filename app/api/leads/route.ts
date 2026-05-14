import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { scoreLead, isWorkingHours } from '@/lib/lead-scoring';
import { appendLead } from '@/lib/admin/lead-log';
import type { LeadInput } from '@/lib/types';

const PRODUCT_LABELS: Record<string, string> = {
  'tamamlayici-saglik': 'Tamamlayıcı Sağlık Sigortası',
  'moduler-saglik': 'Modüler Sağlık Sigortası',
  kasko: 'Kasko Sigortası',
  trafik: 'Trafik Sigortası',
  konut: 'Konut Sigortası',
  isyeri: 'İşyeri Sigortası',
  dask: 'DASK Deprem Sigortası',
  'seyahat-saglik': 'Seyahat Sağlık Sigortası',
  genel: 'Genel Bilgi',
};

function validate(body: Partial<LeadInput>): string | null {
  if (!body.product || typeof body.product !== 'string') return 'product zorunlu';
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) return 'name zorunlu';
  if (!body.phone || typeof body.phone !== 'string') return 'phone zorunlu';
  const digits = body.phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return 'Geçerli bir telefon numarası girin';
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return 'Geçerli bir e-posta girin';
  if (!body.kvkkConsent) return 'KVKK onayı zorunludur';
  return null;
}

function formatStep1(step1?: Record<string, unknown>): string {
  if (!step1 || Object.keys(step1).length === 0) return '';
  const rows = Object.entries(step1)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666;">${k}</td><td><strong>${String(v)}</strong></td></tr>`)
    .join('');
  return `<table style="font-size:14px;margin:8px 0 16px;">${rows}</table>`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<LeadInput>;

    const err = validate(body);
    if (err) {
      return NextResponse.json({ error: err }, { status: 400 });
    }

    const lead: LeadInput = {
      product: body.product as LeadInput['product'],
      name: body.name!.trim(),
      phone: body.phone!.replace(/\D/g, ''),
      email: body.email?.trim(),
      city: body.city,
      message: body.message,
      kvkkConsent: !!body.kvkkConsent,
      marketingConsent: !!body.marketingConsent,
      step1: body.step1,
      source: body.source,
      utm: body.utm,
    };

    const score = scoreLead(lead, { workingHours: isWorkingHours() });
    const productLabel = PRODUCT_LABELS[lead.product] || lead.product;

    // Persist via dev lead-log (file-based). Supabase entegrasyonu sonra eklenecek.
    const stored = appendLead({ ...lead, score });

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const ownerEmail = process.env.CONTACT_EMAIL || 'info@mavisigorta.net';
      const utmRow = lead.utm?.source
        ? `<p style="margin:4px 0;color:#666;">UTM: ${lead.utm.source} / ${lead.utm.medium || '-'} / ${lead.utm.campaign || '-'}</p>`
        : '';

      try {
        await resend.emails.send({
          from: 'Mavi Sigorta Lead <onboarding@resend.dev>',
          to: ownerEmail,
          replyTo: lead.email,
          subject: `🟢 [${score}] Yeni ${productLabel} talebi - ${lead.name}`,
          html: `
            <h2>Yeni Sigorta Teklif Talebi</h2>
            <p><strong>Skor:</strong> ${score}/100 ${score >= 70 ? '🔥' : ''}</p>
            <p><strong>Ürün:</strong> ${productLabel}</p>
            <p><strong>Ad Soyad:</strong> ${lead.name}</p>
            <p><strong>Telefon:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>
            ${lead.email ? `<p><strong>E-posta:</strong> ${lead.email}</p>` : ''}
            ${lead.city ? `<p><strong>Şehir:</strong> ${lead.city}</p>` : ''}
            <p><strong>Pazarlama onayı:</strong> ${lead.marketingConsent ? 'Evet' : 'Hayır'}</p>
            ${formatStep1(lead.step1 as Record<string, unknown>)}
            ${lead.message ? `<p><strong>Mesaj:</strong><br>${lead.message.replace(/\n/g, '<br>')}</p>` : ''}
            ${utmRow}
          `,
        });

        if (lead.email) {
          await resend.emails.send({
            from: 'Mavi Sigorta <onboarding@resend.dev>',
            to: lead.email,
            subject: `Mavi Sigorta - ${productLabel} teklif talebiniz alındı`,
            html: `
              <p>Merhaba ${lead.name},</p>
              <p>${productLabel} için teklif talebiniz alındı. Soner Bey en geç 30 dakika içinde sizinle iletişime geçecek.</p>
              <p><strong>Sonraki adımlar:</strong></p>
              <ul>
                <li>10 dakika içinde WhatsApp mesajı</li>
                <li>30 dakika içinde telefon görüşmesi</li>
                <li>24 saat içinde e-posta ile yazılı teklif</li>
              </ul>
              <p>Acil bir durumda WhatsApp: <a href="https://wa.me/905324807617">905324807617</a></p>
              <p>Saygılarımızla,<br>Soner Şeker — Mavi Sigorta</p>
            `,
          });
        }
      } catch (mailErr) {
        console.error('Resend error (non-fatal):', mailErr);
      }
    } else {
      console.log('[lead-dev]', { score, lead });
    }

    return NextResponse.json(
      {
        success: true,
        id: stored.id,
        score,
        message: 'Teklif talebiniz alındı. Soner Bey en geç 30 dakika içinde sizi arayacak.',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Lead API error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu, lütfen daha sonra tekrar deneyiniz.' },
      { status: 500 },
    );
  }
}
