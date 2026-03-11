<div align="center">





<h1>🛠️ MAINTENANCE, AUDIT & MITIGASI</h1>
<p>Prosedur Penanganan Masalah Sistem E-Absensi SMK TARUNA BANGSA</p>
<hr>
</div>

🔍 1. PROSEDUR AUDIT DATA

Gunakan langkah ini jika terdapat laporan ketidaksesuaian data kehadiran siswa.

<table width="100%">
<thead>
<tr align="left" style="background-color: #f1f5f9;">
<th width="30%">Objek Audit</th>
<th>Metode Pengecekan</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Integritas NISN</b></td>
<td>Cek sheet <code>DataSiswa</code> kolom A. Pastikan tidak ada NISN yang duplikat (Gunakan <i>Data > Data Cleanup > Remove Duplicates</i> di Sheets).</td>
</tr>
<tr>
<td><b>Validasi Waktu</b></td>
<td>Audit sheet <code>LogAbsensi</code>. Jika ada siswa absen di luar jam sekolah (misal jam 23:00), periksa apakah ada indikasi manipulasi link.</td>
</tr>
<tr>
<td><b>Email Delivery</b></td>
<td>Buka <i>Apps Script > Executions</i>. Cek apakah ada status "Failed" pada fungsi <code>MailApp</code>. Biasanya karena kuota harian Google (100-500 email) habis.</td>
</tr>
</tbody>
</table>

🚨 2. MITIGASI GANGGUAN (TROUBLESHOOTING)

<div style="padding: 15px; background-color: #fff1f2; border-radius: 10px; border: 1px solid #fda4af;">
<h3 style="margin-top: 0; color: #991b1b;">Skenario A: Sistem "Busy" atau Stuck</h3>
<p><b>Penyebab:</b> Terlalu banyak request dalam 1 detik (Race Condition).</p>
<p><b>Mitigasi:</b> <code>LockService</code> sudah terpasang di <code>Code.gs</code> untuk antrean. Jika tetap macet, Admin harus me-refresh Spreadsheet dan melakukan <i>"Deploy > Manage Deployments > Edit"</i> untuk me-restart instance Web App.</p>
</div>

<div style="padding: 15px; background-color: #fffbeb; border-radius: 10px; border: 1px solid #fcd34d;">
<h3 style="margin-top: 0; color: #92400e;">Skenario B: QR Code Tidak Terbaca</h3>
<p><b>Penyebab:</b> Kecerahan layar HP rendah atau resolusi kamera buruk.</p>
<p><b>Mitigasi:</b> Instruksikan siswa untuk menaikkan kecerahan layar 100%. Jika gagal, Admin bisa melakukan input manual via sheet <code>LogAbsensi</code> dengan memasukkan NISN siswa secara manual di kolom B.</p>
</div>

🛡️ 3. LANGKAH PENCEGAHAN (PREVENTIVE)

<ol>
<li><b>Backup Mingguan:</b> Download file Spreadsheet ke format <code>.xlsx</code> setiap hari Jumat setelah jam sekolah selesai.</li>
<li><b>Clear Log Berkala:</b> Jika sheet <code>LogAbsensi</code> sudah mencapai >10.000 baris, pindahkan data lama ke file Archive agar script tetap ringan saat melakukan pencarian (Anti-Double Entry).</li>
<li><b>Update Password:</b> Lakukan perubahan password di <code>Index.html</code> setiap semester untuk menjaga keamanan akses dashboard.</li>
</ol>

📈 4. LIMITASI GOOGLE SERVICES

Perlu diingat bahwa sistem ini berjalan di atas infrastruktur gratis Google:

<ul>
<li><b>Email Limit:</b> ~100 email/hari (Akun Gmail Biasa) atau ~1500/hari (Google Workspace).</li>
<li><b>Simultaneous Users:</b> Optimal untuk 30-50 request bersamaan per detik.</li>
</ul>

<div align="center">
<p>Last Update: 2026-03-11 | Maintainer: <b>FARILtau72</b></p>
</div>
