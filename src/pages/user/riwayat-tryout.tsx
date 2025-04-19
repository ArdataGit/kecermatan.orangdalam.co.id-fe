import TableWrapper from '@/components/table';
import useGetList from '@/hooks/use-get-list';
import {
  IconChartInfographic,
  IconEyeShare,
  IconPencil,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Button, Popup, Tag } from 'tdesign-react';
import { getData } from '@/utils/axios';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';

import moment from 'moment/min/moment-with-locales';
import { konversiDetikKeWaktu } from '@/const';

enum AlignType {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}

export default function RiwayatTryout({ isBimbel }: any) {
  const [data, setData] = useState<any>([]);
  const [tryout, setTryout] = useState<any>({});

  const { id, paketId, paketFK } = useParams();
  const navigate = useNavigate();
  const listTryout = useGetList({
    url: 'user/tryout/history',
    initialParams: {
      skip: 0,
      take: 10,
      sortBy: 'createdAt',
      descending: true,
      id: paketId,
      paketPembelianBimbelId: isBimbel ? paketFK : undefined,
      paketPembelianTryoutId: isBimbel ? undefined : paketFK,
    },
  });

  const columns = [
    {
      title: '#',
      colKey: 'position',
      width: 100,
      cell: ({ rowIndex }: any) => (
        <div>{rowIndex + 1 * listTryout.params.skip + 1}</div>
      ),
    },
    {
      title: 'Waktu Pengerjaan',
      colKey: 'date',
      width: 250,
      cell: ({ row }: any) => (
        <div>
          <p className="text-md font-bold">
            {moment(row.createdAt).format('dddd')},{' '}
            {moment(row.createdAt).format('LL')}
          </p>
          <p>Pukul {moment(row.createdAt).format('HH:mm')}</p>
        </div>
      ),
    },
    {
      title: 'Passing Grade',
      colKey: 'nama',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          {row?.pointCategory?.map((item: any) => (
            <Tag
              theme={item.all_point >= item.kkm ? 'success' : 'danger'}
              size="large"
              variant="light"
            >
              {item.category}: {item.all_point}/{item.kkm}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Status',
      colKey: 'status',
      width: 130,
      align: AlignType.Center,
      cell: ({ row }: any) => {
        const filter = row?.pointCategory?.filter(
          (e: any) => e.all_point < e.kkm
        );

        return (
          <>
            {moment(row.finishAt) > moment() ? (
              <Tag theme="warning" size="large" variant="light">
                Sedang Dikerjakan
              </Tag>
            ) : (
              <Tag
                theme={filter?.length < 1 ? 'success' : 'danger'}
                size="large"
                variant="light"
              >
                {filter?.length < 1 ? 'Lulus' : 'Tidak Lulus'}
              </Tag>
            )}
          </>
        );
      },
    },
    {
      title: 'Durasi Pengerjaan',
      colKey: 'durasi',
      width: 130,
      align: AlignType.Center,
      cell: ({ row }: any) => (
        <div>
          {moment(row.finishAt) > moment()
            ? ''
            : konversiDetikKeWaktu(row?.waktuPengerjaan)}
        </div>
      ),
    },
    {
      title: 'Action',
      colKey: 'miniTest',
      width: 300,
      align: AlignType.Center,
      cell: ({ row }: any) => (
        <div className="flex gap-2 justify-center">
          {moment(row.finishAt) > moment() ? (
            <Popup content={'Lanjutkan Tryout'} trigger="hover">
              <Button
                variant="dashed"
                theme="danger"
                icon={<IconPencil className="mr-1" size={16} />}
                onClick={() => {
                  navigate(
                    `/my-class/${id}/tryout/${paketFK}/${paketId}/${row.id}`
                  );
                }}
              >
                Lanjutkan
              </Button>
            </Popup>
          ) : (
            <>
              <Popup content="Lihat Statistik" trigger="hover">
                <Button
                  variant="dashed"
                  theme="success"
                  icon={<IconChartInfographic className="mr-1" size={16} />}
                  onClick={() => {
                    navigate(
                      `/my-class/${id}/tryout/${paketFK}/${paketId}/${row.id}/statistik`
                    );
                  }}
                >
                  Statistik
                </Button>
              </Popup>
              <Popup
                content={
                  row?.isShareAnswer
                    ? 'Pelajari Tryout'
                    : 'Pembahasan belum tersedia'
                }
                trigger="hover"
              >
                <Button
                  variant="dashed"
                  theme="primary"
                  icon={<IconEyeShare className="mr-1" size={16} />}
                  onClick={() => {
                    navigate(
                      `/my-class/${id}/tryout/${paketFK}/${paketId}/${row.id}/pembahasan`
                    );
                  }}
                  disabled={!row?.isShareAnswer}
                >
                  Pembahasan
                </Button>
              </Popup>
            </>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getDetailClass();
  }, []);

  const getDetailClass = async () => {
    await getData(`user/find-my-class/${id}`).then((res) => {
      if (res.error) window.location.href = '/paket-pembelian';
      setData({ ...res });
    });
    await getData(`user/find-latihan/${paketId}`).then((res) => {
      setTryout(res);
    });
  };

  useEffect(() => {
    getDetailClass();
  }, []);

  return (
    <section className="">
      {isBimbel ? (
        <BreadCrumb
          page={[
            { name: 'Paket saya', link: '/my-class' },
            {
              name: data?.paketPembelian?.nama || 'Nama Kelas',
              link: '/my-class',
            },
            { name: 'Bimbel', link: `/my-class/${id}/bimbel` },
            {
              name: tryout?.nama || 'Bimbel',
              link: `/my-class/${id}/bimbel/mini-test/${paketFK}/${paketId}`,
            },
            { name: 'Riwayat', link: '#' },
          ]}
        />
      ) : (
        <BreadCrumb
          page={[
            { name: 'Paket saya', link: '/my-class' },
            {
              name: data?.paketPembelian?.nama || 'Nama Kelas',
              link: '/my-class',
            },
            { name: 'Tryout', link: `/my-class/${id}/tryout` },
            {
              name: tryout?.nama || 'Tryout',
              link: `/my-class/${id}/tryout/${paketFK}/${paketId}`,
            },
            { name: 'Riwayat', link: '#' },
          ]}
        />
      )}

      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full mt-2">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-xl text-indigo-950 font-bold mb-5 ">
              Riwayat {isBimbel ? 'Mini Test' : 'Tryout'} {tryout?.nama}
            </h1>
          </div>
        </div>
        <TableWrapper data={listTryout} columns={columns} />
      </div>
    </section>
  );
}
