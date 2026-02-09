# Deployment Rehberi

Bu doküman, Efe Sürücü Kursu web sitesini Vercel'e nasıl deploy edeceğinizi açıklar.

## Vercel'e Deployment (Önerilen - %100 Ücretsiz)

### Adım 1: GitHub Repository Oluşturun

1. [GitHub](https://github.com) adresinde yeni bir repository oluşturun
2. Repository'yi public veya private olarak ayarlayın
3. Local projenizi GitHub'a push edin:

```bash
git remote add origin https://github.com/username/efe-surucu-kursu.git
git branch -M main
git push -u origin main
```

### Adım 2: Vercel Hesabı Oluşturun

1. [Vercel](https://vercel.com) adresine gidin
2. "Sign Up" butonuna tıklayın
3. GitHub hesabınızla giriş yapın

### Adım 3: Projeyi Import Edin

1. Vercel dashboard'unda "Add New Project" butonuna tıklayın
2. GitHub repository'lerinizi görüntüleyin
3. "efe-surucu-kursu" repository'sini bulun ve "Import" butonuna tıklayın

### Adım 4: Proje Ayarlarını Yapın

**Framework Preset**: Next.js (otomatik algılanır)

**Root Directory**: `.` (default)

**Build Command**: `npm run build` (default)

**Output Directory**: `.next` (default)

**Install Command**: `npm install` (default)

### Adım 5: Environment Variables Ekleyin

"Environment Variables" bölümünde aşağıdaki değişkenleri ekleyin:

#### RESEND_API_KEY (Zorunlu)

1. [Resend](https://resend.com) adresine gidin ve hesap oluşturun
2. API Keys sayfasından yeni bir key oluşturun
3. Key'i kopyalayıp Vercel'e yapıştırın

```
Key: RESEND_API_KEY
Value: re_xxxxxxxxxxxxxxxxxxxxxxxx
```

#### CONTACT_EMAIL (Opsiyonel)

İletişim formu mesajlarının gönderileceği email adresi:

```
Key: CONTACT_EMAIL
Value: info@efesurucukursu.com
```

### Adım 6: Deploy Edin

1. "Deploy" butonuna tıklayın
2. Build işlemini bekleyin (2-3 dakika)
3. Deploy tamamlandığında verilen URL'i kullanarak siteyi görüntüleyin

## Custom Domain Ekleme

### Adım 1: Domain Satın Alın

Domain sağlayıcılar:
- [Namecheap](https://namecheap.com)
- [GoDaddy](https://godaddy.com)
- [Porkbun](https://porkbun.com)
- Türkiye: [Natro](https://www.natro.com), [Turhost](https://www.turhost.com)

Örnek: `efesurucukursu.com` (~50-100 TL/yıl)

### Adım 2: Domain'i Vercel'e Ekleyin

1. Vercel project settings > Domains
2. "Add Domain" butonuna tıklayın
3. Domain adınızı girin (örn: `efesurucukursu.com`)
4. "Add" butonuna tıklayın

### Adım 3: DNS Ayarlarını Yapın

Vercel size DNS kayıtlarını gösterecek. Domain sağlayıcınızın DNS ayarlarına gidin ve aşağıdaki kayıtları ekleyin:

#### A Record
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 60 seconds
```

#### CNAME Record (www)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 60 seconds
```

### Adım 4: SSL Sertifikası

Vercel otomatik olarak Let's Encrypt SSL sertifikası oluşturur (ücretsiz).
Bu işlem 24-48 saat sürebilir.

## Otomatik Deployment

Vercel otomatik olarak:
- Her `git push` ile production'a deploy eder
- Her PR için preview deployment oluşturur
- Build hatalarını email ile bildirir

## Build Süresi ve Limitler

### Vercel Hobby Plan (Ücretsiz)

- **Build Time**: Sınırsız build
- **Bandwidth**: 100 GB/ay
- **Deployments**: Sınırsız
- **Team Members**: 1
- **Analytics**: Basic

Bu limitler bir sürücü kursu sitesi için fazlasıyla yeterlidir.

## Environment Variables Güncellemesi

1. Vercel Dashboard > Project > Settings > Environment Variables
2. Değişkeni bulun ve "Edit" butonuna tıklayın
3. Yeni değeri girin ve kaydedin
4. Redeploy edin (Settings > Deployments > ... > Redeploy)

## Rollback

Bir önceki versiyona dönmek için:

1. Vercel Dashboard > Deployments
2. Önceki başarılı deployment'ı bulun
3. "..." > "Promote to Production" butonuna tıklayın

## Monitoring

### Vercel Analytics

Vercel otomatik olarak temel analytics sağlar:
- Page views
- Unique visitors
- Top pages
- Traffic sources

### Google Analytics Ekleme (Opsiyonel)

1. [Google Analytics](https://analytics.google.com) hesabı oluşturun
2. Tracking ID'yi alın (G-XXXXXXXXXX)
3. `app/layout.tsx` dosyasına Google Analytics script'ini ekleyin

## Troubleshooting

### Build Hatası

```bash
# Locally test build
npm run build

# Check logs
vercel logs <deployment-url>
```

### Environment Variables Çalışmıyor

- Production, Preview, Development ortamları için ayrı ayrı set edilmiş mi kontrol edin
- Vercel'de değişken güncellediyseniz redeploy edin

### Domain Çalışmıyor

- DNS propagation 24-48 saat sürebilir
- DNS kayıtlarını kontrol edin: [WhatsMyDNS](https://whatsmydns.net)
- Vercel'de domain status'ü kontrol edin

## Maliyetler

### Tamamen Ücretsiz (Hobby Plan)

✅ **Hosting**: 0 TL (Vercel)  
✅ **SSL**: 0 TL (Let's Encrypt)  
✅ **Email**: 0 TL (Resend 3000/ay)  
✅ **Database**: 0 TL (dosya tabanlı!)  
✅ **CDN**: 0 TL (Vercel Edge Network)  
✅ **Analytics**: 0 TL (Vercel Analytics)  

💰 **Domain**: ~50-100 TL/yıl (isteğe bağlı)

**Toplam Yıllık Maliyet**: 50-100 TL (sadece domain)

## Support

Sorun yaşarsanız:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Not**: Bu deployment rehberi Vercel Hobby plan için hazırlanmıştır. Daha fazla özelliğe ihtiyacınız olursa Pro plana ($20/ay) geçebilirsiniz.
