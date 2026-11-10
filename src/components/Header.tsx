/**
 * @file Header.tsx
 * @description Navbar & Header Resmi BKPSDMD Kota Bitung
 * - Responsif untuk semua perangkat (iOS, Android, Windows, Mac)
 * - Menampilkan Informasi Profil Pengguna Aktif di Header (Nama, NIP, Role Badge)
 */

import React, { useState, useEffect } from 'react';
import LOGO_KOTA_BITUNG_SULAWESI_UTARA from "../assets/LOGO_KOTA_BITUNG_SULAWESI_UTARA.png";
import { usePersuratan } from '../context/PersuratanContext';
import { UserRole } from '../types';
import {
  Database,
  RotateCcw,
  Clock,
  ChevronDown,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  User as UserIcon
} from 'lucide-react';

interface HeaderProps {
  onOpenSchemaModal: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSchemaModal,
  onToggleSidebar,
  isSidebarOpen = true
}) => {
  const { currentUser, switchUser, users, resetDatabase } = usePersuratan();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      setCurrentTime(now.toLocaleDateString('id-ID', options) + ' WITA');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'LOKET':
        return { label: 'LOKET', bg: 'bg-blue-600 text-white' };
      case 'SEKRETARIAT':
        return { label: 'SEKRETARIAT', bg: 'bg-emerald-600 text-white' };
      case 'KEPALA_BADAN':
        return { label: 'KEPALA BADAN', bg: 'bg-amber-600 text-white' };
      case 'KEPALA_BAGIAN':
        return { label: 'KEPALA BAGIAN', bg: 'bg-purple-600 text-white' };
      case 'ADMIN':
        return { label: 'ADMIN', bg: 'bg-slate-700 text-white' };
      default:
        return { label: role, bg: 'bg-slate-600 text-white' };
    }
  };

  const badgeInfo = currentUser ? getRoleBadge(currentUser.role) : null;

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md select-none">
      {/* Top Banner Pemerintah Kota Bitung */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 px-3 sm:px-4 py-1 text-[10px] sm:text-[11px] text-slate-300 flex items-center justify-between border-b border-emerald-900/40">
        <div className="flex items-center gap-1.5 sm:gap-2 truncate mr-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="font-semibold text-emerald-400 shrink-0">Pemkot Bitung</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 truncate">BKPSDMD Kota Bitung</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] sm:text-[11px] shrink-0">
          <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>{currentTime || 'WITA'}</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="w-full px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Button Toggle Sidebar & Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-650 text-slate-200 hover:text-white transition border border-slate-700/80 flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              title={isSidebarOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
              aria-label="Toggle Sidebar Navigasi"
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              ) : (
                <PanelLeftOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              )}
            </button>
          )}

          {/* Logo Brand */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
            <img
              src={LOGO_KOTA_BITUNG_SULAWESI_UTARA}
              alt="LOGO KOTA BITUNG"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-sm sm:text-lg tracking-tight text-white font-sans truncate">
                E-SURAT <span className="text-emerald-400 font-black">BKPSDMD</span>
              </span>
              <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 font-bold uppercase tracking-wider hidden sm:inline-block">
                BITUNG
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden lg:block -mt-0.5 truncate">
              Tata Kelola Surat Masuk &amp; Keluar Digital Antar-Bagian
            </p>
          </div>
        </div>

        {/* Right Controls: User Profile + Role Switcher & Database Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Tombol Skema SQL & API */}
          <button
            onClick={onOpenSchemaModal}
            className="p-2 sm:px-2.5 sm:py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-650 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition shadow-xs cursor-pointer"
            title="Lihat skema SQL XAMPP 7.3 & arsitektur Controller"
          >
            <Database className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="hidden xl:inline">Skema SQL &amp; API</span>
          </button>

          {/* Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="p-2 sm:px-2.5 sm:py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-700/60 transition shadow-xs cursor-pointer"
              title="Ganti Peran Pengguna untuk Pengujian Alur"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Role:</span>
              <span className="text-white bg-emerald-800/80 px-1.5 sm:px-2 py-0.5 rounded font-mono text-[10px] sm:text-[11px]">
                {currentUser?.role || 'PILIH'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </button>

            {showRoleMenu && (
              <div
                className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs animate-scale-up"
                onMouseLeave={() => setShowRoleMenu(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400">
                  Ganti Akun / Peran (5 Role Sistem):
                </div>
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 transition cursor-pointer ${currentUser?.id === u.id ? 'bg-emerald-950/70 border-l-2 border-emerald-400' : ''
                      }`}
                  >
                    <div className="truncate pr-2">
                      <p className="font-bold text-slate-200 truncate">{u.nama}</p>
                      <p className="text-[10px] text-slate-400 truncate">{u.jabatan}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${getRoleBadge(u.role).bg}`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PROFIL PENGGUNA (PINDAHAN DARI SIDEBAR) */}
          {currentUser && (
            <div className="flex items-center gap-2.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white shadow-xs">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-xs border border-emerald-500/30 shrink-0">
                {currentUser.nama ? currentUser.nama.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              <div className="text-left leading-tight hidden md:block max-w-[150px] lg:max-w-[180px]">
                <p className="text-xs font-bold text-slate-100 truncate" title={currentUser.nama}>
                  {currentUser.nama}
                </p>
                <p className="text-[10px] font-mono text-slate-400 truncate">
                  {currentUser.nip ? `NIP. ${currentUser.nip}` : badgeInfo?.label}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};