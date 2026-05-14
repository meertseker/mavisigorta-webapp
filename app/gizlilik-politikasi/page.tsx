import type { Metadata } from 'next';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getSiteSettings } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'Mavi Sigorta Allianz Aracılık Hizmetleri gizlilik politikası ve kişisel veri politikaları.',
  alternates: { canonical: '/gizlilik-politikasi' },
};

export default function PrivacyPolicyPage() {
  const settings = getSiteSettings();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation siteName={settings.siteName} />
      <div className="h-20" />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Breadcrumbs items={[{ label: 'Gizlilik Politikası' }]} />
        <article className="prose dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white max-w-none mt-6">
          <h1>Gizlilik Politikası</h1>
          <p>
            Mavi Sigorta Allianz Aracılık Hizmetleri ("Mavi Sigorta", "biz") olarak ziyaretçilerimizin ve
            müşterilerimizin gizliliğine önem veriyoruz. Bu Gizlilik Politikası, web sitemizi
            ziyaret ettiğinizde toplanan bilgilerin nasıl kullanıldığını açıklar.
          </p>

          <h2>1. Topladığımız Bilgiler</h2>
          <ul>
            <li>Teklif formundan ilettiğiniz ad, telefon, e-posta ve sigortalanacak ürüne ait bilgiler</li>
            <li>İletişim formundan ilettiğiniz mesaj ve iletişim bilgileri</li>
            <li>Site kullanımına dair anonim analitik veriler (Google Analytics 4, Microsoft Clarity)</li>
            <li>Pazarlama performansı için UTM parametreleri (geldiğiniz kanal, kampanya)</li>
          </ul>

          <h2>2. Bilgilerin Kullanım Amacı</h2>
          <ul>
            <li>Sigorta teklifi hazırlamak ve sizinle iletişime geçmek</li>
            <li>Müşteri hizmetleri ve sözleşmesel yükümlülükler</li>
            <li>Yasal yükümlülüklere uyum (KVKK, Sigortacılık Kanunu, SEDDK düzenlemeleri)</li>
            <li>Pazarlama iletişimi (yalnızca ayrıca onay verirseniz)</li>
          </ul>

          <h2>3. Veri Paylaşımı</h2>
          <p>
            Verilerinizi yalnızca size teklif hazırlamak amacıyla anlaşmalı olduğumuz sigorta
            şirketleriyle (Allianz, HDI, Anadolu, Mapfre, Ankara, Sompo, Türkiye Sigorta, Quick
            Sigorta vb.) paylaşırız. Verileriniz hiçbir koşulda 3. taraf reklam ağlarına satılmaz.
          </p>

          <h2>4. Çerezler</h2>
          <p>
            Site deneyimini iyileştirmek için zorunlu çerezler ve anonim analitik çerezler
            kullanırız. Tarayıcı ayarlarınızdan çerezleri reddedebilirsiniz; bu durumda bazı
            özellikler çalışmayabilir.
          </p>

          <h2>5. Haklarınız</h2>
          <p>
            KVKK kapsamında verilerinize erişme, düzeltme, silme ve işlemeye itiraz etme haklarınız
            vardır. Talepleriniz için
            <a href={`mailto:${settings.contact.email}`}> {settings.contact.email}</a> adresine
            yazabilirsiniz.
          </p>

          <h2>6. İletişim</h2>
          <p>
            {settings.companyInfo.fullName}<br />
            {settings.contact.fullAddress}<br />
            Telefon: {settings.contact.phone}<br />
            E-posta: {settings.contact.email}
          </p>

          <p className="text-sm text-gray-500">
            Bu politika {new Date().getFullYear()} yılında güncellenmiştir.
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
