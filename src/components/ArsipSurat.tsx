/**
 * @file ArsipSurat.tsx
 * @description Halaman Pengarsipan Surat BKPSDMD Kota Bitung
 * Fitur: Arsipkan surat, cari arsip, filter kategori & sifat, autocomplete pencarian
 * Responsif: iOS, Android, Windows, Mac — semua browser
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePersuratan } from '../context/PersuratanContext';
import { SuratMasuk } from '../types';
import {
  Archive,
  Search,
  X,
  Tag,
  Filter,
  Eye,
  FolderOpen,
  CheckCircle,
  Calendar,
  FileText,
  ChevronDown,
  Sparkles,
  ArchiveRestore,
  Info
} from 'lucide-react';

interface ArsipSuratProps {
  onLihatSurat: (surat: SuratMasuk) => void;
}

export const ArsipSurat: React.FC<ArsipSuratProps> = ({ onLihatSurat }) => {
  const {
    suratMasukList,
    kategoriList,
    arsipkanSurat,
    batalArsip,
    currentUser
  } = usePersuratan();

  /* ─── State Pencarian & Filter ─── */
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterKategori, setFilterKategori] = useState<number | 'semua'>('semua');
  const [filterSifat, setFilterSifat] = useState<string>('semua');
  const [filterTab, setFilterTab] = useState<'arsip' | 'belum_arsip'>('arsip');
  const [modalArsipOpen, setModalArsipOpen] = useState(false);
  const [targetSurat, setTargetSurat] = useState<SuratMasuk | null>(null);
  const [keteranganArsip, setKeteranganArsip] = useState('');

  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  /* ─── Pisahkan: arsip vs belum diarsip ─── */
  const suratArsip = suratMasukList.filter((s) => s.is_arsip === true);
  const suratBisaDiarsip = suratMasukList.filter(
    (s) => !s.is_arsip && s.status_surat === 'SELESAI'
  );

  const tampilkanDaftar = filterTab === 'arsip' ? suratArsip : suratBisaDiarsip;

  /* ─── Filter & Search ─── */
  const filtered = tampilkanDaftar.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      s.no_agenda.toLowerCase().includes(q) ||
      s.asal_surat.toLowerCase().includes(q) ||
      s.perihal.toLowerCase().includes(q) ||
      s.no_surat.toLowerCase().includes(q) ||
      (s.nama_kategori || '').toLowerCase().includes(q);

    const matchKategori =
      filterKategori === 'semua' || s.id_kategori === filterKategori;

    const matchSifat =
      filterSifat === 'semua' || s.sifat === filterSifat;

    return matchSearch && matchKategori && matchSifat;
  });

  /* ─── Autocomplete: bangun saran dari semua kata di kolom kunci ─── */
  const buildSuggestions = useCallback(
    (q: string): string[] => {
      if (!q || q.length < 2) return [];
      const qLow = q.toLowerCase();
      const pool = new Set<string>();

      tampilkanDaftar.forEach((s) => {
        [s.no_agenda, s.asal_surat, s.perihal, s.no_surat, s.nama_kategori || ''].forEach(
          (field) => {
            field.split(/[\s,/\-]+/).forEach((word) => {
              if (word.length >= 2 && word.toLowerCase().startsWith(qLow)) {
                pool.add(word);
              }
            });
            // Juga saran frase jika cocok di awal
            if (field.toLowerCase().includes(qLow) && field.length < 60) {
              pool.add(field);
            }
          }
        );
      });

      return Array.from(pool)
        .sort((a, b) => a.localeCompare(b, 'id'))
        .slice(0, 8);
    },
    [tampilkanDaftar]
  );

  const suggestions = buildSuggestions(searchQuery);

  /* ─── Tutup suggestion saat klik luar ─── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(e.target as Node) &&
        !searchRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ─── Handler Arsipkan ─── */
  const handleOpenArsip = (surat: SuratMasuk) => {
    setTargetSurat(surat);
    setKeteranganArsip('');
    setModalArsipOpen(true);
  };

  const handleConfirmArsip = () => {
    if (!targetSurat) return;
    arsipkanSurat(targetSurat.id, keteranganArsip.trim());
    setModalArsipOpen(false);
    setFilterTab('arsip');
  };

  /* ─── Handler Batalkan Arsip ─── */
  const handleBatalArsip = (id: number) => {
    if (window.confirm('Batalkan pengarsipan surat ini? Surat akan dikembalikan ke daftar aktif.')) {
      batalArsip(id);
    }
  };

  /* ─── Badge sifat surat ─── */
  const sifatColor = (sifat: string) => {
    if (sifat === 'Sangat Segera') return 'bg-red-100 text-red-800 border-red-300';
    if (sifat === 'Segera') return 'bg-amber-100 text-amber-800 border-amber-300';
    if (sifat === 'Rahasia') return 'bg-slate-700 text-white border-slate-600';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const canArchive =
    currentUser?.role === 'SEKRETARIAT' ||
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'KEPALA_BADAN' ||
    currentUser?.role === 'KEPALA_BAGIAN';

  return (
    <div className="space-y-5">

      {/* ─── HEADER ─── */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-100 rounded-xl text-teal-700 border border-teal-200">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Arsip Surat BKPSDMD
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola, cari, dan temukan arsip surat kedinasan secara cepat dan terstruktur.
            </p>
          </div>
        </div>
        {/* Stats Ringkas */}
        <div className="flex gap-3">
          <div className="text-center px-4 py-2 bg-teal-50 rounded-xl border border-teal-200">
            <p className="text-xl font-black text-teal-800">{suratArsip.length}</p>
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wide">Surat Diarsip</p>
          </div>
          <div className="text-center px-4 py-2 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-xl font-black text-amber-800">{suratBisaDiarsip.length}</p>
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Siap Diarsip</p>
          </div>
        </div>
      </div>

      {/* ─── PANEL PENCARIAN + FILTER ─── */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-4 sm:p-5 space-y-4">

        {/* Tab: Arsip vs Siap Diarsip */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold gap-1 self-start w-full sm:w-auto">
          <button
            onClick={() => setFilterTab('arsip')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-2 justify-center ${
              filterTab === 'arsip'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Archive className="w-3.5 h-3.5 shrink-0" />
            <span>Daftar Arsip ({suratArsip.length})</span>
          </button>
          {canArchive && (
            <button
              onClick={() => setFilterTab('belum_arsip')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-2 justify-center ${
                filterTab === 'belum_arsip'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5 shrink-0" />
              <span>Siap Diarsip ({suratBisaDiarsip.length})</span>
            </button>
          )}
        </div>

        {/* Baris Pencarian */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Cari no. agenda, asal surat, perihal, no. surat..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none focus:bg-white transition"
              autoComplete="off"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setShowSuggestions(false); }}
                className="absolute right-3 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ─── DROPDOWN AUTOCOMPLETE ─── */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionRef}
              className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-teal-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Saran Pencarian</span>
              </div>
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSearchQuery(sug);
                    setShowSuggestions(false);
                    searchRef.current?.focus();
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition flex items-center gap-2 border-b border-slate-50 last:border-0"
                >
                  <Search className="w-3 h-3 text-slate-300 shrink-0" />
                  {/* Highlight bagian yang cocok */}
                  <span>
                    {sug.toLowerCase().startsWith(searchQuery.toLowerCase()) ? (
                      <>
                        <strong className="text-teal-700">{sug.slice(0, searchQuery.length)}</strong>
                        {sug.slice(searchQuery.length)}
                      </>
                    ) : (
                      sug
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Baris Filter: Kategori + Sifat */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Filter Kategori */}
          <div className="flex items-center gap-2 flex-1">
            <div className="relative shrink-0">
              <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-teal-500 pointer-events-none" />
              <select
                value={filterKategori}
                onChange={(e) =>
                  setFilterKategori(e.target.value === 'semua' ? 'semua' : Number(e.target.value))
                }
                className="pl-7 pr-6 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-500 focus:outline-none appearance-none cursor-pointer hover:bg-white transition min-w-[160px]"
              >
                <option value="semua">Semua Kategori</option>
                {kategoriList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama_kategori}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>

            {/* Filter Sifat */}
            <div className="relative flex-1 sm:flex-none">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-teal-500 pointer-events-none" />
              <select
                value={filterSifat}
                onChange={(e) => setFilterSifat(e.target.value)}
                className="w-full pl-7 pr-6 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-500 focus:outline-none appearance-none cursor-pointer hover:bg-white transition sm:min-w-[140px]"
              >
                <option value="semua">Semua Sifat</option>
                <option value="Biasa">Biasa</option>
                <option value="Segera">Segera</option>
                <option value="Sangat Segera">Sangat Segera</option>
                <option value="Rahasia">Rahasia</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Info Hasil Filter */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FileText className="w-3.5 h-3.5 text-teal-500" />
            <span>
              Menampilkan <strong className="text-slate-800">{filtered.length}</strong> dari{' '}
              <strong className="text-slate-800">{tampilkanDaftar.length}</strong> surat
            </span>
            {(searchQuery || filterKategori !== 'semua' || filterSifat !== 'semua') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterKategori('semua');
                  setFilterSifat('semua');
                }}
                className="ml-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 font-semibold text-[10px] transition"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── TABEL HASIL ─── */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Header tabel */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {filterTab === 'arsip' ? (
              <Archive className="w-4 h-4 text-teal-600" />
            ) : (
              <FolderOpen className="w-4 h-4 text-amber-600" />
            )}
            <h3 className="text-sm font-extrabold text-slate-900">
              {filterTab === 'arsip' ? 'Daftar Surat Diarsipkan' : 'Surat Selesai Siap Diarsipkan'}
            </h3>
          </div>
          {filterTab === 'belum_arsip' && canArchive && (
            <div className="flex items-center gap-1.5 text-[10px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Info className="w-3 h-3" />
              <span>Hanya surat berstatus SELESAI yang bisa diarsip</span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto -mx-0 px-0">
          <table className="w-full text-left text-xs border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 text-[10px]">
                <th className="py-3 px-4">No. Agenda</th>
                <th className="py-3 px-4">Asal Surat & Perihal</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Sifat</th>
                <th className="py-3 px-4">Tgl. Surat</th>
                {filterTab === 'arsip' && <th className="py-3 px-4">Tgl. Arsip</th>}
                {filterTab === 'arsip' && <th className="py-3 px-4">Keterangan Arsip</th>}
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={filterTab === 'arsip' ? 8 : 6}
                    className="text-center py-16 text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Archive className="w-10 h-10 text-slate-200" />
                      <div>
                        <p className="font-semibold text-slate-500 text-sm">
                          {searchQuery || filterKategori !== 'semua' || filterSifat !== 'semua'
                            ? 'Tidak ditemukan surat yang sesuai filter'
                            : filterTab === 'arsip'
                            ? 'Belum ada surat yang diarsipkan'
                            : 'Tidak ada surat yang siap diarsipkan'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {filterTab === 'belum_arsip'
                            ? 'Surat harus berstatus SELESAI untuk dapat diarsipkan.'
                            : 'Arsipkan surat dari tab "Siap Diarsip".'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((surat) => (
                  <tr key={surat.id} className="hover:bg-teal-50/40 transition group">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {surat.no_agenda}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{surat.asal_surat}</p>
                      <p className="text-[11px] text-slate-500 italic line-clamp-2 mt-0.5">
                        "{surat.perihal}"
                      </p>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        No: {surat.no_surat}
                      </p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-semibold">
                        {surat.nama_kategori || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${sifatColor(surat.sifat)}`}>
                        {surat.sifat}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {surat.tgl_surat}
                      </div>
                    </td>
                    {filterTab === 'arsip' && (
                      <td className="py-3 px-4 whitespace-nowrap text-teal-700">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-teal-500" />
                          {surat.tgl_arsip || '—'}
                        </div>
                      </td>
                    )}
                    {filterTab === 'arsip' && (
                      <td className="py-3 px-4 max-w-[180px]">
                        <p className="text-[11px] text-slate-500 italic line-clamp-2">
                          {surat.keterangan_arsip || <span className="text-slate-300">—</span>}
                        </p>
                      </td>
                    )}
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => onLihatSurat(surat)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold inline-flex items-center gap-1 transition text-[10px]"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Lihat</span>
                      </button>

                      {filterTab === 'belum_arsip' && canArchive && (
                        <button
                          onClick={() => handleOpenArsip(surat)}
                          className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold inline-flex items-center gap-1 transition text-[10px] shadow-xs"
                        >
                          <Archive className="w-3 h-3" />
                          <span>Arsipkan</span>
                        </button>
                      )}

                      {filterTab === 'arsip' && canArchive && (
                        <button
                          onClick={() => handleBatalArsip(surat.id)}
                          className="px-2.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg font-semibold inline-flex items-center gap-1 transition text-[10px]"
                        >
                          <ArchiveRestore className="w-3 h-3" />
                          <span>Batal Arsip</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL KONFIRMASI ARSIPKAN ─── */}
      {modalArsipOpen && targetSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            {/* Header Modal */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-100 rounded-xl text-teal-700">
                <Archive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">Konfirmasi Pengarsipan Surat</h3>
                <p className="text-xs text-slate-500">Surat akan dipindahkan ke daftar arsip kedinasan.</p>
              </div>
            </div>

            {/* Info Surat */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex gap-2">
                <span className="font-semibold text-slate-500 w-20 shrink-0">No. Agenda</span>
                <span className="font-bold font-mono text-teal-900">{targetSurat.no_agenda}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-slate-500 w-20 shrink-0">Asal Surat</span>
                <span className="font-bold text-slate-800">{targetSurat.asal_surat}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-slate-500 w-20 shrink-0">Perihal</span>
                <span className="text-slate-700 italic">"{targetSurat.perihal}"</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-slate-500 w-20 shrink-0">Kategori</span>
                <span className="text-teal-700 font-semibold">{targetSurat.nama_kategori}</span>
              </div>
            </div>

            {/* Keterangan Arsip */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Keterangan Arsip <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <textarea
                rows={3}
                value={keteranganArsip}
                onChange={(e) => setKeteranganArsip(e.target.value)}
                placeholder="Contoh: Surat selesai ditindaklanjuti oleh Bidang Mutasi, berkas asli disimpan di Lemari Arsip B2..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
              />
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setModalArsipOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmArsip}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-900/20 inline-flex items-center gap-1.5 transition"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Simpan ke Arsip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

