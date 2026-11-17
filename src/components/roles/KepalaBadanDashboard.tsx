/**
 * @file KepalaBadanDashboard.tsx
 * @description Dashboard Eksekutif Kepala BKPSDMD Kota Bitung (Disposisi Digital & Persetujuan Surat Keluar)
 * Status persuratan (Menunggu Disposisi, Terverifikasi, Tolak/Revisi) ditempatkan langsung di dalam Daftar Surat
 * Responsif untuk semua perangkat (iOS, Android, Windows, Mac)
 */

import React, { useState, useEffect, useMemo } from 'react';
import LOGO_KOTA_BITUNG_SULAWESI_UTARA from '../../assets/LOGO_KOTA_BITUNG_SULAWESI_UTARA.png'
import { usePersuratan } from '../../context/PersuratanContext';
import { SuratMasuk, SuratKeluar } from '../../types';
import {
  Crown,
  CheckCircle,
  Clock,
  Eye,
  RotateCcw,
  Search,
  BarChart3,
  Download,
  Printer

} from 'lucide-react';
import { createPortal } from 'react-dom';

interface KepalaBadanDashboardProps {
  onLihatSuratMasuk: (surat: SuratMasuk) => void;
  onLihatSuratKeluar: (surat: SuratKeluar) => void;
  activeMenu?: string;
  onSelectMenu?: (menu: string) => void;
}

export const KepalaBadanDashboard: React.FC<KepalaBadanDashboardProps> = ({
  onLihatSuratMasuk,
  onLihatSuratKeluar,
  activeMenu: externalActiveMenu,
  onSelectMenu
}) => {
  const {
    suratMasukList,
    suratKeluarList,
    bagianList,
    instruksiList,
    buatDisposisi,
    setujuiSuratKeluar,
    kembalikanRevisiSuratKeluar
  } = usePersuratan();




  const [internalTab, setInternalTab] = useState<string>('surat_masuk');
  const [statusFilter, setStatusFilter] = useState<string>('menunggu');
  const [searchQuery, setSearchQuery] = useState('');
  const currentView = externalActiveMenu || internalTab;

  const handleTabChange = (view: string) => {
    setInternalTab(view);
    onSelectMenu?.(view);
  };
  useEffect(() => {
    if (currentView === 'surat_masuk') {
      setStatusFilter('menunggu');
    }
  }, [currentView]);

  // Modal Lembar Disposisi Digital
  const [modalDisposisiOpen, setModalDisposisiOpen] = useState(false);
  const [targetSuratDisposisi, setTargetSuratDisposisi] = useState<SuratMasuk | null>(null);
  const [selectedBagianTujuan, setSelectedBagianTujuan] = useState<number>(bagianList[1]?.id || 2);
  const [checkedPenerima, setCheckedPenerima] = useState<string[]>([]);
  const [instansiTerkait, setInstansiTerkait] = useState<string>('');
  const [selectedInstruksi, setSelectedInstruksi] = useState<string[]>([]);
  const [catatanKepala, setCatatanKepala] = useState('');

  // Modal Kembalikan untuk Revisi Surat Keluar
  const [modalRevisiKeluarOpen, setModalRevisiKeluarOpen] = useState(false);
  const [targetSuratRevisi, setTargetSuratRevisi] = useState<SuratKeluar | null>(null);
  const [catatanRevisiKeluar, setCatatanRevisiKeluar] = useState('');

  const [penerimaTerpilih, setPenerimaTerpilih] = useState<string[]>([]);


  const togglePenerima = (jabatan: string) => {
    setPenerimaTerpilih((prev) =>
      prev.includes(jabatan)
        ? prev.filter((item) => item !== jabatan)
        : [...prev, jabatan]
    );
  };

  const formatTanggalIndo = (tgl?: string) => {
    if (!tgl) return '-';
    const date = new Date(tgl);
    if (isNaN(date.getTime())) return tgl;
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Perhitungan Status Persuratan
  const menungguDisposisi = suratMasukList.filter(
    (s: any) => s.status_surat === 'MENUNGGU_DISPOSISI_KEPALA_BADAN'
  );
  const terverifikasiList = suratMasukList.filter(
    (s) =>
      s.status_surat === 'DISPOSISI_DIBUAT' ||
      s.status_surat === 'DITERUSKAN_KE_BAGIAN' ||
      s.status_surat === 'SEDANG_DIPROSES' ||
      s.status_surat === 'SELESAI'
  );
  const revisiKeluarList = suratKeluarList.filter(
    (sk) => sk.status_persetujuan === 'REVISI'
  );
  const dikembalikanBagianList = suratMasukList.filter(
    (s: any) => s.status_surat === 'DIKEMBALIKAN_KE_SEKRETARIAT'
  );
  const suratKeluarMenungguApproval = suratKeluarList.filter(
    (sk) => sk.status_persetujuan === 'PENGAJUAN_KE_KEPALA_BADAN'
  );
  const totalMenungguDisposisi = menungguDisposisi.length;

  const totalDiprosesBidang = suratMasukList.filter(
    (s: any) => s.status_surat === 'DITERUSKAN_KE_BAGIAN' || s.status_surat === 'SEDANG_DIPROSES'
  ).length;

  const totalSelesai = suratMasukList.filter(
    (s: any) => s.status_surat === 'SELESAI'
  ).length;

  const totalSuratKeluar = suratKeluarList.length;

  // Filter Surat Masuk untuk Tampilan Daftar Surat
  const filteredSuratMasuk = suratMasukList.filter((s) => {
    const matchesSearch =
      s.no_agenda.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.no_surat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.asal_surat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.perihal.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'menunggu') {
      return s.status_surat === 'MENUNGGU_DISPOSISI_KEPALA_BADAN';
    }
    if (statusFilter === 'terverifikasi') {
      return (
        s.status_surat === 'DISPOSISI_DIBUAT' ||
        s.status_surat === 'DITERUSKAN_KE_BAGIAN' ||
        s.status_surat === 'SEDANG_DIPROSES' ||
        s.status_surat === 'SELESAI'
      );
    }
    if (statusFilter === 'dikembalikan') {
      return s.status_surat === 'DIKEMBALIKAN_KE_SEKRETARIAT';
    }
    return true;
  });

  // Helper Lokasi / Posisi Terakhir Surat
  const getPosisiTerakhir = (surat: SuratMasuk) => {
    switch (surat.status_surat) {
      case 'MENUNGGU_VERIFIKASI_SEKRETARIAT':
        return { text: 'Sekretariat (Verifikasi Berkas)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'DIKEMBALIKAN_KE_LOKET':
        return { text: 'Loket (Menunggu Perbaikan Berkas)', color: 'text-red-700 bg-red-50 border-red-200' };
      case 'MENUNGGU_DISPOSISI_KEPALA_BADAN':
        return { text: 'Meja Kerja Kepala Badan (Disposisi)', color: 'text-blue-700 bg-blue-50 border-blue-200 font-bold' };
      case 'DISPOSISI_DIBUAT':
        return { text: 'Sekretariat (Penerusan ke Bagian)', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
      case 'DITERUSKAN_KE_BAGIAN':
      case 'SEDANG_DIPROSES':
        return {
          text: `${surat.disposisi?.nama_bagian_tujuan || 'Bidang Terkait'} (Pengerjaan)`,
          color: 'text-purple-700 bg-purple-50 border-purple-200'
        };
      case 'DIKEMBALIKAN_KE_SEKRETARIAT':
        return { text: 'Sekretariat (Salah Sasaran Disposisi)', color: 'text-amber-800 bg-amber-100 border-amber-300' };
      case 'SELESAI':
        return { text: 'Arsip Selesai Ditindaklanjuti', color: 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold' };
      default:
        return { text: 'Dalam Proses', color: 'text-slate-700 bg-slate-50 border-slate-200' };
    }
  };

  // Handler Buka Modal Lembar Disposisi
  const handleOpenDisposisiModal = (surat: SuratMasuk) => {
    setTargetSuratDisposisi(surat);
    if (surat.disposisi) {
      setSelectedBagianTujuan(surat.disposisi.id_bagian_tujuan);
      setSelectedInstruksi(surat.disposisi.instruksi);
      setCatatanKepala(surat.disposisi.catatan_kepala || '');
    } else {
      setSelectedBagianTujuan(bagianList[1]?.id || 2);
      setSelectedInstruksi([instruksiList[0]?.instruksi || 'Tindaklanjuti Sesuai Ketentuan Perundang-Undangan']);
      setCatatanKepala('');
    }
    setModalDisposisiOpen(true);
  };

  // Handler Kirim Lembar Disposisi
  const handleConfirmDisposisi = () => {
    if (!targetSuratDisposisi) return;
    if (selectedInstruksi.length === 0) {
      alert('Pilihlah setidaknya satu instruksi petunjuk disposisi.');
      return;
    }
    if (checkedPenerima.length === 0 || !selectedBagianTujuan) {
      alert('Silakan pilih minimal 1 tujuan pada bagian "Diteruskan Kepada Sdr." terlebih dahulu.');
      return;
    }

    buatDisposisi(
      targetSuratDisposisi.id,
      selectedBagianTujuan,
      selectedInstruksi,
      catatanKepala.trim()
    );

    setModalDisposisiOpen(false);
    alert(`Lembar disposisi untuk surat ${targetSuratDisposisi.no_agenda} berhasil diterbitkan dan dikirim ke Sekretariat (STATUS: DISPOSISI_DIBUAT).`);
  };

  // Handler Buka Modal Revisi Surat Keluar
  const handleOpenRevisiKeluar = (surat: SuratKeluar) => {
    setTargetSuratRevisi(surat);
    setCatatanRevisiKeluar('');
    setModalRevisiKeluarOpen(true);
  };

  const handleConfirmRevisiKeluar = () => {
    if (!targetSuratRevisi) return;
    if (!catatanRevisiKeluar.trim()) {
      alert('Mohon cantumkan rincian instruksi revisi untuk Bagian pembuat surat.');
      return;
    }

    kembalikanRevisiSuratKeluar(targetSuratRevisi.id, catatanRevisiKeluar.trim());
    setModalRevisiKeluarOpen(false);
    alert(`Konsep naskah ${targetSuratRevisi.no_draft} dikembalikan ke Kepala Bagian dengan catatan revisi.`);
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

    suratMasukList.forEach((sm: any) => {
      const idx = getBulanIndex(sm.tgl_input || sm.created_at || sm.tgl_surat);
      if (idx !== null) {
        hasil[idx].masuk += 1;
        if (sm.disposisi) hasil[idx].disposisi += 1;
        if (sm.status_surat === 'ARSIP' || sm.status_surat === 'SELESAI' || sm.disposisi) {
          hasil[idx].selesai += 1;
        }
      }
    });

    suratKeluarList.forEach((sk: any) => {
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


  return (
    <div className="space-y-1">
      {currentView === 'eksekutif' && (
        <>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">
            DASHBOARD KEPALA BKPSDMD KOTA BITUNG
          </h1>
          <p className="text-xs text-slate-500 mb-1.5">
            Pemantauan arus surat masuk, disposisi, dan kinerja persuratan secara real-time
          </p>
        </>
      )}

      {
        currentView === 'eksekutif' && (() => {



          // Data rekapitulasi 12 bulan
          const rekapitulasiBulanan = rekapBulananDb;

          const maxChartValue = Math.max(...rekapitulasiBulanan.map((r: any) => Math.max(r.masuk, r.keluar, r.disposisi))) || 50;


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



            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
              {/* HEADER & SUBHEADER (Hanya muncul di Dashboard Eksekutif) */}

              {/* Header Tab & Tombol Aksi (Cetak + Ekspor CSV) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-emerald-600" />
                    <span>Rekapitulasi Persuratan BKPSDMD Kota Bitung</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Grafik tata kelola: Surat Masuk, Surat Keluar Internal, dan Lembar Disposisi Kepala Badan
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-auto">
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

              {/* 3 Kartu Ringkasan Statistik */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl text-blue-950">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Surat Masuk Terdaftar</p>
                  <h3 className="text-3xl font-black mt-1">{suratMasukList.length}</h3>
                  <p className="text-[11px] text-blue-800/80 mt-1">Registrasi lengkap dengan nomor agenda resmi</p>
                </div>

                <div className="p-5 bg-purple-50 border border-purple-200 rounded-2xl text-purple-950">
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-700">Surat Keluar Internal</p>
                  <h3 className="text-3xl font-black mt-1">{suratKeluarList.length}</h3>
                  <p className="text-[11px] text-purple-800/80 mt-1">Dikelola dengan sistem versioning naskah</p>
                </div>

                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Lembar Disposisi Diterbitkan</p>
                  <h3 className="text-3xl font-black mt-1">
                    {suratMasukList.filter((s) => s.disposisi).length}
                  </h3>
                  <p className="text-[11px] text-emerald-800/80 mt-1">Arahan pimpinan yang sedang/selesai diproses</p>
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
                            style={{ height: `${pctMasuk}% ` }}
                            className="w-1.5 sm:w-2.5 bg-blue-500 rounded-t-xs hover:bg-blue-600 transition"
                            title={`Surat Masuk: ${item.masuk} `}
                          />
                          <div
                            style={{ height: `${pctKeluar}% ` }}
                            className="w-1.5 sm:w-2.5 bg-purple-500 rounded-t-xs hover:bg-purple-600 transition"
                            title={`Surat Keluar: ${item.keluar} `}
                          />
                          <div
                            style={{ height: `${pctDisposisi}% ` }}
                            className="w-1.5 sm:w-2.5 bg-emerald-500 rounded-t-xs hover:bg-emerald-600 transition"
                            title={`Disposisi: ${item.disposisi} `}
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

              {/* Tabel Rincian Data Rekapitulasi Persuratan */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                  Tabel Rincian Data Rekapitulasi Persuratan
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse border border-slate-200 rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-3 text-center border-l border-r border-slate-200">Bulan Pelaporan</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-200">Surat Masuk (Registrasi)</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-200">Surat Keluar Internal</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-200">Disposisi Diterbitkan</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-200">Rasio Penyelesaian</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {rekapitulasiBulanan.map((row, i) => {
                        const rasio = row.masuk > 0 ? Math.round((row.disposisi / row.masuk) * 100) : 0;
                        return (
                          <tr key={i} className="hover:bg-slate-50 transition">
                            <td className="py-2 px-3 font-semibold text-slate-900 border-l border-r border-slate-200">{row.bulan}</td>
                            <td className="py-2 px-3 text-center font-mono border-r border-slate-200">{row.masuk}</td>
                            <td className="py-2 px-3 text-center font-mono border-r border-slate-200">{row.keluar}</td>
                            <td className="py-2 px-3 text-center font-mono border-r border-slate-200">{row.disposisi}</td>
                            <td className="py-2 px-3 text-center border-r border-slate-200">
                              <span
                                className={`px - 2 py - 0.5 rounded - full text - [10px] font - bold ${rasio >= 90
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : rasio >= 70
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-slate-100 text-slate-600'
                                  } `}
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
          );
        })()
      }


      {/* 1. VIEW: DASHBOARD EKSEKUTIF / LIVE TRACKING */}
      {
        currentView === 'eksekutif' && (
          <div className="space-y-6">


            {/* TABEL PEMANTAUAN POSISI SURAT REAL-TIME */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-slate-200 space-y-4">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <span>TABEL PEMANTAUAN POSISI SURAT REAL-TIME</span>
                  </h3>
                </div>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                      <th className="py-3 px-3 text-center border-l border-r border-slate-200">No. Agenda</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">Nama / Asal Surat</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">Sifat</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">Posisi Terakhir Berkas</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">Waktu Pembaruan Presisi</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 overflow-hidden">
                    {suratMasukList.map((surat) => {
                      const posisi = getPosisiTerakhir(surat);
                      return (
                        <tr key={surat.id} className="hover:bg-slate-50/80 transition overflow-hidden">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap text-center border-l border-r border-slate-200">
                            {surat.no_agenda}
                          </td>
                          <td className="py-3 px-3 max-w-[180px] overflow-hidden whitespace-nowrap text-center border-r border-slate-200">
                            {/* Nama / Asal Surat */}
                            <div className="w-full overflow-hidden breakwords whitespace-normal">
                              <p className="font-bold text-slate-900 inline-block whitespace-nowrap">
                                {surat.asal_surat}
                              </p>
                            </div>

                            {/* Perihal Surat */}
                            <div className="w-full overflow-hidden whitespace-nowrap group cursor-pointer">
                              <p className="text-[11px] text-slate-600 italic inline-block whitespace-nowrap hover-marquee">
                                "{surat.perihal}"
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap text-center border-r border-slate-200">
                            <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-slate-100 text-slate-700">
                              {surat.sifat}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center border-r border-slate-200">
                            <span className={`px - 2.5 py - 1 rounded - full text - [11px] font - semibold border whitespace - nowrap ${posisi.color} `}>
                              {posisi.text}
                            </span>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap text-center border-r border-slate-200">
                            {surat.tgl_input ? (
                              <div className="flex flex-col items-center leading-tight">
                                <span className="font-semibold text-slate-700 text-[11.5px]">
                                  {new Date(surat.tgl_input).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    timeZone: 'Asia/Makassar',
                                  })}
                                </span>
                                <span className="font-mono text-[10.5px] text-slate-500 mt-0.5">
                                  {new Date(surat.tgl_input).toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    timeZone: 'Asia/Makassar',
                                  })}{' '}
                                  WITA
                                </span>
                              </div>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap space-x-1.5 text-center border-r border-slate-200">
                            <button
                              onClick={() => onLihatSuratMasuk(surat)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Lihat</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      }
      {/* 2. VIEW: DAFTAR SURAT MASUK (DENGAN STATUS PERSURATAN DI DALAMNYA) */}
      {
        currentView === 'surat_masuk' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">

            {/* Status Persuratan Diletakkan Langsung di Dalam Daftar Surat */}
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100">

              <button
                type="button"
                onClick={() => setStatusFilter('menunggu')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${statusFilter === 'menunggu'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Menunggu Disposisi</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-200 text-amber-950 font-mono font-bold">
                  {menungguDisposisi.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('terverifikasi')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${statusFilter === 'terverifikasi'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Didisposisi / Selesai</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-200 text-emerald-950 font-mono font-bold">
                  {terverifikasiList.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('dikembalikan')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${statusFilter === 'dikembalikan'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                  }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Salah Sasaran Disposisi</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-200 text-rose-950 font-mono font-bold">
                  {dikembalikanBagianList.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('semua')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${statusFilter === 'semua'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                <span>Semua Surat Masuk</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${statusFilter === 'semua' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                >
                  {suratMasukList.length}
                </span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari No. Agenda, Nomor Surat, Pengirim..."
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <span className="text-[11px] text-slate-500 self-end sm:self-auto">
                Menampilkan <strong>{filteredSuratMasuk.length}</strong> surat
              </span>
            </div>

            {/* Table (Horizontal Touch-Scrollable) */}
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs border-collapse min-w-[720px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <th className="py-3 px-3 text-center border-l border-r border-slate-200">No. Agenda</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Asal &amp; Nomor Surat</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Kategori</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Sifat</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Status Saat Ini</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Aksi Kepala Badan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredSuratMasuk.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        Tidak ada surat yang sesuai dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredSuratMasuk.map((surat) => (
                      <tr key={surat.id} className="hover:bg-slate-50/80 transition overflow-hidden">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap text-center border-l border-r border-slate-200">
                          {surat.no_agenda}
                          <div className="text-[10px] text-slate-400 font-sans font-normal">
                            {surat.tgl_input.split(' ')[0]}
                          </div>
                        </td>
                        <td className="py-3 px-3 max-w-sm text-center group cursor-pointer overflow-hidden border-r border-slate-200">
                          <p className="font-bold text-slate-900">{surat.asal_surat}</p>
                          <p className="text-[11px] font-mono text-slate-500">No: {surat.no_surat}</p>
                          <p className="text-[11px] text-slate-600 italic hover-marquee hover:bg-slate-200 cursor-pointer">"{surat.perihal}"</p>
                        </td>
                        <td className="py-3 px-3 text-center border-r border-slate-200 whitespace-normal">
                          <span className="px-2 py-0.5 rounded-full text-black font-bold">
                            {surat.nama_kategori}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center border-r border-slate-200">
                          <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-slate-100 text-slate-700">
                            {surat.sifat}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-center border-r border-slate-200">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${surat.status_surat === 'MENUNGGU_DISPOSISI_KEPALA_BADAN'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : surat.status_surat === 'DIKEMBALIKAN_KE_SEKRETARIAT'
                                ? 'bg-red-100 text-red-800 border-red-300'
                                : surat.status_surat === 'SELESAI'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-blue-100 text-blue-800 border-blue-300'
                              }`}
                          >
                            {surat.status_surat.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap space-x-1.5 text-center border-r border-slate-200">
                          <button
                            onClick={() => onLihatSuratMasuk(surat)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat</span>
                          </button>

                          <button
                            onClick={() => handleOpenDisposisiModal(surat)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition inline-flex items-center gap-1 cursor-pointer ${surat.status_surat === 'MENUNGGU_DISPOSISI_KEPALA_BADAN'
                              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                          >
                            <Crown className="w-3.5 h-3.5" />
                            <span>{surat.disposisi ? 'Ubah Disposisi' : 'Buat Disposisi'}</span>
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

      {/* 3. VIEW: PERSETUJUAN SURAT KELUAR */}
      {
        currentView === 'persetujuan_keluar' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Daftar Konsep Naskah Surat Keluar Internal Menunggu Persetujuan
                </h3>
                <p className="text-xs text-slate-500">
                  Pemeriksaan draft nota dinas/memo antar-bagian sebelum disahkan dan diteruskan oleh Sekretariat.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200">
                {suratKeluarList.length} Total Draft
              </span>
            </div>

            <div className="max-h-[calc(100vh-260px)] overflow-y-auto overflow-x-hidden rounded-xl border border-slate-200">
              <table className="w-full table-fixed text-xs border-collapse">
                <thead className="sticky top-0 z-10 bg-slate-50 shadow-2xs">
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <th className="w-[17%] py-3 px-2.5 text-center border-r border-slate-200 bg-slate-50">
                      No. Draft
                    </th>
                    <th className="w-[18%] py-3 px-2.5 text-center border-r border-slate-200 bg-slate-50">
                      Jenis &amp; Perihal
                    </th>
                    <th className="w-[13%] py-3 px-2.5 text-center border-r border-slate-200 bg-slate-50">
                      Bagian Pengirim
                    </th>
                    <th className="w-[13%] py-3 px-2.5 text-center border-r border-slate-200 bg-slate-50">
                      Bagian Tujuan
                    </th>
                    <th className="w-[9%] py-3 px-2 text-center border-r border-slate-200 bg-slate-50">
                      Versi File
                    </th>
                    <th className="w-[16%] py-3 px-2.5 text-center border-r border-slate-200 bg-slate-50">
                      Status Approval
                    </th>
                    <th className="w-[14%] py-3 px-2 text-center bg-slate-50">
                      Aksi Pimpinan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                  {suratKeluarList.map((sk) => {
                    const daftarVersi = Array.isArray(sk.versi_file) ? sk.versi_file : [];
                    const versiTerbaru = daftarVersi.length > 0 ? daftarVersi[daftarVersi.length - 1] : null;
                    const statusApproval = sk.status_persetujuan || 'PENGAJUAN_KE_KEPALA_BADAN';
                    const isMenungguApproval = statusApproval === 'PENGAJUAN_KE_KEPALA_BADAN';

                    return (
                      <tr key={sk.id} className="hover:bg-slate-50/80 transition align-middle">
                        {/* 1. NO. DRAFT (17%) */}
                        <td className="py-3 px-2.5 font-mono font-bold text-[11px] text-slate-900 break-words leading-snug text-center border-r border-slate-200">
                          {sk.no_draft}
                        </td>

                        {/* 2. JENIS & PERIHAL (18%) */}
                        <td className="py-3 px-2.5 text-center border-r border-slate-200">
                          <span className="inline-block px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-700 leading-snug">
                            {sk.jenis_naskah}
                          </span>
                          <p className="font-bold text-slate-900 mt-1 leading-snug break-words">
                            {sk.perihal}
                          </p>
                          <p className="text-[11px] text-slate-500 italic line-clamp-1 mt-0.5">
                            "{sk.isi_ringkas}"
                          </p>
                        </td>

                        {/* 3. BAGIAN PENGIRIM (13%) */}
                        <td className="py-3 px-2.5 font-semibold text-purple-900 break-words leading-snug text-center border-r border-slate-200">
                          {sk.nama_bagian_pengirim}
                        </td>

                        {/* 4. BAGIAN TUJUAN (13%) */}
                        <td className="py-3 px-2.5 font-semibold text-slate-800 break-words leading-snug text-center border-r border-slate-200">
                          {sk.nama_bagian_tujuan}
                        </td>

                        {/* 5. VERSI FILE (9%) */}
                        <td className="py-3 px-2 text-center border-r border-slate-200">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-[11px] border border-slate-200">
                            Versi {versiTerbaru ? versiTerbaru.versi_ke : 1}
                          </span>
                        </td>

                        {/* 6. STATUS APPROVAL (16%) */}
                        <td className="py-3 px-2.5 text-center border-r border-slate-200">
                          <span
                            className={`inline - block px - 2.5 py - 1 rounded - lg text - [10px] font - bold leading - tight whitespace - normal break-words border ${statusApproval === 'DISETUJUI_KEPALA_BADAN'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : statusApproval === 'REVISI'
                                ? 'bg-red-100 text-red-800 border-red-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                              } `}
                          >
                            {statusApproval.replace(/_/g, ' ')}
                          </span>
                        </td>

                        {/* 7. AKSI PIMPINAN (14%) */}
                        <td className="py-3 px-2 text-center">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <button
                              onClick={() => onLihatSuratKeluar(sk)}
                              className="w-full max-w-[125px] px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px] leading-tight cursor-pointer"
                            >
                              Pratinjau Draft
                            </button>

                            {isMenungguApproval && (
                              <>
                                <button
                                  onClick={() => handleOpenRevisiKeluar(sk)}
                                  className="w-full max-w-[125px] px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-semibold text-[11px] leading-tight cursor-pointer"
                                >
                                  Revisi
                                </button>
                                <button
                                  onClick={() => {
                                    setujuiSuratKeluar(sk.id);
                                    alert(`Konsep surat keluar ${sk.no_draft} telah disetujui Kepala Badan!`);
                                  }}
                                  className="w-full max-w-[125px] px-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] leading-tight shadow-xs cursor-pointer"
                                >
                                  Setujui (Approve)
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      }

      {/* Modal Lembar Disposisi Digital - Format Resmi Template Badan BKPSDMD Kota Bitung */}
      {modalDisposisiOpen && targetSuratDisposisi && createPortal(
        <div
          style={{ zIndex: 9999 }}
          className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-3 md:p-4 z-[9999]"
        >
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95dvh] sm:max-h-[93dvh] flex flex-col shadow-2xl border border-slate-300 animate-scale-up overflow-hidden print:max-h-none print:shadow-none print:border-none">

            {/* ===== AREA LEMBAR DISPOSISI (RESPONSIF & AUTO-FIT) ===== */}
            <div className="flex-1 overflow-y-auto">

              {/* KOP SURAT */}
              <div className="bg-white px-3 sm:px-6 pt-3 pb-2 flex items-center gap-3 sm:gap-4">
                <div className="shrink-0 w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center">
                  <img
                    src={LOGO_KOTA_BITUNG_SULAWESI_UTARA}
                    alt="Logo Pemerintah Kota Bitung"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 text-center sm:pr-12">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-800 uppercase tracking-wide">
                    PEMERINTAH KOTA BITUNG
                  </p>
                  <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-900 uppercase leading-tight">
                    BADAN KEPEGAWAIAN DAN PENGEMBANGAN<br />
                    SUMBER DAYA MANUSIA DAERAH
                  </h1>
                  <p className="text-[9px] sm:text-[10px] text-slate-600 mt-0.5 leading-tight">
                    Jln. DR. Sam Ratulangi No. 45 Bitung 95511. Telp/Fax. (0438) 21458 Email: bkpsdmd@kotabitung@gmail.com
                  </p>
                </div>
              </div>

              {/* KOTAK UTAMA BLANGKO DISPOSISI */}
              <div className="mx-2.5 sm:mx-5 mb-3 border-2 border-slate-800 text-slate-900 text-xs">

                {/* JUDUL LEMBAR DISPOSISI */}
                <div className="border-b border-slate-800 py-1 text-center bg-slate-50/70">
                  <h3 className="text-xs sm:text-sm font-black tracking-[0.3em] uppercase text-slate-900">
                    LEMBAR &nbsp; DISPOSISI
                  </h3>
                </div>

                {/* BAGIAN ATAS: DATA DARI LOKET (2 KOLOM RESPONSIF) */}
                <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-800 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                  {/* Kiri Atas: Surat dari, No. Surat, Tgl. Surat */}
                  <div className="flex flex-col divide-y divide-slate-800">
                    <div className="px-2.5 py-1.5 flex-1 flex items-start gap-1.5 text-[10.5px] sm:text-[11px]">
                      <span className="font-semibold text-slate-700 w-16 sm:w-20 shrink-0">Surat dari</span>
                      <span>:</span>
                      <span className="font-bold text-slate-900 break-words">{targetSuratDisposisi.asal_surat || '—'}</span>
                    </div>
                    <div className="px-2.5 py-1 flex items-center gap-1.5 text-[10.5px] sm:text-[11px]">
                      <span className="font-semibold text-slate-700 w-16 sm:w-20 shrink-0">No. Surat</span>
                      <span>:</span>
                      <span className="font-mono font-semibold text-slate-900 break-all">{targetSuratDisposisi.no_surat || '—'}</span>
                    </div>
                    <div className="px-2.5 py-1 flex items-center gap-1.5 text-[10.5px] sm:text-[11px]">
                      <span className="font-semibold text-slate-700 w-16 sm:w-20 shrink-0">Tgl. Surat</span>
                      <span>:</span>
                      <span className="text-slate-900">
                        {targetSuratDisposisi.tgl_surat
                          ? new Date(targetSuratDisposisi.tgl_surat).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                          : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Kanan Atas: Diterima Tgl, No. Agenda, Sifat */}
                  <div className="flex flex-col divide-y divide-slate-800">
                    <div className="px-2.5 py-1 flex items-center gap-1.5 text-[10.5px] sm:text-[11px]">
                      <span className="font-semibold text-slate-700 w-20 sm:w-24 shrink-0">Diterima Tgl</span>
                      <span>:</span>
                      <span className="font-bold text-slate-900">
                        {targetSuratDisposisi.tgl_input
                          ? new Date(targetSuratDisposisi.tgl_input).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                          : '—'}
                      </span>
                    </div>
                    <div className="px-2.5 py-1 flex items-center gap-1.5 text-[10.5px] sm:text-[11px]">
                      <span className="font-semibold text-slate-700 w-20 sm:w-24 shrink-0">No. Agenda</span>
                      <span>:</span>
                      <span className="font-mono font-bold text-slate-900">{targetSuratDisposisi.no_agenda || '—'}</span>
                    </div>
                    <div className="px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-slate-700">
                      Sifat
                    </div>
                    {/* 3 Kotak Sifat Sejajar */}
                    <div className="grid grid-cols-3 divide-x divide-slate-800 text-[10px] sm:text-[11px]">
                      {[
                        { label: 'Sangat Segera', activeBg: 'bg-red-600 border-red-600 text-white', activeText: 'font-bold text-red-700' },
                        { label: 'Segera', activeBg: 'bg-amber-500 border-amber-500 text-white', activeText: 'font-bold text-amber-700' },
                        { label: 'Rahasia', activeBg: 'bg-slate-800 border-slate-800 text-white', activeText: 'font-bold text-slate-900' },
                      ].map((s) => {
                        const isSifat = targetSuratDisposisi.sifat === s.label;
                        return (
                          <div key={s.label} className="px-1.5 sm:px-2 py-1 flex items-center gap-1 sm:gap-1.5">
                            <span
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 border flex items-center justify-center text-[8px] sm:text-[9px] font-black shrink-0 ${isSifat ? s.activeBg : 'border-slate-700 bg-white'
                                }`}
                            >
                              {isSifat ? '✓' : ''}
                            </span>
                            <span className={`leading-tight ${isSifat ? s.activeText : 'text-slate-700'}`}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* BARIS HAL (PERIHAL DARI LOKET) */}
                <div className="border-b border-slate-800 px-2.5 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[10.5px] sm:text-[11px]">
                  <div className="flex items-start gap-1.5 flex-1 min-w-[200px]">
                    <span className="font-semibold text-slate-700 w-16 sm:w-20 shrink-0">Hal :</span>
                    <span className="font-medium text-slate-900">{targetSuratDisposisi.perihal || '—'}</span>
                  </div>
                  {targetSuratDisposisi.nama_kategori && (
                    <span className="shrink-0 px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-[9.5px] sm:text-[10px] font-semibold text-slate-600">
                      {targetSuratDisposisi.nama_kategori}
                    </span>
                  )}
                </div>

                {/* BAGIAN TENGAH: CHECKLIST PENERIMA & HARAPAN (2 KOLOM) */}
                <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-800 divide-y md:divide-y-0 md:divide-x divide-slate-800">

                  {/* KOLOM KIRI: DITERUSKAN KEPADA SDR. */}
                  <div className="p-2 sm:p-2.5 flex flex-col justify-between">
                    <div>
                      <p className="text-[10.5px] font-bold text-slate-800 mb-1">
                        Diteruskan Kepada Sdr. :
                      </p>
                      <div className="space-y-0.5">
                        {(() => {
                          const cariIdBagian = (kode: string, kataKunci: string, fallbackIdx: number) => {
                            const cocok = bagianList.find(
                              (b) =>
                                b.kode_bagian?.toUpperCase() === kode.toUpperCase() ||
                                b.nama_bagian?.toLowerCase().includes(kataKunci.toLowerCase())
                            );
                            return cocok?.id ?? bagianList[fallbackIdx]?.id ?? bagianList[0]?.id ?? 0;
                          };

                          const idSekr = cariIdBagian('SEKR', 'sekretar', 0);
                          const idPembinaan = cariIdBagian('PU', 'pembinaan', 1);
                          const idMutasi = cariIdBagian('MIK', 'mutasi', 2);
                          const idPsdm = cariIdBagian('PSDM', 'pengembangan', 3);

                          const daftarPenerima = [
                            { id: 'sekretaris', label: 'SEKRETARIS', bagianId: idSekr, heading: true },
                            { id: 'kasubbag-umum', label: 'KASUBBAG. UMUM DAN PERLENGKAPAN', bagianId: idSekr },
                            { id: 'kasubbag-keuangan', label: 'KASUBBAG. PERENCANAAN DAN KEUANGAN', bagianId: idSekr },
                            { id: 'bendahara', label: 'BENDAHARA', bagianId: idSekr },
                            { id: 'pengurus-barang', label: 'PENGURUS BARANG', bagianId: idSekr },
                            { id: 'kabid-pembinaan', label: 'KABID. PEMBINAAN UMUM', bagianId: idPembinaan, heading: true },
                            { id: 'pu-madya', label: 'ANALIS KEPEGAWAIAN AHLI MADYA', bagianId: idPembinaan },
                            { id: 'pu-muda', label: 'ANALIS KEPEGAWAIAN AHLI MUDA', bagianId: idPembinaan },
                            { id: 'kabid-psdm', label: 'KABID. PENGEMBANGAN SDM', bagianId: idPsdm, heading: true },
                            { id: 'psdm-madya', label: 'ANALIS KEPEGAWAIAN AHLI MADYA', bagianId: idPsdm },
                            { id: 'psdm-muda', label: 'ANALIS KEPEGAWAIAN AHLI MUDA', bagianId: idPsdm },
                            { id: 'kabid-mik', label: 'KABID MUTASI DAN INFORMASI KEPEGAWAIAN', bagianId: idMutasi, heading: true },
                            { id: 'mik-madya', label: 'ANALIS KEPEGAWAIAN AHLI MADYA', bagianId: idMutasi },
                            { id: 'mik-muda', label: 'ANALIS KEPEGAWAIAN AHLI MUDA', bagianId: idMutasi },
                          ];

                          const activeBagianId = daftarPenerima.find((d) => checkedPenerima.includes(d.id))?.bagianId;

                          return daftarPenerima.map((item) => {
                            const checked = checkedPenerima.includes(item.id);

                            return (
                              <label
                                key={item.id}
                                className={`flex items-center gap-2 px-1 py-[1px] rounded cursor-pointer transition select-none ${checked ? 'bg-amber-50' : 'hover:bg-slate-50'
                                  }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      if (activeBagianId === item.bagianId) {
                                        setCheckedPenerima([...checkedPenerima, item.id]);
                                      } else {
                                        setCheckedPenerima([item.id]);
                                        setSelectedBagianTujuan(item.bagianId);
                                      }
                                    } else {
                                      const sisa = checkedPenerima.filter((p) => p !== item.id);
                                      setCheckedPenerima(sisa);
                                      if (sisa.length === 0) {
                                        setSelectedBagianTujuan(0);
                                      }
                                    }
                                  }}
                                  className="w-3.5 h-3.5 rounded-none text-amber-600 border-slate-700 focus:ring-amber-500 shrink-0 cursor-pointer"
                                />
                                <span
                                  className={`text-[10px] leading-tight ${item.heading ? 'font-bold underline decoration-slate-700 underline-offset-2' : 'font-medium'
                                    } ${checked ? 'text-amber-900 font-bold' : 'text-slate-800'}`}
                                >
                                  {item.label}
                                </span>
                              </label>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* KOLOM KANAN: DENGAN HORMAT HARAP */}
                  <div className="p-2 sm:p-2.5">
                    <p className="text-[10.5px] font-bold text-slate-800 mb-1">
                      Dengan hormat harap :
                    </p>
                    <div className="space-y-0.5">
                      {[
                        'KOORDINASIKAN DENGAN INSTANSI TERKAIT',
                        'PELAJARI / MONITOR',
                        'WAKILI / HADIRI / WAKILKAN',
                        'TINDAKLANJUTI',
                        'BUAT TELAAHAN',
                        'PERTIMBANGKAN / KAJI KEMBALI',
                        'LAPORKAN HASILNYA',
                        'PROSES SESUAI KETENTUAN',
                        'PEDOMANI',
                        'JADWALKAN',
                        'PERSIAPKAN',
                        'UNTUK MENJADI PERHATIAN (UMP)',
                        'UNTUK DIKETAHUI (UDK)',
                        'SIAPKAN SAMBUTAN',
                        'INGATKAN',
                        'ARSIP',
                      ].map((harapan) => {
                        const checked = selectedInstruksi.includes(harapan);
                        return (
                          <label
                            key={harapan}
                            className={`flex items-center gap-2 px-1 py-[1px] rounded cursor-pointer transition select-none ${checked ? 'bg-amber-50' : 'hover:bg-slate-50'
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedInstruksi([...selectedInstruksi, harapan]);
                                } else {
                                  setSelectedInstruksi(selectedInstruksi.filter((i) => i !== harapan));
                                }
                              }}
                              className="w-3.5 h-3.5 rounded-none text-amber-600 border-slate-700 focus:ring-amber-500 shrink-0 cursor-pointer"
                            />
                            <span
                              className={`text-[10px] leading-tight ${checked ? 'text-amber-900 font-bold' : 'text-slate-800 font-medium'
                                }`}
                            >
                              {harapan}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* BAGIAN BAWAH: CATATAN */}
                <div className="p-2">
                  <p className="text-[10.5px] font-bold text-slate-800 mb-1">
                    Catatan :
                  </p>
                  <textarea
                    rows={2}
                    value={catatanKepala}
                    onChange={(e) => setCatatanKepala(e.target.value)}
                    placeholder="Tuliskan catatan khusus pimpinan di sini..."
                    className="w-full px-2.5 py-1.5 bg-slate-50/50 border border-slate-300 rounded text-[11px] text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-800 focus:outline-none resize-none leading-snug"
                  />
                </div>
              </div>
            </div>

            {/* ===== FOOTER TOMBOL AKSI (SELALU TERLIHAT DI SEMUA UKURAN LAYAR) ===== */}
            <div className="shrink-0 bg-slate-50 border-t border-slate-200 px-3 sm:px-5 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 print:hidden">
              <p className="text-[10px] sm:text-[11px] text-slate-500 italic text-center sm:text-left">
                Lembar disposisi akan diteruskan ke bagian pelaksana setelah dikonfirmasi.
              </p>
              <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setModalDisposisiOpen(false)}
                  className="flex-1 sm:flex-none px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDisposisi}
                  className="flex-1 sm:flex-none px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-md shadow-amber-900/20 inline-flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Terbitkan Lembar Disposisi</span>
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div >
  );
};
