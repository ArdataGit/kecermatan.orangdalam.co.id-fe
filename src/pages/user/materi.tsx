import BreadCrumb from '@/components/breadcrumb';
import { getData } from '@/utils/axios';
import { IconBook, IconFiles } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const CardTryout = ({ data }: any) => (
  <div className="bg-white p-6 w-full rounded-lg shadow-lg">
    <div className="text-center text-lg md:text-2xl mb-2 md:mb-2 font-semibold">
      {data.nama}
    </div>
    <div className="h-0.5 md:h-1 w-2/3 bg-tertiary mx-auto mb-6"></div>
    <div className="flex flex-col mb-8 justify-center items-center gap-3">
      <div className="flex gap-2 ">
        <IconFiles className="" />
        File dapat diunduh
      </div>
      <div className="flex gap-2 ">
        <IconBook className="" />
        Materi dapat langsung dibaca
      </div>
    </div>
    <div className="grid grid-cols-1 items-center gap-2">
      <Link
        to={data.link}
        target="_blank"
        className="w-full bg-indigo-900 text-white  py-2 rounded-md transition-all hover:bg-indigo-900 text-center"
      >
        Lihat Materi
      </Link>
    </div>
  </div>
);

export default function Materi() {
  const [data, setData] = useState<any>({});
  const { id } = useParams();

  const getDetailClass = async () => {
    getData(`user/find-my-class/${id}`).then((res) => {
      if (res.error) window.location.href = '/paket-pembelian';
      setData({ ...res, materi: res?.paketPembelian?.paketPembelianMateri });
    });
  };

  useEffect(() => {
    getDetailClass();
  }, []);

  return (
    <div>
      <BreadCrumb
        page={[
          { name: 'Paket saya', link: '/my-class' },
          {
            name: data?.paketPembelian?.nama || 'Nama Kelas',
            link: '/my-class',
          },
          { name: 'Materi', link: '#' },
        ]}
      />
      <h1 className="self-center text-2xl text-indigo-950 font-bold text-center mb-5">
        Materi {data?.paketPembelian?.nama}
      </h1>
      <div className="">
        {/* <div className="flex">
          <div className="w-8/12 pr-10">
            <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full">
              <div className="title">
                <h1 className="text-2xl text-primary font-bold mb-5">
                  {data?.materi?.[onShow]?.nama || 'Nama Materi'}
                </h1>
              </div>
            </div>
            <div
              className="ckeditor ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred min-h-[600px]"
              dangerouslySetInnerHTML={{
                __html: data?.materi?.[onShow]?.materi || '-',
              }}
            />
            <div className="flex justify-between mt-10">
              <button
                className={`bg-white border border-tertiary text-tertiary hover:bg-tertiary hover:text-white p-3 px-5 rounded-full ${
                  onShow === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => {
                  if (onShow > 0) setOnShow(onShow - 1);
                }}
              >
                Sebelumnya
              </button>
              <button
                className={`bg-tertiary text-white p-3 px-5 rounded-full ${
                  onShow === data?.materi?.length - 1
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                onClick={() => {
                  if (onShow < data?.materi?.length - 1) setOnShow(onShow + 1);
                }}
              >
                Selanjutnya
              </button>
            </div>
          </div>
          <div className="relative w-4/12 border-l pl-10">
            <aside className="sticky top-10  border-[#DDD] ">
              <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full">
                <div className="title">
                  <h1 className="text-2xl text-primary font-bold mb-5">
                    {data?.paketPembelian?.nama || 'Nama Kelas'}
                  </h1>
                </div>
              </div>
              <ul>
                {data?.materi?.map((item: any, index: number) => (
                  <li key={index} className="flex mb-5 gap-2">
                    <Popup
                      content={
                        item.link ? 'Download Materi' : 'Belum ada materi'
                      }
                      trigger="hover"
                    >
                      <a
                        href={item.link || '#'}
                        target="_blank"
                        className={`self-center bg-primary rounded-full p-2 py-1.5 flex justify-center ${
                          !item.link ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <IconDownload className="text-white" />
                      </a>
                    </Popup>

                    <div className="flex items-center justify-between  ">
                      <button
                        onClick={() => setOnShow(index)}
                        className={`text-primary hover:shadow-md flex gap-2 pl-6  p-2 py-1.5 rounded-full pr-10 ${
                          onShow === index
                            ? 'border border-primary text-gray-400'
                            : 'bg-[#e5e9f2]'
                        }`}
                      >
                        <IconBook /> {item.nama}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 mt-4">
          {data?.materi?.map((item: any, index: number) => (
            <CardTryout key={index} data={item} id={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
