import {
  IconAlertCircleFilled,
  IconCircleCheck,
  IconDeviceTv,
  IconDownload,
  IconHistory,
  IconPencil,
  IconReportAnalytics,
  IconVideo,
} from '@tabler/icons-react';
import { Button, Popup, Table, Tag } from 'tdesign-react';
import { getData } from '@/utils/axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';
import { useEffect, useState } from 'react';

import moment from 'moment/min/moment-with-locales';
import { handleOpenLink } from '@/const';
import { IconAlarm } from '@tabler/icons-react';
import TutorialGroup from '@/components/tutorial-group';
enum FilterType {
  Input = 'input',
}

enum AlignType {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}
interface StatusNameListMap {
  BELUM: StatusInfo;
  SEDANG: StatusInfo;
  SELESAI: StatusInfo;
}
interface StatusInfo {
  label: string;
  theme: 'success' | 'danger' | 'warning' | 'default' | 'primary';
  icon: JSX.Element;
}

const statusNameListMap: StatusNameListMap = {
  BELUM: {
    label: 'Belum Dimulai',
    theme: 'default',
    icon: <IconAlarm size={20} />,
  },
  SEDANG: {
    label: 'Berlangsung',
    theme: 'warning',
    icon: <IconAlertCircleFilled size={20} />,
  },
  SELESAI: {
    label: 'Selesai',
    theme: 'success',
    icon: <IconCircleCheck size={20} />,
  },
};

export default function UserIndex() {
  const [data, setData] = useState<any>([]);
  const [filter, setFilter] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Waktu',
      colKey: 'date',
      width: 180,
      cell: ({ row }: any) => (
        <div>
          <p className="text-md font-bold">
            {moment(row.date).format('dddd')}, {moment(row.date).format('LL')}
          </p>
          <p>Pukul {moment(row.date).format('HH:mm')}</p>
        </div>
      ),
    },
    {
      title: 'Judul',
      colKey: 'nama',
      filter: {
        type: FilterType.Input,
        resetValue: '',
        confirmEvents: ['onEnter'],
        props: { placeholder: 'Input Nama' },
        showConfirmAndReset: true,
      },
      width: 250,
      cell: ({ row }: any) => (
        <div>
          <p className="text-md ">{row.nama}</p>
          {row?.mentor && <p>Mentor: {row.mentor}</p>}
        </div>
      ),
    },
    {
      title: 'Mini Test',
      colKey: 'miniTest',
      width: 180,
      align: AlignType.Center,
      cell: ({ row }: any) => (
        <div className="flex gap-2 justify-center">
          <Popup
            content={
              row?.paketLatihanId
                ? 'Kerjakan Mini Test'
                : 'Mini Test Belum Tersedia'
            }
            trigger="hover"
          >
            <Button
              variant="dashed"
              theme="warning"
              icon={<IconPencil className="mr-1" size={16} />}
              disabled={!row.paketLatihanId}
              onClick={() => {
                navigate(
                  `/my-class/${id}/bimbel/mini-test/${row.id}/${row.paketLatihanId}`
                );
              }}
            >
              Kerjakan
            </Button>
          </Popup>
          <Popup
            content={
              row?.paketLatihanId
                ? 'Riwayat Mini Test'
                : 'Belum ada riwayat Mini Test'
            }
            trigger="hover"
          >
            <Button
              variant="dashed"
              theme="default"
              icon={<IconHistory className="mr-1" size={16} />}
              disabled={!row.paketLatihanId}
              onClick={() => {
                navigate(
                  `/my-class/${id}/bimbel/mini-test/${row.id}/${row.paketLatihanId}/riwayat`
                );
              }}
            ></Button>
          </Popup>
        </div>
      ),
    },
    {
      title: 'Materi',
      colKey: 'materi',
      width: 140,
      align: AlignType.Center,
      cell: ({ row }: any) => (
        <div>
          <Popup
            content={
              row.materiLink ? 'Download Materi' : 'Materi Belum Tersedia'
            }
            trigger="hover"
          >
            <Button
              variant="dashed"
              theme="danger"
              icon={<IconDownload className="mr-1" size={16} />}
              disabled={!row.materiLink}
              onClick={() => handleOpenLink(row.materiLink)}
            >
              Download
            </Button>
          </Popup>
        </div>
      ),
    },
    {
      title: 'Zoom / Youtube',
      colKey: 'zoom',
      width: 130,
      align: AlignType.Center,
      cell: ({ row }: any) => (
        <div>
          <Popup
            content={row.videoLink ? 'Download Video' : 'Video Belum Tersedia'}
            trigger="hover"
          >
            <Button
              variant="dashed"
              theme="success"
              icon={<IconVideo className="mr-1" size={16} />}
              disabled={!row.videoLink}
              onClick={() => handleOpenLink(row.videoLink)}
            >
              Masuk
            </Button>
          </Popup>
        </div>
      ),
    },
    {
      title: 'Rekaman',
      colKey: 'rekaman',
      width: 130,
      align: AlignType.Center,
      cell: ({ row }: any) => (
        <div>
          <Popup
            content={
              row.rekamanLink ? 'Download Rekaman' : 'Rekaman Belum Tersedia'
            }
            trigger="hover"
          >
            <Button
              variant="dashed"
              theme="primary"
              icon={<IconDeviceTv className="mr-1" size={16} />}
              disabled={!row.rekamanLink}
              onClick={() => handleOpenLink(row.rekamanLink)}
            >
              Tonton
            </Button>
          </Popup>
        </div>
      ),
    },
    {
      title: 'Status',
      colKey: 'status',
      width: 100,
      align: AlignType.Center,
      cell: ({ row }: any) => (
        <div>
          {' '}
          <Tag
            shape="round"
            size="large"
            theme={
              statusNameListMap[row.status as keyof StatusNameListMap]?.theme
            }
            variant="light-outline"
            icon={
              statusNameListMap[row.status as keyof StatusNameListMap]?.icon
            }
          >
            <span className="ml-1">
              {statusNameListMap[row.status as keyof StatusNameListMap]?.label}
            </span>
          </Tag>
        </div>
      ),
    },
  ];

  const getDetailClass = async () => {
    getData(`user/find-my-class/${id}`).then((res: any) => {
      // if (res.error) window.location.href = '/paket-pembelian';
      setData({ ...res, bimbel: res?.paketPembelian?.paketPembelianBimbel });
    });
  };

  useEffect(() => {
    getDetailClass();
  }, []);

  const [visible, setVisible] = useState(false);

  return (
    <section className="">
      <BreadCrumb
        page={[
          { name: 'Paket saya', link: '/my-class' },
          {
            name: data?.paketPembelian?.nama || 'Nama Kelas',
            link: '/my-class',
          },
          { name: 'Bimbel', link: '#' },
        ]}
      />{' '}
      <div className="bg-white p-8 pt-4 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full">
          <div className="title border-b border-[#ddd] w-full flex justify-between mb-5 ">
            <h1 className="text-2xl text-indigo-950 font-semibold self-center mb-4 mt-4 ">
              Bimbel {data?.namaPaket}
              <div className="mt-4">
                <span className="text-sm font-semibold relative">
                  Masuk group dan baca petunjuk Bimbel
                </span>
                <Button
                    className="self-center p-0 m-0 relative mt-2 rounded-sm text-white bg-primary px-4 py-1.5 border border-primary hover:shadow-md flex items-center text-sm"
                    disabled={!data?.paketPembelian?.linkWa}
                    onClick={() => handleOpenLink(data?.paketPembelian?.linkWa)}
                  >
                    Masuk Grup
                  </Button>
              </div>
            </h1>

            {visible && (
              <TutorialGroup
                title={`Panduan Bimbel `}
                setVisible={setVisible}
                detail={data?.paketPembelian?.panduan}
              />
            )}
          </div>
        </div>
        <Table
          data={
            data?.bimbel?.filter((item: any) =>
              item.nama?.toLowerCase()?.includes(filter?.toLowerCase())
            ) || []
          }
          onFilterChange={(e) => {
            setFilter(e.nama);
          }}
          rowKey="bimbel"
          columns={columns}
        />
        <div className="flex justify-between  gap-4 mt-2">
          <Link
            to={`/my-class/${id}/tryout?type=Tryout`}
            className="self-center border-indigo-900 border mb-4 mt-2 rounded-xl text-indigo-900 hover:text-white hover:bg-indigo-900 hover:shadow-2xl px-4 py-2 md:px-6 md:py-2 flex items-center"
            onClick={() => setVisible(true)}
          >
            <IconReportAnalytics size={20} className="mr-2" />
            <span className="text-xs md:text-base">Kerjakan Tryout</span>
          </Link>
          <Link
            to={`/my-class/${id}/tryout?type=Bimbel`}
            className="self-center border-indigo-900 border mb-4 mt-2 rounded-xl text-indigo-900 hover:text-white hover:bg-indigo-900 hover:shadow-2xl px-4 py-2 md:px-6 md:py-2 flex items-center"
            onClick={() => setVisible(true)}
          >
            <IconReportAnalytics size={20} className="mr-2" />
            <span className="text-xs md:text-base">Kerjakan Latihan</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
