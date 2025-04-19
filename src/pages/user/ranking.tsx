import TableWrapper from '@/components/table';
import useGetList from '@/hooks/use-get-list';
import { useEffect, useState } from 'react';
import { Tag } from 'tdesign-react';
import { getData } from '@/utils/axios';
import { useParams } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';

import moment from 'moment/min/moment-with-locales';
import { konversiDetikKeWaktu } from '@/const';

enum AlignType {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}

export default function Ranking({ isBimbel }: any) {
  const [data, setData] = useState<any>([]);
  const [tryout, setTryout] = useState<any>({});

  const { id, paketId, paketFK } = useParams();

  const listTryout = useGetList({
    url: 'user/tryout/ranking',
    initialParams: {
      skip: 0,
      take: 10,
      sortBy: 'createdAt',
      descending: true,
      id: paketId,
      paketPembelianTryoutId: isBimbel ? 0 : paketFK,
      paketPembelianBimbelId: isBimbel ? paketFK : 0,
    },
  });

  const columns = [
    {
      title: 'Posisi',
      colKey: 'posisi',
      width: 100,
      align: AlignType.Center,
      cell: (prop: any) => (
        <div>{prop.rowIndex + 1 * listTryout.params.skip + 1}</div>
      ),
    },
    {
      title: 'Nama Peserta',
      colKey: 'name',
      width: 250,
      cell: ({ row }: any) => (
        <div>
          <p className="text-md font-bold">{row.name}</p>
          <p className="text-xs text-gray-400 font-light">
            {moment(row.createdAt).format('dddd')},{' '}
            {moment(row.createdAt).format('LL')} <br /> Pukul{' '}
            {moment(row.createdAt).format('HH:mm')}
          </p>
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
              theme={item.all_point >= item.maxPoint ? 'success' : 'danger'}
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
          <Tag
            theme={filter?.length < 1 ? 'success' : 'danger'}
            size="large"
            variant="light"
          >
            {filter?.length < 1 ? 'Lulus' : 'Tidak Lulus'}
          </Tag>
        );
      },
    },
    {
      title: 'Durasi Pengerjaan',
      colKey: 'durasi',
      width: 130,
      align: AlignType.Center,
      cell: ({ row }: any) => (
        <div>{konversiDetikKeWaktu(row?.waktuPengerjaan)}</div>
      ),
    },
    {
      title: 'Skor',
      colKey: 'point',
      width: 130,
      align: AlignType.Center,
      cell: ({ row }: any) => <div>{row.point || '0'}</div>,
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
            { name: 'Ranking', link: '#' },
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
            { name: 'Ranking', link: '#' },
          ]}
        />
      )}

      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full mt-2">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-xl text-indigo-950 font-bold mb-5 ">
              Ranking Tryout {tryout?.nama}
            </h1>
          </div>
        </div>
        <TableWrapper data={listTryout} columns={columns} />
      </div>
    </section>
  );
}
