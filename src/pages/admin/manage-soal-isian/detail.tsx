
import TableWrapper from '@/components/table';
import useGetList from '@/hooks/use-get-list';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { Button, Popconfirm } from 'tdesign-react';
import BreadCrumb from '@/components/breadcrumb';
import { useParams } from 'react-router-dom';
import FetchAPI from '@/utils/fetch-api';
import { deleteData } from '@/utils/axios';
import ManageSoalIsianModal from './soal/manage';

enum AlignType {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}

export default function ManageIsianDetail() {
  const { id } = useParams();
  const [visible, setVisible] = useState(false);
  const [detail, setDetail] = useState({});

  const getData = useGetList({
    // Using the soal-isian/get endpoint which filters by kategoriSoalIsianId
    url: 'admin/soal-isian/get',
    initialParams: {
      skip: 0,
      take: 10,
      sortBy: 'createdAt',
      descending: true,
      kategoriSoalIsianId: Number(id),
    },
  });

  const handleDeleted = async (id: number) => {
    FetchAPI(deleteData(`admin/soal-isian/remove/${id}`)).then(() => {
      getData.refresh();
    });
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
      title: 'Soal',
      colKey: 'soal',
      cell: ({ row }: any) => {
        return (
          <div className="line-clamp-3">
             {row.soal}
          </div>
        );
      },
    },
    {
      title: 'Jawaban',
      colKey: 'jawaban',
      width: 100,
      align: AlignType.Center,
      cell: ({ row }: any) => {
        return (
          <span className={`px-2 py-1 rounded text-white ${row.jawaban === 'Ya' ? 'bg-green-500' : 'bg-red-500'}`}>
             {row.jawaban}
          </span>
        );
      },
    },
    {
      title: 'Action',
      align: AlignType.Center,
      width: 150,
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

            <Popconfirm
              content="Apakah kamu yakin ?"
              theme="danger"
              onConfirm={() => handleDeleted(row.id)}
            >
              <Button shape="circle" theme="danger">
                <IconTrash size={14} />
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <section className="">
      {visible && (
        <ManageSoalIsianModal
          setDetail={setDetail}
          params={getData}
          setVisible={setVisible}
          detail={detail}
          categoryId={Number(id)}
        />
      )}
      <BreadCrumb
        page={[
          { name: 'Bank Soal Isian', link: '/manage-soal-isian' },
          { name: 'Manage Soal', link: '#' },
        ]}
      />
      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-2xl text-indigo-950 font-bold mb-5 ">
              Manage Soal
            </h1>
            <Button
              theme="default"
              size="large"
              className="border-success hover:bg-success hover:text-white group"
              onClick={() => {
                  setDetail({})
                  setVisible(true)
              }}
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
