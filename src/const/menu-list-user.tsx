import {
  IconBuildingStore,
  IconCalendarEvent,
  IconHome2,
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

      {
        icon: <IconBuildingStore />,
        title: 'Paket Pembelian',
        link: '/paket-pembelian',
        count: 'pembelian',
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
      },
    ],
  },
];

export default menuList;
