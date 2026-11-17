/**
 * @file ModalPdfViewer.tsx
 * @description Modal Pratinjau Dokumen Naskah & Lembar Disposisi Digital Resmi BKPSDMD Kota Bitung
 */

import React, { useState, useEffect, useRef } from 'react';
import { SuratMasuk, SuratKeluar, SuratKeluarVersiFile } from '../types';
import { createPortal } from 'react-dom';
import {
  X,
  FileText,
  Printer,
  Download,
  CheckCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  UserCheck,
  Layers,
  FileSearch,
  ExternalLink
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
  const [activeTab, setActiveTab] = useState<'scan_pdf' | 'versi'>('scan_pdf');
  const [selectedVersi, setSelectedVersi] = useState<SuratKeluarVersiFile | null>(null);
  const [blobPdfUrl, setBlobPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);

  const pdfIframeRef = useRef<HTMLIFrameElement | null>(null);
  const printableSheetRef = useRef<HTMLDivElement | null>(null);

  const isMasuk = !!suratMasuk;
  const disposisi = suratMasuk?.disposisi;
  const activeVersi =
    selectedVersi ||
    versiDipilih ||
    (!isMasuk && suratKeluar?.versi_file?.length
      ? suratKeluar.versi_file[suratKeluar.versi_file.length - 1]
      : null);

  const pdfFileName = isMasuk
    ? (suratMasuk?.file_pdf || 'berkas_surat_masuk.pdf')
    : (activeVersi?.nama_file || 'naskah_surat_keluar.pdf');

  const backendBaseUrl = 'http://localhost:5000';
  const rawFileUrl = isMasuk
    ? suratMasuk?.file_url
    : (suratKeluar?.file_url ||
      (pdfFileName && pdfFileName !== 'naskah_surat_keluar.pdf'
        ? `/uploads/surat_keluar/${encodeURIComponent(pdfFileName)}`
        : undefined));

  const resolvedFileUrl = rawFileUrl
    ? (rawFileUrl.startsWith('http://') ||
      rawFileUrl.startsWith('https://') ||
      rawFileUrl.startsWith('blob:') ||
      rawFileUrl.startsWith('data:')
      ? rawFileUrl
      : `${backendBaseUrl}${rawFileUrl.startsWith('/') ? '' : '/'}${rawFileUrl}`)
    : undefined;

  // Reset tab & versi setiap kali modal dibuka untuk surat baru
  useEffect(() => {
    if (isOpen) {
      setActiveTab('scan_pdf');
      setSelectedVersi(versiDipilih || null);
    }
  }, [isOpen, suratMasuk?.id, suratKeluar?.id, versiDipilih]);

  // Konversi file PDF backend menjadi Blob URL lokal agar Print & Download berfungsi penuh
  useEffect(() => {
    if (!isOpen || !resolvedFileUrl) {
      setBlobPdfUrl(null);
      return;
    }

    let objectUrl: string | null = null;
    const fetchPdfAsBlob = async () => {
      try {
        setIsLoadingPdf(true);
        const response = await fetch(resolvedFileUrl);
        if (!response.ok) throw new Error('Gagal memuat berkas PDF');
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setBlobPdfUrl(objectUrl);
      } catch (err) {
        console.error('Fallback ke URL langsung:', err);
        setBlobPdfUrl(resolvedFileUrl);
      } finally {
        setIsLoadingPdf(false);
      }
    };

    fetchPdfAsBlob();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [isOpen, resolvedFileUrl]);

  if (!isOpen) return null;

  // Fungsi Cetak Bersih (Khusus dokumen aktif, tanpa sidebar & tanpa modal)
  const handlePrint = () => {
    // 1. Jika sedang di tab Scan PDF dan file PDF nyata tersedia
    if (activeTab === 'scan_pdf' && (blobPdfUrl || resolvedFileUrl)) {
      try {
        const iframeWin = pdfIframeRef.current?.contentWindow;
        if (iframeWin) {
          iframeWin.focus();
          iframeWin.print();
          return;
        }
      } catch {
        // Fallback jika cross-origin memblokir akses iframe
      }
      window.open(blobPdfUrl || resolvedFileUrl, '_blank');
      return;
    }

    // 2. Jika di tab Naskah Digital / Lembar Disposisi / Lembar Scan HTML
    if (printableSheetRef.current) {
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';
      document.body.appendChild(printFrame);

      const frameDoc = printFrame.contentWindow?.document;
      if (!frameDoc) return;

      // Salin stylesheet aplikasi agar tampilan Kop Surat & Disposisi tetap presisi
      const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map((node) => node.outerHTML)
        .join('\n');

      frameDoc.open();
      frameDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Cetak Dokumen - ${isMasuk ? suratMasuk?.no_agenda : suratKeluar?.no_draft}</title>
            ${styles}
            <style>
              @page { size: A4; margin: 14mm; }
              body { background: #fff !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            </style>
          </head>
          <body>
            <div style="max-width: 100%; margin: 0 auto;">
              ${printableSheetRef.current.innerHTML}
            </div>
          </body>
        </html>
      `);
      frameDoc.close();

      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        }, 1000);
      }, 300);
    }
  };

  // Fungsi Unduh Berkas PDF Asli
  const handleDownloadPdf = async () => {
    const cleanFileName = (
      pdfFileName ||
      `${(isMasuk ? suratMasuk?.no_agenda : suratKeluar?.no_draft || 'Dokumen').replace(/\//g, '_')}.pdf`
    ).replace(/\s+/g, '_');
    const finalName = cleanFileName.toLowerCase().endsWith('.pdf') ? cleanFileName : `${cleanFileName}.pdf`;

    if (blobPdfUrl && blobPdfUrl.startsWith('blob:')) {
      const a = document.createElement('a');
      a.href = blobPdfUrl;
      a.download = finalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    if (resolvedFileUrl) {
      try {
        const res = await fetch(resolvedFileUrl);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = finalName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return;
      } catch {
        window.open(resolvedFileUrl, '_blank');
        return;
      }
    }

    // Jika belum ada file fisik yang diunggah, arahkan ke dialog Simpan sebagai PDF yang bersih
    handlePrint();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-5 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[92vh] flex flex-col overflow-hidden border border-slate-200">

        {/* 1. HEADER MODAL (Satu Pusat Aksi) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-emerald-500/15 rounded-xl text-emerald-400 border border-emerald-500/30 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isMasuk ? 'SURAT MASUK' : 'SURAT KELUAR INTERNAL'}
                </span>
                <span className="text-xs text-slate-400 font-mono truncate">
                  {isMasuk ? suratMasuk.no_agenda : suratKeluar?.no_draft}
                </span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-100 truncate mt-0.5">
                {isMasuk ? suratMasuk.perihal : suratKeluar?.perihal}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {(blobPdfUrl || resolvedFileUrl) && (
              <a
                href={blobPdfUrl || resolvedFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg inline-flex items-center gap-1.5 border border-slate-700 font-semibold transition"
                title="Buka PDF di Tab Baru"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tab Baru</span>
              </a>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-lg inline-flex items-center gap-1.5 border border-slate-700 font-semibold transition cursor-pointer"
              title="Cetak Dokumen"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg inline-flex items-center gap-1.5 transition font-bold shadow-xs cursor-pointer"
              title="Unduh File PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer ml-1"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. BAR TAB & INFO NAMA FILE RINGKAS */}
        {/* 2. BAR TAB & INFO NAMA FILE RINGKAS */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('scan_pdf')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition inline-flex items-center gap-1.5 cursor-pointer ${activeTab === 'scan_pdf'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>Berkas Scan PDF Asli</span>
            </button>

            {!isMasuk && suratKeluar && (
              <button
                type="button"
                onClick={() => setActiveTab('versi')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition inline-flex items-center gap-1.5 cursor-pointer ${activeTab === 'versi'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Riwayat Versi ({suratKeluar.versi_file.length})</span>
              </button>
            )}
          </div>

          <div
            className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200 max-w-xs sm:max-w-sm truncate"
            title={pdfFileName}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate font-mono">{pdfFileName}</span>
          </div>
        </div>

        {/* 3. AREA KONTEN PRATINJAU */}
        <div className="flex-1 overflow-hidden bg-slate-200/70 flex flex-col">

          {/* TAB 1: BERKAS SCAN PDF ASLI */}
          {activeTab === 'scan_pdf' && (
            resolvedFileUrl ? (
              <div className="w-full h-full bg-slate-800 relative">
                {isLoadingPdf ? (
                  <div className="h-full flex items-center justify-center text-xs font-semibold text-slate-300">
                    Memuat pratinjau dokumen PDF...
                  </div>
                ) : (
                  <iframe
                    ref={pdfIframeRef}
                    src={`${blobPdfUrl || resolvedFileUrl}#navpanes=0&view=FitH`}
                    title="Pratinjau PDF Asli"
                    className="w-full h-full border-0 bg-white"
                  />
                )}
              </div>
            ) : (
              /* Fallback Lembar Pratinjau Scan Fisik jika belum ada file PDF fisik */
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div
                  ref={printableSheetRef}
                  className="max-w-3xl mx-auto relative bg-white shadow-md border border-slate-300 rounded-xl p-6 sm:p-10 font-serif text-slate-900 overflow-hidden"
                >
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 select-none -rotate-45">
                    <span className="text-6xl font-sans font-black tracking-widest text-slate-900 uppercase">
                      BKPSDMD BITUNG SCAN
                    </span>
                  </div>

                  <div className="absolute top-6 right-6 border-2 border-dashed border-red-500/80 rounded-lg p-2 text-center text-[10px] font-sans font-bold text-red-600 bg-red-50/50 -rotate-2">
                    <p className="uppercase tracking-widest">TELAH DIPERIKSA / SCAN</p>
                    <p className="font-mono text-xs text-red-700">{isMasuk ? suratMasuk?.no_agenda : suratKeluar?.no_draft}</p>
                    <p className="text-[9px] text-slate-500 font-normal">BKPSDMD KOTA BITUNG</p>
                  </div>

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
                          Lampiran Berkas: <span className="font-mono font-semibold text-slate-800">{pdfFileName}</span>
                        </p>
                      </div>
                    </div>
                  </div>

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
                    </div>

                    <div className="pt-8 flex justify-between items-end border-t border-slate-200 mt-6">
                      <div className="text-[11px] text-slate-500 font-sans">
                        <p className="font-semibold text-slate-700">Digital Authenticity Verified</p>
                        <p>ID Berkas: {isMasuk ? `SM-${suratMasuk?.id}` : `SK-${suratKeluar?.id}`}</p>
                      </div>
                      <div className="text-center font-sans text-xs">
                        <p className="text-slate-600 mb-3">Diverifikasi &amp; Disahkan</p>
                        <div className="w-24 h-10 mx-auto border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] text-emerald-700 bg-emerald-50/60 font-bold mb-1">
                          ✓ TTD RESMI
                        </div>
                        <p className="font-bold text-slate-900 underline">
                          {isMasuk ? suratMasuk?.asal_surat : (suratKeluar?.nama_bagian_pengirim || 'Kepala Bagian')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}


          {/* TAB 4: RIWAYAT VERSI SURAT KELUAR */}
          {activeTab === 'versi' && suratKeluar && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
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
                      className={`p-4 rounded-xl border transition ${vf.versi_ke === suratKeluar.versi_file.length
                        ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400'
                        : 'bg-white border-slate-200'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${vf.versi_ke === suratKeluar.versi_file.length
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                              }`}
                          >
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
                          type="button"
                          onClick={() => {
                            setSelectedVersi(vf);
                            setActiveTab('scan_pdf');
                          }}
                          className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          Pratinjau Versi Ini
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. FOOTER */}
        <div className="bg-white px-5 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Tata Kelola Persuratan Resmi BKPSDMD Kota Bitung</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition cursor-pointer"
          >
            Tutup Pratinjau
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};