/**
 * @file auth.js
 * @description Middleware Autentikasi JWT & Role-Based Access Control (RBAC)
 */

const jwt = require('jsonwebtoken');
const db = require('../config/database.cjs');

const JWT_SECRET = process.env.JWT_SECRET || 'bkpsdmd_bitung_secret_key_2026';

/**
 * Memverifikasi validitas token JWT dari header Authorization: Bearer <token>
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak: Token autentikasi tidak ditemukan.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username, role, id_bagian, nama }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Sesi kedaluwarsa atau token tidak valid. Silakan login kembali.'
    });
  }
};

/**
 * Middleware RBAC: Membatasi akses rute hanya untuk role tertentu
 * @param  {...string} allowedRoles - Contoh: ('ADMIN', 'SEKRETARIAT')
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Hak akses ditolak. Rute ini hanya dapat diakses oleh role: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
};

/**
 * Helper mencatat log audit ke tabel log_aktivitas
 */
const catatLogAktivitas = async ({ userId, role, aksi, keterangan, ipAddress }) => {
  try {
    await db.query(
      `INSERT INTO log_aktivitas (id_user, role, aksi, keterangan, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [userId || null, role, aksi, keterangan, ipAddress || '127.0.0.1']
    );
  } catch (err) {
    console.error('⚠️ Gagal mencatat log_aktivitas:', err.message);
  }
};

module.exports = {
  verifyToken,
  authorizeRoles,
  catatLogAktivitas,
  JWT_SECRET
};
