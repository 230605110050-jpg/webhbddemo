# Panduan Kustomisasi Website Birthday Gift ❤️

Website ini dibuat dengan **HTML5, CSS3, dan JavaScript (GSAP & Canvas)** dengan tema *Midnight Navy & Gold* romantis dan interaktif. Halaman berjalan penuh (100vh) per bagian dengan berbagai transisi estetik.

## 📁 Struktur File
* `index.html` - Struktur utama website dan slide ucapan.
* `style.css` - Desain tampilan, efek glassmorphism, amplop surat, galeri Polaroid, dan lilin kue.
* `script.js` - Logika interaksi, canvas bintang, ledakan bunga, hitungan mundur hari, dan tiup lilin.
* `assets/` - Folder penyimpanan untuk lagu latar belakang (`music.mp3`) dan foto galeri Anda.

---

## 🛠️ Cara Kustomisasi Ucapan & Data diri

Buka file **[script.js](file:///d:/birthday%20web/script.js)**, lalu edit objek `CONFIG` di bagian paling atas:

```javascript
const CONFIG = {
  recipientName: "", // Ganti dengan nama panggilan pacar/teman Anda
  birthDate: new Date("2004-10-14T00:00:00"), // Tanggal lahir (Format: YYYY-MM-DD)
  birthMonthIndex: 9, // Bulan lahir (0 = Januari, 9 = Oktober, 11 = Desember)
  birthDay: 14, // Hari ulang tahun
  letterText: `Hi ,
  
Selamat Ulang Tahun yang ke-21!...` // Edit teks surat panjang Anda di sini
};
```

### 1. Mengganti Musik Latar Belakang (.mp3)
1. Siapkan file lagu favorit Anda berformat `.mp3` (misalnya: lagu romantis instrumental).
2. Buat folder baru bernama `assets` di dalam direktori `d:\birthday web`.
3. Simpan file lagu tersebut ke dalam folder tersebut dan beri nama `music.mp3`.
4. *Catatan:* Jika file musik kosong atau tidak ditemukan, website secara otomatis akan mengaktifkan **synthesizer piano built-in (Web Audio API)** yang memutar melodi chords piano lembut secara langsung dari kode JS!

### 2. Mengganti Foto Galeri Polaroid
1. Siapkan 3 file foto kenangan Anda (format `.jpg`, `.jpeg`, atau `.png`).
2. Masukkan ke dalam folder `assets` dengan nama `photo1.jpg`, `photo2.jpg`, dan `photo3.jpg`.
3. Buka file **[index.html](file:///d:/birthday%20web/index.html)**, cari bagian `SLIDE 7: Photo Gallery`, lalu tambahkan tag `<img>` di dalam div placeholder masing-masing:

   **Sebelum:**
   ```html
   <div class="polaroid-img-placeholder" id="p1">
     <i data-lucide="camera" class="cam-icon"></i>
     <span class="placeholder-text">Your Photo 1</span>
   </div>
   ```

   **Sesudah:**
   ```html
   <div class="polaroid-img-placeholder" id="p1">
     <img src="assets/photo1.jpg" alt="Foto Pertama ">
     <i data-lucide="camera" class="cam-icon"></i>
     <span class="placeholder-text">Your Photo 1</span>
   </div>
   ```
4. Anda dapat menyesuaikan teks tulisan tangan di bawah Polaroid dengan mengedit isi tag `<div class="polaroid-caption">`.

---

## 🚀 Cara Menjalankan Website Secara Lokal
Untuk melihat website Anda di browser:
1. Buka folder `d:\birthday web` di File Explorer komputer Anda.
2. Klik ganda file `index.html` untuk langsung membukanya di browser Google Chrome / Microsoft Edge / browser favorit Anda.
3. Klik tombol **Click to Open** di tengah untuk memulai pertunjukan musik dan efek transisi.


# webhbddemo
