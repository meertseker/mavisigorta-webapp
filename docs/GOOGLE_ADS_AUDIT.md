# Google Ads Kampanya Audit'i — 2026 Revizyonu

Mavi Sigorta'nın Google Ads template'leri ([lib/google-ads/templates.ts](../lib/google-ads/templates.ts)) baştan aşağıya elden geçirildi. Bu doküman:

1. Neden değiştirildi.
2. Tam olarak ne değişti.
3. Operatörün Google Ads UI'da elle yapması gereken adımlar.

## 1. Eski sistemin sorunları

### Metin (RSA başlık + açıklama) tarafı

| Sorun | Örnek | Etkisi |
|---|---|---|
| Aynı başlık her üründe tekrar | "Soner Bey 30dk'da Arar" 8 farklı kampanyada | Ad Strength düşer, RSA combination çeşitliliği kaybolur |
| AI-tell klişeler | "Hızlı Poliçe Düzenleme", "8 Şirketten Karşılaştırma" | CTR düşer, reklam diğer rakiplerle ayrışmaz |
| Negative parallelism | "SSK Fark Ödemeyin" + "Özel Hastane Fark Yok" | Aynı şeyi iki kez söylüyor, slot israfı |
| Tempo tutarsızlığı | "60 saniyede" / "30 dakika" / "anında" karışık | Müşteri tek vaat ister |
| Em-dash ve rule-of-three overkill | "Yangın, su baskını, hırsızlık ve doğal afet teminatları" | Açıklamalar AI gibi okunuyor |
| Third-person formal ton | "Soner Bey size en uygun teklifi sunar" | Landing page "biz" diyor, reklam "o" diyor; tutarsız |

### Strateji tarafı

| Sorun | Eski hali | Neden problem |
|---|---|---|
| Negative kw listesi | 10 generic kelime, **her ad group'a kopyalanıyor** | Campaign-level olması lazım; "iptal" + "şikayet" mevcut müşteri yenilemesini engelleyebilir |
| Match type | %95 PHRASE | Smart Bidding BROAD karışımıyla daha iyi çalışır |
| Bidding | Hepsi `TARGET_CPA` (yeni hesapta) | Google "yetersiz dönüşüm" diye trafiği boğar; ilk 30 gün `MAXIMIZE_CONVERSIONS` olmalı |
| Ad group yapısı | Ürün başına 1-2 grup | Intent isolation yok; "fiyat" arayan ile "yenileme" arayan aynı sayfaya gidiyor |
| Sitelinks | Hakkımızda / SSS / İletişim | Soft, dönüşüm odaklı değil |
| Schedule | Pazar bid 0.7 | Sigorta = impulse sektörü; weekend kesintisi CTR'yi düşürür |
| Geo | Tüm Türkiye (`2792`) | Copy "Beylikdüzü" diyor, hedefleme ülke; yerel araması nadir |
| Trademark riski | "Allianz TSS Acentesi" | Yetki olmazsa Google policy ihlali |

## 2. Yapılan değişiklikler

### 2.1 Yeni ses tonu: "5 dakikada poliçeniz"

- Tek tempo vaadi: **5 dakika** (60 sn form + 30 dk dönüş = ~5 dk).
- Eylem fiili önde: "Plakanı yaz", "Adresi gir", "Tek tıkla".
- Birinci çoğul / ikinci tekil: "30 dakikada size dönüyoruz", "Hemen WhatsApp'tan yaz".
- Mevzuat dili minimum: "KVKK Uyumlu" yerine "Numaranı paylaşmıyoruz".
- Brand başlığı her üründe sadece 1-2 kez geçer; geri kalan slot'lar ürünün spesifik faydasına ayrılır.

#### TSS Yüksek Niyet için humanize zinciri

**Eski set (özet, tekrar problemi)**

```
TSS Teklif - 60 Saniyede / 60 Saniyede Online Teklif (aynı vaat iki kez)
Soner Bey 30dk'da Arar (8 üründe aynı)
Mavi Sigorta - 25 Yıl + 25 Yıllık Deneyim (iki kez)
SSK Fark Ödemeyin + Özel Hastane Fark Yok (negative parallelism)
Ücretsiz TSS Teklifi (AI-tell)
KVKK Uyumlu - Güvenli (mevzuat dili)
Hızlı Poliçe Düzenleme (klişe)
```

**Draft humanize**

```
TSS Teklifin 5 Dakikada
Özel Hastanede Fark Sıfır
SGK + TSS = Tam Kapsam
Hangi Hastane Anlaşmalı?
8 Şirket Yan Yana Fiyat
Allianz TSS Yetkili Acente
Annene Bile Önerirsin             ← duygusal, slogan-y
Beylikdüzü'nden Tek Tık
Hemen Dönüyoruz, Sabit Hat
TSS'i Telefonsuz Karşılaştır
Numaranı Paylaşmıyoruz
SGK'lıysan TSS Avantajlı
3 Sorudan Sonra Fiyat             ← form 2 adım, yanlış sayı
İlk Yıl Cebine Kalır
Hastaneye Direkt, Kart Yok        ← "kart" kafa karıştırır
```

**"Bu hâlâ AI yazmış gibi gösteren ne?" pass'i**

- "Annene Bile Önerirsin" pazarlama afişi gibi duruyor.
- "Kart Yok" kredi kartı çağrışımı yapıyor.
- "3 Sorudan Sonra Fiyat" form gerçeği 2 adım — yalan olur.

**Final (audit sonrası)**

```
TSS Teklifin 5 Dakikada
Özel Hastanede Fark Sıfır
SGK Üstüne TSS Tam Kapsam
Hangi Hastane Anlaşmalı?
8 Şirket Yan Yana Fiyat
Allianz TSS Yetkili Aracı
Beylikdüzü'nden Tek Tıkla
30 Dakikada Geri Dönüyoruz
TSS'i Telefonsuz Karşılaştır
Numaranı Paylaşmıyoruz
SGK'lıysan TSS Avantajlı
Bir Formla Fiyatın Önünde
Faturayı Hastane Çeker
Mavi Sigorta 25 Yıl Beylikdüzü
TSS Yenilemen de Bizden
```

Aynı before → draft → audit → final yöntemi diğer 7 ürüne de uygulandı.

### 2.2 Negatif kelimeler artık campaign-level

`Campaign` interface'ine yeni alan eklendi:

```ts
negativeKeywords?: KeywordItem[];
```

Bu alan REST seam'de (`lib/google-ads/client.ts`) `campaignCriterion` olarak `negative: true` ile gönderiliyor. Her ad group'a `...GENERIC_NEGATIVES` yapıştırmak yerine kampanya seviyesinde tek liste.

**Yeni `SHARED_NEGATIVES` listesi** (24 kelime):

| Kaldırılan | Neden |
|---|---|
| `iptal` | "dask iptal koşulları" arayan müşteri yeni poliçe alabilir |
| `şikayet` | Şikayet araması rakip karşılaştırması içerebilir |
| `ücretsiz` | "ücretsiz danışmanlık" değerli bir lead |

| Eklenen | Neden |
|---|---|
| `nedir`, `nasıl çalışır`, `vikipedi`, `wikipedia` | Bilgi araması, satın alma niyeti yok |
| `video`, `pdf`, `blog` | Eğitim / bilgi içeriği arayan |
| `örnek poliçe`, `şartname`, `genel şartlar` | Karar süreci öncesi araştırma |
| `kariyer`, `maaş` | İş arayan trafiği |
| `koalay`, `sigortam.net`, `hesapkurdu`, `sigortayeri`, `sigortadukkanim` | Aggregator rakip markaları |

### 2.3 Bidding stratejisi rotasyonu

Hepsi `MAXIMIZE_CONVERSIONS` ile başlıyor. Her `CampaignTemplate.defaultTargetCpaTry` korundu — UI'da görünüyor ama otomatik uygulanmıyor.

Operatör 30+ dönüşüm topladıktan sonra Google Ads UI'sında veya admin panelinden bidding'i `TARGET_CPA`'ya geçirip aşağıdaki değerleri kullanabilir:

| Ürün | Önerilen CPA |
|---|---|
| Tamamlayıcı Sağlık | 220 ₺ |
| Modüler Sağlık | 300 ₺ |
| Kasko | 80 ₺ |
| Trafik | 50 ₺ |
| Konut | 90 ₺ |
| İşyeri | 180 ₺ |
| DASK | 35 ₺ |
| Seyahat Sağlık | 60 ₺ |

### 2.4 Ad group bölümlendirmesi

Daha önce tek `Genel` grubu olan ürünlere ikinci grup eklendi (intent isolation):

| Ürün | Grup 1 | Grup 2 |
|---|---|---|
| TSS | Genel Niyet | Lokasyon (Beylikdüzü+çevre) ← zaten vardı |
| Modüler Sağlık | Genel | **İstanbul** (yeni) |
| Kasko | Genel Niyet | **Lokasyon (İstanbul+çevre)** (yeni) |
| Seyahat | Schengen | **Ülke Bazlı (Almanya/İtalya/Fransa vb.)** (yeni) |
| Trafik / Konut / İşyeri / DASK | Genel (tek grup, hacim yeterli değil) | — |

### 2.5 Match type karışımı

Her ad group artık şu yapıda:

- 1-2 **BROAD** anchor (ana kavram, Smart Bidding genişlemesi için)
- 1-2 **EXACT** yüksek-niyet (marka veya spesifik teklif aramaları)
- Geri kalan **PHRASE** (long-tail)

Örnek: Kasko - Genel Niyet:
- BROAD: `kasko teklif`, `kasko fiyat`
- EXACT: `plaka ile kasko teklifi`, `online kasko teklifi`
- PHRASE: `kasko sigorta`, `kasko hesaplama`, vb.

### 2.6 Schedule

| Zaman dilimi | Eski | Yeni |
|---|---|---|
| Pzt-Cum 8-12 | 1.1 | 1.1 |
| Pzt-Cum 12-18 | 1.0 | 1.0 |
| Pzt-Cum 18-22 | 0.9 | **1.0** |
| Cmt 9-18 | 1.0 | 1.0 (9-20'ye genişledi) |
| Pzr 10-18 | 0.7 | **0.9** (10-20'ye genişledi) |

Gerekçe: Sigorta = impulse sektörü. Akşam ve weekend "trafik sigortam doluyor" / "DASK süresi doldu" araması yüksek.

### 2.7 Sitelink yeniden yazımı

Eski: Hakkımızda / SSS / İletişim / Ürün Detayı (4 farklı bilgi sayfası).

Yeni (4 sitelink, 4 farklı dönüşüm kanalı):

1. **Ürüne özel action** (örn. Kasko için "Plakayla Hızlı Teklif" → `/teklif/kasko`)
2. **WhatsApp** ("WhatsApp'tan Yaz") → `wa.me/{number}?text=prefill`
3. **Ürün detay sayfası** (örn. "Kasko Detay") → `/sigortalar/{slug}`
4. **Sıkça Sorulanlar** → `/sss`

### 2.8 Callout revizyonu

Eski 8 callout'tan 4-5'i tekrarlıydı ("25 Yıllık Sigorta Deneyimi" + "Beylikdüzü Yerel Acente" + benzer). Yeni 8 callout her biri farklı bir vaat:

```
5 Dakikada Online Teklif
Allianz Aracılık Hizmeti
8 Şirket Yan Yana Fiyat
WhatsApp Hattı, Hemen Yaz
Numaranı Paylaşmıyoruz
Beylikdüzü, 25 Yıl Yerinde
Hasarda Bizzat Yanında
Anlaşmalı 200+ Hastane
```

### 2.9 PreflightChecklist'e başlık çeşitliliği check'i

Yeni kontrol: case-insensitive ve boşluk-normalize edilmiş başlıkların **en az 12 tanesi farklı** olmalı. Daha az olursa warning, 8'in altında error.

## 3. Operatör için elle yapılacak adımlar

### 3.1 Conversion tracking doğrulaması

Yeni `MAXIMIZE_CONVERSIONS` stratejisi **conversion tracking olmadan trafiği yakar**. Google Ads UI:

1. Tools → Conversions → en az 1 aktif primary conversion olmalı.
2. Önerilen conversions:
   - `Teklif Form Tamamlama` (lead) — `/teklif/{urun}/tesekkurler` sayfası
   - `WhatsApp Tıklama` (engagement, secondary)
   - `Telefon Tıklama` (engagement, secondary)
3. GA4 → Google Ads import: GA4'te `form_submit` event'i Conversions'a alındıysa import edilebilir.

**Kritik:** Eğer conversion tracking yoksa, bidding'i ilk hafta `MANUAL_CPC` olarak yaz; learning veriyi topladıktan sonra `MAXIMIZE_CONVERSIONS`'a geç.

### 3.2 Geo target constant ID'lerinin doğrulaması

Mevcut template'ler `geoTargetConstant: '2792'` (Türkiye) kullanıyor. Yerel kampanyalar (Kasko / Trafik / Konut / İşyeri / DASK) için Marmara hedeflemesi CPC'yi düşürür. Operatör Google Ads UI → Locations'tan şu ID'leri doğrulayıp `Campaign.geoTargets` array'ine ekleyebilir:

- **İstanbul:** `geoTargetConstants/1009872` (city-level)
- **Tekirdağ:** `geoTargetConstants/1009859`
- **Kocaeli:** `geoTargetConstants/1009870`

> **Uyarı:** Yukarıdaki ID'ler değişken; Google Ads UI → Settings → Locations → "Add another location" arayüzünde **şehir adını yaz, kopyala** yöntemi tercih edilmeli. ID'leri ezbere kullanma.

Ürün önerileri:

| Ürün | Hedefleme |
|---|---|
| Kasko, Trafik, Konut, İşyeri, DASK | İstanbul + Marmara |
| TSS, Modüler Sağlık | Türkiye (anlaşmalı hastane ülke genelinde geçerli) |
| Seyahat Sağlık (Schengen) | Türkiye (vize başvurusu ülke geneli) |

### 3.3 Allianz acente yetkisi

Template'lerde "Allianz Yetkili Aracı / Allianz Aracılığı" başlıkları var. Mavi Sigorta'nın resmi şirket adı `Mavi Sigorta Allianz Aracılık Hizmetleri` ([lib/content.ts](../lib/content.ts) → `companyInfo.fullName`), dolayısıyla bu mention legal. Ancak Google Ads bazı durumlarda trademark policy uygular:

- Eğer Allianz'tan **trademark complaint** gelirse, başlıkları "Türkiye'nin En Büyük 8 Şirketi" gibi marka-bağımsız bir alternatifle değiştir.
- Şu an için herhangi bir uyarı yoksa mevcut başlıklar bırakılabilir.

### 3.4 Conversion-focused sitelink URL'leri

Yeni `buildSharedSitelinks` WhatsApp prefill mesajı ile gönderiyor:

```
https://wa.me/905324807617?text=Merhaba%2C%20...
```

WA number `NEXT_PUBLIC_WA_NUMBER` env'inden geliyor. Production'da bu env doğru numarayı içerdiğinden emin ol.

### 3.5 İlk 30 günlük öğrenme dönemi

Yeni bidding stratejisi `MAXIMIZE_CONVERSIONS` ile başladığı için Google'ın learning phase'i geçmesi gerekiyor:

1. İlk 14 gün: bütçeyi günlük olarak yarıdan artır/azalt **yapma**.
2. 14-30 gün arası: CPA'yı izle, conversion <30 ise sabırlı ol.
3. 30+ conversion topladıktan sonra:
   - CPA istenen seviyenin altındaysa → bid'i TARGET_CPA'ya geçirme (Google daha iyi ölçeklenir).
   - CPA istenen seviyenin üstündeyse → bütçeyi düşür ya da match type'ları daha PHRASE/EXACT'a kaydır.

### 3.6 Form gerçeği

Site form'u 2 adımlı (60sn vaadi). Reklam başlıklarında "5 dakikada poliçe" ifadesi var; bu form (60sn) + geri dönüş (30dk) toplamına atıf yapıyor. Form gerçekten 2 adımda kalıyorsa bu vaad doğru. Form yapısı değişirse reklam başlıkları da güncellenmeli.

## 4. Risk değerlendirmesi

| Risk | İhtimal | Etki | Azaltma |
|---|---|---|---|
| Conversion tracking yoksa Google trafiği daraltır | Orta | Yüksek (boş bütçe) | İlk hafta MANUAL_CPC, conversion track aktif olunca MAX_CONVERSIONS |
| Allianz trademark complaint | Düşük | Orta (başlık reddedilir) | Hazır marka-bağımsız alternatifler |
| Aggregator rakip negative'leri kendi brand kampanyamızda yanlış filtreler | Düşük | Düşük | Brand campaign açılırsa bu negative'leri o kampanyadan çıkar |
| Yeni başlıklar düşük CTR getirir | Orta | Orta | İlk 14 gün izle, Ad Strength "Good"+ tutulsun, gerekirse iterate |

## 5. İzlenecek metrikler

- **CTR**: Hedef Search Network'te %4+ (kategoriye göre)
- **CPA**: Yukarıdaki tablo
- **Ad Strength**: Tüm RSA'ların "Good" veya "Excellent" olması
- **Quality Score**: Anahtar başına 7+
- **Impression Share**: %50+ (bütçenin yetersizliği değil, niyet eşleşmesi göstergesi)
- **Lost IS (rank)**: %20'nin altında — yüksekse landing page veya bid problemi

Düşük performans 14 gün üst üste yaşanırsa, bu audit'i tekrar açıp ad group bazında daha agresif iterate et.
