/**
 * @file LoginView.tsx
 * @description Tampilan Halaman Login Sistem Persuratan BKPSDMD Kota Bitung
 * Pengguna langsung memasukkan Username dan Password tanpa memilih role terlebih dahulu.
 * Sistem otomatis mendeteksi role akun pengguna yang telah terdaftar di database.
 */

import React, { useState } from 'react';
import { usePersuratan } from '../context/PersuratanContext';
import {
  Building2,
  Lock,
  UserCheck,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Database,
  ArrowRight,
  Shield,
  Inbox,
  FileCheck2,
  Crown,
  Briefcase
} from 'lucide-react';

interface LoginViewProps {
  onOpenSchemaModal?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onOpenSchemaModal }) => {
  const { login } = usePersuratan();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Submit login langsung dengan username & password
  // Submit login langsung dengan username & password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Username dan Kata Sandi wajib diisi.');
      return;
    }

    setIsLoading(true);
    const res = await login(username.trim(), password.trim());
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setSuccessMessage('Login berhasil! Mengalihkan ke sistem...');
    }
  };

  // Helper untuk mengisi cepat akun demo saat pengujian
  const handleSelectDemo = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 font-sans">

      {/* Top Header Logo & Identitas Pemkot Bitung */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex p-3.5 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl shadow-xl shadow-emerald-900/40 border border-emerald-400/30 mb-3">
          <Building2 className="w-8 h-8 text-amber-300" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
          E-SURAT BKPSDMD
        </h1>
        <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase mt-0.5">
          PEMERINTAH KOTA BITUNG
        </p>
        <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto">
          Sistem Informasi Pengelolaan Surat Masuk, Surat Keluar, Disposisi Digital &amp; Pengarsipan Terpadu
        </p>
      </div>

      {/* Card Form Login */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-2xl rounded-2xl border border-slate-200">

          <div className="mb-6 pb-4 border-b border-slate-100 text-center">
            <h2 className="text-lg font-black text-slate-900">
              Masuk ke Akun Anda
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan username dan password. Sistem akan mengarahkan langsung ke hak akses role Anda.
            </p>
          </div>

          {/* Alert Error / Success */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-semibold">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-semibold">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Username */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Username Pegawai :
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username Anda..."
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-hidden transition"
                />
                <UserCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kata Sandi :
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-hidden transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Tombol Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-700/30 flex items-center justify-center gap-2 transition duration-150 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Memverifikasi Akun...' : 'Masuk ke Sistem Persuratan'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Bantuan Akun Cepat / Demo Login */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 text-center">
              Pilihan Akun Demo (Klik untuk Isi Cepat):
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => handleSelectDemo('loket', 'loket123')}
                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 text-left border border-blue-200 transition flex items-center gap-1.5"
              >
                <Inbox className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <div className="truncate">
                  <p className="font-bold">Petugas Loket</p>
                  <p className="text-slate-500 text-[9px]">loket / loket123</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemo('sekretariat', 'sekretariat123')}
                className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-left border border-emerald-200 transition flex items-center gap-1.5"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <p className="font-bold">Sekretariat</p>
                  <p className="text-slate-500 text-[9px]">sekretariat / ...</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemo('kepala_kantor', 'kepala123')}
                className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-left border border-amber-200 transition flex items-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <div className="truncate">
                  <p className="font-bold">Kepala Badan</p>
                  <p className="text-slate-500 text-[9px]">kepala_kantor / ...</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemo('kabag_mutasi', 'kabag123')}
                className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 text-left border border-purple-200 transition flex items-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <div className="truncate">
                  <p className="font-bold">Kepala Bagian</p>
                  <p className="text-slate-500 text-[9px]">kabag_mutasi / ...</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemo('admin', 'admin123')}
                className="col-span-2 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-left border border-slate-300 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Shield className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  <span className="font-bold">Administrator Sistem</span>
                </div>
                <span className="text-slate-500 text-[9px]">admin / admin123</span>
              </button>
            </div>
          </div>

          {/* Trigger Skema Database */}
          <div className="mt-5 pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onOpenSchemaModal}
              className="text-[11px] text-indigo-700 hover:text-indigo-900 font-semibold inline-flex items-center gap-1 transition"
            >
              <Database className="w-3 h-3" />
              <span>Lihat Skema Database (8 Tabel) &amp; API Controller</span>
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-400 mt-6">
        © 2026 Badan Kepegawaian dan Pengembangan Sumber Daya Manusia Daerah Kota Bitung
      </p>
    </div>
  );
};
