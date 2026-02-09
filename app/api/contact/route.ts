import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  // Initialize Resend with API key from environment
  const resend = new Resend(process.env.RESEND_API_KEY || '');
  
  try {
    const body = await request.json();
    const { name, email, phone, message, courseInterest } = body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Tüm alanları doldurunuz' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      );
    }

    // Check if RESEND_API_KEY is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Email will not be sent.');
      // In development, just return success
      if (process.env.NODE_ENV === 'development') {
        console.log('Contact form submission (dev mode):', { name, email, phone, message, courseInterest });
        return NextResponse.json(
          { success: true, message: 'Mesajınız alındı (dev mode)' },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: 'Email servis konfigüre edilmemiş' },
        { status: 500 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Mavi Sigorta <onboarding@resend.dev>', // In production, use your verified domain
      to: process.env.CONTACT_EMAIL || 'info@mavisigorta.net',
      replyTo: email,
      subject: `Yeni İletişim Formu - ${name}`,
      html: `
        <h2>Yeni İletişim Formu Mesajı</h2>
        <p><strong>Ad Soyad:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        ${courseInterest ? `<p><strong>İlgilenilen Sigorta:</strong> ${courseInterest}</p>` : ''}
        <p><strong>Mesaj:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'E-posta gönderilirken bir hata oluştu' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Mesajınız başarıyla gönderildi' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu, lütfen daha sonra tekrar deneyiniz' },
      { status: 500 }
    );
  }
}
