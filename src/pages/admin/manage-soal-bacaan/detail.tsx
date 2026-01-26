
import TableWrapper from '@/components/table';
import useGetList from '@/hooks/use-get-list';
import { IconPencil, IconPlus, IconTrash, IconList } from '@tabler/icons-react';
import { useState } from 'react';
import { Button, Popconfirm, Tooltip } from 'tdesign-react';
import BreadCrumb from '@/components/breadcrumb';
import { useParams, Link } from 'react-router-dom';
import FetchAPI from '@/utils/fetch-api';
import { deleteData } from '@/utils/axios';
import ManageBacaanModal from './manage-bacaan-modal';

enum AlignType {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}

export default function ManageBacaanDetail() {
  const { id } = useParams();
  const [visible, setVisible] = useState(false);
  const [detail, setDetail] = useState({});

  const getData = useGetList({
    url: 'admin/bacaan/get',
    initialParams: {
      skip: 0,
      take: 10,
      sortBy: 'createdAt',
      descending: true,
      kategoriSoalBacaanId: Number(id),
    },
  });

  const handleDeleted = async (id: number) => {
    FetchAPI(deleteData(`admin/bacaan/remove/${id}`)).then(() => {
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
      title: 'Bacaan',
      colKey: 'bacaan',
      cell: ({ row }: any) => {
        return (
          <div className="line-clamp-3">
             {row.bacaan}
          </div>
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
            <Tooltip content="Manage Soal">
              <Link to={`/manage-soal-bacaan/${id}/soal/${row.id}`}>
                <Button shape="circle" variant="outline" theme="primary">
                  <IconList size={14} />
                </Button>
              </Link>
            </Tooltip>
            
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
        <ManageBacaanModal
          setDetail={setDetail}
          params={getData}
          setVisible={setVisible}
          detail={detail}
          categoryId={Number(id)}
        />
      )}
      <BreadCrumb
        page={[
          { name: 'Bank Soal Bacaan', link: '/manage-soal-bacaan' },
          { name: 'Manage Bacaan', link: '#' },
        ]}
      />
      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-2xl text-indigo-950 font-bold mb-5 ">
              Manage Bacaan
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
