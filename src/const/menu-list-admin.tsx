import {
  IconBell,
  IconCalendarEvent,
  IconClipboardData,
  IconCreditCardPay,
  IconDeviceAnalytics,
  IconDiscount2,
  IconIcons,
  IconNotebook,
  IconReportMoney,
} from '@tabler/icons-react';

const menuList = [
  {
    title: 'Main',
    pages: [
      {
        icon: <IconDeviceAnalytics />,
        title: 'Dashboard',
        link: '/dashboard',
      },
      {
        icon: <IconIcons />,
        title: 'Home Page',
        link: '/manage-home-section',
      },
    ],
  },
  {
    title: 'Master',
    pages: [
      {
        icon: <IconNotebook />,
        title: 'Bank Soal',
        link: '/manage-soal-category',
      },
      {
        icon: <IconClipboardData />,
        title: 'Paket Latihan',
        link: '/manage-latihan',
      },
      {
        icon: <IconCreditCardPay />,
        title: 'Paket Pembelian',
        link: '/manage-pembelian',
      },
      {
        icon: <IconDiscount2 />,
        title: 'Voucher',
        link: '/manage-voucher',
      },
    ],
  },

  {
    title: 'Lainnya',
    pages: [
      {
        icon: <IconBell />,
        title: 'Notifikasi',
        link: '/manage-notifikasi',
      },
      {
        icon: <IconReportMoney />,
        title: 'Penjualan',
        link: '/manage-penjualan',
      },
      {
        icon: <IconCalendarEvent />,
        title: 'Event',
        link: '/manage-event',
      },
      {
        icon: <IconDeviceAnalytics />,
        title: 'User',
        link: '/manage-user',
      },
    ],
  },
];

export default menuList;
