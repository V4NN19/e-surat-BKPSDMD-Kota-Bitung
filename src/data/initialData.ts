/**
 * @file initialData.ts
 * @description Data Awal & Sampel BKPSDMD Kota Bitung (Persisten via LocalStorage)
 */

import {
  User,
  MasterBagian,
  MasterKategori,
  MasterInstruksiDisposisi,
  SuratMasuk,
  SuratKeluar,
  LogAktivitas
} from '../types';

export const INITIAL_BAGIAN: MasterBagian[] = [
  { id: 1, kode_bagian: 'SEKRETARIAT', nama_bagian: 'Sekretariat BKPSDMD' },
  { id: 2, kode_bagian: 'BAGIAN PENGEMBANGAN SUMBER DAYA MANUSIA', nama_bagian: 'Bagian Pengembangan Sumber Daya Manusia' },
  { id: 3, kode_bagian: 'BAGIAN MUTASI dan INFORMASI KEPEGAWAIAN', nama_bagian: 'Bagian Mutasi dan Informasi Kepegawaian' },
  { id: 4, kode_bagian: 'BAGIAN PEMBINAAN UMUM', nama_bagian: 'Bagian Pembinaan Umum' },
  { id: 5, kode_bagian: 'LOKET', nama_bagian: 'Loket' }
];

export const INITIAL_KATEGORI: MasterKategori[] = [
  { id: 1, nama_kategori: 'Undangan Kedinasan', keterangan: 'Surat undangan rapat, upacara, dan seminar kedinasan' },
  { id: 2, nama_kategori: 'Permohonan Cuti / Mutasi', keterangan: 'Berkas usulan cuti besar, mutasi antar-OPD atau instansi luar' },
  { id: 3, nama_kategori: 'Laporan Kepegawaian', keterangan: 'Laporan bulanan/triwulanan dari OPD Kota Bitung' },
  { id: 4, nama_kategori: 'Surat Edaran Walikota/Sekda', keterangan: 'Edaran resmi Pemerintah Kota Bitung' },
  { id: 5, nama_kategori: 'Pengaduan & Disiplin ASN', keterangan: 'Laporan masyarakat, aduan ASN, atau verifikasi disiplin' },
  { id: 6, nama_kategori: 'Pemberitahuan BKN / MenPAN-RB', keterangan: 'Surat dari instansi pembina kepegawaian pusat / regional' }
];

export const INITIAL_INSTRUKSI: MasterInstruksiDisposisi[] = [
  { id: 1, instruksi: 'Koordinasikan dengan Instansi Terkait', urutan: 1 },
  { id: 2, instruksi: 'Pelajari / Monitor', urutan: 2 },
  { id: 3, instruksi: 'Wakili / Hadiri / Wakilkan', urutan: 3 },
  { id: 4, instruksi: 'Tindaklanjuti', urutan: 4 },
  { id: 5, instruksi: 'Buat Telaahan', urutan: 5 },
  { id: 6, instruksi: 'Pertimbangkan / Kaji Kembali', urutan: 6 },
  { id: 7, instruksi: 'Laporkan Hasilnya', urutan: 7 },
  { id: 8, instruksi: 'Proses Sesuai Ketentuan', urutan: 8 },
  { id: 9, instruksi: 'Pedoman', urutan: 9 },
  { id: 10, instruksi: 'Jadwalkan', urutan: 10 },
  { id: 11, instruksi: 'Persiapkan', urutan: 11 },
  { id: 12, instruksi: 'Untuk Menjadi Perhatian (UMP)', urutan: 12 },
  { id: 13, instruksi: 'Untuk Diketahui (UDK)', urutan: 13 },
  { id: 14, instruksi: 'Siapkan Sambutan', urutan: 14 },
  { id: 15, instruksi: 'Ingatkan', urutan: 15 },
  { id: 16, instruksi: 'Arsip', urutan: 16 }
];

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    nama: 'Meidy Manoppo, S.AP',
    nip: '198506122010011008',
    username: 'loket',
    password: 'loket123',
    role: 'LOKET',
    id_bagian: 5,
    nama_bagian: 'Pembinaan Umum',
    jabatan: 'Petugas Loket Pelayanan Persuratan',
    status_aktif: true,
    created_at: '2026-01-01 08:00:00'
  },
  {
    id: 2,
    nama: 'Jenny Rawung, S.Sos',
    nip: '198203152008012015',
    username: 'sekretariat',
    password: 'sekretariat123',
    role: 'SEKRETARIAT',
    id_bagian: 1,
    nama_bagian: 'Sekretariat BKPSDMD',
    jabatan: 'Sekretaris / Pengadministrasi Persuratan',
    status_aktif: true,
    created_at: '2026-01-01 08:00:00'
  },
  {
    id: 3,
    nama: 'Forsman Dandel, S.Sos',
    nip: '197405201994031003',
    username: 'kepala_kantor',
    password: 'kepala123',
    role: 'KEPALA_BADAN',
    id_bagian: null,
    nama_bagian: 'Pimpinan Badan',
    jabatan: 'Kepala BKPSDMD Kota Bitung',
    status_aktif: true,
    created_at: '2026-01-01 08:00:00'
  },
  {
    id: 4,
    nama: 'Christian Rumbayan, S.STP',
    nip: '198709142006021002',
    username: 'kabag_mutasi',
    password: 'kabag123',
    role: 'KEPALA_BAGIAN',
    id_bagian: 3,
    nama_bagian: 'Bagian Mutasi dan Informasi Kepegawaian',
    jabatan: 'Kepala Bagian Mutasi dan Informasi Kepegawaian',
    status_aktif: true,
    created_at: '2026-01-01 08:00:00'
  },
  {
    id: 5,
    nama: 'Merry Sondakh, SE',
    nip: '198411252009022004',
    username: 'kabag_pengadaan',
    password: 'kabag123',
    role: 'KEPALA_BAGIAN',
    id_bagian: 2,
    nama_bagian: 'Bagian Pengembangan Sumber Daya Manusia',
    jabatan: 'Kepala Bagian Pengembangan Sumber Daya Manusia',
    status_aktif: true,
    created_at: '2026-01-01 08:00:00'
  },

  {
    id: 7,
    nama: 'Faisal Pangkey, S.Kom',
    nip: '199204182015031002',
    username: 'admin',
    password: 'admin123',
    role: 'ADMIN',
    id_bagian: 1,
    nama_bagian: 'Sekretariat BKPSDMD',
    jabatan: 'Administrator Pengelola TI Persuratan',
    status_aktif: true,
    created_at: '2026-01-01 08:00:00'
  }
];

export const INITIAL_SURAT_MASUK: SuratMasuk[] = [
  {
    id: 1,
    no_agenda: 'AGD/2026/XI/0001',
    asal_surat: 'Badan Kepegawaian Negara Kantor Regional XI Manado',
    no_surat: '104/KR.XI/BKN/XI/2026',
    tgl_surat: '2026-11-01',
    perihal: 'Undangan Rapat Koordinasi Teknis Penetapan NIP PPPK Formasi 2026 Se-Sulut',
    sifat: 'Sangat Segera',
    file_pdf: 'surat_bkn_rakor_pppk_2026.pdf',
    id_kategori: 1,
    nama_kategori: 'Undangan Kedinasan',
    id_petugas_loket: 1,
    nama_petugas_loket: 'Meidy Manoppo, S.AP',
    status_surat: 'MENUNGGU_VERIFIKASI_SEKRETARIAT',
    tgl_input: '2026-11-02 08:30:00'
  },
  {
    id: 2,
    no_agenda: 'AGD/2026/XI/0002',
    asal_surat: 'Dinas Pendidikan & Kebudayaan Kota Bitung',
    no_surat: '420/892/DIKBUD-BTG/2026',
    tgl_surat: '2026-11-01',
    perihal: 'Usulan Kenaikan Pangkat Pilihan Periode April 2027 Tenaga Pendidik dan Kependidikan',
    sifat: 'Segera',
    file_pdf: 'usulan_kp_guru_dikbud.pdf',
    id_kategori: 2,
    nama_kategori: 'Permohonan Cuti / Mutasi',
    id_petugas_loket: 1,
    nama_petugas_loket: 'Meidy Manoppo, S.AP',
    status_surat: 'MENUNGGU_DISPOSISI_KEPALA_BADAN',
    tgl_input: '2026-11-02 09:15:00'
  },
  {
    id: 3,
    no_agenda: 'AGD/2026/XI/0003',
    asal_surat: 'Inspektorat Daerah Kota Bitung',
    no_surat: '700/041/INSP-BTG/2026',
    tgl_surat: '2026-10-30',
    perihal: 'Laporan Hasil Pemeriksaan Disiplin ASN dan Rekomendasi Penjatuhan Hukuman Disiplin',
    sifat: 'Rahasia',
    file_pdf: 'lhp_disiplin_asn_insp.pdf',
    id_kategori: 5,
    nama_kategori: 'Pengaduan & Disiplin ASN',
    id_petugas_loket: 1,
    nama_petugas_loket: 'Meidy Manoppo, S.AP',
    status_surat: 'DITERUSKAN_KE_BAGIAN',
    tgl_input: '2026-11-01 11:00:00',
    disposisi: {
      id: 1,
      id_surat_masuk: 3,
      id_bagian_tujuan: 3,
      nama_bagian_tujuan: 'Bidang Mutasi dan Promosi',
      instruksi: [
        'Tindaklanjuti Sesuai Ketentuan Perundang-Undangan',
        'Pelajari, Telaah & Laporkan Hasilnya ke Saya'
      ],
      catatan_kepala: 'Segera siapkan sidang majelis kode etik dan sanksi sesuai PP 94/2021.',
      tgl_disposisi: '2026-11-02 10:45:00',
      status_disposisi: 'DITERUSKAN'
    }
  },
  {
    id: 4,
    no_agenda: 'AGD/2026/XI/0004',
    asal_surat: 'Sekretariat Daerah Kota Bitung',
    no_surat: '005/102/SETDA/XI/2026',
    tgl_surat: '2026-10-28',
    perihal: 'Pemberitahuan Upacara Peringatan Hari Pahlawan Tingkat Kota Bitung',
    sifat: 'Biasa',
    file_pdf: 'upacara_hari_pahlawan_setda.pdf',
    id_kategori: 4,
    nama_kategori: 'Surat Edaran Walikota/Sekda',
    id_petugas_loket: 1,
    nama_petugas_loket: 'Meidy Manoppo, S.AP',
    status_surat: 'SELESAI',
    tgl_input: '2026-10-29 14:00:00',
    disposisi: {
      id: 2,
      id_surat_masuk: 4,
      id_bagian_tujuan: 1,
      nama_bagian_tujuan: 'Sekretariat BKPSDMD',
      instruksi: [
        'Untuk Diketahui & Arsipkan (UDK)',
        'Hadir Mewakili Kepala Badan & Buat Notulen'
      ],
      catatan_kepala: 'Kabid Bangkom tugaskan 10 staf untuk regu upacara.',
      tgl_disposisi: '2026-10-30 09:00:00',
      status_disposisi: 'SELESAI'
    }
  },
  {
    id: 5,
    no_agenda: 'AGD/2026/XI/0005',
    asal_surat: 'Dinas Kesehatan Kota Bitung',
    no_surat: '440/120/DINKES/2026',
    tgl_surat: '2026-10-29',
    perihal: 'Permohonan Ujian Dinas Penyesuaian Ijazah Tenaga Perawat RSUD Pratama',
    sifat: 'Segera',
    file_pdf: 'permohonan_ujian_dinas_dinkes.pdf',
    id_kategori: 2,
    nama_kategori: 'Permohonan Cuti / Mutasi',
    id_petugas_loket: 1,
    nama_petugas_loket: 'Meidy Manoppo, S.AP',
    status_surat: 'DIKEMBALIKAN_KE_LOKET',
    tgl_input: '2026-10-30 10:20:00',
    pengembalian: [
      {
        id: 1,
        id_surat_masuk: 5,
        dari_role: 'SEKRETARIAT',
        ke_role: 'LOKET',
        alasan: 'Lampiran berkas ijazah terpotong pada lembar transkrip nilai, mohon mintakan berkas scan fisik ulang ke pengirim.',
        tgl_kembali: '2026-10-30 11:45:00',
        nama_pengembali: 'Jenny Rawung, S.Sos'
      }
    ]
  },
  {
    id: 6,
    no_agenda: 'AGD/2026/XI/0006',
    asal_surat: 'Kementerian PAN-RB RI',
    no_surat: 'B/789/M.SM.01.00/2026',
    tgl_surat: '2026-10-27',
    perihal: 'Pedoman Penilaian Kinerja ASN Berbasis Output Strategis Tahun Anggaran 2027',
    sifat: 'Biasa',
    file_pdf: 'pedoman_kinerja_kemenpanrb.pdf',
    id_kategori: 6,
    nama_kategori: 'Pemberitahuan BKN / MenPAN-RB',
    id_petugas_loket: 1,
    nama_petugas_loket: 'Meidy Manoppo, S.AP',
    status_surat: 'DIKEMBALIKAN_KE_SEKRETARIAT',
    tgl_input: '2026-10-28 09:10:00',
    disposisi: {
      id: 3,
      id_surat_masuk: 6,
      id_bagian_tujuan: 3, // Semula didisposisi ke Mutasi
      nama_bagian_tujuan: 'Bidang Mutasi dan Promosi',
      instruksi: ['Pelajari, Telaah & Laporkan Hasilnya ke Saya'],
      catatan_kepala: 'Segera pelajari regulasi baru.',
      tgl_disposisi: '2026-10-28 14:00:00',
      status_disposisi: 'DITERIMA_BAGIAN'
    },
    pengembalian: [
      {
        id: 2,
        id_surat_masuk: 6,
        dari_role: 'KEPALA_BAGIAN',
        ke_role: 'SEKRETARIAT',
        alasan: 'Substansi surat terkait pengelolaan kinerja ASN secara tupoksi berada di Bidang Pengembangan Kompetensi dan Kinerja (Bangkom), bukan Bidang Mutasi. Mohon dialihkan disposisinya.',
        tgl_kembali: '2026-10-29 09:30:00',
        nama_pengembali: 'Christian Rumbayan, S.STP'
      }
    ]
  }
];

export const INITIAL_SURAT_KELUAR: SuratKeluar[] = [
  {
    id: 1,
    no_draft: 'ND/BKPSDMD-MUTASI/2026/089',
    jenis_naskah: 'Nota Dinas',
    sifat: 'Segera',
    lampiran: '1 (Satu) Berkas',
    perihal: 'Permohonan Data Formasi Kebutuhan Jabatan Fungsional untuk Uji Kompetensi',
    id_bagian_pengirim: 3,
    nama_bagian_pengirim: 'Bidang Mutasi dan Promosi',
    id_bagian_tujuan: 2,
    nama_bagian_tujuan: 'Bidang Pengadaan, Pemberhentian dan Informasi',
    isi_ringkas: 'Mohon konfirmasi data kekosongan formasi jabatan fungsional terkini pada masing-masing jenjang keahlian guna dasar pelaksanaan ujian dinas dan penyesuaian kenaikan pangkat jabatan fungsional.',
    status_persetujuan: 'REVISI',
    catatan_revisi_terakhir: 'Format rincian tabel jabatan fungsional tolong disesuaikan dengan nomenklatur KemenPAN-RB terbaru tahun 2026 dan sertakan syarat kepangkatan minimal.',
    tgl_dibuat: '2026-11-02 13:00:00',
    versi_file: [
      {
        id: 1,
        id_surat_keluar: 1,
        versi_ke: 1,
        nama_file: 'draft_nd_mutasi_v1.pdf',
        catatan_revisi: 'Draft awal usulan formasi kebutuhan jabatan fungsional',
        uploaded_by: 4,
        nama_uploader: 'Christian Rumbayan, S.STP',
        uploaded_at: '2026-11-02 13:00:00'
      }
    ]
  },
  {
    id: 2,
    no_draft: 'ND/BKPSDMD-PPI/2026/045',
    jenis_naskah: 'Nota Dinas',
    sifat: 'Biasa',
    lampiran: '-',
    perihal: 'Penyampaian Rekapitulasi Kehadiran Absensi Online Staf Periode Oktober 2026',
    id_bagian_pengirim: 2,
    nama_bagian_pengirim: 'Bidang Pengadaan, Pemberhentian dan Informasi',
    id_bagian_tujuan: 1,
    nama_bagian_tujuan: 'Sekretariat BKPSDMD',
    isi_ringkas: 'Penyampaian data rekapitulasi kehadiran staf dan tenaga harian lepas BKPSDMD untuk keperluan verifikasi pembayaran TPP bulan berjalan.',
    status_persetujuan: 'DISETUJUI_KEPALA_BADAN',
    tgl_dibuat: '2026-11-01 10:00:00',
    tgl_disetujui: '2026-11-02 14:00:00',
    versi_file: [
      {
        id: 2,
        id_surat_keluar: 2,
        versi_ke: 1,
        nama_file: 'draft_nd_kehadiran_v1.pdf',
        catatan_revisi: 'Draft rekap absensi fingerprint & e-kinerja',
        uploaded_by: 5,
        nama_uploader: 'Merry Sondakh, SE',
        uploaded_at: '2026-11-01 10:00:00'
      },
      {
        id: 3,
        id_surat_keluar: 2,
        versi_ke: 2,
        nama_file: 'draft_nd_kehadiran_v2_final.pdf',
        catatan_revisi: 'Perbaikan perhitungan cuti tahunan staf subbag umum',
        uploaded_by: 5,
        nama_uploader: 'Merry Sondakh, SE',
        uploaded_at: '2026-11-02 11:30:00'
      }
    ]
  },
  {
    id: 3,
    no_draft: 'MEMO/BKPSDMD-BANGKOM/2026/012',
    jenis_naskah: 'Memo',
    sifat: 'Segera',
    lampiran: 'Jadwal Bimtek',
    perihal: 'Pemberitahuan Sosialisasi Aplikasi E-Kinerja BKN Versi Terbaru',
    id_bagian_pengirim: 4,
    nama_bagian_pengirim: 'Bidang Pengembangan Kompetensi dan Kinerja',
    id_bagian_tujuan: 3,
    nama_bagian_tujuan: 'Bidang Mutasi dan Promosi',
    isi_ringkas: 'Dimohon perwakilan pejabat fungsional Analis SDM Aparatur Bidang Mutasi untuk mengikuti sosialisasi daring fitur integrasi SKP BKN pada tanggal 10 November 2026.',
    status_persetujuan: 'PENGAJUAN_KEPALA_KANTOR' as any,
    tgl_dibuat: '2026-11-03 08:45:00',
    versi_file: [
      {
        id: 4,
        id_surat_keluar: 3,
        versi_ke: 1,
        nama_file: 'draft_memo_bangkom_v1.pdf',
        catatan_revisi: 'Draft memo pengajuan persetujuan Kaban',
        uploaded_by: 6,
        nama_uploader: 'Dr. Ronald Wowor, M.Si',
        uploaded_at: '2026-11-03 08:45:00'
      }
    ]
  }
];

export const INITIAL_LOG_AKTIVITAS: LogAktivitas[] = [
  {
    id: 1,
    id_user: 1,
    nama_user: 'Meidy Manoppo, S.AP',
    role: 'LOKET',
    aksi: 'INPUT_SURAT_MASUK',
    keterangan: 'Loket menginput surat masuk BKN No. 104/KR.XI/BKN/XI/2026 (No. Agenda: AGD/2026/XI/0001)',
    ip_address: '192.168.1.101',
    created_at: '2026-11-02 08:30:00'
  },
  {
    id: 2,
    id_user: 2,
    nama_user: 'Jenny Rawung, S.Sos',
    role: 'SEKRETARIAT',
    aksi: 'VERIFIKASI_SURAT',
    keterangan: 'Sekretariat memverifikasi berkas fisik surat masuk AGD/2026/XI/0002 dan mengajukan ke Kepala Kantor',
    ip_address: '192.168.1.102',
    created_at: '2026-11-02 09:30:00'
  },
  {
    id: 3,
    id_user: 3,
    nama_user: 'Forsman Dandel, S.Sos',
    role: 'KEPALA_BADAN',
    aksi: 'BUAT_DISPOSISI',
    keterangan: 'Kepala Kantor menerbitkan Lembar Disposisi surat AGD/2026/XI/0003 tujuan Bidang Mutasi dan Promosi',
    ip_address: '192.168.1.100',
    created_at: '2026-11-02 10:45:00'
  },
  {
    id: 4,
    id_user: 3,
    nama_user: 'Forsman Dandel, S.Sos',
    role: 'KEPALA_BADAN',
    aksi: 'REVISI_SURAT_KELUAR',
    keterangan: 'Kepala Kantor meminta revisi draft ND/BKPSDMD-MUTASI/2026/089 dengan catatan pembaruan regulasi',
    ip_address: '192.168.1.100',
    created_at: '2026-11-02 14:15:00'
  },
  {
    id: 5,
    id_user: 2,
    nama_user: 'Jenny Rawung, S.Sos',
    role: 'SEKRETARIAT',
    aksi: 'KEMBALIKAN_KE_LOKET',
    keterangan: 'Sekretariat mengembalikan surat AGD/2026/XI/0005 ke Loket karena berkas transkrip terpotong',
    ip_address: '192.168.1.102',
    created_at: '2026-10-30 11:45:00'
  }
];
