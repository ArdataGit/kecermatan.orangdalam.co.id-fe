import {
  IconBell,
  IconCalendarEvent,
  IconClipboardData,
  IconCreditCardPay,
  IconDeviceAnalytics,
  IconDiscount2,
  IconIcons,
  IconTicket,
  IconNotebook,
  IconReportMoney,
  IconInfoCircle,
  IconEye
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
      {
        link: '/dashboard-notification',
        title: 'Dashboard Notification',
        icon: <IconBell size={20} />,
      },
      {
        link: '/feedbacks',
        title: 'Feedback User',
        icon: <IconInfoCircle size={20} />,
      },
      {
        link: '/manage-ticket',
        title: 'Manage Ticket',
        icon: <IconTicket size={20} />,
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
      // {
      //   icon: <IconEye />,
      //   title: 'Bank Soal Kecermatan',
      //   link: '/manage-soal-kecermatan',
      // },
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
        icon: <IconReportMoney />,
        title: 'Rekap Penjualan',
        link: '/rekap-penjualan',
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
