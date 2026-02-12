
import useGetList from '@/hooks/use-get-list';
import { useParams } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';
import moment from 'moment/min/moment-with-locales';
import { IconBook } from '@tabler/icons-react';
import { Loading } from 'tdesign-react';
import { getData } from '@/utils/axios';
import { useEffect, useState } from 'react';

export default function DetailRiwayatBacaanUser() {
  const { id, kategoriId, sessionId } = useParams();
  const [paketData, setPaketData] = useState<any>({});

  const listHistory = useGetList({
    url: 'user/history-bacaan/my-history',
    initialParams: {
      kategoriSoalBacaanId: kategoriId,
      bacaanHistoryId: sessionId, // Filter by Session ID
      skip: 0,
      take: 100,
      sortBy: 'createdAt',
      descending: true,
    },
  });

  useEffect(() => {
    getData(`user/find-my-class/${id}`).then((res) => {
        if (!res.error) {
            setPaketData(res.paketPembelian || {});
        }
    });
  }, [id]);

  return (
    <div className="section-container">
      <BreadCrumb
        page={[
          { name: 'Paket saya', link: '/my-class' },
          { name: paketData.nama || 'Nama Kelas', link: '/my-class' },
          { name: 'Bacaan', link: `/my-class/${id}/bacaan` },
          { name: 'Riwayat Pengerjaan', link: `/my-class/${id}/bacaan/${kategoriId}/riwayat` },
          { name: 'Detail Sesi', link: '#' },
        ]}
      />

      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full mt-2 mb-6">
          <div className="title border-b border-[#ddd] w-full flex justify-between items-center">
             <h1 className="text-xl text-indigo-950 font-bold mb-5 ">
              Riwayat Pengerjaan (Sesi: {sessionId})
            </h1>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
             {listHistory.isLoading && (
                 <div className="flex justify-center p-10">
                    <Loading />
                 </div>
             )}
             
             {!listHistory.isLoading && listHistory.list.length === 0 && (
                 <div className="text-center text-gray-500 py-10">Belum ada riwayat pengerjaan.</div>
             )}
             
             {listHistory.list.map((item: any, index: number) => {
                 return (
                     <div key={item.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                          <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-2">
                              <div>
                                  <span className="font-bold text-gray-500 mr-2">No. {index + 1}</span>
                                  <span className="text-sm text-gray-400">{moment(item.createdAt).locale('id').format('LL HH:mm:ss')}</span>
                              </div>
                          </div>

                          <div className="flex flex-col gap-6">
                               {/* Bacaan */}
                               <div className="bg-indigo-50 p-4 rounded-md">
                                  <div className="flex items-center gap-2 font-bold text-indigo-900 mb-2">
                                      <IconBook size={18} />
                                      Bacaan
                                  </div>
                                  <p className="text-gray-700 text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">{item.bacaan?.bacaan}</p>
                               </div>

                               {/* Soal & Jawaban */}
                               <div className="flex flex-row gap-4 items-start">
                                    <div className="p-4 bg-gray-50 rounded-md flex-1">
                                         <p className="font-bold text-gray-900 mb-2">Pertanyaan:</p>
                                         <p className="text-gray-800 whitespace-pre-wrap text-justify font-inter leading-relaxed">
                                            {item.soalBacaan?.soal}
                                         </p>
                                    </div>

                                    <div className="p-4 border rounded-lg bg-white min-w-[200px] text-center shrink-0">
                                        <p className="text-xs text-gray-500 uppercase mb-2">Jawaban Anda</p>
                                        <p className="text-base font-bold text-[#ffb22c] whitespace-pre-wrap text-left">
                                            {item.jawaban}
                                        </p>
                                    </div>
                               </div>
                          </div>
                     </div>
                 );
             })}
        </div>
      </div>
    </div>
  );
}
