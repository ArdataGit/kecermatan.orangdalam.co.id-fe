import { Route } from 'react-router-dom';

// import Empty from '@/pages/empty';
import Langganan from '@/pages/user/paket-pembelian';
import RiwayatLangganan from '@/pages/user/riwayat-langganan';
import MyLangganan from '@/pages/user/my-class';
import HomeUser from '@/pages/user/home';
import Profile from '@/pages/profile';
import Bimbel from '@/pages/user/bimbel';
import Event from '@/pages/user/event';
import Materi from '@/pages/user/materi';
import ListTryout from '@/pages/user/list-tryout';
import Tryout from '@/pages/user/tryout';
import RiwayatTryout from '@/pages/user/riwayat-tryout';
import Empty from './empty';
import PembahasanTryout from '@/pages/user/pembahasan-tryout';
import StatisticTryout from '@/pages/user/statistic-tryout';
import Ranking from '@/pages/user/ranking';
import EventDetail from '@/pages/user/event-detail';

export const userRoutes = [
  <Route path="/" element={<HomeUser />} />,
  <Route path="/profile" element={<Profile />} />,
  <Route path="/tryout-massal" element={<Empty />} />,
  <Route path="/event" element={<Event />} />,
  <Route path="/event/detail/:id" element={<EventDetail />} />,
  <Route path="/paket-pembelian" element={<Langganan />} />,
  <Route path="/paket-pembelian/riwayat" element={<RiwayatLangganan />} />,
  <Route
    path="/my-class/:id/tryout/:paketFK/:paketId/riwayat"
    element={<RiwayatTryout isBimbel={false} />}
  />,
  <Route
    path="/my-class/:id/bimbel/mini-test/:paketFK/:paketId/riwayat"
    element={<RiwayatTryout isBimbel />}
  />,
  <Route
    path="/my-class/:id/tryout/:paketFK/:paketId/ranking"
    element={<Ranking />}
  />,
  <Route
    path="/my-class/:id/bimbel/mini-test/:paketFK/:paketId/ranking"
    element={<Ranking isBimbel />}
  />,
  <Route path="/my-class/:id/materi" element={<Materi />} />,
  <Route path="/my-class/:id/bimbel" element={<Bimbel />} />,

  <Route path="/my-class/:id/tryout" element={<ListTryout />} />,
  <Route
    path="/my-class/:id/tryout/:paketFK/:paketId"
    element={<Tryout isBimbel={false} />}
  />,
  <Route
    path="/my-class/:id/tryout/:paketFK/:paketId/:tryoutId"
    element={<Tryout isBimbel={false} />}
  />,

  <Route
    path="/my-class/:id/bimbel/mini-test/:paketFK/:paketId"
    element={<Tryout isBimbel />}
  />,
  <Route
    path="/my-class/:id/bimbel/mini-test/:paketFK/:paketId/:tryoutId"
    element={<Tryout isBimbel />}
  />,

  <Route
    path="/my-class/:id/tryout/:paketFK/:paketId/:tryoutId/pembahasan"
    element={<PembahasanTryout />}
  />,

  <Route
    path="/my-class/:id/mini-test/:paketFK/:paketId/:tryoutId/pembahasan"
    element={<PembahasanTryout />}
  />,
  <Route
    path="/my-class/:id/tryout/:paketFK/:paketId/:tryoutId/statistik"
    element={<StatisticTryout />}
  />,
  <Route
    path="/my-class/:id/bimbel/mini-test/:paketFK/:paketId/:tryoutId/statistik"
    element={<StatisticTryout isBimbel />}
  />,

  <Route path="/my-class" element={<MyLangganan />} />,
];
