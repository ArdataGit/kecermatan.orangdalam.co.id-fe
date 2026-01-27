
import useGetList from '@/hooks/use-get-list';
import { useParams } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';
import moment from 'moment/min/moment-with-locales';
import { IconBook } from '@tabler/icons-react';
import { Input, message } from 'tdesign-react';
import { patchData } from '@/utils/axios';

import { useSearchParams } from 'react-router-dom';

export default function HistoryDetailIsianAdmin() {
  const { id, userId } = useParams();
  const [searchParams] = useSearchParams();
  const isianHistoryId = searchParams.get('isianHistoryId');

  const listHistory = useGetList({
    url: 'admin/kategori-soal-isian/history/detail',
    initialParams: {
      kategoriSoalIsianId: id,
      userId: userId,
      isianHistoryId: isianHistoryId ? Number(isianHistoryId) : undefined,
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
          { name: 'Bank Soal Isian', link: '/manage-soal-isian' },
          { name: 'Riwayat Pengerjaan', link: `/manage-soal-isian/${id}/history` },
          { name: 'Detail User', link: '#' },
        ]}
      />

      <div className="bg-white p-8 rounded-2xl min-w-[400px]">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full mt-2 mb-6">
          <div className="title border-b border-[#ddd] w-full flex justify-between items-center">
            <h1 className="text-xl text-indigo-950 font-bold mb-5 ">
              Detail Pengerjaan User (ID: {userId})
            </h1>
            <div className="mb-5 text-right">
                <p className="text-gray-500 text-sm uppercase font-bold">Total Skor</p>
                <p className="text-3xl font-bold text-indigo-600">
                    {listHistory.list.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0)}
                </p>
            </div>
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
                               {/* Soal & Jawaban */}
                               <div className="flex flex-row gap-4 items-start">
                                    <div className="p-4 bg-gray-50 rounded-md flex-1">
                                         <p className="font-bold text-gray-900 mb-2">Pertanyaan:</p>
                                         <p className="text-gray-800 whitespace-pre-wrap">{item.soalIsian?.soal}</p>
                                    </div>

                                    <div className="p-4 border rounded-lg bg-white min-w-[200px] text-center shrink-0">
                                        <p className="text-xs text-gray-500 uppercase mb-2">Jawaban User</p>
                                        <p className="text-base font-bold text-indigo-900 whitespace-pre-wrap text-left">
                                            {item.jawaban}
                                        </p>
                                    </div>
                                    
                                    <div className="p-4 border border-green-200 rounded-lg bg-green-50 min-w-[200px] text-center shrink-0">
                                        <p className="text-xs text-green-600 uppercase mb-2">Kunci Jawaban</p>
                                        <p className="text-base font-bold text-green-900 whitespace-pre-wrap text-left">
                                            {item.soalIsian?.jawaban || '-'}
                                        </p>
                                    </div>

                                    <div className="p-4 border rounded-lg bg-white min-w-[150px] text-center shrink-0">
                                        <p className="text-xs text-gray-500 uppercase mb-2">Skor</p>
                                        <Input 
                                            defaultValue={item.score || 0}
                                            type="number"
                                            align="center"
                                            onBlur={async (val) => {
                                                try {
                                                    await patchData('admin/kategori-soal-isian/update-score', {
                                                        historyId: item.id,
                                                        score: Number(val)
                                                    });
                                                    message.success('Skor berhasil disimpan');
                                                } catch(err) {
                                                    console.log(err);
                                                    message.error('Gagal menyimpan skor');
                                                }
                                            }}
                                        />
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
