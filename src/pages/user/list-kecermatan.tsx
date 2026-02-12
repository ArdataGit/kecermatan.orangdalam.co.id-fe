import BreadCrumb from '@/components/breadcrumb';
import TutorialGroup from '@/components/tutorial-group';
import { getData } from '@/utils/axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

const CardKecermatan = ({ data, id }: any) => (
  <div className="bg-white p-6 w-full rounded-lg shadow-lg">
    <div className="text-center text-2xl mb-4 font-semibold">
      {data?.kategoriSoalKecermatan?.judul_kategori}
    </div>
    <div className="h-1 w-2/3 bg-[#ffb22c] mx-auto mb-6"></div>

    <div className="flex justify-between items-center mb-4">
      <span className="font-semibold">Jumlah:</span>
      <span>
        {data?.kategoriSoalKecermatan?.jumlah_soal} Karakter
      </span>
    </div>

    <div className="flex justify-between items-center mb-4">
      <span className="font-semibold">Durasi:</span>
      <span>
        {(data?.kategoriSoalKecermatan?.waktu / 60).toFixed(0)} Menit
      </span>
    </div>

    <div className="flex justify-between items-center mb-4">
      <span className="font-semibold">Ranking:</span>
      <span>
        <Link
          to={`/my-class/${id}/kecermatan/${data?.kategoriSoalKecermatan?.id}/ranking`}
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
        to={`/soal-kecermatan/${data?.kategoriSoalKecermatan?.id}`}
        state={{ classId: id }}
        className="w-full bg-[#ffb22c] text-white py-2 rounded-md transition-all hover:bg-[#ffb22c]/90 text-center font-semibold"
      >
        Kerjakan
      </Link>
      <Link
        to={`/my-class/${id}/kecermatan/${data?.kategoriSoalKecermatan?.id}/riwayat`}
        className="w-full border border-[#ffb22c] text-[#ffb22c] py-2 rounded-md transition-all hover:bg-[#ffb22c] hover:text-white text-center font-semibold"
      >
        Riwayat
      </Link>
    </div>
  </div>
);

export default function ListKecermatan() {
  const { id } = useParams();
  const [data, setData] = useState<any>({});
  const [visible, setVisible] = useState(false);
  const getDetailClass = async () => {
    getData(`user/find-my-class/${id}`).then((res) => {
      if (res.error) window.location.href = '/paket-pembelian';
      setData({
        ...res,
        kecermatan: res?.paketPembelian?.paketPembelianKecermatan,
      });
    });
  };
  const [searchParams, setSearchParams] = useSearchParams();

  const type = searchParams.get('type');

  useEffect(() => {
    getDetailClass();

    if (!type) setSearchParams({ type: 'Kecermatan' });
  }, []);

  const renderKecermatan = () => {
      return data?.kecermatan
        ?.filter((e: any) => e.type === 'KECERMATAN')
        .map((e: any) => <CardKecermatan key={e.id} data={e} id={id} />);
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
          { name: 'Kecermatan', link: '#' },
        ]}
      />
      <div className=" rounded-2xl">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full">
          <div className="title flex justify-between w-full mb-4">
            <h1 className="self-center text-2xl text-indigo-950 font-bold">
              Kecermatan {data?.paketPembelian?.nama}
              <div className="mt-4">
                <button
                  className="self-center p-0 m-0 relative mt-2 rounded-xl text-primary hover:underline flex items-center"
                  onClick={() => setVisible(true)}
                >
                  <span className="text-xs relative text-[#ffb22c]">
                    Masuk group dan baca petunjuk Kecermatan
                  </span>
                </button>
              </div>
            </h1>
          </div>
        </div>

        {visible && (
          <TutorialGroup
            title={`Petunjuk Kecermatan `}
            setVisible={setVisible}
            detail={data?.paketPembelian?.panduan}
          />
        )}
        {['Kecermatan'].map((item) => (
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
            border-[#ffb22c]
            hover:bg-[#ffb22c]
            hover:shadow-[5px_5px_rgba(255,178,44,0.3)]         
            ${
              searchParams.get('type') === item
                ? ' shadow-[5px_5px_rgba(255,178,44,0.3)] bg-[#ffb22c] text-white'
                : ' bg-white text-[#ffb22c]'
            }   
            hover:text-white transition-all font-semibold`}
          >
            {item}
          </button>
        ))}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 mt-4">
          {renderKecermatan()}
        </div>
      </div>
    </div>
  );
}
