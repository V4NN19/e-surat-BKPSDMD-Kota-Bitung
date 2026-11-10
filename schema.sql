-- ==============================================================================
-- SISTEM INFORMASI PENGELOLAAN SURAT MASUK & KELUAR
-- INSTANSI: BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA DAERAH (BKPSDMD) KOTA BITUNG
-- KOMPATIBILITAS: XAMPP <= 7.3 (MySQL 5.6/5.7 & MariaDB 10.1 - 10.4)
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `log_aktivitas`;
DROP TABLE IF EXISTS `surat_keluar_versi_file`;
DROP TABLE IF EXISTS `surat_keluar`;
DROP TABLE IF EXISTS `pengembalian_surat`;
DROP TABLE IF EXISTS `disposisi`;
DROP TABLE IF EXISTS `surat_masuk`;
DROP TABLE IF EXISTS `master_instruksi_disposisi`;
DROP TABLE IF EXISTS `master_kategori`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `master_bagian`;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- 1. TABEL: master_bagian
-- Menyimpan unit kerja / bidang di lingkungan BKPSDMD Kota Bitung
-- ------------------------------------------------------------------------------
CREATE TABLE `master_bagian` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `kode_bagian` VARCHAR(20) NOT NULL UNIQUE,
  `nama_bagian` VARCHAR(150) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. TABEL: users
-- Pengguna sistem dengan Role-Based Access Control (RBAC)
-- ------------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(100) NOT NULL,
  `nip` VARCHAR(30) DEFAULT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('LOKET', 'SEKRETARIAT', 'KEPALA_KANTOR', 'KEPALA_BAGIAN', 'ADMIN') NOT NULL,
  `id_bagian` INT(11) DEFAULT NULL,
  `jabatan` VARCHAR(100) DEFAULT NULL,
  `status_aktif` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_users_bagian` (`id_bagian`),
  CONSTRAINT `fk_users_bagian` FOREIGN KEY (`id_bagian`) REFERENCES `master_bagian` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. TABEL: master_kategori
-- Kategori jenis surat masuk (Undangan, Permohonan, Nota Dinas, Laporan, dll)
-- ------------------------------------------------------------------------------
CREATE TABLE `master_kategori` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nama_kategori` VARCHAR(100) NOT NULL UNIQUE,
  `keterangan` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. TABEL: master_instruksi_disposisi
-- Standarisasi opsi checklist instruksi disposisi dari Kepala Badan
-- ------------------------------------------------------------------------------
CREATE TABLE `master_instruksi_disposisi` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `instruksi` VARCHAR(200) NOT NULL,
  `urutan` INT(11) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. TABEL: surat_masuk
-- Data surat masuk dari luar/instansi lain yang diinput oleh LOKET
-- Status Alur:
--  - MENUNGGU_VERIFIKASI_SEKRETARIAT
--  - DIKEMBALIKAN_KE_LOKET
--  - MENUNGGU_DISPOSISI_KEPALA_KANTOR
--  - DISPOSISI_DIBUAT
--  - DITERUSKAN_KE_BAGIAN
--  - DIKEMBALIKAN_KE_SEKRETARIAT
--  - SEDANG_DIPROSES
--  - SELESAI
-- ------------------------------------------------------------------------------
CREATE TABLE `surat_masuk` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `no_agenda` VARCHAR(50) NOT NULL UNIQUE,
  `asal_surat` VARCHAR(150) NOT NULL,
  `no_surat` VARCHAR(100) NOT NULL,
  `tgl_surat` DATE NOT NULL,
  `perihal` TEXT NOT NULL,
  `sifat` ENUM('Biasa', 'Segera', 'Sangat Segera', 'Rahasia') NOT NULL DEFAULT 'Biasa',
  `file_pdf` VARCHAR(255) NOT NULL,
  `id_kategori` INT(11) NOT NULL,
  `id_petugas_loket` INT(11) NOT NULL,
  `status_surat` VARCHAR(50) NOT NULL DEFAULT 'MENUNGGU_VERIFIKASI_SEKRETARIAT',
  `tgl_input` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_surat_kategori` (`id_kategori`),
  KEY `fk_surat_petugas` (`id_petugas_loket`),
  KEY `idx_status_surat` (`status_surat`),
  CONSTRAINT `fk_surat_kategori` FOREIGN KEY (`id_kategori`) REFERENCES `master_kategori` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_surat_petugas` FOREIGN KEY (`id_petugas_loket`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. TABEL: disposisi
-- Instruksi lembar disposisi resmi dari Kepala Kantor / Kepala Badan
-- ------------------------------------------------------------------------------
CREATE TABLE `disposisi` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_surat_masuk` INT(11) NOT NULL,
  `id_bagian_tujuan` INT(11) NOT NULL,
  `instruksi` TEXT NOT NULL,
  `catatan_kepala` TEXT DEFAULT NULL,
  `tgl_disposisi` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `status_disposisi` ENUM('DIBUAT', 'DITERUSKAN', 'DITERIMA_BAGIAN', 'SELESAI') DEFAULT 'DIBUAT',
  PRIMARY KEY (`id`),
  KEY `fk_disposisi_surat` (`id_surat_masuk`),
  KEY `fk_disposisi_bagian` (`id_bagian_tujuan`),
  CONSTRAINT `fk_disposisi_surat` FOREIGN KEY (`id_surat_masuk`) REFERENCES `surat_masuk` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_disposisi_bagian` FOREIGN KEY (`id_bagian_tujuan`) REFERENCES `master_bagian` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. TABEL: pengembalian_surat
-- Mencatat riwayat pengembalian:
--  a) Dari Sekretariat ke Loket (berkas rusak / salah input)
--  b) Dari Kepala Bagian ke Sekretariat (salah sasaran disposisi)
-- ------------------------------------------------------------------------------
CREATE TABLE `pengembalian_surat` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_surat_masuk` INT(11) NOT NULL,
  `dari_role` ENUM('SEKRETARIAT', 'KEPALA_BAGIAN') NOT NULL,
  `ke_role` ENUM('LOKET', 'SEKRETARIAT') NOT NULL,
  `alasan` TEXT NOT NULL,
  `tgl_kembali` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `id_user_pengembali` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pengembalian_surat` (`id_surat_masuk`),
  KEY `fk_pengembalian_user` (`id_user_pengembali`),
  CONSTRAINT `fk_pengembalian_surat` FOREIGN KEY (`id_surat_masuk`) REFERENCES `surat_masuk` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pengembalian_user` FOREIGN KEY (`id_user_pengembali`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. TABEL: surat_keluar
-- Konsep surat dinas internal antar-bagian BKPSDMD Kota Bitung
-- ------------------------------------------------------------------------------
CREATE TABLE `surat_keluar` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `no_draft` VARCHAR(50) NOT NULL UNIQUE,
  `jenis_naskah` ENUM('Nota Dinas', 'Surat Edaran Internal', 'Memo', 'Surat Tugas') NOT NULL DEFAULT 'Nota Dinas',
  `sifat` ENUM('Biasa', 'Segera', 'Sangat Segera', 'Rahasia') NOT NULL DEFAULT 'Biasa',
  `lampiran` VARCHAR(100) DEFAULT '1 (Satu) Berkas',
  `perihal` VARCHAR(255) NOT NULL,
  `id_bagian_pengirim` INT(11) NOT NULL,
  `id_bagian_tujuan` INT(11) NOT NULL,
  `isi_ringkas` TEXT NOT NULL,
  `status_persetujuan` ENUM('PENGAJUAN_KE_KEPALA_KANTOR', 'REVISI', 'DISETUJUI_KEPALA_KANTOR', 'DITERUSKAN_KE_BAGIAN_TUJUAN') NOT NULL DEFAULT 'PENGAJUAN_KE_KEPALA_KANTOR',
  `catatan_revisi_terakhir` TEXT DEFAULT NULL,
  `tgl_dibuat` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `tgl_disetujui` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_surat_keluar_pengirim` (`id_bagian_pengirim`),
  KEY `fk_surat_keluar_tujuan` (`id_bagian_tujuan`),
  CONSTRAINT `fk_surat_keluar_pengirim` FOREIGN KEY (`id_bagian_pengirim`) REFERENCES `master_bagian` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_surat_keluar_tujuan` FOREIGN KEY (`id_bagian_tujuan`) REFERENCES `master_bagian` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 9. TABEL: surat_keluar_versi_file
-- Manajemen versioning berkas PDF surat keluar (Versi 1, Versi 2, dst)
-- ------------------------------------------------------------------------------
CREATE TABLE `surat_keluar_versi_file` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_surat_keluar` INT(11) NOT NULL,
  `versi_ke` INT(11) NOT NULL,
  `nama_file` VARCHAR(255) NOT NULL,
  `catatan_revisi` TEXT DEFAULT NULL,
  `uploaded_by` INT(11) DEFAULT NULL,
  `uploaded_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_surat_versi` (`id_surat_keluar`, `versi_ke`),
  KEY `fk_versi_user` (`uploaded_by`),
  CONSTRAINT `fk_versi_surat` FOREIGN KEY (`id_surat_keluar`) REFERENCES `surat_keluar` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_versi_user` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 10. TABEL: log_aktivitas
-- Audit trail menyeluruh untuk setiap perubahan status dan mutasi berkas
-- ------------------------------------------------------------------------------
CREATE TABLE `log_aktivitas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_user` INT(11) DEFAULT NULL,
  `role` VARCHAR(50) NOT NULL,
  `aksi` VARCHAR(100) NOT NULL,
  `keterangan` TEXT NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT '127.0.0.1',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_log_user` (`id_user`),
  KEY `idx_log_role` (`role`),
  KEY `idx_log_created` (`created_at`),
  CONSTRAINT `fk_log_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- DATA AWAL (SEED DATA) RESMI BKPSDMD KOTA BITUNG
-- ==============================================================================

-- 1. Master Bagian / Bidang
INSERT INTO `master_bagian` (`id`, `kode_bagian`, `nama_bagian`) VALUES
(1, 'SEKR', 'Sekretariat BKPSDMD'),
(2, 'PPI', 'Bidang Pengadaan, Pemberhentian dan Informasi'),
(3, 'MUTASI', 'Bidang Mutasi dan Promosi'),
(4, 'BANGKOM', 'Bidang Pengembangan Kompetensi dan Kinerja'),
(5, 'UMUM', 'Sub Bagian Umum dan Kepegawaian');

-- 2. Master Kategori Surat Masuk
INSERT INTO `master_kategori` (`id`, `nama_kategori`, `keterangan`) VALUES
(1, 'Undangan Kedinasan', 'Surat undangan rapat, upacara, dan seminar kedinasan'),
(2, 'Permohonan Cuti / Mutasi', 'Berkas usulan cuti besar, mutasi antar-OPD atau instansi luar'),
(3, 'Laporan Kepegawaian', 'Laporan bulanan/triwulanan dari OPD Kota Bitung'),
(4, 'Surat Edaran Walikota/Sekda', 'Edaran resmi Pemerintah Kota Bitung'),
(5, 'Pengaduan & Kepegawaian', 'Laporan masyarakat, aduan ASN, atau verifikasi disiplin'),
(6, 'Pemberitahuan BKN / KemenPAN-RB', 'Surat dari instansi vertikal pusat / regional');

-- 3. Master Instruksi Disposisi Kepala Kantor
INSERT INTO `master_instruksi_disposisi` (`id`, `instruksi`, `urutan`) VALUES
(1, 'Tindaklanjuti Sesuai Ketentuan Perundang-Undangan', 1),
(2, 'Siapkan Konsep Tanggapan / Balasan', 2),
(3, 'Pelajari, Telaah & Laporkan Hasilnya ke Saya', 3),
(4, 'Hadir Mewakili Kepala Badan & Buat Notulen', 4),
(5, 'Koordinasikan dengan Bidang Terkait', 5),
(6, 'Untuk Diketahui & Arsipkan (UDK)', 6),
(7, 'Fasilitasi & Siapkan Bahan Rapat', 7),
(8, 'Segera Proses Sesuai SOP Pelayanan', 8);

-- 4. Pengguna Awal (Password default hash MD5/bcrypt, plaintext untuk demo: role123)
-- Password plain demo:
-- loket: loket123
-- sekretariat: sekretariat123
-- kepala_kantor: kepala123
-- kabag_mutasi: kabag123
-- kabag_pengadaan: kabag123
-- admin: admin123
INSERT INTO `users` (`id`, `nama`, `nip`, `username`, `password`, `role`, `id_bagian`, `jabatan`, `status_aktif`) VALUES
(1, 'Meidy Manoppo, S.AP', '198506122010011008', 'loket', '$2y$10$wT3wYyPq92B2R8C2qLkWcOF0L66oWfDcmQvM1aDkI33M2h2IeP0zG', 'LOKET', 5, 'Petugas Loket Pelayanan Persuratan', 1),
(2, 'Jenny Rawung, S.Sos', '198203152008012015', 'sekretariat', '$2y$10$wT3wYyPq92B2R8C2qLkWcOF0L66oWfDcmQvM1aDkI33M2h2IeP0zG', 'SEKRETARIAT', 1, 'Sekretaris / Pengadministrasi Persuratan', 1),
(3, 'Forsman Dandel, S.Sos', '197405201994031003', 'kepala_kantor', '$2y$10$wT3wYyPq92B2R8C2qLkWcOF0L66oWfDcmQvM1aDkI33M2h2IeP0zG', 'KEPALA_KANTOR', NULL, 'Kepala BKPSDMD Kota Bitung', 1),
(4, 'Christian Rumbayan, S.STP', '198709142006021002', 'kabag_mutasi', '$2y$10$wT3wYyPq92B2R8C2qLkWcOF0L66oWfDcmQvM1aDkI33M2h2IeP0zG', 'KEPALA_BAGIAN', 3, 'Kepala Bidang Mutasi dan Promosi', 1),
(5, 'Merry Sondakh, SE', '198411252009022004', 'kabag_pengadaan', '$2y$10$wT3wYyPq92B2R8C2qLkWcOF0L66oWfDcmQvM1aDkI33M2h2IeP0zG', 'KEPALA_BAGIAN', 2, 'Kepala Bidang PPI', 1),
(6, 'Dr. Ronald Wowor, M.Si', '198008102005011006', 'kabag_bangkom', '$2y$10$wT3wYyPq92B2R8C2qLkWcOF0L66oWfDcmQvM1aDkI33M2h2IeP0zG', 'KEPALA_BAGIAN', 4, 'Kepala Bidang Bangkom dan Kinerja', 1),
(7, 'Faisal Pangkey, S.Kom', '199204182015031002', 'admin', '$2y$10$wT3wYyPq92B2R8C2qLkWcOF0L66oWfDcmQvM1aDkI33M2h2IeP0zG', 'ADMIN', 1, 'Administrator Pengelola TI Persuratan', 1);

-- 5. Data Sampel Surat Masuk
INSERT INTO `surat_masuk` (`id`, `no_agenda`, `asal_surat`, `no_surat`, `tgl_surat`, `perihal`, `sifat`, `file_pdf`, `id_kategori`, `id_petugas_loket`, `status_surat`, `tgl_input`) VALUES
(1, 'AGD/2026/XI/0001', 'BKN Kantor Regional XI Manado', '104/KR.XI/BKN/XI/2026', '2026-11-01', 'Undangan Rapat Koordinasi Teknis Penetapan NIP PPPK Formasi 2026 Se-Sulut', 'Sangat Segera', 'surat_bkn_rakor_pppk_2026.pdf', 1, 1, 'MENUNGGU_VERIFIKASI_SEKRETARIAT', '2026-11-02 08:30:00'),
(2, 'AGD/2026/XI/0002', 'Dinas Pendidikan & Kebudayaan Kota Bitung', '420/892/DIKBUD-BTG/2026', '2026-11-01', 'Usulan Kenaikan Pangkat Pilihan Periode April 2027 Tenaga Pendidik', 'Segera', 'usulan_kp_guru_dikbud.pdf', 2, 1, 'MENUNGGU_DISPOSISI_KEPALA_KANTOR', '2026-11-02 09:15:00'),
(3, 'AGD/2026/XI/0003', 'Inspektorat Daerah Kota Bitung', '700/041/INSP-BTG/2026', '2026-10-30', 'Laporan Hasil Pemeriksaan Disiplin ASN dan Rekomendasi Sanksi', 'Rahasia', 'lhp_disiplin_asn_insp.pdf', 5, 1, 'DITERUSKAN_KE_BAGIAN', '2026-11-01 11:00:00'),
(4, 'AGD/2026/XI/0004', 'Sekretariat Daerah Kota Bitung', '005/102/SETDA/XI/2026', '2026-10-28', 'Pemberitahuan Upacara Peringatan Hari Pahlawan Tingkat Kota Bitung', 'Biasa', 'upacara_hari_pahlawan_setda.pdf', 4, 1, 'SELESAI', '2026-10-29 14:00:00');

-- 6. Sampel Disposisi
INSERT INTO `disposisi` (`id`, `id_surat_masuk`, `id_bagian_tujuan`, `instruksi`, `catatan_kepala`, `tgl_disposisi`, `status_disposisi`) VALUES
(1, 3, 3, 'Tindaklanjuti Sesuai Ketentuan Perundang-Undangan; Pelajari, Telaah & Laporkan Hasilnya ke Saya', 'Segera siapkan sidang majelis kode etik dan sanksi sesuai PP 94/2021.', '2026-11-02 10:45:00', 'DITERUSKAN'),
(2, 4, 1, 'Untuk Diketahui & Arsipkan (UDK); Hadir Mewakili Kepala Badan & Buat Notulen', 'Kabid Bangkom tugaskan 10 staf untuk regu upacara.', '2026-10-30 09:00:00', 'SELESAI');

-- 7. Sampel Surat Keluar Internal
INSERT INTO `surat_keluar` (`id`, `no_draft`, `jenis_naskah`, `sifat`, `lampiran`, `perihal`, `id_bagian_pengirim`, `id_bagian_tujuan`, `isi_ringkas`, `status_persetujuan`, `catatan_revisi_terakhir`, `tgl_dibuat`, `tgl_disetujui`) VALUES
(1, 'ND/BKPSDMD-MUTASI/2026/089', 'Nota Dinas', 'Segera', '1 (Satu) Berkas', 'Permohonan Data Formasi Kebutuhan Jabatan Fungsional untuk Uji Kompetensi', 3, 2, 'Mohon konfirmasi data kekosongan formasi jabatan fungsional terkini guna dasar pelaksanaan ujian dinas.', 'REVISI', 'Format rincian jabatan tolong disesuaikan dengan nomenklatur MenPAN-RB terbaru tahun 2026.', '2026-11-02 13:00:00', NULL),
(2, 'ND/BKPSDMD-PPI/2026/045', 'Nota Dinas', 'Biasa', '-', 'Penyampaian Rekapitulasi Kehadiran Absensi Online Staf Periode Oktober 2026', 2, 1, 'Penyampaian data rekapitulasi kehadiran staf BKPSDMD untuk keperluan TPP.', 'DISETUJUI_KEPALA_KANTOR', NULL, '2026-11-01 10:00:00', '2026-11-02 14:00:00');

-- 8. Sampel Versi File Surat Keluar
INSERT INTO `surat_keluar_versi_file` (`id`, `id_surat_keluar`, `versi_ke`, `nama_file`, `catatan_revisi`, `uploaded_by`, `uploaded_at`) VALUES
(1, 1, 1, 'draft_nd_mutasi_v1.pdf', 'Draft awal usulan formasi kebutuhan jabatan fungsional', 4, '2026-11-02 13:00:00'),
(2, 2, 1, 'draft_nd_kehadiran_v1.pdf', 'Draft rekap absensi fingerprint & e-kinerja', 5, '2026-11-01 10:00:00');

-- 9. Sampel Log Aktivitas
INSERT INTO `log_aktivitas` (`id`, `id_user`, `role`, `aksi`, `keterangan`, `ip_address`, `created_at`) VALUES
(1, 1, 'LOKET', 'INPUT_SURAT_MASUK', 'Menginput surat masuk nomor 104/KR.XI/BKN/XI/2026 (No. Agenda: AGD/2026/XI/0001)', '192.168.1.101', '2026-11-02 08:30:00'),
(2, 2, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Memverifikasi berkas surat masuk AGD/2026/XI/0002 dan meneruskan ke Kepala Badan', '192.168.1.102', '2026-11-02 09:30:00'),
(3, 3, 'KEPALA_KANTOR', 'BUAT_DISPOSISI', 'Menerbitkan Lembar Disposisi surat AGD/2026/XI/0003 tujuan Bidang Mutasi dan Promosi', '192.168.1.100', '2026-11-02 10:45:00'),
(4, 3, 'KEPALA_KANTOR', 'REVISI_SURAT_KELUAR', 'Mengembalikan draft ND/BKPSDMD-MUTASI/2026/089 dengan catatan revisi', '192.168.1.100', '2026-11-02 14:15:00');
