/**
 * @file SekretariatDashboard.tsx
 * @description Dashboard Sekretariat BKPSDMD Kota Bitung (Verifikasi, Terverifikasi, Pengembalian, Penerusan Terpadu, dan Rekapitulasi)
 */

import React, { useState, useMemo } from 'react';
import { usePersuratan } from '../../context/PersuratanContext';
import LOGO_KOTA_BITUNG_SULAWESI_UTARA from '../../assets/LOGO_KOTA_BITUNG_SULAWESI_UTARA.png';
import { SuratMasuk } from '../../types';
import { Printer } from 'lucide-react';
import {
  FileCheck2,
  CheckCircle,
  RotateCcw,
  Send,
  Eye,
  AlertTriangle,
  Download,
  BarChart3,
  Building,
  X,
  Archive
} from 'lucide-react';

import { ArsipSurat } from '../ArsipSurat';

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
    bagianList,
    verifikasiSuratMasuk,
    kembalikanKeLoket,
    teruskanKeBagian,
    teruskanSuratKeluar,
    arsipkanSuratKeluar,
    updateStatusPengerjaan
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
  // Identifikasi unit Sekretariat (kode_bagian: 'SEKR')
  const idSekretariat = (bagianList || []).find(
    (b: any) =>
      b.kode_bagian?.toUpperCase() === 'SEKR' ||
      b.nama_bagian?.toLowerCase().includes('sekretar')
  )?.id;

  const isTujuanSekretaris = (s: SuratMasuk) => {
    if (!s.disposisi) return false;
    const namaTujuan = (s.disposisi.nama_bagian_tujuan || '').toLowerCase();
    return (
      (idSekretariat !== undefined && s.disposisi.id_bagian_tujuan === idSekretariat) ||
      namaTujuan.includes('sekretaris') ||
      namaTujuan.includes('sekretariat')
    );
  };

  // Surat siap diteruskan ke Kepala Bidang (selain tujuan Sekretaris)
  const siapDiteruskanKeBagian = suratMasukList.filter(
    (s) => s.status_surat === 'DISPOSISI_DIBUAT' && !isTujuanSekretaris(s)
  );

  // Disposisi Kepala Badan yang diarahkan ke Sekretaris (langsung ditangani Sekretariat)
  const disposisiSekretaris = suratMasukList.filter(
    (s) =>
      isTujuanSekretaris(s) &&
      ['DISPOSISI_DIBUAT', 'DITERUSKAN_KE_BAGIAN', 'SEDANG_DIPROSES', 'SELESAI'].includes(
        s.status_surat
      )
  );

  const disposisiSekretarisAktifCount = disposisiSekretaris.filter(
    (s) => s.status_surat !== 'SELESAI'
  ).length;

  // Surat siap/sedang diajukan ke Kepala Kantor (status: MENUNGGU_DISPOSISI_KEPALA_KANTOR)
  const antreanKepalaKantor = suratMasukList.filter(
    (s) => s.status_surat === 'MENUNGGU_DISPOSISI_KEPALA_BADAN'
  );

  // Ambil daftar surat keluar internal yang sudah disetujui Kepala Badan
  // Ambil daftar surat keluar internal yang sudah disetujui Kepala Badan
  const suratKeluarSiapDiteruskan = (suratKeluarList || []).filter((sk) =>
    [
      'DISETUJUI_KEPALA_BADAN',
      'DISETUJUI_KEPALA_KANTOR',
      'DISETUJUI',
    ].includes(sk.status_persetujuan)
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
  // Helper membaca indeks bulan (0 = Jan ... 11 = Des) dari tanggal database
  const getBulanIndex = (rawDate?: string): number | null => {
    if (!rawDate) return null;
    const str = String(rawDate).trim();
    const tahunSekarang = new Date().getFullYear();

    // 1. Format ISO / SQL: "2026-11-18..."
    const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const tahun = Number(isoMatch[1]);
      const bulan = Number(isoMatch[2]) - 1;
      return tahun === tahunSekarang && bulan >= 0 && bulan <= 11 ? bulan : null;
    }

    // 2. Format teks Indonesia: "17 Nov 2026 • 19:07 WITA"
    const namaBulan = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'sep', 'okt', 'nov', 'des'];
    const lower = str.toLowerCase();
    if (!lower.includes(String(tahunSekarang))) return null;

    for (let i = 0; i < namaBulan.length; i++) {
      if (lower.includes(namaBulan[i])) return i;
    }
    return null;
  };

  // Hitung rekap 12 bulan otomatis dari database (mulai dari 0)
  const rekapBulananDb = useMemo(() => {
    const daftarBulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];

    const hasil = daftarBulan.map((nama) => ({
      bulan: nama,
      masuk: 0,
      keluar: 0,
      disposisi: 0,
      selesai: 0,
    }));

    (suratMasukList || []).forEach((sm: any) => {
      const idx = getBulanIndex(sm.tgl_input || sm.created_at || sm.tgl_surat);
      if (idx !== null) {
        hasil[idx].masuk += 1;
        if (sm.disposisi) hasil[idx].disposisi += 1;
        if (sm.status_surat === 'ARSIP' || sm.status_surat === 'SELESAI' || sm.disposisi) {
          hasil[idx].selesai += 1;
        }
      }
    });

    (suratKeluarList || []).forEach((sk: any) => {
      const idx = getBulanIndex(sk.tgl_dibuat || sk.created_at);
      if (idx !== null) {
        hasil[idx].keluar += 1;
        if (sk.status_persetujuan === 'DISETUJUI_KEPALA_BADAN') {
          hasil[idx].selesai += 1;
        }
      }
    });

    return hasil.map((item) => {
      const total = item.masuk + item.keluar;
      return {
        bulan: item.bulan,
        masuk: item.masuk,
        keluar: item.keluar,
        disposisi: item.disposisi,
        rasio: total > 0 ? Math.round((item.selesai / total) * 100) : 0,
      };
    });
  }, [suratMasukList, suratKeluarList]);


  const rekapitulasiBulanan = rekapBulananDb;

  const maxChartValue = Math.max(...rekapitulasiBulanan.map((r) => Math.max(r.masuk, r.keluar, r.disposisi))) || 50;

  const formatWaktuInput = (tanggal?: string) => {
    if (!tanggal) return '-';
    const date = new Date(tanggal);
    if (isNaN(date.getTime())) return tanggal;

    const tgl = date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const jam = date
      .toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace('.', ':');

    return `${tgl} • ${jam} WITA`;
  };

  const handleExportPDF = () => {
    const tahun = new Date().getFullYear();
    const totalMasuk = rekapitulasiBulanan.reduce((sum: number, r: any) => sum + (r.masuk || 0), 0);
    const totalKeluar = rekapitulasiBulanan.reduce((sum: number, r: any) => sum + (r.keluar || 0), 0);
    const totalDisposisi = rekapitulasiBulanan.reduce((sum: number, r: any) => sum + (r.disposisi || 0), 0);
    const totalRasio = totalMasuk > 0 ? Math.round((totalDisposisi / totalMasuk) * 100) : 0;

    const rowsHtml = rekapitulasiBulanan
      .map((r: any, idx: number) => {
        const rasio = r.masuk > 0 ? Math.round((r.disposisi / r.masuk) * 100) : 0;
        return `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td>${r.bulan}</td>
          <td style="text-align:center;">${r.masuk}</td>
          <td style="text-align:center;">${r.keluar}</td>
          <td style="text-align:center;">${r.disposisi}</td>
          <td style="text-align:center;">${rasio}%</td>
        </tr>
      `;
      })
      .join('');
    const logoUrl = new URL(LOGO_KOTA_BITUNG_SULAWESI_UTARA, window.location.origin).href;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    printWindow.document.write(`
    <html>
      <head>
        <title>Laporan Rekapitulasi Persuratan BKPSDMD ${tahun}</title>
        <style>
          @page { size: A4; margin: 16mm; }
          body { font-family: Arial, sans-serif; color: #0f172a; margin: 0; }
          .kop { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 18px; }
          .kop h2 { margin: 0; font-size: 14pt; }
          .kop h3 { margin: 2px 0; font-size: 12pt; }
          .kop p { margin: 4px 0 0; font-size: 10pt; color: #475569; }
          table { width: 100%; border-collapse: collapse; font-size: 10pt; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; }
          th { background-color: #047857; color: #ffffff; }
          tfoot td { background-color: #f1f5f9; font-weight: bold; }
          .ttd { margin-top: 36px; float: right; width: 240px; text-align: left; font-size: 10pt; }
        </style>
      </head>
      <body>
        <div class="kop">
        <img
    src="${logoUrl}"
    alt="Logo Kota Bitung"
    style="height: 64px; width: auto; display: block; margin: 0 auto 8px auto;"
  />
          <h3>
          PEMERINTAH KOTA BITUNG
          </h3>
          <h2>BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA DAERAH</h2>
          <p>Laporan Rekapitulasi Aktivitas Persuratan Digital — Tahun ${tahun}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Bulan Pelaporan</th>
              <th>Surat Masuk</th>
              <th>Surat Keluar</th>
              <th>Disposisi</th>
              <th>Rasio Selesai</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="text-align:center;">TOTAL</td>
              <td style="text-align:center;">${totalMasuk}</td>
              <td style="text-align:center;">${totalKeluar}</td>
              <td style="text-align:center;">${totalDisposisi}</td>
              <td style="text-align:center;">${totalRasio}%</td>
            </tr>
          </tfoot>
        </table>
        <div class="ttd">
          <p>Bitung, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>Kepala BKPSDMD Kota Bitung,</p>
          <br/><br/><br/>
          <p><strong>______________________________</strong></p>
        </div>
      </body>
    </html >
  `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  // Fungsi Ekspor Excel (.xls)
  const handleExportExcel = () => {
    const tahun = new Date().getFullYear();
    const totalMasuk = rekapitulasiBulanan.reduce((sum: number, r: any) => sum + (r.masuk || 0), 0);
    const totalKeluar = rekapitulasiBulanan.reduce((sum: number, r: any) => sum + (r.keluar || 0), 0);
    const totalDisposisi = rekapitulasiBulanan.reduce((sum: number, r: any) => sum + (r.disposisi || 0), 0);
    const totalRasio = totalMasuk > 0 ? Math.round((totalDisposisi / totalMasuk) * 100) : 0;

    const rowsHtml = rekapitulasiBulanan
      .map((r: any, idx: number) => {
        const rasio = r.masuk > 0 ? Math.round((r.disposisi / r.masuk) * 100) : 0;
        return `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td>${r.bulan}</td>
          <td style="text-align:center;">${r.masuk || 0}</td>
          <td style="text-align:center;">${r.keluar || 0}</td>
          <td style="text-align:center;">${r.disposisi || 0}</td>
          <td style="text-align:center;">${rasio}%</td>
        </tr>
      `;
      })
      .join('');

    const htmlTable = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8" /></head>
      <body>
        <h3>REKAPITULASI PERSURATAN BKPSDMD KOTA BITUNG — TAHUN ${tahun}</h3>
        <table border="1">
          <thead>
            <tr style="background-color:#047857; color:#ffffff; font-weight:bold;">
              <th>No</th>
              <th>Bulan Pelaporan</th>
              <th>Surat Masuk</th>
              <th>Surat Keluar Internal</th>
              <th>Disposisi Diterbitkan</th>
              <th>Rasio Penyelesaian</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
          <tfoot>
            <tr style="background-color:#f1f5f9; font-weight:bold;">
              <td colspan="2" style="text-align:center;">TOTAL</td>
              <td style="text-align:center;">${totalMasuk}</td>
              <td style="text-align:center;">${totalKeluar}</td>
              <td style="text-align:center;">${totalDisposisi}</td>
              <td style="text-align:center;">${totalRasio}%</td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `;

    const blob = new Blob([htmlTable], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rekapitulasi_Persuratan_BKPSDMD_${tahun}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  };



  return (
    <div className="space-y-6">
      {/* Subheader Dashboard */}
      {(activeMenu === 'verifikasi' ||
        activeMenu === 'terverifikasi' ||
        activeMenu === 'disposisi_sekretaris') && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-[30px] font-black text-slate-900 tracking-tight">
                  Dashboard Sekretariat BKPSDMD
                </h1>
                <p className="text-xs text-slate-500">
                  Verifikasi keabsahan surat masuk, dan tata kelola pengembalian berkas
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
                onClick={() => handleMenuChange('disposisi_sekretaris')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-2 cursor-pointer ${activeMenu === 'disposisi_sekretaris'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <span>Disposisi Sekretaris</span>
                {disposisiSekretarisAktifCount > 0 && (
                  <span className="w-5 h-5 text-[10px] font-bold rounded-full bg-amber-500 text-white flex items-center justify-center">
                    {disposisiSekretarisAktifCount}
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
        )}

      {/* 1. MENU: VERIFIKASI SURAT MASUK */}
      {activeMenu === 'verifikasi' && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4 min-h-[550px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h1 className="text-lg font-black text-slate-900">
                Daftar Surat Masuk Menunggu Verifikasi Sekretariat
              </h1>
              <p className="text-xs text-slate-500">
                Periksa kelengkapan fisik, keterbacaan scan PDF, dan perihal sebelum diajukan ke Kepala Badan.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
              {menungguVerifikasi.length} Berkas Perlu Ditinjau
            </span>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-3 px-3 text-center border-r border-l border-slate-200">No. Agenda</th>
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
                    <td colSpan={6} className="text-center py-50 text-slate-400">
                      ✓ Tidak ada antrean surat masuk yang menunggu verifikasi saat ini.
                    </td>
                  </tr>
                ) : (
                  menungguVerifikasi.map((surat) => (
                    <tr key={surat.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-950 whitespace-nowrap text-center border-r border-slate-200">
                        {surat.no_agenda}
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {formatWaktuInput(surat.tgl_input)}
                        </div>
                      </td>
                      <td className="py-3 px-3 max-w-sm text-center border-r border-slate-200">
                        <p className="font-bold text-slate-900">{surat.asal_surat}</p>
                        <p className="text-[11px] font-mono text-slate-500">No: {surat.no_surat}</p>
                        <p className="text-[11px] text-slate-600 line-clamp-1 italic">"{surat.perihal}"</p>
                      </td>
                      <td className="py-3 px-3 text-center border-r border-slate-200">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium whitespace-normal break-words leading-tight inline-block">
                          {surat.nama_kategori}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center border-r border-slate-200">
                        <span className="px-2 py-0.5 rounded-full font-semibold text-[11px] bg-slate-100 text-slate-700 whitespace-normal break-words leading-tight inline-block">
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
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4 animate-fade-in min-h-[550px]">
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

          <div className="overflow-y-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-3 px-3 text-center border-r border-l border-slate-200">No. Agenda</th>
                  <th className="py-3 px-3 text-center border-r border-slate-200">Asal Pengirim &amp; Perihal</th>
                  <th className="py-3 px-3 text-center border-r border-slate-200">Status Saat Ini</th>
                  <th className="py-3 px-3 text-center border-r border-slate-200">Posisi Terakhir</th>
                  <th className="py-3 px-3 text-center border-r border-slate-200">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {terverifikasi.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-50 text-slate-400">
                      Belum ada surat yang terverifikasi saat ini.
                    </td>
                  </tr>
                ) : (
                  terverifikasi.map((surat) => (
                    <tr key={surat.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-950 whitespace-nowrap text-center border-r border-l border-slate-200">
                        {surat.no_agenda}
                        <div className="text-[10px] text-slate-400 font-sans font-normal">
                          {surat.tgl_input.split(' ')[0]}
                        </div>
                      </td>
                      <td className="py-3 px-3 max-w-sm text-center border-r border-slate-200">
                        <p className="font-bold text-slate-900">{surat.asal_surat}</p>
                        <p className="text-[11px] text-slate-600 line-clamp-1 italic">"{surat.perihal}"</p>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-center border-r border-slate-200">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 
                         border border-emerald-200 whitespace-normal break-words leading-tight">
                          {surat.status_surat.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 text-center border-r border-slate-200">
                        {surat.disposisi?.nama_bagian_tujuan || 'Meja Kepala Badan'}
                      </td>
                      <td className="py-3 px-3 text-right text-center border-r border-slate-200">
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
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4 min-h-[5px]">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-[20px] font-extrabold text-amber-900 flex items-center gap-2">
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
              <table className="w-full text-left text-xs border-collapse min-w-[600px] whitespace-normal">
                <thead className='sticky top-0 z-10'>
                  <tr className="bg-amber-50 text-amber-900 uppercase font-bold border-b border-amber-200">
                    <th className="py-3 px-3 text-center border-r border-l border-slate-200">No. Agenda</th>
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
                      <td colSpan={6} className="text-center py-17 text-slate-400">
                        Tidak ada surat yang dikembalikan oleh Kepala Bagian.
                      </td>
                    </tr>
                  ) : (
                    dikembalikanDariBagianCount.map((surat) => {
                      const latestReturn = surat.pengembalian?.[surat.pengembalian.length - 1];
                      return (
                        <tr key={surat.id} className="hover:bg-amber-50/40 transition">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 text-center border-r border-l border-slate-200">{surat.no_agenda}</td>
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
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4 min-h-[5px]">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-[20px] font-extrabold text-red-900 flex items-center gap-2">
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
              <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-red-50 text-red-900 uppercase font-bold border-b border-red-200">
                    <th className="py-3 px-3 text-center border-r border-l border-slate-200">No. Agenda</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Asal &amp; Perihal Surat</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Petugas Loket</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Catatan Perbaikan</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {suratMasukList.filter((s) => s.status_surat === 'DIKEMBALIKAN_KE_LOKET').length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-17 text-slate-400">
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
                            <td className="py-3 px-3 font-mono font-bold text-slate-900 text-center border-r border-l border-slate-200">
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

      {/* 3B. MENU: DISPOSISI MASUK UNTUK SEKRETARIS / SEKRETARIAT */}
      {activeMenu === 'disposisi_sekretaris' && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
          <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-600" />
                <span>Disposisi Masuk untuk Sekretaris / Sekretariat</span>
              </h1>
              <p className="text-xs text-slate-500">
                Surat masuk yang didisposisikan Kepala Badan kepada Sekretaris dan jajaran Sekretariat untuk ditindaklanjuti langsung.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 self-start sm:self-auto">
              {disposisiSekretaris.length} Berkas Disposisi
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-left text-xs border-collapse min-w-[760px]">
              <thead className="bg-slate-50">
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="w-[15%] py-3 px-3 text-center border-r border-l border-slate-200">No. Agenda</th>
                  <th className="w-[27%] py-3 px-3 text-center border-r border-slate-200">Asal, No, &amp; Perihal Surat</th>
                  <th className="w-[24%] py-3 px-3 text-center border-r border-slate-200">Instruksi Kepala Badan</th>
                  <th className="w-[16%] py-3 px-3 text-center border-r border-slate-200">Status</th>
                  <th className="w-[18%] py-3 px-3 text-center border-r border-slate-200">Tindak Lanjut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {disposisiSekretaris.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400">
                      Belum ada surat disposisi yang diarahkan ke Sekretaris saat ini.
                    </td>
                  </tr>
                ) : (
                  disposisiSekretaris.map((surat) => {
                    const isSelesai = surat.status_surat === 'SELESAI';
                    const isDiproses = surat.status_surat === 'SEDANG_DIPROSES';
                    const catatanDisp =
                      (surat.disposisi as any)?.catatan ||
                      (surat.disposisi as any)?.catatan_pimpinan;

                    return (
                      <tr key={surat.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 text-center border-r border-l border-slate-200">
                          {surat.no_agenda}
                        </td>
                        <td className="py-3 px-3 text-center border-r border-slate-200">
                          <p className="font-bold text-slate-900">{surat.asal_surat}</p>
                          <p className="text-[11px] font-bold italic text-slate-700 mt-0.5">
                            {surat.no_surat}
                          </p>
                          <p className="text-[10px] text-slate-600 italic mt-0.5">
                            "{surat.perihal}"
                          </p>
                        </td>
                        <td className="py-3 px-3 border-r border-slate-200">
                          <div className="space-y-1">
                            {(surat.disposisi?.instruksi || []).map((ins, i) => (
                              <p key={i} className="text-[11px] text-slate-800 font-medium">
                                - {ins}
                              </p>
                            ))}
                            {catatanDisp && (
                              <p className="text-[10px] text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200 italic mt-1">
                                Catatan: "{catatanDisp}"
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center border-r border-slate-200">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${isSelesai
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : isDiproses
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                              }`}
                          >
                            {isSelesai
                              ? 'SELESAI'
                              : isDiproses
                                ? 'SEDANG DIPROSES'
                                : 'MENUNGGU TINDAK LANJUT'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center border-r border-slate-200">
                          <div className="flex flex-col items-center gap-1.5">
                            <button
                              onClick={() => onLihatSurat(surat)}
                              className="w-full justify-center px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold inline-flex items-center gap-1 cursor-pointer transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Lihat Disposisi</span>
                            </button>

                            {!isDiproses && !isSelesai && (
                              <button
                                onClick={() => updateStatusPengerjaan(surat.id, 'SEDANG_DIPROSES')}
                                className="w-full justify-center px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-xs cursor-pointer transition"
                              >
                                Mulai Proses
                              </button>
                            )}

                            {!isSelesai && (
                              <button
                                onClick={() => {
                                  updateStatusPengerjaan(surat.id, 'SELESAI');
                                  alert(`Disposisi surat ${surat.no_agenda} telah diselesaikan oleh Sekretariat.`);
                                }}
                                className="w-full justify-center px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-xs inline-flex items-center gap-1 cursor-pointer transition"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Tandai Selesai</span>
                              </button>
                            )}
                          </div>
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

      {/* 4. MENU HALAMAN PENERUSAN SURAT TERPADU (2 TABEL MENGGABUNGKAN KEPALA KANTOR & KEPALA BAGIAN) */}
      {activeMenu === 'penerusan' && (
        <div className="space-y-6">

          {/* TABEL 1: ANTREAN DIAJUKAN KE KEPALA KANTOR */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4 min-h-[225px]">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-black text-blue-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  <span>Penerusan Surat ke Kepala Badan</span>
                </h1>
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
                    <th className="py-3 px-3 text-center border-r border-l border-slate-200">No. Agenda</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Asal, No, &amp; Perihal Surat</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Sifat</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Status Saat Ini</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {antreanKepalaKantor.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-15 text-slate-400">
                        ✓ Tidak ada surat yang sedang menunggu disposisi Kepala Badan saat ini.
                      </td>
                    </tr>
                  ) : (
                    antreanKepalaKantor.map((surat) => (
                      <tr key={surat.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3 font-mono font-bold text-blue-900 text-center border-r border-l border-slate-200">
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
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold whitespace-normal break-words leading-tight">
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
          {/* TABEL 2: SIAP DITERUSKAN KE KEPALA BAGIAN */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-extrabold text-indigo-950 flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-600" />
                  <span>Penerusan Surat ke Kepala Bagian</span>
                </h1>
                <p className="text-xs text-slate-500">
                  Surat masuk berdisposisi maupun naskah dinas antar-bagian yang telah disetujui Kepala Badan dan siap diteruskan ke Bagian tujuan.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-800 rounded-full border border-indigo-200">
                {totalSiapDiteruskan} Siap Diteruskan
              </span>
            </div>

            <div className="max-h-[320px] overflow-auto rounded-xl">
              <table className="w-full text-left text-xs border-collapse table-fixed min-w-[760px]">
                <thead className="sticky top-0 z-10 bg-slate-50">
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <th className="w-[17%] py-3 px-3 text-center border-r border-l border-slate-200">
                      No. Agenda / Draft
                    </th>
                    <th className="w-[25%] py-3 px-3 text-center border-r border-slate-200">
                      Asal, No, &amp; Perihal Surat
                    </th>
                    <th className="w-[20%] py-3 px-3 text-center border-r border-slate-200">
                      Bagian Tujuan Disposisi
                    </th>
                    <th className="w-[18%] py-3 px-3 text-center border-r border-slate-200">
                      Instruksi / Persetujuan
                    </th>
                    <th className="w-[20%] py-3 px-3 text-center border-r border-slate-200">
                      Aksi Penerusan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {totalSiapDiteruskan === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400">
                        ✓ Semua surat yang telah didisposisi / disetujui sudah berhasil diteruskan ke masing-masing Bagian tujuan.
                      </td>
                    </tr>
                  ) : (
                    <>
                      {/* 1. BARIS SURAT MASUK YANG SUDAH DIDISPOSISI */}
                      {siapDiteruskanKeBagian.map((surat) => (
                        <tr key={`sm-${surat.id}`} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 text-center border-r border-l border-slate-200 break-words">
                            <div>{surat.no_agenda}</div>
                            <span className="mt-1 inline-block px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-100 text-blue-800">
                              Surat Masuk
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center border-r border-slate-200 break-words">
                            <p className="font-bold text-slate-900">{surat.asal_surat}</p>
                            <p className="text-[11px] font-bold italic text-slate-700 mt-0.5">
                              {surat.no_surat}
                            </p>
                            <p className="text-[10px] text-slate-600 italic line-clamp-2 mt-0.5">
                              "{surat.perihal}"
                            </p>
                          </td>
                          <td className="py-3 px-3 text-center border-r border-slate-200">
                            <div className="inline-flex items-center justify-center gap-1.5 font-bold text-purple-900 bg-purple-50 px-2.5 py-1.5 rounded-lg border border-purple-200 whitespace-normal leading-snug">
                              <Building className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                              <span>{surat.disposisi?.nama_bagian_tujuan}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center border-r border-slate-200">
                            <div className="text-[11px] text-slate-700 space-y-0.5">
                              {surat.disposisi?.instruksi.slice(0, 2).map((ins, i) => (
                                <p key={i} className="whitespace-normal">
                                  - {ins}
                                </p>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center border-r border-slate-200">
                            <div className="flex flex-col items-center gap-1.5">
                              <button
                                onClick={() => onLihatSurat(surat)}
                                className="w-full justify-center px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold inline-flex items-center gap-1 cursor-pointer transition"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat Disposisi</span>
                              </button>
                              <button
                                onClick={() => {
                                  teruskanKeBagian(surat.id);
                                  alert(`Surat ${surat.no_agenda} dan lembar disposisi berhasil diteruskan ke ${surat.disposisi?.nama_bagian_tujuan}!`);
                                }}
                                className="w-full justify-center px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-xs inline-flex items-center gap-1 cursor-pointer transition"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Teruskan ke Bagian</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* 2. BARIS SURAT KELUAR INTERNAL YANG DISETUJUI KEPALA BADAN */}
                      {suratKeluarSiapDiteruskan.map((sk) => (
                        <tr key={`sk-${sk.id}`} className="hover:bg-emerald-50/30 transition">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 text-center border-r border-l border-slate-200 break-words">
                            <div>{sk.no_draft}</div>
                            <span className="mt-1 inline-block px-1.5 py-0.5 text-[9px] font-bold rounded bg-indigo-100 text-indigo-800">
                              {sk.jenis_naskah || 'Nota Dinas'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center border-r border-slate-200 break-words">
                            <p className="font-bold text-slate-900">Dari: {sk.nama_bagian_pengirim}</p>
                            <p className="text-[11px] text-slate-600 line-clamp-2 italic mt-0.5">
                              "{sk.perihal}"
                            </p>
                          </td>
                          <td className="py-3 px-3 text-center border-r border-slate-200">
                            <div className="inline-flex items-center justify-center gap-1.5 font-bold text-purple-900 bg-purple-50 px-2.5 py-1.5 rounded-lg border border-purple-200 whitespace-normal leading-snug">
                              <Building className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                              <span>{sk.nama_bagian_tujuan}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center border-r border-slate-200">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-normal leading-tight inline-block">
                              DISETUJUI KEPALA BADAN
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center border-r border-slate-200">
                            <div className="flex flex-col items-center gap-1.5">
                              {onLihatSuratKeluar && (
                                <button
                                  onClick={() => onLihatSuratKeluar(sk)}
                                  className="w-full justify-center px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold inline-flex items-center gap-1 cursor-pointer transition"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Lihat Naskah</span>
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  teruskanSuratKeluar(sk.id);
                                  alert(`Naskah internal ${sk.no_draft} berhasil diteruskan ke ${sk.nama_bagian_tujuan}!`);
                                }}
                                className="w-full justify-center px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-xs inline-flex items-center gap-1 cursor-pointer transition"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Teruskan ke Bagian</span>
                              </button>
                            </div>
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
                  <h1 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-emerald-600" />
                    <span>Status Penerusan &amp; Tindak Lanjut Surat Masuk</span>
                  </h1>
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

              <div className=" w-full overflow-y-auto max-h-[180px]">
                <table className="w-full text-left text-xs border-collapse table-fixed">
                  <thead className='sticky top-0 z-10 bg-slate-50'>
                    <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                      <th className="w-[14%] py-2 px-2 text-center border-r border-slate-200">No. Agenda</th>
                      <th className="w-[32%] py-2 px-2 text-center border-r border-slate-200">Asal &amp; Perihal Surat</th>
                      <th className="w-[18%] py-2 px-2 text-center border-r border-slate-200">Bagian Tujuan</th>
                      <th className="w-[20%] py-2 px-2 text-center border-r border-slate-200">Status Pengerjaan</th>
                      <th className="w-[16%] py-2 px-2 text-center border-r border-slate-200">Aksi</th>
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
                        <td colSpan={5} className="text-center py-15 text-slate-400 whitespace-normal break-words leading-tight">
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
                              <p className="font-bold text-slate-900 text-center">{surat.asal_surat}</p>
                              <p className="text-[11px] text-slate-600 line-clamp-1 italic text-center">"{surat.perihal}"</p>
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-purple-900 border-r border-slate-200">
                              {surat.disposisi?.nama_bagian_tujuan || '-'}
                            </td>
                            <td className="py-3 px-3 text-center border-r border-slate-200 whitespace-normal break-words leading-tight">
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

              <div className="w-full overflow-y-auto max-h-[180px]">
                <table className="w-full text-left text-xs border-collapse table-fixed">
                  <thead className='sticky top-0 z-10 bg-slate-50'>
                    <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                      <th className="w-[14%] py-2 px-2 text-center border-r border-slate-200">No. Draft</th>
                      <th className="w-[32%] py-2 px-2 text-center border-r border-slate-200">Bagian Pengirim &amp; Perihal</th>
                      <th className="w-[18%] py-2 px-2 text-center border-r border-slate-200">Bagian Tujuan</th>
                      <th className="w-[20%] py-2 px-2 text-center border-r border-slate-200">Status Penerusan</th>
                      <th className="w-[16%] py-2 px-2 text-center border-r border-slate-200">Aksi</th>
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
                              <p className="font-bold text-slate-900 text-center">Dari: {sk.nama_bagian_pengirim}</p>
                              <p className="text-[11px] text-slate-600 line-clamp-1 italic text-center">"{sk.perihal}"</p>
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-purple-900 border-r border-slate-200">
                              {sk.nama_bagian_tujuan}
                            </td>
                            <td className="py-3 px-3 text-center border-r border-slate-200">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 
                              border border-emerald-300 whitespace-normal break-words leading-tight inline-block">
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
                  onClick={handleExportPDF}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Ekspor PDF</span>
                </button>
                <button
                  onClick={handleExportExcel}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ekspor Excel</span>
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
              <div className="w-full overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse border border-slate-200 rounded-xl max-h-[260px]">
                  <thead className='sticky top-0 z-10 bg-slate-50'>
                    <tr className="bg-slate-100 text-slate-700 uppercase tracking-widder font-bold border-b border-slate-200">
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
                          <td className="py-2 px-3 font-semibold text-slate-900 border-r border-l border-slate-200">{row.bulan}</td>
                          <td className="py-2 px-3 text-center font-mono border-r border-l border-slate-200">{row.masuk}</td>
                          <td className="py-2 px-3 text-center font-mono border-r border-l border-slate-200">{row.keluar}</td>
                          <td className="py-2 px-3 text-center font-mono border-r border-l border-slate-200">{row.disposisi}</td>
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
      {
        activeMenu === 'arsip' && (
          <ArsipSurat onLihatSurat={onLihatSurat}
            onLihatSuratKeluar={onLihatSuratKeluar}
          />
        )
      }

    </div >
  );
};