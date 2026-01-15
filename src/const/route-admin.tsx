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
    path="/manage-pembelian/:id/tryout/:paketPembelianTryoutId/:latihanId"
    element={<RiwayatTryoutAdmin />}
  />,

  <Route path="/manage-ticket" element={<TicketIndex />} />,
];
