import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HomeProps {
  setData: (data: []) => void;
  section?: [];
  users?: number;
  pembelian?: number;
  soal?: number;
  event?: number;
  notifikasi?: [];
}

export const useHomeStore = create<HomeProps>()(
  persist(
    (set) => ({
      setData: (props: any) => {
        set({
          users: props.users,
          pembelian: props.pembelian,
          soal: props.soal,
          section: props.section,
          event: props.event,
          notifikasi: props.notifikasi,
        });
      },
    }),
    { name: 'homepage' }
  )
);

export const getAllState = () => useHomeStore.getState();
