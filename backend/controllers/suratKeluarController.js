/**
 * @file suratKeluarController.js
 * @description Controller Alur Surat Keluar Internal BKPSDMD & Versioning Berkas PDF
 */

const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('../config/database');
const { catatLogAktivitas } = require('../middleware/auth');

// Direktori berkas surat keluar
const uploadDirKeluar = path.join(__dirname, '../../uploads/surat_keluar');
if (!fs.existsSync(uploadDirKeluar)) {
  fs.mkdirSync(uploadDirKeluar, { recursive: true });
}

const storageKeluar = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirKeluar);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `SK_${timestamp}_${sanitized}`);
  }
});

const uploadPdfKeluar = multer({
  storage: storageKeluar,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('Hanya berkas PDF (.pdf) yang diperkenankan untuk konsep naskah dinas.'), false);
    }
  },
  limits: { fileSize: 15 * 1024 * 1024 }
}).single('file_pdf');

/**
 * 1. KEPALA BAGIAN: Buat Konsep Surat Keluar (Versi 1)
 */
const buatKonsepSuratKeluar = async (req, res) => {
  uploadPdfKeluar(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const { no_draft, jenis_naskah, sifat, lampiran, perihal, id_bagian_tujuan, isi_ringkas } = req.body;
      const idBagianPengirim = req.user.id_bagian;
      const fileName = req.file ? req.file.filename : 'draft_v1.pdf';

      if (!no_draft || !perihal || !id_bagian_tujuan || !isi_ringkas) {
        return res.status(400).json({ success: false, message: 'Semua bidang konsep surat keluar wajib diisi.' });
      }

      // 1. Simpan data induk surat_keluar
      const [insertSurat] = await db.query(
        `INSERT INTO surat_keluar 
         (no_draft, jenis_naskah, sifat, lampiran, perihal, id_bagian_pengirim, id_bagian_tujuan, isi_ringkas, status_persetujuan, tgl_dibuat)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENGAJUAN_KE_KEPALA_BADAN', NOW())`,
        [no_draft, jenis_naskah || 'Nota Dinas', sifat || 'Biasa', lampiran || '-', perihal, idBagianPengirim, id_bagian_tujuan, isi_ringkas]
      );

      const suratId = insertSurat.insertId;

      // 2. Simpan Berkas Versi 1 ke surat_keluar_versi_file
      await db.query(
        `INSERT INTO surat_keluar_versi_file (id_surat_keluar, versi_ke, nama_file, catatan_revisi, uploaded_by, uploaded_at)
         VALUES (?, 1, ?, 'Draft awal pengajuan konsep naskah', ?, NOW())`,
        [suratId, fileName, req.user.id]
      );

      // 3. Catat Log Audit
      await catatLogAktivitas({
        userId: req.user.id,
        role: req.user.role,
        aksi: 'BUAT_KONSEP_SURAT_KELUAR',
        keterangan: `Kepala Bagian membuat draft surat keluar: ${no_draft} (Versi 1) perihal: ${perihal}`,
        ipAddress: req.ip
      });

      return res.status(201).json({
        success: true,
        message: 'Konsep surat keluar berhasil dibuat dan diajukan ke Kepala Badan.',
        data: { id: suratId, versi: 1 }
      });
    } catch (error) {
      console.error('Error buatKonsepSuratKeluar:', error);
      return res.status(500).json({ success: false, message: 'Gagal membuat konsep surat keluar.' });
    }
  });
};

/**
 * 2. KEPALA BADAN: Menyetujui Surat Keluar
 */
const setujuiSuratKeluar = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `UPDATE surat_keluar 
       SET status_persetujuan = 'DISETUJUI_KEPALA_BADAN', tgl_disetujui = NOW()
       WHERE id = ?`,
      [id]
    );

    await catatLogAktivitas({
      userId: req.user.id,
      role: req.user.role,
      aksi: 'SETUJUI_SURAT_KELUAR',
      keterangan: `Kepala Badan menyetujui draft surat keluar ID ${id}`,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Surat keluar telah disetujui oleh Kepala Badan.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. KEPALA BADAN: Mengembalikan untuk Revisi (dengan Catatan)
 */
const kembalikanUntukRevisi = async (req, res) => {
  try {
    const { id } = req.params;
    const { catatan_revisi } = req.body;

    if (!catatan_revisi) {
      return res.status(400).json({ success: false, message: 'Catatan koreksi/revisi wajib diisi oleh Kepala Badan.' });
    }

    await db.query(
      `UPDATE surat_keluar 
       SET status_persetujuan = 'REVISI', catatan_revisi_terakhir = ?
       WHERE id = ?`,
      [catatan_revisi, id]
    );

    await catatLogAktivitas({
      userId: req.user.id,
      role: req.user.role,
      aksi: 'KEMBALIKAN_REVISI_SURAT_KELUAR',
      keterangan: `Kepala Badan meminta revisi draft surat keluar ID ${id}. Catatan: ${catatan_revisi}`,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Draft surat keluar dikembalikan ke Bagian Pembuat untuk direvisi.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. KEPALA BAGIAN: Upload File PDF Revisi Baru (Otomatis naik versi tanpa menghapus file lama)
 */
const uploadRevisiVersiBaru = async (req, res) => {
  uploadPdfKeluar(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const { id } = req.params; // id surat_keluar
      const { catatan_perbaikan } = req.body;

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Berkas PDF revisi baru wajib diunggah.' });
      }

      // Ambil versi terakhir dari database
      const [versiRows] = await db.query(
        `SELECT MAX(versi_ke) AS last_versi FROM surat_keluar_versi_file WHERE id_surat_keluar = ?`,
        [id]
      );

      const versiBaru = (versiRows[0]?.last_versi || 1) + 1;
      const fileName = req.file.filename;

      // 1. Simpan versi baru ke tabel surat_keluar_versi_file (FILE LAMA TETAP AMAN)
      await db.query(
        `INSERT INTO surat_keluar_versi_file (id_surat_keluar, versi_ke, nama_file, catatan_revisi, uploaded_by, uploaded_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [id, versiBaru, fileName, catatan_perbaikan || `Revisi versi ${versiBaru}`, req.user.id]
      );

      // 2. Perbarui status surat keluar kembali ke 'PENGAJUAN_KE_KEPALA_BADAN'
      await db.query(
        `UPDATE surat_keluar 
         SET status_persetujuan = 'PENGAJUAN_KE_KEPALA_BADAN' 
         WHERE id = ?`,
        [id]
      );

      // 3. Catat audit trail
      await catatLogAktivitas({
        userId: req.user.id,
        role: req.user.role,
        aksi: 'UPLOAD_REVISI_SURAT_KELUAR',
        keterangan: `Kepala Bagian mengunggah berkas revisi Versi ${versiBaru} untuk surat keluar ID ${id}`,
        ipAddress: req.ip
      });

      return res.status(200).json({
        success: true,
        message: `Berkas revisi (Versi ${versiBaru}) berhasil diunggah dan diajukan ulang ke Kepala Badan.`,
        data: { versi_baru: versiBaru, file: fileName }
      });
    } catch (error) {
      console.error('Error uploadRevisiVersiBaru:', error);
      return res.status(500).json({ success: false, message: 'Gagal mengunggah berkas revisi baru.' });
    }
  });
};

/**
 * 5. SEKRETARIAT: Meneruskan Surat Keluar yang Disetujui ke Bagian Tujuan
 */
const teruskanKeBagianTujuan = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `UPDATE surat_keluar 
       SET status_persetujuan = 'DITERUSKAN_KE_BAGIAN_TUJUAN' 
       WHERE id = ?`,
      [id]
    );

    await catatLogAktivitas({
      userId: req.user.id,
      role: req.user.role,
      aksi: 'TERUSKAN_SURAT_KELUAR',
      keterangan: `Sekretariat meneruskan surat keluar ID ${id} yang telah disetujui ke Bagian Tujuan`,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Surat keluar berhasil diteruskan ke Bagian Tujuan.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  buatKonsepSuratKeluar,
  setujuiSuratKeluar,
  kembalikanUntukRevisi,
  uploadRevisiVersiBaru,
  teruskanKeBagianTujuan
};
