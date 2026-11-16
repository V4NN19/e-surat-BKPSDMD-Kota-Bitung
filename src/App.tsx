/**
 * @file App.tsx
 * @description Komponen Utama Sistem Informasi Pengelolaan Surat Masuk & Keluar BKPSDMD Kota Bitung
 * Tata Letak Enterprise: Top Header + Left Sidebar (Profil Pengguna & Status Persuratan) + Workspace Utama
 */

import React, { useState, useEffect } from 'react';
import { PersuratanProvider } from './context/PersuratanContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoginView } from './components/LoginView';
import { LoketDashboard } from './components/roles/LoketDashboard';
import { SekretariatDashboard } from './components/roles/SekretariatDashboard';
import { KepalaBadanDashboard } from './components/roles/KepalaBadanDashboard';
import { KepalaBagianDashboard } from './components/roles/KepalaBagianDashboard';
import { AdminDashboard } from './components/roles/AdminDashboard';
import { ModalPdfViewer } from './components/ModalPdfViewer';
import { ModalSchemaCode } from './components/ModalSchemaCode';
import { SuratMasuk, SuratKeluar, SuratKeluarVersiFile } from './types';
import { usePersuratan } from './context/PersuratanContext';

const MainAppContent: React.FC = () => {
  const { currentUser } = usePersuratan();
  const userRole = currentUser?.role;

  // State Menu Navigasi Sidebar
  const [activeMenu, setActiveMenu] = useState<string>('daftar');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // State Modals
  const [schemaModalOpen, setSchemaModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedSuratMasuk, setSelectedSuratMasuk] = useState<SuratMasuk | null>(null);
  const [selectedSuratKeluar, setSelectedSuratKeluar] = useState<SuratKeluar | null>(null);
  const [selectedVersiFile, setSelectedVersiFile] = useState<SuratKeluarVersiFile | null>(null);

  // Reset menu ke menu utama saat role berganti
  useEffect(() => {
    if (currentUser) {
      if (userRole === 'LOKET') setActiveMenu('input');
      else if (userRole === 'SEKRETARIAT') setActiveMenu('verifikasi');
      else if (userRole === 'KEPALA_BADAN') setActiveMenu('eksekutif');
      else if (userRole === 'KEPALA_BAGIAN') setActiveMenu('masuk_bagian');
      else if (userRole === 'ADMIN') setActiveMenu('rekap');
    }
  }, [userRole]);

  const handleLihatSuratMasuk = (surat: SuratMasuk) => {
    setSelectedSuratMasuk(surat);
    setSelectedSuratKeluar(null);
    setSelectedVersiFile(null);
    setPdfModalOpen(true);
  };

  const handleArsipkanSurat = (surat: SuratMasuk, versi?: SuratKeluarVersiFile) => {

    const isConfirmed = window.confirm(`Apakah Anda yakin ingin mengarsipkan surat: "${surat.perihal || surat.no_surat}"?`);
    if (!isConfirmed) return;

    try {
      // 2. Logika Update State (Jika menggunakan State / Context)
      // Mengubah status surat menjadi 'DIARSIPKAN' atau memindahkan ke koleksi arsip
      console.log('Mengarsipkan Surat :', surat);
      alert('Surat berhasil diarsipkan!');
    } catch (error) {
      console.log('Gagal mengarsipkan surat', error);
      alert('Terjadi kesalahan saat mengarsipkan surat');
    }
  };

  const handleLihatSuratKeluar = (surat: SuratKeluar, versi?: SuratKeluarVersiFile) => {
    setSelectedSuratKeluar(surat);
    setSelectedSuratMasuk(null);
    setSelectedVersiFile(versi || null);
    setPdfModalOpen(true);
  };

  if (!currentUser) {
    return (
      <>
        <LoginView onOpenSchemaModal={() => setSchemaModalOpen(true)} />
        <ModalSchemaCode isOpen={schemaModalOpen} onClose={() => setSchemaModalOpen(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans flex h-screen flex-col text-slate-800">

      {/* Top Header Resmi (Nama pengguna dipindahkan ke Sidebar) */}
      <Header
        onOpenSchemaModal={() => setSchemaModalOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isSidebarOpen={sidebarOpen}
      />

      {/* Main Container dengan Sidebar + Area Konten */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar Navigasi: Profil Pengguna & 3 Status Persuratan Utama */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeMenu={activeMenu}
          onSelectMenu={(menu) => setActiveMenu(menu)}
          onOpenSchemaModal={() => setSchemaModalOpen(true)}
        />

        {/* Main Workspace based on active Role */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {currentUser.role === 'LOKET' && (
              <LoketDashboard
                onLihatSurat={handleLihatSuratMasuk}
                activeMenu={activeMenu}
                onSelectMenu={setActiveMenu}
              />
            )}

            {currentUser.role === 'SEKRETARIAT' && (
              <SekretariatDashboard
                onLihatSurat={handleLihatSuratMasuk}
                onLihatSuratKeluar={handleLihatSuratKeluar}
                activeMenu={activeMenu}
                onSelectMenu={setActiveMenu}
              />
            )}

            {currentUser.role === 'KEPALA_BADAN' && (
              <KepalaBadanDashboard
                onLihatSuratMasuk={handleLihatSuratMasuk}
                onLihatSuratKeluar={handleLihatSuratKeluar}
                activeMenu={activeMenu}
                onSelectMenu={setActiveMenu}
              />
            )}

            {currentUser.role === 'KEPALA_BAGIAN' && (
              <KepalaBagianDashboard
                onLihatSuratMasuk={handleLihatSuratMasuk}
                onLihatSuratKeluar={handleLihatSuratKeluar}
                arsipkanSurat={handleArsipkanSurat}
                activeMenu={activeMenu}
                onSelectMenu={setActiveMenu}
              />
            )}

            {currentUser.role === 'ADMIN' && (
              <AdminDashboard
                activeMenu={activeMenu}
                onSelectMenu={setActiveMenu}
              />
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3.5 text-center text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Badan Kepegawaian dan Pengembangan Sumber Daya Manusia Daerah (BKPSDMD) Kota Bitung
          </span>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>SOP Tata Naskah Dinas Digital</span>
            <span>•</span>
            <button
              onClick={() => setSchemaModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer"
            >
              Skema Database XAMPP 7.3 &amp; Backend API
            </button>
          </div>
        </div>
      </footer>

      {/* Modal PDF Viewer & Lembar Disposisi */}
      <ModalPdfViewer
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        suratMasuk={selectedSuratMasuk}
        suratKeluar={selectedSuratKeluar}
        versiDipilih={selectedVersiFile}
      />

      {/* Modal Schema SQL & Backend Documentation */}
      <ModalSchemaCode
        isOpen={schemaModalOpen}
        onClose={() => setSchemaModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <PersuratanProvider>
      <MainAppContent />
    </PersuratanProvider>
  );
}
