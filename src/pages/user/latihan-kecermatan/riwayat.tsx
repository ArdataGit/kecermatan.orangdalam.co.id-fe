import { useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';
import TableWrapper from '@/components/table';
import useGetList from '@/hooks/use-get-list';
import { Button } from 'tdesign-react';
import { IconEye } from '@tabler/icons-react';
import { useAuthStore } from '@/stores/auth-store';
import { formatDateWithTimezone } from '@/utils/date-format';

export default function RiwayatLatihanKecermatan() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const getData = useGetList({
    // Using generic get endpoint. It might need adjustment if backend has specific user endpoint
    url: 'kategori-latihan-kecermatan/get', 
    initialParams: {
      skip: 0,
      take: 10,
      sortBy: 'createdAt',
      descending: true,
      userId: user?.id
    },
  });

  const columns = [
    {
      title: '#',
      colKey: 'index',
      width: 60,
      cell: ({ rowIndex }: any) => <span>{rowIndex + 1 * getData.params.skip + 1}</span>,
    },
    {
      title: 'Judul',
      colKey: 'judul_kategori',
    },
    {
      title: 'Tanggal',
      colKey: 'createdAt',
      cell: ({ row }: any) => formatDateWithTimezone(row.createdAt),
    },
    {
        title: 'Action',
        colKey: 'action',
        width: 100,
        cell: ({ row }: any) => (
             <Button shape="circle" theme="warning" variant="text" onClick={() => navigate(`/latihan-kecermatan/riwayat/${row.id}`)}>
                 <IconEye size={18} />
             </Button>
        )
    }
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-['Poppins']">
      <BreadCrumb
        page={[
          { name: 'Latihan Kecermatan', link: '/latihan-kecermatan' },
          { name: 'Riwayat', link: '#' },
        ]}
      />
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
         <h1 className="text-xl font-bold mb-4">Riwayat Latihan Mandiri</h1>
         <TableWrapper data={getData} columns={columns} />
      </div>
    </div>
  );
}
