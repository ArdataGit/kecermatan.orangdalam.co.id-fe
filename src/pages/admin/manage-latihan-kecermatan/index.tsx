import TableWrapper from '@/components/table';
import useGetList from '@/hooks/use-get-list';
import { IconPencil, IconPlus, IconTrash, IconHistory } from '@tabler/icons-react';
import { useState } from 'react';
import { Button, Popconfirm } from 'tdesign-react';
import ManageLatihanKecermatanModal from './manage';
import FetchAPI from '@/utils/fetch-api';
import { deleteData } from '@/utils/axios';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';
import { formatDateWithTimezone } from '@/utils/date-format';

enum FilterType {
  Input = 'input',
}

enum AlignType {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}

export default function ManageLatihanKecermatan() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [detail, setDetail] = useState({});

  const getData = useGetList({
    url: 'kategori-latihan-kecermatan/get',
    initialParams: {
      skip: 0,
      take: 10,
      sortBy: 'createdAt',
      descending: true,
    },
  });

  const handleDeleted = async (id: number) => {
    FetchAPI(deleteData(`kategori-latihan-kecermatan/remove/${id}`)).then(
      () => {
        getData.refresh();
      }
    );
  };

  const columns = [
    {
      colKey: 'applicant',
      title: '#',
      width: 60,
      cell: (row: any) => {
        return <span>{row.rowIndex + 1 * getData.params.skip + 1}</span>;
      },
    },
    {
      title: 'Pembuat',
      colKey: 'user.name',
      width: 150,
      cell: ({ row }: any) => {
        return <span className="text-gray-900 font-medium">{row?.user?.name || '-'}</span>;
      },
    },

    {
      title: 'Judul Kategori',
      colKey: 'judul_kategori',

      filter: {
        type: FilterType.Input,
        resetValue: '',
        confirmEvents: ['onEnter'],
        props: { placeholder: 'Input Judul' },
        showConfirmAndReset: true,
      },
      cell: ({ row }: any) => {
        return (
          // Link disabled for now or point to detail if it exists. 
          // For now, let's keep it as text or link to self to avoid 404
           <span className="text-gray-900 font-medium">
             {row.judul_kategori}
           </span>
        );
      },
    },

    {
      title: 'Keterangan',
      colKey: 'keterangan',
      width: 250,
      align: AlignType.Left,
      cell: ({ row }: any) => {
        return <span className="line-clamp-2">{row.keterangan || '-'}</span>;
      },
    },

    {
      colKey: 'kiasan_count',
      title: 'Jumlah Kiasan',
      width: 120,
      align: AlignType.Center,

      cell: ({ row }: any) => {
        return <span>{row?._count?.latihanKiasan || 0}</span>;
        // Backend controller 'get' includes _count: { Kiasan: true }, but standard Prisma naming is lowerCamelCase usually 'latihanKiasan'
        // Schema has 'latihanKiasan' relation.
        // Controller lines 34: select: { Kiasan: true }. Wait.
        // Schema: latihanKiasan latihanKiasan[]
        // Controller code used 'Kiasan: true'. I suspect a typo in backend controller if relation name is 'latihanKiasan'.
        // But let's check what schema says.
        // Schema lines 843: latihanKiasan latihanKiasan[]
        // So relation name is 'latihanKiasan'.
        // Controller line 34 should be 'latihanKiasan: true'.
        // I should fix backend controller as well if it's broken.
      },
    },
    {
      title: 'Tanggal Dibuat',
      colKey: 'createdAt',
      width: 150,
      align: AlignType.Center,
      sorter: true,
      cell: ({ row }: any) => {
        return <span>{formatDateWithTimezone(row.createdAt, 'DD/MM/YYYY')}</span>;
      },
    },
    {
      title: 'Action',
      align: AlignType.Center,
      width: 180,
      colKey: 'action',
      cell: ({ row }: any) => {
        return (
          <div className="flex justify-center gap-5">
            <Button
              shape="circle"
              theme="default"
              onClick={() => {
                setVisible(true);
                setDetail(() => ({
                  ...row,
                }));
              }}
            >
              <IconPencil size={14} />
            </Button>
            <Button
              shape="circle"
              theme="default"
              className="ml-2"
              onClick={() => {
                navigate(`/manage-latihan-kecermatan/${row.id}/history`);
              }}
            >
              <IconHistory size={14} />
            </Button>
            <Popconfirm
              content="Apakah kamu yakin ?"
              theme="danger"
              onConfirm={() => handleDeleted(row.id)}
            >
              <Button shape="circle" theme="danger">
                <IconTrash size={14} />
              </Button>{' '}
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  return (
    <section className="">
      {visible && (
        <ManageLatihanKecermatanModal
          setDetail={setDetail}
          params={getData}
          setVisible={setVisible}
          detail={detail}
        />
      )}
      <BreadCrumb
        page={[{ name: 'Latihan Kecermatan', link: '/manage-latihan-kecermatan' }]}
      />
      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-2xl text-indigo-950 font-bold mb-5 ">
              Manage Latihan Kecermatan
            </h1>
            <Button
              theme="default"
              size="large"
              className="border-success hover:bg-success hover:text-white group"
              onClick={() => setVisible(true)}
            >
              <IconPlus
                size={20}
                className="text-success group-hover:text-white"
              />
            </Button>
          </div>
        </div>
        <TableWrapper data={getData} columns={columns} />
      </div>
    </section>
  );
}
