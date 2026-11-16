/**
 * @file server.js
 * @description Entry Point API Backend Node.js / Express.js Sistem Persuratan BKPSDMD Kota Bitung
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const db = require('./config/database.cjs');

const PORT = process.env.PORT || 5000;

// Middleware Global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder untuk PDF Storage
app.use('/uploads/surat_masuk', express.static(path.join(__dirname, '../uploads/surat_masuk')));
app.use('/uploads/surat_keluar', express.static(path.join(__dirname, '../uploads/surat_keluar')));

// Import Controllers & Middleware
const { verifyToken, authorizeRoles } = require('./middleware/auth.cjs');
const authController = require('./controllers/authController.cjs');
const suratMasukController = require('./controllers/suratMasukController.cjs');
const suratKeluarController = require('./controllers/suratKeluarController.cjs');


// 1. Rute Autentikasi
app.post('/api/auth/login', authController.login);
app.get('/api/auth/profile', verifyToken, authController.getProfile);

const userController = require('./controllers/userController.cjs');

// Rute Manajemen User (Khusus ADMIN)
app.get('/api/users', verifyToken, authorizeRoles('ADMIN'), userController.getAllUsers);
app.post('/api/users', verifyToken, authorizeRoles('ADMIN'), userController.createUser);
app.put('/api/users/:id', verifyToken, authorizeRoles('ADMIN'), userController.updateUser);
app.delete('/api/users/:id', verifyToken, authorizeRoles('ADMIN'), userController.deleteUser);

// ==========================================
// 4. RUTE DATA MASTER (BAGIAN, KATEGORI, INSTRUKSI)
// ==========================================

// --- A. MASTER BAGIAN / UNIT KERJA ---
app.get('/api/master_bagian', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM master_bagian ORDER BY id ASC');
    return res.json(rows);
  } catch (error) {
    return res.status(500).json([]);
  }
});

app.post('/api/master_bagian', verifyToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { kode_bagian, nama_bagian } = req.body;
    if (!nama_bagian) return res.status(400).json({ success: false, message: 'Nama unit kerja wajib diisi.' });
    const kode = (kode_bagian || nama_bagian.toUpperCase().replace(/[^A-Z0-9]/g, '_').slice(0, 20)).trim();
    const [result] = await db.query(
      'INSERT INTO master_bagian (kode_bagian, nama_bagian) VALUES (?, ?)',
      [kode, nama_bagian.trim()]
    );
    return res.status(201).json({ success: true, id: result.insertId, kode_bagian: kode, nama_bagian: nama_bagian.trim() });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/master_bagian/:id', verifyToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { kode_bagian, nama_bagian } = req.body;
    await db.query(
      'UPDATE master_bagian SET kode_bagian = ?, nama_bagian = ? WHERE id = ?',
      [kode_bagian.trim(), nama_bagian.trim(), req.params.id]
    );
    return res.json({ success: true, message: 'Unit kerja berhasil diperbarui.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/master_bagian/:id', verifyToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    await db.query('DELETE FROM master_bagian WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Unit kerja berhasil dihapus.' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ success: false, message: 'Unit kerja tidak dapat dihapus karena masih digunakan oleh akun pegawai atau surat.' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
});

// --- B. MASTER KATEGORI SURAT ---
app.get('/api/master_kategori', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM master_kategori ORDER BY id ASC');
    return res.json(rows);
  } catch (error) {
    return res.status(500).json([]);
  }
});

app.post('/api/master_kategori', verifyToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { nama_kategori, keterangan } = req.body;
    if (!nama_kategori) return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });
    const [result] = await db.query(
      'INSERT INTO master_kategori (nama_kategori, keterangan) VALUES (?, ?)',
      [nama_kategori.trim(), keterangan || null]
    );
    return res.status(201).json({ success: true, id: result.insertId, nama_kategori: nama_kategori.trim(), keterangan: keterangan || '' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/master_kategori/:id', verifyToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { nama_kategori, keterangan } = req.body;
    await db.query(
      'UPDATE master_kategori SET nama_kategori = ?, keterangan = ? WHERE id = ?',
      [nama_kategori.trim(), keterangan || null, req.params.id]
    );
    return res.json({ success: true, message: 'Kategori berhasil diperbarui.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/master_kategori/:id', verifyToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    await db.query('DELETE FROM master_kategori WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Kategori berhasil dihapus.' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ success: false, message: 'Kategori tidak dapat dihapus karena masih digunakan oleh data surat.' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
});

// --- C. MASTER INSTRUKSI DISPOSISI ---
app.get('/api/master_instruksi_disposisi', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM master_instruksi_disposisi ORDER BY urutan ASC, id ASC');
    return res.json(rows);
  } catch (error) {
    return res.status(500).json([]);
  }
});

app.post('/api/master_instruksi_disposisi', verifyToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { instruksi } = req.body;
    if (!instruksi) return res.status(400).json({ success: false, message: 'Teks instruksi wajib diisi.' });
    const [[{ nextUrutan }]] = await db.query('SELECT COALESCE(MAX(urutan), 0) + 1 AS nextUrutan FROM master_instruksi_disposisi');
    const [result] = await db.query(
      'INSERT INTO master_instruksi_disposisi (instruksi, urutan) VALUES (?, ?)',
      [instruksi.trim(), nextUrutan]
    );
    return res.status(201).json({ success: true, id: result.insertId, instruksi: instruksi.trim(), urutan: nextUrutan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/master_instruksi_disposisi/:id', verifyToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { instruksi } = req.body;
    await db.query(
      'UPDATE master_instruksi_disposisi SET instruksi = ? WHERE id = ?',
      [instruksi.trim(), req.params.id]
    );
    return res.json({ success: true, message: 'Instruksi disposisi berhasil diperbarui.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/master_instruksi_disposisi/:id', verifyToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    await db.query('DELETE FROM master_instruksi_disposisi WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Instruksi disposisi berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});


app.post('/api/master_bagian', verifyToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { nama_bagian, kode_bagian } = req.body;
    if (!nama_bagian) {
      return res.status(400).json({ success: false, message: 'Nama unit kerja / bagian wajib diisi.' });
    }
    const kode = kode_bagian || nama_bagian.toUpperCase().replace(/[^A-Z0-9]/g, '_').slice(0, 20);
    const [result] = await db.query(
      'INSERT INTO master_bagian (nama_bagian, kode_bagian) VALUES (?, ?)',
      [nama_bagian.trim(), kode]
    );
    return res.status(201).json({
      success: true,
      id: result.insertId,
      nama_bagian: nama_bagian.trim(),
      kode_bagian: kode
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/master_bagian/:id', verifyToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_bagian, kode_bagian } = req.body;
    await db.query(
      'UPDATE master_bagian SET nama_bagian = ?, kode_bagian = COALESCE(?, kode_bagian) WHERE id = ?',
      [nama_bagian.trim(), kode_bagian || null, id]
    );
    return res.json({ success: true, message: 'Unit kerja berhasil diperbarui.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/master_bagian/:id', verifyToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM master_bagian WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Unit kerja berhasil dihapus.' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        success: false,
        message: 'Unit kerja tidak bisa dihapus karena masih digunakan oleh akun pegawai atau data surat.'
      });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
});


// 2. Rute Surat Masuk
app.get('/api/surat_masuk', verifyToken, suratMasukController.getAllSuratMasuk); // atau nama fungsi controller Anda
// Update Status Pengerjaan Surat Masuk oleh Kepala Bagian (Mulai Proses / Selesai)
app.patch('/api/surat-masuk/:id/status-pengerjaan', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status_baru } = req.body;

    if (!status_baru) {
      return res.status(400).json({ success: false, message: 'Status baru wajib diisi.' });
    }

    // Deteksi otomatis nama kolom status pada tabel surat_masuk
    const [cols] = await db.query(
      "SHOW COLUMNS FROM surat_masuk WHERE Field IN ('status_surat', 'status')"
    );
    const statusCol = cols.length > 0 ? cols[0].Field : 'status_surat';

    await db.query(`UPDATE surat_masuk SET ${statusCol} = ? WHERE id = ?`, [status_baru, id]);

    // Sinkronkan juga status pada tabel disposisi jika memiliki kolom status
    try {
      const [dispCols] = await db.query(
        "SHOW COLUMNS FROM disposisi WHERE Field IN ('status_disposisi', 'status_pengerjaan', 'status')"
      );
      if (dispCols.length > 0) {
        await db.query(
          `UPDATE disposisi SET ${dispCols[0].Field} = ? WHERE id_surat_masuk = ?`,
          [status_baru, id]
        );
      }
    } catch (_) { }

    return res.json({
      success: true,
      message: `Status pengerjaan surat berhasil diubah menjadi ${status_baru}.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Rute Surat Keluar
app.get('/api/surat_keluar', verifyToken, suratKeluarController.getAllSuratKeluar); // atau nama fungsi controller Anda

// 2. Rute Surat Masuk (Role-Based)
app.post(
  '/api/surat_masuk',
  verifyToken,
  authorizeRoles('LOKET', 'ADMIN'),
  suratMasukController.inputSuratMasuk
);

app.patch(
  '/api/surat_masuk/:id/verifikasi',
  verifyToken,
  authorizeRoles('SEKRETARIAT', 'ADMIN'),
  suratMasukController.verifikasiSekretariat
);

app.post(
  '/api/surat_masuk/:id/kembalikan-ke-loket',
  verifyToken,
  authorizeRoles('SEKRETARIAT', 'ADMIN'),
  suratMasukController.kembalikanKeLoket
);

app.post(
  '/api/surat_masuk/:id/disposisi',
  verifyToken,
  authorizeRoles('KEPALA_BADAN', 'ADMIN'),
  suratMasukController.buatDisposisi
);

app.patch(
  '/api/surat_masuk/:id/teruskan-ke-bagian',
  verifyToken,
  authorizeRoles('SEKRETARIAT', 'ADMIN'),
  suratMasukController.teruskanKeBagian
);

app.post(
  '/api/surat_masuk/:id/kembalikan-ke-sekretariat',
  verifyToken,
  authorizeRoles('KEPALA_BAGIAN', 'ADMIN'),
  suratMasukController.kembalikanKeSekretariat
);

app.patch(
  '/api/surat_masuk/:id/status-pengerjaan',
  verifyToken,
  authorizeRoles('KEPALA_BAGIAN', 'ADMIN'),
  suratMasukController.updateStatusPengerjaanBagian
);

// 3. Rute Surat Keluar (Role-Based & Versioning)
app.post(
  '/api/surat_keluar',
  verifyToken,
  authorizeRoles('KEPALA_BAGIAN', 'ADMIN'),
  suratKeluarController.buatKonsepSuratKeluar
);

app.patch(
  '/api/surat_keluar/:id/setujui',
  verifyToken,
  authorizeRoles('KEPALA_BADAN', 'ADMIN'),
  suratKeluarController.setujuiSuratKeluar
);

app.post(
  '/api/surat_keluar/:id/kembalikan-revisi',
  verifyToken,
  authorizeRoles('KEPALA_BADAN', 'ADMIN'),
  suratKeluarController.kembalikanUntukRevisi
);

app.post(
  '/api/surat_keluar/:id/upload-revisi',
  verifyToken,
  authorizeRoles('KEPALA_BAGIAN', 'ADMIN'),
  suratKeluarController.uploadRevisiVersiBaru
);

app.patch(
  '/api/surat_keluar/:id/teruskan',
  verifyToken,
  authorizeRoles('SEKRETARIAT', 'ADMIN'),
  suratKeluarController.teruskanKeBagianTujuan
);

app.patch(
  '/api/surat_keluar/:id/terima-bagian',
  verifyToken,
  authorizeRoles('KEPALA_BAGIAN', 'ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;
      await db.query(
        "UPDATE surat_keluar SET status_persetujuan = 'DITERIMA_BAGIAN_TUJUAN' WHERE id = ? AND status_persetujuan = 'DITERUSKAN_KE_BAGIAN_TUJUAN'",
        [id]
      );
      return res.json({
        success: true,
        message: 'Naskah dinas internal berhasil ditandai sudah diterima bagian tujuan.'
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
);

app.patch(
  '/api/surat_masuk/:id/arsip',
  verifyToken,
  authorizeRoles('SEKRETARIAT', 'ADMIN'),
  suratMasukController.arsipkanSuratMasuk
);

app.patch(
  '/api/surat_masuk/:id/batal-arsip',
  verifyToken,
  authorizeRoles('SEKRETARIAT', 'ADMIN'),
  suratMasukController.batalArsipSuratMasuk
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    instansi: 'BKPSDMD Kota Bitung',
    service: 'E-Surat Persuratan API',
    timestamp: new Date().toISOString()
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 [SERVER] Backend API BKPSDMD Persuratan running on port ${PORT}`);
  });
}

module.exports = app;
