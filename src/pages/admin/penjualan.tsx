import TableWrapper from '@/components/table';
import useGetList from '@/hooks/use-get-list';
import moment from 'moment';
import { Button, Popconfirm, Tag } from 'tdesign-react';
// import FetchAPI from '@/utils/fetch-api';
// import { deleteData } from '@/utils/axios';
import BreadCrumb from '@/components/breadcrumb';
import { formatCurrency } from '@/utils/number-format';
import { IconCheck } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import FetchAPI from '@/utils/fetch-api';
import { deleteData, postData } from '@/utils/axios';
import { useState } from 'react';
import { IconTrash } from '@tabler/icons-react';

enum FilterType {
  Input = 'input',
}

enum AlignType {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}

export default function ManagePenjualan() {
  const getData = useGetList({
    url: 'admin/paket-latihan/penjualan',
    initialParams: {
      skip: 0,
      take: 10,
    },
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  const onSelectChange = (keys: any[]) => {
    setSelectedRowKeys(keys);
  };

  const handleBulkDelete = async () => {
    FetchAPI(
      deleteData('admin/paket-latihan/penjualan/bulk-delete', {
        ids: selectedRowKeys,
      })
    ).then(() => {
      setSelectedRowKeys([]);
      getData.refresh();
    });
  };

  const finishPayment = async (id: number) => {
    FetchAPI(
      postData('admin/paket-latihan/penjualan/finish-payment', { id })
    ).then(() => {
      getData.setParams((prev: any) => ({ ...prev }));
    });
  };

  const setStatusFilter = (status: string | undefined) => {
    getData.setParams((prev: any) => ({
      ...prev,
      filters: {
        ...prev.filters,
        status: status,
      },
    }));
  };
  const columns = [
    {
      colKey: 'row-select',
      type: 'multiple',
      width: 50,
    },
    {
      colKey: 'applicant',
      title: '#',
      width: 60,
      cell: (row: any) => {
        return <span>{row.rowIndex + 1 * getData.params.skip + 1}</span>;
      },
    },
    {
      title: 'Invoice',
      colKey: 'invoice',
      width: 130,
      cell: ({ row }: any) => {
        return (
          <Link
            to={row.paymentUrl}
            className={row.paymentUrl ? 'text-blue-500 hover:underline' : ''}
            target="_blank"
          >
            {row.invoice}
          </Link>
        );
      },
    },
    {
      title: 'Nama Paket',
      colKey: 'namaPaket',
      filter: {
        type: FilterType.Input,
        resetValue: '',
        confirmEvents: ['onEnter'],
        props: { placeholder: 'Input Name' },
        showConfirmAndReset: true,
      },
    },
    {
      title: 'Nama User',
      colKey: 'userName',
      filter: {
        type: FilterType.Input,
        resetValue: '',
        confirmEvents: ['onEnter'],
        props: { placeholder: 'Input Name' },
        showConfirmAndReset: true,
      },
      cell: ({ row }: any) => <span>{row?.user?.name}</span>,
    },
    {
      title: 'Total Voucher',
      colKey: 'voucher',
      width: 150,
      align: AlignType.Center,
      cell: ({ row }: any) => {
        return row?.voucherCode ? (
          <span>
            Rp. {row?.voucherCode}
            <br />
            <small> {formatCurrency(row?.voucherValue)}</small>
          </span>
        ) : (
          'Rp. 0'
        );
      },
    },
    {
      title: 'Total Voucer Alumni',
      colKey: 'voucherAlumni',
      width: 150,
      align: AlignType.Center,
      cell: ({ row }: any) => {
        return <span>{formatCurrency(row?.voucherAlumni)}</span>;
      },
    },
    {
      title: 'Total Harga',
      colKey: 'amount',
      width: 150,
      align: AlignType.Center,

      sorter: true,
      cell: ({ row }: any) => {
        return <span>{formatCurrency(row?.amount)}</span>;
      },
    },
    {
      title: 'Status',
      colKey: 'status',
      width: 100,
      filter: {
        type: 'single',
        resetValue: [],
        list: [
          { label: 'UNPAID', value: 'UNPAID' },
          { label: 'PAID', value: 'PAID' },
          { label: 'OVERDUE', value: 'OVERDUE' },
          { label: 'EXPIRED', value: 'EXPIRED' },
        ],
        showConfirmAndReset: true,
      },
      align: AlignType.Center,
      cell: ({ row }: any) => {
        return (
          <div className="flex gap-2 items-center">
            <Tag
              theme={
                moment(row?.expiredAt).isBefore(moment()) &&
                row?.status !== 'UNPAID'
                  ? 'danger'
                  : row?.status === 'PAID'
                  ? 'success'
                  : row?.status === 'UNPAID'
                  ? 'warning'
                  : 'danger'
              }
              size="large"
              variant="light"
            >
              {moment(row?.expiredAt).isBefore(moment()) &&
              row?.status !== 'UNPAID'
                ? 'Overdue'
                : row?.status}
            </Tag>
            {row?.status === 'UNPAID' || row?.status === 'EXPIRED' ? (
              <Popconfirm
                content="Apakah kamu yakin ?"
                theme="default"
                onConfirm={() => {
                  finishPayment(row.id);
                }}
              >
                <Button theme="success" size="small">
                  <IconCheck size={14} />
                </Button>{' '}
              </Popconfirm>
            ) : (
              ''
            )}
          </div>
        );
      },
    },
    {
      title: 'Tanggal',
      colKey: 'tanggal',
      width: 150,
      align: AlignType.Center,

      sorter: true,
      cell: ({ row }: any) => {
        return (
          <span>
            {`${moment(row.createdAt).format('DD/MM/YYYY')} - `}

            {row.expiredAt ? (
              <span
                className={`${
                  moment(row?.expiredAt).isBefore(moment()) && 'text-red-500'
                }`}
              >
                {moment(row.expiredAt).format('DD/MM/YYYY')}
              </span>
            ) : (
              'Seumur Hidup'
            )}
          </span>
        );
      },
    },
  ];
  return (
    <section className="">
      <BreadCrumb
        page={[{ name: 'Manage Voucher', link: '/manage-voucher' }]}
      />
      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-2xl text-indigo-950 font-bold mb-5 ">
              Manage Penjualan
            </h1>
            <div className="flex gap-2 mb-4">
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  content={`Apakah kamu yakin ingin menghapus ${selectedRowKeys.length} data ?`}
                  theme="danger"
                  onConfirm={handleBulkDelete}
                >
                  <Button theme="danger" variant="base" icon={<IconTrash size={16} />}>
                    Hapus Terpilih
                  </Button>
                </Popconfirm>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 my-5">
          <Button
            variant={!getData.params.filters?.status ? 'base' : 'outline'}
            onClick={() => setStatusFilter(undefined)}
          >
            All
          </Button>
          <Button
            theme="success"
            variant={getData.params.filters?.status === 'PAID' ? 'base' : 'outline'}
            onClick={() => setStatusFilter('PAID')}
          >
            Paid
          </Button>
          <Button
            theme="warning"
            variant={getData.params.filters?.status === 'UNPAID' ? 'base' : 'outline'}
            onClick={() => setStatusFilter('UNPAID')}
          >
            Unpaid
          </Button>
          <Button
            theme="danger"
            variant={getData.params.filters?.status === 'EXPIRED' ? 'base' : 'outline'}
            onClick={() => setStatusFilter('EXPIRED')}
          >
            Expired
          </Button>
          <Button
            theme="danger"
            variant={getData.params.filters?.status === 'OVERDUE' ? 'base' : 'outline'}
            onClick={() => setStatusFilter('OVERDUE')}
          >
            Overdue
          </Button>
        </div>
        <TableWrapper
          data={{ ...getData, selectedRowKeys, onSelectChange }}
          columns={columns}
        />
      </div>
    </section>
  );
}
