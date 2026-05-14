import type { Metadata } from 'next';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getSiteSettings } from '@/lib/content';

export const metadata: Metadata = {
  title: 'KVKK Açık Rıza Metni',
  description: 'Mavi Sigorta Allianz Aracılık Hizmetleri pazarlama amaçlı iletişim için açık rıza metni.',
  alternates: { canonical: '/kvkk-acik-riza' },
};

export default function ExplicitConsentPage() {
  const settings = getSiteSettings();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation siteName={settings.siteName} />
      <div className="h-20" />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Breadcrumbs items={[{ label: 'Açık Rıza Metni' }]} />
        <article className="prose dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white max-w-none mt-6">
          <h1>Açık Rıza Metni (Pazarlama İletişimi)</h1>
          <p>
            Pazarlama amaçlı iletişim onayı, KVKK ve Ticari İletişim Yönetmeliği uyarınca <strong>opsiyoneldir</strong> ve
            ana hizmet talebinizin işlenmesi için zorunlu değildir.
          </p>

          <h2>1. Onay Verirseniz Ne Yapılır?</h2>
          <ul>
            <li>Poliçe yenileme döneminde hatırlatma bildirimi</li>
            <li>Anlaşmalı şirket kampanyaları (avantajlı fiyat, ek teminat)</li>
            <li>Sigorta sektöründeki yasal değişikliklerle ilgili bilgilendirme</li>
            <li>Mavi Sigorta'nın yeni ürün ve hizmetleri</li>
          </ul>

          <h2>2. Kullanılacak Kanallar</h2>
          <p>SMS, e-posta, sesli arama ve WhatsApp; tercihinizi her zaman değiştirebilirsiniz.</p>

          <h2>3. Onayın Geri Alınması</h2>
          <p>
            <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a> adresine
            "iletişim onayını kaldır" yazarak veya gönderilen SMS / e-posta içindeki "abonelikten
            çık" bağlantısına tıklayarak onayınızı geri alabilirsiniz.
          </p>

          <h2>4. Battaniye Rıza Yasağı</h2>
          <p>
            KVKK 2024 güncellemesi uyarınca açık rıza, belirli bir konuya yönelik, bilgilendirmeye
            dayalı ve özgür iradeyle açıklanmış olmalıdır. Bu sebeple aydınlatma onayı ile pazarlama
            onayını sizden ayrı ayrı almakla yükümlüyüz.
          </p>

          <p>
            Sorularınız için: <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a>
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
