🚀 E-ABSENSI SMK TARUNA BANGSA (v2.1)

Sistem absensi sederhana berbasis Google Sheets dan QR Code. Dokumen ini berisi instruksi lengkap untuk menyiapkan database, cara pemakaian di perangkat, hingga solusi kendala teknis.

🛠️ TECH STACK

Backend: Google Apps Script (GAS)

Database: Google Sheets

Frontend: HTML5, CSS3 (Poppins Fonts), SweetAlert2

API: QRServer API (Dynamic QR Generation)

1. PERSIAPAN GOOGLE SHEETS (DATABASE)

Anda WAJIB membuat 2 Sheet (tab di bagian bawah) dengan nama yang pas agar sistem tidak error:

A. Sheet Pertama: DataSiswa

Kolom A: NISN

Kolom B: Nama

Kolom C: Kelas

Kolom D: Email

Kolom E: QR

B. Sheet Kedua: LogAbsensi

Kolom A: Waktu

Kolom B: NISN

Kolom C: Nama

Kolom D: Kelas

Kolom E: Status

2. CARA PASANG SCRIPT

Buka file Google Sheets Anda.

Klik menu Extensions -> Apps Script.

Masukkan kode dari file Code.gs dan Index.html.

Klik Simpan.

Klik Deploy -> New Deployment.

Pilih Web App.

Execute as: Me.

Who has access: Anyone.

Klik Deploy dan salin URL-nya.

3. PANDUAN PAKAI DI PERANGKAT

Cara Registrasi (Siswa)

Buka link di browser HP.

Isi data diri lengkap.

Klik DAFTAR. Simpan QR Code yang dikirim ke email.

Cara Absen (Harian)

Scan QR Code -> Klik link yang muncul.

Tunggu sampai muncul kartu hijau "✅ STATUS: HADIR".

4. ⚠️ TROUBLESHOOTING

Masalah

Penyebab

Solusi

NISN tidak terdaftar

Belum registrasi.

Daftar dulu di tab REGISTRASI.

Sudah Absen Hari Ini

Scan lebih dari sekali.

Data pertama sudah aman tersimpan.

Email QR tidak masuk

Salah ketik / Spam.

Cek folder Spam atau lapor admin.

Kamera tidak scan

Lensa kotor / redup.

Bersihkan lensa & cari tempat terang.

5. 🔮 RENCANA UPGRADE

Tabel Rekap: Hitung kehadiran bulanan otomatis.

Auto-Update: Penambahan kelas/jurusan baru secara dinamis.

WhatsApp Notif: Integrasi pesan WA untuk wali murid.

DEVELOPED BY:


Tim IT SMK TARUNA BANGSA - 2026
