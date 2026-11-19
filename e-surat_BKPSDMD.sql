-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 19 Nov 2026 pada 03.48
-- Versi server: 10.4.19-MariaDB
-- Versi PHP: 7.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e-surat_BKPSDMD`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `disposisi`
--

CREATE TABLE `disposisi` (
  `id` int(11) NOT NULL,
  `id_surat_masuk` int(11) NOT NULL,
  `id_bagian_tujuan` int(11) NOT NULL,
  `instruksi` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `catatan_kepala` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tgl_disposisi` datetime DEFAULT current_timestamp(),
  `status_disposisi` enum('DIBUAT','DITERUSKAN','DITERIMA_BAGIAN','SELESAI') COLLATE utf8mb4_unicode_ci DEFAULT 'DIBUAT'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `disposisi`
--

INSERT INTO `disposisi` (`id`, `id_surat_masuk`, `id_bagian_tujuan`, `instruksi`, `catatan_kepala`, `tgl_disposisi`, `status_disposisi`) VALUES
(1, 1, 4, '[\"Tindaklanjuti Sesuai Ketentuan Perundang-Undangan\",\"Siapkan Konsep Tanggapan / Balasan\",\"Pelajari, Telaah & Laporkan Hasilnya ke Saya\"]', 'cadck', '2026-11-14 22:49:05', 'SELESAI'),
(2, 2, 5, '[\"Tindaklanjuti Sesuai Ketentuan Perundang-Undangan\"]', NULL, '2026-11-15 10:45:21', 'SELESAI'),
(3, 3, 3, '[\"Hadir Mewakili Kepala Badan & Buat Notulen\",\"Tindaklanjuti Sesuai Ketentuan Perundang-Undangan\"]', NULL, '2026-11-16 12:25:16', 'SELESAI'),
(4, 4, 5, '[\"Tindaklanjuti Sesuai Ketentuan Perundang-Undangan\"]', NULL, '2026-11-16 23:55:14', 'SELESAI'),
(5, 7, 4, '[\"Tindaklanjuti Sesuai Ketentuan Perundang-Undangan\",\"Hadir Mewakili Kepala Badan & Buat Notulen\"]', NULL, '2026-11-18 01:21:47', 'SELESAI'),
(7, 5, 3, '[\"Tindaklanjuti Sesuai Ketentuan Perundang-Undangan\"]', NULL, '2026-11-18 04:00:55', 'SELESAI'),
(8, 5, 5, '[\"Tindaklanjuti Sesuai Ketentuan Perundang-Undangan\"]', NULL, '2026-11-18 04:02:02', 'SELESAI'),
(9, 8, 4, '[\"Tindaklanjuti Sesuai Ketentuan Perundang-Undangan\"]', NULL, '2026-11-18 05:59:16', 'SELESAI'),
(10, 9, 4, '[\"Tindaklanjuti Sesuai Ketentuan Perundang-Undangan\",\"PERTIMBANGKAN / KAJI KEMBALI\",\"LAPORKAN HASILNYA\",\"PROSES SESUAI KETENTUAN\"]', 'lndlnldsz', '2026-11-18 06:02:18', 'SELESAI'),
(11, 10, 3, '[\"Tindaklanjuti Sesuai Ketentuan Perundang-Undangan\",\"KOORDINASIKAN DENGAN INSTANSI TERKAIT\",\"PELAJARI / MONITOR\"]', 'adadvdv', '2026-11-18 06:49:03', 'SELESAI'),
(12, 12, 1, '[\"Tindaklanjuti Sesuai Ketentuan Perundang-Undangan\",\"KOORDINASIKAN DENGAN INSTANSI TERKAIT\",\"WAKILI / HADIRI / WAKILKAN\"]', NULL, '2026-11-18 07:08:03', 'SELESAI'),
(13, 13, 5, '[\"Tindaklanjuti Sesuai Ketentuan Perundang-Undangan\",\"KOORDINASIKAN DENGAN INSTANSI TERKAIT\",\"TINDAKLANJUTI\"]', NULL, '2026-11-18 07:28:57', 'DITERUSKAN'),
(14, 14, 1, '[\"Tindaklanjuti Sesuai Ketentuan Perundang-Undangan\"]', NULL, '2026-11-18 08:35:07', 'SELESAI'),
(15, 16, 5, '[\"Tindaklanjuti Sesuai Ketentuan Perundang-Undangan\",\"KOORDINASIKAN DENGAN INSTANSI TERKAIT\",\"PELAJARI / MONITOR\"]', 'lkjhg', '2026-11-18 10:56:40', 'SELESAI'),
(16, 16, 5, '[\"Tindaklanjuti Sesuai Ketentuan Perundang-Undangan\",\"KOORDINASIKAN DENGAN INSTANSI TERKAIT\",\"PELAJARI / MONITOR\"]', 'lkjhg', '2026-11-18 10:57:03', 'SELESAI'),
(17, 13, 5, '[\"Tindaklanjuti Sesuai Ketentuan Perundang-Undangan\",\"KOORDINASIKAN DENGAN INSTANSI TERKAIT\",\"TINDAKLANJUTI\"]', NULL, '2026-11-18 11:41:17', 'DIBUAT');

-- --------------------------------------------------------

--
-- Struktur dari tabel `log_aktivitas`
--

CREATE TABLE `log_aktivitas` (
  `id` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `aksi` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT '127.0.0.1',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `log_aktivitas`
--

INSERT INTO `log_aktivitas` (`id`, `id_user`, `role`, `aksi`, `keterangan`, `ip_address`, `created_at`) VALUES
(1, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-14 16:50:52'),
(2, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: 0345 dengan No. Agenda: AGD/2026/XI/0001', '::1', '2026-11-14 16:51:17'),
(3, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-14 16:51:30'),
(4, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0001 dan meneruskan ke Kepala Badan', '::1', '2026-11-14 16:51:42'),
(5, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-14 16:51:50'),
(6, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 1 tujuan Bagian ID 2', '::1', '2026-11-14 16:52:18'),
(7, NULL, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-14 16:52:37'),
(8, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-14 16:54:10'),
(9, 13, 'SEKRETARIAT', 'TERUSKAN_KE_BAGIAN', 'Sekretariat meneruskan berkas fisik/digital surat ID 1 ke Kepala Bagian tujuan', '::1', '2026-11-14 16:54:14'),
(10, NULL, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-14 16:54:30'),
(11, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-14 16:55:06'),
(12, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-14 16:56:52'),
(13, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: c1111 dengan No. Agenda: AGD/2026/XI/0002', '::1', '2026-11-14 16:57:18'),
(14, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-14 16:57:25'),
(15, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0002 dan meneruskan ke Kepala Badan', '::1', '2026-11-14 16:57:30'),
(16, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-14 16:57:39'),
(17, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 2 tujuan Bagian ID 2', '::1', '2026-11-14 16:58:44'),
(18, NULL, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-14 16:58:56'),
(19, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-14 17:00:32'),
(20, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 2 tujuan Bagian ID 2', '::1', '2026-11-14 17:01:04'),
(21, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-14 17:01:44'),
(22, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-14 22:46:07'),
(23, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: 0298dhhh dengan No. Agenda: AGD/2026/XI/0001', '::1', '2026-11-14 22:46:41'),
(24, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-14 22:46:59'),
(25, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0001 dan meneruskan ke Kepala Badan', '::1', '2026-11-14 22:48:04'),
(26, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-14 22:48:28'),
(27, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 1 tujuan Bagian ID 4', '::1', '2026-11-14 22:49:05'),
(28, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-14 22:49:22'),
(29, 13, 'SEKRETARIAT', 'TERUSKAN_KE_BAGIAN', 'Sekretariat meneruskan berkas fisik/digital surat ID 1 ke Kepala Bagian tujuan', '::1', '2026-11-14 22:49:26'),
(30, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-14 22:49:44'),
(31, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-14 23:06:12'),
(32, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-14 23:22:29'),
(33, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-14 23:23:56'),
(34, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-15 10:43:56'),
(35, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: faeba9812 dengan No. Agenda: AGD/2026/XI/0002', '::1', '2026-11-15 10:44:26'),
(36, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-15 10:44:38'),
(37, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0002 dan meneruskan ke Kepala Badan', '::1', '2026-11-15 10:44:43'),
(38, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-15 10:44:52'),
(39, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 2 tujuan Bagian ID 5', '::1', '2026-11-15 10:45:21'),
(40, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-15 10:45:31'),
(41, 13, 'SEKRETARIAT', 'TERUSKAN_KE_BAGIAN', 'Sekretariat meneruskan berkas fisik/digital surat ID 2 ke Kepala Bagian tujuan', '::1', '2026-11-15 10:46:04'),
(42, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-15 10:46:14'),
(43, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-15 10:47:36'),
(44, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-15 10:48:46'),
(45, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-15 10:49:19'),
(46, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-15 10:50:04'),
(47, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-15 11:25:00'),
(48, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-15 11:25:54'),
(49, 15, 'KEPALA_BAGIAN', 'BUAT_KONSEP_SURAT_KELUAR', 'Kepala Bagian membuat draft surat keluar: ND/BKPSDMD-PU/2026/0988 (Versi 1) perihal: abcakdsjca', '::1', '2026-11-15 11:29:56'),
(50, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-15 11:30:05'),
(51, NULL, 'KEPALA_BADAN', 'SETUJUI_SURAT_KELUAR', 'Kepala Badan menyetujui draft surat keluar ID 1', '::1', '2026-11-15 11:30:10'),
(52, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-15 11:30:23'),
(53, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-15 11:31:02'),
(54, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-15 11:37:25'),
(55, 13, 'SEKRETARIAT', 'TERUSKAN_SURAT_KELUAR', 'Sekretariat meneruskan surat keluar ID 1 yang telah disetujui ke Bagian Tujuan', '::1', '2026-11-15 11:37:35'),
(56, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-15 11:37:53'),
(57, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-15 11:38:14'),
(58, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-15 11:38:29'),
(59, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-15 11:48:09'),
(60, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-15 11:49:04'),
(61, 15, 'KEPALA_BAGIAN', 'BUAT_KONSEP_SURAT_KELUAR', 'Kepala Bagian membuat draft surat keluar: ND/BKPSDMD-PU/2026/099 (Versi 1) perihal: acbaj', '::1', '2026-11-15 11:49:25'),
(62, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-15 11:49:34'),
(63, NULL, 'KEPALA_BADAN', 'SETUJUI_SURAT_KELUAR', 'Kepala Badan menyetujui draft surat keluar ID 2', '::1', '2026-11-15 11:49:38'),
(64, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-15 11:49:45'),
(65, 13, 'SEKRETARIAT', 'TERUSKAN_SURAT_KELUAR', 'Sekretariat meneruskan surat keluar ID 2 yang telah disetujui ke Bagian Tujuan', '::1', '2026-11-15 11:49:52'),
(66, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-15 11:50:05'),
(67, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-15 11:59:32'),
(68, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-15 12:00:13'),
(69, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-15 20:40:10'),
(70, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-15 20:42:43'),
(71, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-15 20:56:55'),
(72, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-15 20:57:06'),
(73, 16, 'KEPALA_BAGIAN', 'BUAT_KONSEP_SURAT_KELUAR', 'Kepala Bagian membuat draft surat keluar: ND/BKPSDMD-PSDM/2026/099 (Versi 1) perihal: afrarfac', '::1', '2026-11-15 21:42:00'),
(74, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-15 21:42:18'),
(75, NULL, 'KEPALA_BADAN', 'SETUJUI_SURAT_KELUAR', 'Kepala Badan menyetujui draft surat keluar ID 3', '::1', '2026-11-15 21:42:28'),
(76, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-15 21:42:41'),
(77, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-15 21:42:59'),
(78, 13, 'SEKRETARIAT', 'TERUSKAN_SURAT_KELUAR', 'Sekretariat meneruskan surat keluar ID 3 yang telah disetujui ke Bagian Tujuan', '::1', '2026-11-15 21:43:06'),
(79, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-15 21:43:23'),
(80, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-15 21:44:11'),
(81, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-16 12:21:36'),
(82, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: 0999vjhvh dengan No. Agenda: AGD/2026/XI/0003', '::1', '2026-11-16 12:22:41'),
(83, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-16 12:23:02'),
(84, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0003 dan meneruskan ke Kepala Badan', '::1', '2026-11-16 12:23:23'),
(85, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-16 12:23:51'),
(86, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 3 tujuan Bagian ID 3', '::1', '2026-11-16 12:25:16'),
(87, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-16 12:25:34'),
(88, 13, 'SEKRETARIAT', 'TERUSKAN_KE_BAGIAN', 'Sekretariat meneruskan berkas fisik/digital surat ID 3 ke Kepala Bagian tujuan', '::1', '2026-11-16 12:26:01'),
(89, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-16 12:26:19'),
(90, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-16 12:27:14'),
(91, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-16 12:28:46'),
(92, 16, 'KEPALA_BAGIAN', 'BUAT_KONSEP_SURAT_KELUAR', 'Kepala Bagian membuat draft surat keluar: ND/BKPSDMD-PSDM/2026/78y6 (Versi 1) perihal: pembangunan', '::1', '2026-11-16 12:31:27'),
(93, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-16 12:31:36'),
(94, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-16 12:36:55'),
(95, NULL, 'KEPALA_BADAN', 'SETUJUI_SURAT_KELUAR', 'Kepala Badan menyetujui draft surat keluar ID 4', '::1', '2026-11-16 12:37:03'),
(96, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-16 12:37:13'),
(97, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-16 12:37:34'),
(98, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-16 12:38:04'),
(99, 13, 'SEKRETARIAT', 'TERUSKAN_SURAT_KELUAR', 'Sekretariat meneruskan surat keluar ID 4 yang telah disetujui ke Bagian Tujuan', '::1', '2026-11-16 12:38:21'),
(100, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-16 12:38:28'),
(101, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-16 12:52:48'),
(102, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-16 14:00:53'),
(103, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-16 23:38:30'),
(104, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-16 23:52:02'),
(105, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-16 23:52:16'),
(106, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-16 23:52:38'),
(107, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-16 23:52:51'),
(108, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-16 23:53:04'),
(109, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: cadcacff dengan No. Agenda: AGD/2026/XI/0004', '::1', '2026-11-16 23:53:22'),
(110, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-16 23:53:32'),
(111, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0004 dan meneruskan ke Kepala Badan', '::1', '2026-11-16 23:53:50'),
(112, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-16 23:55:02'),
(113, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 4 tujuan Bagian ID 5', '::1', '2026-11-16 23:55:14'),
(114, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-16 23:55:26'),
(115, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-16 23:55:36'),
(116, 13, 'SEKRETARIAT', 'TERUSKAN_KE_BAGIAN', 'Sekretariat meneruskan berkas fisik/digital surat ID 4 ke Kepala Bagian tujuan', '::1', '2026-11-16 23:55:46'),
(117, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-16 23:56:00'),
(118, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-16 23:56:37'),
(119, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-17 13:40:51'),
(120, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: adscadcdc0999 dengan No. Agenda: AGD/2026/XI/0005', '::1', '2026-11-17 13:41:09'),
(121, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-17 13:41:15'),
(122, 13, 'SEKRETARIAT', 'ARSIP_SURAT', 'Mengarsipkan surat masuk ID 4', '::1', '2026-11-17 14:16:26'),
(123, 13, 'SEKRETARIAT', 'BATAL_ARSIP', 'Membatalkan status arsip surat masuk ID 4', '::1', '2026-11-17 14:20:47'),
(124, 13, 'SEKRETARIAT', 'ARSIP_SURAT', 'Mengarsipkan surat masuk ID 4', '::1', '2026-11-17 14:20:55'),
(125, 13, 'SEKRETARIAT', 'BATAL_ARSIP', 'Membatalkan status arsip surat masuk ID 4', '::1', '2026-11-17 14:21:01'),
(126, 13, 'SEKRETARIAT', 'ARSIP_SURAT', 'Mengarsipkan surat masuk ID 4', '::1', '2026-11-17 14:21:08'),
(127, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-17 14:33:16'),
(128, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: fadca dengan No. Agenda: AGD/2026/XI/0006', '::1', '2026-11-17 19:07:38'),
(129, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-17 19:25:28'),
(130, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-17 19:39:44'),
(131, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-17 22:55:55'),
(132, 13, 'SEKRETARIAT', 'KEMBALIKAN_KE_LOKET', 'Sekretariat mengembalikan surat ID 6 ke Loket. Alasan: ulangi', '::1', '2026-11-17 23:50:06'),
(133, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-17 23:50:12'),
(134, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 00:07:13'),
(135, 16, 'KEPALA_BAGIAN', 'BUAT_KONSEP_SURAT_KELUAR', 'Kepala Bagian membuat draft surat keluar: ND/BKPSDMD-PSDM/2026/0876 (Versi 1) perihal: dkjnadlv', '::1', '2026-11-18 00:07:52'),
(136, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 00:08:03'),
(137, NULL, 'KEPALA_BADAN', 'KEMBALIKAN_REVISI_SURAT_KELUAR', 'Kepala Badan meminta revisi draft surat keluar ID 5. Catatan: vava', '::1', '2026-11-18 00:08:22'),
(138, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 00:08:32'),
(139, 16, 'KEPALA_BAGIAN', 'UPLOAD_REVISI_SURAT_KELUAR', 'Kepala Bagian mengunggah berkas revisi Versi 2 untuk surat keluar ID 5', '::1', '2026-11-18 00:08:54'),
(140, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 00:09:07'),
(141, NULL, 'KEPALA_BADAN', 'SETUJUI_SURAT_KELUAR', 'Kepala Badan menyetujui draft surat keluar ID 5', '::1', '2026-11-18 00:20:59'),
(142, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 00:21:11'),
(143, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0005 dan meneruskan ke Kepala Badan', '::1', '2026-11-18 00:21:47'),
(144, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 00:31:52'),
(145, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 01:04:14'),
(146, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: 0998/rri/mdo dengan No. Agenda: AGD/2026/XI/0007', '::1', '2026-11-18 01:06:07'),
(147, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 01:10:18'),
(148, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0007 dan meneruskan ke Kepala Badan', '::1', '2026-11-18 01:10:45'),
(149, 13, 'SEKRETARIAT', 'TERUSKAN_SURAT_KELUAR', 'Sekretariat meneruskan surat keluar ID 5 yang telah disetujui ke Bagian Tujuan', '::1', '2026-11-18 01:13:55'),
(150, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 01:14:04'),
(151, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 01:15:14'),
(152, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 01:15:39'),
(153, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 01:16:09'),
(154, 16, 'KEPALA_BAGIAN', 'BUAT_KONSEP_SURAT_KELUAR', 'Kepala Bagian membuat draft surat keluar: ND/BKPSDMD-PSDM/2026/09975 (Versi 1) perihal: satuduatiga', '::1', '2026-11-18 01:17:06'),
(155, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 01:17:15'),
(156, NULL, 'KEPALA_BADAN', 'SETUJUI_SURAT_KELUAR', 'Kepala Badan menyetujui draft surat keluar ID 6', '::1', '2026-11-18 01:17:27'),
(157, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 01:17:38'),
(158, 13, 'SEKRETARIAT', 'TERUSKAN_SURAT_KELUAR', 'Sekretariat meneruskan surat keluar ID 6 yang telah disetujui ke Bagian Tujuan', '::1', '2026-11-18 01:17:45'),
(159, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 01:17:56'),
(160, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 01:18:21'),
(161, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 01:19:08'),
(162, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 01:20:02'),
(163, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 7 tujuan Bagian ID 4', '::1', '2026-11-18 01:21:47'),
(164, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 01:22:00'),
(165, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 01:22:12'),
(166, 13, 'SEKRETARIAT', 'TERUSKAN_KE_BAGIAN', 'Sekretariat meneruskan berkas fisik/digital surat ID 7 ke Kepala Bagian tujuan', '::1', '2026-11-18 01:22:20'),
(167, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 01:22:28'),
(168, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 01:22:39'),
(169, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 01:23:24'),
(170, 13, 'SEKRETARIAT', 'ARSIP_SURAT', 'Mengarsipkan surat masuk ID 7', '::1', '2026-11-18 01:23:58'),
(171, 13, 'SEKRETARIAT', 'BATAL_ARSIP', 'Membatalkan status arsip surat masuk ID 7', '::1', '2026-11-18 01:24:16'),
(172, 13, 'SEKRETARIAT', 'ARSIP_SURAT', 'Mengarsipkan surat masuk ID 7', '::1', '2026-11-18 01:24:20'),
(173, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 01:25:29'),
(174, 11, 'KEPALA_BAGIAN', 'BUAT_KONSEP_SURAT_KELUAR', 'Kepala Bagian membuat draft surat keluar: ND/BKPSDMD-MIK/2026/0912 (Versi 1) perihal: cadblk', '::1', '2026-11-18 01:26:08'),
(175, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 01:26:25'),
(176, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 01:26:36'),
(177, NULL, 'KEPALA_BADAN', 'KEMBALIKAN_REVISI_SURAT_KELUAR', 'Kepala Badan meminta revisi draft surat keluar ID 7. Catatan: perbaiki lagi', '::1', '2026-11-18 01:27:04'),
(178, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 01:27:11'),
(179, 11, 'KEPALA_BAGIAN', 'UPLOAD_REVISI_SURAT_KELUAR', 'Kepala Bagian mengunggah berkas revisi Versi 2 untuk surat keluar ID 7', '::1', '2026-11-18 01:27:32'),
(180, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 01:27:39'),
(181, NULL, 'KEPALA_BADAN', 'SETUJUI_SURAT_KELUAR', 'Kepala Badan menyetujui draft surat keluar ID 7', '::1', '2026-11-18 01:28:11'),
(182, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 01:28:27'),
(183, 13, 'SEKRETARIAT', 'TERUSKAN_SURAT_KELUAR', 'Sekretariat meneruskan surat keluar ID 7 yang telah disetujui ke Bagian Tujuan', '::1', '2026-11-18 01:28:42'),
(184, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 01:28:51'),
(185, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 01:29:43'),
(186, NULL, 'SEKRETARIAT', 'LOGIN', 'Pengguna andre artantyo (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 01:34:00'),
(187, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 01:34:51'),
(188, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 01:35:05'),
(189, NULL, 'SEKRETARIAT', 'LOGIN', 'Pengguna artantyo (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 01:36:24'),
(190, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 01:36:35'),
(191, NULL, 'SEKRETARIAT', 'LOGIN', 'Pengguna andre (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 01:37:06'),
(192, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 01:37:16'),
(193, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 01:37:48'),
(194, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 01:43:10'),
(195, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 01:44:54'),
(196, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 01:45:58'),
(197, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 01:47:25'),
(198, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 01:54:38'),
(199, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 01:56:22'),
(200, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 02:17:37'),
(201, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 02:17:53'),
(202, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 02:54:28'),
(203, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 03:02:32'),
(204, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 03:22:17'),
(205, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 03:23:34'),
(206, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 03:27:43'),
(207, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 03:27:58'),
(208, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 03:29:00'),
(209, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 03:29:38'),
(210, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 5 tujuan Bagian ID 3', '::1', '2026-11-18 04:00:55'),
(211, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 04:01:17'),
(212, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 04:01:40'),
(213, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 5 tujuan Bagian ID 5', '::1', '2026-11-18 04:02:02'),
(214, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 04:02:18'),
(215, 13, 'SEKRETARIAT', 'TERUSKAN_KE_BAGIAN', 'Sekretariat meneruskan berkas fisik/digital surat ID 5 ke Kepala Bagian tujuan', '::1', '2026-11-18 04:02:33'),
(216, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 04:02:46'),
(217, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 04:03:17'),
(218, 13, 'SEKRETARIAT', 'ARSIP_SURAT', 'Mengarsipkan surat masuk ID 5', '::1', '2026-11-18 04:03:32'),
(219, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 04:04:29'),
(220, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 04:22:25'),
(221, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 04:23:08'),
(222, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 04:23:26'),
(223, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 04:23:43'),
(224, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 04:34:23'),
(225, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 04:34:59'),
(226, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 04:37:14'),
(227, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 05:09:23'),
(228, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 05:58:22'),
(229, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 05:58:34'),
(230, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: cadcad dengan No. Agenda: AGD/2026/XI/0008', '::1', '2026-11-18 05:58:49'),
(231, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 05:58:57'),
(232, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0008 dan meneruskan ke Kepala Badan', '::1', '2026-11-18 05:59:00'),
(233, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 05:59:07'),
(234, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 8 tujuan Bagian ID 4', '::1', '2026-11-18 05:59:16'),
(235, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 05:59:25'),
(236, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 06:00:36'),
(237, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 06:00:49'),
(238, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 06:01:19'),
(239, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: 0912 dengan No. Agenda: AGD/2026/XI/0009', '::1', '2026-11-18 06:01:38'),
(240, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 06:01:45'),
(241, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0009 dan meneruskan ke Kepala Badan', '::1', '2026-11-18 06:01:48'),
(242, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 06:01:56'),
(243, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 9 tujuan Bagian ID 4', '::1', '2026-11-18 06:02:18'),
(244, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 06:02:36'),
(245, 13, 'SEKRETARIAT', 'TERUSKAN_KE_BAGIAN', 'Sekretariat meneruskan berkas fisik/digital surat ID 9 ke Kepala Bagian tujuan', '::1', '2026-11-18 06:21:30'),
(246, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 06:21:46'),
(247, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 06:21:59'),
(248, 13, 'SEKRETARIAT', 'ARSIP_SURAT', 'Mengarsipkan surat masuk ID 9', '::1', '2026-11-18 06:22:09'),
(249, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 06:22:26'),
(250, 16, 'KEPALA_BAGIAN', 'BUAT_KONSEP_SURAT_KELUAR', 'Kepala Bagian membuat draft surat keluar: ND/BKPSDMD-PSDM/2026/0997666 (Versi 1) perihal: adcbadc', '::1', '2026-11-18 06:22:51'),
(251, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 06:22:58'),
(252, NULL, 'KEPALA_BADAN', 'SETUJUI_SURAT_KELUAR', 'Kepala Badan menyetujui draft surat keluar ID 8', '::1', '2026-11-18 06:23:03'),
(253, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 06:23:33'),
(254, 13, 'SEKRETARIAT', 'TERUSKAN_KE_BAGIAN', 'Sekretariat meneruskan berkas fisik/digital surat ID 8 ke Kepala Bagian tujuan', '::1', '2026-11-18 06:23:38'),
(255, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 06:23:47'),
(256, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 06:24:00'),
(257, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 06:29:44'),
(258, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 06:29:57'),
(259, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 06:30:07'),
(260, 11, 'KEPALA_BAGIAN', 'BUAT_KONSEP_SURAT_KELUAR', 'Kepala Bagian membuat draft surat keluar: ND/BKPSDMD-MIK/2026/098889 (Versi 1) perihal: adcbald', '::1', '2026-11-18 06:30:33'),
(261, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 06:30:40'),
(262, NULL, 'KEPALA_BADAN', 'SETUJUI_SURAT_KELUAR', 'Kepala Badan menyetujui draft surat keluar ID 9', '::1', '2026-11-18 06:30:45'),
(263, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 06:31:02'),
(264, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 06:31:26'),
(265, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 06:32:06'),
(266, 11, 'KEPALA_BAGIAN', 'BUAT_KONSEP_SURAT_KELUAR', 'Kepala Bagian membuat draft surat keluar: ND/BKPSDMD-MIK/2026/099eea (Versi 1) perihal: cadca', '::1', '2026-11-18 06:32:52'),
(267, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 06:33:23'),
(268, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 06:33:34'),
(269, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 06:33:41'),
(270, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 06:37:23'),
(271, 13, 'SEKRETARIAT', 'TERUSKAN_SURAT_KELUAR', 'Sekretariat meneruskan surat keluar ID 9 yang telah disetujui ke Bagian Tujuan', '::1', '2026-11-18 06:45:04'),
(272, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 06:45:13'),
(273, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 06:45:27'),
(274, 13, 'SEKRETARIAT', 'TERUSKAN_SURAT_KELUAR', 'Sekretariat meneruskan surat keluar ID 8 yang telah disetujui ke Bagian Tujuan', '::1', '2026-11-18 06:46:29'),
(275, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 06:46:37'),
(276, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 06:46:51'),
(277, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 06:47:58'),
(278, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: cadcad0094r34 dengan No. Agenda: AGD/2026/XI/0010', '::1', '2026-11-18 06:48:20'),
(279, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 06:48:28'),
(280, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0010 dan meneruskan ke Kepala Badan', '::1', '2026-11-18 06:48:30'),
(281, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 06:48:39'),
(282, NULL, 'KEPALA_BADAN', 'SETUJUI_SURAT_KELUAR', 'Kepala Badan menyetujui draft surat keluar ID 10', '::1', '2026-11-18 06:48:44'),
(283, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 10 tujuan Bagian ID 3', '::1', '2026-11-18 06:49:03'),
(284, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 06:49:14'),
(285, 13, 'SEKRETARIAT', 'TERUSKAN_KE_BAGIAN', 'Sekretariat meneruskan berkas fisik/digital surat ID 10 ke Kepala Bagian tujuan', '::1', '2026-11-18 06:49:47'),
(286, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 06:49:58'),
(287, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 06:50:15'),
(288, 13, 'SEKRETARIAT', 'ARSIP_SURAT', 'Mengarsipkan surat masuk ID 10', '::1', '2026-11-18 06:50:22'),
(289, 13, 'SEKRETARIAT', 'TERUSKAN_SURAT_KELUAR', 'Sekretariat meneruskan surat keluar ID 10 yang telah disetujui ke Bagian Tujuan', '::1', '2026-11-18 06:58:19'),
(290, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 06:58:29'),
(291, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 06:58:43'),
(292, 13, 'SEKRETARIAT', 'ARSIP_SURAT', 'Mengarsipkan surat masuk ID 8', '::1', '2026-11-18 06:58:53'),
(293, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 07:03:12'),
(294, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: avbv094 dengan No. Agenda: AGD/2026/XI/0011', '::1', '2026-11-18 07:03:26'),
(295, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 07:03:50'),
(296, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 07:04:14'),
(297, 13, 'SEKRETARIAT', 'KEMBALIKAN_KE_LOKET', 'Sekretariat mengembalikan surat ID 11 ke Loket. Alasan: tes ulang', '::1', '2026-11-18 07:04:33'),
(298, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 07:04:39'),
(299, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: avbv094 dengan No. Agenda: AGD/2026/XI/0012', '::1', '2026-11-18 07:04:55'),
(300, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 07:05:05'),
(301, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0012 dan meneruskan ke Kepala Badan', '::1', '2026-11-18 07:05:35'),
(302, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 07:05:43'),
(303, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 12 tujuan Bagian ID 1', '::1', '2026-11-18 07:08:03'),
(304, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 07:08:11'),
(305, 13, 'SEKRETARIAT', 'TERUSKAN_KE_BAGIAN', 'Sekretariat meneruskan berkas fisik/digital surat ID 12 ke Kepala Bagian tujuan', '::1', '2026-11-18 07:08:19'),
(306, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 07:15:23'),
(307, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 07:16:57'),
(308, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 07:17:35'),
(309, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 07:27:24'),
(310, 16, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JASON MONONIMBAR (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 07:27:32'),
(311, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 07:27:40'),
(312, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 07:27:48'),
(313, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 07:27:54'),
(314, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: cac456 dengan No. Agenda: AGD/2026/XI/0013', '::1', '2026-11-18 07:28:15'),
(315, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 07:28:28'),
(316, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0013 dan meneruskan ke Kepala Badan', '::1', '2026-11-18 07:28:35'),
(317, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 07:28:46'),
(318, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 13 tujuan Bagian ID 5', '::1', '2026-11-18 07:28:57'),
(319, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 07:29:20'),
(320, 13, 'SEKRETARIAT', 'TERUSKAN_KE_BAGIAN', 'Sekretariat meneruskan berkas fisik/digital surat ID 13 ke Kepala Bagian tujuan', '::1', '2026-11-18 07:29:27'),
(321, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 07:29:37'),
(322, 15, 'KEPALA_BAGIAN', 'KEMBALIKAN_KE_SEKRETARIAT', 'Kepala Bagian mengembalikan surat ID 13 ke Sekretariat. Alasan: salah disposisi', '::1', '2026-11-18 07:29:51'),
(323, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 07:29:59'),
(324, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0013 dan meneruskan ke Kepala Badan', '::1', '2026-11-18 07:30:12'),
(325, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 07:30:25'),
(326, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 07:45:18'),
(327, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 08:07:10'),
(328, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: vadva5t3q4 dengan No. Agenda: AGD/2026/XI/0014', '::1', '2026-11-18 08:34:40'),
(329, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 08:34:47'),
(330, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0014 dan meneruskan ke Kepala Badan', '::1', '2026-11-18 08:34:50'),
(331, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 08:34:59'),
(332, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 14 tujuan Bagian ID 1', '::1', '2026-11-18 08:35:07'),
(333, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 08:35:15'),
(334, 13, 'SEKRETARIAT', 'ARSIP_SURAT', 'Mengarsipkan surat masuk ID 14', '::1', '2026-11-18 08:36:54'),
(335, 13, 'SEKRETARIAT', 'ARSIP_SURAT', 'Mengarsipkan surat masuk ID 12', '::1', '2026-11-18 08:36:57'),
(336, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 08:37:10'),
(337, 15, 'KEPALA_BAGIAN', 'BUAT_KONSEP_SURAT_KELUAR', 'Kepala Bagian membuat draft surat keluar: ND/BKPSDMD-PU/2026/099ncb (Versi 1) perihal: kkkk', '::1', '2026-11-18 08:37:36'),
(338, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 08:37:42'),
(339, NULL, 'KEPALA_BADAN', 'SETUJUI_SURAT_KELUAR', 'Kepala Badan menyetujui draft surat keluar ID 11', '::1', '2026-11-18 08:37:47'),
(340, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 08:37:55'),
(341, 13, 'SEKRETARIAT', 'TERUSKAN_SURAT_KELUAR', 'Sekretariat meneruskan surat keluar ID 11 yang telah disetujui ke Bagian Tujuan', '::1', '2026-11-18 08:38:06'),
(342, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 08:38:36'),
(343, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 08:38:49'),
(344, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 10:47:13'),
(345, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: jjhk123 dengan No. Agenda: AGD/2026/XI/0015', '::1', '2026-11-18 10:47:58'),
(346, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 10:48:21'),
(347, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 10:48:44'),
(348, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: 8765hggf dengan No. Agenda: AGD/2026/XI/0016', '::1', '2026-11-18 10:49:11'),
(349, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 10:49:22'),
(350, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0016 dan meneruskan ke Kepala Badan', '::1', '2026-11-18 10:50:01'),
(351, 13, 'SEKRETARIAT', 'KEMBALIKAN_KE_LOKET', 'Sekretariat mengembalikan surat ID 15 ke Loket. Alasan: buat ulang', '::1', '2026-11-18 10:50:16'),
(352, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 10:54:48'),
(353, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 16 tujuan Bagian ID 5', '::1', '2026-11-18 10:56:40'),
(354, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 16 tujuan Bagian ID 5', '::1', '2026-11-18 10:57:03'),
(355, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 11:13:53'),
(356, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: gg/76332 dengan No. Agenda: AGD/2026/XI/0017', '::1', '2026-11-18 11:15:56'),
(357, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 11:19:08'),
(358, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 11:30:12'),
(359, NULL, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Liza Wikarza (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 11:31:46'),
(360, NULL, 'KEPALA_BADAN', 'BUAT_DISPOSISI', 'Kepala Badan membuat lembar disposisi untuk surat ID 13 tujuan Bagian ID 5', '::1', '2026-11-18 11:41:17'),
(361, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 11:41:28'),
(362, 13, 'SEKRETARIAT', 'TERUSKAN_KE_BAGIAN', 'Sekretariat meneruskan berkas fisik/digital surat ID 16 ke Kepala Bagian tujuan', '::1', '2026-11-18 11:41:53'),
(363, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 11:43:03'),
(364, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 12:00:48'),
(365, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 12:03:41'),
(366, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 12:04:22'),
(367, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 12:25:17'),
(368, 11, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna JEAN D\'ARC NGENGET (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 12:26:13'),
(369, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 12:27:18');
INSERT INTO `log_aktivitas` (`id`, `id_user`, `role`, `aksi`, `keterangan`, `ip_address`, `created_at`) VALUES
(370, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 21:34:42'),
(371, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 21:37:35'),
(372, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 21:39:04'),
(373, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 21:43:10'),
(374, 18, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Give Moses (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 21:50:11'),
(375, 15, 'KEPALA_BAGIAN', 'LOGIN', 'Pengguna ECKLEYSIO NANURU (KEPALA_BAGIAN) berhasil login ke sistem', '::1', '2026-11-18 21:52:55'),
(376, 18, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Give Moses (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 22:30:03'),
(377, 14, 'LOKET', 'LOGIN', 'Pengguna MARCOIS SOLEMAN (LOKET) berhasil login ke sistem', '::1', '2026-11-18 22:30:21'),
(378, 14, 'LOKET', 'INPUT_SURAT_MASUK', 'Loket menginput surat masuk no: GG/876/000 dengan No. Agenda: AGD/2026/XI/0018', '::1', '2026-11-18 22:31:05'),
(379, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 22:31:13'),
(380, 13, 'SEKRETARIAT', 'VERIFIKASI_SURAT', 'Sekretariat memverifikasi surat AGD/2026/XI/0018 dan meneruskan ke Kepala Badan', '::1', '2026-11-18 22:31:16'),
(381, 18, 'KEPALA_BADAN', 'LOGIN', 'Pengguna Give Moses (KEPALA_BADAN) berhasil login ke sistem', '::1', '2026-11-18 22:31:24'),
(382, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-18 23:43:11'),
(383, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-18 23:51:36'),
(384, 8, 'ADMIN', 'LOGIN', 'Pengguna Budi Setiawan, S.Kom (ADMIN) berhasil login ke sistem', '::1', '2026-11-19 01:09:51'),
(385, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-19 01:30:10'),
(386, 13, 'SEKRETARIAT', 'LOGIN', 'Pengguna EVAN PONTO (SEKRETARIAT) berhasil login ke sistem', '::1', '2026-11-19 01:42:43');

-- --------------------------------------------------------

--
-- Struktur dari tabel `master_bagian`
--

CREATE TABLE `master_bagian` (
  `id` int(11) NOT NULL,
  `kode_bagian` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_bagian` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `master_bagian`
--

INSERT INTO `master_bagian` (`id`, `kode_bagian`, `nama_bagian`, `created_at`) VALUES
(1, 'SEKR', 'Sekretariat BKPSDMD', '2026-11-11 12:32:04'),
(3, 'MIK', 'Mutasi Dan Informasi Kepegawaian', '2026-11-11 12:32:04'),
(4, 'PSDM', 'Pengembangan Sumber Daya Manusia', '2026-11-11 12:32:04'),
(5, 'PU', 'Pembinaan Umum', '2026-11-11 12:32:04'),
(6, 'LK', 'LOKET', '2026-11-14 22:27:45');

-- --------------------------------------------------------

--
-- Struktur dari tabel `master_instruksi_disposisi`
--

CREATE TABLE `master_instruksi_disposisi` (
  `id` int(11) NOT NULL,
  `instruksi` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `urutan` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `master_instruksi_disposisi`
--

INSERT INTO `master_instruksi_disposisi` (`id`, `instruksi`, `urutan`, `created_at`) VALUES
(1, 'Tindaklanjuti Sesuai Ketentuan Perundang-Undangan', 1, '2026-11-11 12:32:04'),
(2, 'Siapkan Konsep Tanggapan / Balasan', 2, '2026-11-11 12:32:04'),
(3, 'Pelajari, Telaah & Laporkan Hasilnya ke Saya', 3, '2026-11-11 12:32:04'),
(4, 'Hadir Mewakili Kepala Badan & Buat Notulen', 4, '2026-11-11 12:32:04'),
(5, 'Koordinasikan dengan Bidang Terkait', 5, '2026-11-11 12:32:04'),
(6, 'Untuk Diketahui & Arsipkan (UDK)', 6, '2026-11-11 12:32:04'),
(7, 'Fasilitasi & Siapkan Bahan Rapat', 7, '2026-11-11 12:32:04'),
(8, 'Segera Proses Sesuai SOP Pelayanan', 8, '2026-11-11 12:32:04');

-- --------------------------------------------------------

--
-- Struktur dari tabel `master_kategori`
--

CREATE TABLE `master_kategori` (
  `id` int(11) NOT NULL,
  `nama_kategori` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `master_kategori`
--

INSERT INTO `master_kategori` (`id`, `nama_kategori`, `keterangan`, `created_at`) VALUES
(1, 'Undangan Kedinasan', 'Surat undangan rapat, upacara, dan seminar kedinasan', '2026-11-11 12:32:04'),
(2, 'Permohonan Cuti / Mutasi', 'Berkas usulan cuti besar, mutasi antar-OPD atau instansi luar', '2026-11-11 12:32:04'),
(3, 'Laporan Kepegawaian', 'Laporan bulanan/triwulanan dari OPD Kota Bitung', '2026-11-11 12:32:04'),
(4, 'Surat Edaran Walikota/Sekda', 'Edaran resmi Pemerintah Kota Bitung', '2026-11-11 12:32:04'),
(5, 'Pengaduan & Kepegawaian', 'Laporan masyarakat, aduan ASN, atau verifikasi disiplin', '2026-11-11 12:32:04'),
(6, 'Pemberitahuan BKN / KemenPAN-RB', 'Surat dari instansi vertikal pusat / regional', '2026-11-11 12:32:04');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengembalian_surat`
--

CREATE TABLE `pengembalian_surat` (
  `id` int(11) NOT NULL,
  `id_surat_masuk` int(11) NOT NULL,
  `dari_role` enum('SEKRETARIAT','KEPALA_BAGIAN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ke_role` enum('LOKET','SEKRETARIAT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `alasan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tgl_kembali` datetime DEFAULT current_timestamp(),
  `id_user_pengembali` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `pengembalian_surat`
--

INSERT INTO `pengembalian_surat` (`id`, `id_surat_masuk`, `dari_role`, `ke_role`, `alasan`, `tgl_kembali`, `id_user_pengembali`) VALUES
(1, 6, 'SEKRETARIAT', 'LOKET', 'ulangi', '2026-11-17 23:50:06', 13),
(2, 11, 'SEKRETARIAT', 'LOKET', 'tes ulang', '2026-11-18 07:04:33', 13),
(3, 13, 'KEPALA_BAGIAN', 'SEKRETARIAT', 'salah disposisi', '2026-11-18 07:29:51', 15),
(4, 15, 'SEKRETARIAT', 'LOKET', 'buat ulang', '2026-11-18 10:50:16', 13);

-- --------------------------------------------------------

--
-- Struktur dari tabel `surat_keluar`
--

CREATE TABLE `surat_keluar` (
  `id` int(11) NOT NULL,
  `no_draft` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis_naskah` enum('Nota Dinas','Surat Edaran Internal','Memo','Surat Tugas') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Nota Dinas',
  `sifat` enum('Biasa','Segera','Sangat Segera','Rahasia') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Biasa',
  `lampiran` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '1 (Satu) Berkas',
  `perihal` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_bagian_pengirim` int(11) NOT NULL,
  `id_bagian_tujuan` int(11) NOT NULL,
  `isi_ringkas` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_persetujuan` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENGAJUAN_KE_KEPALA_BADAN',
  `catatan_revisi_terakhir` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tgl_dibuat` datetime DEFAULT current_timestamp(),
  `tgl_disetujui` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `surat_keluar`
--

INSERT INTO `surat_keluar` (`id`, `no_draft`, `jenis_naskah`, `sifat`, `lampiran`, `perihal`, `id_bagian_pengirim`, `id_bagian_tujuan`, `isi_ringkas`, `status_persetujuan`, `catatan_revisi_terakhir`, `tgl_dibuat`, `tgl_disetujui`) VALUES
(1, 'ND/BKPSDMD-PU/2026/0988', 'Nota Dinas', 'Biasa', '--', 'abcakdsjca', 5, 4, 'cadcbladc', 'DIARSIPKAN', NULL, '2026-11-15 11:29:56', '2026-11-15 11:30:10'),
(2, 'ND/BKPSDMD-PU/2026/099', 'Nota Dinas', 'Biasa', '--', 'acbaj', 5, 4, 'cacadca', 'DIARSIPKAN', NULL, '2026-11-15 11:49:25', '2026-11-15 11:49:38'),
(3, 'ND/BKPSDMD-PSDM/2026/099', 'Nota Dinas', 'Biasa', '==', 'afrarfac', 4, 3, 'cadcaca', 'DIARSIPKAN', NULL, '2026-11-15 21:42:00', '2026-11-15 21:42:28'),
(4, 'ND/BKPSDMD-PSDM/2026/78y6', 'Surat Edaran Internal', 'Biasa', '--', 'pembangunan', 4, 5, 'fjhfjhcfcj', 'DIARSIPKAN', NULL, '2026-11-16 12:31:27', '2026-11-16 12:37:03'),
(5, 'ND/BKPSDMD-PSDM/2026/0876', 'Nota Dinas', 'Biasa', '--', 'dkjnadlv', 4, 5, 'avkbaldkv', 'DIARSIPKAN', 'vava', '2026-11-18 00:07:52', '2026-11-18 00:20:59'),
(6, 'ND/BKPSDMD-PSDM/2026/09975', 'Surat Edaran Internal', 'Biasa', '--', 'satuduatiga', 4, 5, 'rtu', 'DIARSIPKAN', NULL, '2026-11-18 01:17:06', '2026-11-18 01:17:27'),
(7, 'ND/BKPSDMD-MIK/2026/0912', 'Memo', 'Biasa', '--', 'cadblk', 3, 4, 'babibubebo', 'DIARSIPKAN', 'perbaiki lagi', '2026-11-18 01:26:08', '2026-11-18 01:28:11'),
(8, 'ND/BKPSDMD-PSDM/2026/0997666', 'Nota Dinas', 'Biasa', '--', 'adcbadc', 4, 3, 'cadscad', 'DIARSIPKAN', NULL, '2026-11-18 06:22:51', '2026-11-18 06:23:03'),
(9, 'ND/BKPSDMD-MIK/2026/098889', 'Surat Tugas', 'Biasa', '--', 'adcbald', 3, 5, 'cadca', 'DIARSIPKAN', NULL, '2026-11-18 06:30:33', '2026-11-18 06:30:45'),
(10, 'ND/BKPSDMD-MIK/2026/099eea', 'Memo', 'Biasa', '--', 'cadca', 3, 4, 'vadvadv', 'DIARSIPKAN', NULL, '2026-11-18 06:32:52', '2026-11-18 06:48:44'),
(11, 'ND/BKPSDMD-PU/2026/099ncb', 'Surat Tugas', 'Biasa', '--', 'kkkk', 5, 3, 'va dnc,ad', 'DIARSIPKAN', NULL, '2026-11-18 08:37:36', '2026-11-18 08:37:47');

-- --------------------------------------------------------

--
-- Struktur dari tabel `surat_keluar_versi_file`
--

CREATE TABLE `surat_keluar_versi_file` (
  `id` int(11) NOT NULL,
  `id_surat_keluar` int(11) NOT NULL,
  `versi_ke` int(11) NOT NULL,
  `nama_file` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `catatan_revisi` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `surat_keluar_versi_file`
--

INSERT INTO `surat_keluar_versi_file` (`id`, `id_surat_keluar`, `versi_ke`, `nama_file`, `catatan_revisi`, `uploaded_by`, `uploaded_at`) VALUES
(1, 1, 1, 'SK_1794713396398_502.pdf', 'Draft awal pengajuan konsep naskah', 15, '2026-11-15 11:29:56'),
(2, 2, 1, 'SK_1794714565498_5_Klasifikasi_DT_ID3_new.pdf', 'Draft awal pengajuan konsep naskah', 15, '2026-11-15 11:49:25'),
(3, 3, 1, 'SK_1794750120141_4_Klasifikasi_NB.pdf', 'Draft awal pengajuan konsep naskah', 16, '2026-11-15 21:42:00'),
(4, 4, 1, 'SK_1794803487453_502.pdf', 'Draft awal pengajuan konsep naskah', 16, '2026-11-16 12:31:27'),
(5, 5, 1, 'SK_1794931672661_5_Klasifikasi_DT_ID3_new.pdf', 'Draft awal pengajuan konsep naskah', 16, '2026-11-18 00:07:52'),
(6, 5, 2, 'SK_1794931734724_502.pdf', 'acasdmcn adm', 16, '2026-11-18 00:08:54'),
(7, 6, 1, 'SK_1794935826258_502.pdf', 'Draft awal pengajuan konsep naskah', 16, '2026-11-18 01:17:06'),
(8, 7, 1, 'SK_1794936368488_Analisis_FoMO_dan_Kepuasan_Konsumen_Platform_E_Commerce_Pada_Mahasiswa_Fakultas_Ekonomi_dan_Bisnis_di_Universitas_Klabat___Research_Method__1_.pdf', 'Draft awal pengajuan konsep naskah', 11, '2026-11-18 01:26:08'),
(9, 7, 2, 'SK_1794936452873_artikel_1.pdf', 'sudah pak', 11, '2026-11-18 01:27:32'),
(10, 8, 1, 'SK_1794954171365_artikel_1.pdf', 'Draft awal pengajuan konsep naskah', 16, '2026-11-18 06:22:51'),
(11, 9, 1, 'SK_1794954633062_5_Klasifikasi_DT_ID3_new.pdf', 'Draft awal pengajuan konsep naskah', 11, '2026-11-18 06:30:33'),
(12, 10, 1, 'SK_1794954772627_5_Klasifikasi_DT_ID3_new.pdf', 'Draft awal pengajuan konsep naskah', 11, '2026-11-18 06:32:52'),
(13, 11, 1, 'SK_1794962256808_5_Klasifikasi_DT_ID3_new.pdf', 'Draft awal pengajuan konsep naskah', 15, '2026-11-18 08:37:36');

-- --------------------------------------------------------

--
-- Struktur dari tabel `surat_masuk`
--

CREATE TABLE `surat_masuk` (
  `id` int(11) NOT NULL,
  `no_agenda` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `asal_surat` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_surat` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tgl_surat` date NOT NULL,
  `perihal` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sifat` enum('Biasa','Segera','Sangat Segera','Rahasia') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Biasa',
  `file_pdf` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_kategori` int(11) NOT NULL,
  `id_petugas_loket` int(11) NOT NULL,
  `status_surat` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MENUNGGU_VERIFIKASI_SEKRETARIAT',
  `tgl_input` datetime DEFAULT current_timestamp(),
  `is_arsip` tinyint(1) DEFAULT 0,
  `tgl_arsip` date DEFAULT NULL,
  `keterangan_arsip` text COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `surat_masuk`
--

INSERT INTO `surat_masuk` (`id`, `no_agenda`, `asal_surat`, `no_surat`, `tgl_surat`, `perihal`, `sifat`, `file_pdf`, `id_kategori`, `id_petugas_loket`, `status_surat`, `tgl_input`, `is_arsip`, `tgl_arsip`, `keterangan_arsip`) VALUES
(1, 'AGD/2026/XI/0001', 'De La Salle', '0298dhhh', '2026-11-14', 'dcbakdcb', 'Sangat Segera', 'SM_1794667601257_artikel_1.pdf', 4, 14, 'ARSIP', '2026-11-14 22:46:41', 0, NULL, NULL),
(2, 'AGD/2026/XI/0002', 'afvalc', 'faeba9812', '2026-11-15', 'afalfaec', 'Sangat Segera', 'SM_1794710666436_DFD_Sistem_Berjalan_BKPSDMD_Bitung_v2.pdf', 1, 14, 'ARSIP', '2026-11-15 10:44:26', 0, NULL, NULL),
(3, 'AGD/2026/XI/0003', 'De la salle', '0999vjhvh', '2026-11-16', 'dxhdxhdxhf', 'Sangat Segera', 'SM_1794802961844_Analisis_FoMO_dan_Kepuasan_Konsumen_Platform_E_Commerce_Pada_Mahasiswa_Fakultas_Ekonomi_dan_Bisnis_di_Universitas_Klabat___Research_Method__1_.pdf', 4, 14, 'ARSIP', '2026-11-16 12:22:41', 0, NULL, NULL),
(4, 'AGD/2026/XI/0004', 'acadcad', 'cadcacff', '2026-11-16', 'vafdavav', 'Segera', 'SM_1794844402447_4_Klasifikasi_NB.pdf', 1, 14, 'ARSIP', '2026-11-16 23:53:22', 1, '2026-11-17', '-'),
(5, 'AGD/2026/XI/0005', 'dccad', 'adscadcdc0999', '2026-11-17', 'acadblcabdclka', 'Sangat Segera', 'SM_1794894069356_4_Klasifikasi_NB.pdf', 1, 14, 'ARSIP', '2026-11-17 13:41:09', 1, '2026-11-18', '--'),
(6, 'AGD/2026/XI/0006', 'adcadc', 'fadca', '2026-11-17', 'casdac', 'Biasa', 'SM_1794913658244_5_Klasifikasi_DT_ID3_new.pdf', 1, 14, 'DIKEMBALIKAN_KE_LOKET', '2026-11-17 19:07:38', 0, NULL, NULL),
(7, 'AGD/2026/XI/0007', 'De La Salle Manado', '0998/rri/mdo', '2026-11-18', 'undangan', 'Sangat Segera', 'SM_1794935167479_5_Klasifikasi_DT_ID3_new.pdf', 1, 14, 'ARSIP', '2026-11-18 01:06:07', 1, '2026-11-18', 'Diarsipkan di lemari dokumen BKPSDMD'),
(8, 'AGD/2026/XI/0008', 'aadca', 'cadcad', '2026-11-17', 'cadcadc', 'Sangat Segera', 'SM_1794952729174_5_Klasifikasi_DT_ID3_new.pdf', 1, 14, 'ARSIP', '2026-11-18 05:58:49', 1, '2026-11-18', 'Diarsipkan di lemari dokumen BKPSDMD'),
(9, 'AGD/2026/XI/0009', 'de', '0912', '2026-11-17', 'cadca', 'Sangat Segera', 'SM_1794952898284_5_Klasifikasi_DT_ID3_new.pdf', 3, 14, 'ARSIP', '2026-11-18 06:01:38', 1, '2026-11-18', 'Diarsipkan di lemari dokumen BKPSDMD'),
(10, 'AGD/2026/XI/0010', 'EVAN', 'cadcad0094r34', '2026-11-17', 'dad', 'Sangat Segera', 'SM_1794955700058_502.pdf', 3, 14, 'ARSIP', '2026-11-18 06:48:20', 1, '2026-11-18', '--'),
(11, 'AGD/2026/XI/0011', 'cadsca', 'avbv094', '2026-11-17', 'vadsva', 'Sangat Segera', 'SM_1794956606772_4_Klasifikasi_NB.pdf', 1, 14, 'DIKEMBALIKAN_KE_LOKET', '2026-11-18 07:03:26', 0, NULL, NULL),
(12, 'AGD/2026/XI/0012', 'cadsca', 'avbv094', '2026-11-16', 'vadsva', 'Sangat Segera', 'SM_1794956695422_5_Klasifikasi_DT_ID3_new.pdf', 1, 14, 'ARSIP', '2026-11-18 07:04:55', 1, '2026-11-18', 'Diarsipkan di lemari dokumen BKPSDMD'),
(13, 'AGD/2026/XI/0013', 'cadca', 'cac456', '2026-11-18', 'vadvadv', 'Sangat Segera', 'SM_1794958095885_4_Klasifikasi_NB.pdf', 4, 14, 'DISPOSISI_DIBUAT', '2026-11-18 07:28:15', 0, NULL, NULL),
(14, 'AGD/2026/XI/0014', 'epan', 'vadva5t3q4', '2026-11-18', 'dv ad,v', 'Sangat Segera', 'SM_1794962080593_5_Klasifikasi_DT_ID3_new.pdf', 1, 14, 'ARSIP', '2026-11-18 08:34:40', 1, '2026-11-18', 'Diarsipkan di lemari dokumen BKPSDMD'),
(15, 'AGD/2026/XI/0015', 'Bitung', 'jjhk123', '2026-11-18', 'hgfdsa', 'Sangat Segera', 'SM_1794970078901_5_Klasifikasi_DT_ID3_new.pdf', 5, 14, 'DIKEMBALIKAN_KE_LOKET', '2026-11-18 10:47:58', 0, NULL, NULL),
(16, 'AGD/2026/XI/0016', 'manado', '8765hggf', '2026-11-18', 'kjhg', 'Segera', 'SM_1794970151267_4_Klasifikasi_NB.pdf', 2, 14, 'SELESAI', '2026-11-18 10:49:11', 0, NULL, NULL),
(17, 'AGD/2026/XI/0017', 'Manado', 'gg/76332', '2026-11-18', 'permohonan cuti', 'Sangat Segera', 'SM_1794971756002_artikel_1.pdf', 2, 14, 'MENUNGGU_VERIFIKASI_SEKRETARIAT', '2026-11-18 11:15:56', 0, NULL, NULL),
(18, 'AGD/2026/XI/0018', 'DE LA SALLE MANADO', 'GG/876/000', '2026-11-18', 'LAPORAN KEPEGAWAIAN', 'Sangat Segera', 'SM_1795012265299_4_Klasifikasi_NB.pdf', 3, 14, 'MENUNGGU_DISPOSISI_KEPALA_BADAN', '2026-11-18 22:31:05', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nip` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_bagian` int(11) DEFAULT NULL,
  `jabatan` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_aktif` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `nama`, `nip`, `username`, `password`, `role`, `id_bagian`, `jabatan`, `status_aktif`, `created_at`) VALUES
(8, 'Budi Setiawan, S.Kom', '001', 'budi', '$2b$10$QykTTxJ2Fr7fTCDXFQugyevGFcD/uoAmjxssi2.BfPwnKm0JKAov2', 'ADMIN', NULL, '---', 1, '2026-11-14 14:15:48'),
(11, 'JEAN D\'ARC NGENGET', '039', 'jean', '$2b$10$EM/NCqDjJaHiK9/ixPzcwusKWLPYSa7NoeTABUioTkAYOpnEQoFpi', 'KEPALA_BAGIAN', 3, '--', 1, '2026-11-14 16:46:21'),
(13, 'EVAN PONTO', '045', 'mrcle', '$2b$10$b8YSdV3SK7U2u07MNekXw.7/qZOSceGXog3R3iszajLIQQDJWKI/m', 'SEKRETARIAT', 1, '--', 1, '2026-11-14 16:47:45'),
(14, 'MARCOIS SOLEMAN', '000', 'marco', '$2b$10$QLhXBaMab1bDXSkBHL6bbOQ41ou28pgNEaiEySzoNAX9MgmFeC7xy', 'LOKET', 6, '--', 1, '2026-11-14 16:48:24'),
(15, 'ECKLEYSIO NANURU', '057', 'essan', '$2b$10$3VGKffcjNiSAni7xbtiP1OP84KYboCrE7kUMC7SrFZyxu0VxU9Czi', 'KEPALA_BAGIAN', 5, '--', 1, '2026-11-14 22:29:41'),
(16, 'JASON MONONIMBAR', '044', 'monex', '$2b$10$dTLp2GxiYkQTF92Qzi32yu/cchtozUfcFoVm9OvwyKHZLQJMyaLYG', 'KEPALA_BAGIAN', 4, '--', 1, '2026-11-14 22:45:45'),
(18, 'Give Moses', '001122', 'give', '$2b$10$KUIuao.wYtLn8QNmxoBEJ.Di2bUJHIrkVJAXG14jUyuZx00MeiIPC', 'KEPALA_BADAN', NULL, '--', 1, '2026-11-18 21:45:07');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `disposisi`
--
ALTER TABLE `disposisi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_disposisi_surat` (`id_surat_masuk`),
  ADD KEY `fk_disposisi_bagian` (`id_bagian_tujuan`);

--
-- Indeks untuk tabel `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_log_user` (`id_user`),
  ADD KEY `idx_log_role` (`role`),
  ADD KEY `idx_log_created` (`created_at`);

--
-- Indeks untuk tabel `master_bagian`
--
ALTER TABLE `master_bagian`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_bagian` (`kode_bagian`);

--
-- Indeks untuk tabel `master_instruksi_disposisi`
--
ALTER TABLE `master_instruksi_disposisi`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `master_kategori`
--
ALTER TABLE `master_kategori`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nama_kategori` (`nama_kategori`);

--
-- Indeks untuk tabel `pengembalian_surat`
--
ALTER TABLE `pengembalian_surat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pengembalian_surat` (`id_surat_masuk`),
  ADD KEY `fk_pengembalian_user` (`id_user_pengembali`);

--
-- Indeks untuk tabel `surat_keluar`
--
ALTER TABLE `surat_keluar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `no_draft` (`no_draft`),
  ADD KEY `fk_surat_keluar_pengirim` (`id_bagian_pengirim`),
  ADD KEY `fk_surat_keluar_tujuan` (`id_bagian_tujuan`);

--
-- Indeks untuk tabel `surat_keluar_versi_file`
--
ALTER TABLE `surat_keluar_versi_file`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_surat_versi` (`id_surat_keluar`,`versi_ke`),
  ADD KEY `fk_versi_user` (`uploaded_by`);

--
-- Indeks untuk tabel `surat_masuk`
--
ALTER TABLE `surat_masuk`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `no_agenda` (`no_agenda`),
  ADD KEY `fk_surat_kategori` (`id_kategori`),
  ADD KEY `fk_surat_petugas` (`id_petugas_loket`),
  ADD KEY `idx_status_surat` (`status_surat`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `fk_users_bagian` (`id_bagian`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `disposisi`
--
ALTER TABLE `disposisi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=387;

--
-- AUTO_INCREMENT untuk tabel `master_bagian`
--
ALTER TABLE `master_bagian`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `master_instruksi_disposisi`
--
ALTER TABLE `master_instruksi_disposisi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `master_kategori`
--
ALTER TABLE `master_kategori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `pengembalian_surat`
--
ALTER TABLE `pengembalian_surat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `surat_keluar`
--
ALTER TABLE `surat_keluar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `surat_keluar_versi_file`
--
ALTER TABLE `surat_keluar_versi_file`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `surat_masuk`
--
ALTER TABLE `surat_masuk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `disposisi`
--
ALTER TABLE `disposisi`
  ADD CONSTRAINT `fk_disposisi_bagian` FOREIGN KEY (`id_bagian_tujuan`) REFERENCES `master_bagian` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_disposisi_surat` FOREIGN KEY (`id_surat_masuk`) REFERENCES `surat_masuk` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  ADD CONSTRAINT `fk_log_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pengembalian_surat`
--
ALTER TABLE `pengembalian_surat`
  ADD CONSTRAINT `fk_pengembalian_surat` FOREIGN KEY (`id_surat_masuk`) REFERENCES `surat_masuk` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pengembalian_user` FOREIGN KEY (`id_user_pengembali`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `surat_keluar`
--
ALTER TABLE `surat_keluar`
  ADD CONSTRAINT `fk_surat_keluar_pengirim` FOREIGN KEY (`id_bagian_pengirim`) REFERENCES `master_bagian` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_surat_keluar_tujuan` FOREIGN KEY (`id_bagian_tujuan`) REFERENCES `master_bagian` (`id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `surat_keluar_versi_file`
--
ALTER TABLE `surat_keluar_versi_file`
  ADD CONSTRAINT `fk_versi_surat` FOREIGN KEY (`id_surat_keluar`) REFERENCES `surat_keluar` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_versi_user` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `surat_masuk`
--
ALTER TABLE `surat_masuk`
  ADD CONSTRAINT `fk_surat_kategori` FOREIGN KEY (`id_kategori`) REFERENCES `master_kategori` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_surat_petugas` FOREIGN KEY (`id_petugas_loket`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_bagian` FOREIGN KEY (`id_bagian`) REFERENCES `master_bagian` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
