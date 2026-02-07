import TableWrapper from '@/components/table';
import useGetList from '@/hooks/use-get-list';
import {
  IconAlertCircleFilled,
  IconApps,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconCreditCardPay,
} from '@tabler/icons-react';
import { Button, Popup, Tag } from 'tdesign-react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';

enum FilterType {
  Input = 'input',
}

enum AlignType {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}

const statusNameListMap = {
  PAID: {
    label: 'Berhasil',
    theme: 'warning',
    icon: <IconCircleCheckFilled />,
  },
  GAGAL: { label: 'Gagal', theme: 'danger', icon: <IconCircleXFilled /> },
  UNPAID: {
    label: 'Menunggu Pembayaran',
    theme: 'warning',
    icon: <IconAlertCircleFilled />,
  },
};

export default function RiwayatPembelianPage() {
  const navigate = useNavigate();

  /** Ambil data via hook */
  const getData = useGetList({
    url: 'pembelian/user/get', // API GET BY USER
    initialParams: {
      skip: 0,
      take: 10,
      sortBy: 'createdAt',
      descending: true,
    },
  });

  /** Kolom tabel */
  const columns = [
    {
      colKey: 'index',
      title: '#',
      width: 60,
      cell: (row: any) => {
        return <span>{row.rowIndex + 1 + getData.params.skip}</span>;
      },
    },
    {
      title: 'Nama Paket',
      colKey: 'namaPaket',
      align: AlignType.Center,
      filter: {
        type: FilterType.Input,
        resetValue: '',
        confirmEvents: ['onEnter'],
        props: { placeholder: 'Cari Paket' },
        showConfirmAndReset: true,
      },
      cell: ({ row }: any) => (
        <div className="text-center font-medium">{row.namaPaket}</div>
      ),
    },
    {
      title: 'Status',
      colKey: 'status',
      align: AlignType.Center,
      cell: ({ row }: any) => (
        <Tag
          shape="round"
          theme={statusNameListMap[row.status]?.theme || 'danger'}
          variant="light-outline"
          icon={statusNameListMap[row.status]?.icon}
        >
          {statusNameListMap[row.status]?.label || row.status}
        </Tag>
      ),
    },
    {
      title: 'Durasi',
      colKey: 'duration',
      sorter: true,
      align: AlignType.Center,
      cell: ({ row }: any) => {
        const daysLeft = moment(row.expiredAt).diff(moment(), 'days');
        return (
          <p className="text-center">
            {row.duration ? `${row.duration} Bulan` : 'Seumur Hidup'}
            {row.paidAt &&
              (daysLeft < 0 ? (
                <span className="block text-red-500 text-xs">Sudah Berakhir</span>
              ) : (
                <span className="block text-[#F97316] text-xs">
                  Tersisa: {daysLeft} Hari
                </span>
              ))}
          </p>
        );
      },
    },
    {
      title: 'Tanggal Pembelian',
      colKey: 'createdAt',
      sorter: true,
      align: AlignType.Center,
      cell: ({ row }: any) => (
        <span>{moment(row.createdAt).format('DD/MM/YYYY')}</span>
      ),
    },
    {
      title: 'Action',
      colKey: 'action',
      align: AlignType.Center,
      width: 160,
      cell: ({ row }: any) => {
        return (
          <div className="flex justify-center gap-5">
            {/* Tombol Bayar */}
            <Popup content="Bayar Sekarang" trigger="hover">
              <Button
                disabled={row.status !== 'UNPAID' || !row.paymentUrl}
                shape="circle"
                theme="primary"
                variant="outline"
                onClick={() => window.open(row.paymentUrl, '_blank')}
              >
                <IconCreditCardPay size={14} />
              </Button>
            </Popup>

            {/* Tombol Akses Kelas */}
            <Popup content="Akses Kelas" trigger="hover">
              <Button
                disabled={row.status !== 'PAID'}
                shape="circle"
                theme="primary"
                onClick={() => navigate('/my-class')}
              >
                <IconApps size={14} />
              </Button>
            </Popup>
          </div>
        );
      },
    },
  ];

  return (
    <section>
      <BreadCrumb
        page={[
          { name: 'Paket Pembelian', link: '/paket-pembelian' },
          { name: 'Riwayat Pembelian', link: '/paket-pembelian/riwayat' },
        ]}
      />

      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-between header-section">
          <h1 className="text-2xl text-indigo-950 font-bold">Riwayat Pembelian</h1>
        </div>

        {/* COMPONENT TABEL */}
        <TableWrapper data={getData} columns={columns} />
      </div>
    </section>
  );
}
