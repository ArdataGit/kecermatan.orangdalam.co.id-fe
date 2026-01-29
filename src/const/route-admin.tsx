import { Route } from 'react-router-dom';

import ManageSoalParentCategory from '@/pages/admin/manage-soal-parent-category';
import ManageSoalCategory from '@/pages/admin/manage-soal-category';
import Dashboard from '@/pages/admin/dashboard';
import User from '@/pages/admin/users';
import Voucher from '@/pages/admin/vouchers';
import ManageSoal from '@/pages/admin/manage-soal';
import ManagePaket from '@/pages/admin/manage-paket';
import ManagePaketCategory from '@/pages/admin/manage-paket-category';
import ManagePaketLatihan from '@/pages/admin/manage-paket-latihan';
import ManageSoalPaketLatihan from '@/pages/admin/manage-paket-latihan-soal';
import ManagePaketPembelian from '@/pages/admin/manage-paket-pembelian';
import ManagePaketPembelianMateri from '@/pages/admin/manage-paket-pembelian-materi';
import ManagePaketPembelianBimbel from '@/pages/admin/manage-paket-pembelian-bimbel';
import ManagePaketPembelianFitur from '@/pages/admin/manage-paket-pembelian-fitur';
import ManagePaketPembelianTryout from '@/pages/admin/manage-paket-pembelian-tryout';
import Penjualan from '@/pages/admin/penjualan';
import ManageEvent from '@/pages/admin/event';
import ManageHomePage from '@/pages/admin/manage-home-section';
import RiwayatTryoutAdmin from '@/pages/admin/riwayat-tryout-admin';
import ManageNotification from '@/pages/admin/manage-notification';
import TicketIndex from '@/pages/admin/ticket';
import DashboardNotification from '@/pages/admin/notificationdash';
import Feedback from '@/pages/admin/feedback';
import Affiliate from '@/pages/admin/affiliate';
import AffiliateCommission from '@/pages/admin/affiliate-commission';
import RekapPenjualan from '@/pages/admin/rekap-penjualan';
import ManageSoalKecermatan from '@/pages/admin/manage-soal-kecermatan';
import ManageKiasan from '@/pages/admin/manage-soal-kecermatan/detail';
import ManageSoalKecermatanList from '@/pages/admin/manage-soal-kecermatan/soal';
import ManagePaketPembelianKecermatan from '@/pages/admin/manage-paket-pembelian-kecermatan';
import ManagePaketPembelianBacaan from '@/pages/admin/manage-paket-pembelian-bacaan';
import HistoryRankingKecermatanAdmin from '@/pages/admin/manage-soal-kecermatan/history-ranking';
import HistoryDetailKecermatanAdmin from '@/pages/admin/manage-soal-kecermatan/history-detail';
import ManageSoalBacaan from '@/pages/admin/manage-soal-bacaan';
import ManageBacaanDetail from '@/pages/admin/manage-soal-bacaan/detail';
import ManageSoalBacaanList from '@/pages/admin/manage-soal-bacaan/soal';
import HistoryRankingBacaanAdmin from '@/pages/admin/manage-soal-bacaan/history';
import HistoryDetailBacaanAdmin from '@/pages/admin/manage-soal-bacaan/history-detail';
import ManageSoalIsian from '@/pages/admin/manage-soal-isian';
import ManageIsianDetail from '@/pages/admin/manage-soal-isian/detail';
import ManagePaketPembelianIsian from '@/pages/admin/manage-paket-pembelian-isian';
import HistorySoalIsianAdmin from "@/pages/admin/manage-soal-isian/history";
import HistoryDetailIsianAdmin from "@/pages/admin/manage-soal-isian/history-detail";
import ManageLatihanKecermatan from "@/pages/admin/manage-latihan-kecermatan";
import HistoryLatihanKecermatanAdmin from "@/pages/admin/manage-latihan-kecermatan/history-ranking";
import HistoryDetailLatihanKecermatanAdmin from "@/pages/admin/manage-latihan-kecermatan/history-detail";

export const adminRoutes = [
  <Route path="/dashboard" element={<Dashboard />} />,
  <Route path="/rekap-penjualan" element={<RekapPenjualan />} />,
  <Route path="/manage-user" element={<User />} />,
  <Route path="/manage-penjualan" element={<Penjualan />} />,
  <Route path="/manage-soal-category" element={<ManageSoalParentCategory />} />,
  <Route
    path="/manage-soal-subcategory/:id"
    element={<ManageSoalCategory />}
  />,
  <Route path="/manage-event" element={<ManageEvent />} />,
  <Route path="/manage-soal/:id" element={<ManageSoal />} />,
  <Route path="/manage-voucher" element={<Voucher />} />,
  <Route path="/manage-paket" element={<ManagePaketCategory />} />,
  <Route path="/manage-paket/:id" element={<ManagePaket />} />,
  <Route path="/manage-latihan" element={<ManagePaketLatihan />} />,
  <Route path="/manage-latihan/:id" element={<ManageSoalPaketLatihan />} />,
  <Route path="/manage-pembelian" element={<ManagePaketPembelian />} />,
  <Route path="/manage-notifikasi" element={<ManageNotification />} />,
  <Route path="/manage-home-section" element={<ManageHomePage />} />,
  <Route path="/dashboard-notification" element={<DashboardNotification />} />,
  <Route path="/feedbacks" element={<Feedback />} />,
  <Route path="/affiliate" element={<Affiliate />} />,
  <Route path="/affiliate-commission" element={<AffiliateCommission />} />,
  <Route
    path="/manage-pembelian/:id/materi"
    element={<ManagePaketPembelianMateri />}
  />,
  <Route
    path="/manage-pembelian/:id/bimbel"
    element={<ManagePaketPembelianBimbel />}
  />,
  <Route
    path="/manage-pembelian/:id/fitur"
    element={<ManagePaketPembelianFitur />}
  />,
  <Route
    path="/manage-pembelian/:id/tryout"
    element={<ManagePaketPembelianTryout />}
  />,
  <Route
    path="/manage-pembelian/:id/kecermatan"
    element={<ManagePaketPembelianKecermatan />}
  />,
  <Route
    path="/manage-pembelian/:id/bacaan"
    element={<ManagePaketPembelianBacaan />}
  />,
    <Route
    path="/manage-pembelian/:id/isian"
    element={<ManagePaketPembelianIsian />}
  />,
  <Route
    path="/manage-pembelian/:id/tryout/:paketPembelianTryoutId/:latihanId"
    element={<RiwayatTryoutAdmin />}
  />,

  <Route path="/manage-ticket" element={<TicketIndex />} />,
  <Route path="/manage-soal-kecermatan" element={<ManageSoalKecermatan />} />,
  <Route path="/manage-soal-kecermatan/:id" element={<ManageKiasan />} />,
  <Route path="/manage-soal-kecermatan/:id/soal/:kiasanId" element={<ManageSoalKecermatanList />} />,
  <Route path="/manage-soal-kecermatan/:id/history" element={<HistoryRankingKecermatanAdmin />} />,
  <Route path="/manage-soal-kecermatan/:id/history/:userId" element={<HistoryDetailKecermatanAdmin />} />,
  <Route path="/manage-latihan-kecermatan" element={<ManageLatihanKecermatan />} />,
  <Route path="/manage-latihan-kecermatan/:id/history" element={<HistoryLatihanKecermatanAdmin />} />,
  <Route path="/manage-latihan-kecermatan/:id/history/:userId" element={<HistoryDetailLatihanKecermatanAdmin />} />,
  <Route path="/manage-soal-bacaan" element={<ManageSoalBacaan />} />,
  <Route path="/manage-soal-bacaan/:id" element={<ManageBacaanDetail />} />,
  <Route path="/manage-soal-bacaan/:id/soal/:bacaanId" element={<ManageSoalBacaanList />} />,
  <Route path="/manage-soal-bacaan/:id/history" element={<HistoryRankingBacaanAdmin />} />,
  <Route path="/manage-soal-bacaan/:id/history/:userId" element={<HistoryDetailBacaanAdmin />} />,
  
  <Route path="/manage-soal-isian" element={<ManageSoalIsian />} />,
  <Route path="/manage-soal-isian/:id" element={<ManageIsianDetail />} />,
  <Route
    path="/manage-soal-isian/:id/history"
    element={<HistorySoalIsianAdmin />}
  />,
  <Route
    path="/manage-soal-isian/:id/history/:userId"
    element={<HistoryDetailIsianAdmin />}
  />,
];
