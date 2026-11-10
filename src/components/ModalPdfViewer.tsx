/**
 * @file ModalPdfViewer.tsx
 * @description Modal Pratinjau Dokumen Naskah & Lembar Disposisi Digital Resmi BKPSDMD Kota Bitung
 */

import React, { useState } from 'react';
import { SuratMasuk, SuratKeluar, SuratKeluarVersiFile } from '../types';
import {
  X,
  FileText,
  Printer,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  UserCheck,
  Calendar,
  Layers,
  FileSearch,
  ExternalLink,
  ZoomIn,
  ShieldCheck,
  Eye
} from 'lucide-react';

interface ModalPdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
  suratMasuk?: SuratMasuk | null;
  suratKeluar?: SuratKeluar | null;
  versiDipilih?: SuratKeluarVersiFile | null;
}

export const ModalPdfViewer: React.FC<ModalPdfViewerProps> = ({
  isOpen,
  onClose,
  suratMasuk,
  suratKeluar,
  versiDipilih
}) => {
  const [activeTab, setActiveTab] = useState<'scan_pdf' | 'surat' | 'disposisi' | 'versi'>('scan_pdf');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isMasuk = !!suratMasuk;
  const disposisi = suratMasuk?.disposisi;

  const pdfFileName = isMasuk
    ? (suratMasuk?.file_pdf || 'berkas_surat_masuk.pdf')
    : (versiDipilih?.nama_file || suratKeluar?.versi_file[suratKeluar.versi_file.length - 1]?.nama_file || 'naskah_surat_keluar.pdf');

  const realFileUrl = isMasuk ? suratMasuk?.file_url : suratKeluar?.file_url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header Modal */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600/30 rounded-lg text-emerald-400 border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                  {isMasuk ? 'SURAT MASUK' : 'SURAT KELUAR INTERNAL'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {isMasuk ? suratMasuk.no_agenda : suratKeluar?.no_draft}
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-100 line-clamp-1">
                {isMasuk ? suratMasuk.perihal : suratKeluar?.perihal}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 border border-slate-700 transition"
              title="Cetak Berkas"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={() => {
                const dummyContent = isMasuk
                  ? `DOKUMEN SURAT MASUK BKPSDMD KOTA BITUNG\nNo. Agenda: ${suratMasuk.no_agenda}\nNomor: ${suratMasuk.no_surat}\nAsal: ${suratMasuk.asal_surat}\nPerihal: ${suratMasuk.perihal}`
                  : `DOKUMEN SURAT KELUAR BKPSDMD KOTA BITUNG\nNo. Draft: ${suratKeluar?.no_draft}\nPerihal: ${suratKeluar?.perihal}`;
                const blob = new Blob([dummyContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = isMasuk ? `${suratMasuk.no_agenda.replace(/\//g, '_')}.txt` : `${suratKeluar?.no_draft.replace(/\//g, '_')}.txt`;
                a.click();
              }}
              className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 transition font-medium"
              title="Unduh Salinan Berkas"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector if Disposisi / Versi available */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex flex-wrap items-center gap-2 text-sm">
          <button
            onClick={() => setActiveTab('scan_pdf')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'scan_pdf'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white/70'
            }`}
          >
            <FileSearch className="w-4 h-4 text-inherit" />
            <span>📄 Berkas Scan PDF Asli ({pdfFileName})</span>
          </button>

          <button
            onClick={() => setActiveTab('surat')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeTab === 'surat'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Format Naskah Digital</span>
          </button>

          {isMasuk && disposisi && (
            <button
              onClick={() => setActiveTab('disposisi')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'disposisi'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Lembar Disposisi Kepala Badan</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>
          )}

          {!isMasuk && suratKeluar && (
            <button
              onClick={() => setActiveTab('versi')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'versi'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Riwayat Versi Berkas ({suratKeluar.versi_file.length} Versi)</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/70">

          {/* TAB 1: HASIL SCAN SURAT FISIK DALAM BENTUK PDF */}
          {activeTab === 'scan_pdf' && (
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Toolbar Viewer PDF Scan Fisik */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-md font-mono text-xs font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-red-600" />
                    PDF Scan Fisik: {pdfFileName}
                  </span>
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    Status Dokumen: <strong className="text-emerald-700">Terverifikasi Asli</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {realFileUrl && (
                    <a
                      href={realFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka di Tab Baru</span>
                    </a>
                  )}
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Dokumen</span>
                  </button>
                </div>
              </div>

              {/* Tampilan Konten PDF (Jika file nyata diunggah, tampil via iframe/embed; jika berkas sampel, tampil lembar scan fisik realistis) */}
              {realFileUrl ? (
                <div className="w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 shadow-lg min-h-[580px]">
                  <iframe
                    src={realFileUrl}
                    title="Pratinjau PDF Asli"
                    className="w-full h-[620px] rounded-2xl bg-white"
                  />
                </div>
              ) : (
                /* Lembar Pratinjau Scan Fisik Terlampir Berstandar Kedinasan */
                <div className="relative bg-white shadow-xl border-2 border-slate-300 rounded-2xl p-6 sm:p-10 font-serif text-slate-900 min-h-[600px] overflow-hidden">
                  
                  {/* Watermark Scan Berkas Kedinasan */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 select-none -rotate-45">
                    <span className="text-6xl sm:text-7xl font-sans font-black tracking-widest text-slate-900 uppercase">
                      BKPSDMD BITUNG SCAN
                    </span>
                  </div>

                  {/* Cap Registrasi / Label Scan Fisik di Pojok Kanan Atas */}
                  <div className="absolute top-6 right-6 border-2 border-dashed border-red-500/80 rounded-lg p-2.5 text-center text-[10px] font-sans font-bold text-red-600 bg-red-50/50 -rotate-2 shadow-xs">
                    <p className="uppercase tracking-widest">TELAH DIPERIKSA / SCAN</p>
                    <p className="font-mono text-xs text-red-700">{isMasuk ? suratMasuk?.no_agenda : suratKeluar?.no_draft}</p>
                    <p className="text-[9px] text-slate-500 font-normal">BKPSDMD KOTA BITUNG</p>
                  </div>

                  {/* Header Berkas Scan Fisik */}
                  <div className="border-b-2 border-slate-900 pb-4 mb-6 pr-32">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-800 text-xs font-bold text-slate-800 shrink-0">
                        PEMKOT
                      </div>
                      <div>
                        <p className="text-xs font-sans font-bold tracking-wider uppercase text-slate-700">
                          {isMasuk ? (suratMasuk?.asal_surat || 'PEMERINTAH KOTA BITUNG') : 'PEMERINTAH KOTA BITUNG'}
                        </p>
                        <h2 className="text-base sm:text-lg font-sans font-black uppercase text-slate-950 leading-tight">
                          {isMasuk ? 'BERKAS DOKUMEN RESMI MASUK' : 'NASKAH DINAS SURAT KELUAR INTERNAL'}
                        </h2>
                        <p className="text-[11px] font-sans text-slate-500">
                          Lampiran Berkas PDF Terdaftar: <span className="font-mono font-semibold text-slate-800">{pdfFileName}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Isi Lembar Dokumen Fisik */}
                  <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium">Nomor Berkas:</span>
                        <p className="font-mono font-bold text-slate-900">{isMasuk ? suratMasuk?.no_surat : suratKeluar?.no_draft}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Tanggal Surat:</span>
                        <p className="font-bold text-slate-900">{isMasuk ? suratMasuk?.tgl_surat : suratKeluar?.tgl_dibuat}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Sifat Berkas:</span>
                        <p className="font-bold text-red-700">{isMasuk ? suratMasuk?.sifat : suratKeluar?.sifat}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <p className="text-xs font-bold uppercase text-slate-600 mb-1">Perihal / Hal:</p>
                      <p className="text-sm font-bold text-slate-900 bg-slate-100/70 p-3 rounded-lg border border-slate-200">
                        {isMasuk ? suratMasuk?.perihal : suratKeluar?.perihal}
                      </p>
                    </div>

                    <div className="py-2 text-justify text-slate-800 space-y-3 leading-relaxed">
                      <p>
                        Dokumen ini adalah hasil pemindaian (scan) berkas fisik kedinasan yang telah diverifikasi dan dilampirkan ke dalam Sistem Informasi Persuratan BKPSDMD Kota Bitung.
                      </p>
                      <p className="italic text-slate-700 p-3 bg-amber-50/50 rounded-lg border border-amber-200">
                        "{isMasuk ? suratMasuk?.perihal : suratKeluar?.isi_ringkas}"
                      </p>
                      <p>
                        Seluruh cap stempel basah, tanda tangan pejabat berwenang, dan lampiran teknis telah tercakup dalam berkas PDF ini dan siap diakses oleh pemeriksa (Sekretariat, Kepala Badan, maupun Kepala Bagian penanggung jawab).
                      </p>
                    </div>

                    {/* Area Tanda Tangan Scan Fisik */}
                    <div className="pt-8 flex justify-between items-end border-t border-slate-200 mt-6">
                      <div className="text-[11px] text-slate-500 font-sans">
                        <p className="font-semibold text-slate-700">Digital Authenticity Verified</p>
                        <p>ID Berkas: {isMasuk ? `SM-${suratMasuk?.id}` : `SK-${suratKeluar?.id}`}</p>
                        <p className="font-mono text-[10px] text-slate-400">SHA256: e8b94f...d32a09</p>
                      </div>
                      <div className="text-center font-sans text-xs">
                        <p className="text-slate-600 mb-4">Diverifikasi &amp; Disahkan</p>
                        <div className="w-24 h-12 mx-auto border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] text-emerald-700 bg-emerald-50/60 font-bold mb-1">
                          ✓ TTD RESMI
                        </div>
                        <p className="font-bold text-slate-900 underline">
                          {isMasuk ? suratMasuk?.asal_surat : (suratKeluar?.nama_bagian_pengirim || 'Kepala Bagian')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'surat' && (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-xs border border-slate-200 font-sans text-slate-800">
              
              {/* Kop Surat Resmi */}
              <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center relative">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-900 flex items-center justify-center text-amber-300 font-serif font-black text-xl border-2 border-amber-400 shadow-inner">
                    BTG
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm tracking-wider font-semibold text-slate-700 uppercase">PEMERINTAH KOTA BITUNG</h4>
                    <h2 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
                      BADAN KEPEGAWAIAN DAN PENGEMBANGAN<br />SUMBER DAYA MANUSIA DAERAH
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Jl. Sam Ratulangi No. 45, Bitung, Sulawesi Utara • Email: bkpsdmd@bitungkota.go.id
                    </p>
                  </div>
                </div>
              </div>

              {/* Detail Metadata Naskah */}
              {isMasuk ? (
                <div>
                  <div className="grid grid-cols-2 gap-4 text-xs mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div>
                      <p className="text-slate-500 font-medium">Nomor Agenda:</p>
                      <p className="font-mono font-bold text-slate-900 text-sm">{suratMasuk.no_agenda}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium">Sifat Surat:</p>
                      <span className={`inline-block px-2 py-0.5 rounded font-semibold text-xs ${
                        suratMasuk.sifat === 'Sangat Segera' ? 'bg-red-100 text-red-700' :
                        suratMasuk.sifat === 'Segera' ? 'bg-amber-100 text-amber-800' :
                        suratMasuk.sifat === 'Rahasia' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {suratMasuk.sifat}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium">Nomor Berkas Asal:</p>
                      <p className="font-semibold text-slate-800">{suratMasuk.no_surat}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium">Tanggal Surat:</p>
                      <p className="font-semibold text-slate-800">{suratMasuk.tgl_surat}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium">Asal Pengirim:</p>
                      <p className="font-bold text-slate-900">{suratMasuk.asal_surat}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium">Kategori Surat:</p>
                      <p className="font-semibold text-emerald-800">{suratMasuk.nama_kategori || 'Umum'}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Perihal / Pokok Surat:</h5>
                    <div className="p-4 bg-emerald-50/60 rounded-lg border border-emerald-200/80 text-sm font-semibold text-emerald-950 leading-relaxed">
                      {suratMasuk.perihal}
                    </div>
                  </div>

                  {/* Body Simulation */}
                  <div className="text-sm space-y-3 leading-relaxed text-slate-700 text-justify border-t border-slate-200 pt-4">
                    <p>
                      Dengan hormat disampaikan bahwa sehubungan dengan pelaksanaan agenda kedinasan dan koordinasi teknis kepegawaian di lingkungan Pemerintah Kota Bitung, bersama surat ini kami sampaikan berkas usulan/undangan sebagaimana tertera pada perihal di atas.
                    </p>
                    <p>
                      Seluruh dokumen pendukung fisik dan lampiran teknis telah diverifikasi dan diserahkan melalui loket persuratan terpadu BKPSDMD Kota Bitung untuk diproses sesuai tata kelola persuratan dinas.
                    </p>
                    <p>
                      Demikian permohonan/pemberitahuan ini kami sampaikan, atas perhatian dan kerja sama yang baik diucapkan terima kasih.
                    </p>
                  </div>

                  {/* Tanda Tangan & Cap Digital */}
                  <div className="mt-8 pt-4 flex justify-between items-end border-t border-slate-100">
                    <div className="text-xs text-slate-400">
                      <p>Diterima Petugas Loket: {suratMasuk.nama_petugas_loket}</p>
                      <p>Waktu Input: {suratMasuk.tgl_input}</p>
                    </div>
                    <div className="text-center text-xs">
                      <p className="text-slate-600 mb-8">Pengirim Berkas Asli</p>
                      <div className="inline-block px-3 py-1 rounded border border-emerald-600 text-emerald-700 font-mono text-[10px] bg-emerald-50 font-bold mb-1">
                        TERVERIFIKASI DIGITAL
                      </div>
                      <p className="font-bold text-slate-900 underline">{suratMasuk.asal_surat}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Surat Keluar */
                <div>
                  <div className="text-center mb-6">
                    <h3 className="font-bold text-base tracking-wider uppercase text-slate-900 underline">
                      {suratKeluar?.jenis_naskah.toUpperCase()}
                    </h3>
                    <p className="text-xs font-mono text-slate-600 mt-1">Nomor: {suratKeluar?.no_draft}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-500 font-medium">Kepada Yth:</span>
                      <p className="font-bold text-slate-900">{suratKeluar?.nama_bagian_tujuan}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Dari:</span>
                      <p className="font-bold text-slate-900">{suratKeluar?.nama_bagian_pengirim}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Sifat:</span>
                      <p className="font-semibold text-slate-800">{suratKeluar?.sifat}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Lampiran:</span>
                      <p className="font-semibold text-slate-800">{suratKeluar?.lampiran}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 font-medium">Hal:</span>
                      <p className="font-bold text-slate-900">{suratKeluar?.perihal}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/80 rounded-lg border border-slate-200 text-sm text-slate-800 space-y-3 leading-relaxed mb-6">
                    <p className="font-medium text-slate-700">Ringkasan Konsep Naskah Dinas:</p>
                    <p className="italic text-slate-700 bg-white p-3 rounded border border-slate-200">
                      "{suratKeluar?.isi_ringkas}"
                    </p>
                  </div>

                  {suratKeluar?.catatan_revisi_terakhir && (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 mb-6 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Catatan Koreksi Kepala Badan:</p>
                        <p>{suratKeluar.catatan_revisi_terakhir}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 pt-4 flex justify-between items-end border-t border-slate-100">
                    <div className="text-xs text-slate-400">
                      <p>Diajukan: {suratKeluar?.tgl_dibuat}</p>
                      <p>Versi Berkas: Versi {versiDipilih ? versiDipilih.versi_ke : suratKeluar?.versi_file.length}</p>
                    </div>
                    <div className="text-center text-xs">
                      {suratKeluar?.status_persetujuan === 'DISETUJUI_KEPALA_BADAN' ? (
                        <div>
                          <div className="p-2 border-2 border-emerald-600 rounded-lg bg-emerald-50 text-emerald-800 mb-2 font-bold text-center">
                            ✓ TELAH DISETUJUI KEPALA BADAN
                            <div className="text-[10px] font-normal text-emerald-700">{suratKeluar.tgl_disetujui}</div>
                          </div>
                          <p className="font-bold text-slate-900 underline">Forsman Dandel, S.Sos</p>
                          <p className="text-slate-500 text-[10px]">Kepala BKPSDMD Kota Bitung</p>
                        </div>
                      ) : (
                        <div className="text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded text-[11px] font-semibold">
                          [ STATUS: {suratKeluar?.status_persetujuan.replace(/_/g, ' ')} ]
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab Lembar Disposisi Digital */}
          {activeTab === 'disposisi' && disposisi && (
            <div className="max-w-2xl mx-auto bg-amber-50/30 p-8 rounded-xl shadow-xs border-2 border-emerald-700 font-sans">
              <div className="border-b-2 border-emerald-900 pb-3 mb-4 text-center">
                <h4 className="text-xs font-bold tracking-widest text-emerald-950 uppercase">PEMERINTAH KOTA BITUNG</h4>
                <h2 className="text-base font-extrabold text-emerald-900">LEMBAR DISPOSISI KEPALA BADAN</h2>
                <p className="text-[11px] text-slate-600">Badan Kepegawaian dan Pengembangan Sumber Daya Manusia Daerah</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-4 bg-white p-3 rounded-lg border border-slate-300">
                <div>
                  <span className="text-slate-500 font-medium">No. Agenda Surat:</span>
                  <p className="font-mono font-bold text-slate-900">{suratMasuk?.no_agenda}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Tgl. Disposisi:</span>
                  <p className="font-semibold text-slate-800">{disposisi.tgl_disposisi}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Surat Dari:</span>
                  <p className="font-semibold text-slate-900">{suratMasuk?.asal_surat}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Sifat:</span>
                  <p className="font-bold text-emerald-700">{suratMasuk?.sifat}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 font-medium">Perihal:</span>
                  <p className="font-semibold text-slate-800">{suratMasuk?.perihal}</p>
                </div>
              </div>

              {/* Diteruskan Kepada */}
              <div className="mb-4 bg-emerald-100/50 p-3 rounded-lg border border-emerald-300">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide block mb-1">
                  Diteruskan Kepada (Bagian Tujuan):
                </span>
                <p className="text-sm font-extrabold text-emerald-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-700" />
                  {disposisi.nama_bagian_tujuan}
                </p>
              </div>

              {/* Checklist Instruksi Disposisi */}
              <div className="mb-4 bg-white p-4 rounded-lg border border-slate-300">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
                  Instruksi / Petunjuk Kepala Badan:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {disposisi.instruksi.map((ins, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-800 bg-emerald-50/80 p-2 rounded border border-emerald-200">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{ins}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Catatan Kepala */}
              <div className="mb-6 bg-white p-4 rounded-lg border border-slate-300">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Catatan Tambahan Kepala Badan:
                </span>
                <p className="text-xs italic text-slate-900 bg-amber-50/50 p-2.5 rounded border border-amber-200">
                  {disposisi.catatan_kepala || 'Tidak ada catatan khusus.'}
                </p>
              </div>

              {/* Tanda Tangan Paraf Kepala Badan */}
              <div className="text-right text-xs pt-2">
                <p className="text-slate-600">Bitung, {disposisi.tgl_disposisi.split(' ')[0]}</p>
                <p className="font-semibold text-slate-800 mt-1">Kepala BKPSDMD Kota Bitung,</p>
                <div className="my-2 inline-block px-4 py-2 border-2 border-emerald-600 rounded bg-emerald-50 text-emerald-800 font-mono text-[11px] font-extrabold">
                  [ TANDATANGAN DIGITAL / PARAF RESMI ]
                </div>
                <p className="font-bold text-slate-900 underline">Forsman Dandel, S.Sos</p>
                <p className="text-slate-500 text-[10px]">NIP. 197405201994031003</p>
              </div>
            </div>
          )}

          {/* Tab Riwayat Versi Surat Keluar */}
          {activeTab === 'versi' && suratKeluar && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-1">Manajemen Versioning Berkas PDF Naskah</h4>
                <p className="text-xs text-slate-500">
                  Sesuai aturan sistem, setiap revisi surat keluar otomatis menaikkan versi berkas (Versi 2, Versi 3, dst.) tanpa menghapus riwayat berkas sebelumnya.
                </p>
              </div>

              <div className="space-y-3">
                {suratKeluar.versi_file.map((vf) => (
                  <div
                    key={vf.id}
                    className={`p-4 rounded-xl border transition ${
                      vf.versi_ke === suratKeluar.versi_file.length
                        ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          vf.versi_ke === suratKeluar.versi_file.length
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          Versi {vf.versi_ke} {vf.versi_ke === suratKeluar.versi_file.length && '(Terbaru)'}
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-700">{vf.nama_file}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {vf.uploaded_at}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mb-2">
                      <span className="font-semibold text-slate-700">Catatan Revisi / Ringkasan: </span>
                      {vf.catatan_revisi || 'Draft diajukan'}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>Diupload oleh: <strong className="text-slate-700">{vf.nama_uploader}</strong></span>
                      <button
                        onClick={() => setActiveTab('surat')}
                        className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs flex items-center gap-1"
                      >
                        Pratinjau Versi Ini
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Tata Kelola Persuratan Resmi BKPSDMD Kota Bitung</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};
