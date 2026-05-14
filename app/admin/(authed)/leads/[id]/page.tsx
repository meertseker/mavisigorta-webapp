import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Phone, MessageCircle, Mail } from 'lucide-react';
import { getLeadById } from '@/lib/admin/lead-log';
import LeadStatusForm from './LeadStatusForm';

const PRODUCT_LABEL: Record<string, string> = {
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

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = getLeadById(id);
  if (!lead) notFound();

  const waUrl = `https://wa.me/${lead.phone}?text=${encodeURIComponent(
    `Merhaba ${lead.name}, Mavi Sigorta'dan arıyorum. ${
      PRODUCT_LABEL[lead.product] || lead.product
    } teklif talebiniz için sizinle iletişime geçiyorum.`,
  )}`;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> Tüm leadler
      </Link>

      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {PRODUCT_LABEL[lead.product] || lead.product} ·{' '}
            {new Date(lead.createdAt).toLocaleString('tr-TR')}
          </p>
        </div>
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full ${
            lead.score >= 70
              ? 'bg-green-100 text-green-800'
              : lead.score >= 40
              ? 'bg-amber-100 text-amber-800'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Skor: {lead.score}/100
        </span>
      </header>

      <section className="grid sm:grid-cols-3 gap-3">
        <a
          href={`tel:${lead.phone}`}
          className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700 transition"
        >
          <Phone className="h-4 w-4" />
          <span className="font-semibold">Ara: {lead.phone}</span>
        </a>
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-green-600 text-white rounded-lg px-4 py-3 hover:bg-green-700 transition"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="font-semibold">WhatsApp Mesajı</span>
        </a>
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            className="flex items-center gap-2 bg-gray-700 text-white rounded-lg px-4 py-3 hover:bg-gray-800 transition"
          >
            <Mail className="h-4 w-4" />
            <span className="font-semibold truncate">E-posta gönder</span>
          </a>
        )}
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Lead Bilgileri</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Row label="Ad Soyad" value={lead.name} />
              <Row label="Telefon" value={lead.phone} />
              <Row label="E-posta" value={lead.email || '—'} />
              <Row label="Şehir" value={lead.city || '—'} />
              <Row label="KVKK Onayı" value={lead.kvkkConsent ? 'Evet' : 'Hayır'} />
              <Row label="Pazarlama Onayı" value={lead.marketingConsent ? 'Evet' : 'Hayır'} />
              <Row label="Kaynak" value={lead.source || '—'} />
              <Row label="UTM Kaynak" value={lead.utm?.source || '—'} />
              <Row label="UTM Kampanya" value={lead.utm?.campaign || '—'} />
              <Row label="UTM Medium" value={lead.utm?.medium || '—'} />
            </dl>

            {lead.message && (
              <div className="mt-5">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Mesaj</div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 rounded-md p-3 border">
                  {lead.message}
                </p>
              </div>
            )}
          </div>

          {lead.step1 && Object.keys(lead.step1).length > 0 && (
            <div className="bg-white border rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Form Detayları (Step 1)</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {Object.entries(lead.step1).map(([k, v]) => (
                  <Row key={k} label={k} value={String(v)} />
                ))}
              </dl>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Durum</h2>
            <LeadStatusForm
              leadId={lead.id}
              initialStatus={lead.status}
              initialNotes={lead.notes || ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 font-medium break-words">{value}</dd>
    </div>
  );
}
