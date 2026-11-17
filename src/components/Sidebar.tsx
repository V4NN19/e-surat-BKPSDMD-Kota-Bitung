/**
 * @file Sidebar.tsx
 * @description Sidebar Navigasi Utama Sistem Persuratan BKPSDMD Kota Bitung
 * Menampilkan Menu Utama Role tanpa bagian profil (profil sudah pindah ke Header)
 */

import React from 'react';
import { usePersuratan } from '../context/PersuratanContext';
import { UserRole } from '../types';
import {
  Inbox,
  FileCheck2,
  Crown,
  FilePlus,
  ListFilter,
  Send,
  BarChart3,
  ListOrdered,
  Users,
  Database,
  History,
  LogOut,
  FileText,
  CheckCircle,
  Archive
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeMenu: string;
  onSelectMenu: (menu: string) => void;
  onOpenSchemaModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeMenu,
  onSelectMenu,
  onOpenSchemaModal
}) => {
  const { currentUser, logout, suratMasukList, suratKeluarList } = usePersuratan();

  if (!currentUser) return null;

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'LOKET':
        return { label: 'LOKET' };
      case 'SEKRETARIAT':
        return { label: 'SEKRETARIAT' };
      case 'KEPALA_BADAN':
        return { label: 'KEPALA BADAN' };
      case 'KEPALA_BAGIAN':
        return { label: 'KEPALA BAGIAN' };
      case 'ADMIN':
        return { label: 'ADMINISTRATOR' };
      default:
        return { label: role };
    }
  };

  const badgeInfo = getRoleBadge(currentUser.role);

  const handleItemClick = (menuKey: string) => {
    onSelectMenu(menuKey);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onClose();
    }
  };

  const getMenuClass = (isActive: boolean) =>
    isActive
      ? 'bg-emerald-600 text-white font-bold shadow-xs'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white';

  const getIconClass = (isActive: boolean) =>
    `w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'}`;

  const suratKeluarMenungguApproval = suratKeluarList.filter(
    (sk) => sk.status_persetujuan === 'PENGAJUAN_KE_KEPALA_BADAN'
  );

  const menungguDisposisi = suratMasukList.filter(
    (sm) => sm.status_surat === 'MENUNGGU_DISPOSISI_KEPALA_BADAN'
  );

  const totalMenungguVerifikasi = suratMasukList.filter(
    (sm) => sm.status_surat === 'MENUNGGU_VERIFIKASI_SEKRETARIAT'
  );


  // Hitung surat masuk yang siap diarsip (sesuaikan dengan filter yang sudah ada di Sidebar Anda)
  const suratMasukSiapArsipCount = (suratMasukList || []).filter(
    (s) => s.status_surat === 'SELESAI'
  ).length;

  // Hitung surat keluar internal yang sudah dilihat bagian tujuan & siap diarsip
  const suratKeluarSiapArsipCount = (suratKeluarList || []).filter(
    (sk) => sk.status_persetujuan === 'DITERIMA_BAGIAN_TUJUAN'
  ).length;

  const totalSiapArsip = suratMasukSiapArsipCount + suratKeluarSiapArsipCount;

  return (
    <>
      {/* Backdrop Gelap untuk Mobile / Tablet saat Sidebar Terbuka */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Component */}
      <aside
        className={`flex flex-col lg:static top-0 bottom-0 left-0 z-80 bg-slate-900 text-slate-200 justify-between transition-all duration-300 ease-in-out shrink-0 select-none ${isOpen
          ? 'w-72 sm:w-70 translate-x-0 opacity-100 shadow-2xl lg:shadow-none'
          : '-translate-x-full lg:translate-x-0 lg:w-0 lg:opacity-0 lg:overflow-hidden lg:border-none lg:p-0'
          }`}
      >
        {/* Kontainer Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* MENU UTAMA PERAN */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-800 pb-2">
              Menu Utama {badgeInfo.label}
            </div>

            {/* ROLE: LOKET */}
            {currentUser.role === 'LOKET' && (
              <>
                <button
                  onClick={() => handleItemClick('input')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'input')}`}
                >
                  <FilePlus className={getIconClass(activeMenu === 'input')} />
                  <span>Form Registrasi Surat Masuk</span>
                </button>
                <button
                  onClick={() => handleItemClick('daftar')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'daftar')}`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <ListFilter className={getIconClass(activeMenu === 'daftar')} />
                    <span className="truncate">Daftar Surat Diinput</span>
                  </div>
                </button>
              </>
            )}

            {/* ROLE: SEKRETARIAT */}
            {currentUser.role === 'SEKRETARIAT' && (
              <>
                <button
                  onClick={() => handleItemClick('verifikasi')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'verifikasi')}`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <FileCheck2 className={getIconClass(activeMenu === 'verifikasi')} />
                    <span className="truncate">Verifikasi Surat Masuk</span>
                  </div>
                  {totalMenungguVerifikasi.length > 0 && (
                    <span className="text-[11px] font-mono font-bold text-white bg-red-600 px-2 py-0.5 rounded-full">
                      {totalMenungguVerifikasi.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleItemClick('terverifikasi')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'terverifikasi')}`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <CheckCircle className={getIconClass(activeMenu === 'terverifikasi')} />
                    <span className="truncate">Daftar Terverifikasi</span>
                  </div>
                </button>
                <button
                  onClick={() => handleItemClick('pengembalian')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'pengembalian')}`}
                >
                  <Inbox className={getIconClass(activeMenu === 'pengembalian')} />
                  <span>Pengembalian Surat</span>
                </button>
                <button
                  onClick={() => handleItemClick('penerusan')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(
                    activeMenu === 'penerusan' || activeMenu === 'penerusan_kaban' || activeMenu === 'penerusan_bagian'
                  )}`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <Send
                      className={getIconClass(
                        activeMenu === 'penerusan' || activeMenu === 'penerusan_kaban' || activeMenu === 'penerusan_bagian'
                      )}
                    />
                    <span className="truncate">Penerusan Surat</span>
                  </div>
                  {suratKeluarList.filter((sk) => sk.status_persetujuan === 'DISETUJUI_KEPALA_BADAN').length > 0 && (
                    <span className="text-[11px] font-mono font-bold text-white bg-indigo-600 px-2 py-0.5 rounded-full">
                      {suratKeluarList.filter((sk) => sk.status_persetujuan === 'DISETUJUI_KEPALA_BADAN').length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleItemClick('status_penerusan')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'status_penerusan')}`}
                >
                  <ListOrdered className={getIconClass(activeMenu === 'status_penerusan')} />
                  <span>Status Penerusan Surat</span>
                </button>

                <button
                  onClick={() => handleItemClick('arsip')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'arsip')}`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <Archive className={getIconClass(activeMenu === 'arsip')} />
                    <span className="truncate">Arsip Surat</span>
                  </div>
                  {totalSiapArsip > 0 && (
                    <span className="text-[11px] font-mono font-bold text-white bg-red-600 px-2 py-0.5 rounded-full">
                      {totalSiapArsip}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleItemClick('rekapitulasiBulanan')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'rekapitulasiBulanan')}`}
                >
                  <BarChart3 className={getIconClass(activeMenu === 'rekapitulasiBulanan')} />
                  <span>Laporan Rekapitulasi</span>
                </button>
              </>
            )}

            {/* ROLE: KEPALA_BADAN */}
            {currentUser.role === 'KEPALA_BADAN' && (
              <>
                <button
                  onClick={() => handleItemClick('eksekutif')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'eksekutif')}`}
                >
                  <Crown className={getIconClass(activeMenu === 'eksekutif')} />
                  <span>Dashboard Eksekutif</span>
                </button>
                <button
                  onClick={() => handleItemClick('surat_masuk')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'surat_masuk')}`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <FileText className={getIconClass(activeMenu === 'surat_masuk')} />
                    <span className="truncate">Disposisi Surat</span>
                  </div>
                  {menungguDisposisi.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-mono font-bold">
                      {menungguDisposisi.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleItemClick('persetujuan_keluar')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'persetujuan_keluar')}`}
                >
                  <div className="flex items-center gap-2.5 mr-2">
                    <FileCheck2 className={getIconClass(activeMenu === 'persetujuan_keluar')} />
                    <span className="text-[12px]">Pemeriksaan &amp; Persetujuan Surat Keluar</span>
                  </div>
                  {suratKeluarMenungguApproval.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-mono font-bold">
                      {suratKeluarMenungguApproval.length}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* ROLE: KEPALA_BAGIAN */}
            {currentUser.role === 'KEPALA_BAGIAN' && (
              <>
                <button
                  onClick={() => handleItemClick('masuk_bagian')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'masuk_bagian')}`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <FileText className={getIconClass(activeMenu === 'masuk_bagian')} />
                    <span className="truncate">Surat Masuk</span>
                  </div>
                  {(() => {
                    const totalAktif =
                      suratMasukList.filter(
                        (s) =>
                          s.disposisi &&
                          s.disposisi.id_bagian_tujuan === (currentUser.id_bagian || 3) &&
                          (s.status_surat === 'DITERUSKAN_KE_BAGIAN' || s.status_surat === 'SEDANG_DIPROSES')
                      ).length +
                      suratKeluarList.filter(
                        (sk) =>
                          Number(sk.id_bagian_tujuan) === Number(currentUser.id_bagian || 3) &&
                          sk.status_persetujuan === 'DITERUSKAN_KE_BAGIAN_TUJUAN'
                      ).length;

                    return totalAktif > 0 ? (
                      <span className="text-[11px] font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
                        {totalAktif}
                      </span>
                    ) : null;
                  })()}
                </button>
                <button
                  onClick={() => handleItemClick('input_keluar')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'input_keluar')}`}
                >
                  <FilePlus className={getIconClass(activeMenu === 'input_keluar')} />
                  <span>Buat Konsep Surat Keluar</span>
                </button>
                <button
                  onClick={() => handleItemClick('daftar_keluar')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'daftar_keluar')}`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <ListOrdered className={getIconClass(activeMenu === 'daftar_keluar')} />
                    <span className="truncate">Riwayat Surat Keluar</span>
                  </div>
                </button>
              </>
            )}

            {/* ROLE: ADMIN */}
            {currentUser.role === 'ADMIN' && (
              <>
                <button
                  onClick={() => handleItemClick('rekap')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'rekap')}`}
                >
                  <BarChart3 className={getIconClass(activeMenu === 'rekap')} />
                  <span>Rekapan Aktivitas Surat</span>
                </button>
                <button
                  onClick={() => handleItemClick('users')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'users')}`}
                >
                  <Users className={getIconClass(activeMenu === 'users')} />
                  <span>Manajemen Pengguna</span>
                </button>
                <button
                  onClick={() => handleItemClick('master')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'master')}`}
                >
                  <Database className={getIconClass(activeMenu === 'master')} />
                  <span>Pengelolaan Data Master</span>
                </button>
                <button
                  onClick={() => handleItemClick('log')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${getMenuClass(activeMenu === 'log')}`}
                >
                  <History className={getIconClass(activeMenu === 'log')} />
                  <span>Log Aktivitas</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom Bar: Skema & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/40">

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white rounded-xl text-xs font-bold transition border border-red-800/50 shadow-xs cursor-pointer min-h-[42px]"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Keluar dari Akun (Logout)</span>
          </button>

          <p className="text-[10px] text-center text-slate-500 pt-1">
            BKPSDMD Kota Bitung • Sulawesi Utara
          </p>
        </div>
      </aside>
    </>
  );
};