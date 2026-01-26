
import TableWrapper from '@/components/table';
import useGetList from '@/hooks/use-get-list';
import { useParams } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';
import moment from 'moment';

enum AlignType {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}

import { useNavigate } from 'react-router-dom';
import { Button, Tooltip } from 'tdesign-react';
import { IconEye } from '@tabler/icons-react';

export default function HistorySoalIsianAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const getData = useGetList({
    url: 'admin/kategori-soal-isian/history',
    initialParams: {
      kategoriSoalIsianId: id,
      skip: 0,
      take: 10,
      sortBy: 'createdAt',
      descending: true,
      search: '',
    },
  });

  const columns = [
    {
      title: '#',
      colKey: 'index',
      width: 60,
      cell: ({ rowIndex }: any) => {
        return <span>{rowIndex + 1 * getData.params.skip + 1}</span>;
      },
    },
    {
      title: 'User',
      colKey: 'user',
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-3">
             <img src={row.user?.gambar || 'https://ui-avatars.com/api/?name=' + row.user?.name} className="w-8 h-8 rounded-full" />
             <div>
                <div className="font-bold">{row.user?.name}</div>
                <div className="text-xs text-gray-500">{row.user?.email}</div>
             </div>
          </div>
        );
      },
    },
    {
        title: 'Total Soal Dijawab',
        colKey: 'totalSoal',
        align: AlignType.Center,
        width: 150,
        cell: ({ row }: any) => <span className="font-bold text-lg text-indigo-600">{row.totalSoal}</span>,

    },
    {
        title: 'Total Skor',
        colKey: 'totalScore',
        align: AlignType.Center,
        width: 150,
        cell: ({ row }: any) => <span className="font-bold text-lg text-green-600">{row.totalScore}</span>,
    },
    {
      title: 'Waktu Pengerjaan Terakhir',
      colKey: 'createdAt',
      width: 200,
      align: AlignType.Center,
      sorter: false,
      cell: ({ row }: any) => {
        return <span>{moment(row.createdAt).format('DD/MM/YYYY HH:mm')}</span>;
      },
    },
    {
        title: 'Action',
        colKey: 'action',
        align: AlignType.Center,
        width: 100,
        cell: ({ row }: any) => (
            <Tooltip content="Lihat Detail Pengerjaan">
                <Button shape="circle" theme="primary" variant="text" onClick={() => navigate(`/manage-soal-isian/${id}/history/${row.user?.id || row.userId}`)}>
                    <IconEye size={18} />
                </Button>
            </Tooltip>
        )
    }
  ];

  return (
    <section className="">
      <BreadCrumb
        page={[
            { name: 'Bank Soal Isian', link: '/manage-soal-isian' },
            { name: 'Riwayat Pengerjaan', link: '#' }
        ]}
      />
      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full mb-6">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-2xl text-indigo-950 font-bold mb-5 ">
              Riwayat Pengerjaan (ID Kategori: {id})
            </h1>
          </div>
        </div>
        <TableWrapper data={getData} columns={columns} />
      </div>
    </section>
  );
}
