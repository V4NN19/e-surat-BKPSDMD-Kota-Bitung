/**
 * @file KepalaBagianDashboard.tsx
 * @description Dashboard Kepala Bagian / Bidang BKPSDMD Kota Bitung
 * Menangani pengerjaan disposisi dan pembuatan konsep surat keluar internal dengan versioning berkas PDF
 */

import React, { useState } from 'react';
import { usePersuratan } from '../../context/PersuratanContext';
import { SuratMasuk, SuratKeluar, SifatSurat, SuratKeluarVersiFile } from '../../types';
import {
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
  RotateCcw,
  UploadCloud,
  Send,
  Eye,
  Layers,
  AlertTriangle,
  Building,
  FilePlus,
  ListOrdered,
  ChevronRight,
  Sparkles,
  Archive
} from 'lucide-react';

interface KepalaBagianDashboardProps {
  onLihatSuratMasuk: (surat: SuratMasuk) => void;
  onLihatSuratKeluar: (surat: SuratKeluar, versi?: SuratKeluarVersiFile) => void;
  activeMenu?: string;
  onSelectMenu?: (menu: string) => void;
  arsipkanSurat: (surat: SuratMasuk, versi?: SuratKeluarVersiFile) => void;
}

export const KepalaBagianDashboard: React.FC<KepalaBagianDashboardProps> = ({
  onLihatSuratMasuk,
  onLihatSuratKeluar,
  activeMenu,
  onSelectMenu,
  arsipkanSurat
}) => {
  const {
    currentUser,
    bagianList,
    suratMasukList,
    suratKeluarList,
    updateStatusPengerjaan,
    kembalikanKeSekretariat,
    buatSuratKeluar,
    uploadRevisiSuratKeluar
  } = usePersuratan();

  // Memilih bagian aktif yang sedang dilihat
  const [activeBagianId, setActiveBagianId] = useState<number>(
    currentUser?.id_bagian || 3 // Default Bidang Mutasi
  );

  const activeBagian = bagianList.find((b) => b.id === Number(activeBagianId));

  const [activeTab, setActiveTab] = useState<'masuk_bagian' | 'input_keluar' | 'daftar_keluar'>('masuk_bagian');

  // Filter Status Persuratan langsung di dalam tab daftar surat
  const [statusFilterMasuk, setStatusFilterMasuk] = useState<
    'SEMUA' | 'DITERUSKAN_KE_BAGIAN' | 'SEDANG_DIPROSES' | 'SELESAI' | 'DIKEMBALIKAN_KE_SEKRETARIAT' | 'ARSIP'
  >('SEMUA');

  // Modal Kembalikan ke Sekretariat (salah sasaran)
  const [modalKembalikanOpen, setModalKembalikanOpen] = useState(false);
  const [targetSuratKembalikan, setTargetSuratKembalikan] = useState<SuratMasuk | null>(null);
  const [alasanSalahSasaran, setAlasanSalahSasaran] = useState('');

  // Modal Upload Berkas Revisi Baru
  const [modalUploadRevisiOpen, setModalUploadRevisiOpen] = useState(false);
  const [targetSuratUploadRevisi, setTargetSuratUploadRevisi] = useState<SuratKeluar | null>(null);
  const [catatanPerbaikan, setCatatanPerbaikan] = useState('');
  const [fileRevisiName, setFileRevisiName] = useState('');

  // State Form Input Konsep Surat Keluar
  const [noDraft, setNoDraft] = useState(`ND/BKPSDMD-${activeBagian?.kode_bagian || 'MUTASI'}/2026/099`);
  const [jenisNaskah, setJenisNaskah] = useState<'Nota Dinas' | 'Surat Edaran Internal' | 'Memo' | 'Surat Tugas'>('Nota Dinas');
  const [sifatKeluar, setSifatKeluar] = useState<SifatSurat>('Biasa');
  const [lampiran, setLampiran] = useState('1 (Satu) Berkas');
  const [perihalKeluar, setPerihalKeluar] = useState('');
  const [idBagianTujuan, setIdBagianTujuan] = useState<number | ''>('');
  const [isiRingkas, setIsiRingkas] = useState('');
  const [fileDraftName, setFileDraftName] = useState('');
  const [fileDraftUrl, setFileDraftUrl] = useState('');
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Filter Surat Masuk untuk Bagian ini (tujuan disposisi = activeBagianId)
  const suratMasukBagian = suratMasukList.filter(
    (s) =>
      s.disposisi &&
      s.disposisi.id_bagian_tujuan === Number(activeBagianId) &&
      (s.status_surat === 'DITERUSKAN_KE_BAGIAN' ||
        s.status_surat === 'SEDANG_DIPROSES' ||
        s.status_surat === 'SELESAI' ||
        s.status_surat === 'DIKEMBALIKAN_KE_SEKRETARIAT' ||
        s.status_surat === 'ARSIP')
  );

  const countSemua = suratMasukBagian.length;
  const countMenunggu = suratMasukBagian.filter((s) => s.status_surat === 'DITERUSKAN_KE_BAGIAN').length;
  const countSedangDiproses = suratMasukBagian.filter((s) => s.status_surat === 'SEDANG_DIPROSES').length;
  const countSelesai = suratMasukBagian.filter((s) => s.status_surat === 'SELESAI').length;
  const countKembalikan = suratMasukBagian.filter((s) => s.status_surat === 'DIKEMBALIKAN_KE_SEKRETARIAT').length;
  const countArsip = suratMasukBagian.filter((s) => s.status_surat === 'ARSIP').length;
  const [sifatSurat, setSifatSurat] = useState<string>('');
  // Sinkronisasi dengan menu Sidebar
  React.useEffect(() => {
    if (!activeMenu) return;
    if (activeMenu === 'input_keluar') {
      setActiveTab('input_keluar');
    } else if (activeMenu === 'daftar_keluar') {
      setActiveTab('daftar_keluar');
    } else if (activeMenu === 'masuk_bagian') {
      setActiveTab('masuk_bagian');
    }
  }, [activeMenu]);

  // Filter Surat Masuk Bagian berdasarkan status filter di dalam daftar
  const filteredSuratMasukBagian = suratMasukBagian.filter((s) => {
    if (statusFilterMasuk === 'SEMUA') return true;
    return s.status_surat === statusFilterMasuk;
  });

  // Filter Surat Keluar yang dibuat oleh bagian ini
  const suratKeluarBagian = suratKeluarList.filter(
    (sk) => sk.id_bagian_pengirim === Number(activeBagianId)
  );

  // Handle Kembalikan ke Sekretariat
  const handleOpenKembalikan = (surat: SuratMasuk) => {
    setTargetSuratKembalikan(surat);
    setAlasanSalahSasaran('');
    setModalKembalikanOpen(true);
  };

  const handleConfirmKembalikan = () => {
    if (!targetSuratKembalikan) return;
    if (!alasanSalahSasaran.trim()) {
      alert('Mohon cantumkan alasan mengapa surat ini bukan tupoksi bagian Anda.');
      return;
    }
    kembalikanKeSekretariat(targetSuratKembalikan.id, alasanSalahSasaran.trim());
    setModalKembalikanOpen(false);
    alert(`Surat ${targetSuratKembalikan.no_agenda} berhasil dikembalikan ke Sekretariat untuk disposisi ulang.`);
  };

  // Handle Submit Form Konsep Surat Keluar
  const handleSubmitKonsepKeluar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noDraft.trim() || !perihalKeluar.trim() || !isiRingkas.trim()) {
      alert('Mohon lengkapi semua kolom konsep naskah dinas.');
      return;
    }
    if (!sifatSurat) {
      alert('Harap pilih Sifat Dokumen Surat terlebih dahulu!');
      return;
    }
    if (!idBagianTujuan) {
      alert('Harap pilih tujuan surat!');
      return;
    }
    if (!fileDraftName) {
      alert('Surat keluar WAJIB mengunggah file naskah fisik/draft dalam format PDF!');
      return;
    }

    const fileName = fileDraftName;

    buatSuratKeluar({
      no_draft: noDraft.trim(),
      jenis_naskah: jenisNaskah,
      sifat: sifatKeluar,
      lampiran,
      perihal: perihalKeluar.trim(),
      id_bagian_tujuan: Number(idBagianTujuan),
      isi_ringkas: isiRingkas.trim(),
      file_name: fileName,
      file_url: fileDraftUrl
    });

    setFormSuccess(`Konsep naskah ${noDraft} (Versi 1) berhasil diajukan ke Kepala Badan untuk diverifikasi.`);
    setPerihalKeluar('');
    setIsiRingkas('');
    setFileDraftName('');
    setFileDraftUrl('');
    setTimeout(() => setFormSuccess(null), 6000);
  };

  // Handle Upload Revisi Baru
  const handleOpenUploadRevisi = (surat: SuratKeluar) => {
    setTargetSuratUploadRevisi(surat);
    const nextVer = surat.versi_file.length + 1;
    setFileRevisiName(`${surat.no_draft.replace(/[^a-zA-Z0-9]/g, '_')}_v${nextVer}.pdf`);
    setCatatanPerbaikan('');
    setModalUploadRevisiOpen(true);
  };

  const handleConfirmUploadRevisi = () => {
    if (!targetSuratUploadRevisi) return;
    if (!catatanPerbaikan.trim()) {
      alert('Mohon sertakan catatan poin-poin perbaikan yang telah dilakukan.');
      return;
    }

    uploadRevisiSuratKeluar(
      targetSuratUploadRevisi.id,
      fileRevisiName,
      catatanPerbaikan.trim()
    );

    setModalUploadRevisiOpen(false);
    alert(`Berkas revisi baru berhasil diunggah! Status konsep dikembalikan ke PENGAJUAN_KE_KEPALA_KANTOR.`);
  };

  return (
    <div className="space-y-6">

      {/* Subheader & Bagian Switcher */}
      <div className="rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-xl text-purple-700 border border-purple-200">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Dashboard Kepala Bagian
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
                {activeBagian?.kode_bagian}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              <strong>{activeBagian?.nama_bagian}</strong>
            </p>
          </div>
        </div>
      </div>


      {/* 1. TAB SURAT MASUK BAGIAN */}
      {activeTab === 'masuk_bagian' && (
        <div className="space-y-6">
          {/* Tabel Surat Masuk Bagian */}
          <div className="bg-white p-3 sm:p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Daftar Disposisi Masuk ke {activeBagian?.nama_bagian}
                </h3>
                <p className="text-xs text-slate-500">
                  Perbarui status pengerjaan, simpan ke arsip sebagai proses akhir, atau kembalikan jika keliru sasaran.
                </p>
              </div>
            </div>

            {/* Filter Status Persuratan di dalam Daftar Surat */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
              <button
                onClick={() => setStatusFilterMasuk('SEMUA')}
                className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-1.5 ${statusFilterMasuk === 'SEMUA'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
              >
                <span>Semua</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilterMasuk === 'SEMUA' ? 'bg-purple-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {countSemua}
                </span>
              </button>

              <button
                onClick={() => setStatusFilterMasuk('DITERUSKAN_KE_BAGIAN')}
                className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-1.5 ${statusFilterMasuk === 'DITERUSKAN_KE_BAGIAN'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-bold'
                  : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  }`}
              >
                <span>Menunggu Tindak Lanjut</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilterMasuk === 'DITERUSKAN_KE_BAGIAN' ? 'bg-blue-700 text-white' : 'bg-blue-200 text-blue-800'}`}>
                  {countMenunggu}
                </span>
              </button>

              <button
                onClick={() => setStatusFilterMasuk('SEDANG_DIPROSES')}
                className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-1.5 ${statusFilterMasuk === 'SEDANG_DIPROSES'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs font-bold'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  }`}
              >
                <span>Sedang Diproses</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilterMasuk === 'SEDANG_DIPROSES' ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-800'}`}>
                  {countSedangDiproses}
                </span>
              </button>

              <button
                onClick={() => setStatusFilterMasuk('SELESAI')}
                className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-1.5 ${statusFilterMasuk === 'SELESAI'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
              >
                <span>Selesai</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilterMasuk === 'SELESAI' ? 'bg-emerald-700 text-white' : 'bg-emerald-200 text-emerald-800'}`}>
                  {countSelesai}
                </span>
              </button>

              <button
                onClick={() => setStatusFilterMasuk('ARSIP')}
                className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-1.5 ${statusFilterMasuk === 'ARSIP'
                  ? 'bg-slate-700 text-white border-slate-700 shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
              >
                <span>Arsip</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilterMasuk === 'ARSIP' ? 'bg-slate-800 text-white' : 'bg-slate-300 text-slate-800'}`}>
                  {countArsip}
                </span>
              </button>

              <button
                onClick={() => setStatusFilterMasuk('DIKEMBALIKAN_KE_SEKRETARIAT')}
                className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-1.5 ${statusFilterMasuk === 'DIKEMBALIKAN_KE_SEKRETARIAT'
                  ? 'bg-red-600 text-white border-red-600 shadow-xs font-bold'
                  : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  }`}
              >
                <span>Dikembalikan</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilterMasuk === 'DIKEMBALIKAN_KE_SEKRETARIAT' ? 'bg-red-700 text-white' : 'bg-red-200 text-red-800'}`}>
                  {countKembalikan}
                </span>
              </button>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 ">
                    <th className="py-3 px-3 text-center border-r border-slate-200">No. Agenda</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Asal &amp; Nama Surat</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Instruksi Disposisi Kepala Badan</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Sifat</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Status Pengerjaan</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Aksi Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredSuratMasukBagian.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400 border-r border-slate-200">
                        Tidak ada surat masuk dengan filter ini untuk {activeBagian?.nama_bagian}.
                      </td>
                    </tr>
                  ) : (
                    filteredSuratMasukBagian.map((surat) => (
                      <tr key={surat.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap border-r border-slate-200">
                          {surat.no_agenda}
                        </td>
                        <td className="py-3 px-3 max-w-xs border-r border-slate-200">
                          <p className="font-bold text-slate-900">{surat.asal_surat}</p>
                          <p className="text-[11px] text-slate-600 line-clamp-1 italic">"{surat.perihal}"</p>
                        </td>
                        <td className="py-3 px-3 max-w-sm border-r border-slate-200">
                          <div className="p-2 bg-emerald-50/80 rounded-lg border border-emerald-200 text-[11px] text-emerald-950 font-medium">
                            {surat.disposisi?.instruksi.map((ins, i) => (
                              <p key={i}>✓ {ins}</p>
                            ))}
                            {surat.disposisi?.catatan_kepala && (
                              <p className="mt-1 text-slate-700 italic border-t border-emerald-200/60 pt-1">
                                Catatan: "{surat.disposisi.catatan_kepala}"
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 border-r border-slate-200 text-center">
                          <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-slate-100 text-slate-700">
                            {surat.sifat}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap border-r border-slate-200">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${surat.status_surat === 'SELESAI'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : surat.status_surat === 'SEDANG_DIPROSES'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : surat.status_surat === 'ARSIP'
                                  ? 'bg-slate-100 text-slate-800 border-slate-400 font-extrabold'
                                  : surat.status_surat === 'DIKEMBALIKAN_KE_SEKRETARIAT'
                                    ? 'bg-red-100 text-red-800 border-red-300'
                                    : 'bg-blue-100 text-blue-800 border-blue-300'
                              }`}
                          >
                            {surat.status_surat.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap space-x-1.5 border-r border-slate-200">
                          <button
                            onClick={() => onLihatSuratMasuk(surat)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                          >
                            <Eye className="w-3.5 h-3.5 inline mr-1" />
                            <span>Lihat</span>
                          </button>

                          {/* Tombol Kembalikan ke Sekretariat jika salah sasaran */}
                          {surat.status_surat !== 'SELESAI' &&
                            surat.status_surat !== 'ARSIP' &&
                            surat.status_surat !== 'DIKEMBALIKAN_KE_SEKRETARIAT' && (
                              <button
                                onClick={() => handleOpenKembalikan(surat)}
                                className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-semibold text-xs"
                                title="Kembalikan jika materi surat bukan tupoksi bagian Anda"
                              >
                                Kembalikan
                              </button>
                            )}

                          {/* Action update status pengerjaan */}
                          {surat.status_surat === 'DITERUSKAN_KE_BAGIAN' && (
                            <button
                              onClick={() => updateStatusPengerjaan(surat.id, 'SEDANG_DIPROSES')}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold"
                            >
                              Mulai Proses
                            </button>
                          )}

                          {surat.status_surat === 'SEDANG_DIPROSES' && (
                            <button
                              onClick={() => updateStatusPengerjaan(surat.id, 'SELESAI')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-xs inline-flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Tandai Selesai</span>
                            </button>
                          )}

                          {/* AKSI ARSIPKAN: Menyimpan surat yang telah SELESAI ke Arsip sebagai proses akhir */}
                          {surat.status_surat === 'SELESAI' && (
                            <button
                              onClick={() => {
                                if (confirm(`Apakah Anda yakin ingin mengarsipkan surat ${surat.no_agenda}?`)) {
                                  updateStatusPengerjaan(surat.id, 'ARSIP' as any);
                                }
                              }}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold shadow-xs inline-flex items-center gap-1"
                              title="Simpan surat ke arsip sebagai proses akhir"
                            >
                              <Archive className="w-3.5 h-3.5" />
                              <span>Arsipkan</span>
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
        </div>
      )}

      {/* 2. TAB BUAT KONSEP SURAT KELUAR INTERNAL (BAGIAN-KE-BAGIAN) */}
      {activeTab === 'input_keluar' && (
        <div className="bg-white p-9 sm:p-10 rounded-2xl shadow-xs border border-slate-200 max-w-5xl mx-auto space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900">
              Formulir Konsep Surat Keluar Internal (Bagian-ke-Bagian BKPSDMD)
            </h3>
            <p className="text-xs text-slate-500">
              Pengajuan nota dinas, memo, atau surat internal kepada unit kerja lain melalui persetujuan Kepala Badan.
            </p>
          </div>

          {formSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmitKonsepKeluar} className="space-y-4 text-xs">

            {/* Row 1: Jenis Naskah & Sifat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Kategori Surat : <span className='text-red-500'>*</span>
                </label>
                <select
                  value={jenisNaskah}
                  onChange={(e: any) => setJenisNaskah(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Nota Dinas">Nota Dinas</option>
                  <option value="Surat Edaran Internal">Surat Edaran Internal</option>
                  <option value="Memo">Memo Dinas</option>
                  <option value="Surat Tugas">Surat Tugas Internal</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nomor Draft Konsep: <span className='text-red-500'>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={noDraft}
                  onChange={(e) => setNoDraft(e.target.value)}
                  placeholder="Contoh: ND/BKPSDMD-MUTASI/2026/099"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Row 2: No Draft & Lampiran */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Lampiran Berkas : <span className='text-red-500'>*</span>
                </label>
                <input
                  type="text"
                  value={lampiran}
                  onChange={(e) => setLampiran(e.target.value)}
                  placeholder="Contoh: 1 (Satu) Berkas / -"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Perihal : <span className='text-red-500'>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={perihalKeluar}
                  onChange={(e) => setPerihalKeluar(e.target.value)}
                  placeholder="Contoh: Permohonan Data Formasi Kebutuhan Jabatan Fungsional..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500"
                />
              </div>


            </div>

            {/* Row 2: Sifat Dokumen Surat (Radio Button Kartu) */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                SIFAT DOKUMEN SURAT: <span className='text-red-500'>*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Segera', value: 'Segera' },
                  { label: 'Sangat Segera', value: 'Sangat Segera' },
                  { label: 'Rahasia', value: 'Rahasia' },
                ].map((item) => (
                  <label
                    key={item.value}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${sifatSurat === item.value
                      ? 'border-purple-500 bg-purple-50/50 text-purple-900 font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="sifatSurat"
                      value={item.value}
                      checked={sifatSurat === item.value}
                      onChange={(e) => setSifatSurat(e.target.value)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-slate-300"
                    />
                    <span className="text-xs">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Row 3: Kepada Yth (Bagian Tujuan di BKPSDMD) */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kepada Yth (Pilih Bagian Tujuan): <span className='text-red-500'>*</span>
              </label>
              <select
                required
                value={idBagianTujuan}
                onChange={(e) => setIdBagianTujuan(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-purple-500"
              >
                <option value="" disabled className='text-slate-400' >
                  -- Pilih Bagian Tujuan --
                </option>
                {bagianList
                  .filter((b) => b.id !== Number(activeBagianId))
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nama_bagian} ({b.kode_bagian})
                    </option>
                  ))}
              </select>
            </div>



            {/* Row 5: Isi Ringkas */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Isi Ringkas Naskah Surat : <span className='text-red-500'>*</span>
              </label>
              <textarea
                required
                rows={3}
                value={isiRingkas}
                onChange={(e) => setIsiRingkas(e.target.value)}
                placeholder="Uraikan ringkasan substansi surat yang diajukan..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* Row 6: Upload Draft PDF (Versi 1) */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Unggah Draft Berkas PDF : <span className='text-red-500'>*</span>
              </label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-300 rounded-xl">
                <UploadCloud className="w-5 h-5 text-purple-600 shrink-0" />
                <input
                  type="file"
                  required
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setFileDraftName(f.name);
                      try {
                        setFileDraftUrl(URL.createObjectURL(f));
                      } catch {
                        setFileDraftUrl('');
                      }
                    }
                  }}
                  className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                - Otomatis tercatat sebagai Berkas Versi 1 di riwayat persuratan.
              </p>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setPerihalKeluar('');
                  setIsiRingkas('');
                  setNoDraft('');
                  setLampiran('');
                  setSifatSurat('');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-md shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Ajukan ke Kepala Kantor</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. TAB RIWAYAT / DAFTAR SURAT KELUAR BAGIAN (DENGAN VERSIONING) */}
      {activeTab === 'daftar_keluar' && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Riwayat Konsep Surat Keluar dari {activeBagian?.nama_bagian}
              </h3>
              <p className="text-xs text-slate-500">
                Lacak status persetujuan, catatan koreksi Kepala Kantor, dan manajemen versioning file PDF (v1, v2, dst.)
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-800 rounded-full border border-purple-200">
              {suratKeluarBagian.length} Konsep
            </span>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left text-xs border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-3 px-3 border-r border-slate-200">No. Draft</th>
                  <th className="py-3 px-3 border-r border-slate-200">Hal / Pokok Surat</th>
                  <th className="py-3 px-3 border-r border-slate-200">Jenis Naskah</th>
                  <th className="py-3 px-3 border-r border-slate-200">Bagian Tujuan</th>
                  <th className="py-3 px-3 border-r border-slate-200">Riwayat Versi Berkas</th>
                  <th className="py-3 px-3 border-r border-slate-200">Status Surat</th>
                  <th className="py-3 px-3 text-right border-r border-slate-200">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {suratKeluarBagian.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      Belum ada surat keluar yang dibuat oleh {activeBagian?.nama_bagian}.
                    </td>
                  </tr>
                ) : (
                  suratKeluarBagian.map((sk) => {
                    const isRevisi = sk.status_persetujuan === 'REVISI';
                    const highestVer = sk.versi_file[sk.versi_file.length - 1];

                    return (
                      <tr key={sk.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap border-r border-slate-200">
                          {sk.no_draft}
                        </td>
                        <td className="py-3 px-3 max-w-xs break-words whitespace-normal align-top border-r border-slate-200">
                          <p className="font-bold text-slate-900">{sk.perihal}</p>

                          {/* Alert jika butuh revisi */}
                          {isRevisi && sk.catatan_revisi_terakhir && (
                            <div className="mt-1.5 p-2 bg-red-50 border border-red-200 rounded-lg text-red-900 text-[11px] border-r border-slate-200">
                              <p className="font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                                Catatan Kepala Badan:
                              </p>
                              <p>{sk.catatan_revisi_terakhir}</p>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap border-r border-slate-200">
                          <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-slate-100 text-slate-700">
                            {sk.jenis_naskah}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800 whitespace-normal border-r border-slate-200">
                          {sk.nama_bagian_tujuan}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap border-r border-slate-200">
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[11px]">
                              Versi {highestVer?.versi_ke || 1}
                            </span>
                            <span className="text-[10px] text-slate-400">({sk.versi_file.length} file)</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap border-r border-slate-200">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${sk.status_persetujuan === 'DISETUJUI_KEPALA_BADAN'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : sk.status_persetujuan === 'REVISI'
                                ? 'bg-red-100 text-red-800 border-red-300 font-extrabold animate-pulse'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                              }`}
                          >
                            {sk.status_persetujuan.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap space-x-1.5 border-r border-slate-200">
                          <button
                            onClick={() => onLihatSuratKeluar(sk)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat Versi</span>
                          </button>

                          {/* KHUSUS REVISI: Tombol Upload File Revisi Baru yang otomatis naik versi */}
                          {isRevisi && (
                            <button
                              onClick={() => handleOpenUploadRevisi(sk)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold shadow-xs inline-flex items-center gap-1"
                            >
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Upload File Revisi Baru</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL KEMBALIKAN KE SEKRETARIAT (SALAH SASARAN DISPOSISI) */}
      {modalKembalikanOpen && targetSuratKembalikan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Kembalikan ke Sekretariat (Salah Sasaran)
              </h3>
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded-xl text-xs border border-slate-200">
              <p className="font-semibold text-slate-800">
                No. Agenda: <span className="font-mono text-purple-900">{targetSuratKembalikan.no_agenda}</span>
              </p>
              <p className="text-slate-600 mt-0.5 line-clamp-1">Perihal: {targetSuratKembalikan.perihal}</p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Alasan Pengembalian / Rekomendasi Bagian yang Tepat:
              </label>
              <textarea
                rows={3}
                required
                value={alasanSalahSasaran}
                onChange={(e) => setAlasanSalahSasaran(e.target.value)}
                placeholder="Contoh: Berkas ini terkait urusan Mutasi Pegawai, seharusnya ke Bagian Mutasi dan Promosi, bukan Bagian PPI..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setModalKembalikanOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmKembalikan}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/30"
              >
                Kembalikan ke Sekretariat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL UPLOAD FILE REVISI BARU (VERSIONING AUTO-INCREMENT) */}
      {modalUploadRevisiOpen && targetSuratUploadRevisi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center gap-3 text-purple-600 mb-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Upload Berkas Revisi Baru
                </h3>
                <p className="text-[11px] text-slate-500">
                  Otomatis menaikkan versi (Versi {targetSuratUploadRevisi.versi_file.length + 1}) tanpa menghapus versi lama
                </p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded-xl text-xs border border-slate-200">
              <p className="font-semibold text-slate-800">
                Draft: <span className="font-mono text-purple-900">{targetSuratUploadRevisi.no_draft}</span>
              </p>
              <p className="text-red-700 font-semibold mt-1">
                Catatan Kepala Kantor: "{targetSuratUploadRevisi.catatan_revisi_terakhir}"
              </p>
            </div>

            <div className="space-y-3 mb-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Pilih File PDF Revisi Baru:
                </label>
                <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-purple-600 shrink-0" />
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setFileRevisiName(f.name);
                    }}
                    className="text-xs text-slate-700 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-purple-100 file:text-purple-700"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Nama target simpan: <strong className="font-mono">{fileRevisiName}</strong>
                </p>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Catatan Poin Perbaikan:
                </label>
                <textarea
                  rows={2}
                  required
                  value={catatanPerbaikan}
                  onChange={(e) => setCatatanPerbaikan(e.target.value)}
                  placeholder="Contoh: Sudah diperbaiki tabel nomenklatur sesuai MenPAN-RB..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setModalUploadRevisiOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmUploadRevisi}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30"
              >
                Simpan &amp; Ajukan Ulang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};