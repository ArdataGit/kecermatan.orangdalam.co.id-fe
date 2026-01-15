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
import BreadCrumb from '@/components/breadcrumb';
import ManageTicket from './manage';
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

export default function TicketIndex() {
  const [visible, setVisible] = useState(false);
  const [detail, setDetail] = useState({});

  const dataTicket = useGetList({
    url: 'admin/ticket',
    initialParams: {
      skip: 0,
      take: 10,
    },
  });

  const handleDeleted = async (id: number) => {
    FetchAPI(deleteData(`admin/ticket/${id}`)).then(() => {
      dataTicket.refresh();
    });
  };

  const handleExportExcel = async () => {
    await getExcel('admin/ticket/export', 'tickets');
  };

  const columns = [
  {
    colKey: 'index',
    title: '#',
    width: 60,
    cell: (row: any) => {
      return <span>{row.rowIndex + 1 + dataTicket.params.skip}</span>;
    },
  },
  {
    title: 'Title',
    colKey: 'title',
    filter: {
      type: FilterType.Input,
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: { placeholder: 'Input Title' },
      showConfirmAndReset: true,
    },
  },
  {
    title: 'Description',
    colKey: 'description',
    cell: ({ row }: any) => {
      const text = row.description || '-';
      const urlRegex = /(https?:\/\/[^\s]+)/g;

      // pecah string jadi bagian teks & url
      const parts = text.split(urlRegex);

      return (
        <span>
          {parts.map((part: string, idx: number) =>
            urlRegex.test(part) ? (
              <a
                key={idx}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {part}
              </a>
            ) : (
              <span key={idx}>{part}</span>
            )
          )}
        </span>
      );
    },
    filter: {
      type: FilterType.Input,
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: { placeholder: 'Input Description' },
      showConfirmAndReset: true,
    },
  },
  {
    title: 'Category',
    colKey: 'category',
    filter: {
      type: FilterType.Input,
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: { placeholder: 'Input Category' },
      showConfirmAndReset: true,
    },
  },
  {
    title: 'Status',
    colKey: 'status',
    filter: {
      type: FilterType.Input,
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: { placeholder: 'Input Status' },
      showConfirmAndReset: true,
    },
  },
  {
    title: 'User Email',
    colKey: 'userEmail',
    cell: ({ row }: any) => {
      return <span>{row.user?.email || '-'}</span>;
    },
    filter: {
      type: FilterType.Input,
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: { placeholder: 'Input User Email' },
      showConfirmAndReset: true,
    },
  },
  {
    title: 'Link',
    colKey: 'link',
    cell: ({ row }: any) => {
      if (!row.image) return <span>-</span>;

      return (
        <a
          href={row.image}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {row.image}
        </a>
      );
    },
  },

  {
    title: 'Admin Response',
    colKey: 'adminResponse',
    cell: ({ row }: any) => {
      const text = row.adminResponse || '-';
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = text.split(urlRegex);

      return (
        <span>
          {parts.map((part: string, idx: number) =>
            urlRegex.test(part) ? (
              <a
                key={idx}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline"
              >
                {part}
              </a>
            ) : (
              <span key={idx}>{part}</span>
            )
          )}
        </span>
      );
    },
    filter: {
      type: FilterType.Input,
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: { placeholder: 'Input Admin Response' },
      showConfirmAndReset: true,
    },
  },
  {
    title: 'Created At',
    colKey: 'createdAt',
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
                id: row.id || '',   // gunakan id ticket
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
        <ManageTicket
          setDetail={setDetail}
          params={dataTicket}
          setVisible={setVisible}
          detail={detail}
        />
      )}
      <BreadCrumb
        page={[{ name: 'Manage Ticket', link: '/manage-ticket' }]}
      />
      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-2xl text-indigo-950 font-bold mb-5">
              Manage Ticket
            </h1>
            <div className="flex gap-3">
              <Button
                theme="primary"
                size="large"
                variant="dashed"
                onClick={handleExportExcel}
                className="hover:shadow-xl"
              >
                <IconFileSpreadsheet size={20} />
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
        <TableWrapper data={dataTicket} columns={columns} />
      </div>
    </section>
  );
}