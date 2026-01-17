import {
  IconBuildingStore,
  IconCalendarEvent,
  IconHome2,
  IconTicket,
  IconBrandCashapp,
  IconEye
} from '@tabler/icons-react';

const menuList = [
  {
    title: 'Home',
    pages: [
      {
        icon: <IconHome2 />,
        title: 'Home',
        link: '/',
      },
      // {
      //   icon: <IconEye />,
      //   title: 'Soal Kecermatan',
      //   link: '/soal-kecermatan',
      // },

      {
        icon: <IconBuildingStore />,
        title: 'Paket Pembelian',
        link: '/paket-pembelian',
        count: 'pembelian',
      },
	  {
        link: '/my-tickets',
        title: 'My Tickets',
        icon: <IconTicket size={20} />,
      },
      // {
      //   icon: <IconBrandTrello />,
      //   title: 'Kelas saya',
      //   link: '/my-class',
      // },
      {
        icon: <IconCalendarEvent />,
        title: 'Event',
        link: '/event',
        count: 'event',
      },      {
        icon: <IconBrandCashapp />,
        title: 'Riwayat Pembelian',
        link: '/paket-pembelian/riwayat',
        //count: 'event',
      },
    ],
  },
];

export default menuList;
