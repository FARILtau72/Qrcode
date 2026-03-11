/**
 * SISTEM ABSENSI DIGITAL SMK TARUNA BANGSA - ULTIMATE STABLE 2026
 * Fitur: Scalable, Anti-Duplicate, & Auto-Email Kartu QR (Fix).
 * Status: Final Fix - Kartu QR dikirim saat registrasi.
 */

function doGet(e) {
  if (e.parameter.id) {
    return prosesAbsenAPI(e.parameter.id);
  }
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('E-Absensi SMK TARUNA BANGSA')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function verifyAdminPassword(password) {
  var adminPassword = getAdminPassword_();
  if (!adminPassword) {
    return { error: true, pesan: "Password admin belum diatur. Buka Apps Script > Project Settings > Script Properties dan isi ADMIN_PASSWORD." };
  }
  if (!password || password.toString() !== adminPassword) {
    return { error: true, pesan: "Password salah!" };
  }
  var token = Utilities.getUuid();
  CacheService.getScriptCache().put(token, "1", 1800);
  return { error: false, token: token };
}

function getAdminPassword_() {
  return PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD");
}

function isAdminTokenValid_(token) {
  if (!token) return false;
  return CacheService.getScriptCache().get(token.toString()) === "1";
}

function normalizeNisn_(idRaw) {
  if (idRaw === null || idRaw === undefined) return "";
  var id = idRaw.toString().trim();
  if (!/^\d{5,15}$/.test(id)) return "";
  return id;
}

function isValidEmail_(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toString().trim());
}

// === FUNGSI UTAMA: PROSES SCAN ABSEN ===
function prosesAbsenAPI(idRaw) {
  const lock = LockService.getScriptLock();
  
  try {
    var idTarget = normalizeNisn_(idRaw);
    if (!idTarget) return pesanHtml("❌ ERROR", "QR Code Tidak Valid!", "#ef4444");
    
    lock.waitLock(15000); 

    var sekarang = new Date();
    var tglSkrgStr = Utilities.formatDate(sekarang, "GMT+7", "yyyy-MM-dd");
    var waktuSkrgStr = Utilities.formatDate(sekarang, "GMT+7", "HH:mm");

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetLog = getOrCreateSheet(ss, "LogAbsensi", ["Waktu", "NISN", "Nama", "Kelas", "Status"]);
    var sheetSiswa = ss.getSheetByName("DataSiswa");

    SpreadsheetApp.flush();

    // 1. CARI DATA SISWA
    var dataSiswa = sheetSiswa.getDataRange().getValues();
    var siswaFound = null;
    for (var i = 1; i < dataSiswa.length; i++) {
      if (dataSiswa[i][0].toString().trim() === idTarget) {
        siswaFound = { 
          nama: dataSiswa[i][1], 
          kelas: dataSiswa[i][2],
          email: dataSiswa[i][3] 
        };
        break;
      }
    }

    if (!siswaFound) {
      return pesanHtml("❌ GAGAL", "ID ("+idTarget+") Tidak Terdaftar!", "#ef4444");
    }

    // 2. CEK APAKAH SUDAH ABSEN HARI INI
    var isDuplicate = false;
    var lastRow = sheetLog.getLastRow();
    if (lastRow > 1) {
      var startRow = Math.max(2, lastRow - 150); 
      var numRows = lastRow - startRow + 1;
      var dataLog = sheetLog.getRange(startRow, 1, numRows, 2).getValues();
      
      for (var j = dataLog.length - 1; j >= 0; j--) {
        if (dataLog[j][1].toString().trim() === idTarget) {
          var logDate = dataLog[j][0];
          var logDateObj = (logDate instanceof Date) ? logDate : new Date(logDate);
          if (Utilities.formatDate(logDateObj, "GMT+7", "yyyy-MM-dd") === tglSkrgStr) {
            isDuplicate = true;
            break;
          }
        }
      }
    }

    // 3. JIKA SUDAH ABSEN (SCAN ULANG)
    if (isDuplicate) {
      return pesanHtml("✅ STATUS: HADIR", "Halo <b>" + siswaFound.nama + "</b>,<br>Absensi kamu sudah aman di sistem kami.", "#22c55e");
    }

    // 4. JIKA BELUM ABSEN, SIMPAN KE LOG
    sheetLog.appendRow([sekarang, idTarget, siswaFound.nama, siswaFound.kelas, "HADIR"]);
    SpreadsheetApp.flush();

    // 5. KIRIM EMAIL NOTIFIKASI HADIR
    if (siswaFound.email && siswaFound.email.includes("@") && MailApp.getRemainingDailyQuota() > 0) {
      try {
        MailApp.sendEmail({
          to: siswaFound.email,
          subject: "✅ PRESENSI BERHASIL - " + tglSkrgStr,
          htmlBody: `
            <div style="font-family: sans-serif; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; max-width: 400px; margin: auto;">
              <h2 style="color: #22c55e; margin-top: 0;">Presensi Berhasil!</h2>
              <p>Halo <b>${siswaFound.nama}</b>,</p>
              <p>Kehadiranmu telah tercatat pada:</p>
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
                <p style="margin: 5px 0;"><b>Tanggal:</b> ${tglSkrgStr}</p>
                <p style="margin: 5px 0;"><b>Waktu:</b> ${waktuSkrgStr} WIB</p>
              </div>
              <p style="font-size: 11px; color: #94a3b8; margin-top: 20px; text-align: center;">SMK TARUNA BANGSA</p>
            </div>`
        });
      } catch (e) { console.error("Email gagal: " + e.message); }
    }

    return pesanHtml("✅ BERHASIL", "Presensi <b>" + siswaFound.nama + "</b> Berhasil dicatat!", "#22c55e");

  } catch (err) {
    return pesanHtml("❌ GAGAL", "Sistem sibuk, silakan coba lagi.", "#ef4444");
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

// === FUNGSI REGISTRASI (DENGAN KIRIM KARTU QR) ===
function simpanSiswa(id, nama, kelas, email) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateSheet(ss, "DataSiswa", ["NISN", "Nama", "Kelas", "Email", "QR"]);
    var idTrim = normalizeNisn_(id);
    var namaTrim = nama ? nama.toString().trim() : "";
    var kelasTrim = kelas ? kelas.toString().trim() : "";
    var emailTrim = email ? email.toString().trim() : "";
    if (!idTrim) return { error: true, pesan: "NISN wajib berupa angka 5-15 digit." };
    if (!namaTrim) return { error: true, pesan: "Nama wajib diisi." };
    if (!kelasTrim) return { error: true, pesan: "Kelas wajib diisi." };
    if (!isValidEmail_(emailTrim)) return { error: true, pesan: "Email belum valid." };
    
    // Cek NISN Duplikat
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString().trim() === idTrim) return {error: true, pesan: "NISN sudah terdaftar!"};
    }

    // Generate URL Absensi & QR Code
    var urlApp = ScriptApp.getService().getUrl();
    var finalUrl = urlApp + "?id=" + idTrim;
    var qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=" + encodeURIComponent(finalUrl);
    
    // Tulis ke Sheet
    sheet.appendRow([idTrim, namaTrim, kelasTrim, emailTrim, '=IMAGE("' + qrUrl + '")']);
    SpreadsheetApp.flush();
    
    // KIRIM EMAIL KARTU QR (CRITICAL FIX)
    if (emailTrim && MailApp.getRemainingDailyQuota() > 0) {
      try {
        MailApp.sendEmail({
          to: emailTrim,
          subject: "🪪 KARTU ABSENSI DIGITAL - " + namaTrim.toUpperCase(),
          htmlBody: `
            <div style="font-family: sans-serif; text-align: center; border: 2px solid #6366f1; border-radius: 20px; padding: 25px; max-width: 400px; margin: auto;">
              <h2 style="color: #6366f1; margin-bottom: 5px;">SMK TARUNA BANGSA</h2>
              <p style="color: #64748b; margin-top: 0;">Kartu Absensi Digital Siswa</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
              <img src="${qrUrl}" width="220" style="border: 5px solid #f8fafc; border-radius: 15px;">
              <div style="text-align: left; margin-top: 25px; background: #f8fafc; padding: 15px; border-radius: 12px;">
                <p style="margin: 5px 0;"><b>Nama:</b> ${namaTrim}</p>
                <p style="margin: 5px 0;"><b>NISN:</b> ${idTrim}</p>
                <p style="margin: 5px 0;"><b>Kelas:</b> ${kelasTrim}</p>
              </div>
              <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">Tunjukkan QR Code ini ke petugas atau scan pada alat yang tersedia untuk absensi harian.</p>
            </div>`
        });
      } catch (e) { console.error("Gagal kirim kartu: " + e.message); }
    }
    
    return {nama: namaTrim, error: false};
  } catch(e) { 
    return {error: true, pesan: "Gagal daftar: " + e.toString()}; 
  } finally { 
    if (lock.hasLock()) lock.releaseLock(); 
  }
}

function ambilDataSiswa(token) {
  if (!isAdminTokenValid_(token)) {
    return { error: true, pesan: "Akses admin tidak valid. Silakan login kembali." };
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, "DataSiswa", ["NISN", "Nama", "Kelas", "Email", "QR"]);
  return { error: false, data: sheet.getDataRange().getValues().slice(1) };
}

function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f1f5f9");
  }
  return sheet;
}

function pesanHtml(judul, pesan, warna) {
  return HtmlService.createHtmlOutput(`
    <!DOCTYPE html><html><head><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="margin:0;font-family:'Poppins',sans-serif;background:#f1f5f9;display:flex;align-items:center;justify-content:center;height:100vh;padding:20px;">
      <div style="background:white;padding:40px;border-radius:30px;border-top:10px solid ${warna};box-shadow:0 10px 30px rgba(0,0,0,0.1);width:100%;max-width:350px;text-align:center;">
        <h1 style="color:${warna};margin:0 0 15px;">${judul}</h1>
        <p style="font-size:16px;color:#334155;">${pesan}</p>
        <button onclick="window.top.location.href='${ScriptApp.getService().getUrl()}'" style="padding:12px 25px;background:${warna};color:white;border:none;border-radius:10px;font-weight:600;width:100%;margin-top:20px;">Kembali</button>
      </div>
    </body></html>`);
}
