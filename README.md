# Mandiri Outbranch Command Center

Website statis (Dashboard, Field Operation System/FOS, Outbranch Delivery
System/ODS) — sekarang dipecah per file/folder (bukan satu file HTML raksasa
lagi) supaya lebih mudah dikelola di GitHub. Tidak perlu proses build — semua
library (Tailwind, Leaflet, Chart.js, QRCode, Lucide, PapaParse, SheetJS)
dimuat lewat CDN.

## Struktur folder

```
├── index.html                     ← shell halaman (sidebar, header, semua section)
├── css/
│   └── styles.css                 ← semua style
├── js/
│   ├── common.js                  ← navigasi, konstanta bersama, layanan GPS
│   ├── dashboard.js                ← menu Dashboard
│   ├── fos-field-radar.js          ← FOS: Field Radar
│   ├── fos-realtime.js             ← FOS: Realtime Location Monitoring
│   ├── fos-route.js                ← FOS: Smart Route Optimization
│   └── ods.js                      ← Outbranch Delivery System
├── data/
│   ├── field-radar-database.csv    ← "database" lokasi Field Radar (edit/timpa file ini)
│   └── README.md                   ← format kolom & cara pakai database Anda sendiri
└── assets/
    ├── logo_mandiri/               ← taruh logo-mandiri.png di sini
    ├── overlay/                    ← overlay_ktp.png, overlay_kk.png, overlay_akta.png, overlay_wajah.png
    └── icon_website/                ← favicon / ikon tab browser
```

Setiap menu FOS (Field Radar, Realtime Monitoring, Smart Route Optimization)
kini punya file JS sendiri-sendiri, begitu juga ODS — sesuai permintaan agar
file per menu terpisah.

## Deploy ke Vercel

**Cara tercepat (drag & drop):**
1. Buka https://vercel.com/new
2. Drag seluruh folder ini (yang berisi `index.html`, `css/`, `js/`, `data/`, `assets/`) ke area upload.
3. Vercel otomatis mendeteksinya sebagai static site. Klik **Deploy**.

**Via Vercel CLI:**
```bash
npm i -g vercel
cd folder-ini
vercel --prod
```

**Via GitHub:**
1. Push seluruh folder ini ke repo GitHub baru (pertahankan struktur folder di atas).
2. Di Vercel dashboard → "Add New Project" → pilih repo tersebut → Deploy
   (framework preset: *Other*, tidak perlu ubah setting apapun).

## Fitur

### Dashboard
KPI, tren keluhan, distribusi level merchant, daftar merchant (masih data
contoh/mock — sambungkan ke API/backend Anda, mis. sistem BDS, untuk data
real).

### Field Operation System

**Field Radar**
- Peta mengikuti lokasi GPS perangkat — tombol **"Ikuti Lokasi Saya"**
  menampilkan titik biru berdenyut pada posisi Anda dan peta otomatis
  mengikuti (memakai `navigator.geolocation.watchPosition`, butuh izin
  browser & koneksi HTTPS).
- Ikon lokasi kini membedakan **jenis** (warna isi: biru=UMKM,
  ungu=Balai RT/RW, oranye=Sekolah) sekaligus **status kunjungan** (warna
  cincin luar: merah=Belum, oranye=Proses, hijau=Sudah) — lihat legenda di
  atas peta.
- Form **"Tambah Lokasi Manual"** untuk menambah titik baru (nama, lat, lng,
  alamat, telepon, jenis, status) — bisa mengisi koordinat otomatis dari GPS.
  Tersimpan di perangkat (localStorage) dan langsung tergabung ke peta,
  Nearby Target, dan Smart Route.
- **Nearby Target** kini default radius **1 km** (slider 100 m – 2 km),
  otomatis memakai posisi GPS Anda sebagai pusat pencarian jika "Ikuti Lokasi
  Saya" aktif (jika tidak, memakai titik kantor).
- **Quick Blast** punya dua mode: *Area Terdekat* (dari daftar Nearby
  Target) dan *Semua Lokasi* — mode kedua menyediakan kotak pencarian
  sehingga tidak terbatas radius, bisa mencari & memilih lokasi mana pun di
  seluruh database untuk dikirimi pesan WhatsApp.

**Realtime Location Monitoring** — posisi tim outbranch di peta, mengikuti
ruas jalan nyata (simulasi via OSRM; sambungkan ke sumber GPS perangkat tim
Anda yang sebenarnya untuk data live sungguhan).

**Smart Route Optimization** — titik awal kini otomatis memakai **lokasi GPS
perangkat** (jika "Ikuti Lokasi Saya" pada Field Radar aktif), jika tidak
tersedia baru memakai titik kantor (Gedung Patrajasa) sebagai fallback.
Sistem tetap memakai nearest-neighbor + OSRM untuk memilih hingga 3 titik
tambahan dan menggambar rute mengikuti jalan sungguhan.

### Outbranch Delivery System (5 langkah)
1. **Pilih Produk** — Tabungan Pelajar / Livin Mandiri / Livin Merchant.
2. **Entry Data Nasabah** — semua kolom kini **wajib diisi** (validasi
   sebelum bisa lanjut). Upload KTP/KK/Akta bisa lewat **Upload File** atau
   **Ambil via Kamera** — saat memakai kamera, muncul overlay garis panduan
   (`overlay_ktp.png` / `overlay_kk.png` / `overlay_akta.png`) agar dokumen
   diposisikan pas.
3. **Verifikasi Wajah** — juga memakai overlay garis panduan
   (`overlay_wajah.png`, oval posisi wajah).
4. **Tanda Tangan Digital** — bantalan tanda tangan (mendukung sentuhan &
   mouse) setelah verifikasi wajah selesai.
5. **QR Login Nasabah** — QR yang di-scan akan mengarahkan ke aplikasi
   Livin (lihat catatan di bawah).

**Export ke Excel** — setiap pengajuan yang selesai (klik "Selesai" di step
5) otomatis tercatat di tabel **Riwayat Pengajuan ODS** (tersimpan di
`localStorage` per perangkat) dan bisa diexport sebagai file `.xlsx` lewat
tombol **Export ke Excel** (memakai SheetJS).

## Catatan penting

- **QR → buka aplikasi Livin**: QR yang dihasilkan mengarah ke
  `https://livin.bankmandiri.co.id/app/session/{sessionId}` (lihat konstanta
  `LIVIN_DEEPLINK_BASE` di `js/ods.js`). Agar scan benar-benar membuka
  aplikasi Livin secara langsung (bukan browser), domain tersebut perlu
  didaftarkan sebagai **Android App Links** / **iOS Universal Links** resmi
  di aplikasi Livin — ini perlu dikoordinasikan dengan tim aplikasi Livin,
  di luar cakupan file statis ini. Ganti `LIVIN_DEEPLINK_BASE` dengan
  skema/link resmi begitu tersedia.
- **Database Field Radar**: lihat `data/README.md` untuk cara memasukkan
  file Anda sendiri (nama tempat, lat, lng, alamat, no. telepon).
- **Aset gambar**: logo Bank Mandiri harus Anda tempatkan sendiri di
  `assets/logo_mandiri/logo-mandiri.png` (lihat README di folder tersebut —
  bukan aset yang bisa dibuatkan otomatis karena merupakan merek dagang
  resmi). Overlay panduan kamera & ikon website sudah berisi placeholder
  generik yang bisa langsung dipakai atau ditimpa dengan desain resmi Anda.
- Fitur kamera & GPS membutuhkan izin akses browser dan koneksi **HTTPS**
  (otomatis tersedia di domain Vercel).
- Data merchant di Dashboard masih data contoh (mock) — silakan sambungkan
  ke API/backend Anda untuk data real.
- Peta: tile OpenStreetMap. Routing: OSRM demo server publik
  (`router.project-osrm.org`) — gratis tanpa API key tapi ada rate-limit,
  tidak untuk trafik produksi tinggi. Untuk produksi, disarankan pindah ke
  instance OSRM sendiri atau layanan berbayar (Google Directions API,
  Mapbox, dsb).
