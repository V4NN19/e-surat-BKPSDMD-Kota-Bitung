/**
 * @file LoketDashboard.tsx
 * @description Dashboard Petugas Loket Pelayanan Persuratan BKPSDMD Kota Bitung
 */

import React, { useState, useEffect } from 'react';
import { usePersuratan } from '../../context/PersuratanContext';
import { SifatSurat, SuratMasuk } from '../../types';
import {
  Inbox,
  FilePlus,
  ListFilter,
  UploadCloud,
  FileText,
  Clock,
  UserCheck,
  Send,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  Search,
  Filter,
} from 'lucide-react';

interface LoketDashboardProps {
  onLihatSurat: (surat: SuratMasuk) => void;
  activeMenu?: string;
  onSelectMenu?: (menu: string) => void;
}

export const LoketDashboard: React.FC<LoketDashboardProps> = ({
  onLihatSurat,
  activeMenu,
  onSelectMenu
}) => {
  const {
    currentUser,
    kategoriList,
    suratMasukList,
    addSuratMasuk
  } = usePersuratan();

  const [activeTab, setActiveTab] = useState<'input' | 'daftar'>('input');
  useEffect(() => {
    if (activeMenu === 'input' || activeMenu === 'daftar') {
      setActiveTab(activeMenu);
    }
  }, [activeMenu]);

  // State Form Input
  const [idKategori, setIdKategori] = useState<number>(kategoriList[0]?.id || 1);
  const [asalSurat, setAsalSurat] = useState('');
  const [noSurat, setNoSurat] = useState('');
  const [tglSurat, setTglSurat] = useState(new Date().toISOString().split('T')[0]);
  const [perihal, setPerihal] = useState('');
  const [sifat, setSifat] = useState<SifatSurat>('Biasa');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>('');
  const [fileError, setFileError] = useState('');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter Daftar Surat
  const [filterMinggu, setFilterMinggu] = useState<'semua' | 'minggu_ini' | 'bulan_ini'>('semua');
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time Indonesian Clock
  const [realtimeClock, setRealtimeClock] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      setRealtimeClock(now.toLocaleDateString('id-ID', options) + ' WITA');
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sinkronisasi dengan menu Sidebar
  useEffect(() => {
    if (!activeMenu) return;
    if (activeMenu === 'input') {
      setActiveTab('input');
    } else if (activeMenu === 'menunggu_verifikasi') {
      setActiveTab('daftar');
      setFilterStatus('MENUNGGU_VERIFIKASI_SEKRETARIAT');
    } else if (activeMenu === 'terverifikasi') {
      setActiveTab('daftar');
      setFilterStatus('TERVERIFIKASI');
    } else if (activeMenu === 'dikembalikan') {
      setActiveTab('daftar');
      setFilterStatus('DIKEMBALIKAN_KE_LOKET');
    } else if (activeMenu === 'semua') {
      setActiveTab('daftar');
      setFilterStatus('semua');
    }
  }, [activeMenu]);

  // Penanganan File Upload Strictly PDF
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setFileError('Format berkas tidak valid! Sistem strictly hanya menerima dokumen berekstensi .pdf.');
      setSelectedFile(null);
      setSelectedFileName('');
      setSelectedFileUrl('');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setFileError('Ukuran file terlalu besar. Maksimum 15 MB.');
      setSelectedFile(null);
      setSelectedFileName('');
      setSelectedFileUrl('');
      return;
    }

    setSelectedFile(file);
    setSelectedFileName(file.name);
    try {
      const url = URL.createObjectURL(file);
      setSelectedFileUrl(url);
    } catch {
      setSelectedFileUrl('');
    }
  };

  const handleResetForm = () => {
    setAsalSurat('');
    setNoSurat('');
    setTglSurat(new Date().toISOString().split('T')[0]);
    setPerihal('');
    setSifat('Biasa');
    setSelectedFile(null);
    setSelectedFileName('');
    setSelectedFileUrl('');
    setFileError('');
    setIdKategori(kategoriList[0]?.id || 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFileError('');

    if (!asalSurat.trim() || !noSurat.trim() || !perihal.trim()) {
      alert('Mohon lengkapi semua kolom form input surat masuk.');
      return;
    }

    if (!selectedFile || !selectedFileName) {
      setFileError('Wajib melampirkan berkas scan surat fisik dalam format PDF sebelum menyimpan!');
      alert('Surat masuk WAJIB melampirkan berkas PDF scan fisik surat! Silakan pilih file PDF terlebih dahulu.');
      return;
    }

    const fileNameToSave = selectedFileName;

    const created = addSuratMasuk({
      asal_surat: asalSurat.trim(),
      no_surat: noSurat.trim(),
      tgl_surat: tglSurat,
      perihal: perihal.trim(),
      sifat,
      id_kategori: idKategori,
      file_name: fileNameToSave,
      file_url: selectedFileUrl
    });

    setSuccessBanner(
      `Surat masuk berhasil disimpan dengan No. Agenda: ${created.no_agenda}`
    );

    handleResetForm();
    setTimeout(() => {
      setSuccessBanner(null);
    }, 7000);
  };

  const [isLeaving, setIsLeaving] = useState(false);

  // Fungsi penutup dengan animasi hilang (exit animation)
  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setSuccessBanner(null);
      setIsLeaving(false); // reset state
    }, 350); // durasi sesuai transition (300ms)
  };

  // Auto dismiss setelah 4 detik dengan animasi smooth
  useEffect(() => {
    if (successBanner) {
      setIsLeaving(false);
      const timer = setTimeout(() => {
        handleClose();
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [successBanner]);

  // Hitung status persuratan untuk filter daftar surat
  const countMenunggu = suratMasukList.filter(
    (s) => s.status_surat === 'MENUNGGU_VERIFIKASI_SEKRETARIAT'
  ).length;
  const countTerverifikasi = suratMasukList.filter(
    (s) =>
      s.status_surat !== 'MENUNGGU_VERIFIKASI_SEKRETARIAT' &&
      s.status_surat !== 'DIKEMBALIKAN_KE_LOKET'
  ).length;
  const countDikembalikan = suratMasukList.filter(
    (s) => s.status_surat === 'DIKEMBALIKAN_KE_LOKET'
  ).length;

  // Filter data surat yang diinput loket
  const filteredSurat = suratMasukList.filter((s) => {
    const matchesSearch =
      s.no_agenda.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.no_surat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.asal_surat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.perihal.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'semua'
        ? true
        : filterStatus === 'TERVERIFIKASI'
          ? s.status_surat !== 'MENUNGGU_VERIFIKASI_SEKRETARIAT' && s.status_surat !== 'DIKEMBALIKAN_KE_LOKET'
          : s.status_surat === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'MENUNGGU_VERIFIKASI_SEKRETARIAT':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'DIKEMBALIKAN_KE_LOKET':
        return 'bg-red-100 text-red-800 border-red-300 font-bold animate-pulse';
      case 'MENUNGGU_DISPOSISI_KEPALA_KANTOR':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'DISPOSISI_DIBUAT':
      case 'DITERUSKAN_KE_BAGIAN':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'SEDANG_DIPROSES':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'SELESAI':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Notification Pop-up Toast (Smooth Animation) */}
      {successBanner && (
        <div
          className={`fixed top-30 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg mx-auto p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl flex items-center justify-between gap-3 shadow-xl transition-all duration-300 ease-out ${isLeaving
            ? 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
            : 'opacity-100 translate-y-0 scale-100'
            }`}
        >
          {/* Bagian Kiri: Ikon & Teks Pesan */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-medium leading-normal text-emerald-900 break-words">
              {successBanner}
            </span>
          </div>

          {/* Bagian Kanan: Tombol Aksi & Close */}
          <div className="flex items-center gap-2 shrink-0 border-l border-emerald-200 pl-3">
            <button
              onClick={() => {
                setActiveTab('daftar');
                handleClose();
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100/60 px-2 py-1 rounded-md transition-colors whitespace-nowrap bg-transparent"
            >
              Lihat di Daftar Surat →
            </button>

            <button
              onClick={handleClose}
              className="text-emerald-500 hover:text-emerald-800 p-0.5 rounded-md hover:bg-emerald-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: FORM INPUT SURAT MASUK */}
      {
        activeTab === 'input' && (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">

            {/* Main Form (2 cols) */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200">
              <h3 className="text-base font-extrabold text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Formulir Registrasi Surat Masuk Baru</span>
                <span className="text-xs font-normal text-slate-500">* Wajib diisi lengkap</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Row 1: Kategori & Asal Surat */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Kategori Surat :
                    </label>
                    <select
                      value={idKategori}
                      onChange={(e) => setIdKategori(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    >
                      {kategoriList.map((kat) => (
                        <option key={kat.id} value={kat.id}>
                          {kat.nama_kategori}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Nomor Surat Resmi Pengirim:
                    </label>
                    <input
                      type="text"
                      required
                      value={noSurat}
                      onChange={(e) => setNoSurat(e.target.value)}
                      placeholder="Contoh: 104/KR.XI/BKN/XI/2026"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                </div>

                {/* Row 2: Nomor Surat & Tanggal Surat */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Asal Surat :
                    </label>
                    <input
                      type="text"
                      required
                      value={asalSurat}
                      onChange={(e) => setAsalSurat(e.target.value)}
                      placeholder="Contoh: BKN Regional XI / Dinas Pendidikan"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Tanggal Surat (DD/MM/YYYY):
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={tglSurat}
                        onChange={(e) => setTglSurat(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Perihal */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Sifat Dokumen Surat:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(['Segera', 'Sangat Segera', 'Rahasia'] as SifatSurat[]).map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition text-xs font-semibold ${sifat === opt
                          ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                      >
                        <input
                          type="radio"
                          name="sifat"
                          value={opt}
                          checked={sifat === opt}
                          onChange={() => setSifat(opt)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Row 4: Sifat Surat (Radio Group) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Perihal / Ringkasan Pokok Surat:
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={perihal}
                    onChange={(e) => setPerihal(e.target.value)}
                    placeholder="Tuliskan pokok perihal atau ringkasan maksud isi surat..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none"
                  />
                </div>
                {/* Row 5: File Upload Strictly PDF */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Unggah Dokumen Berkas (Strictly .PDF):
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-blue-400 bg-slate-50/60 transition group cursor-pointer relative">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-10 w-10 text-slate-400 group-hover:text-blue-500 transition" />
                      <div className="flex text-xs text-slate-600 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-bold text-blue-600 hover:text-blue-500 focus-within:outline-hidden"
                        >
                          <span>Pilih berkas PDF</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept=".pdf,application/pdf"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">atau seret ke area ini</p>
                      </div>
                      <p className="text-[10px] text-slate-500">Maksimum ukuran 15 MB (Strictly PDF)</p>
                    </div>
                  </div>

                  {selectedFileName && (
                    <div className="mt-2.5 p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold font-mono">{selectedFileName}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded-full font-bold">
                        SIAP UNGGAH
                      </span>
                    </div>
                  )}

                  {fileError && (
                    <p className="mt-2 text-xs text-red-600 flex items-center gap-1 font-semibold">
                      <AlertCircle className="w-4 h-4" /> {fileError}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Form</span>
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/30 transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Simpan &amp; Kirim ke Sekretariat</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* TAB 2: DAFTAR SURAT DIINPUT */}
      {
        activeTab === 'daftar' && (
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-5">

            {/* Status Persuratan di Dalam Daftar Surat */}
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">Status Berkas:</span>

              <button
                type="button"
                onClick={() => setFilterStatus('semua')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${filterStatus === 'semua'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                <span>Semua Surat</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${filterStatus === 'semua' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {suratMasukList.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterStatus('MENUNGGU_VERIFIKASI_SEKRETARIAT')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${filterStatus === 'MENUNGGU_VERIFIKASI_SEKRETARIAT'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Menunggu Verifikasi</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 text-amber-950 font-mono font-bold">
                  {countMenunggu}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterStatus('TERVERIFIKASI')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${filterStatus === 'TERVERIFIKASI'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Terverifikasi / Proses</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-200 text-emerald-950 font-mono font-bold">
                  {countTerverifikasi}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterStatus('DIKEMBALIKAN_KE_LOKET')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${filterStatus === 'DIKEMBALIKAN_KE_LOKET'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                  }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tolak / Dikembalikan</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-200 text-rose-950 font-mono font-bold">
                  {countDikembalikan}
                </span>
              </button>
            </div>

            {/* Top Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari No. Agenda, Nomor Surat, Pengirim..."
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-[11px] text-slate-500">
                  Menampilkan <strong className="text-slate-800">{filteredSurat.length}</strong> surat
                </span>
              </div>
            </div>

            {/* Table (Responsif dengan Horizontal Scroll di Ponsel & Tablet) */}
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left border-collapse text-xs min-w-[720px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <th className="py-3 px-3">No. Agenda</th>
                    <th className="py-3 px-3">Nomor &amp; Asal Surat</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3">Sifat</th>
                    <th className="py-3 px-3">Petugas Input</th>
                    <th className="py-3 px-3">Status Surat</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredSurat.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        Tidak ada data surat masuk yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredSurat.map((surat) => (
                      <tr key={surat.id} className="hover:bg-slate-50/80 transition">

                        {/* No Agenda */}
                        <td className="py-3 px-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                          {surat.no_agenda}
                          <div className="text-[10px] text-slate-400 font-sans font-normal">
                            {surat.tgl_input.split(' ')[0]}
                          </div>
                        </td>

                        {/* Nomor & Asal Surat */}
                        <td className="py-3 px-3 max-w-xs">
                          <p className="font-bold text-slate-900 line-clamp-1">{surat.asal_surat}</p>
                          <p className="text-[11px] font-mono text-slate-500">{surat.no_surat}</p>
                          <p className="text-[11px] text-slate-600 line-clamp-1 italic mt-0.5">
                            "{surat.perihal}"
                          </p>
                        </td>

                        {/* Kategori */}
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                            {surat.nama_kategori || 'Umum'}
                          </span>
                        </td>

                        {/* Sifat */}
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded font-semibold text-[11px] ${surat.sifat === 'Sangat Segera'
                              ? 'bg-red-100 text-red-800'
                              : surat.sifat === 'Segera'
                                ? 'bg-amber-100 text-amber-800'
                                : surat.sifat === 'Rahasia'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                          >
                            {surat.sifat}
                          </span>
                        </td>

                        {/* Petugas Input */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="font-semibold text-slate-800">{surat.nama_petugas_loket}</span>
                        </td>

                        {/* Status Surat Badge */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(
                              surat.status_surat
                            )}`}
                          >
                            {surat.status_surat.replace(/_/g, ' ')}
                          </span>
                          {surat.status_surat === 'DIKEMBALIKAN_KE_LOKET' && (
                            <div className="text-[10px] text-red-600 mt-1 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              <span>Butuh Perbaikan Scan</span>
                            </div>
                          )}
                        </td>

                        {/* Aksi */}
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => onLihatSurat(surat)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition inline-flex items-center gap-1 text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat Surat</span>
                          </button>
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
    </div >
  );
};
