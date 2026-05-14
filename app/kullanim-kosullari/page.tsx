import type { Metadata } from 'next';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getSiteSettings } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları',
  description: 'Mavi Sigorta Allianz Aracılık Hizmetleri web sitesi kullanım koşulları.',
  alternates: { canonical: '/kullanim-kosullari' },
};

export default function TermsPage() {
  const settings = getSiteSettings();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation siteName={settings.siteName} />
      <div className="h-20" />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Breadcrumbs items={[{ label: 'Kullanım Koşulları' }]} />
        <article className="prose dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white max-w-none mt-6">
          <h1>Kullanım Koşulları</h1>
          <p>
            Bu web sitesini kullanarak aşağıdaki şart ve koşulları kabul etmiş sayılırsınız. Lütfen
            siteyi kullanmadan önce dikkatlice okuyun.
          </p>

          <h2>1. Bilgilendirme Niteliği</h2>
          <p>
            Sitedeki içerikler ve teklif tahminleri bilgilendirme amaçlıdır ve bir teklif teşkil
            etmez. Bağlayıcı sigorta poliçesi ancak sigorta şirketi onayı ve sizin yazılı kabulünüz
            ile düzenlenir.
          </p>

          <h2>2. Fikri Mülkiyet</h2>
          <p>
            Sitedeki tüm metin, görsel, logo ve içerikler Mavi Sigorta'ya aittir; yazılı izin
            olmadan kopyalanamaz, dağıtılamaz.
          </p>

          <h2>3. Sorumluluk Reddi</h2>
          <p>
            Mavi Sigorta, fiyat tahminleri, anlaşmalı şirket listeleri ve içeriklerin doğruluğunu
            koruma çabasındadır; ancak fiyatlar sigorta şirketlerinin tarifelerine, müşteri
            profillerine ve resmi düzenlemelere göre değişebilir.
          </p>

          <h2>4. Üçüncü Taraf Bağlantıları</h2>
          <p>
            Site, sigorta şirketlerinin sayfalarına bağlantılar içerebilir. Bu sitelerin içerik ve
            gizlilik politikalarından Mavi Sigorta sorumlu değildir.
          </p>

          <h2>5. Uygulanacak Hukuk</h2>
          <p>
            İşbu koşullar Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlık halinde İstanbul
            (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir.
          </p>

          <h2>6. İletişim</h2>
          <p>
            {settings.companyInfo.fullName}<br />
            {settings.contact.fullAddress}<br />
            Telefon: {settings.contact.phone} · E-posta: {settings.contact.email}
          </p>
        </article>
      </main>

      <Footer
        siteName={settings.siteName}
        phone={settings.contact.phone}
        email={settings.contact.email}
        address={settings.contact.address}
        socialMedia={settings.socialMedia}
      />
    </div>
  );
}
