/**
 * @file Sidebar.tsx
 * @description Sidebar Navigasi Utama Sistem Persuratan BKPSDMD Kota Bitung
 * - Menampilkan Menu Utama Role tanpa bagian profil (profil sudah pindah ke Header)
 */

import React from 'react';
import { usePersuratan } from '../context/PersuratanContext';
import { UserRole } from '../types';
import {
  Inbox,
  FileCheck2,
  Crown,
  Briefcase,
  Shield,
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
  CheckCircle
} from 'lucide-react';
import { span } from 'motion/react-client';

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

  const suratKeluarMenungguApproval = suratKeluarList.filter(
    (sk) => sk.status_persetujuan === 'PENGAJUAN_KE_KEPALA_BADAN'
  );

  const menungguDisposisi = suratMasukList.filter(
    (sm) => sm.status_surat === 'MENUNGGU_DISPOSISI_KEPALA_BADAN'
  );
  const totalMenungguDisposisi = menungguDisposisi.length;
  const totalMenungguVerifikasi = suratMasukList.filter(
    (sm) => sm.status_surat === 'MENUNGGU_VERIFIKASI_SEKRETARIAT'
  );


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

          {/* MENU UTAMA PERAN (Langsung di paling atas) */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-800 pb-2">
              Menu Utama {badgeInfo.label}
            </div>

            {/* ROLE: LOKET */}
            {currentUser.role === 'LOKET' && (
              <>
                <button
                  onClick={() => handleItemClick('input')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'input'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <FilePlus className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Form Registrasi Surat Masuk</span>
                </button>
                <button
                  onClick={() => handleItemClick('daftar')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'daftar'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <ListFilter className="w-4 h-4 text-blue-400 shrink-0" />
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'verifikasi'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">Verifikasi Surat Masuk</span>
                  </div>
                  {totalMenungguVerifikasi.length > 0 && (
                    <span className="text-[11px] font-mono font-bold text-slate-300 bg-red-600 px-2 py-0.5 rounded-full">
                      {totalMenungguVerifikasi.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleItemClick('terverifikasi')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'terverifikasi'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">Daftar Terverifikasi</span>
                  </div>
                </button>
                <button
                  onClick={() => handleItemClick('pengembalian')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'pengembalian'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <Inbox className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Pengembalian Surat</span>
                </button>
                <button
                  onClick={() => handleItemClick('penerusan')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'penerusan' || activeMenu === 'penerusan_kaban' || activeMenu === 'penerusan_bagian'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <Send className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Penerusan Surat</span>
                </button>
                <button
                  onClick={() => handleItemClick('status_penerusan')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'status_penerusan'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <ListOrdered className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Status Penerusan Surat</span>
                </button>
                <button
                  onClick={() => handleItemClick('rekapitulasiBulanan')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'rekapitulasiBulanan'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Laporan Rekapitulasi</span>
                </button>
              </>
            )}

            {/* ROLE: KEPALA_BADAN */}
            {currentUser.role === 'KEPALA_BADAN' && (
              <>
                <button
                  onClick={() => handleItemClick('eksekutif')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'eksekutif'
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Dashboard Eksekutif</span>
                </button>
                <button
                  onClick={() => handleItemClick('surat_masuk')}
                  className={`w-full flex items-center justify-start gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'surat_masuk'
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">Disposisi Surat</span>
                  </div>
                  <span>
                    {menungguDisposisi.length > 0 && (
                      <span className='px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px]'>
                        {menungguDisposisi.length}
                      </span>
                    )}
                  </span>


                </button>
                <button
                  onClick={() => handleItemClick('persetujuan_keluar')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'persetujuan_keluar'
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-2.5 mr-2">
                    <FileCheck2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-[12px]">Pemeriksaan &amp; Persetujuan Surat Keluar</span>
                  </div>
                  <span className='px-1.5 py-0.2 rounded-full text-white text-[10px]'>
                    {suratKeluarMenungguApproval.length > 0 && (
                      <span className='px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px]'>
                        {suratKeluarMenungguApproval.length}
                      </span>
                    )}
                  </span>
                </button>
              </>
            )}

            {/* ROLE: KEPALA_BAGIAN */}
            {currentUser.role === 'KEPALA_BAGIAN' && (
              <>
                <button
                  onClick={() => handleItemClick('masuk_bagian')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'masuk_bagian'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="truncate">Pengarsipan Surat</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
                    {suratMasukList.filter(s => s.disposisi && s.disposisi.id_bagian_tujuan === (currentUser.id_bagian || 3)).length}
                  </span>
                </button>
                <button
                  onClick={() => handleItemClick('input_keluar')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'input_keluar'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <FilePlus className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Buat Konsep Surat Keluar</span>
                </button>
                <button
                  onClick={() => handleItemClick('daftar_keluar')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'daftar_keluar'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <ListOrdered className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="truncate">Riwayat Surat Keluar</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
                    {suratKeluarList.filter(sk => sk.id_bagian_pengirim === (currentUser.id_bagian || 3)).length}
                  </span>
                </button>
              </>
            )}

            {/* ROLE: ADMIN */}
            {currentUser.role === 'ADMIN' && (
              <>
                <button
                  onClick={() => handleItemClick('rekap')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'rekap'
                    ? 'bg-slate-700 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <BarChart3 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Rekapan Aktivitas Surat</span>
                </button>
                <button
                  onClick={() => handleItemClick('users')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'users'
                    ? 'bg-slate-700 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Manajemen Pengguna</span>
                </button>
                <button
                  onClick={() => handleItemClick('master')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'master'
                    ? 'bg-slate-700 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <Database className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Pengelolaan Data Master</span>
                </button>
                <button
                  onClick={() => handleItemClick('log')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${activeMenu === 'log'
                    ? 'bg-slate-700 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <History className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Log Aktivitas</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom Bar: Skema & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/40">
          {onOpenSchemaModal && (
            <button
              onClick={onOpenSchemaModal}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition border border-slate-700/60 cursor-pointer min-h-[40px]"
            >
              <Database className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Skema SQL &amp; Controller API</span>
            </button>
          )}

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
      </aside >
    </>
  );
};