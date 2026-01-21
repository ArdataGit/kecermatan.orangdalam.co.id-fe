
import useGetList from '@/hooks/use-get-list';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';
import { getData } from '@/utils/axios';
import moment from 'moment/min/moment-with-locales';

export default function RiwayatKecermatan() {
  const { id, kategoriId } = useParams();
  const [data, setData] = useState<any>({});

  const listHistory = useGetList({
    url: 'user/paket-pembelian-kecermatan/get-history',
    initialParams: {
      kategoriSoalKecermatanId: kategoriId,
      skip: 0,
      take: 100, // Fetch more since pagination might not be focus of custom view or user requested "all" appearance implicitly
      sortBy: 'createdAt',
      descending: true,
    },
  });

  useEffect(() => {
    getDetailClass();
  }, []);

  const getDetailClass = async () => {
    await getData(`user/find-my-class/${id}`).then((res) => {
      if (res.error) return; 
      setData({ ...res });
    });
  };

  return (
    <section className="">
      <BreadCrumb
        page={[
          { name: 'Paket saya', link: '/my-class' },
          {
            name: data?.paketPembelian?.nama || 'Nama Kelas',
            link: '/my-class',
          },
          { name: 'Kecermatan', link: `/my-class/${id}/kecermatan` },
          { name: 'Riwayat', link: '#' },
        ]}
      />

      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full mt-2 mb-6">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-xl text-indigo-950 font-bold mb-5 ">
              Riwayat Pengerjaan Kecermatan (Kategori ID: {kategoriId})
            </h1>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
             {listHistory.isLoading && <div>Loading...</div>}
             {!listHistory.isLoading && listHistory.list.length === 0 && <div>Belum ada riwayat pengerjaan.</div>}
             
             {listHistory.list.map((item: any, index: number) => {
                 const kiasanChar = item.kiasan?.karakter || []; 
                 const kiasanKeys = item.kiasan?.kiasan || [];
                 const soalChars = item.soalKecermatan?.soal || [];
                 // Parse JSON if string
                 const parsedSoal = typeof soalChars === 'string' ? JSON.parse(soalChars) : soalChars;
                 // Note: kiasan.karakter and kiasan.kiasan come as JSON from DB, usually Prisma parses them if type is Json. 
                 // If types are messed up, we might need manual parse. Assuming Prisma handles it.

                 return (
                     <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-2">
                              <div>
                                  <span className="font-bold text-gray-500 mr-2">No. {index + 1}</span>
                                  <span className="text-sm text-gray-400">{moment(item.createdAt).format('LL HH:mm:ss')}</span>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-bold ${item.jawaban === item.soalKecermatan?.jawaban ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {item.jawaban === item.soalKecermatan?.jawaban ? 'Benar' : 'Salah'}
                              </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Kiasan Info */}
                              <div className="bg-gray-50 p-4 rounded-md">
                                  <p className="font-semibold text-sm mb-2 text-gray-600">Kiasan (ID: {item.kiasanId})</p>
                                  <div className="flex flex-col gap-2">
                                      <div className="flex gap-1 justify-center">
                                          {Array.isArray(kiasanChar) && kiasanChar.map((char: string, i: number) => (
                                              <div key={i} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 font-bold text-sm">{char}</div>
                                          ))}
                                      </div>
                                      <div className="flex gap-1 justify-center">
                                          {Array.isArray(kiasanKeys) && kiasanKeys.map((key: string, i: number) => (
                                              <div key={i} className="w-8 h-8 flex items-center justify-center text-indigo-600 font-bold text-lg">{key}</div>
                                          ))}
                                      </div>
                                  </div>
                              </div>

                              {/* Soal & Jawaban Info */}
                              <div className="flex flex-col justify-center items-center">
                                   <p className="font-semibold text-sm mb-2 text-gray-600 self-start">Soal & Jawaban</p>
                                   <div className="flex gap-2 mb-4 bg-gray-100 p-2 rounded">
                                       {Array.isArray(parsedSoal) && parsedSoal.map((char: string, i: number) => (
                                            <div key={i} className="text-2xl font-bold text-gray-800">{char}</div>
                                       ))}
                                   </div>
                                   <div className="grid grid-cols-2 gap-x-8 text-center w-full">
                                       <div>
                                           <p className="text-xs text-gray-500 uppercase">Jawaban Kamu</p>
                                           <p className="text-xl font-bold text-indigo-900">{item.jawaban}</p>
                                       </div>
                                       <div>
                                           <p className="text-xs text-gray-500 uppercase">Kunci Jawaban</p>
                                           <p className="text-xl font-bold text-gray-700">{item.soalKecermatan?.jawaban}</p>
                                       </div>
                                   </div>
                              </div>
                          </div>
                     </div>
                 );
             })}
        </div>
      </div>
    </section>
  );
}
