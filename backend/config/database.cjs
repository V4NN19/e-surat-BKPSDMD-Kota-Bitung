/**
 * @file database.js
 * @description Konfigurasi Koneksi Database MySQL / MariaDB (Kompatibel XAMPP <= 7.3)
 * @author BKPSDMD Kota Bitung TI Persuratan
 */

const mysql = require('mysql2');
require('dotenv').config();

// Konfigurasi koneksi MySQL XAMPP standar (Port 3306, user: root, password: '')
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bkpsdmd_surat',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Helper promise pool untuk sintaks async/await modern
const db = pool.promise();

// Cek status koneksi saat inisialisasi
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ [DATABASE] Gagal terhubung ke MySQL XAMPP:', err.message);
    console.warn('💡 Pastikan modul MySQL di XAMPP Control Panel telah berjalan (Status: Running).');
  } else {
    console.log('✅ [DATABASE] Berhasil terhubung ke database bkpsdmd_surat (XAMPP / MariaDB InnoDB).');
    connection.release();
  }
});

module.exports = db;
