import type { Metadata } from 'next';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getSiteSettings } from '@/lib/content';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description: 'Mavi Sigorta Allianz Aracılık Hizmetleri KVKK aydınlatma metni — kişisel verilerin korunması ve işlenmesi politikası.',
  alternates: { canonical: '/kvkk-aydinlatma' },
};

export default function KvkkPage() {
  const settings = getSiteSettings();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation siteName={settings.siteName} />
      <div className="h-20" />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Breadcrumbs items={[{ label: 'KVKK Aydınlatma Metni' }]} />
        <article className="prose dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white max-w-none mt-6">
          <h1>KVKK Aydınlatma Metni</h1>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, Mavi Sigorta Aracılık
            Hizmetleri ("Mavi Sigorta", "Veri Sorumlusu") tarafından kişisel verileriniz aşağıda
            açıklanan kapsamda işlenmektedir.
          </p>

          <h2>1. Veri Sorumlusu</h2>
          <p>
            {settings.companyInfo.fullName}<br />
            {settings.contact.fullAddress}<br />
            E-posta: {settings.contact.email} · Telefon: {settings.contact.phone}
          </p>

          <h2>2. İşlenen Kişisel Veriler</h2>
          <ul>
            <li>Kimlik bilgileri: ad, soyad</li>
            <li>İletişim bilgileri: telefon, e-posta, ikamet ili/ilçesi</li>
            <li>Sigortalanacak ürüne özel veriler (örn. doğum yılı, plaka, m², seyahat ülkesi)</li>
            <li>Site kullanım verileri: IP adresi, anonim analitik veriler, çerez kayıtları</li>
            <li>Pazarlama kaynak verileri: UTM parametreleri</li>
          </ul>

          <h2>3. İşleme Amaçları</h2>
          <ul>
            <li>Talep ettiğiniz sigorta teklifini hazırlamak ve sunmak</li>
            <li>Sözleşme öncesi ve sonrası iletişimi yürütmek</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi (Sigortacılık Kanunu, SEDDK, MASAK)</li>
            <li>Çağrı kayıtları ile hizmet kalitesinin denetlenmesi</li>
            <li>Açık rızanız varsa pazarlama ve yenileme iletişimi</li>
          </ul>

          <h2>4. Hukuki Sebepler</h2>
          <ul>
            <li>Sözleşmenin kurulması ve ifası (KVKK m. 5/2-c)</li>
            <li>Veri sorumlusunun hukuki yükümlülüğü (KVKK m. 5/2-ç)</li>
            <li>Meşru menfaat (KVKK m. 5/2-f)</li>
            <li>Pazarlama iletişimi için ayrıca açık rızanız (KVKK m. 5/1)</li>
          </ul>

          <h2>5. Aktarım</h2>
          <p>
            Verileriniz, teklif hazırlanması amacıyla Allianz ile, yasal
            yükümlülükler nedeniyle yetkili kamu kurum ve kuruluşlarına ve hizmet aldığımız teknoloji
            sağlayıcılarına (e-posta, CRM, analitik) güvenli biçimde aktarılabilir. Yurtdışına
            aktarım yalnızca açık rızanızla veya KVKK m. 9 kapsamındaki istisnalarla yapılır.
          </p>

          <h2>6. Veri Saklama Süresi</h2>
          <p>
            Kişisel verileriniz, ilgili amaca uygun süre boyunca işlenir; mevzuat gereği saklama
            sürelerinin dolması veya talebiniz halinde imha edilir.
          </p>

          <h2>7. Haklarınız (KVKK m. 11)</h2>
          <ul>
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Eksik / yanlış işlenmişse düzeltilmesini isteme</li>
            <li>Silinmesini veya yok edilmesini isteme</li>
            <li>İşlemeye itiraz etme ve zarar halinde tazminat talep etme</li>
          </ul>
          <p>
            Taleplerinizi <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a>{' '}
            adresine yazılı olarak iletebilirsiniz.
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
