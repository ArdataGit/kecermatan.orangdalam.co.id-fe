
import useGetList from '@/hooks/use-get-list';
import { useParams, useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';
import moment from 'moment/min/moment-with-locales';
import { IconEye } from '@tabler/icons-react';
import { Button, Tooltip } from 'tdesign-react';
import TableWrapper from '@/components/table';
import { useState, useEffect } from 'react';
import { getData } from '@/utils/axios';

enum AlignType {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}

export default function RiwayatIsianUser() {
  const { id, kategoriId } = useParams();
  const navigate = useNavigate();
  const [paketData, setPaketData] = useState<any>({});

  const listHistory = useGetList({
    url: 'user/history-isian/sessions',
    initialParams: {
      kategoriSoalIsianId: kategoriId,
      skip: 0,
      take: 10,
    },
  });

  useEffect(() => {
    getData(`user/find-my-class/${id}`).then((res) => {
        if (!res.error) {
            setPaketData(res.paketPembelian || {});
        }
    });
  }, [id]);

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
        cell: ({ row }: any) => <span className="font-bold text-lg text-[#F97316]">{row.totalScore}</span>,
    },
    {
      title: 'Waktu Pengerjaan',
      colKey: 'createdAt',
      width: 200,
      align: AlignType.Center,
      sorter: false,
      cell: ({ row }: any) => {
        return <span>{moment(row.createdAt).locale('id').format('LL HH:mm')}</span>;
      },
    },
    {
        title: 'Aksi',
        colKey: 'action',
        align: AlignType.Center,
        width: 100,
        cell: ({ row }: any) => (
            <Tooltip content="Lihat Detail Sesi">
                <Button shape="circle" theme="primary" variant="text" onClick={() => navigate(`/my-class/${id}/isian/${kategoriId}/riwayat/${row.isianHistoryId}`)}>
                    <IconEye size={18} />
                </Button>
            </Tooltip>
        )
    }
  ];

  return (
    <div className="section-container">
      <BreadCrumb
        page={[
          { name: 'Paket saya', link: '/my-class' },
          { name: paketData.nama || 'Nama Kelas', link: '/my-class' },
          { name: 'Isian', link: `/my-class/${id}/isian` },
          { name: 'Riwayat Pengerjaan', link: '#' },
        ]}
      />

      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full mt-2 mb-6">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-xl text-indigo-950 font-bold mb-5 ">
              Daftar Riwayat Pengerjaan
            </h1>
          </div>
        </div>
        
        <TableWrapper data={listHistory} columns={columns} />
      </div>
    </div>
  );
}
