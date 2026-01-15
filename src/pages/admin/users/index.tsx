import TableWrapper from '@/components/table';
import useGetList from '@/hooks/use-get-list';
import {
  IconFileSpreadsheet,
  IconPencil,
  IconPlus,
  IconTrash,
  IconUsers,
} from '@tabler/icons-react';
import moment from 'moment';
import { useState } from 'react';
import { Button, Popconfirm, Dialog } from 'tdesign-react';  // Changed: Modal → Dialog
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
  const [referalVisible, setReferalVisible] = useState(false);
  const [detail, setDetail] = useState({});
  const [referalDetail, setReferalDetail] = useState(null);
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

  const handleReferalClick = (row: any) => {
    setReferalDetail(row);
    setReferalVisible(true);
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
      title: 'Referal',
      colKey: 'referal',
      align: AlignType.Center,
      cell: ({ row }: any) => {
        const count = row.affiliateToUsers ? row.affiliateToUsers.length : 0;
        return (
          <Button
            shape="round"
            size="small"
            theme="default"
            onClick={() => handleReferalClick(row)}
            disabled={count === 0}
            className="flex items-center gap-1"
          >
            <IconUsers size={14} />
            <span>{count}</span>
          </Button>
        );
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
      {referalVisible && referalDetail && (
        <Dialog  // Changed: <Modal → <Dialog
          visible={referalVisible}  // Standard prop
          header={`Referal Detail - ${referalDetail.name}`}  // Changed: title → header
          width={800}
          onClose={() => {  // Standard prop
            setReferalVisible(false);
            setReferalDetail(null);
          }}
        >
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Daftar User yang Direferensikan:</h3>
            {referalDetail.affiliateToUsers && referalDetail.affiliateToUsers.length > 0 ? (
              referalDetail.affiliateToUsers.map((affUser: any, index: number) => (
                <div key={affUser.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">User #{index + 1}: {affUser.name}</h4>
                      <p className="text-sm text-gray-600">Email: {affUser.email}</p>
                      <p className="text-sm text-gray-600">No WA: {affUser.noWA}</p>
                      <p className="text-sm text-gray-600">Created: {moment(affUser.createdAt).format('DD/MM/YYYY')}</p>
                    </div>
                  </div>
                  <h5 className="font-semibold mb-2">Pembelian:</h5>
                  {affUser.Pembelian && affUser.Pembelian.length > 0 ? (
                    <ul className="space-y-2">
                      {affUser.Pembelian.map((purchase: any) => (
                        <li key={purchase.id} className="text-sm bg-white p-2 rounded border-l-4 border-blue-500">
                          <div className="flex justify-between">
                            <span>{purchase.namaPaket}</span>
                            <span className="font-medium">Rp {purchase.amount.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-500">Status: {purchase.status} | Dibayar: {moment(purchase.paidAt).format('DD/MM/YYYY HH:mm')} | Expired: {moment(purchase.expiredAt).format('DD/MM/YYYY')}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Belum ada pembelian.</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">Tidak ada user yang direferensikan.</p>
            )}
          </div>
        </Dialog>  // Changed: </Modal → </Dialog
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