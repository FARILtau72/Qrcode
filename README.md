<div align="center">





<h1>🚀 E-ABSENSI DIGITAL 



 </h1>
<p>Sistem Presensi Berbasis QR-Code & Google Cloud Engine</p>

<hr>
</div>

📋 1. PERSIAPAN DATABASE (WAJIB!)

Sebelum menjalankan kode, Anda WAJIB membuat Google Sheets dengan struktur berikut agar skrip tidak error:

A. Sheet: DataSiswa

Digunakan untuk menyimpan database induk siswa.

<table width="100%">
<thead>
<tr align="left">
<th>Kolom</th>
<th>Nama Header</th>
<th>Fungsi</th>
</tr>
</thead>
<tbody>
<tr>
<td>A</td>
<td><b>NISN</b></td>
<td>ID unik siswa (Primary Key)</td>
</tr>
<tr>
<td>B</td>
<td><b>Nama</b></td>
<td>Nama lengkap siswa</td>
</tr>
<tr>
<td>C</td>
<td><b>Kelas</b></td>
<td>Tingkatan & Jurusan</td>
</tr>
<tr>
<td>D</td>
<td><b>Email</b></td>
<td>Tujuan pengiriman kartu QR</td>
</tr>
<tr>
<td>E</td>
<td><b>QR</b></td>
<td>Tempat menyimpan formula gambar QR</td>
</tr>
</tbody>
</table>

B. Sheet: LogAbsensi

Digunakan untuk mencatat riwayat kehadiran harian.

<table width="100%">
<thead>
<tr align="left">
<th>Kolom</th>
<th>Nama Header</th>
<th>Keterangan</th>
</tr>
</thead>
<tbody>
<tr>
<td>A</td>
<td><b>Waktu</b></td>
<td>Tanggal & Jam otomatis</td>
</tr>
<tr>
<td>B</td>
<td><b>NISN</b></td>
<td>ID yang terdeteksi scanner</td>
</tr>
<tr>
<td>C</td>
<td><b>Nama</b></td>
<td>Nama siswa (Otomatis muncul)</td>
</tr>
<tr>
<td>D</td>
<td><b>Kelas</b></td>
<td>Kelas siswa</td>
</tr>
<tr>
<td>E</td>
<td><b>Status</b></td>
<td>Keterangan "HADIR"</td>
</tr>
</tbody>
</table>

🔥 2. FITUR UNGGULAN

<div style="padding: 10px; background-color: #f8fafc; border-radius: 10px; border-left: 5px solid #2563eb;">
<ul>
<li><b>Anti-Double Entry:</b> Siswa tidak bisa absen 2x di hari yang sama.</li>
<li><b>Automated Mail:</b> Kartu QR dikirim langsung ke email saat pendaftaran sukses.</li>
<li><b>Admin Dashboard:</b> Panel data terproteksi password <code>TB original 123</code>.</li>
<li><b>Download Report:</b> Ekspor data ke format Excel (.xlsx) dengan satu klik.</li>
</ul>
</div>

🚀 3. CARA INSTALASI

<ol>
<li>Buka Google Sheets yang sudah dibuat tadi.</li>
<li>Klik menu <b>Extensions</b> > <b>Apps Script</b>.</li>
<li>Salin kode dari <code>Code.gs</code> ke editor.</li>
<li>Buat file HTML baru bernama <code>Index.html</code> dan salin kodenya.</li>
<li>Klik <b>Deploy</b> > <b>New Deployment</b>.</li>
<li>Pilih <b>Web App</b>, Execute as: <b>Me</b>, Access: <b>Anyone</b>.</li>
<li>Salin link Web App dan sebarkan ke siswa.</li>
</ol>

🔐 4. KEAMANAN & TEKNIS

Sistem ini menggunakan <b>LockService</b> untuk menangani lonjakan trafik saat pagi hari agar tidak terjadi kegagalan penulisan data di Spreadsheet.

<div align="center">
<p>Developer: <b>FARILtau72</b></p>
</div>
