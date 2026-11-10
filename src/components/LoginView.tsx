/**
 * @file LoginView.tsx
 * @description Halaman Login Resmi Sistem Informasi Persuratan BKPSDMD Kota Bitung
 * Alur 2-Tahap: Pengguna wajib memilih Role terlebih dahulu, baru kemudian memasukkan Username & Password.
 */

import React, { useState } from 'react';
import { usePersuratan } from '../context/PersuratanContext';
import { UserRole } from '../types';
import {
  Building2,
  Lock,
  User,
  Shield,
  Inbox,
  FileCheck2,
  Crown,
  Briefcase,
  AlertCircle,
  Database,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';

interface LoginViewProps {
  onOpenSchemaModal: () => void;
}

interface RoleOption {
  role: UserRole;
  title: string;
  badge: string;
  badgeBg: string;
  accentBorder: string;
  accentBg: string;
  iconBg: string;
  icon: React.ElementType;
  description: string;
  defaultUsername: string;
  defaultPassword: string;
  demoAccountName: string;
}

const ROLES: RoleOption[] = [
  {
    role: 'LOKET',
    title: 'Loket Pelayanan Persuratan',
    badge: 'LOKET',
    badgeBg: 'bg-blue-600 text-white',
    accentBorder: 'hover:border-blue-500 border-slate-200',
    accentBg: 'hover:bg-blue-50/50',
    iconBg: 'bg-blue-100 text-blue-700',
    icon: Inbox,
    description: 'Penerimaan berkas fisik surat masuk, penomoran agenda otomatis, dan pengunggahan berkas PDF resmi.',
    defaultUsername: 'loket',
    defaultPassword: 'loket123',
    demoAccountName: 'Meidy Manoppo, S.AP'
  },
  {
    role: 'SEKRETARIAT',
    title: 'Sekretariat BKPSDMD',
    badge: 'SEKRETARIAT',
    badgeBg: 'bg-emerald-600 text-white',
    accentBorder: 'hover:border-emerald-500 border-slate-200',
    accentBg: 'hover:bg-emerald-50/50',
    iconBg: 'bg-emerald-100 text-emerald-700',
    icon: FileCheck2,
    description: 'Verifikasi keabsahan surat masuk, tata kelola pengembalian berkas, dan penerusan lembar disposisi.',
    defaultUsername: 'sekretariat',
    defaultPassword: 'sekretariat123',
    demoAccountName: 'Jenny Rawung, S.Sos'
  },
  {
    role: 'KEPALA_KANTOR',
    title: 'Kepala Kantor / Kepala Badan',
    badge: 'KEPALA BADAN',
    badgeBg: 'bg-amber-600 text-white',
    accentBorder: 'hover:border-amber-500 border-slate-200',
    accentBg: 'hover:bg-amber-50/50',
    iconBg: 'bg-amber-100 text-amber-700',
    icon: Crown,
    description: 'Pemantauan eksekutif posisi surat real-time, penerbitan lembar disposisi digital & persetujuan naskah dinas.',
    defaultUsername: 'kepala_kantor',
    defaultPassword: 'kepala123',
    demoAccountName: 'Forsman Dandel, S.Sos'
  },
  {
    role: 'KEPALA_BAGIAN',
    title: 'Kepala Bagian / Bidang',
    badge: 'KEPALA BAGIAN',
    badgeBg: 'bg-purple-600 text-white',
    accentBorder: 'hover:border-purple-500 border-slate-200',
    accentBg: 'hover:bg-purple-50/50',
    iconBg: 'bg-purple-100 text-purple-700',
    icon: Briefcase,
    description: 'Pengerjaan instruksi disposisi, pemrosesan tugas kedinasan, dan penyusunan konsep naskah dinas surat keluar.',
    defaultUsername: 'kabag_mutasi',
    defaultPassword: 'kabag123',
    demoAccountName: 'Christian Rumbayan, S.STP (Mutasi)'
  },
  {
    role: 'ADMIN',
    title: 'Administrator Sistem',
    badge: 'ADMIN',
    badgeBg: 'bg-slate-800 text-white',
    accentBorder: 'hover:border-slate-500 border-slate-200',
    accentBg: 'hover:bg-slate-50/70',
    iconBg: 'bg-slate-150 text-slate-800',
    icon: Shield,
    description: 'Manajemen akun pengguna & hak akses, master data dinas (kategori, bidang, instruksi), dan audit trail log.',
    defaultUsername: 'admin',
    defaultPassword: 'admin123',
    demoAccountName: 'Faisal Pangkey, S.Kom'
  }
];

export const LoginView: React.FC<LoginViewProps> = ({ onOpenSchemaModal }) => {
  const { login } = usePersuratan();

  // State Step Alur Login: 'SELECT_ROLE' -> 'ENTER_CREDENTIALS'
  const [step, setStep] = useState<'SELECT_ROLE' | 'ENTER_CREDENTIALS'>('SELECT_ROLE');
  const [selectedRole, setSelectedRole] = useState<UserRole>('LOKET');
  const [username, setUsername] = useState('loket');
  const [password, setPassword] = useState('loket123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const currentRoleInfo = ROLES.find(r => r.role === selectedRole) || ROLES[0];
  const CurrentRoleIcon = currentRoleInfo.icon;

  // Handle ketika pengguna memilih Role pada Tahap 1
  const handleSelectRole = (roleOption: RoleOption) => {
    setSelectedRole(roleOption.role);
    setUsername(roleOption.defaultUsername);
    setPassword(roleOption.defaultPassword);
    setErrorMessage('');
    setSuccessMessage('');
    // Lanjut ke Tahap 2: Input username & password
    setStep('ENTER_CREDENTIALS');
  };

  // Handle kembali ke pemilihan role
  const handleBackToSelectRole = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setStep('SELECT_ROLE');
  };

  // Submit login setelah role terpilih dan username/password dimasukkan
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Username dan Password wajib diisi.');
      return;
    }

    const res = login(username.trim(), password.trim(), selectedRole);
    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setSuccessMessage('Autentikasi berhasil! Mengalihkan ke dashboard...');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 flex flex-col justify-center py-10 sm:px-6 lg:px-8 font-sans">
      
      {/* Top Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center px-4">
        <div className="inline-flex p-3.5 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl shadow-xl shadow-emerald-900/40 border border-emerald-400/30 mb-3.5">
          <Building2 className="w-9 h-9 text-amber-300" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
          E-SURAT BKPSDMD
        </h1>
        <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase mt-0.5">
          PEMERINTAH KOTA BITUNG
        </p>
        <p className="text-xs text-slate-300 mt-2 max-w-lg mx-auto">
          Sistem Informasi Pengelolaan Surat Masuk &amp; Keluar Digital dengan Workflow Disposisi &amp; Versioning Naskah
        </p>

        {/* Stepper Indikator 2-Langkah */}
        <div className="mt-6 flex items-center justify-center gap-3 text-xs max-w-md mx-auto">
          <div
            onClick={step === 'ENTER_CREDENTIALS' ? handleBackToSelectRole : undefined}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition ${
              step === 'SELECT_ROLE'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-xs'
                : 'bg-slate-800/80 text-emerald-400 border-slate-700 cursor-pointer hover:bg-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[11px] font-black">
              {step === 'ENTER_CREDENTIALS' ? '✓' : '1'}
            </span>
            <span>1. Pilih Role</span>
          </div>

          <div className="w-8 h-0.5 bg-slate-700"></div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition ${
              step === 'ENTER_CREDENTIALS'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-xs'
                : 'bg-slate-800/40 text-slate-500 border-slate-700/50'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                step === 'ENTER_CREDENTIALS'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              2
            </span>
            <span>2. Masukkan Kredensial</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mt-7 sm:mx-auto sm:w-full px-4 sm:px-0">
        
        {/* TAHAP 1: PILIH ROLE TERLEBIH DAHULU */}
        {step === 'SELECT_ROLE' && (
          <div className="max-w-2xl mx-auto bg-white py-8 px-6 sm:px-8 shadow-2xl rounded-2xl border border-slate-200 animate-fade-in">
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Langkah 1 dari 2
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-2">
                Pilih Peran / Role Kedinasan Anda
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Sebelum memasukkan kredensial, silakan tentukan peran Anda sesuai tugas persuratan pada sistem.
              </p>
            </div>

            {/* Grid 5 Role Cards */}
            <div className="space-y-3">
              {ROLES.map((r) => {
                const IconComponent = r.icon;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleSelectRole(r)}
                    className={`w-full p-4 rounded-xl border text-left transition duration-150 flex items-start gap-4 cursor-pointer group bg-slate-50/60 ${r.accentBorder} ${r.accentBg}`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 transition group-hover:scale-105 shadow-xs ${r.iconBg}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-800 transition">
                          {r.title}
                        </h3>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${r.badgeBg}`}>
                          {r.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {r.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                        <span>Demo Akun: <strong className="text-slate-700">{r.demoAccountName}</strong></span>
                        <span className="text-emerald-700 font-bold group-hover:translate-x-1 transition inline-flex items-center gap-1">
                          Pilih Role Ini →
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Modal Trigger */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={onOpenSchemaModal}
                className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold inline-flex items-center gap-1.5 transition"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Lihat Skema SQL Database XAMPP 7.3 &amp; Dokumentasi Controller API</span>
              </button>
            </div>
          </div>
        )}

        {/* TAHAP 2: MASUKKAN USERNAME DAN PASSWORD */}
        {step === 'ENTER_CREDENTIALS' && (
          <div className="max-w-md mx-auto bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-200 animate-scale-up">
            
            {/* Header Form Tahap 2 */}
            <div className="mb-5 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Langkah 2 dari 2
                </span>
                <h2 className="text-base font-extrabold text-slate-900 mt-1.5">
                  Masukkan Kredensial Akun
                </h2>
              </div>
              <button
                type="button"
                onClick={handleBackToSelectRole}
                className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition flex items-center gap-1 cursor-pointer"
                title="Ganti peran ke role yang lain"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ganti Role</span>
              </button>
            </div>

            {/* Kartu Ringkasan Role Terpilih */}
            <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2.5 rounded-xl shrink-0 ${currentRoleInfo.iconBg}`}>
                  <CurrentRoleIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Peran Aktif:
                  </p>
                  <p className="text-xs font-extrabold text-slate-900 truncate">
                    {currentRoleInfo.title}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase shrink-0 ${currentRoleInfo.badgeBg}`}>
                {currentRoleInfo.badge}
              </span>
            </div>

            {/* Form Input Kredensial */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nama Pengguna (Username):
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username..."
                    autoFocus
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Kata Sandi (Password):
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Sembunyikan</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Tampilkan</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password..."
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Quick credential hint */}
              <div className="p-2.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-[11px] text-emerald-900 flex items-center justify-between">
                <span>Demo role ini: <strong>{currentRoleInfo.defaultUsername}</strong> / <strong>{currentRoleInfo.defaultPassword}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setUsername(currentRoleInfo.defaultUsername);
                    setPassword(currentRoleInfo.defaultPassword);
                  }}
                  className="text-emerald-800 hover:underline font-bold text-[10px] ml-2 shrink-0 cursor-pointer"
                >
                  Isi Otomatis
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-xs text-emerald-800 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-900/30 hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Login Sebagai {currentRoleInfo.badge}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Back Button Link */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleBackToSelectRole}
                className="text-slate-600 hover:text-slate-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Pilih Peran Lain</span>
              </button>

              <button
                type="button"
                onClick={onOpenSchemaModal}
                className="text-indigo-700 hover:text-indigo-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Skema SQL</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 BKPSDMD Kota Bitung • Sulawesi Utara. Hak Cipta Dilindungi Undang-Undang.
        </p>
      </div>
    </div>
  );
};
