import BreadCrumb from '@/components/breadcrumb';
import TutorialGroup from '@/components/tutorial-group';
import { hitungJumlahBankSoal } from '@/const';
import { getData } from '@/utils/axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

const CardTryout = ({ data, id, isBimbel }: any) => (
  <div className="bg-white p-6 w-full rounded-lg shadow-lg">
    <div className="text-center text-2xl mb-4 font-semibold">
      {data?.[isBimbel ? 'paketLatihan' : 'PaketLatihan']?.nama}
    </div>
    <div className="h-1 w-2/3 bg-tertiary mx-auto mb-6"></div>

    <div className="flex justify-between items-center mb-4">
      <span className="font-semibold">Jumlah:</span>
      <span>
        {hitungJumlahBankSoal(isBimbel ? data.paketLatihan : data)} Soal
      </span>
    </div>

    <div className="flex justify-between items-center mb-4">
      <span className="font-semibold">Durasi:</span>
      <span>
        {data?.[isBimbel ? 'paketLatihan' : 'PaketLatihan']?.waktu} Menit
      </span>
    </div>

    <div className="flex justify-between items-center mb-4">
      <span className="font-semibold">Ranking:</span>
      <span>
        <Link
          to={
            isBimbel
              ? `/my-class/${id}/bimbel/mini-test/${data.id}/${data?.paketLatihan?.id}/ranking`
              : `/my-class/${id}/tryout/${data.id}/${data?.PaketLatihan?.id}/ranking`
          }
          className="text-blue-600 underline text-sm"
        >
          Lihat Ranking
        </Link>
      </span>
    </div>

    <div className="mb-6 bg-blue-200 px-4 py-3 text-blue-900 text-sm italic rounded">
      Ranking hanya dihitung pada saat pertama kali mengerjakan soal ini.
    </div>

    <div className="grid grid-cols-2 items-center gap-2">
      <Link
        to={
          isBimbel
            ? `/my-class/${id}/bimbel/mini-test/${data.id}/${data?.paketLatihan?.id}`
            : `/my-class/${id}/tryout/${data.id}/${data?.PaketLatihan?.id}`
        }
        className="w-full bg-indigo-900 text-white  py-2 rounded-md transition-all hover:bg-indigo-900 text-center"
      >
        Kerjakan
      </Link>
      <Link
        to={
          isBimbel
            ? `/my-class/${id}/bimbel/mini-test/${data.id}/${data?.paketLatihan?.id}/riwayat`
            : `/my-class/${id}/tryout/${data.id}/${data?.PaketLatihan?.id}/riwayat`
        }
        className="w-full border border-indigo-900 text-indigo-900  py-2 rounded-md transition-all hover:bg-indigo-900 hover:text-white text-center"
      >
        Riwayat
      </Link>
    </div>
  </div>
);

export default function ListTryout() {
  const { id } = useParams();
  const [data, setData] = useState<any>({});
  const [visible, setVisible] = useState(false);
  const getDetailClass = async () => {
    getData(`user/find-my-class/${id}`).then((res) => {
      if (res.error) window.location.href = '/paket-pembelian';
      setData({
        ...res,
        tryout: res?.paketPembelian?.paketPembelianTryout,
        bimbel: res?.paketPembelian?.paketPembelianBimbel,
      });
    });
  };
  const [searchParams, setSearchParams] = useSearchParams();

  const type = searchParams.get('type');

  useEffect(() => {
    getDetailClass();

    if (!type) setSearchParams({ type: 'Tryout' });
  }, []);

  const renderTryout = () => {
    if (type === 'Pendahuluan') {
      return data?.tryout
        ?.filter((e: any) => e.type === 'PENDAHULUAN')
        .map((e: any) => <CardTryout key={e.id} data={e} id={id} />);
    }

    if (type === 'Tryout') {
      return data?.tryout
        ?.filter((e: any) => e.type === 'TRYOUT')
        .map((e: any) => <CardTryout key={e.id} data={e} id={id} />);
    }

    if (type === 'Pemantapan') {
      return data?.tryout
        ?.filter((e: any) => e.type === 'PEMANTAPAN')
        .map((e: any) => <CardTryout key={e.id} data={e} id={id} />);
    }

    if (type === 'Bimbel') {
      return data?.bimbel?.map((e: any) => {
        return e.paketLatihanId ? (
          <CardTryout data={e} id={id} key={e.id} isBimbel />
        ) : (
          <div />
        );
      });
    }
  };
  return (
    <div>
      <BreadCrumb
        page={[
          { name: 'Paket saya', link: '/my-class' },
          {
            name: data?.paketPembelian?.nama || 'Nama Kelas',
            link: '/my-class',
          },
          { name: 'Tryout', link: '#' },
        ]}
      />
      <div className=" rounded-2xl">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full">
          <div className="title flex justify-between w-full mb-4">
            <h1 className="self-center text-2xl text-indigo-950 font-bold">
              Tryout {data?.paketPembelian?.nama}
              <div className="mt-4">
                <button
                  className="self-center p-0 m-0 relative mt-2 rounded-xl text-primary hover:underline flex items-center"
                  onClick={() => setVisible(true)}
                >
                  <span className="text-xs relative">
                    Masuk group dan baca petunjuk Tryout
                  </span>
                </button>
              </div>
            </h1>
          </div>
        </div>

        {visible && (
          <TutorialGroup
            title={`Petunjuk Tryout `}
            setVisible={setVisible}
            detail={data?.paketPembelian?.panduan}
          />
        )}
        {['Tryout', 'Bimbel'].map((item) => (
          <button
            onClick={() => {
              setSearchParams({ type: item });
            }}
            className={`
          
            text-gray-700 
            py-2 px-8
            mb-5

            border 
            rounded
            mr-4
            border-indigo-900
            hover:bg-indigo-900
            hover:shadow-[5px_5px_rgb(255,_0,_0,_0.27)]         
            ${
              searchParams.get('type') === item
                ? ' shadow-[5px_5px_rgb(255,_0,_0,_0.27)] bg-indigo-900 text-white'
                : ' bg-white'
            }   
            hover:text-white`}
          >
            {item}
          </button>
        ))}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 mt-4">
          {renderTryout()}
        </div>
      </div>
    </div>
  );
}
