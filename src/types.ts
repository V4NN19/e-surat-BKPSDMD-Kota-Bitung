/**
 * @file types.ts
 * @description Definisi Tipe Data Sistem Informasi Persuratan BKPSDMD Kota Bitung
 */

export type UserRole = 'LOKET' | 'SEKRETARIAT' | 'KEPALA_BADAN' | 'KEPALA_BAGIAN' | 'ADMIN';

export type SifatSurat = 'Biasa' | 'Segera' | 'Sangat Segera' | 'Rahasia';

export type StatusSuratMasuk =
  | 'MENUNGGU_VERIFIKASI_SEKRETARIAT'
  | 'DIKEMBALIKAN_KE_LOKET'
  | 'MENUNGGU_DISPOSISI_KEPALA_BADAN'
  | 'DISPOSISI_DIBUAT'
  | 'DITERUSKAN_KE_BAGIAN'
  | 'DIKEMBALIKAN_KE_SEKRETARIAT'
  | 'SEDANG_DIPROSES'
  | 'SELESAI'
  | 'ARSIP';

export type StatusSuratKeluar =
  | 'PENGAJUAN_KE_KEPALA_BADAN'
  | 'REVISI'
  | 'DISETUJUI_KEPALA_BADAN'
  | 'DITERUSKAN_KE_BAGIAN_TUJUAN';

export interface User {
  id: number;
  nama: string;
  nip?: string;
  username: string;
  password?: string;
  role: UserRole;
  id_bagian?: number | null;
  nama_bagian?: string;
  jabatan: string;
  status_aktif: boolean;
  created_at: string;
}

export interface MasterBagian {
  id: number;
  kode_bagian: string;
  nama_bagian: string;
}

export interface MasterKategori {
  id: number;
  nama_kategori: string;
  keterangan?: string;
}

export interface MasterInstruksiDisposisi {
  id: number;
  instruksi: string;
  urutan: number;
}

export interface SuratMasuk {
  id: number;
  no_agenda: string;
  asal_surat: string;
  no_surat: string;
  tgl_surat: string;
  perihal: string;
  sifat: SifatSurat;
  file_pdf: string;
  file_url?: string;
  id_kategori: number;
  nama_kategori?: string;
  id_petugas_loket: number;
  nama_petugas_loket?: string;
  status_surat: StatusSuratMasuk;
  tgl_input: string;
  // Pengarsipan
  is_arsip?: boolean;
  tgl_arsip?: string;
  keterangan_arsip?: string;
  // Disposisi jika ada
  disposisi?: Disposisi;
  // Riwayat Pengembalian jika ada
  pengembalian?: PengembalianSurat[];
}

export interface Disposisi {
  id: number;
  id_surat_masuk: number;
  id_bagian_tujuan: number;
  nama_bagian_tujuan?: string;
  instruksi: string[]; // checklist instruksi
  catatan_kepala?: string;
  tgl_disposisi: string;
  status_disposisi: 'DIBUAT' | 'DITERUSKAN' | 'DITERIMA_BAGIAN' | 'SELESAI';
}

export interface PengembalianSurat {
  id: number;
  id_surat_masuk: number;
  dari_role: 'SEKRETARIAT' | 'KEPALA_BAGIAN';
  ke_role: 'LOKET' | 'SEKRETARIAT';
  alasan: string;
  tgl_kembali: string;
  nama_pengembali?: string;
}

export interface SuratKeluarVersiFile {
  id: number;
  id_surat_keluar: number;
  versi_ke: number;
  nama_file: string;
  catatan_revisi?: string;
  uploaded_by: number;
  nama_uploader?: string;
  uploaded_at: string;
}

export interface SuratKeluar {
  id: number;
  no_draft: string;
  jenis_naskah: 'Nota Dinas' | 'Surat Edaran Internal' | 'Memo' | 'Surat Tugas';
  sifat: SifatSurat;
  lampiran: string;
  perihal: string;
  id_bagian_pengirim: number;
  nama_bagian_pengirim?: string;
  id_bagian_tujuan: number;
  nama_bagian_tujuan?: string;
  isi_ringkas: string;
  file_url?: string;
  status_persetujuan: StatusSuratKeluar;
  catatan_revisi_terakhir?: string;
  tgl_dibuat: string;
  tgl_disetujui?: string;
  versi_file: SuratKeluarVersiFile[];
}

export interface LogAktivitas {
  id: number;
  id_user: number;
  nama_user: string;
  role: UserRole;
  aksi: string;
  keterangan: string;
  ip_address: string;
  created_at: string;
}
