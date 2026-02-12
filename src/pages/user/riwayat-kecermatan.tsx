
import useGetList from '@/hooks/use-get-list';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';
import { getData } from '@/utils/axios';
import moment from 'moment/min/moment-with-locales';
import TableWrapper from '@/components/table';
import { Button, Tooltip } from 'tdesign-react';
import { IconEye } from '@tabler/icons-react';

enum AlignType {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}

export default function RiwayatKecermatan() {
  const { id, kategoriId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>({});

  const listHistory = useGetList({
    // Updated endpoint to get grouping/rankings
    url: 'user/paket-pembelian-kecermatan/history-list',
    initialParams: {
      kategoriSoalKecermatanId: kategoriId,
      skip: 0,
      take: 10,
      sortBy: 'createdAt',
      descending: true,
    },
  });

  useEffect(() => {
    getDetailClass();
  }, []);

  const getDetailClass = async () => {
    await getData(`user/find-my-class/${id}`).then((res) => {
      if (res.error) return; 
      setData({ ...res });
    });
  };

  const columns = [
    {
      title: '#',
      colKey: 'index',
      width: 60,
      cell: ({ rowIndex }: any) => {
        return <span>{rowIndex + 1 * listHistory.params.skip + 1}</span>;
      },
    },
    {
      title: 'Score',
      colKey: 'score',
      align: AlignType.Center,
      width: 100,
      sorter: true,
      cell: ({ row }: any) => <span className="font-bold text-lg text-indigo-600">{row.score}</span>,
    },
    {
        title: 'Total Soal',
        colKey: 'totalSoal',
        align: AlignType.Center,
        width: 100,
    },
    {
        title: 'Benar',
        colKey: 'totalBenar',
        align: AlignType.Center,
        width: 100,
        cell: ({ row }: any) => <span className="text-[#ffb22c] font-bold">{row.totalBenar}</span>,
    },
    {
        title: 'Salah',
        colKey: 'totalSalah',
        align: AlignType.Center,
        width: 100,
        cell: ({ row }: any) => <span className="text-red-500 font-bold">{row.totalSalah}</span>,
    },
    {
      title: 'Waktu Pengerjaan',
      colKey: 'createdAt',
      width: 200,
      align: AlignType.Center,
      sorter: true,
      cell: ({ row }: any) => {
        return <span>{moment(row.createdAt).locale('id').format('LL HH:mm')}</span>;
      },
    },
    {
        title: 'Action',
        colKey: 'action',
        align: AlignType.Center,
        width: 100,
        cell: () => (
            <Tooltip content="Lihat Detail Pengerjaan">
                <Button shape="circle" theme="primary" variant="text" onClick={() => navigate(`/my-class/${id}/kecermatan/${kategoriId}/riwayat/detail`)}>
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
          { name: 'Paket saya', link: '/my-class' },
          {
            name: data?.paketPembelian?.nama || 'Nama Kelas',
            link: '/my-class',
          },
          { name: 'Kecermatan', link: `/my-class/${id}/kecermatan` },
          { name: 'Riwayat', link: '#' },
        ]}
      />

      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full mt-2 mb-6">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-xl text-indigo-950 font-bold mb-5 ">
              Riwayat Pengerjaan Kecermatan (Kategori ID: {kategoriId})
            </h1>
          </div>
        </div>
        
        <TableWrapper data={listHistory} columns={columns} />
      </div>
    </section>
  );
}
