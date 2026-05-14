import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { scoreLead, isWorkingHours } from '@/lib/lead-scoring';
import type { LeadInput } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      message,
      insuranceType,
      kvkkConsent,
      marketingConsent,
    } = body as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
      insuranceType?: string;
      kvkkConsent?: boolean;
      marketingConsent?: boolean;
    };

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: 'Tüm zorunlu alanları doldurunuz.' }, { status: 400 });
    }

    if (!kvkkConsent) {
      return NextResponse.json({ error: 'KVKK aydınlatma metnini onaylamanız zorunludur.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi giriniz.' }, { status: 400 });
    }

    const lead: LeadInput = {
      product: 'genel',
      name: name.trim(),
      phone: phone.replace(/\D/g, ''),
      email,
      message,
      kvkkConsent: true,
      marketingConsent: !!marketingConsent,
      step1: insuranceType ? { insuranceType } : undefined,
      source: 'organic',
    };

    const score = scoreLead(lead, { workingHours: isWorkingHours() });

    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Inquiry will not be emailed.');
      if (process.env.NODE_ENV === 'development') {
        console.log('[contact-dev]', { score, lead });
        return NextResponse.json(
          { success: true, message: 'Mesajınız alındı (dev mode).' },
          { status: 200 },
        );
      }
      return NextResponse.json({ error: 'Email servis konfigüre edilmemiş.' }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: 'Mavi Sigorta <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'info@mavisigorta.net',
      replyTo: email,
      subject: `[${score}] İletişim Formu - ${name}`,
      html: `
        <h2>Yeni İletişim Formu Mesajı</h2>
        <p><strong>Skor:</strong> ${score}/100</p>
        <p><strong>Ad Soyad:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Telefon:</strong> <a href="tel:${phone}">${phone}</a></p>
        ${insuranceType ? `<p><strong>İlgilenilen Sigorta:</strong> ${insuranceType}</p>` : ''}
        <p><strong>Pazarlama onayı:</strong> ${marketingConsent ? 'Evet' : 'Hayır'}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'E-posta gönderilirken bir hata oluştu.' }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: 'Mesajınız başarıyla gönderildi.' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu, lütfen daha sonra tekrar deneyiniz.' },
      { status: 500 },
    );
  }
}
