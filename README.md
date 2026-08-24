# Mandiri Outbranch Command Center

Website statis satu file (`index.html`) berisi 3 menu: **Dashboard**, **Field Operation System (FOS)**, dan **Outbranch Delivery System (ODS)**. Tidak perlu proses build — semua library (Tailwind, Leaflet, Chart.js, QRCode, Lucide) dimuat lewat CDN.

## Deploy ke Vercel

**Cara tercepat (drag & drop):**
1. Buka https://vercel.com/new
2. Pilih "Deploy" lalu drag folder ini (yang berisi `index.html`) ke area upload — atau pakai opsi "Import Third-Party Git Repository" jika sudah di-push ke GitHub.
3. Vercel otomatis mendeteksinya sebagai static site. Klik **Deploy**.

**Via Vercel CLI:**
```bash
npm i -g vercel
cd folder-ini
vercel --prod
```

**Via GitHub:**
1. Push folder ini (isi `index.html`) ke repo GitHub baru.
2. Di Vercel dashboard → "Add New Project" → pilih repo tersebut → Deploy (tidak perlu ubah setting apapun, framework preset: *Other*).

## Fitur

- **Dashboard** — KPI, tren keluhan, distribusi level merchant, daftar merchant.
- **FOS**
  - *Field Radar* — peta UMKM/Balai RT-RW (Posyandu)/Sekolah dengan alamat & nomor telepon, filter radius 100–500 m (Nearby Target), dan Quick Blast (kirim pesan WhatsApp langsung ke nomor target terpilih).
  - *Realtime Location Monitoring* — posisi tim outbranch di peta, diperbarui otomatis tiap beberapa detik (simulasi).
  - *Smart Route Optimization* — pilih titik tujuan akhir, sistem merekomendasikan rute tambahan dari data mapping terdekat.
- **ODS** — wizard 4 langkah: pilih produk (Tabungan Pelajar / Livin Mandiri / Livin Merchant), entry data nasabah, verifikasi wajah (akses kamera browser), dan QR login nasabah.

## Catatan

- Data merchant, tim, dan target lapangan pada file ini masih **data contoh (mock)** — silakan sambungkan ke API/backend Anda (mis. sistem BDS) untuk data real.
- Peta menggunakan tile OpenStreetMap (gratis, tanpa API key).
- Fitur kamera pada ODS membutuhkan izin akses kamera dari browser dan koneksi HTTPS (otomatis tersedia di domain Vercel).
