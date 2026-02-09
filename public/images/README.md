# 🖼️ Görsel Dosyaları Kılavuzu

Bu klasöre aşağıdaki görselleri ekleyin. Next.js Image optimization sayesinde görseller otomatik olarak WebP/AVIF formatına dönüştürülecektir.

---

## 📁 Klasör Yapısı

### Ana Sayfa
- `hero-car.jpg` - Modern eğitim aracı (1920x1080px, landscape)
- `hero-road-bg.jpg` - Arka plan için yol dokusu (1920x1080px)

### Kurslar (`courses/`)
- `standart.jpg` - Standart paket görseli (800x600px)
- `yogun.jpg` - Yoğun paket görseli (800x600px)
- `otomatik.jpg` - Otomatik vites görseli (800x600px)
- `ek-ders.jpg` - Ek ders görseli (800x600px)

### Eğitmenler (`instructors/`)
- `ahmet.jpg` - Ahmet Yılmaz profil (400x400px, square)
- `mehmet.jpg` - Mehmet Demir profil (400x400px, square)
- `ayse.jpg` - Ayşe Kaya profil (400x400px, square)
- `mustafa.jpg` - Mustafa Öztürk profil (400x400px, square)

### Blog (`blog/`)
- `sinav-hazirligi.jpg` - Blog başlık görseli (1200x675px, 16:9)
- `istanbul-trafik.jpg` - Blog başlık görseli (1200x675px, 16:9)
- `otomatik-manuel.jpg` - Blog başlık görseli (1200x675px, 16:9)

### Testimonials (`testimonials/`)
- `placeholder-1.jpg` - Müşteri fotoğrafı (200x200px, square)
- `placeholder-2.jpg` - Müşteri fotoğrafı (200x200px, square)
- `placeholder-3.jpg` - Müşteri fotoğrafı (200x200px, square)
- `placeholder-4.jpg` - Müşteri fotoğrafı (200x200px, square)
- `placeholder-5.jpg` - Müşteri fotoğrafı (200x200px, square)
- `placeholder-6.jpg` - Müşteri fotoğrafı (200x200px, square)

### Genel
- `logo.png` - Kurumsal logo (512x512px, transparent background)
- `logo-white.png` - Beyaz logo versiyonu (512x512px)
- `trust-badges/meb-logo.png` - MEB onay logosu (200x200px)
- `trust-badges/guvenli-egitim.png` - Güvenli eğitim badge (200x200px)
- `facility-1.jpg` - Tesis fotoğrafı (1200x800px)
- `facility-2.jpg` - Sınıf/eğitim alanı (1200x800px)
- `students-success.jpg` - Başarılı öğrenciler (1200x800px)

---

## 🎨 Next/Image Kullanım Örnekleri

### Hero Image (Priority):
```tsx
import Image from 'next/image';

<Image
  src="/images/hero-car.jpg"
  alt="Efe Sürücü Kursu - Modern eğitim araçları ile profesyonel direksiyon dersleri"
  width={1920}
  height={1080}
  priority
  className="w-full h-auto"
/>
```

### Course Cards:
```tsx
<Image
  src="/images/courses/standart.jpg"
  alt="B Sınıfı Standart Ehliyet Paketi - 16 saat pratik eğitim"
  width={800}
  height={600}
  className="rounded-lg"
/>
```

### Instructor Profiles:
```tsx
<Image
  src="/images/instructors/ahmet.jpg"
  alt="Ahmet Yılmaz - 15 yıl deneyimli MEB onaylı sürücü eğitmeni"
  width={400}
  height={400}
  className="rounded-full"
/>
```

---

## ✨ SEO İçin Alt Text Önerileri

### İyi Alt Text ✅
- "Efe Sürücü Kursu - 2024 model otomatik vitesli eğitim aracı"
- "Büyükçekmece sürücü kursu modern eğitim tesisi iç görünüm"
- "Başarılı öğrenci Mehmet Yılmaz ehliyet belgesi ile"

### Kötü Alt Text ❌
- "araba"
- "img1"
- "photo"

---

## 🎯 Görsel Boyut Kılavuzu

| Kullanım Alanı | Önerilen Boyut | Oran |
|----------------|----------------|------|
| Hero Images | 1920x1080px | 16:9 |
| Course Cards | 800x600px | 4:3 |
| Blog Headers | 1200x675px | 16:9 |
| Instructor Profiles | 400x400px | 1:1 |
| Logos | 512x512px | 1:1 |
| Testimonial Photos | 200x200px | 1:1 |

---

## 📚 Önerilen Görsel Kaynakları

### Ücretsiz Stok Fotoğraflar:
- **[Unsplash](https://unsplash.com)** - Pro kalite, ücretsiz
  - Anahtar kelimeler: "driving school", "car education", "modern car"
- **[Pexels](https://pexels.com)** - Yüksek çözünürlük
- **[Pixabay](https://pixabay.com)** - Tamamen lisanssız

### Türkçe İçin:
- Kendi çekimlerinizi kullanın (öğrenci izni alarak)
- Yerel fotoğrafçılarla çalışın
- Shutterstock Türkiye (ücretli)

### Arama Önerileri (İngilizce):
- "driving instructor teaching student"
- "modern car interior dashboard"
- "happy student with driving license"
- "professional driving school building"
- "road safety education"
- "car driving lessons"

---

## 🔧 Görsel Optimizasyonu

### Ekleme Öncesi Kontrol Listesi:
- [ ] Format: JPEG (fotoğraflar) veya PNG (logolar, transparans gerekiyorsa)
- [ ] Maksimum dosya boyutu: 500KB
- [ ] Çözünürlük: Yukarıdaki tabloya uygun
- [ ] Kalite: %80-85 JPEG kalitesi yeterli
- [ ] İsim: Açıklayıcı, tire ile ayrılmış (ornek-gorsel-adi.jpg)

### Optimizasyon Araçları:
- **[TinyPNG](https://tinypng.com)** - %70'e kadar boyut azaltma
- **[Squoosh](https://squoosh.app)** - WebP dönüşümü + karşılaştırma
- **[ImageOptim](https://imageoptim.com)** (Mac) - Toplu optimizasyon
- **[JPEG Optimizer](https://jpeg-optimizer.com)** - Online sıkıştırma

### Komut Satırı (Gelişmiş):
```bash
# ImageMagick ile boyutlandırma
convert input.jpg -resize 1920x1080 -quality 85 output.jpg

# cwebp ile WebP'ye dönüştürme
cwebp -q 85 input.jpg -o output.webp
```

---

## 🚀 Next.js Image Optimization

Next.js otomatik olarak:
- ✅ WebP ve AVIF formatlarına dönüştürür
- ✅ Responsive boyutlar oluşturur
- ✅ Lazy loading uygular
- ✅ Blur placeholder ekler
- ✅ Cache header'ları optimize eder

**Yapmanız gereken:** Sadece orijinal görselleri bu klasöre koymak!

---

## 📝 Placeholder'lar

Gerçek görseller eklenene kadar:
- Gradient background'lar kullanılıyor
- SVG placeholder icon'lar gösteriliyor
- Geliştirme aşaması için yeterli

**Production'a geçmeden önce mutlaka değiştirin!**

---

## ⚠️ Telif Hakları Uyarısı

- Kullandığınız görsellerin lisansını kontrol edin
- Öğrenci/eğitmen fotoğrafları için yazılı izin alın
- Stok fotoğraf lisanslarını saklayın
- Watermark olan görselleri kullanmayın

---

## 💡 İpuçları

1. **Tutarlılık:** Tüm görsellerde aynı renk tonlarını kullanın
2. **Marka Kimliği:** Kurumsal renklerinizi (mavi tonları) vurgulayın
3. **İnsan Odaklı:** Mutlu öğrenciler, profesyonel eğitmenler gösterin
4. **Kalite:** Bulanık, düşük çözünürlüklü görsel kullanmayın
5. **Yerellik:** İstanbul/Büyükçekmece vurgusu yapan görseller tercih edin

---

Sorularınız için: [İletişim](mailto:info@efesurucukursu.com)

