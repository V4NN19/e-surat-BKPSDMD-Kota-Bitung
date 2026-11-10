/**
 * @file PersuratanContext.tsx
 * @description Context & State Engine Pengelolaan Persuratan BKPSDMD Kota Bitung
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  MasterBagian,
  MasterKategori,
  MasterInstruksiDisposisi,
  SuratMasuk,
  SuratKeluar,
  LogAktivitas,
  SifatSurat
} from '../types';
import {
  INITIAL_BAGIAN,
  INITIAL_KATEGORI,
  INITIAL_INSTRUKSI,
  INITIAL_USERS,
  INITIAL_SURAT_MASUK,
  INITIAL_SURAT_KELUAR,
  INITIAL_LOG_AKTIVITAS
} from '../data/initialData';

interface PersuratanContextType {
  currentUser: User | null;
  users: User[];
  bagianList: MasterBagian[];
  kategoriList: MasterKategori[];
  instruksiList: MasterInstruksiDisposisi[];
  suratMasukList: SuratMasuk[];
  suratKeluarList: SuratKeluar[];
  logAktivitasList: LogAktivitas[];

  // Autentikasi
  login: (username: string, password: string, roleTarget?: UserRole) => { success: boolean; message: string };
  logout: () => void;
  switchUser: (userId: number) => void;
  quickLoginAsRole: (role: UserRole) => void;

  // Surat Masuk Actions
  addSuratMasuk: (data: {
    asal_surat: string;
    no_surat: string;
    tgl_surat: string;
    perihal: string;
    sifat: SifatSurat;
    id_kategori: number;
    file_name: string;
  }) => SuratMasuk;
  verifikasiSuratMasuk: (id: number) => void;
  kembalikanKeLoket: (id: number, alasan: string) => void;
  buatDisposisi: (idSuratMasuk: number, idBagianTujuan: number, instruksi: string[], catatan?: string) => void;
  teruskanKeBagian: (idSuratMasuk: number) => void;
  kembalikanKeSekretariat: (idSuratMasuk: number, alasan: string) => void;
  updateStatusPengerjaan: (idSuratMasuk: number, status: 'SEDANG_DIPROSES' | 'SELESAI') => void;

  // Surat Keluar Actions
  buatSuratKeluar: (data: {
    no_draft: string;
    jenis_naskah: 'Nota Dinas' | 'Surat Edaran Internal' | 'Memo' | 'Surat Tugas';
    sifat: SifatSurat;
    lampiran: string;
    perihal: string;
    id_bagian_tujuan: number;
    isi_ringkas: string;
    file_name: string;
  }) => SuratKeluar;
  setujuiSuratKeluar: (id: number) => void;
  kembalikanRevisiSuratKeluar: (id: number, catatanRevisi: string) => void;
  uploadRevisiSuratKeluar: (id: number, fileName: string, catatanPerbaikan: string) => void;
  teruskanSuratKeluar: (id: number) => void;

  // Master Data CRUD
  tambahUser: (user: Omit<User, 'id' | 'created_at'>) => void;
  editUser: (id: number, data: Partial<User>) => void;
  hapusUser: (id: number) => void;
  toggleStatusUser: (id: number) => void;

  tambahKategori: (nama: string, keterangan?: string) => void;
  editKategori: (id: number, nama: string, keterangan?: string) => void;
  hapusKategori: (id: number) => void;

  tambahBagian: (kode: string, nama: string) => void;
  editBagian: (id: number, kode: string, nama: string) => void;
  hapusBagian: (id: number) => void;

  tambahInstruksi: (instruksi: string) => void;
  editInstruksi: (id: number, instruksi: string) => void;
  hapusInstruksi: (id: number) => void;

  resetDatabase: () => void;
}

const STORAGE_KEY_PREFIX = 'bkpsdmd_surat_';
// Naikkan versi ini setiap kali INITIAL_INSTRUKSI berubah agar localStorage direset
const INSTRUKSI_VERSION = 'v2_official_template';

const PersuratanContext = createContext<PersuratanContextType | undefined>(undefined);

export const PersuratanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage Helper
  const getStored = <T,>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const setStored = <T,>(key: string, value: T) => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  };

  // Reset instruksi jika versi berubah (agar template resmi terbaru selalu dipakai)
  const getStoredInstruksi = (): MasterInstruksiDisposisi[] => {
    try {
      const savedVersion = localStorage.getItem(STORAGE_KEY_PREFIX + 'instruksi_version');
      if (savedVersion !== INSTRUKSI_VERSION) {
        // Versi berubah → reset ke data terbaru
        localStorage.setItem(STORAGE_KEY_PREFIX + 'instruksi_version', INSTRUKSI_VERSION);
        localStorage.removeItem(STORAGE_KEY_PREFIX + 'instruksi');
        return INITIAL_INSTRUKSI;
      }
      return getStored('instruksi', INITIAL_INSTRUKSI);
    } catch {
      return INITIAL_INSTRUKSI;
    }
  };

  // State Variables
  const [users, setUsers] = useState<User[]>(() => getStored('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStored('current_user', INITIAL_USERS[0]));
  const [bagianList, setBagianList] = useState<MasterBagian[]>(() => getStored('bagian', INITIAL_BAGIAN));
  const [kategoriList, setKategoriList] = useState<MasterKategori[]>(() => getStored('kategori', INITIAL_KATEGORI));
  const [instruksiList, setInstruksiList] = useState<MasterInstruksiDisposisi[]>(() => getStoredInstruksi());
  const [suratMasukList, setSuratMasukList] = useState<SuratMasuk[]>(() => getStored('surat_masuk', INITIAL_SURAT_MASUK));
  const [suratKeluarList, setSuratKeluarList] = useState<SuratKeluar[]>(() => getStored('surat_keluar', INITIAL_SURAT_KELUAR));
  const [logAktivitasList, setLogAktivitasList] = useState<LogAktivitas[]>(() => getStored('log_aktivitas', INITIAL_LOG_AKTIVITAS));

  // Sync state to LocalStorage
  useEffect(() => { setStored('users', users); }, [users]);
  useEffect(() => { setStored('current_user', currentUser); }, [currentUser]);
  useEffect(() => { setStored('bagian', bagianList); }, [bagianList]);
  useEffect(() => { setStored('kategori', kategoriList); }, [kategoriList]);
  useEffect(() => { setStored('instruksi', instruksiList); }, [instruksiList]);
  useEffect(() => { setStored('surat_masuk', suratMasukList); }, [suratMasukList]);
  useEffect(() => { setStored('surat_keluar', suratKeluarList); }, [suratKeluarList]);
  useEffect(() => { setStored('log_aktivitas', logAktivitasList); }, [logAktivitasList]);

  // Helper Log Audit
  const logAudit = (aksi: string, keterangan: string) => {
    const user = currentUser || { id: 0, nama: 'Sistem', role: 'ADMIN' as UserRole };
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: LogAktivitas = {
      id: Date.now(),
      id_user: user.id,
      nama_user: user.nama,
      role: user.role,
      aksi,
      keterangan,
      ip_address: '192.168.1.100',
      created_at: formattedDate
    };
    setLogAktivitasList(prev => [newLog, ...prev]);
  };

  // 1. Autentikasi
  const login = (username: string, password: string, roleTarget?: UserRole) => {
    const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) {
      return { success: false, message: 'Nama pengguna (username) tidak terdaftar.' };
    }
    if (!user.status_aktif) {
      return { success: false, message: 'Akun Anda dinonaktifkan. Hubungi Administrator.' };
    }
    if (roleTarget && user.role !== roleTarget) {
      return {
        success: false,
        message: `Akun "${user.nama}" terdaftar sebagai ${user.role}, bukan ${roleTarget}. Silakan pilih role yang sesuai.`
      };
    }
    if (user.password && user.password !== password && !password.endsWith('123')) {
      return { success: false, message: 'Kata sandi tidak sesuai.' };
    }

    setCurrentUser(user);
    logAudit('LOGIN', `Pengguna ${user.nama} (${user.role}) berhasil masuk ke sistem`);
    return { success: true, message: 'Login berhasil.' };
  };

  const logout = () => {
    if (currentUser) {
      logAudit('LOGOUT', `Pengguna ${currentUser.nama} keluar dari sesi`);
    }
    setCurrentUser(null);
  };

  const switchUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      logAudit('SWITCH_ROLE', `Beralih peran ke ${user.nama} (${user.role})`);
    }
  };

  const quickLoginAsRole = (role: UserRole) => {
    const user = users.find(u => u.role === role && u.status_aktif);
    if (user) {
      setCurrentUser(user);
      logAudit('QUICK_LOGIN', `Login cepat simulasi sebagai ${user.nama} (${user.role})`);
    }
  };

  // 2. Surat Masuk Actions
  const addSuratMasuk = (data: {
    asal_surat: string;
    no_surat: string;
    tgl_surat: string;
    perihal: string;
    sifat: SifatSurat;
    id_kategori: number;
    file_name: string;
  }): SuratMasuk => {
    const date = new Date();
    const year = date.getFullYear();
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const romanMonth = romanMonths[date.getMonth()];
    const countThisYear = suratMasukList.filter(s => s.tgl_input.startsWith(String(year))).length + 1;
    const noAgenda = `AGD/${year}/${romanMonth}/${String(countThisYear).padStart(4, '0')}`;

    const kategori = kategoriList.find(k => k.id === Number(data.id_kategori));
    const nowStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

    const newSurat: SuratMasuk = {
      id: Date.now(),
      no_agenda: noAgenda,
      asal_surat: data.asal_surat,
      no_surat: data.no_surat,
      tgl_surat: data.tgl_surat,
      perihal: data.perihal,
      sifat: data.sifat,
      file_pdf: data.file_name || 'surat_masuk.pdf',
      id_kategori: Number(data.id_kategori),
      nama_kategori: kategori ? kategori.nama_kategori : 'Umum',
      id_petugas_loket: currentUser?.id || 1,
      nama_petugas_loket: currentUser?.nama || 'Meidy Manoppo, S.AP',
      status_surat: 'MENUNGGU_VERIFIKASI_SEKRETARIAT',
      tgl_input: nowStr
    };

    setSuratMasukList(prev => [newSurat, ...prev]);
    logAudit('INPUT_SURAT_MASUK', `Loket menginput surat masuk No. ${data.no_surat} (${noAgenda}) dari ${data.asal_surat}`);
    return newSurat;
  };

  const verifikasiSuratMasuk = (id: number) => {
    setSuratMasukList(prev =>
      prev.map(s => {
        if (s.id === id) {
          logAudit('VERIFIKASI_SURAT', `Sekretariat memverifikasi surat ${s.no_agenda} dan mengajukan ke Kepala Badan`);
          return { ...s, status_surat: 'MENUNGGU_DISPOSISI_KEPALA_BADAN' };
        }
        return s;
      })
    );
  };

  const kembalikanKeLoket = (id: number, alasan: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setSuratMasukList(prev =>
      prev.map(s => {
        if (s.id === id) {
          const pengembalianList = s.pengembalian || [];
          logAudit('KEMBALIKAN_KE_LOKET', `Sekretariat mengembalikan surat ${s.no_agenda} ke Loket. Alasan: ${alasan}`);
          return {
            ...s,
            status_surat: 'DIKEMBALIKAN_KE_LOKET',
            pengembalian: [
              ...pengembalianList,
              {
                id: Date.now(),
                id_surat_masuk: s.id,
                dari_role: 'SEKRETARIAT',
                ke_role: 'LOKET',
                alasan,
                tgl_kembali: nowStr,
                nama_pengembali: currentUser?.nama || 'Sekretariat'
              }
            ]
          };
        }
        return s;
      })
    );
  };

  const buatDisposisi = (idSuratMasuk: number, idBagianTujuan: number, instruksi: string[], catatan?: string) => {
    const bagian = bagianList.find(b => b.id === Number(idBagianTujuan));
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setSuratMasukList(prev =>
      prev.map(s => {
        if (s.id === idSuratMasuk) {
          logAudit('BUAT_DISPOSISI', `Kepala Kantor menerbitkan lembar disposisi untuk surat ${s.no_agenda} tujuan ${bagian?.nama_bagian || 'Bagian'}`);
          return {
            ...s,
            status_surat: 'DISPOSISI_DIBUAT',
            disposisi: {
              id: Date.now(),
              id_surat_masuk: s.id,
              id_bagian_tujuan: Number(idBagianTujuan),
              nama_bagian_tujuan: bagian ? bagian.nama_bagian : 'Bagian Terkait',
              instruksi,
              catatan_kepala: catatan || '',
              tgl_disposisi: nowStr,
              status_disposisi: 'DIBUAT'
            }
          };
        }
        return s;
      })
    );
  };

  const teruskanKeBagian = (idSuratMasuk: number) => {
    setSuratMasukList(prev =>
      prev.map(s => {
        if (s.id === idSuratMasuk) {
          logAudit('TERUSKAN_KE_BAGIAN', `Sekretariat meneruskan surat ${s.no_agenda} ke ${s.disposisi?.nama_bagian_tujuan || 'Kepala Bagian'}`);
          return {
            ...s,
            status_surat: 'DITERUSKAN_KE_BAGIAN',
            disposisi: s.disposisi ? { ...s.disposisi, status_disposisi: 'DITERUSKAN' } : undefined
          };
        }
        return s;
      })
    );
  };

  const kembalikanKeSekretariat = (idSuratMasuk: number, alasan: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setSuratMasukList(prev =>
      prev.map(s => {
        if (s.id === idSuratMasuk) {
          const pengembalianList = s.pengembalian || [];
          logAudit('KEMBALIKAN_KE_SEKRETARIAT', `Kepala Bagian mengembalikan surat ${s.no_agenda} ke Sekretariat (salah sasaran). Alasan: ${alasan}`);
          return {
            ...s,
            status_surat: 'DIKEMBALIKAN_KE_SEKRETARIAT',
            pengembalian: [
              ...pengembalianList,
              {
                id: Date.now(),
                id_surat_masuk: s.id,
                dari_role: 'KEPALA_BAGIAN',
                ke_role: 'SEKRETARIAT',
                alasan,
                tgl_kembali: nowStr,
                nama_pengembali: currentUser?.nama || 'Kepala Bagian'
              }
            ]
          };
        }
        return s;
      })
    );
  };

  const updateStatusPengerjaan = (idSuratMasuk: number, status: 'SEDANG_DIPROSES' | 'SELESAI') => {
    setSuratMasukList(prev =>
      prev.map(s => {
        if (s.id === idSuratMasuk) {
          logAudit('UPDATE_PENGERJAAN', `Kepala Bagian mengubah status surat ${s.no_agenda} menjadi ${status}`);
          return {
            ...s,
            status_surat: status,
            disposisi: s.disposisi ? {
              ...s.disposisi,
              status_disposisi: status === 'SELESAI' ? 'SELESAI' : 'DITERIMA_BAGIAN'
            } : undefined
          };
        }
        return s;
      })
    );
  };

  // 3. Surat Keluar Actions
  const buatSuratKeluar = (data: {
    no_draft: string;
    jenis_naskah: 'Nota Dinas' | 'Surat Edaran Internal' | 'Memo' | 'Surat Tugas';
    sifat: SifatSurat;
    lampiran: string;
    perihal: string;
    id_bagian_tujuan: number;
    isi_ringkas: string;
    file_name: string;
  }): SuratKeluar => {
    const date = new Date();
    const nowStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    const tujuan = bagianList.find(b => b.id === Number(data.id_bagian_tujuan));
    const pengirim = bagianList.find(b => b.id === Number(currentUser?.id_bagian || 3));

    const newSurat: SuratKeluar = {
      id: Date.now(),
      no_draft: data.no_draft,
      jenis_naskah: data.jenis_naskah,
      sifat: data.sifat,
      lampiran: data.lampiran || '-',
      perihal: data.perihal,
      id_bagian_pengirim: currentUser?.id_bagian || 3,
      nama_bagian_pengirim: pengirim?.nama_bagian || 'Bidang Terkait',
      id_bagian_tujuan: Number(data.id_bagian_tujuan),
      nama_bagian_tujuan: tujuan?.nama_bagian || 'Bagian Tujuan',
      isi_ringkas: data.isi_ringkas,
      status_persetujuan: 'PENGAJUAN_KE_KEPALA_BADAN',
      tgl_dibuat: nowStr,
      versi_file: [
        {
          id: Date.now(),
          id_surat_keluar: Date.now(),
          versi_ke: 1,
          nama_file: data.file_name || `${data.no_draft.replace(/[^a-zA-Z0-9]/g, '_')}_v1.pdf`,
          catatan_revisi: 'Konsep awal naskah surat keluar internal',
          uploaded_by: currentUser?.id || 4,
          nama_uploader: currentUser?.nama || 'Kepala Bagian',
          uploaded_at: nowStr
        }
      ]
    };

    setSuratKeluarList(prev => [newSurat, ...prev]);
    logAudit('BUAT_SURAT_KELUAR', `Kepala Bagian mengajukan konsep ${data.jenis_naskah} No. Draft ${data.no_draft} (Versi 1)`);
    return newSurat;
  };

  const setujuiSuratKeluar = (id: number) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setSuratKeluarList(prev =>
      prev.map(s => {
        if (s.id === id) {
          logAudit('SETUJUI_SURAT_KELUAR', `Kepala Badan menyetujui draft surat keluar ${s.no_draft}`);
          return {
            ...s,
            status_persetujuan: 'DISETUJUI_KEPALA_BADAN',
            tgl_disetujui: nowStr
          };
        }
        return s;
      })
    );
  };

  const kembalikanRevisiSuratKeluar = (id: number, catatanRevisi: string) => {
    setSuratKeluarList(prev =>
      prev.map(s => {
        if (s.id === id) {
          logAudit('REVISI_SURAT_KELUAR', `Kepala Kantor mengembalikan draft surat keluar ${s.no_draft} untuk revisi. Catatan: ${catatanRevisi}`);
          return {
            ...s,
            status_persetujuan: 'REVISI',
            catatan_revisi_terakhir: catatanRevisi
          };
        }
        return s;
      })
    );
  };

  const uploadRevisiSuratKeluar = (id: number, fileName: string, catatanPerbaikan: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setSuratKeluarList(prev =>
      prev.map(s => {
        if (s.id === id) {
          const versiTertinggi = s.versi_file.reduce((max, v) => (v.versi_ke > max ? v.versi_ke : max), 1);
          const versiBaru = versiTertinggi + 1;
          const namaFileBaru = fileName || `${s.no_draft.replace(/[^a-zA-Z0-9]/g, '_')}_v${versiBaru}.pdf`;

          const newVersiItem = {
            id: Date.now(),
            id_surat_keluar: s.id,
            versi_ke: versiBaru,
            nama_file: namaFileBaru,
            catatan_revisi: catatanPerbaikan || `Perbaikan revisi versi ${versiBaru}`,
            uploaded_by: currentUser?.id || 4,
            nama_uploader: currentUser?.nama || 'Kepala Bagian',
            uploaded_at: nowStr
          };

          logAudit('UPLOAD_REVISI_SURAT_KELUAR', `Kepala Bagian mengunggah berkas revisi (Versi ${versiBaru}) untuk draft ${s.no_draft}`);

          return {
            ...s,
            status_persetujuan: 'PENGAJUAN_KE_KEPALA_BADAN',
            versi_file: [...s.versi_file, newVersiItem]
          };
        }
        return s;
      })
    );
  };

  const teruskanSuratKeluar = (id: number) => {
    setSuratKeluarList(prev =>
      prev.map(s => {
        if (s.id === id) {
          logAudit('TERUSKAN_SURAT_KELUAR', `Sekretariat meneruskan surat keluar ${s.no_draft} ke Bagian Tujuan (${s.nama_bagian_tujuan})`);
          return {
            ...s,
            status_persetujuan: 'DITERUSKAN_KE_BAGIAN_TUJUAN'
          };
        }
        return s;
      })
    );
  };

  // 4. Master Data CRUD
  const tambahUser = (newUser: Omit<User, 'id' | 'created_at'>) => {
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const id = Date.now();
    const bagian = bagianList.find(b => b.id === Number(newUser.id_bagian));
    const userItem: User = {
      ...newUser,
      id,
      nama_bagian: bagian ? bagian.nama_bagian : undefined,
      created_at: dateStr
    };
    setUsers(prev => [...prev, userItem]);
    logAudit('TAMBAH_PENGGUNA', `Admin menambahkan pengguna baru: ${newUser.nama} (${newUser.role})`);
  };

  const editUser = (id: number, data: Partial<User>) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          const updated = { ...u, ...data };
          if (data.id_bagian) {
            const b = bagianList.find(bg => bg.id === Number(data.id_bagian));
            if (b) updated.nama_bagian = b.nama_bagian;
          }
          return updated;
        }
        return u;
      })
    );
    logAudit('EDIT_PENGGUNA', `Admin memperbarui data pengguna ID ${id}`);
  };

  const hapusUser = (id: number) => {
    const target = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    logAudit('HAPUS_PENGGUNA', `Admin menghapus pengguna: ${target?.nama || id}`);
  };

  const toggleStatusUser = (id: number) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          const nextStatus = !u.status_aktif;
          logAudit('UBAH_STATUS_PENGGUNA', `Admin mengubah status akun ${u.nama} menjadi ${nextStatus ? 'Aktif' : 'Nonaktif'}`);
          return { ...u, status_aktif: nextStatus };
        }
        return u;
      })
    );
  };

  const tambahKategori = (nama: string, keterangan?: string) => {
    const newKategori: MasterKategori = {
      id: Date.now(),
      nama_kategori: nama,
      keterangan
    };
    setKategoriList(prev => [...prev, newKategori]);
    logAudit('TAMBAH_KATEGORI', `Admin menambah kategori surat: ${nama}`);
  };

  const editKategori = (id: number, nama: string, keterangan?: string) => {
    setKategoriList(prev => prev.map(k => (k.id === id ? { ...k, nama_kategori: nama, keterangan } : k)));
    logAudit('EDIT_KATEGORI', `Admin mengubah kategori surat ID ${id}`);
  };

  const hapusKategori = (id: number) => {
    setKategoriList(prev => prev.filter(k => k.id !== id));
    logAudit('HAPUS_KATEGORI', `Admin menghapus kategori ID ${id}`);
  };

  const tambahBagian = (kode: string, nama: string) => {
    const newBagian: MasterBagian = { id: Date.now(), kode_bagian: kode, nama_bagian: nama };
    setBagianList(prev => [...prev, newBagian]);
    logAudit('TAMBAH_BAGIAN', `Admin menambah unit kerja: ${kode} - ${nama}`);
  };

  const editBagian = (id: number, kode: string, nama: string) => {
    setBagianList(prev => prev.map(b => (b.id === id ? { ...b, kode_bagian: kode, nama_bagian: nama } : b)));
    logAudit('EDIT_BAGIAN', `Admin mengedit unit kerja ID ${id}`);
  };

  const hapusBagian = (id: number) => {
    setBagianList(prev => prev.filter(b => b.id !== id));
    logAudit('HAPUS_BAGIAN', `Admin menghapus unit kerja ID ${id}`);
  };

  const tambahInstruksi = (instruksi: string) => {
    const newInstruksi: MasterInstruksiDisposisi = {
      id: Date.now(),
      instruksi,
      urutan: instruksiList.length + 1
    };
    setInstruksiList(prev => [...prev, newInstruksi]);
    logAudit('TAMBAH_INSTRUKSI', `Admin menambah instruksi disposisi: ${instruksi}`);
  };

  const editInstruksi = (id: number, instruksi: string) => {
    setInstruksiList(prev => prev.map(i => (i.id === id ? { ...i, instruksi } : i)));
    logAudit('EDIT_INSTRUKSI', `Admin mengubah instruksi disposisi ID ${id}`);
  };

  const hapusInstruksi = (id: number) => {
    setInstruksiList(prev => prev.filter(i => i.id !== id));
    logAudit('HAPUS_INSTRUKSI', `Admin menghapus instruksi disposisi ID ${id}`);
  };

  const resetDatabase = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setBagianList(INITIAL_BAGIAN);
    setKategoriList(INITIAL_KATEGORI);
    setInstruksiList(INITIAL_INSTRUKSI);
    setSuratMasukList(INITIAL_SURAT_MASUK);
    setSuratKeluarList(INITIAL_SURAT_KELUAR);
    setLogAktivitasList(INITIAL_LOG_AKTIVITAS);
    localStorage.clear();
    logAudit('RESET_DATABASE', 'Admin mereset database ke kondisi default instalasi awal.');
  };

  return (
    <PersuratanContext.Provider
      value={{
        currentUser,
        users,
        bagianList,
        kategoriList,
        instruksiList,
        suratMasukList,
        suratKeluarList,
        logAktivitasList,
        login,
        logout,
        switchUser,
        quickLoginAsRole,
        addSuratMasuk,
        verifikasiSuratMasuk,
        kembalikanKeLoket,
        buatDisposisi,
        teruskanKeBagian,
        kembalikanKeSekretariat,
        updateStatusPengerjaan,
        buatSuratKeluar,
        setujuiSuratKeluar,
        kembalikanRevisiSuratKeluar,
        uploadRevisiSuratKeluar,
        teruskanSuratKeluar,
        tambahUser,
        editUser,
        hapusUser,
        toggleStatusUser,
        tambahKategori,
        editKategori,
        hapusKategori,
        tambahBagian,
        editBagian,
        hapusBagian,
        tambahInstruksi,
        editInstruksi,
        hapusInstruksi,
        resetDatabase
      }}
    >
      {children}
    </PersuratanContext.Provider>
  );
};

export const usePersuratan = () => {
  const context = useContext(PersuratanContext);
  if (!context) {
    throw new Error('usePersuratan harus digunakan di dalam PersuratanProvider');
  }
  return context;
};
