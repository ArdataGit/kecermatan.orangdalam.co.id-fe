import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HomeProps {
  setData: (data: Partial<HomeProps>) => void;
  section?: any[];
  user?: number;
  paketSaya?: number;
  paketTersedia?: number;
  riwayatPembelian?: number;
  soal?: number;
  event?: number;
  notifikasi?: any[];
}

export const useHomeStore = create<HomeProps>()(
  persist(
    (set) => ({
      setData: (props: Partial<HomeProps>) => {
        set({
          paketSaya: props.paketSaya,
          paketTersedia: props.paketTersedia,
          riwayatPembelian: props.riwayatPembelian,
          section: props.section,
          event: props.event,
          user: props.user,
          soal: props.soal,
          notifikasi: props.notifikasi,
        });
      },
    }),
    { name: 'homepage' }
  )
);

export const getAllState = () => useHomeStore.getState();
