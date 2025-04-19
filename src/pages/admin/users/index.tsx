import TableWrapper from '@/components/table';
import useGetList from '@/hooks/use-get-list';
import {
  IconFileSpreadsheet,
  IconPencil,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import moment from 'moment';
import { useState } from 'react';
import { Button, Popconfirm } from 'tdesign-react';
// import FetchAPI from '@/utils/fetch-api';
// import { deleteData } from '@/utils/axios';
import BreadCrumb from '@/components/breadcrumb';
import ManageUser from './manage';
import { deleteData, getExcel } from '@/utils/axios';
import FetchAPI from '@/utils/fetch-api';

enum FilterType {
  Input = 'input',
}
enum AlignType {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}

export default function UserIndex() {
  const [visible, setVisible] = useState(false);
  const [detail, setDetail] = useState({});

  const dataUser = useGetList({
    url: 'admin/users/get',
    initialParams: {
      skip: 0,
      take: 10,
    },
  });
  const handleDeleted = async (id: number) => {
    FetchAPI(deleteData(`admin/users/remove/${id}`)).then(() => {
      dataUser.refresh();
    });
  };
  const handleExportExcel = async () => {
    await getExcel('admin/users/excel', 'users');
  };

  const columns = [
    {
      colKey: 'applicant',
      title: '#',
      width: 60,
      cell: (row: any) => {
        return <span>{row.rowIndex + 1 * dataUser.params.skip + 1}</span>;
      },
    },
    {
      title: 'Name',
      colKey: 'name',
      filter: {
        type: FilterType.Input,
        resetValue: '',
        confirmEvents: ['onEnter'],
        props: { placeholder: 'Input Name' },
        showConfirmAndReset: true,
      },
    },
    {
      title: 'Email',
      colKey: 'email',
      filter: {
        type: FilterType.Input, // Using the enum here
        resetValue: '',
        confirmEvents: ['onEnter'],
        props: { placeholder: 'Input Email' },
        showConfirmAndReset: true,
      },
    },
    {
      title: 'Nomor Whatsapp',
      colKey: 'noWA',
      filter: {
        type: FilterType.Input, // Using the enum here
        resetValue: '',
        confirmEvents: ['onEnter'],
        props: { placeholder: 'Input noWA' },
        showConfirmAndReset: true,
      },
    },
    {
      title: 'Domisili Kota',
      colKey: 'kabupaten',
      filter: {
        type: FilterType.Input, // Using the enum here
        resetValue: '',
        confirmEvents: ['onEnter'],
        props: { placeholder: 'Input noWA' },
        showConfirmAndReset: true,
      },
    },
    {
      title: 'Created At',
      colKey: 'created_at',
      sorter: true,
      cell: ({ row }: any) => {
        return <span>{moment(row.createdAt).format('DD/MM/YYYY')}</span>;
      },
    },
    {
      title: 'Action',
      align: AlignType.Center,
      colKey: 'action',
      cell: ({ row }: any) => {
        return (
          <div className="flex justify-center gap-5">
            <Button
              shape="circle"
              theme="default"
              onClick={() => {
                setDetail(() => ({
                  ...row,
                  password: '',
                }));
                setVisible(true);
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
        <ManageUser
          setDetail={setDetail}
          params={dataUser}
          setVisible={setVisible}
          detail={detail}
        />
      )}
      <BreadCrumb
        page={[{ name: 'Manage Voucher', link: '/manage-voucher' }]}
      />
      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-2xl text-indigo-950 font-bold mb-5 ">
              Manage User
            </h1>
            <div className="flex gap-3">
              <Button
                theme="primary"
                size="large"
                variant="dashed"
                onClick={handleExportExcel}
                className="hover:shadow-xl"
              >
                <IconFileSpreadsheet size={20} className="" />
              </Button>
              <Button
                theme="default"
                size="large"
                className="border-success hover:bg-success hover:text-white group hover:shadow-xl"
                onClick={() => setVisible(true)}
              >
                <IconPlus
                  size={20}
                  className="text-success group-hover:text-white"
                />
              </Button>
            </div>
          </div>
        </div>
        <TableWrapper data={dataUser} columns={columns} />
      </div>
    </section>
  );
}
