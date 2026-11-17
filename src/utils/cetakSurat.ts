/**
 * @file cetakSurat.ts
 * @description Utilitas Cetak Dokumen Langsung (PDF Asli via Blob / Naskah Resmi A4) untuk Semua Role
 */

import { SuratMasuk, SuratKeluar } from '../types';

const BACKEND_BASE_URL =
    (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

/**
 * Helper internal untuk mencetak URL Blob PDF atau konten HTML melalui hidden iframe
 */
const jalankanIframePrint = (params: {
    blobUrl?: string;
    htmlContent?: string;
}): Promise<void> => {
    return new Promise((resolve) => {
        const printFrame = document.createElement('iframe');
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        document.body.appendChild(printFrame);

        const bersihkan = () => {
            setTimeout(() => {
                if (document.body.contains(printFrame)) {
                    document.body.removeChild(printFrame);
                }
                if (params.blobUrl && params.blobUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(params.blobUrl);
                }
                resolve();
            }, 1000);
        };

        // 1. Jika mencetak berkas PDF asli (Blob URL)
        if (params.blobUrl) {
            printFrame.onload = () => {
                try {
                    printFrame.contentWindow?.focus();
                    printFrame.contentWindow?.print();
                } catch {
                    window.open(params.blobUrl, '_blank');
                }
                bersihkan();
            };
            printFrame.src = params.blobUrl;
            return;
        }

        // 2. Jika mencetak format naskah digital HTML (A4 bersih)
        if (params.htmlContent) {
            const doc = printFrame.contentWindow?.document;
            if (!doc) {
                bersihkan();
                return;
            }

            doc.open();
            doc.write(params.htmlContent);
            doc.close();

            setTimeout(() => {
                printFrame.contentWindow?.focus();
                printFrame.contentWindow?.print();
                bersihkan();
            }, 250);
            return;
        }

        bersihkan();
    });
};

/**
 * Menyusun HTML Naskah Resmi BKPSDMD Kota Bitung (A4 tanpa header/footer browser)
 */
const buatHtmlNaskahResmi = (
    suratMasuk?: SuratMasuk,
    suratKeluar?: SuratKeluar
): string => {
    const gayaDasar = `
    <style>
      @page { size: A4; margin: 0; }
      body {
        font-family: 'Times New Roman', Times, serif;
        color: #0f172a;
        margin: 0;
        padding: 18mm 20mm;
        line-height: 1.5;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .kop { border-bottom: 3px double #0f172a; padding-bottom: 10px; margin-bottom: 20px; text-align: center; }
      .kop h4 { margin: 0; font-size: 13px; letter-spacing: 1px; }
      .kop h2 { margin: 4px 0; font-size: 16px; }
      .kop p { margin: 0; font-size: 11px; color: #475569; }
      .judul { text-align: center; margin-bottom: 18px; }
      .judul h3 { margin: 0; font-size: 15px; text-decoration: underline; text-transform: uppercase; }
      .judul p { margin: 4px 0 0; font-size: 12px; font-family: monospace; }
      .meta { width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 12px; }
      .meta td { padding: 6px 8px; border: 1px solid #cbd5e1; vertical-align: top; }
      .meta td.label { width: 22%; font-weight: bold; background: #f8fafc; }
      .isi { font-size: 13px; text-align: justify; margin-bottom: 24px; padding: 12px; border: 1px solid #e2e8f0; background: #f8fafc; }
      .disposisi-box { border: 1.5px solid #047857; background: #ecfdf5; padding: 10px 12px; margin-bottom: 24px; font-size: 12px; }
      .ttd { float: right; text-align: center; font-size: 12px; width: 250px; }
      .badge-acc { border: 2px solid #059669; color: #065f46; background: #ecfdf5; padding: 6px; font-weight: bold; margin: 10px 0; font-size: 11px; }
    </style>
  `;

    if (suratMasuk) {
        const disp = suratMasuk.disposisi;
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak Surat Masuk - ${suratMasuk.no_agenda}</title>
          ${gayaDasar}
        </head>
        <body>
          <div class="kop">
            <h4>PEMERINTAH KOTA BITUNG</h4>
            <h2>BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA DAERAH</h2>
            <p>Jl. Sam Ratulangi No. 45, Bitung, Sulawesi Utara • Email: bkpsdmd@bitungkota.go.id</p>
          </div>
          <div class="judul">
            <h3>LEMBAR REGISTRASI SURAT MASUK</h3>
            <p>No. Agenda: ${suratMasuk.no_agenda}</p>
          </div>
          <table class="meta">
            <tr>
              <td class="label">No. Surat Asal</td><td>${suratMasuk.no_surat}</td>
              <td class="label">Tanggal Surat</td><td>${suratMasuk.tgl_surat}</td>
            </tr>
            <tr>
              <td class="label">Asal Pengirim</td><td><strong>${suratMasuk.asal_surat}</strong></td>
              <td class="label">Sifat Surat</td><td>${suratMasuk.sifat}</td>
            </tr>
            <tr>
              <td class="label">Kategori</td><td>${suratMasuk.nama_kategori || 'Umum'}</td>
              <td class="label">Tgl. Diterima</td><td>${suratMasuk.tgl_input || '-'}</td>
            </tr>
            <tr>
              <td class="label">Perihal</td><td colspan="3"><strong>${suratMasuk.perihal}</strong></td>
            </tr>
          </table>
          <div class="isi">
            Berkas surat masuk ini telah diterima dan diverifikasi melalui sistem persuratan terpadu BKPSDMD Kota Bitung untuk diproses sesuai ketentuan tata naskah dinas.
          </div>
          ${disp
                ? `<div class="disposisi-box">
                  <strong>DISPOSISI KEPALA BADAN (${disp.tgl_disposisi}):</strong><br/>
                  Diteruskan Kepada: <strong>${disp.nama_bagian_tujuan}</strong><br/>
                  Instruksi: ${disp.instruksi.join(', ')}<br/>
                  Catatan: <em>"${disp.catatan_kepala || '-'}"</em>
                </div>`
                : ''
            }
          <div class="ttd">
            <p>Petugas Loket / Sekretariat,</p>
            <div class="badge-acc">✓ TERVERIFIKASI SISTEM</div>
            <p style="font-weight: bold; margin: 0;">${suratMasuk.nama_petugas_loket || 'Sekretariat BKPSDMD'}</p>
          </div>
        </body>
      </html>
    `;
    }

    const isApproved = suratKeluar?.status_persetujuan === 'DISETUJUI_KEPALA_BADAN';
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Cetak Surat Keluar - ${suratKeluar?.no_draft || ''}</title>
        ${gayaDasar}
      </head>
      <body>
        <div class="kop">
          <h4>PEMERINTAH KOTA BITUNG</h4>
          <h2>BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA DAERAH</h2>
          <p>Jl. Sam Ratulangi No. 45, Bitung, Sulawesi Utara • Email: bkpsdmd@bitungkota.go.id</p>
        </div>
        <div class="judul">
          <h3>${suratKeluar?.jenis_naskah || 'NASKAH DINAS'}</h3>
          <p>Nomor: ${suratKeluar?.no_draft || '-'}</p>
        </div>
        <table class="meta">
          <tr>
            <td class="label">Kepada Yth.</td><td>${suratKeluar?.nama_bagian_tujuan || '-'}</td>
            <td class="label">Tanggal</td><td>${suratKeluar?.tgl_dibuat || '-'}</td>
          </tr>
          <tr>
            <td class="label">Dari</td><td>${suratKeluar?.nama_bagian_pengirim || '-'}</td>
            <td class="label">Sifat</td><td>${suratKeluar?.sifat || 'Biasa'}</td>
          </tr>
          <tr>
            <td class="label">Perihal</td><td colspan="3"><strong>${suratKeluar?.perihal || '-'}</strong></td>
          </tr>
        </table>
        <div class="isi">
          <strong>Ringkasan Isi Naskah:</strong><br/>
          "${suratKeluar?.isi_ringkas || '-'}"
        </div>
        <div class="ttd">
          <p>Kepala BKPSDMD Kota Bitung,</p>
          ${isApproved
            ? `<div class="badge-acc">✓ TELAH DISETUJUI DIGITAL<br/><small>${suratKeluar?.tgl_disetujui || ''}</small></div>`
            : `<div style="height: 54px;"></div>`
        }
          <p style="text-decoration: underline; font-weight: bold; margin-bottom: 2px;">Forsman Dandel, S.Sos</p>
          <p style="margin: 0; font-size: 11px;">NIP. 197405201994031003</p>
        </div>
      </body>
    </html>
  `;
};

/**
 * Fungsi utama untuk mencetak surat langsung dari baris tabel dashboard mana pun.
 */
export const cetakDokumenLangsung = async (opsi: {
    suratMasuk?: SuratMasuk;
    suratKeluar?: SuratKeluar;
}): Promise<void> => {
    const { suratMasuk, suratKeluar } = opsi;

    // Tentukan URL file PDF dari surat masuk atau surat keluar
    let rawUrl: string | undefined;
    if (suratMasuk) {
        rawUrl =
            suratMasuk.file_url ||
            (suratMasuk.file_pdf && suratMasuk.file_pdf !== 'berkas_surat_masuk.pdf'
                ? `/uploads/surat_masuk/${encodeURIComponent(suratMasuk.file_pdf)}`
                : undefined);
    } else if (suratKeluar) {
        const daftarVersi = Array.isArray(suratKeluar.versi_file)
            ? suratKeluar.versi_file
            : [];
        const versiTerbaru =
            daftarVersi.length > 0 ? daftarVersi[daftarVersi.length - 1] : null;
        const namaFile = versiTerbaru?.nama_file;

        rawUrl =
            suratKeluar.file_url ||
            (namaFile && namaFile !== 'naskah_surat_keluar.pdf'
                ? `/uploads/surat_keluar/${encodeURIComponent(namaFile)}`
                : undefined);
    }

    const resolvedUrl = rawUrl
        ? rawUrl.startsWith('http://') ||
            rawUrl.startsWith('https://') ||
            rawUrl.startsWith('blob:')
            ? rawUrl
            : `${BACKEND_BASE_URL}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`
        : undefined;

    // Coba ambil file PDF asli dari server terlebih dahulu
    if (resolvedUrl) {
        try {
            const response = await fetch(resolvedUrl);
            if (response.ok) {
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                await jalankanIframePrint({ blobUrl });
                return;
            }
        } catch {
            // Jika file fisik belum tersedia di folder uploads, lanjut cetak naskah HTML resmi
        }
    }

    const htmlContent = buatHtmlNaskahResmi(suratMasuk, suratKeluar);
    await jalankanIframePrint({ htmlContent });
};