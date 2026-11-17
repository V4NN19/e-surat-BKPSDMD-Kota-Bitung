/**
 * @file AdminDashboard.tsx
 * @description Dashboard Administrator Sistem Persuratan BKPSDMD Kota Bitung
 * Manajemen Pengguna, Master Data (Kategori, Bagian, Instruksi Disposisi), Rekapitulasi, & Audit Trail Log Aktivitas
 */

import React, { useState, useMemo } from 'react';
import LOGO_KOTA_BITUNG_SULAWESI_UTARA from "../../assets/LOGO_KOTA_BITUNG_SULAWESI_UTARA.png";
import { usePersuratan } from '../../context/PersuratanContext';
import { User, UserRole } from '../../types';
import {
  Shield,
  Users,
  Database,
  History,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Printer,
  Download,
  Key,
  Filter,
  Search,
  Building,
  Tag,
  ListChecks,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminDashboardProps {
  activeMenu?: string;
  onSelectMenu?: (menu: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  activeMenu,
  onSelectMenu
}) => {
  const {
    users,
    bagianList,
    kategoriList,
    instruksiList,
    logAktivitasList,
    suratMasukList,
    suratKeluarList,
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
  } = usePersuratan();


  const [activeTab, setActiveTab] = useState<'rekap' | 'users' | 'master' | 'log'>('users');
  const [masterSubTab, setMasterSubTab] = useState<'kategori' | 'bagian' | 'instruksi'>('kategori');

  const isStatusView =
    activeMenu === 'menunggu_verifikasi' ||
    activeMenu === 'terverifikasi' ||
    activeMenu === 'dikembalikan';

  // Sinkronisasi dengan menu Sidebar
  React.useEffect(() => {
    if (!activeMenu) return;
    if (activeMenu === 'users' || activeMenu === 'master' || activeMenu === 'rekap' || activeMenu === 'log') {
      setActiveTab(activeMenu);
    }
  }, [activeMenu]);

  const handleTabClick = (tab: 'users' | 'master' | 'rekap' | 'log') => {
    setActiveTab(tab);
    onSelectMenu?.(tab);
  };

  // Filter Log
  const [filterRoleLog, setFilterRoleLog] = useState<string>('semua');
  const [searchLog, setSearchLog] = useState<string>('');

  // State Modal User
  const [modalUserOpen, setModalUserOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [userNama, setUserNama] = useState('');
  const [userNip, setUserNip] = useState('');
  const [userUsername, setUserUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('LOKET');
  const [userIdBagian, setUserIdBagian] = useState<number | null>(null);
  const [userJabatan, setUserJabatan] = useState('');

  // State Modal Master Data
  const [modalMasterOpen, setModalMasterOpen] = useState(false);
  const [masterType, setMasterType] = useState<'kategori' | 'bagian' | 'instruksi'>('kategori');
  const [masterEditingId, setMasterEditingId] = useState<number | null>(null);
  const [masterField1, setMasterField1] = useState(''); // Nama / Kode
  const [masterField2, setMasterField2] = useState(''); // Keterangan / Nama Bagian
  const [showPassword, setShowPassword] = useState(false);

  // Open Modal Tambah/Edit User
  const handleOpenUserModal = (user?: User) => {
    if (user) {
      setEditingUserId(user.id);
      setUserNama(user.nama);
      setShowPassword(false);
      setUserNip(user.nip || '');
      setUserUsername(user.username);
      setUserPassword('');
      setUserRole(user.role);
      setUserIdBagian(user.id_bagian || null);
      setUserJabatan(user.jabatan);
    } else {
      setEditingUserId(null);
      setUserNama('');
      setUserNip('');
      setUserUsername('');
      setUserPassword('password123');
      setUserRole('LOKET');
      setUserIdBagian(bagianList[0]?.id || 1);
      setUserJabatan('');
    }
    setModalUserOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNama.trim() || !userUsername.trim() || !userJabatan.trim()) {
      alert('Mohon lengkapi semua kolom wajib.');
      return;
    }

    if (editingUserId) {
      editUser(editingUserId, {
        nama: userNama.trim(),
        nip: userNip.trim() || undefined,
        username: userUsername.trim(),
        ...(userPassword.trim() ? { password: userPassword.trim() } : {}),
        role: userRole,
        id_bagian: userIdBagian ? Number(userIdBagian) : null,
        jabatan: userJabatan.trim()
      });
      alert('Data pengguna berhasil diperbarui!');
    } else {
      tambahUser({
        nama: userNama.trim(),
        nip: userNip.trim() || undefined,
        username: userUsername.trim(),
        password: userPassword.trim() || 'user123',
        role: userRole,
        id_bagian: userIdBagian ? Number(userIdBagian) : null,
        jabatan: userJabatan.trim(),
        status_aktif: true
      });
      alert('Pengguna baru berhasil ditambahkan!');
    }
    setModalUserOpen(false);
  };

  // Open Modal Master
  const handleOpenMasterModal = (type: 'kategori' | 'bagian' | 'instruksi', item?: any) => {
    setMasterType(type);
    if (item) {
      setMasterEditingId(item.id);
      if (type === 'kategori') {
        setMasterField1(item.nama_kategori);
        setMasterField2(item.keterangan || '');
      } else if (type === 'bagian') {
        setMasterField1(item.kode_bagian);
        setMasterField2(item.nama_bagian);
      } else {
        setMasterField1(item.instruksi);
        setMasterField2('');
      }
    } else {
      setMasterEditingId(null);
      setMasterField1('');
      setMasterField2('');
    }
    setModalMasterOpen(true);
  };

  const handleSaveMaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterField1.trim()) return;

    if (masterType === 'kategori') {
      if (masterEditingId) {
        editKategori(masterEditingId, masterField1.trim(), masterField2.trim());
      } else {
        tambahKategori(masterField1.trim(), masterField2.trim());
      }
    } else if (masterType === 'bagian') {
      if (masterEditingId) {
        editBagian(masterEditingId, masterField1.trim(), masterField2.trim());
      } else {
        tambahBagian(masterField1.trim(), masterField2.trim());
      }
    } else {
      if (masterEditingId) {
        editInstruksi(masterEditingId, masterField1.trim());
      } else {
        tambahInstruksi(masterField1.trim());
      }
    }

    setModalMasterOpen(false);
  };

  // Filter Log Audit
  const filteredLog = logAktivitasList.filter((log) => {
    const matchesRole = filterRoleLog === 'semua' ? true : log.role === filterRoleLog;
    const matchesSearch =
      log.keterangan.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.nama_user.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.aksi.toLowerCase().includes(searchLog.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Helper membaca indeks bulan (0 = Jan ... 11 = Des) dari tanggal database
  const getBulanIndex = (rawDate?: string): number | null => {
    if (!rawDate) return null;
    const str = String(rawDate).trim();
    const tahunSekarang = new Date().getFullYear();

    // 1. Format ISO / SQL: "2026-11-18..."
    const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const tahun = Number(isoMatch[1]);
      const bulan = Number(isoMatch[2]) - 1;
      return tahun === tahunSekarang && bulan >= 0 && bulan <= 11 ? bulan : null;
    }

    // 2. Format teks Indonesia: "17 Nov 2026 • 19:07 WITA"
    const namaBulan = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'sep', 'okt', 'nov', 'des'];
    const lower = str.toLowerCase();
    if (!lower.includes(String(tahunSekarang))) return null;

    for (let i = 0; i < namaBulan.length; i++) {
      if (lower.includes(namaBulan[i])) return i;
    }
    return null;
  };

  // Hitung rekap 12 bulan otomatis dari database (mulai dari 0)
  const rekapBulananDb = useMemo(() => {
    const daftarBulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];

    const hasil = daftarBulan.map((nama) => ({
      bulan: nama,
      masuk: 0,
      keluar: 0,
      disposisi: 0,
      selesai: 0,
    }));

    (suratMasukList || []).forEach((sm: any) => {
      const idx = getBulanIndex(sm.tgl_input || sm.created_at || sm.tgl_surat);
      if (idx !== null) {
        hasil[idx].masuk += 1;
        if (sm.disposisi) hasil[idx].disposisi += 1;
        if (sm.status_surat === 'ARSIP' || sm.status_surat === 'SELESAI' || sm.disposisi) {
          hasil[idx].selesai += 1;
        }
      }
    });

    (suratKeluarList || []).forEach((sk: any) => {
      const idx = getBulanIndex(sk.tgl_dibuat || sk.created_at);
      if (idx !== null) {
        hasil[idx].keluar += 1;
        if (sk.status_persetujuan === 'DISETUJUI_KEPALA_BADAN') {
          hasil[idx].selesai += 1;
        }
      }
    });

    return hasil.map((item) => {
      const total = item.masuk + item.keluar;
      return {
        bulan: item.bulan,
        masuk: item.masuk,
        keluar: item.keluar,
        disposisi: item.disposisi,
        rasio: total > 0 ? Math.round((item.selesai / total) * 100) : 0,
      };
    });
  }, [suratMasukList, suratKeluarList]);
  return (
    <div className="space-y-6">
      {/* VIEW: MENUNGGU VERIFIKASI (ADMIN) */}
      {activeMenu === 'menunggu_verifikasi' && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4 animate-fade-in">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>Monitoring Antrean Berkas Menunggu Verifikasi &amp; Disposisi</span>
              </h3>
              <p className="text-xs text-slate-500">
                Seluruh berkas surat dalam sistem yang sedang menunggu verifikasi Sekretariat atau pembuatan disposisi Kepala Badan.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
              {suratMasukList.filter(s => s.status_surat === 'MENUNGGU_VERIFIKASI_SEKRETARIAT' || s.status_surat === 'MENUNGGU_DISPOSISI_KEPALA_BADAN').length} Berkas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-3 px-3">No. Agenda</th>
                  <th className="py-3 px-3">Asal &amp; Nomor Surat</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Sifat</th>
                  <th className="py-3 px-3">Status Surat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {suratMasukList
                  .filter(s => s.status_surat === 'MENUNGGU_VERIFIKASI_SEKRETARIAT' || s.status_surat === 'MENUNGGU_DISPOSISI_KEPALA_BADAN')
                  .map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{s.no_agenda}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900">{s.asal_surat}</p>
                        <p className="text-[11px] text-slate-500">No: {s.no_surat}</p>
                        <p className="text-[11px] text-slate-600 italic">"{s.perihal}"</p>
                      </td>
                      <td className="py-3 px-3">{s.nama_kategori}</td>
                      <td className="py-3 px-3 font-semibold">{s.sifat}</td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          {s.status_surat.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: TERVERIFIKASI (ADMIN) */}
      {activeMenu === 'terverifikasi' && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4 animate-fade-in">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Monitoring Surat Terverifikasi &amp; Berjalan</span>
              </h3>
              <p className="text-xs text-slate-500">
                Seluruh berkas surat yang sudah melewati tahap verifikasi dan saat ini berproses di Bagian atau telah selesai.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
              {suratMasukList.filter(s => s.status_surat === 'DISPOSISI_DIBUAT' || s.status_surat === 'DITERUSKAN_KE_BAGIAN' || s.status_surat === 'SEDANG_DIPROSES' || s.status_surat === 'SELESAI').length} Berkas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-3 px-3">No. Agenda</th>
                  <th className="py-3 px-3">Asal &amp; Perihal</th>
                  <th className="py-3 px-3">Bagian Pelaksana</th>
                  <th className="py-3 px-3">Status Surat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {suratMasukList
                  .filter(s => s.status_surat === 'DISPOSISI_DIBUAT' || s.status_surat === 'DITERUSKAN_KE_BAGIAN' || s.status_surat === 'SEDANG_DIPROSES' || s.status_surat === 'SELESAI')
                  .map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{s.no_agenda}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900">{s.asal_surat}</p>
                        <p className="text-[11px] text-slate-600 italic">"{s.perihal}"</p>
                      </td>
                      <td className="py-3 px-3 font-bold text-purple-900">
                        {s.disposisi?.nama_bagian_tujuan || 'Sekretariat / Kaban'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {s.status_surat.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: TOLAK / DIKEMBALIKAN (ADMIN) */}
      {activeMenu === 'dikembalikan' && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4 animate-fade-in">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-red-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Monitoring Surat Dikembalikan &amp; Revisi Naskah</span>
              </h3>
              <p className="text-xs text-slate-500">
                Seluruh berkas yang mengalami kendala: dikembalikan ke loket, salah sasaran disposisi, atau konsep revisi.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-red-50 text-red-800 rounded-full border border-red-200">
              {suratMasukList.filter(s => s.status_surat === 'DIKEMBALIKAN_KE_LOKET' || s.status_surat === 'DIKEMBALIKAN_KE_SEKRETARIAT').length + suratKeluarList.filter(sk => sk.status_persetujuan === 'REVISI').length} Berkas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-red-50 text-red-900 uppercase font-bold border-b border-red-200">
                  <th className="py-3 px-3">No. Agenda / Draft</th>
                  <th className="py-3 px-3">Jenis Dokumen &amp; Perihal</th>
                  <th className="py-3 px-3">Keterangan Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {suratMasukList
                  .filter(s => s.status_surat === 'DIKEMBALIKAN_KE_LOKET' || s.status_surat === 'DIKEMBALIKAN_KE_SEKRETARIAT')
                  .map(s => (
                    <tr key={s.id} className="hover:bg-red-50/40 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{s.no_agenda}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900">{s.asal_surat}</p>
                        <p className="text-[11px] text-slate-600 italic">"{s.perihal}"</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
                          {s.status_surat === 'DIKEMBALIKAN_KE_LOKET' ? 'Dikembalikan ke Loket (Berkas Buram/Rusak)' : 'Salah Sasaran Disposisi Bagian'}
                        </span>
                      </td>
                    </tr>
                  ))}
                {suratKeluarList
                  .filter(sk => sk.status_persetujuan === 'REVISI')
                  .map(sk => (
                    <tr key={sk.id} className="hover:bg-red-50/40 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{sk.no_draft}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900">Konsep {sk.jenis_naskah} - {sk.nama_bagian_pengirim}</p>
                        <p className="text-[11px] text-slate-600 italic">"{sk.perihal}"</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
                          Dikembalikan Kaban untuk Revisi
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 1. TAB MANAJEMEN PENGGUNA */}
      {!isStatusView && activeTab === 'users' && (
        <div className="space-y-6">

          {/* Stat Cards per Bagian */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {bagianList.map((bg) => {
              const count = users.filter((u) => u.id_bagian === bg.id).length;
              return (
                <div key={bg.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <p className="text-[7px] font-bold uppercase text-slate-500 whitespace-normal">{bg.kode_bagian}</p>
                  <h4 className="text-xl font-extrabold text-slate-900 mt-1 flex flex-col justify-center">{count} Akun</h4>

                </div>
              );
            })}
          </div>

          {/* Table Pengguna */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Daftar Pengguna Sistem Persuratan BKPSDMD
                </h3>
                <p className="text-xs text-slate-500">
                  Role-Based Access Control (LOKET, SEKRETARIAT, KEPALA_BADAN, KEPALA_BAGIAN, ADMIN)
                </p>
              </div>
              <button
                onClick={() => handleOpenUserModal()}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pengguna Baru</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <th className="py-3 px-3">NAMA PENGGUNA</th>
                    <th className="py-3 px-3">USERNAME</th>
                    <th className="py-3 px-3">ROLE</th>
                    <th className="py-3 px-3">BAGIAN</th>
                    <th className="py-3 px-3">STATUS</th>
                    <th className="py-3 px-3 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 whitespace-nowrap">
                        <p className="font-bold text-slate-900">{u.nama}</p>
                        <p className="text-[10px] font-mono text-slate-500">NIP: {u.nip || '-'}</p>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-slate-700 whitespace-nowrap">
                        @{u.username}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-900 text-emerald-300">
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-purple-900 font-semibold whitespace-nowrap">
                        {u.nama_bagian || 'Pimpinan / Umum'}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <button
                          onClick={() => toggleStatusUser(u.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${u.status_aktif
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {u.status_aktif ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>Aktif</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>Nonaktif</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => handleOpenUserModal(u)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition inline-flex"
                          title="Edit Pengguna & Reset Password"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus pengguna ${u.nama}?`)) {
                              hapusUser(u.id);
                            }
                          }}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition inline-flex"
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB PENGELOLAAN DATA MASTER */}
      {!isStatusView && activeTab === 'master' && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Pengelolaan Data Master Persuratan
              </h3>
              <p className="text-xs text-slate-500">
                Data referensi dinamis yang digunakan oleh seluruh modul sistem persuratan.
              </p>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold gap-1">
              <button
                onClick={() => setMasterSubTab('kategori')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${masterSubTab === 'kategori' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Kategori Surat ({kategoriList.length})</span>
              </button>
              <button
                onClick={() => setMasterSubTab('bagian')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${masterSubTab === 'bagian' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Bagian / Bidang ({bagianList.length})</span>
              </button>
              <button
                onClick={() => setMasterSubTab('instruksi')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${masterSubTab === 'instruksi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
              >
                <ListChecks className="w-3.5 h-3.5" />
                <span>Instruksi Disposisi ({instruksiList.length})</span>
              </button>
            </div>
          </div>

          {/* SUB-TAB 1: KATEGORI SURAT MASUK */}
          {masterSubTab === 'kategori' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Tabel Kategori Surat Masuk</span>
                <button
                  onClick={() => handleOpenMasterModal('kategori')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Kategori</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3">Nama Kategori</th>
                      <th className="py-2.5 px-3">Keterangan / Ruang Lingkup</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {kategoriList.map((kat) => (
                      <tr key={kat.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-mono">{kat.id}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{kat.nama_kategori}</td>
                        <td className="py-2.5 px-3 text-slate-500">{kat.keterangan || '-'}</td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap space-x-1.5">
                          <button
                            onClick={() => handleOpenMasterModal('kategori', kat)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg inline-flex"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus kategori "${kat.nama_kategori}"?`)) {
                                hapusKategori(kat.id);
                              }
                            }}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg inline-flex"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: BAGIAN / BIDANG BKPSDMD */}
          {masterSubTab === 'bagian' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Tabel Bagian / Bidang di BKPSDMD</span>
                <button
                  onClick={() => handleOpenMasterModal('bagian')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Unit Kerja</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">Nama Unit Kerja / Bidang</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {bagianList.map((bg) => (
                      <tr key={bg.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{bg.nama_bagian}</td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap space-x-1.5">
                          <button
                            onClick={() => handleOpenMasterModal('bagian', bg)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg inline-flex"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus bagian "${bg.nama_bagian}"?`)) {
                                hapusBagian(bg.id);
                              }
                            }}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg inline-flex"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-TAB 3: INSTRUKSI DISPOSISI KEPALA BADAN */}
          {masterSubTab === 'instruksi' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Checklist Opsi Instruksi Disposisi Kepala Badan</span>
                <button
                  onClick={() => handleOpenMasterModal('instruksi')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Instruksi</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">No</th>
                      <th className="py-2.5 px-3">Teks Instruksi Disposisi Resmi</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {instruksiList.map((ins, i) => (
                      <tr key={ins.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-mono text-slate-400">{i + 1}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{ins.instruksi}</td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap space-x-1.5">
                          <button
                            onClick={() => handleOpenMasterModal('instruksi', ins)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg inline-flex"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus instruksi "${ins.instruksi}"?`)) {
                                hapusInstruksi(ins.id);
                              }
                            }}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg inline-flex"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. TAB REKAPITULASI BULANAN */}

      {
        !isStatusView && activeTab === 'rekap' && (() => {
          // Data rekapitulasi 12 bulan
          const rekapitulasiBulanan = rekapBulananDb;
          const handleExportPDF = () => {
            const tahun = new Date().getFullYear();
            const totalMasuk = rekapitulasiBulanan.reduce((sum: number, r: any) => sum + (r.masuk || 0), 0);
            const totalKeluar = rekapitulasiBulanan.reduce((sum: number, r: any) => sum + (r.keluar || 0), 0);
            const totalDisposisi = rekapitulasiBulanan.reduce((sum: number, r: any) => sum + (r.disposisi || 0), 0);
            const totalRasio = totalMasuk > 0 ? Math.round((totalDisposisi / totalMasuk) * 100) : 0;

            const rowsHtml = rekapitulasiBulanan
              .map((r: any, idx: number) => {
                const rasio = r.masuk > 0 ? Math.min(100, Math.round((r.disposisi / r.masuk) * 100)) : 0;
                return `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td>${r.bulan}</td>
          <td style="text-align:center;">${r.masuk}</td>
          <td style="text-align:center;">${r.keluar}</td>
          <td style="text-align:center;">${r.disposisi}</td>
          <td style="text-align:center;">${rasio}%</td>
        </tr>
      `;
              })
              .join('');
            const logoUrl = new URL(LOGO_KOTA_BITUNG_SULAWESI_UTARA, window.location.origin).href;
            const printWindow = window.open('', '_blank', 'width=900,height=700');
            if (!printWindow) return;

            printWindow.document.write(`
    <html>
      <head>
        <title>Laporan Rekapitulasi Persuratan BKPSDMD ${tahun}</title>
        <style>
          @page { size: A4; margin: 16mm; }
          body { font-family: Arial, sans-serif; color: #0f172a; margin: 0; }
          .kop { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 18px; }
          .kop h2 { margin: 0; font-size: 14pt; }
          .kop h3 { margin: 2px 0; font-size: 12pt; }
          .kop p { margin: 4px 0 0; font-size: 10pt; color: #475569; }
          table { width: 100%; border-collapse: collapse; font-size: 10pt; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; }
          th { background-color: #047857; color: #ffffff; }
          tfoot td { background-color: #f1f5f9; font-weight: bold; }
          .ttd { margin-top: 36px; float: right; width: 240px; text-align: left; font-size: 10pt; }
        </style>
      </head>
      <body>
        <div class="kop">
        <img
    src="${logoUrl}"
    alt="Logo Kota Bitung"
    style="height: 64px; width: auto; display: block; margin: 0 auto 8px auto;"
  />
          <h3>
          PEMERINTAH KOTA BITUNG
          </h3>
          <h2>BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA DAERAH</h2>
          <p>Laporan Rekapitulasi Aktivitas Persuratan Digital — Tahun ${tahun}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Bulan Pelaporan</th>
              <th>Surat Masuk</th>
              <th>Surat Keluar</th>
              <th>Disposisi</th>
              <th>Rasio Selesai</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="text-align:center;">TOTAL</td>
              <td style="text-align:center;">${totalMasuk}</td>
              <td style="text-align:center;">${totalKeluar}</td>
              <td style="text-align:center;">${totalDisposisi}</td>
              <td style="text-align:center;">${totalRasio}%</td>
            </tr>
          </tfoot>
        </table>
        <div class="ttd">
          <p>Bitung, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>Kepala BKPSDMD Kota Bitung,</p>
          <br/><br/><br/>
          <p><strong>______________________________</strong></p>
        </div>
      </body>
    </html>
  `);

            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
              printWindow.print();
              printWindow.close();
            }, 300);
          };


          const maxChartValue = Math.max(...rekapitulasiBulanan.map((r) => Math.max(r.masuk, r.keluar, r.disposisi))) || 50;

          // Fungsi Ekspor CSV / Excel
          const handleExportCSV = () => {
            const tahun = new Date().getFullYear();
            const totalMasuk = rekapitulasiBulanan.reduce((sum: number, r: any) => sum + (r.masuk || 0), 0);
            const totalKeluar = rekapitulasiBulanan.reduce((sum: number, r: any) => sum + (r.keluar || 0), 0);
            const totalDisposisi = rekapitulasiBulanan.reduce((sum: number, r: any) => sum + (r.disposisi || 0), 0);
            const totalRasio = totalMasuk > 0 ? Math.round((totalDisposisi / totalMasuk) * 100) : 0;

            const rowsHtml = rekapitulasiBulanan
              .map((r: any) => {
                const rasio = r.masuk > 0 ? Math.min(100, Math.round((r.disposisi / r.masuk) * 100)) : 0;
                return `
        <tr>
          <td style="border:1px solid #cbd5e1; padding:6px 10px;">${r.bulan}</td>
          <td style="border:1px solid #cbd5e1; padding:6px 10px; text-align:center;">${r.masuk}</td>
          <td style="border:1px solid #cbd5e1; padding:6px 10px; text-align:center;">${r.keluar}</td>
          <td style="border:1px solid #cbd5e1; padding:6px 10px; text-align:center;">${r.disposisi}</td>
          <td style="border:1px solid #cbd5e1; padding:6px 10px; text-align:center;">${rasio}%</td>
        </tr>
      `;
              })
              .join('');

            const tableHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8" /></head>
    <body>
      <table>
        <tr>
          <td colspan="5" style="font-size:14pt; font-weight:bold;">REKAPITULASI PERSURATAN E-SURAT BKPSDMD KOTA BITUNG</td>
        </tr>
        <tr>
          <td colspan="5" style="font-size:10pt; color:#475569;">Tahun Pelaporan: ${tahun}</td>
        </tr>
        <tr><td colspan="5"></td></tr>
        <thead>
          <tr style="background-color:#047857; color:#ffffff; font-weight:bold;">
            <th style="border:1px solid #047857; padding:8px 12px;">Bulan Pelaporan</th>
            <th style="border:1px solid #047857; padding:8px 12px;">Surat Masuk (Registrasi)</th>
            <th style="border:1px solid #047857; padding:8px 12px;">Surat Keluar Internal</th>
            <th style="border:1px solid #047857; padding:8px 12px;">Disposisi Diterbitkan</th>
            <th style="border:1px solid #047857; padding:8px 12px;">Rasio Penyelesaian</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          <tr style="background-color:#f1f5f9; font-weight:bold;">
            <td style="border:1px solid #cbd5e1; padding:8px 10px;">TOTAL</td>
            <td style="border:1px solid #cbd5e1; padding:8px 10px; text-align:center;">${totalMasuk}</td>
            <td style="border:1px solid #cbd5e1; padding:8px 10px; text-align:center;">${totalKeluar}</td>
            <td style="border:1px solid #cbd5e1; padding:8px 10px; text-align:center;">${totalDisposisi}</td>
            <td style="border:1px solid #cbd5e1; padding:8px 10px; text-align:center;">${totalRasio}%</td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
  `;

            const blob = new Blob(['\uFEFF', tableHtml], {
              type: 'application/vnd.ms-excel;charset=utf-8;',
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Rekapitulasi_Persuratan_BKPSDMD_${tahun}.xls`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          };


          return (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-emerald-600" />
                  <span>Rekapitulasi Persuratan BKPSDMD Kota Bitung</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Grafik komparasi 3 metrik tata kelola: Surat Masuk, Surat Keluar Internal, dan Lembar Disposisi Kepala Badan
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
                {/* Header Tab & Tombol Aksi (Cetak + Ekspor CSV) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={handleExportPDF}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak / Ekspor PDF</span>
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Ekspor Excel</span>
                    </button>
                  </div>
                </div>

                {/* 3 Kartu Ringkasan Statistik */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl text-blue-950">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Surat Masuk Terdaftar</p>
                    <h3 className="text-3xl font-black mt-1">{suratMasukList.length}</h3>
                    <p className="text-[11px] text-blue-800/80 mt-1">Registrasi lengkap dengan nomor agenda resmi</p>
                  </div>

                  <div className="p-5 bg-purple-50 border border-purple-200 rounded-2xl text-purple-950">
                    <p className="text-xs font-bold uppercase tracking-wider text-purple-700">Surat Keluar Internal</p>
                    <h3 className="text-3xl font-black mt-1">{suratKeluarList.length}</h3>
                    <p className="text-[11px] text-purple-800/80 mt-1">Dikelola dengan sistem versioning naskah</p>
                  </div>

                  <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Lembar Disposisi Diterbitkan</p>
                    <h3 className="text-3xl font-black mt-1">
                      {suratMasukList.filter((s) => s.disposisi).length}
                    </h3>
                    <p className="text-[11px] text-emerald-800/80 mt-1">Arahan pimpinan yang sedang/selesai diproses</p>
                  </div>
                </div>

                {/* Visualisasi Grafik Batang */}
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Visualisasi Aktivitas Per Bulan
                    </span>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-blue-700">
                        <span className="w-3 h-3 rounded-xs bg-blue-500 inline-block"></span> Surat Masuk
                      </span>
                      <span className="flex items-center gap-1.5 text-purple-700">
                        <span className="w-3 h-3 rounded-xs bg-purple-500 inline-block"></span> Surat Keluar
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block"></span> Disposisi
                      </span>
                    </div>
                  </div>

                  {/* Bar Chart Container */}
                  <div className="h-56 flex items-end justify-between gap-1 sm:gap-2 pt-6 px-2 border-b border-slate-300">
                    {rekapitulasiBulanan.map((item, idx) => {
                      const pctMasuk = (item.masuk / maxChartValue) * 100;
                      const pctKeluar = (item.keluar / maxChartValue) * 100;
                      const pctDisposisi = (item.disposisi / maxChartValue) * 100;

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                          <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                            <div
                              style={{ height: `${pctMasuk}%` }}
                              className="w-1.5 sm:w-2.5 bg-blue-500 rounded-t-xs hover:bg-blue-600 transition"
                              title={`Surat Masuk: ${item.masuk}`}
                            />
                            <div
                              style={{ height: `${pctKeluar}%` }}
                              className="w-1.5 sm:w-2.5 bg-purple-500 rounded-t-xs hover:bg-purple-600 transition"
                              title={`Surat Keluar: ${item.keluar}`}
                            />
                            <div
                              style={{ height: `${pctDisposisi}%` }}
                              className="w-1.5 sm:w-2.5 bg-emerald-500 rounded-t-xs hover:bg-emerald-600 transition"
                              title={`Disposisi: ${item.disposisi}`}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono mt-2 truncate w-full text-center">
                            {item.bulan.substring(0, 3)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tabel Rincian Data Rekapitulasi Persuratan */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                    Tabel Rincian Data Rekapitulasi Persuratan
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse border border-slate-200 rounded-xl overflow-hidden">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <th className="py-2.5 px-3">Bulan Pelaporan</th>
                          <th className="py-2.5 px-3 text-center">Surat Masuk (Registrasi)</th>
                          <th className="py-2.5 px-3 text-center">Surat Keluar Internal</th>
                          <th className="py-2.5 px-3 text-center">Disposisi Diterbitkan</th>
                          <th className="py-2.5 px-3 text-center">Rasio Penyelesaian</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {rekapitulasiBulanan.map((row, i) => {
                          const rasio = row.masuk > 0 ? Math.round((row.disposisi / row.masuk) * 100) : 0;
                          return (
                            <tr key={i} className="hover:bg-slate-50 transition">
                              <td className="py-2 px-3 font-semibold text-slate-900">{row.bulan}</td>
                              <td className="py-2 px-3 text-center font-mono">{row.masuk}</td>
                              <td className="py-2 px-3 text-center font-mono">{row.keluar}</td>
                              <td className="py-2 px-3 text-center font-mono">{row.disposisi}</td>
                              <td className="py-2 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${rasio >= 90
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : rasio >= 70
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-slate-100 text-slate-600'
                                    }`}
                                >
                                  {rasio}% Selesai
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </>
          );
        })()
      }

      {/* 4. TAB LOG AKTIVITAS (AUDIT TRAIL) */}
      {
        !isStatusView && activeTab === 'log' && (
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Audit Trail Log Aktivitas Sistem Persuratan
                </h3>
                <p className="text-xs text-slate-500">
                  Pencatatan real-time setiap mutasi data, pembuatan surat, verifikasi, disposisi, dan perubahan status.
                </p>
              </div>

              {/* Filter Bar */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchLog}
                    onChange={(e) => setSearchLog(e.target.value)}
                    placeholder="Cari log aktivitas..."
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={filterRoleLog}
                    onChange={(e) => setFilterRoleLog(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="semua">Semua Role</option>
                    <option value="LOKET">LOKET</option>
                    <option value="SEKRETARIAT">SEKRETARIAT</option>
                    <option value="KEPALA_BADAN">KEPALA BADAN</option>
                    <option value="KEPALA_BAGIAN">KEPALA BAGIAN</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <th className="py-3 px-3">Waktu</th>
                    <th className="py-3 px-3">Nama Pengguna</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Jenis Aksi</th>
                    <th className="py-3 px-3">Keterangan Aktivitas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLog.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        Tidak ada rekaman log aktivitas yang sesuai.
                      </td>
                    </tr>
                  ) : (
                    filteredLog.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                          {log.created_at}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                          {log.nama_user}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800">
                            {log.role}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-emerald-800 whitespace-nowrap">
                          {log.aksi}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 max-w-md">
                          {log.keterangan}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      }

      {/* MODAL USER CRUD */}
      {
        modalUserOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
              <h3 className="font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100">
                {editingUserId ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
              </h3>

              <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nama Lengkap &amp; Gelar:
                  </label>
                  <input
                    type="text"
                    required
                    value={userNama}
                    onChange={(e) => setUserNama(e.target.value)}
                    placeholder="Contoh: Budi Santoso, S.STP"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    NIP Pegawai:
                  </label>
                  <input
                    type="text"
                    value={userNip}
                    onChange={(e) => setUserNip(e.target.value)}
                    placeholder="Contoh: 198506122010011008"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Username:
                    </label>
                    <input
                      type="text"
                      required
                      value={userUsername}
                      onChange={(e) => setUserUsername(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Password {editingUserId && '(Kosongkan jika tak diubah)'}:
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        placeholder={editingUserId ? 'Biarkan kosong' : 'Kata sandi'}
                        className="w-full p-2.5 pr-10 bg-white border border-slate-300 rounded-xl font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer transition"
                        title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Role Sistem:
                    </label>
                    <select
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value as UserRole)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                    >
                      <option value="LOKET">LOKET</option>
                      <option value="SEKRETARIAT">SEKRETARIAT</option>
                      <option value="KEPALA_BADAN">KEPALA BADAN</option>
                      <option value="KEPALA_BAGIAN">KEPALA BAGIAN</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Unit Kerja / Bagian:
                    </label>
                    <select
                      value={userIdBagian || ''}
                      onChange={(e) => setUserIdBagian(e.target.value ? Number(e.target.value) : null)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    >
                      <option value="">(Pimpinan / Umum)</option>
                      {bagianList.map((bg) => (
                        <option key={bg.id} value={bg.id}>
                          {bg.nama_bagian}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Jabatan Kedinasan:
                  </label>
                  <input
                    type="text"
                    required
                    value={userJabatan}
                    onChange={(e) => setUserJabatan(e.target.value)}
                    placeholder="Contoh: Analis SDM Aparatur Ahli Muda"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalUserOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                  >
                    Simpan Pengguna
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* MODAL MASTER DATA CRUD */}
      {
        modalMasterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
              <h3 className="font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100">
                {masterEditingId ? 'Edit' : 'Tambah'} {masterType === 'kategori' ? 'Kategori Surat' : masterType === 'bagian' ? 'Unit Kerja / Bagian' : 'Instruksi Disposisi'}
              </h3>

              <form onSubmit={handleSaveMaster} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {masterType === 'kategori' ? 'Nama Kategori:' : masterType === 'bagian' ? 'Kode Bagian (Singkatan):' : 'Teks Instruksi:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={masterField1}
                    onChange={(e) => setMasterField1(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                {masterType !== 'instruksi' && (
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {masterType === 'kategori' ? 'Keterangan Kategori:' : 'Nama Lengkap Bagian / Bidang:'}
                    </label>
                    <input
                      type="text"
                      value={masterField2}
                      onChange={(e) => setMasterField2(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalMasterOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                  >
                    Simpan Master Data
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div >
  );
};
