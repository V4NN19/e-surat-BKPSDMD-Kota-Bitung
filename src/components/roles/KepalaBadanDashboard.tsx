/**
 * @file KepalaBadanDashboard.tsx
 * @description Dashboard Eksekutif Kepala BKPSDMD Kota Bitung (Disposisi Digital & Persetujuan Surat Keluar)
 * Status persuratan (Menunggu Disposisi, Terverifikasi, Tolak/Revisi) ditempatkan langsung di dalam Daftar Surat
 * Responsif untuk semua perangkat (iOS, Android, Windows, Mac)
 */

import React, { useState } from 'react';
import LOGO_KOTA_BITUNG_SULAWESI_UTARA from '../../assets/LOGO_KOTA_BITUNG_SULAWESI_UTARA.png'
import { usePersuratan } from '../../context/PersuratanContext';
import { SuratMasuk, SuratKeluar } from '../../types';
import {
  Crown,
  CheckCircle,
  Clock,
  Briefcase,
  Eye,
  FileCheck2,
  AlertTriangle,
  RotateCcw,
  Send,
  Building,
  UserCheck,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  FileText,
  Filter,
  Search,
  BarChart3,
  Download,
  Printer

} from 'lucide-react';

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
  const [statusFilter, setStatusFilter] = useState<'semua' | 'menunggu' | 'terverifikasi' | 'dikembalikan'>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  const currentView = externalActiveMenu || internalTab;

  const handleTabChange = (view: string) => {
    setInternalTab(view);
    onSelectMenu?.(view);
  };

  // Modal Lembar Disposisi Digital
  const [modalDisposisiOpen, setModalDisposisiOpen] = useState(false);
  const [targetSuratDisposisi, setTargetSuratDisposisi] = useState<SuratMasuk | null>(null);
  const [selectedBagianTujuan, setSelectedBagianTujuan] = useState<number>(bagianList[1]?.id || 2);
  const [selectedInstruksi, setSelectedInstruksi] = useState<string[]>([]);
  const [catatanKepala, setCatatanKepala] = useState('');

  // Modal Kembalikan untuk Revisi Surat Keluar
  const [modalRevisiKeluarOpen, setModalRevisiKeluarOpen] = useState(false);
  const [targetSuratRevisi, setTargetSuratRevisi] = useState<SuratKeluar | null>(null);
  const [catatanRevisiKeluar, setCatatanRevisiKeluar] = useState('');

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

  return (
    <div className="space-y-6">

      {/* Subheader */}
      <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 rounded-xl text-amber-700 border border-amber-200 shrink-0">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Eksekutif Kepala BKPSDMD
            </h1>
            <p className="text-xs text-slate-500">
              Penerbitan Lembar Disposisi Digital &amp; Persetujuan Naskah Dinas Internal
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold gap-1 self-start md:self-auto">
          <button
            onClick={() => handleTabChange('surat_masuk')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${currentView === 'surat_masuk' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Daftar Surat Masuk</span>
            <span className='w-5 h-5 bg-red-600 rounded-full text-[10px] text-white font-extrabold inline-flex items-center justify-center loading-none'>{suratMasukList.length}</span>
          </button>

          <button
            onClick={() => handleTabChange('persetujuan_keluar')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${currentView === 'persetujuan_keluar' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Draft Surat Keluar</span>
            {suratKeluarMenungguApproval.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px]">
                {suratKeluarMenungguApproval.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {
        currentView === 'eksekutif' && (() => {
          // Data rekapitulasi 12 bulan
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
            { bulan: 'November', masuk: suratMasukList.length, keluar: suratKeluarList.length, disposisi: suratMasukList.filter((s: any) => s.disposisi).length },
            { bulan: 'Desember', masuk: 0, keluar: 0, disposisi: 0 }
          ];

          const maxChartValue = Math.max(...rekapitulasiBulanan.map((r: any) => Math.max(r.masuk, r.keluar, r.disposisi))) || 50;

          // Fungsi Ekspor CSV / Excel
          const handleExportCSV = () => {
            const csvRows = [
              ['Bulan Pelaporan', 'Surat Masuk (Registrasi)', 'Surat Keluar Internal', 'Disposisi Diterbitkan', 'Rasio Penyelesaian'],
              ...rekapitulasiBulanan.map((r) => {
                const rasio = r.masuk > 0 ? Math.round((r.disposisi / r.masuk) * 100) : 0;
                return [r.bulan, r.masuk, r.keluar, r.disposisi, `${rasio}%`];
              })
            ];
            const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e: any) => e.join(',')).join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'rekapitulasi_persuratan_admin_2026.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };


          return (

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
              {/* Header Tab & Tombol Aksi (Cetak + Ekspor CSV) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-emerald-600" />
                    <span>Rekapitulasi Persuratan BKPSDMD Kota Bitung</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Grafik komparasi 3 metrik tata kelola: Surat Masuk, Surat Keluar Internal, dan Lembar Disposisi Kepala Badan
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Laporan</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor CSV/Excel</span>
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

              {/* Tabel Rincian Data Rekapitulasi Persuratan */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                  Tabel Rincian Data Rekapitulasi Persuratan
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse border border-slate-200 rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-3">Bulan Pelaporan</th>
                        <th className="py-2.5 px-3 text-center">Surat Masuk (Registrasi)</th>
                        <th className="py-2.5 px-3 text-center">Surat Keluar Internal</th>
                        <th className="py-2.5 px-3 text-center">Disposisi Diterbitkan</th>
                        <th className="py-2.5 px-3 text-center">Rasio Penyelesaian</th>
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
          );
        })()
      }


      {/* 1. VIEW: DASHBOARD EKSEKUTIF / LIVE TRACKING */}
      {
        currentView === 'eksekutif' && (

          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            {/* 4 STAT CARDS EKSEKUTIF (Sesuai Desain Figma) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">

              {/* Card 1: Menunggu Disposisi */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[110px]">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Menunggu Disposisi
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">
                  {totalMenungguDisposisi}
                </p>
              </div>

              {/* Card 2: Diproses Bidang */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[110px]">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Diproses Bidang
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">
                  {totalDiprosesBidang}
                </p>
              </div>

              {/* Card 3: Selesai */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[110px]">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Selesai
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">
                  {totalSelesai}
                </p>
              </div>

              {/* Card 4: Surat Keluar */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[110px]">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Surat Keluar
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">
                  {totalSuratKeluar}
                </p>
              </div>

            </div>
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Tabel Pemantauan Posisi Surat Real-Time</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Pimpinan dapat memantau secara presisi di meja kerja mana berkas persuratan berada sekarang.
                </p>
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
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${posisi.color}`}>
                            {posisi.text}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap text-center border-r border-slate-200">
                          {surat.tgl_input}
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
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 text-amber-950 font-mono font-bold">
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
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-200 text-emerald-950 font-mono font-bold">
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
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-200 text-rose-950 font-mono font-bold">
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
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono hover:bg-slate-200 ${statusFilter === 'semua' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
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
                        <td className="py-3 px-3 text-right whitespace-nowrap space-x-1.5 text-center border-r border-slate-200">
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

            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <th className="py-3 px-3 text-center border-l border-r border-slate-200">No. Draft</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Jenis &amp; Perihal</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Bagian Pengirim</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Bagian Tujuan</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Versi File</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Status Approval</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Aksi Pimpinan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {suratKeluarList.map((sk) => {
                    const daftarVersi = Array.isArray(sk.versi_file) ? sk.versi_file : [];
                    const versiTerbaru = daftarVersi.length > 0 ? daftarVersi[daftarVersi.length - 1] : null;
                    const statusApproval = sk.status_persetujuan || 'PENGAJUAN_KE_KEPALA_BADAN';
                    const isMenungguApproval = statusApproval === 'PENGAJUAN_KE_KEPALA_BADAN';
                    return (
                      <tr key={sk.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap text-center border-l border-r border-slate-200">
                          {sk.no_draft}
                        </td>
                        <td className="py-3 px-3 max-w-sm text-center border-r border-slate-200">
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-700">
                            {sk.jenis_naskah}
                          </span>
                          <p className="font-bold text-slate-900 mt-1">{sk.perihal}</p>
                          <p className="text-[11px] text-slate-500 italic line-clamp-1">"{sk.isi_ringkas}"</p>
                        </td>
                        <td className="py-3 px-3 font-semibold text-purple-900 whitespace-normal text-center border-r border-slate-200">
                          {sk.nama_bagian_pengirim}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800 whitespace-normal text-center border-r border-slate-200">
                          {sk.nama_bagian_tujuan}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-center border-r border-slate-200">
                          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-200">
                            Versi {versiTerbaru ? versiTerbaru.versi_ke : 1}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-center border-r border-slate-200">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusApproval === 'DISETUJUI_KEPALA_BADAN'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : statusApproval === 'REVISI'
                                ? 'bg-red-100 text-red-800 border-red-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                              }`}
                          >
                            {statusApproval.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap space-x-1.5 text-center border-r border-slate-200">
                          <button
                            onClick={() => onLihatSuratKeluar(sk)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                          >
                            Pratinjau Draft
                          </button>

                          {isMenungguApproval && (
                            <>
                              <button
                                onClick={() => handleOpenRevisiKeluar(sk)}
                                className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-semibold cursor-pointer"
                              >
                                Revisi
                              </button>
                              <button
                                onClick={() => {
                                  setujuiSuratKeluar(sk.id);
                                  alert(`Konsep surat keluar ${sk.no_draft} telah disetujui Kepala Badan!`);
                                }}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                              >
                                Setujui (Approve)
                              </button>
                            </>
                          )}
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
      {
        modalDisposisiOpen && targetSuratDisposisi && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-3xl w-full shadow-2xl border border-slate-300 my-4 animate-scale-up overflow-hidden print:shadow-none print:border-slate-400">

              {/* ===== HEADER KOP SURAT ===== */}
              <div className="bg-white border-b-2 border-slate-800 px-5 py-3 flex items-center gap-4 print:block">
                {/* Logo */}
                <div className="shrink-0 w-15 h-15 rounded-full flex items-center justify-center border-slate-450 overflow-hidden">
                  <img
                    src={LOGO_KOTA_BITUNG_SULAWESI_UTARA}
                    alt='LOGO PEMKOT'
                  />
                </div>
                <div className="flex-1 text-center">
                  <p className="text-[10px] font-semibold text-slate-700 uppercase tracking-wide">PEMERINTAH KOTA BITUNG</p>
                  <h1 className="text-sm sm:text-base font-black text-slate-900 uppercase leading-tight tracking-tight">
                    BADAN KEPEGAWAIAN DAN PENGEMBANGAN
                  </h1>
                  <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase leading-tight tracking-tight">
                    SUMBER DAYA MANUSIA DAERAH
                  </h2>
                  <p className="text-[9px] text-slate-500 mt-0.5">
                    Jln. DR. Sam Ratulangi No. 40 Bitung 95511. Telp/Fax: (0438) 21458 Email: bkpsdmd@kotabitung@gmail.com
                  </p>
                </div>
              </div>

              {/* ===== JUDUL LEMBAR ===== */}
              <div className="border-b border-slate-800 py-1.5 text-center">
                <h3 className="text-sm font-black tracking-[0.3em] uppercase text-slate-900">
                  LEMBAR &nbsp; DISPOSISI
                </h3>
              </div>

              {/* ===== BODY UTAMA: 2 KOLOM ===== */}
              <div className="flex flex-col sm:flex-row border-b border-slate-800 text-xs">

                {/* ===== KOLOM KIRI: Metadata Surat + Diteruskan Kepada ===== */}
                <div className="flex-1 border-b sm:border-b-0 sm:border-r border-slate-800">

                  {/* Info Surat */}
                  <div className="border-b border-slate-300 p-3 space-y-1.5 text-[11px]">
                    <div className="flex gap-2">
                      <span className="font-semibold text-slate-700 w-20 shrink-0">Surat dari</span>
                      <span className="text-slate-500 mr-1">:</span>
                      <span className="font-bold text-slate-900">{targetSuratDisposisi.asal_surat}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-slate-700 w-20 shrink-0">No. Surat</span>
                      <span className="text-slate-500 mr-1">:</span>
                      <span className="font-mono text-slate-800">{targetSuratDisposisi.no_surat}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-slate-700 w-20 shrink-0">Tgl. Surat</span>
                      <span className="text-slate-500 mr-1">:</span>
                      <span className="text-slate-800">{targetSuratDisposisi.tgl_surat}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-slate-700 w-20 shrink-0">Hal</span>
                      <span className="text-slate-500 mr-1">:</span>
                      <span className="text-slate-800 italic">{targetSuratDisposisi.perihal}</span>
                    </div>
                  </div>

                  {/* Nomor Agenda & Sifat row */}
                  <div className="border-b border-slate-300 grid grid-cols-2 divide-x divide-slate-300 text-[10px]">
                    <div className="p-2.5">
                      <p className="text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Diterima Tgl.</p>
                      <p className="font-bold text-slate-800">{targetSuratDisposisi.tgl_input || '—'}</p>
                    </div>
                    <div className="p-2.5">
                      <p className="text-slate-500 uppercase tracking-wider font-semibold mb-0.5">No. Agenda</p>
                      <p className="font-bold font-mono text-slate-800">{targetSuratDisposisi.no_agenda}</p>
                    </div>
                  </div>
                  <div className="border-b border-slate-300 grid grid-cols-2 divide-x divide-slate-300 text-[10px]">
                    <div className="p-2.5">
                      <p className="text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Sifat</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`flex items-center gap-1 ${targetSuratDisposisi.sifat === 'Sangat Segera' ? 'font-bold text-red-700' : 'text-slate-400'}`}>
                          <span className={`w-3 h-3 rounded-sm border border-slate-400 inline-block ${targetSuratDisposisi.sifat === 'Sangat Segera' ? 'bg-red-600 border-red-600' : ''}`} />
                          Sangat Segera
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`flex items-center gap-1 ${targetSuratDisposisi.sifat === 'Segera' ? 'font-bold text-amber-700' : 'text-slate-400'}`}>
                          <span className={`w-3 h-3 rounded-sm border border-slate-400 inline-block ${targetSuratDisposisi.sifat === 'Segera' ? 'bg-amber-500 border-amber-500' : ''}`} />
                          Segera
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`flex items-center gap-1 ${targetSuratDisposisi.sifat === 'Rahasia' ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                          <span className={`w-3 h-3 rounded-sm border border-slate-400 inline-block ${targetSuratDisposisi.sifat === 'Rahasia' ? 'bg-slate-800 border-slate-800' : ''}`} />
                          Rahasia
                        </span>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="text-slate-500 uppercase tracking-wider font-semibold mb-1">Kategori</p>
                      <p className="font-semibold text-slate-800">{targetSuratDisposisi.nama_kategori || '—'}</p>
                    </div>
                  </div>

                  {/* Diteruskan Kepada */}
                  <div className="p-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
                      Diteruskan Kepada Sdr.:
                    </p>
                    <div className="space-y-0.5">
                      {/* Baris checklist sesuai struktur BKPSDMD dari foto template */}
                      {([
                        { label: 'SEKRETARIS', bagianId: 1 },
                        { label: 'Kasubbag. Umum dan Perlengkapan', bagianId: null },
                        { label: 'Kasubbag. Perencanaan dan Keuangan', bagianId: null },
                        { label: 'Pengurus Barang', bagianId: null },
                        { label: 'Bendahara', bagianId: null },
                        { label: 'Kabid. Pembinaan Umum', bagianId: 2 },
                      ] as { label: string; bagianId: number | null }[]).map((item, idx) => {
                        const isSelected = item.bagianId !== null && item.bagianId === selectedBagianTujuan;
                        return (
                          <div key={idx} className={`flex items-center gap-2 px-2 py-0.5 rounded ${isSelected ? 'bg-amber-50' : ''}`}>
                            <span className={`w-3.5 h-3.5 rounded-sm border flex-shrink-0 flex items-center justify-center ${isSelected ? 'bg-amber-500 border-amber-600' : 'border-slate-400 bg-white'}`}>
                              {isSelected && <span className="text-white text-[8px] font-black">✓</span>}
                            </span>
                            <span className={`text-[10px] leading-snug ${isSelected ? 'text-amber-900 font-bold' : 'text-slate-700'}`}>{item.label}</span>
                          </div>
                        );
                      })}

                      {/* Kabid. Pengembangan SDM */}
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-700 mt-1.5 mb-0.5 pl-4">
                        KABID. PENGEMBANGAN SDM
                      </p>
                      {([
                        { label: 'Analis Kepegawaian Ahli Madya', bagianId: 4 },
                        { label: 'Analis Kepegawaian Ahli Muda', bagianId: null },
                      ] as { label: string; bagianId: number | null }[]).map((item, idx) => {
                        const isSelected = item.bagianId !== null && item.bagianId === selectedBagianTujuan;
                        return (
                          <div key={idx} className={`flex items-center gap-2 px-2 py-0.5 rounded ${isSelected ? 'bg-amber-50' : ''}`}>
                            <span className={`w-3.5 h-3.5 rounded-sm border flex-shrink-0 flex items-center justify-center ${isSelected ? 'bg-amber-500 border-amber-600' : 'border-slate-400 bg-white'}`}>
                              {isSelected && <span className="text-white text-[8px] font-black">✓</span>}
                            </span>
                            <span className={`text-[10px] leading-snug ${isSelected ? 'text-amber-900 font-bold' : 'text-slate-700'}`}>{item.label}</span>
                          </div>
                        );
                      })}

                      {/* Kabid Mutasi dan Informasi Kepegawaian */}
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-700 mt-1.5 mb-0.5 pl-4">
                        KABID MUTASI DAN INFORMASI KEPEGAWAIAN
                      </p>
                      {([
                        { label: 'Analis Kepegawaian Ahli Madya', bagianId: 3 },
                        { label: 'Analis Kepegawaian Ahli Muda', bagianId: null },
                        { label: 'Analis Kepegawaian Ahli Muda', bagianId: null },
                      ] as { label: string; bagianId: number | null }[]).map((item, idx) => {
                        const isSelected = item.bagianId !== null && item.bagianId === selectedBagianTujuan;
                        return (
                          <div key={idx} className={`flex items-center gap-2 px-2 py-0.5 rounded ${isSelected ? 'bg-amber-50' : ''}`}>
                            <span className={`w-3.5 h-3.5 rounded-sm border flex-shrink-0 flex items-center justify-center ${isSelected ? 'bg-amber-500 border-amber-600' : 'border-slate-400 bg-white'}`}>
                              {isSelected && <span className="text-white text-[8px] font-black">✓</span>}
                            </span>
                            <span className={`text-[10px] leading-snug ${isSelected ? 'text-amber-900 font-bold' : 'text-slate-700'}`}>{item.label}</span>
                          </div>
                        );
                      })}

                      <div className="mt-1.5 border-t border-slate-200 pt-1.5">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-700 mb-0.5">
                          Teruskan kepada instansi terkait:
                        </p>
                        <div className="h-6 border-b border-dotted border-slate-300" />
                      </div>
                    </div>
                  </div>

                  {/* Pilihan Bagian Tujuan (dropdown fungsional) */}
                  <div className="border-t border-slate-200 p-3 bg-amber-50/40">
                    <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">
                      ★ Pilih Bagian Penerima Disposisi:
                    </p>
                    <select
                      value={selectedBagianTujuan}
                      onChange={(e) => setSelectedBagianTujuan(Number(e.target.value))}
                      className="w-full px-2.5 py-2 bg-white border border-amber-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      {bagianList
                        .filter((b) => b.kode_bagian !== 'SEKR')
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.nama_bagian} ({b.kode_bagian})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* ===== KOLOM KANAN: Instruksi Disposisi ===== */}
                <div className="w-full sm:w-56 flex flex-col">
                  {/* Header kolom kanan */}
                  <div className="border-b border-slate-300 p-2.5 text-center bg-slate-50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                      Dengan hormat harap:
                    </p>
                  </div>

                  {/* Checklist Instruksi Disposisi */}
                  <div className="flex-1 p-2.5 space-y-0.5">
                    {instruksiList.map((ins) => {
                      const checked = selectedInstruksi.includes(ins.instruksi);
                      return (
                        <label
                          key={ins.id}
                          className={`flex items-center gap-2 px-1.5 py-1 rounded cursor-pointer transition ${checked ? 'bg-amber-50' : 'hover:bg-slate-50'
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedInstruksi([...selectedInstruksi, ins.instruksi]);
                              } else {
                                setSelectedInstruksi(selectedInstruksi.filter((i) => i !== ins.instruksi));
                              }
                            }}
                            className="w-3.5 h-3.5 rounded-sm text-amber-600 border-slate-400 focus:ring-amber-500 shrink-0 cursor-pointer"
                          />
                          <span className={`text-[10px] leading-snug ${checked ? 'text-amber-900 font-bold' : 'text-slate-700'}`}>
                            {ins.instruksi}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Catatan */}
                  <div className="border-t border-slate-300 p-2.5">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Catatan:
                    </p>
                    <textarea
                      rows={3}
                      value={catatanKepala}
                      onChange={(e) => setCatatanKepala(e.target.value)}
                      placeholder="Catatan khusus pimpinan..."
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-[10px] text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Kolom TTD Kepala Badan */}
                  <div className="border-t border-slate-800 p-3 bg-slate-50">
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-700 text-center leading-snug mb-3">
                      KEPALA BADAN KEPEGAWAIAN DAN<br />
                      PENGEMBANGAN SUMBER DAYA MANUSIA DAERAH<br />
                      KOTA BITUNG,
                    </p>
                    {/* Area TTD */}
                    <div className="h-14 border border-dashed border-slate-300 rounded mb-2 flex items-center justify-center">
                      <span className="text-[9px] text-slate-400 italic">Tanda tangan</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-900 text-center uppercase leading-tight">
                      GIVE RENALDOW MOSE, AP, M.SI
                    </p>
                    <p className="text-[9px] text-slate-600 text-center mt-0.5">
                      Pembina Utama Muda
                    </p>
                    <p className="text-[9px] font-mono text-slate-700 text-center">
                      NIP. 19750618 199412 1 001
                    </p>
                  </div>
                </div>
              </div>

              {/* ===== ACTION BUTTONS (tidak dicetak) ===== */}
              <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 print:hidden">
                <p className="text-[10px] text-slate-500 italic">
                  * Lembar disposisi akan diteruskan ke bagian pelaksana setelah dikonfirmasi.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalDisposisiOpen(false)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDisposisi}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-md shadow-amber-900/20 inline-flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Terbitkan Lembar Disposisi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Modal Kembalikan untuk Revisi Konsep Surat Keluar */}
      {
        modalRevisiKeluarOpen && targetSuratRevisi && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-scale-up space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-red-100 text-red-600 rounded-xl shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Kembalikan Konsep Naskah Dinas untuk Revisi
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kepala Bagian pembuat surat akan menerima notifikasi revisi beserta catatan perbaikan.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <p><strong>No. Draft:</strong> {targetSuratRevisi.no_draft}</p>
                <p><strong>Bagian Pembuat:</strong> {targetSuratRevisi.nama_bagian_pengirim}</p>
                <p><strong>Perihal:</strong> {targetSuratRevisi.perihal}</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Rincian Poin Catatan Revisi Pimpinan:
                </label>
                <textarea
                  rows={3}
                  required
                  value={catatanRevisiKeluar}
                  onChange={(e) => setCatatanRevisiKeluar(e.target.value)}
                  placeholder="Tuliskan bagian mana dari naskah dinas yang perlu disempurnakan atau direvisi..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalRevisiKeluarOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRevisiKeluar}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Kirim Catatan Revisi
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};
