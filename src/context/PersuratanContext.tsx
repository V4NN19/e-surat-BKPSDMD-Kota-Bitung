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
  login: (username: string, password: string, roleTarget?: UserRole) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  switchUser: (userId: number) => void;
  quickLoginAsRole: (role: UserRole) => void;
  fetchLiveData: () => Promise<void>;

  // Surat Masuk Actions
  addSuratMasuk: (data: {
    asal_surat: string;
    no_surat: string;
    tgl_surat: string;
    perihal: string;
    sifat: SifatSurat;
    id_kategori: number;
    file_name: string;
    file_url?: string;
    tanggal_surat?: string;
    tgl_arsip?: string | null;
  }) => SuratMasuk;
  verifikasiSuratMasuk: (id: number) => void;
  kembalikanKeLoket: (id: number, alasan: string) => void;
  buatDisposisi: (idSuratMasuk: number, idBagianTujuan: number, instruksi: string[], catatan?: string) => void;
  teruskanKeBagian: (idSuratMasuk: number) => void;
  kembalikanKeSekretariat: (idSuratMasuk: number, alasan: string) => void;
  updateStatusPengerjaan: (idSuratMasuk: number, status: 'SEDANG_DIPROSES' | 'SELESAI') => void;
  arsipkanSurat: (idSuratMasuk: number, keterangan?: string) => void;
  batalArsip: (idSuratMasuk: number) => void;

  // Surat Keluar Actions
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
    file_url?: string;
    file?: File | null;
  }) => Promise<SuratKeluar | null>;


  setujuiSuratKeluar: (id: number) => void;
  kembalikanRevisiSuratKeluar: (id: number, catatanRevisi: string) => void;
  uploadRevisiSuratKeluar: (id: number, fileName: File | string, catatanPerbaikan: string) => void;
  teruskanSuratKeluar: (id: number) => void;
  tandaiNaskahDiterima: (id: number) => void;
  arsipkanSuratKeluar: (id: number) => Promise<void>;

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

const API_URL = 'http://localhost:5000';
const TOKEN_KEY = 'token';

const getToken = () => localStorage.getItem(TOKEN_KEY);
const authHeaders = (): HeadersInit => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

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
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (!getToken()) return null;
    return getStored('current_user', null);
  });
  const [bagianList, setBagianList] = useState<MasterBagian[]>(() => getStored('bagian', INITIAL_BAGIAN));
  const [kategoriList, setKategoriList] = useState<MasterKategori[]>(() => getStored('kategori', INITIAL_KATEGORI));
  const [instruksiList, setInstruksiList] = useState<MasterInstruksiDisposisi[]>(() => getStoredInstruksi());
  const [suratMasukList, setSuratMasukList] = useState<SuratMasuk[]>(() => getStored('surat_masuk', INITIAL_SURAT_MASUK));
  const [suratKeluarList, setSuratKeluarList] = useState<SuratKeluar[]>(() => getStored('surat_keluar', INITIAL_SURAT_KELUAR));
  const [logAktivitasList, setLogAktivitasList] = useState<LogAktivitas[]>(() => getStored('log_aktivitas', INITIAL_LOG_AKTIVITAS));




  // ⬇️ TEMPEL DI SINI (menggantikan useEffect fetch lama)
  const mapSuratMasuk = (r: any): SuratMasuk => {
    let parsedDisposisi = r.disposisi;
    if (parsedDisposisi) {
      const bagian = bagianList.find(b => b.id === Number(parsedDisposisi.id_bagian_tujuan));
      let parsedInstruksi: string[] = [];

      if (Array.isArray(parsedDisposisi.instruksi)) {
        parsedInstruksi = parsedDisposisi.instruksi;
      } else if (typeof parsedDisposisi.instruksi === 'string') {
        try {
          const json = JSON.parse(parsedDisposisi.instruksi);
          parsedInstruksi = Array.isArray(json) ? json : [parsedDisposisi.instruksi];
        } catch {
          parsedInstruksi = parsedDisposisi.instruksi
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);
        }
      }

      parsedDisposisi = {
        ...parsedDisposisi,
        nama_bagian_tujuan:
          parsedDisposisi.nama_bagian_tujuan || bagian?.nama_bagian || 'Bagian Terkait',
        instruksi: parsedInstruksi
      };
    }

    return {
      ...r,
      file_name: r.file_pdf || r.file_name,
      file_url: r.file_pdf ? `${API_URL}/uploads/surat_masuk/${r.file_pdf}` : undefined,
      nama_kategori:
        r.nama_kategori ??
        kategoriList.find(k => k.id === Number(r.id_kategori))?.nama_kategori ??
        'Umum',
      is_arsip: Boolean(r.is_arsip),
      disposisi: parsedDisposisi,
      pengembalian: r.pengembalian || []
    };
  };


  const fetchLiveData = async () => {
    if (!getToken()) return; // Tunggu sampai login berhasil dan token tersimpan
    try {
      const res = await fetch(`${API_URL}/api/surat_masuk`, {
        headers: authHeaders()
      });

      if (res.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        setCurrentUser(null);
        return;
      }

      if (res.ok) {
        const rows = await res.json();
        const dataArray = Array.isArray(rows) ? rows : (rows.data || []);
        setSuratMasukList(dataArray.map(mapSuratMasuk));
      }
    } catch (err) {
      console.warn('Backend server di port 5000 belum siap:', err);
    }

    if (currentUser?.role === 'ADMIN') {
      const resUsers = await fetch(`${API_URL}/api/users`, {
        headers: authHeaders()
      });
      if (resUsers.ok) {
        const dataUsers = await resUsers.json();
        setUsers(
          dataUsers.map((u: any) => ({
            ...u,
            status_aktif: Boolean(u.status_aktif)
          }))
        );
      }
    }
    const resBagian = await fetch(`${API_URL}/api/master_bagian`, {
      headers: authHeaders()
    });
    if (resBagian.ok) {
      const dataBagian = await resBagian.json();
      if (Array.isArray(dataBagian) && dataBagian.length > 0) {
        setBagianList(dataBagian);
      }
    }
    const resKategori = await fetch(`${API_URL}/api/master_kategori`, {
      headers: authHeaders()
    });
    if (resKategori.ok) {
      const dataKategori = await resKategori.json();
      if (Array.isArray(dataKategori) && dataKategori.length > 0) {
        setKategoriList(dataKategori);
      }
    }

    const resInstruksi = await fetch(`${API_URL}/api/master_instruksi_disposisi`, {
      headers: authHeaders()
    });
    if (resInstruksi.ok) {
      const dataInstruksi = await resInstruksi.json();
      if (Array.isArray(dataInstruksi) && dataInstruksi.length > 0) {
        setInstruksiList(dataInstruksi);
      }
    }
    const resSuratKeluar = await fetch(`${API_URL}/api/surat_keluar`, {
      headers: authHeaders()
    });
    if (resSuratKeluar.ok) {
      const dataSk = await resSuratKeluar.json();
      const arraySk = Array.isArray(dataSk) ? dataSk : (dataSk.data || []);
      setSuratKeluarList(
        arraySk.map((sk: any) => ({
          ...sk,
          versi_file: Array.isArray(sk.versi_file)
            ? sk.versi_file.map((v: any) => ({
              ...v,
              file_url:
                v.file_url ||
                (v.nama_file ? `${API_URL}/uploads/surat_keluar/${v.nama_file}` : undefined)
            }))
            : []
        }))
      );
    }
  };

  useEffect(() => {
    if (currentUser && getToken()) {
      fetchLiveData();
    }
  }, [currentUser?.id]);
  // ⬆️ sampai sini

  // Sync state to LocalStorage
  useEffect(() => { setStored('users', users); }, [users]);
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
  // 1. Autentikasi
  const login = async (username: string, password: string, roleTarget?: UserRole) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        if (roleTarget && data.user?.role !== roleTarget) {
          return {
            success: false,
            message: `Akun "${data.user.nama}" terdaftar sebagai ${data.user.role}, bukan ${roleTarget}.`
          };
        }

        localStorage.setItem(TOKEN_KEY, data.token);
        setCurrentUser(data.user);
        logAudit('LOGIN', `Pengguna ${data.user.nama} (${data.user.role}) berhasil masuk ke sistem`);
        await fetchLiveData();
        return { success: true, message: 'Login berhasil.' };
      } else {
        return { success: false, message: data.message || 'Username atau kata sandi tidak sesuai.' };
      }
    } catch (err) {
      console.error('Error koneksi backend login:', err);
      return { success: false, message: 'Gagal terhubung ke server backend port 5000.' };
    }
  };

  const logout = () => {
    if (currentUser) {
      logAudit('LOGOUT', `Pengguna ${currentUser.nama} keluar dari sesi`);
    }
    localStorage.removeItem(TOKEN_KEY);
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
    file_url?: string;
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
      file_url: data.file_url ?? undefined,
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

  const verifikasiSuratMasuk = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/surat_masuk/${id}/verifikasi`, {
        method: 'PATCH',
        headers: authHeaders()
      });
      const data = await res.json();

      if (res.ok) {
        logAudit('VERIFIKASI_SURAT', `Sekretariat memverifikasi surat ID ${id} dan mengajukan ke Kepala Badan`);
        await fetchLiveData();
      } else {
        alert(data.message || 'Gagal memverifikasi surat masuk.');
      }
    } catch (err) {
      console.error('Error verifikasiSuratMasuk:', err);
      alert('Gagal terhubung ke server backend.');
    }
  };

  const kembalikanKeLoket = async (id: number, alasan: string) => {
    try {
      const res = await fetch(`${API_URL}/api/surat_masuk/${id}/kembalikan-ke-loket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        },
        body: JSON.stringify({ alasan })
      });
      const data = await res.json();

      if (res.ok) {
        logAudit('KEMBALIKAN_KE_LOKET', `Sekretariat mengembalikan surat ID ${id} ke Loket. Alasan: ${alasan}`);
        await fetchLiveData();
      } else {
        alert(data.message || 'Gagal mengembalikan surat ke Loket.');
      }
    } catch (err) {
      console.error('Error kembalikanKeLoket:', err);
      alert('Gagal terhubung ke server backend.');
    }
  };

  const buatDisposisi = async (
    idSuratMasuk: number,
    idBagianTujuan: number,
    instruksi: string[],
    catatan?: string
  ) => {
    const bagian = bagianList.find(b => b.id === Number(idBagianTujuan));
    try {
      const res = await fetch(`${API_URL}/api/surat_masuk/${idSuratMasuk}/disposisi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        },
        body: JSON.stringify({
          id_bagian_tujuan: Number(idBagianTujuan),
          instruksi: JSON.stringify(instruksi),
          catatan_kepala: catatan || ''
        })
      });
      const data = await res.json();

      if (res.ok) {
        logAudit(
          'BUAT_DISPOSISI',
          `Kepala Badan menerbitkan lembar disposisi untuk surat ID ${idSuratMasuk} tujuan ${bagian?.nama_bagian || 'Bagian'}`
        );
        await fetchLiveData();
      } else {
        alert(data.message || 'Gagal menerbitkan lembar disposisi.');
      }
    } catch (err) {
      console.error('Error buatDisposisi:', err);
      alert('Gagal terhubung ke server backend.');
    }
  };

  const teruskanKeBagian = async (idSuratMasuk: number) => {
    try {
      const res = await fetch(`${API_URL}/api/surat_masuk/${idSuratMasuk}/teruskan-ke-bagian`, {
        method: 'PATCH',
        headers: authHeaders()
      });
      const data = await res.json();

      if (res.ok) {
        logAudit('TERUSKAN_KE_BAGIAN', `Sekretariat meneruskan surat ID ${idSuratMasuk} ke Kepala Bagian`);
        await fetchLiveData();
      } else {
        alert(data.message || 'Gagal meneruskan surat ke Bagian.');
      }
    } catch (err) {
      console.error('Error teruskanKeBagian:', err);
      alert('Gagal terhubung ke server backend.');
    }
  };

  const kembalikanKeSekretariat = async (idSuratMasuk: number, alasan: string) => {
    try {
      const res = await fetch(`${API_URL}/api/surat_masuk/${idSuratMasuk}/kembalikan-ke-sekretariat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        },
        body: JSON.stringify({ alasan })
      });
      const data = await res.json();

      if (res.ok) {
        logAudit(
          'KEMBALIKAN_KE_SEKRETARIAT',
          `Kepala Bagian mengembalikan surat ID ${idSuratMasuk} ke Sekretariat. Alasan: ${alasan}`
        );
        await fetchLiveData();
      } else {
        alert(data.message || 'Gagal mengembalikan surat ke Sekretariat.');
      }
    } catch (err) {
      console.error('Error kembalikanKeSekretariat:', err);
      alert('Gagal terhubung ke server backend.');
    }
  };

  const updateStatusPengerjaan = async (
    idSuratMasuk: number,
    status: 'SEDANG_DIPROSES' | 'SELESAI'
  ) => {
    try {
      // Menggunakan tanda hubung sesuai definisi rute di backend/server.cjs
      const res = await fetch(`${API_URL}/api/surat-masuk/${idSuratMasuk}/status-pengerjaan`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        },
        body: JSON.stringify({ status_baru: status })
      });
      const data = await res.json();

      if (res.ok) {
        logAudit('UPDATE_PENGERJAAN', `Kepala Bagian mengubah status surat ID ${idSuratMasuk} menjadi ${status}`);
        await fetchLiveData();
      } else {
        alert(data.message || 'Gagal memperbarui status pengerjaan surat.');
      }
    } catch (err) {
      console.error('Error updateStatusPengerjaan:', err);
      alert('Gagal terhubung ke server backend.');
    }
  };

  const arsipkanSurat = async (idSuratMasuk: number, keterangan?: string) => {
    try {
      const res = await fetch(`${API_URL}/api/surat_masuk/${idSuratMasuk}/arsip`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        },
        body: JSON.stringify({
          keterangan: keterangan || 'Diarsipkan di lemari dokumen BKPSDMD'
        })
      });
      const data = await res.json();

      if (res.ok) {
        logAudit('ARSIP_SURAT', `${currentUser?.nama || 'Pengguna'} mengarsipkan surat ID ${idSuratMasuk}`);
        await fetchLiveData();
      } else {
        alert(data.message || 'Gagal mengarsipkan surat.');
      }
    } catch (err) {
      console.error('Error arsipkanSurat:', err);
      alert('Gagal terhubung ke server backend.');
    }
  };

  const batalArsip = async (idSuratMasuk: number) => {
    try {
      const res = await fetch(`${API_URL}/api/surat_masuk/${idSuratMasuk}/batal-arsip`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        }
      });
      const data = await res.json();

      if (res.ok) {
        logAudit('BATAL_ARSIP', `${currentUser?.nama || 'Pengguna'} membatalkan arsip surat ID ${idSuratMasuk}`);
        await fetchLiveData();
      } else {
        alert(data.message || 'Gagal membatalkan arsip surat.');
      }
    } catch (err) {
      console.error('Error batalArsip:', err);
      alert('Gagal terhubung ke server backend.');
    }
  };
  // 3. Surat Keluar Actions
  const buatSuratKeluar = async (data: {
    no_draft: string;
    jenis_naskah: 'Nota Dinas' | 'Surat Edaran Internal' | 'Memo' | 'Surat Tugas';
    sifat: SifatSurat;
    lampiran: string;
    perihal: string;
    id_bagian_tujuan: number;
    isi_ringkas: string;
    file_name: string;
    file_url?: string;
    file?: File | null;
  }): Promise<SuratKeluar | null> => {
    try {
      const formData = new FormData();
      formData.append('no_draft', data.no_draft);
      formData.append('jenis_naskah', data.jenis_naskah);
      formData.append('sifat', data.sifat);
      formData.append('lampiran', data.lampiran || '-');
      formData.append('perihal', data.perihal);
      formData.append('id_bagian_tujuan', String(data.id_bagian_tujuan));
      formData.append('isi_ringkas', data.isi_ringkas);
      if (data.file) {
        formData.append('file_pdf', data.file);
      }

      const res = await fetch(`${API_URL}/api/surat_keluar`, {
        method: 'POST',
        headers: authHeaders(),
        body: formData
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        alert(result.message || 'Gagal menyimpan konsep surat keluar ke database.');
        return null;
      }

      logAudit(
        'BUAT_SURAT_KELUAR',
        `Kepala Bagian mengajukan konsep ${data.jenis_naskah} No. Draft ${data.no_draft} (Versi 1)`
      );
      await fetchLiveData();
      return result.data || null;
    } catch (error) {
      console.error('Error buatSuratKeluar:', error);
      alert('Terjadi kesalahan koneksi saat mengirim konsep surat keluar.');
      return null;
    }
  };

  const setujuiSuratKeluar = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/surat_keluar/${id}/setujui`, {
        method: 'PATCH',
        headers: authHeaders()
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || 'Gagal menyetujui surat keluar.');
        return;
      }

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
      await fetchLiveData();
    } catch (error) {
      console.error('Error setujuiSuratKeluar:', error);
      alert('Terjadi kesalahan koneksi saat menyetujui surat keluar.');
    }
  };

  const kembalikanRevisiSuratKeluar = async (id: number, catatanRevisi: string) => {
    try {
      const res = await fetch(`${API_URL}/api/surat_keluar/${id}/kembalikan-revisi`, {
        method: 'POST',
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ catatan_revisi: catatanRevisi })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || 'Gagal mengembalikan draft untuk revisi.');
        return;
      }

      setSuratKeluarList(prev =>
        prev.map(s => {
          if (s.id === id) {
            logAudit('REVISI_SURAT_KELUAR', `Kepala Badan mengembalikan draft surat keluar ${s.no_draft} untuk revisi. Catatan: ${catatanRevisi}`);
            return {
              ...s,
              status_persetujuan: 'REVISI',
              catatan_revisi_terakhir: catatanRevisi
            };
          }
          return s;
        })
      );
      await fetchLiveData();
    } catch (error) {
      console.error('Error kembalikanRevisiSuratKeluar:', error);
      alert('Terjadi kesalahan koneksi saat mengirim catatan revisi.');
    }
  };

  const uploadRevisiSuratKeluar = async (
    id: number,
    fileOrName: File | string,
    catatanPerbaikan: string
  ) => {
    try {
      if (fileOrName instanceof File) {
        const formData = new FormData();
        formData.append('file_pdf', fileOrName);
        formData.append('catatan_perbaikan', catatanPerbaikan || '');

        const res = await fetch(`${API_URL}/api/surat_keluar/${id}/upload-revisi`, {
          method: 'POST',
          headers: authHeaders(),
          body: formData
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          alert(data.message || 'Gagal mengunggah berkas revisi.');
          return;
        }
        logAudit('UPLOAD_REVISI_SURAT_KELUAR', `Kepala Bagian mengunggah berkas revisi untuk surat keluar ID ${id}`);
        await fetchLiveData();
        return;
      }

      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setSuratKeluarList(prev =>
        prev.map(s => {
          if (s.id === id) {
            const versiList = Array.isArray(s.versi_file) ? s.versi_file : [];
            const versiTertinggi = versiList.reduce((max, v) => (v.versi_ke > max ? v.versi_ke : max), 1);
            const versiBaru = versiTertinggi + 1;
            const namaFileBaru = fileOrName || `${s.no_draft.replace(/[^a-zA-Z0-9]/g, '_')}_v${versiBaru}.pdf`;

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

            return {
              ...s,
              status_persetujuan: 'PENGAJUAN_KE_KEPALA_BADAN',
              versi_file: [...versiList, newVersiItem]
            };
          }
          return s;
        })
      );
    } catch (error) {
      console.error('Error uploadRevisiSuratKeluar:', error);
      alert('Terjadi kesalahan koneksi saat mengunggah revisi.');
    }
  };

  const teruskanSuratKeluar = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/surat_keluar/${id}/teruskan`, {
        method: 'PATCH',
        headers: authHeaders()
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || 'Gagal meneruskan surat keluar ke bagian tujuan.');
        return;
      }
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
      await fetchLiveData();
    } catch (error) {
      console.error('Error teruskanSuratKeluar:', error);
      alert('Terjadi kesalahan koneksi saat meneruskan surat keluar.');
    }
  };

  const tandaiNaskahDiterima = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/surat_keluar/${id}/terima-bagian`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuratKeluarList((prev) =>
          prev.map((sk) =>
            sk.id === id ? { ...sk, status_persetujuan: 'DITERIMA_BAGIAN_TUJUAN' } : sk
          )
        );
      }
    } catch (error) {
      console.error('Gagal menandai naskah diterima:', error);
    }
  };

  const arsipkanSuratKeluar = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/surat_keluar/${id}/arsip`, {
        method: 'PATCH',
        headers: authHeaders()
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || 'Gagal mengarsipkan naskah dinas internal.');
        return;
      }
      setSuratKeluarList(prev =>
        prev.map(s => {
          if (s.id === id) {
            logAudit(
              'ARSIP_SURAT_KELUAR',
              `Sekretariat mengarsipkan naskah internal ${s.no_draft} (${s.perihal})`
            );
            return {
              ...s,
              status_persetujuan: 'DIARSIPKAN'
            };
          }
          return s;
        })
      );
      await fetchLiveData();
    } catch (error) {
      console.error('Error arsipkanSuratKeluar:', error);
      alert('Terjadi kesalahan koneksi saat mengarsipkan naskah.');
    }
  };


  // 4. Master Data CRUD
  const tambahUser = async (newUser: Omit<User, 'id' | 'created_at'>) => {
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(newUser)
      });
      const resData = await res.json();
      if (!res.ok) {
        alert(resData.message || 'Gagal menambahkan pengguna baru.');
        return;
      }
      logAudit('TAMBAH_PENGGUNA', `Admin menambahkan pengguna baru: ${newUser.nama} (${newUser.role})`);
      await fetchLiveData();
    } catch (err) {
      console.error('Error tambahUser:', err);
      alert('Gagal terhubung ke server backend.');
    }
  };

  const editUser = async (id: number, data: Partial<User>) => {
    const existing = users.find(u => u.id === id);
    const payload = { ...existing, ...data };

    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload)
      });
      const resData = await res.json();
      if (!res.ok) {
        alert(resData.message || 'Gagal memperbarui data pengguna.');
        return;
      }
      logAudit('EDIT_PENGGUNA', `Admin memperbarui data pengguna ID ${id}`);
      await fetchLiveData();
    } catch (err) {
      console.error('Error editUser:', err);
      alert('Gagal terhubung ke server backend.');
    }
  };

  const hapusUser = async (id: number) => {
    const target = users.find(u => u.id === id);

    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      const resData = await res.json();
      if (!res.ok) {
        alert(resData.message || 'Gagal menghapus pengguna.');
        return;
      }
      logAudit('HAPUS_PENGGUNA', `Admin menghapus pengguna: ${target?.nama || id}`);
      await fetchLiveData();
    } catch (err) {
      console.error('Error hapusUser:', err);
      alert('Gagal terhubung ke server backend.');
    }
  };

  const toggleStatusUser = async (id: number) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    const nextStatus = !target.status_aktif;

    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          ...target,
          status_aktif: nextStatus
        })
      });
      const resData = await res.json();
      if (!res.ok) {
        alert(resData.message || 'Gagal mengubah status pengguna.');
        return;
      }
      logAudit(
        'UBAH_STATUS_PENGGUNA',
        `Admin mengubah status akun ${target.nama} menjadi ${nextStatus ? 'Aktif' : 'Nonaktif'}`
      );
      await fetchLiveData();
    } catch (err) {
      console.error('Error toggleStatusUser:', err);
      alert('Gagal terhubung ke server backend.');
    }
  };

  const tambahKategori = async (nama: string, keterangan?: string) => {
    try {
      const res = await fetch(`${API_URL}/api/master_kategori`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ nama_kategori: nama, keterangan })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Gagal menambah kategori.');
      setKategoriList(prev => [...prev, { id: data.id, nama_kategori: data.nama_kategori, keterangan: data.keterangan }]);
      logAudit('TAMBAH_KATEGORI', `Admin menambah kategori surat: ${nama}`);
    } catch {
      alert('Gagal terhubung ke server backend.');
    }
  };

  const editKategori = async (id: number, nama: string, keterangan?: string) => {
    try {
      const res = await fetch(`${API_URL}/api/master_kategori/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ nama_kategori: nama, keterangan })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Gagal mengubah kategori.');
      setKategoriList(prev => prev.map(k => (k.id === id ? { ...k, nama_kategori: nama, keterangan } : k)));
      logAudit('EDIT_KATEGORI', `Admin mengubah kategori surat ID ${id}`);
    } catch {
      alert('Gagal terhubung ke server backend.');
    }
  };

  const hapusKategori = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/master_kategori/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Gagal menghapus kategori.');
      setKategoriList(prev => prev.filter(k => k.id !== id));
      logAudit('HAPUS_KATEGORI', `Admin menghapus kategori ID ${id}`);
    } catch {
      alert('Gagal terhubung ke server backend.');
    }
  };

  const tambahBagian = async (kode: string, nama: string) => {
    try {
      const res = await fetch(`${API_URL}/api/master_bagian`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ kode_bagian: kode, nama_bagian: nama })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Gagal menambah unit kerja.');
      setBagianList(prev => [...prev, { id: data.id, kode_bagian: data.kode_bagian, nama_bagian: data.nama_bagian }]);
      logAudit('TAMBAH_BAGIAN', `Admin menambah unit kerja: ${data.kode_bagian} - ${data.nama_bagian}`);
    } catch {
      alert('Gagal terhubung ke server backend.');
    }
  };

  const editBagian = async (id: number, kode: string, nama: string) => {
    try {
      const res = await fetch(`${API_URL}/api/master_bagian/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ kode_bagian: kode, nama_bagian: nama })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Gagal mengubah unit kerja.');
      setBagianList(prev => prev.map(b => (b.id === id ? { ...b, kode_bagian: kode, nama_bagian: nama } : b)));
      logAudit('EDIT_BAGIAN', `Admin mengedit unit kerja ID ${id}`);
    } catch {
      alert('Gagal terhubung ke server backend.');
    }
  };

  const hapusBagian = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/master_bagian/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Gagal menghapus unit kerja.');
      setBagianList(prev => prev.filter(b => b.id !== id));
      logAudit('HAPUS_BAGIAN', `Admin menghapus unit kerja ID ${id}`);
    } catch {
      alert('Gagal terhubung ke server backend.');
    }
  };

  const tambahInstruksi = async (instruksi: string) => {
    try {
      const res = await fetch(`${API_URL}/api/master_instruksi_disposisi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ instruksi })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Gagal menambah instruksi disposisi.');
      setInstruksiList(prev => [...prev, { id: data.id, instruksi: data.instruksi, urutan: data.urutan }]);
      logAudit('TAMBAH_INSTRUKSI', `Admin menambah instruksi disposisi: ${instruksi}`);
    } catch {
      alert('Gagal terhubung ke server backend.');
    }
  };

  const editInstruksi = async (id: number, instruksi: string) => {
    try {
      const res = await fetch(`${API_URL}/api/master_instruksi_disposisi/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ instruksi })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Gagal mengubah instruksi disposisi.');
      setInstruksiList(prev => prev.map(i => (i.id === id ? { ...i, instruksi } : i)));
      logAudit('EDIT_INSTRUKSI', `Admin mengubah instruksi disposisi ID ${id}`);
    } catch {
      alert('Gagal terhubung ke server backend.');
    }
  };

  const hapusInstruksi = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/master_instruksi_disposisi/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Gagal menghapus instruksi disposisi.');
      setInstruksiList(prev => prev.filter(i => i.id !== id));
      logAudit('HAPUS_INSTRUKSI', `Admin menghapus instruksi disposisi ID ${id}`);
    } catch {
      alert('Gagal terhubung ke server backend.');
    }
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
        arsipkanSurat,
        batalArsip,
        buatSuratKeluar,
        setujuiSuratKeluar,
        kembalikanRevisiSuratKeluar,
        uploadRevisiSuratKeluar,
        teruskanSuratKeluar,
        tandaiNaskahDiterima,
        arsipkanSuratKeluar,
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
        fetchLiveData,
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
