/**
 * @file suratMasukController.js
 * @description Controller Alur Surat Masuk & Disposisi BKPSDMD Kota Bitung
 */

const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('../config/database.cjs');
const { catatLogAktivitas } = require('../middleware/auth.cjs');

// Pastikan direktori uploads/surat_masuk tersedia
const uploadDir = path.join(__dirname, '../../uploads/surat_masuk');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi Multer: Strictly PDF Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedOriginal = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `SM_${timestamp}_${sanitizedOriginal}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Format berkas tidak valid. Sistem hanya menerima berkas dokumen PDF (.pdf).'), false);
  }
};

const uploadSuratMasuk = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // Maksimal 15 MB
}).single('file_pdf');

/**
 * Generator Nomor Agenda Otomatis: Format AGD/YYYY/BULAN_ROMAWI/XXXX
 * Contoh: AGD/2026/XI/0005
 */
const generateNomorAgenda = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const monthNamesRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const romanMonth = monthNamesRoman[date.getMonth()];

  // Hitung jumlah surat masuk pada tahun berjalan
  const [rows] = await db.query(
    `SELECT COUNT(id) AS total FROM surat_masuk WHERE YEAR(tgl_input) = ?`,
    [year]
  );

  const urutan = (rows[0]?.total || 0) + 1;
  const paddedUrutan = String(urutan).padStart(4, '0');
  return `AGD/${year}/${romanMonth}/${paddedUrutan}`;
};

/**
 * 1. LOKET: Input Surat Masuk Baru
 */
const inputSuratMasuk = async (req, res) => {
  uploadSuratMasuk(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const { asal_surat, no_surat, tgl_surat, perihal, sifat, id_kategori } = req.body;
      const idPetugas = req.user.id;
      const fileName = req.file ? req.file.filename : 'dummy_surat.pdf';

      if (!asal_surat || !no_surat || !tgl_surat || !perihal || !id_kategori) {
        return res.status(400).json({ success: false, message: 'Semua bidang wajib diisi.' });
      }

      // Generate No. Agenda Otomatis
      const noAgenda = await generateNomorAgenda();

      // Simpan ke database
      const [result] = await db.query(
        `INSERT INTO surat_masuk 
         (no_agenda, asal_surat, no_surat, tgl_surat, perihal, sifat, file_pdf, id_kategori, id_petugas_loket, status_surat, tgl_input)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'MENUNGGU_VERIFIKASI_SEKRETARIAT', NOW())`,
        [noAgenda, asal_surat, no_surat, tgl_surat, perihal, sifat || 'Biasa', fileName, id_kategori, idPetugas]
      );

      // Audit Log
      await catatLogAktivitas({
        userId: idPetugas,
        role: req.user.role,
        aksi: 'INPUT_SURAT_MASUK',
        keterangan: `Loket menginput surat masuk no: ${no_surat} dengan No. Agenda: ${noAgenda}`,
        ipAddress: req.ip
      });

      return res.status(201).json({
        success: true,
        message: 'Surat masuk berhasil diinput dan diteruskan ke Sekretariat.',
        data: {
          id: result.insertId,
          no_agenda: noAgenda
        }
      });
    } catch (error) {
      console.error('Error inputSuratMasuk:', error);
      return res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem saat menyimpan surat masuk.' });
    }
  });
};

/**
 * 2. SEKRETARIAT: Verifikasi Surat & Teruskan ke Kepala Badan
 */
const verifikasiSekretariat = async (req, res) => {
  try {
    const { id } = req.params;
    const [surat] = await db.query('SELECT * FROM surat_masuk WHERE id = ?', [id]);

    if (!surat || surat.length === 0) {
      return res.status(404).json({ success: false, message: 'Surat masuk tidak ditemukan.' });
    }

    await db.query(
      `UPDATE surat_masuk SET status_surat = 'MENUNGGU_DISPOSISI_KEPALA_BADAN' WHERE id = ?`,
      [id]
    );

    await catatLogAktivitas({
      userId: req.user.id,
      role: req.user.role,
      aksi: 'VERIFIKASI_SURAT',
      keterangan: `Sekretariat memverifikasi surat ${surat[0].no_agenda} dan meneruskan ke Kepala Badan`,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Surat berhasil diverifikasi dan diajukan ke Kepala Badan.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. SEKRETARIAT: Kembalikan Surat ke Loket
 */
const kembalikanKeLoket = async (req, res) => {
  try {
    const { id } = req.params;
    const { alasan } = req.body;

    if (!alasan) {
      return res.status(400).json({ success: false, message: 'Alasan pengembalian wajib dicantumkan.' });
    }

    await db.query(
      `UPDATE surat_masuk SET status_surat = 'DIKEMBALIKAN_KE_LOKET' WHERE id = ?`,
      [id]
    );

    await db.query(
      `INSERT INTO pengembalian_surat (id_surat_masuk, dari_role, ke_role, alasan, tgl_kembali, id_user_pengembali)
       VALUES (?, 'SEKRETARIAT', 'LOKET', ?, NOW(), ?)`,
      [id, alasan, req.user.id]
    );

    await catatLogAktivitas({
      userId: req.user.id,
      role: req.user.role,
      aksi: 'KEMBALIKAN_KE_LOKET',
      keterangan: `Sekretariat mengembalikan surat ID ${id} ke Loket. Alasan: ${alasan}`,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Surat berhasil dikembalikan ke Loket untuk diperbaiki.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. KEPALA BADAN: Buat Lembar Disposisi
 */
const buatDisposisi = async (req, res) => {
  try {
    const { id } = req.params; // ID surat_masuk
    const { id_bagian_tujuan, instruksi, catatan_kepala } = req.body;

    if (!id_bagian_tujuan || !instruksi) {
      return res.status(400).json({ success: false, message: 'Bagian tujuan dan instruksi disposisi wajib ditentukan.' });
    }

    // Masukkan record disposisi
    await db.query(
      `INSERT INTO disposisi (id_surat_masuk, id_bagian_tujuan, instruksi, catatan_kepala, tgl_disposisi, status_disposisi)
       VALUES (?, ?, ?, ?, NOW(), 'DIBUAT')`,
      [id, id_bagian_tujuan, instruksi, catatan_kepala || null]
    );

    // Update status surat masuk
    await db.query(
      `UPDATE surat_masuk SET status_surat = 'DISPOSISI_DIBUAT' WHERE id = ?`,
      [id]
    );

    await catatLogAktivitas({
      userId: req.user.id,
      role: req.user.role,
      aksi: 'BUAT_DISPOSISI',
      keterangan: `Kepala Badan membuat lembar disposisi untuk surat ID ${id} tujuan Bagian ID ${id_bagian_tujuan}`,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Lembar disposisi berhasil diterbitkan dan dikirim ke Sekretariat.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. SEKRETARIAT: Teruskan Surat Beserta Disposisi ke Bagian Terkait
 */
const teruskanKeBagian = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `UPDATE surat_masuk SET status_surat = 'DITERUSKAN_KE_BAGIAN' WHERE id = ?`,
      [id]
    );

    await db.query(
      `UPDATE disposisi SET status_disposisi = 'DITERUSKAN' WHERE id_surat_masuk = ?`,
      [id]
    );

    await catatLogAktivitas({
      userId: req.user.id,
      role: req.user.role,
      aksi: 'TERUSKAN_KE_BAGIAN',
      keterangan: `Sekretariat meneruskan berkas fisik/digital surat ID ${id} ke Kepala Bagian tujuan`,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Surat dan lembar disposisi berhasil diteruskan ke Kepala Bagian.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 6. KEPALA BAGIAN: Kembalikan Surat ke Sekretariat (Jika Salah Sasaran)
 */
const kembalikanKeSekretariat = async (req, res) => {
  try {
    const { id } = req.params;
    const { alasan } = req.body;

    if (!alasan) {
      return res.status(400).json({ success: false, message: 'Alasan pengembalian disposisi salah sasaran wajib dicantumkan.' });
    }

    await db.query(
      `UPDATE surat_masuk SET status_surat = 'DIKEMBALIKAN_KE_SEKRETARIAT' WHERE id = ?`,
      [id]
    );

    await db.query(
      `INSERT INTO pengembalian_surat (id_surat_masuk, dari_role, ke_role, alasan, tgl_kembali, id_user_pengembali)
       VALUES (?, 'KEPALA_BAGIAN', 'SEKRETARIAT', ?, NOW(), ?)`,
      [id, alasan, req.user.id]
    );

    await catatLogAktivitas({
      userId: req.user.id,
      role: req.user.role,
      aksi: 'KEMBALIKAN_KE_SEKRETARIAT',
      keterangan: `Kepala Bagian mengembalikan surat ID ${id} ke Sekretariat. Alasan: ${alasan}`,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Surat berhasil dikembalikan ke Sekretariat untuk disposisi ulang.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 7. KEPALA BAGIAN: Update Status Pengerjaan (SEDANG_DIPROSES -> SELESAI)
 */
const updateStatusPengerjaanBagian = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_baru } = req.body; // 'SEDANG_DIPROSES' atau 'SELESAI'

    if (!['SEDANG_DIPROSES', 'SELESAI'].includes(status_baru)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid.' });
    }

    await db.query(
      `UPDATE surat_masuk SET status_surat = ? WHERE id = ?`,
      [status_baru, id]
    );

    if (status_baru === 'SELESAI') {
      await db.query(
        `UPDATE disposisi SET status_disposisi = 'SELESAI' WHERE id_surat_masuk = ?`,
        [id]
      );
    }

    await catatLogAktivitas({
      userId: req.user.id,
      role: req.user.role,
      aksi: 'UPDATE_STATUS_PENGERJAAN',
      keterangan: `Kepala Bagian mengubah status pengerjaan surat ID ${id} menjadi ${status_baru}`,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: `Status berhasil diubah menjadi: ${status_baru}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllSuratMasuk = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM surat_masuk ORDER BY id DESC');
    const [disposisiRows] = await db.query('SELECT * FROM disposisi ORDER BY id DESC');
    const [pengembalianRows] = await db.query('SELECT * FROM pengembalian_surat ORDER BY id ASC');

    const enriched = rows.map((surat) => {
      const disp = disposisiRows.find((d) => d.id_surat_masuk === surat.id);
      const riwayat = pengembalianRows.filter((p) => p.id_surat_masuk === surat.id);
      return {
        ...surat,
        disposisi: disp || undefined,
        riwayat_pengembalian: riwayat
      };
    });

    return res.json(enriched);
  } catch (error) {
    console.error('Error getAllSuratMasuk:', error);
    return res.status(500).json([]);
  }
};

const arsipkanSuratMasuk = async (req, res) => {
  try {
    const { id } = req.params;
    const { keterangan } = req.body;

    await db.query(
      `UPDATE surat_masuk SET status_surat = 'ARSIP', is_arsip = 1, tgl_arsip = CURDATE(), keterangan_arsip = ? WHERE id = ?`,
      [keterangan || 'Diarsipkan di lemari dokumen BKPSDMD', id]
    );

    await catatLogAktivitas({
      userId: req.user.id,
      role: req.user.role,
      aksi: 'ARSIP_SURAT',
      keterangan: `Mengarsipkan surat masuk ID ${id}`,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Surat berhasil diarsipkan.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const batalArsipSuratMasuk = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `UPDATE surat_masuk SET status_surat = 'SELESAI', is_arsip = 0, tgl_arsip = NULL, keterangan_arsip = NULL WHERE id = ?`,
      [id]
    );

    await catatLogAktivitas({
      userId: req.user.id,
      role: req.user.role,
      aksi: 'BATAL_ARSIP',
      keterangan: `Membatalkan status arsip surat masuk ID ${id}`,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Status arsip berhasil dibatalkan.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  inputSuratMasuk,
  getAllSuratMasuk,
  verifikasiSekretariat,
  kembalikanKeLoket,
  buatDisposisi,
  teruskanKeBagian,
  arsipkanSuratMasuk,
  batalArsipSuratMasuk,
  kembalikanKeSekretariat,
  updateStatusPengerjaanBagian
};
