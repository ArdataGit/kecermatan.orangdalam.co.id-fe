
import useGetList from '@/hooks/use-get-list';
import { useParams } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';
import moment from 'moment/min/moment-with-locales';
import { IconBook } from '@tabler/icons-react';

export default function HistoryDetailBacaanAdmin() {
  const { id, userId } = useParams();

  const listHistory = useGetList({
    url: 'admin/kategori-soal-bacaan/history/detail',
    initialParams: {
      kategoriSoalBacaanId: id,
      userId: userId,
      skip: 0,
      take: 100,
      sortBy: 'createdAt',
      descending: true,
    },
  });

  return (
    <section className="">
      <BreadCrumb
        page={[
          { name: 'Bank Soal Bacaan', link: '/manage-soal-bacaan' },
          { name: 'Riwayat Pengerjaan', link: `/manage-soal-bacaan/${id}/history` },
          { name: 'Detail User', link: '#' },
        ]}
      />

      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full mt-2 mb-6">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-xl text-indigo-950 font-bold mb-5 ">
              Detail Pengerjaan User (ID: {userId})
            </h1>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
             {listHistory.isLoading && <div>Loading...</div>}
             {!listHistory.isLoading && listHistory.list.length === 0 && <div>Belum ada data detail.</div>}
             
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
                                         <p className="text-gray-800">{item.soalBacaan?.soal}</p>
                                    </div>

                                    <div className="p-4 border rounded-lg bg-white min-w-[150px] text-center shrink-0">
                                        <p className="text-xs text-gray-500 uppercase mb-2">Jawaban User</p>
                                        <p className="text-xl font-bold text-indigo-900">
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
    </section>
  );
}
