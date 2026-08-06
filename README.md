# Universe Lands

Metaverse arsa borsası konsept sitesi. Next.js 15 (App Router) + React 19 + TypeScript.
Backend yok — tüm içerik `src/data/` altındaki statik veriden geliyor.

## Gereksinimler

- Node.js 20 veya üzeri (`node -v` ile kontrol et)
- npm

## Kurulum (sadece ilk seferde)

```bash
cd "/home/mustafa/Downloads/Universe Lands Metaverse/universe-lands"
npm install
```

`npm install` bittiğinde dünya haritası verisi (`world-atlas/land-110m.json`) otomatik olarak
`public/` klasörüne kopyalanır — globe'un kıta çizgileri buradan geliyor.

## Geliştirme sunucusu

```bash
npm run dev
```

Site: **http://localhost:3000** — dosyaları kaydettiğinde sayfa kendini yeniler.
Durdurmak için terminalde `Ctrl + C`.

Sunucu `0.0.0.0` üzerinde dinliyor, yani aynı ağdaki başka cihazlardan da
`http://<bilgisayarının-ip-adresi>:3000` ile açılabilir.

## Müşteriye link göndermek (Cloudflare Tunnel)

İki terminal gerekir:

```bash
# 1. terminal
npm run dev

# 2. terminal
npm run tunnel
```

`cloudflared` ekrana `https://xxxx-xxxx.trycloudflare.com` gibi bir adres yazar; o linki
paylaşabilirsin. `*.trycloudflare.com` adresleri `next.config.mjs` içindeki
`allowedDevOrigins` listesinde tanımlı olduğu için ek ayar gerekmez.

Kendi alan adını kullanacaksan:

```bash
TUNNEL_HOST=demo.alanadin.com npm run dev
```

## Prodüksiyon derlemesi

```bash
npm run build
npm start          # http://localhost:3000
```

> **Önemli:** `npm run build` ile `npm run dev` aynı `.next` klasörünü kullanır.
> Dev sunucusu açıkken build alma — önce `Ctrl + C` ile durdur. Yanlışlıkla yaptıysan
> `rm -rf .next` çalıştırıp tekrar başlat.

## Sayfalar

| Rota | Sayfa |
|---|---|
| `/` | 3D globe hero, canlı ticker, öne çıkan parseller |
| `/listings` | Tüm parseller — şehir filtresi ve sıralama |
| `/cities` | 8 şehir kartı |
| `/cities/[id]` | Bölge detayı (istanbul, paris, tokyo, newyork, london, dubai, singapore, sydney) |
| `/how-it-works` | Protokol adımları ve SSS |
| `/market` | Piyasa istatistikleri ve top movers |

## Klasör yapısı

```
src/
  app/               rotalar (her klasör = bir sayfa) + globals.css
  components/        React bileşenleri
  data/
    cities.ts        şehirler ve parseller
    site.ts          istatistik, ticker, adımlar, SSS
  lib/globe-engine.js  three.js globe motoru
public/
  land-110m.json     kıta çizgileri (npm install ile gelir)
```

## İçerik nasıl değiştirilir

- Şehir / parsel / fiyat → `src/data/cities.ts`
- İstatistikler, ticker satırları, adımlar, SSS → `src/data/site.ts`
- Renkler, tipografi, boşluklar → `src/app/globals.css` (en üstteki `:root` değişkenleri)
- Globe dönüş hızı, otomatik dönme, ticker'ı gizleme → `src/data/site.ts` içindeki `siteConfig`

## Sorun giderme

**Port 3000 dolu:**
```bash
npm run dev -- -p 3001
```

**Sayfa stilsiz açılıyor / "Cannot find module ./vendor-chunks" hatası:**
```bash
rm -rf .next && npm run dev
```

**Globe görünmüyor:** Tarayıcıda WebGL kapalıysa yerine statik bir küre görseli gelir;
konsolda `WebGL unavailable` uyarısını görürsün. Chrome'da `chrome://gpu` adresinden kontrol et.
