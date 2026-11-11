/**
 * @file server.js
 * @description Entry Point API Backend Node.js / Express.js Sistem Persuratan BKPSDMD Kota Bitung
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder untuk PDF Storage
app.use('/uploads/surat_masuk', express.static(path.join(__dirname, '../uploads/surat_masuk')));
app.use('/uploads/surat_keluar', express.static(path.join(__dirname, '../uploads/surat_keluar')));

// Import Controllers & Middleware
const { verifyToken, authorizeRoles } = require('./middleware/auth');
const authController = require('./controllers/authController');
const suratMasukController = require('./controllers/suratMasukController');
const suratKeluarController = require('./controllers/suratKeluarController');

// 1. Rute Autentikasi
app.post('/api/auth/login', authController.login);
app.get('/api/auth/profile', verifyToken, authController.getProfile);

// 2. Rute Surat Masuk (Role-Based)
app.post(
  '/api/surat-masuk',
  verifyToken,
  authorizeRoles('LOKET', 'ADMIN'),
  suratMasukController.inputSuratMasuk
);

app.patch(
  '/api/surat-masuk/:id/verifikasi',
  verifyToken,
  authorizeRoles('SEKRETARIAT', 'ADMIN'),
  suratMasukController.verifikasiSekretariat
);

app.post(
  '/api/surat-masuk/:id/kembalikan-ke-loket',
  verifyToken,
  authorizeRoles('SEKRETARIAT', 'ADMIN'),
  suratMasukController.kembalikanKeLoket
);

app.post(
  '/api/surat-masuk/:id/disposisi',
  verifyToken,
  authorizeRoles('KEPALA_BADAN', 'ADMIN'),
  suratMasukController.buatDisposisi
);

app.patch(
  '/api/surat-masuk/:id/teruskan-ke-bagian',
  verifyToken,
  authorizeRoles('SEKRETARIAT', 'ADMIN'),
  suratMasukController.teruskanKeBagian
);

app.post(
  '/api/surat-masuk/:id/kembalikan-ke-sekretariat',
  verifyToken,
  authorizeRoles('KEPALA_BAGIAN', 'ADMIN'),
  suratMasukController.kembalikanKeSekretariat
);

app.patch(
  '/api/surat-masuk/:id/status-pengerjaan',
  verifyToken,
  authorizeRoles('KEPALA_BAGIAN', 'ADMIN'),
  suratMasukController.updateStatusPengerjaanBagian
);

// 3. Rute Surat Keluar (Role-Based & Versioning)
app.post(
  '/api/surat-keluar',
  verifyToken,
  authorizeRoles('KEPALA_BAGIAN', 'ADMIN'),
  suratKeluarController.buatKonsepSuratKeluar
);

app.patch(
  '/api/surat-keluar/:id/setujui',
  verifyToken,
  authorizeRoles('KEPALA_BADAN', 'ADMIN'),
  suratKeluarController.setujuiSuratKeluar
);

app.post(
  '/api/surat-keluar/:id/kembalikan-revisi',
  verifyToken,
  authorizeRoles('KEPALA_BADAN', 'ADMIN'),
  suratKeluarController.kembalikanUntukRevisi
);

app.post(
  '/api/surat-keluar/:id/upload-revisi',
  verifyToken,
  authorizeRoles('KEPALA_BAGIAN', 'ADMIN'),
  suratKeluarController.uploadRevisiVersiBaru
);

app.patch(
  '/api/surat-keluar/:id/teruskan',
  verifyToken,
  authorizeRoles('SEKRETARIAT', 'ADMIN'),
  suratKeluarController.teruskanKeBagianTujuan
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
