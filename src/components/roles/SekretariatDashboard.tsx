/**
 * @file SekretariatDashboard.tsx
 * @description Dashboard Sekretariat BKPSDMD Kota Bitung (Verifikasi, Terverifikasi, Pengembalian, Penerusan Terpadu, dan Rekapitulasi)
 */

import React, { useState } from 'react';
import { usePersuratan } from '../../context/PersuratanContext';
import { SuratMasuk } from '../../types';
import {
  FileCheck2,
  CheckCircle,
  RotateCcw,
  Send,
  Eye,
  AlertTriangle,
  Printer,
  Download,
  BarChart3,
  Building,
  X
} from 'lucide-react';

interface SekretariatDashboardProps {
  onLihatSurat: (surat: SuratMasuk) => void;
  onLihatSuratKeluar?: (sk: any) => void;
  activeMenu?: string;
  onSelectMenu?: (menu: string) => void;
}

export const SekretariatDashboard: React.FC<SekretariatDashboardProps> = ({
  onLihatSurat,
  onLihatSuratKeluar,
  activeMenu: externalActiveMenu,
  onSelectMenu
}) => {
  const {
    suratMasukList,
    suratKeluarList,
    verifikasiSuratMasuk,
    kembalikanKeLoket,
    teruskanKeBagian,
    teruskanSuratKeluar,
  } = usePersuratan();

  const [internalMenu, setInternalMenu] = useState<string>('verifikasi');

  const rawMenu = externalActiveMenu || internalMenu;

  // Memetakan menu penerusan (baik penerusan_kaban maupun penerusan_bagian) menjadi 1 menu terpadu 'penerusan'
  const activeMenu =
    rawMenu === 'menunggu_verifikasi'
      ? 'verifikasi'
      : rawMenu === 'dikembalikan'
        ? 'pengembalian'
        : rawMenu === 'penerusan_kaban' || rawMenu === 'penerusan_bagian' || rawMenu === 'penerusan'
          ? 'penerusan'
          : rawMenu === 'rekapitulasiBulanan' || rawMenu === 'rekapitulasi'
            ? 'rekapitulasi'
            : rawMenu;

  const handleMenuChange = (m: string) => {
    setInternalMenu(m);
    if (onSelectMenu) {
      if (m === 'verifikasi') onSelectMenu('menunggu_verifikasi');
      else if (m === 'pengembalian') onSelectMenu('dikembalikan');
      else onSelectMenu(m);
    }
  };

  // Modal Kembalikan ke Loket
  const [modalKembalikanOpen, setModalKembalikanOpen] = useState(false);
  const [targetSuratKembalikan, setTargetSuratKembalikan] = useState<SuratMasuk | null>(null);
  const [alasanKembalikan, setAlasanKembalikan] = useState('');

  // Menghitung data statistik
  const menungguVerifikasi = suratMasukList.filter(
    (s) => s.status_surat === 'MENUNGGU_VERIFIKASI_SEKRETARIAT'
  );
  const terverifikasi = suratMasukList.filter(
    (s) =>
      s.status_surat === 'MENUNGGU_DISPOSISI_KEPALA_BADAN' ||
      s.status_surat === 'DISPOSISI_DIBUAT' ||
      s.status_surat === 'DITERUSKAN_KE_BAGIAN' ||
      s.status_surat === 'SEDANG_DIPROSES' ||
      s.status_surat === 'SELESAI'
  );
  const dikembalikanKeLoketCount = suratMasukList.filter(
    (s) => s.status_surat === 'DIKEMBALIKAN_KE_LOKET'
  );
  const dikembalikanDariBagianCount = suratMasukList.filter(
    (s) => s.status_surat === 'DIKEMBALIKAN_KE_SEKRETARIAT'
  );

  // Surat siap diteruskan ke Kepala Bagian (status: DISPOSISI_DIBUAT)
  const siapDiteruskanKeBagian = suratMasukList.filter(
    (s) => s.status_surat === 'DISPOSISI_DIBUAT'
  );

  // Surat siap/sedang diajukan ke Kepala Kantor (status: MENUNGGU_DISPOSISI_KEPALA_KANTOR)
  const antreanKepalaKantor = suratMasukList.filter(
    (s) => s.status_surat === 'MENUNGGU_DISPOSISI_KEPALA_BADAN'
  );

  // Ambil daftar surat keluar internal yang sudah disetujui Kepala Badan
  const suratKeluarSiapDiteruskan = (suratKeluarList || []).filter(
    (sk) => sk.status_persetujuan === 'DISETUJUI_KEPALA_BADAN'
  );

  // Gabungan total berkas siap diteruskan (Surat Masuk Disposisi + Surat Keluar Disetujui)
  const totalSiapDiteruskan = siapDiteruskanKeBagian.length + suratKeluarSiapDiteruskan.length;

  const handleOpenModalKembalikan = (surat: SuratMasuk) => {
    setTargetSuratKembalikan(surat);
    setAlasanKembalikan('');
    setModalKembalikanOpen(true);
  };

  const handleConfirmKembalikan = () => {
    if (!targetSuratKembalikan) return;
    if (!alasanKembalikan.trim()) {
      alert('Mohon cantumkan alasan pengembalian berkas ke Loket.');
      return;
    }
    kembalikanKeLoket(targetSuratKembalikan.id, alasanKembalikan.trim());
    setModalKembalikanOpen(false);
    setTargetSuratKembalikan(null);
  };

  // Data Rekapitulasi 12 Bulan (Jan - Des)
  const rekapitulasiBulanan = [
    { bulan: 'Januari', masuk: 24, keluar: 18, disposisi: 22 },
    { bulan: 'Februari', masuk: 31, keluar: 22, disposisi: 29 },
    { bulan: 'Maret', masuk: 28, keluar: 20, disposisi: 26 },
    { bulan: 'April', masuk: 35, keluar: 27, disposisi: 33 },
    { bulan: 'Mei', masuk: 29, keluar: 21, disposisi: 28 },
    { bulan: 'Juni', masuk: 42, keluar: 30, disposisi: 39 },
    { bulan: 'Juli', masuk: 38, keluar: 25, disposisi: 35 },
    { bulan: 'Agustus', masuk: 45, keluar: 34, disposisi: 41 },
    { bulan: 'September', masuk: 39, keluar: 28, disposisi: 37 },
    { bulan: 'Oktober', masuk: 48, keluar: 36, disposisi: 44 },
    { bulan: 'November', masuk: suratMasukList.length, keluar: suratKeluarList.length, disposisi: 4 },
    { bulan: 'Desember', masuk: 0, keluar: 0, disposisi: 0 }
  ];

  const maxChartValue = Math.max(...rekapitulasiBulanan.map((r) => Math.max(r.masuk, r.keluar, r.disposisi))) || 50;

  return (
    <div className="space-y-6">

      {/* Subheader Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700 border border-emerald-200">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Sekretariat BKPSDMD
            </h1>
            <p className="text-xs text-slate-500">
              Verifikasi keabsahan surat masuk, tata kelola pengembalian berkas, dan penerusan lembar disposisi
            </p>
          </div>
        </div>

        {/* Menu Navigation Pills */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 text-xs font-bold">
          <button
            onClick={() => handleMenuChange('verifikasi')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-2 ${activeMenu === 'verifikasi'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <span>Verifikasi</span>

            {menungguVerifikasi.length > 0 && (
              <span className="w-5 h-5 text-[10px] font-bold rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                {menungguVerifikasi.length}
              </span>
            )}
          </button>
          <button
            onClick={() => handleMenuChange('terverifikasi')}
            className={`px-3 py-1.5 rounded-lg transition ${activeMenu === 'terverifikasi' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Terverifikasi ({terverifikasi.length})
          </button>
        </div>
      </div>

      {/* 1. MENU: VERIFIKASI SURAT MASUK */}
      {activeMenu === 'verifikasi' && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Daftar Surat Masuk Menunggu Verifikasi Sekretariat
              </h3>
              <p className="text-xs text-slate-500">
                Periksa kelengkapan fisik, keterbacaan scan PDF, dan perihal sebelum diajukan ke Kepala Badan.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
              {menungguVerifikasi.length} Berkas Perlu Ditinjau
            </span>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-3 px-3 text-center border-r border-slate-200">No. Agenda</th>
                  <th className="py-3 px-3 text-center border-r border-slate-200">Asal, No, & Perihal Surat</th>
                  <th className="py-3 px-3 text-center border-r border-slate-200">Kategori</th>
                  <th className="py-3 px-3 text-center border-r border-slate-200">Sifat</th>
                  <th className="py-3 px-3 text-center border-r border-slate-200">Petugas Loket</th>
                  <th className="py-3 px-3 text-center border-r border-slate-200">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {menungguVerifikasi.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      ✓ Tidak ada antrean surat masuk yang menunggu verifikasi saat ini.
                    </td>
                  </tr>
                ) : (
                  menungguVerifikasi.map((surat) => (
                    <tr key={surat.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-950 whitespace-nowrap text-center border-r border-slate-200">
                        {surat.no_agenda}
                        <div className="text-[10px] text-slate-400 font-sans font-normal">
                          {surat.tgl_input.split(' ')[0]}
                        </div>
                      </td>
                      <td className="py-3 px-3 max-w-sm text-center border-r border-slate-200">
                        <p className="font-bold text-slate-900">{surat.asal_surat}</p>
                        <p className="text-[11px] font-mono text-slate-500">No: {surat.no_surat}</p>
                        <p className="text-[11px] text-slate-600 line-clamp-1 italic">"{surat.perihal}"</p>
                      </td>
                      <td className="py-3 px-3 text-center border-r border-slate-200">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                          {surat.nama_kategori}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center border-r border-slate-200">
                        <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-slate-100 text-slate-700">
                          {surat.sifat}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium whitespace-nowrap text-center border-r border-slate-200">
                        {surat.nama_petugas_loket}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap space-x-1.5 text-center border-r border-slate-200">
                        <button
                          onClick={() => onLihatSurat(surat)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition inline-flex items-center gap-1 cursor-pointer"
                          title="Lihat Berkas Dokumen"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat Surat</span>
                        </button>

                        <button
                          onClick={() => handleOpenModalKembalikan(surat)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold rounded-lg transition inline-flex items-center gap-1 cursor-pointer"
                          title="Kembalikan ke Loket jika berkas tidak lengkap/rusak"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Kembalikan</span>
                        </button>

                        <button
                          onClick={() => {
                            verifikasiSuratMasuk(surat.id);
                            alert(`Surat ${surat.no_agenda} berhasil diverifikasi dan diajukan ke Kepala Kantor!`);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition inline-flex items-center gap-1 shadow-xs cursor-pointer"
                          title="Verifikasi & Teruskan ke Kepala Badan"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Verifikasi</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. MENU: TERVERIFIKASI / PROSES */}
      {activeMenu === 'terverifikasi' && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Daftar Surat Terverifikasi &amp; Dalam Proses</span>
              </h3>
              <p className="text-xs text-slate-500">
                Surat yang telah berhasil lolos verifikasi Sekretariat dan sedang berjalan dalam alur disposisi/pengerjaan dinas.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
              {terverifikasi.length} Surat Terverifikasi
            </span>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-3 px-3">No. Agenda</th>
                  <th className="py-3 px-3">Asal Pengirim &amp; Perihal</th>
                  <th className="py-3 px-3">Status Saat Ini</th>
                  <th className="py-3 px-3">Posisi Terakhir</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {terverifikasi.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">
                      Belum ada surat yang terverifikasi saat ini.
                    </td>
                  </tr>
                ) : (
                  terverifikasi.map((surat) => (
                    <tr key={surat.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-950 whitespace-nowrap">
                        {surat.no_agenda}
                        <div className="text-[10px] text-slate-400 font-sans font-normal">
                          {surat.tgl_input.split(' ')[0]}
                        </div>
                      </td>
                      <td className="py-3 px-3 max-w-sm">
                        <p className="font-bold text-slate-900">{surat.asal_surat}</p>
                        <p className="text-[11px] text-slate-600 line-clamp-1 italic">"{surat.perihal}"</p>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {surat.status_surat.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {surat.disposisi?.nama_bagian_tujuan || 'Meja Kepala Badan'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onLihatSurat(surat)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" />
                          <span>Lihat Berkas</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MENU: MANAJEMEN PENGEMBALIAN SURAT (2 TABEL) */}
      {activeMenu === 'pengembalian' && (
        <div className="space-y-6">

          {/* TABEL 1: Dikembalikan oleh Kepala Bagian ke Sekretariat */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Surat Dikembalikan oleh Bagian</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Kepala Bagian mengembalikan surat karena tidak sesuai. Sekretariat dapat mengkonfirmasi atau memproses disposisi ulang.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
                {dikembalikanDariBagianCount.length} Berkas
              </span>
            </div>

            <div className="max-h-[300px] overflow-y-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs border-collapse min-w-[700px] whitespace-normal">
                <thead className='sticky top-0 z-10'>
                  <tr className="bg-amber-50 text-amber-900 uppercase font-bold border-b border-amber-200">
                    <th className="py-3 px-3 text-center border-r border-slate-200">No. Agenda</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Asal, No, &amp; Perihal Surat</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Bagian Pengembali</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Alasan Pengembalian Bagian</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Waktu Dikembalikan</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {dikembalikanDariBagianCount.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-slate-400">
                        Tidak ada surat yang dikembalikan oleh Kepala Bagian.
                      </td>
                    </tr>
                  ) : (
                    dikembalikanDariBagianCount.map((surat) => {
                      const latestReturn = surat.pengembalian?.[surat.pengembalian.length - 1];
                      return (
                        <tr key={surat.id} className="hover:bg-amber-50/40 transition">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 text-center border-r border-slate-200">{surat.no_agenda}</td>
                          <td className="py-3 px-3 max-w-xs text-center border-r border-slate-200">
                            <p className="font-bold text-slate-900">{surat.asal_surat}</p>
                            <p className="text-[11px] text-slate-600 italic whitespace-normal">"{surat.perihal}"</p>
                          </td>
                          <td className="py-3 px-3 font-semibold text-purple-900 text-center border-r border-slate-200">
                            {surat.disposisi?.nama_bagian_tujuan || 'Kepala Bagian'}
                          </td>
                          <td className="py-3 px-3 max-w-sm text-center border-r border-slate-200">
                            <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 font-medium">
                              {latestReturn?.alasan || 'Tidak ada alasan tertulis'}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap text-center border-r border-slate-200">
                            {latestReturn?.tgl_kembali || '-'}
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap space-x-2 text-center border-r border-slate-200">
                            <button
                              onClick={() => onLihatSurat(surat)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                            >
                              Lihat Surat
                            </button>
                            <button
                              onClick={() => {
                                verifikasiSuratMasuk(surat.id);
                                alert(`Surat ${surat.no_agenda} diajukan kembali ke Kepala Kantor untuk disposisi ulang.`);
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-xs inline-flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Disposisi Ulang / Ajukan ke Kaban</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABEL 2: Dikembalikan oleh Sekretariat ke Petugas Loket */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-red-900 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-red-600" />
                  <span>Surat Dikembalikan ke Petugas Loket</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Berkas surat masuk yang ditolak saat verifikasi Sekretariat karena scan buram atau data belum lengkap.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-red-100 text-red-800 rounded-full">
                {suratMasukList.filter((s) => s.status_surat === 'DIKEMBALIKAN_KE_LOKET').length} Berkas
              </span>
            </div>

            <div className="max-h-[300px] overflow-y-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-red-50 text-red-900 uppercase font-bold border-b border-red-200">
                    <th className="py-3 px-3 text-center border-r border-slate-200">No. Agenda</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Asal &amp; Perihal Surat</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Petugas Loket</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Catatan Perbaikan</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {suratMasukList.filter((s) => s.status_surat === 'DIKEMBALIKAN_KE_LOKET').length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400">
                        Tidak ada surat yang sedang dikembalikan ke Loket.
                      </td>
                    </tr>
                  ) : (
                    suratMasukList
                      .filter((s) => s.status_surat === 'DIKEMBALIKAN_KE_LOKET')
                      .map((surat) => {
                        const latestReturn = surat.pengembalian?.[surat.pengembalian.length - 1];
                        return (
                          <tr key={surat.id} className="hover:bg-red-50/40 transition">
                            <td className="py-3 px-3 font-mono font-bold text-slate-900 text-center border-r border-slate-200">
                              {surat.no_agenda}
                            </td>
                            <td className="py-3 px-3 max-w-xs text-center border-r border-slate-200">
                              <p className="font-bold text-slate-900">{surat.asal_surat}</p>
                              <p className="text-[11px] text-slate-600 italic">"{surat.perihal}"</p>
                            </td>
                            <td className="py-3 px-3 text-center font-medium border-r border-slate-200">
                              {surat.nama_petugas_loket}
                            </td>
                            <td className="py-3 px-3 max-w-sm text-center border-r border-slate-200">
                              <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-900 font-medium">
                                {latestReturn?.alasan || 'Berkas perlu diperbaiki oleh Loket'}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center border-r border-slate-200">
                              <button
                                onClick={() => onLihatSurat(surat)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                              >
                                Lihat Berkas
                              </button>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. MENU HALAMAN PENERUSAN SURAT TERPADU (2 TABEL MENGGABUNGKAN KEPALA KANTOR & KEPALA BAGIAN) */}
      {activeMenu === 'penerusan' && (
        <div className="space-y-6">

          {/* TABEL 1: ANTREAN DIAJUKAN KE KEPALA KANTOR */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-blue-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  <span>Penerusan Surat ke Kepala Badan</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Surat yang telah selesai diverifikasi oleh Sekretariat dan kini berada di meja kerja Kepala Badan untuk diterbitkan Lembar Disposisi.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200">
                {antreanKepalaKantor.length} Berkas Menunggu
              </span>
            </div>


            <div className="max-h-[250px] overflow-y-auto -mx-4 rounded-xl sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead className='sticky top-0 z-10'>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <th className="py-3 px-3 text-center border-r border-slate-200">No. Agenda</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Asal, No, &amp; Perihal Surat</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Sifat</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Status Saat Ini</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {antreanKepalaKantor.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        ✓ Tidak ada surat yang sedang menunggu disposisi Kepala Badan saat ini.
                      </td>
                    </tr>
                  ) : (
                    antreanKepalaKantor.map((surat) => (
                      <tr key={surat.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3 font-mono font-bold text-blue-900 text-center border-r border-slate-200">
                          <div className="w-full overflow-hidden breakwords whitespace-normal">
                            {surat.no_agenda}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900 text-center group cursor-pointer border-r border-slate-200">
                          {/* asal surat */}
                          <div className='w-full overflow-hidden breakwords whitespace-normal'>
                            {surat.asal_surat}
                          </div>

                          {/* No surat */}
                          <div>
                            <p className='text-[10px] font-bold italic inline-block whitespace-normal'>
                              {surat.no_surat}
                            </p>
                          </div>

                          {/* perihal */}
                          <div>
                            <p className='text-[8px] text-slate-600 italic inline-block whitespace-normal cursor-pointer hover-marquee'>
                              {surat.perihal}
                            </p>
                          </div>
                        </td>


                        <td className="py-3 px-3 text-center border-r border-slate-200">
                          <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-slate-100 text-slate-700">
                            {surat.sifat}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center border-r border-slate-200">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                            MENUNGGU DISPOSISI KEPALA KANTOR
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center border-r border-slate-200">
                          <button
                            onClick={() => onLihatSurat(surat)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold inline-flex items-center gap-1 cursor-pointer"
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

          {/* TABEL 2: SIAP DITERUSKAN KE KEPALA BAGIAN */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-indigo-900 flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-600" />
                  <span>Penerusan Surat ke Kepala Bagian</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Surat masuk berdisposisi maupun naskah dinas antar-bagian yang telah disetujui Kepala Badan dan siap diteruskan ke Bagian tujuan.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-800 rounded-full border border-indigo-200">
                {totalSiapDiteruskan} Siap Diteruskan
              </span>
            </div>

            <div className="max-h-[300px] overflow-y-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <th className="py-3 px-3 text-center border-r border-slate-200">No. Agenda / Draft</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Asal, No, &amp; Perihal Surat</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Bagian Tujuan Disposisi</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Instruksi / Persetujuan Kepala Badan</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Aksi Penerusan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {totalSiapDiteruskan === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400">
                        ✓ Semua surat yang telah didisposisi / disetujui sudah berhasil diteruskan ke masing-masing Bagian tujuan.
                      </td>
                    </tr>
                  ) : (
                    <>
                      {/* 1. BARIS SURAT MASUK YANG SUDAH DIDISPOSISI */}
                      {siapDiteruskanKeBagian.map((surat) => (
                        <tr key={`sm-${surat.id}`} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 text-center border-r border-slate-200">
                            <div>{surat.no_agenda}</div>
                            <span className="mt-1 inline-block px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-100 text-blue-800">
                              Surat Masuk
                            </span>
                          </td>
                          <td className="py-3 px-3 max-w-xs text-center group cursor-pointer border-r border-slate-200">
                            <div>
                              <p className="font-bold text-slate-900">{surat.asal_surat}</p>
                            </div>
                            <div>
                              <p className="text-[11px] font-bold inline-block whitespace-normal italic">
                                {surat.no_surat}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-600 italic inline-block whitespace-normal">
                                {surat.perihal}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap text-center border-r border-slate-200">
                            <div className="flex items-center justify-center gap-1.5 font-extrabold text-purple-900 bg-purple-50 p-1.5 rounded-lg border border-purple-200">
                              <Building className="w-3.5 h-3.5 text-purple-700" />
                              <span>{surat.disposisi?.nama_bagian_tujuan}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 max-w-xs text-center border-r border-slate-200">
                            <div className="text-[11px] text-slate-700 space-y-0.5">
                              {surat.disposisi?.instruksi.slice(0, 2).map((ins, i) => (
                                <p key={i} className="whitespace-normal">
                                  - {ins}
                                </p>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap space-x-2 text-center border-r border-slate-200">
                            <button
                              onClick={() => onLihatSurat(surat)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                            >
                              Lihat Disposisi
                            </button>
                            <button
                              onClick={() => {
                                teruskanKeBagian(surat.id);
                                alert(`Surat ${surat.no_agenda} dan lembar disposisi berhasil diteruskan ke ${surat.disposisi?.nama_bagian_tujuan}!`);
                              }}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-xs inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Teruskan ke Bagian</span>
                            </button>
                          </td>
                        </tr>
                      ))}

                      {/* 2. BARIS SURAT KELUAR INTERNAL YANG DISETUJUI KEPALA BADAN */}
                      {suratKeluarSiapDiteruskan.map((sk) => (
                        <tr key={`sk-${sk.id}`} className="hover:bg-emerald-50/30 transition">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 text-center border-r border-slate-200">
                            <div>{sk.no_draft}</div>
                            <span className="mt-1 inline-block px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-100 text-emerald-800">
                              {sk.jenis_naskah || 'Nota Dinas'}
                            </span>
                          </td>
                          <td className="py-3 px-3 max-w-xs text-center border-r border-slate-200">
                            <div>
                              <p className="font-bold text-slate-900">Dari: {sk.nama_bagian_pengirim}</p>
                            </div>
                            <div>
                              <p className="text-[11px] font-bold inline-block whitespace-normal italic text-slate-700">
                                {sk.no_draft}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-600 italic inline-block whitespace-normal">
                                {sk.perihal}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap text-center border-r border-slate-200">
                            <div className="flex items-center justify-center gap-1.5 font-extrabold text-purple-900 bg-purple-50 p-1.5 rounded-lg border border-purple-200">
                              <Building className="w-3.5 h-3.5 text-purple-700" />
                              <span>{sk.nama_bagian_tujuan}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 max-w-xs text-center border-r border-slate-200">
                            <div className="text-[11px] text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg p-1.5 space-y-0.5">
                              <p className="font-bold">✓ Disetujui Kepala Badan</p>
                              <p className="text-[10px] text-slate-600 whitespace-normal">
                                Naskah dinas siap diteruskan ke bagian tujuan
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap space-x-2 text-center border-r border-slate-200">
                            {onLihatSuratKeluar && (
                              <button
                                onClick={() => onLihatSuratKeluar(sk)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                              >
                                Lihat Naskah
                              </button>
                            )}
                            <button
                              onClick={() => {
                                teruskanSuratKeluar(sk.id);
                                alert(`Naskah ${sk.no_draft} berhasil diteruskan ke ${sk.nama_bagian_tujuan}!`);
                              }}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-xs inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Teruskan ke Bagian</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )
      }

      {/* 4B. MENU: STATUS PENERUSAN SURAT */}
      {(activeMenu === 'status_penerusan' ||
        activeMenu === 'status-penerusan' ||
        activeMenu === 'status') && (
          <div className="space-y-6">
            {/* TABEL 1: STATUS PENERUSAN SURAT MASUK KE BAGIAN */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-emerald-600" />
                    <span>Status Penerusan &amp; Tindak Lanjut Surat Masuk</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pantau progres pengerjaan surat masuk yang telah diteruskan Sekretariat ke masing-masing Kepala Bagian.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                  {
                    suratMasukList.filter((s) =>
                      [
                        'DITERUSKAN_KE_BAGIAN',
                        'SEDANG_DIPROSES',
                        'SELESAI',
                        'ARSIP',
                        'DIKEMBALIKAN_KE_SEKRETARIAT',
                      ].includes(s.status_surat)
                    ).length
                  }{' '}
                  Surat Diteruskan
                </span>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                      <th className="py-3 px-3 text-center border-r border-slate-200">No. Agenda</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">Asal &amp; Perihal Surat</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">Bagian Tujuan</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">Status Pengerjaan</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {suratMasukList.filter((s) =>
                      [
                        'DITERUSKAN_KE_BAGIAN',
                        'SEDANG_DIPROSES',
                        'SELESAI',
                        'ARSIP',
                        'DIKEMBALIKAN_KE_SEKRETARIAT',
                      ].includes(s.status_surat)
                    ).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-slate-400">
                          Belum ada surat masuk yang diteruskan ke bagian tujuan.
                        </td>
                      </tr>
                    ) : (
                      suratMasukList
                        .filter((s) =>
                          [
                            'DITERUSKAN_KE_BAGIAN',
                            'SEDANG_DIPROSES',
                            'SELESAI',
                            'ARSIP',
                            'DIKEMBALIKAN_KE_SEKRETARIAT',
                          ].includes(s.status_surat)
                        )
                        .map((surat) => (
                          <tr key={surat.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-3 font-mono font-bold text-slate-900 text-center border-r border-slate-200">
                              {surat.no_agenda}
                            </td>
                            <td className="py-3 px-3 max-w-xs border-r border-slate-200">
                              <p className="font-bold text-slate-900">{surat.asal_surat}</p>
                              <p className="text-[11px] text-slate-600 line-clamp-1 italic">"{surat.perihal}"</p>
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-purple-900 border-r border-slate-200">
                              {surat.disposisi?.nama_bagian_tujuan || '-'}
                            </td>
                            <td className="py-3 px-3 text-center border-r border-slate-200">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${surat.status_surat === 'SELESAI' || surat.status_surat === 'ARSIP'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : surat.status_surat === 'SEDANG_DIPROSES'
                                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                                    : surat.status_surat === 'DIKEMBALIKAN_KE_SEKRETARIAT'
                                      ? 'bg-red-100 text-red-800 border-red-300'
                                      : 'bg-blue-100 text-blue-800 border-blue-300'
                                  }`}
                              >
                                {surat.status_surat.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center border-r border-slate-200">
                              <button
                                onClick={() => onLihatSurat(surat)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat Detail</span>
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABEL 2: STATUS PENERUSAN NASKAH DINAS INTERNAL (SURAT KELUAR) */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-indigo-950 flex items-center gap-2">
                    <Send className="w-5 h-5 text-indigo-600" />
                    <span>Status Penerusan Naskah Dinas Internal Antar-Bagian</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Riwayat nota dinas / surat internal yang telah disetujui Kepala Badan dan diteruskan Sekretariat ke Bagian tujuan.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-800 rounded-full border border-indigo-200">
                  {suratKeluarList.filter((sk) => sk.status_persetujuan === 'DITERUSKAN_KE_BAGIAN_TUJUAN').length}{' '}
                  Naskah Diteruskan
                </span>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                      <th className="py-3 px-3 text-center border-r border-slate-200">No. Draft</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">Bagian Pengirim &amp; Perihal</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">Bagian Tujuan</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">Status Penerusan</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {suratKeluarList.filter((sk) => sk.status_persetujuan === 'DITERUSKAN_KE_BAGIAN_TUJUAN').length ===
                      0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-slate-400">
                          Belum ada naskah dinas internal yang diteruskan ke bagian tujuan.
                        </td>
                      </tr>
                    ) : (
                      suratKeluarList
                        .filter((sk) => sk.status_persetujuan === 'DITERUSKAN_KE_BAGIAN_TUJUAN')
                        .map((sk) => (
                          <tr key={sk.id} className="hover:bg-indigo-50/40 transition">
                            <td className="py-3 px-3 font-mono font-bold text-slate-900 text-center border-r border-slate-200">
                              <div>{sk.no_draft}</div>
                              <span className="mt-1 inline-block px-1.5 py-0.5 text-[9px] font-bold rounded bg-indigo-100 text-indigo-800">
                                {sk.jenis_naskah || 'Nota Dinas'}
                              </span>
                            </td>
                            <td className="py-3 px-3 max-w-xs border-r border-slate-200">
                              <p className="font-bold text-slate-900">Dari: {sk.nama_bagian_pengirim}</p>
                              <p className="text-[11px] text-slate-600 line-clamp-1 italic">"{sk.perihal}"</p>
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-purple-900 border-r border-slate-200">
                              {sk.nama_bagian_tujuan}
                            </td>
                            <td className="py-3 px-3 text-center border-r border-slate-200">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                DITERUSKAN KE BAGIAN TUJUAN
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center border-r border-slate-200">
                              {onLihatSuratKeluar && (
                                <button
                                  onClick={() => onLihatSuratKeluar(sk)}
                                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-semibold inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Lihat Naskah</span>
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

      {/* 5. MENU: LAPORAN REKAPITULASI (GRAFIK + TABEL) */}
      {(activeMenu === 'rekapitulasi' || activeMenu === 'rekapitulasiBulanan') && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  <span>Rekapitulasi Bulanan Persuratan BKPSDMD Kota Bitung (Tahun Anggaran 2026)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Grafik komparasi 3 metrik tata kelola: Surat Masuk, Surat Keluar Internal, dan Lembar Disposisi Kepala Badan
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Laporan</span>
                </button>
                <button
                  onClick={() => {
                    const csvRows = [
                      ['Bulan', 'Surat Masuk', 'Surat Keluar', 'Disposisi'],
                      ...rekapitulasiBulanan.map((r) => [r.bulan, r.masuk, r.keluar, r.disposisi])
                    ];
                    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', 'rekapitulasi_persuratan_bkpsdmd_2026.csv');
                    document.body.appendChild(link);
                    link.click();
                  }}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ekspor CSV/Excel</span>
                </button>
              </div>
            </div>

            {/* Visualisasi Grafik Batang */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Visualisasi Aktivitas Per Bulan
                </span>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-blue-700">
                    <span className="w-3 h-3 rounded-xs bg-blue-500 inline-block"></span> Surat Masuk
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-700">
                    <span className="w-3 h-3 rounded-xs bg-purple-500 inline-block"></span> Surat Keluar
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block"></span> Disposisi
                  </span>
                </div>
              </div>

              {/* Bar Chart Container */}
              <div className="h-56 flex items-end justify-between gap-1 sm:gap-2 pt-6 px-2 border-b border-slate-300">
                {rekapitulasiBulanan.map((item, idx) => {
                  const pctMasuk = (item.masuk / maxChartValue) * 100;
                  const pctKeluar = (item.keluar / maxChartValue) * 100;
                  const pctDisposisi = (item.disposisi / maxChartValue) * 100;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                        <div
                          style={{ height: `${pctMasuk}%` }}
                          className="w-1.5 sm:w-2.5 bg-blue-500 rounded-t-xs hover:bg-blue-600 transition"
                          title={`Surat Masuk: ${item.masuk}`}
                        />
                        <div
                          style={{ height: `${pctKeluar}%` }}
                          className="w-1.5 sm:w-2.5 bg-purple-500 rounded-t-xs hover:bg-purple-600 transition"
                          title={`Surat Keluar: ${item.keluar}`}
                        />
                        <div
                          style={{ height: `${pctDisposisi}%` }}
                          className="w-1.5 sm:w-2.5 bg-emerald-500 rounded-t-xs hover:bg-emerald-600 transition"
                          title={`Disposisi: ${item.disposisi}`}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mt-2 truncate w-full text-center">
                        {item.bulan.substring(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tabel Rekapan */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Tabel Rincian Data Rekapitulasi Persuratan
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse border border-slate-200 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3 border-r border-slate-200">Bulan Pelaporan</th>
                      <th className="py-2.5 px-3 text-center border-r border-slate-200">Surat Masuk</th>
                      <th className="py-2.5 px-3 text-center border-r border-slate-200">Surat Keluar</th>
                      <th className="py-2.5 px-3 text-center border-r border-slate-200">Disposisi</th>
                      <th className="py-2.5 px-3 text-center border-r border-slate-200">Rasio Penyelesaian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {rekapitulasiBulanan.map((row, i) => {
                      const rasio = row.masuk > 0 ? Math.round((row.disposisi / row.masuk) * 100) : 0;
                      return (
                        <tr key={i} className="hover:bg-slate-50 transition">
                          <td className="py-2 px-3 font-semibold text-slate-900">{row.bulan}</td>
                          <td className="py-2 px-3 text-center font-mono">{row.masuk}</td>
                          <td className="py-2 px-3 text-center font-mono">{row.keluar}</td>
                          <td className="py-2 px-3 text-center font-mono">{row.disposisi}</td>
                          <td className="py-2 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${rasio >= 90
                                ? 'bg-emerald-100 text-emerald-800'
                                : rasio >= 70
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-600'
                                }`}
                            >
                              {rasio}% Selesai
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )
      }

      {/* MODAL KEMBALIKAN BERKAS KE LOKET */}
      {
        modalKembalikanOpen && targetSuratKembalikan && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Kembalikan Berkas Surat ke Loket Pelayanan
                    </h3>
                    <p className="text-xs text-slate-500">
                      Surat akan berstatus <strong>DIKEMBALIKAN_KE_LOKET</strong> untuk diperbaiki fisik/scan PDF-nya.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalKembalikanOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <p><strong>No. Agenda:</strong> {targetSuratKembalikan.no_agenda}</p>
                <p><strong>Pengirim:</strong> {targetSuratKembalikan.asal_surat}</p>
                <p><strong>Perihal:</strong> {targetSuratKembalikan.perihal}</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Alasan Pengembalian Berkas (Wajib):
                </label>
                <textarea
                  rows={3}
                  required
                  value={alasanKembalikan}
                  onChange={(e) => setAlasanKembalikan(e.target.value)}
                  placeholder="Contoh: Lampiran halaman 3 buram / scan terpotong / stempel tanda tangan tidak jelas..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalKembalikanOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmKembalikan}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Konfirmasi Kembalikan
                </button>
              </div>
            </div>
          </div>
        )
      }

    </div >
  );
};