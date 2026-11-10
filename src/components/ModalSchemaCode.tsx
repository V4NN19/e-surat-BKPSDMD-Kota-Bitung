/**
 * @file ModalSchemaCode.tsx
 * @description Modal Dokumentasi Skema Basis Data XAMPP <= 7.3 & Arsitektur Backend API
 */

import React, { useState } from 'react';
import {
  X,
  Database,
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  Server,
  Layers,
  FileCode
} from 'lucide-react';

interface ModalSchemaCodeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalSchemaCode: React.FC<ModalSchemaCodeProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'backend' | 'xampp'>('sql');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlSample = `-- SISTEM INFORMASI PERSURATAN BKPSDMD KOTA BITUNG
-- DDL Skema Basis Data MySQL / MariaDB (Kompatibel XAMPP <= 7.3)
-- Engine: InnoDB | Charset: utf8mb4

CREATE TABLE \`master_bagian\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`kode_bagian\` VARCHAR(20) NOT NULL UNIQUE,
  \`nama_bagian\` VARCHAR(150) NOT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`users\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`nama\` VARCHAR(100) NOT NULL,
  \`nip\` VARCHAR(30) DEFAULT NULL,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('LOKET', 'SEKRETARIAT', 'KEPALA_KANTOR', 'KEPALA_BAGIAN', 'ADMIN') NOT NULL,
  \`id_bagian\` INT(11) DEFAULT NULL,
  \`jabatan\` VARCHAR(100) DEFAULT NULL,
  \`status_aktif\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  CONSTRAINT \`fk_users_bagian\` FOREIGN KEY (\`id_bagian\`) REFERENCES \`master_bagian\` (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`surat_masuk\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`no_agenda\` VARCHAR(50) NOT NULL UNIQUE,
  \`asal_surat\` VARCHAR(150) NOT NULL,
  \`no_surat\` VARCHAR(100) NOT NULL,
  \`tgl_surat\` DATE NOT NULL,
  \`perihal\` TEXT NOT NULL,
  \`sifat\` ENUM('Biasa', 'Segera', 'Sangat Segera', 'Rahasia') NOT NULL DEFAULT 'Biasa',
  \`file_pdf\` VARCHAR(255) NOT NULL,
  \`id_kategori\` INT(11) NOT NULL,
  \`id_petugas_loket\` INT(11) NOT NULL,
  \`status_surat\` VARCHAR(50) NOT NULL DEFAULT 'MENUNGGU_VERIFIKASI_SEKRETARIAT',
  \`tgl_input\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`disposisi\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`id_surat_masuk\` INT(11) NOT NULL,
  \`id_bagian_tujuan\` INT(11) NOT NULL,
  \`instruksi\` TEXT NOT NULL,
  \`catatan_kepala\` TEXT DEFAULT NULL,
  \`tgl_disposisi\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`status_disposisi\` ENUM('DIBUAT', 'DITERUSKAN', 'DITERIMA_BAGIAN', 'SELESAI') DEFAULT 'DIBUAT',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`surat_keluar\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`no_draft\` VARCHAR(50) NOT NULL UNIQUE,
  \`jenis_naskah\` ENUM('Nota Dinas', 'Surat Edaran Internal', 'Memo', 'Surat Tugas') NOT NULL,
  \`sifat\` ENUM('Biasa', 'Segera', 'Sangat Segera', 'Rahasia') NOT NULL,
  \`perihal\` VARCHAR(255) NOT NULL,
  \`id_bagian_pengirim\` INT(11) NOT NULL,
  \`id_bagian_tujuan\` INT(11) NOT NULL,
  \`isi_ringkas\` TEXT NOT NULL,
  \`status_persetujuan\` ENUM('PENGAJUAN_KE_KEPALA_KANTOR', 'REVISI', 'DISETUJUI_KEPALA_KANTOR', 'DITERUSKAN_KE_BAGIAN_TUJUAN') NOT NULL,
  \`catatan_revisi_terakhir\` TEXT DEFAULT NULL,
  \`tgl_dibuat\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`surat_keluar_versi_file\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`id_surat_keluar\` INT(11) NOT NULL,
  \`versi_ke\` INT(11) NOT NULL,
  \`nama_file\` VARCHAR(255) NOT NULL,
  \`catatan_revisi\` TEXT DEFAULT NULL,
  \`uploaded_by\` INT(11) DEFAULT NULL,
  \`uploaded_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_surat_versi\` (\`id_surat_keluar\`, \`versi_ke\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`log_aktivitas\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`id_user\` INT(11) DEFAULT NULL,
  \`role\` VARCHAR(50) NOT NULL,
  \`aksi\` VARCHAR(100) NOT NULL,
  \`keterangan\` TEXT NOT NULL,
  \`ip_address\` VARCHAR(45) DEFAULT '127.0.0.1',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([sqlSample], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema_bkpsdmd_bitung.sql';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/30 rounded-lg text-indigo-400 border border-indigo-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                Arsitektur Basis Data (XAMPP &lt;= 7.3) & Backend API
              </h3>
              <p className="text-xs text-slate-400">
                Dokumentasi teknis DDL MySQL/MariaDB InnoDB & Controller Node.js / Express.js
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'sql'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Skema DDL (schema.sql)</span>
          </button>
          <button
            onClick={() => setActiveTab('backend')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'backend'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Struktur Backend & Controller</span>
          </button>
          <button
            onClick={() => setActiveTab('xampp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'xampp'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Petunjuk Import XAMPP 7.3</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 font-mono text-xs text-slate-200">
          {activeTab === 'sql' && (
            <div>
              <div className="flex items-center justify-between mb-3 text-slate-400">
                <span>File: /schema.sql (Kompatibel phpMyAdmin MariaDB 10.1 - 10.4)</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 text-[11px] border border-slate-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin!' : 'Salin SQL'}</span>
                  </button>
                  <button
                    onClick={handleDownloadSql}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded flex items-center gap-1 text-[11px] font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh .SQL</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto text-emerald-400 leading-relaxed">
                {sqlSample}
              </pre>
            </div>
          )}

          {activeTab === 'backend' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2 font-mono">
                  <FileCode className="w-4 h-4 text-indigo-400" />
                  Struktur Direktori Backend Express.js
                </h4>
                <pre className="font-mono text-emerald-400 text-[11px] bg-slate-950 p-3 rounded">
{`/backend
├── config/
│   └── database.js              # MySQL connection pool (XAMPP 3306)
├── controllers/
│   ├── authController.js        # JWT Login, Session check
│   ├── suratMasukController.js  # Auto-agenda AGD/YYYY/MM/XXXX, Multer strictly PDF
│   └── suratKeluarController.js # File versioning v1, v2, approval workflow
├── middleware/
│   └── auth.js                  # verifyToken & authorizeRoles (RBAC)
└── server.js                    # Express app, CORS, static uploads routing`}
                </pre>
              </div>

              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                <h4 className="font-bold text-white text-sm mb-2 font-mono text-indigo-300">
                  3 Aturan Bisnis Inti Backend:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li>
                    <strong>Penomoran Agenda Otomatis:</strong> Generator menghitung surat berjalan per tahun dan membentuk format resmi <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">AGD/YYYY/BULAN_ROMAWI/XXXX</code>.
                  </li>
                  <li>
                    <strong>Versioning Berkas Surat Keluar:</strong> Saat Kepala Kantor meminta revisi, Kepala Bagian mengunggah file baru yang disimpan sebagai record baru di tabel <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">surat_keluar_versi_file</code> (Versi 2, 3, dst.), menjamin file asli v1 tetap utuh.
                  </li>
                  <li>
                    <strong>Otomatisasi Audit Trail:</strong> Setiap endpoint mutasi data secara otomatis menyisipkan rekaman ke tabel <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">log_aktivitas</code> bersama ID user, role, aksi, keterangan, dan IP address.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'xampp' && (
            <div className="space-y-4 font-sans text-xs text-slate-300">
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Langkah Eksekusi di XAMPP &lt;= 7.3 (Windows / Linux):
                </h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Buka <strong>XAMPP Control Panel</strong>, klik tombol <strong>Start</strong> pada modul <strong>Apache</strong> dan <strong>MySQL</strong>.</li>
                  <li>Buka browser dan akses <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-400 font-mono">http://localhost/phpmyadmin</code>.</li>
                  <li>Buat database baru bernama: <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300 font-mono font-bold">bkpsdmd_surat</code> (Collation: <code className="font-mono">utf8mb4_unicode_ci</code>).</li>
                  <li>Pilih database <code className="font-mono">bkpsdmd_surat</code>, lalu klik tab <strong>Import</strong>.</li>
                  <li>Pilih file <code className="font-mono">schema.sql</code> yang telah disediakan di root proyek, kemudian klik tombol <strong>Go / Kirim</strong>.</li>
                  <li>Skema tabel beserta data awal pejabat BKPSDMD Kota Bitung langsung siap digunakan!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Engine: InnoDB | Kompatibel XAMPP 7.1, 7.2, 7.3 (PHP 7.x &amp; MySQL 5.7 / MariaDB 10.1+)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
