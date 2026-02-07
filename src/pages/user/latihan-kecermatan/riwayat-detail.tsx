
import useGetList from '@/hooks/use-get-list';
import { useParams } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';
import moment from 'moment/min/moment-with-locales';
import { useAuthStore } from '@/stores/auth-store';

export default function RiwayatLatihanKecermatanDetail() {
  const { id } = useParams(); // This is the Kategori ID
  const { user } = useAuthStore();

  const listHistory = useGetList({
    url: 'kategori-latihan-kecermatan/history/detail',
    initialParams: {
      kategoriLatihanKecermatanId: id,
      userId: user?.id,
      skip: 0,
      take: 100,
      sortBy: 'createdAt',
      descending: true,
    },
  });

  return (
    <section className="p-4 md:p-8 bg-gray-50 min-h-screen font-['Poppins']">
      <BreadCrumb
        page={[
          { name: 'Latihan Kecermatan', link: '/latihan-kecermatan' },
          { name: 'Riwayat', link: '/latihan-kecermatan/riwayat' },
          { name: 'Detail', link: '#' },
        ]}
      />

      <div className="bg-white p-6 md:p-8 rounded-2xl min-w-[400px] shadow-sm border border-gray-100">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full mt-2 mb-6">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-xl text-[#C2410C] font-bold mb-5 ">
              Detail Riwayat Pengerjaan
            </h1>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
             {listHistory.isLoading && <div>Loading...</div>}
             {!listHistory.isLoading && listHistory.list.length === 0 && <div>Belum ada data detail.</div>}
             
             {listHistory.list.map((item: any, index: number) => {
                 const kiasanChar = item.latihanKiasan?.kiasan || []; 
                 const kiasanKeys = ['A', 'B', 'C', 'D', 'E'].slice(0, kiasanChar.length);
                 
                 const soalChars = item.soalLatihanKecermatan?.soal || [];
                 const parsedSoal = typeof soalChars === 'string' ? JSON.parse(soalChars) : soalChars;

                 const isCorrect = item.jawaban === item.soalLatihanKecermatan?.jawaban;

                 return (
                     <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-2">
                              <div>
                                  <span className="font-bold text-gray-500 mr-2">No. {index + 1}</span>
                                  <span className="text-sm text-gray-400">{moment(item.createdAt).locale('id').format('LL HH:mm:ss')}</span>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-bold ${isCorrect ? 'bg-orange-100 text-[#C2410C]' : 'bg-red-100 text-red-800'}`}>
                                  {isCorrect ? 'Benar' : 'Salah'}
                              </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Kiasan Info */}
                              <div className="bg-gray-50 p-4 rounded-md">
                                  <p className="font-semibold text-sm mb-2 text-gray-600">Kiasan</p>
                                  <div className="flex flex-col gap-2">
                                      <div className="flex gap-1 justify-center">
                                          {Array.isArray(kiasanChar) && kiasanChar.map((char: string, i: number) => (
                                              <div key={i} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 font-bold text-sm text-gray-800">{char}</div>
                                          ))}
                                      </div>
                                      <div className="flex gap-1 justify-center">
                                            {Array.isArray(kiasanKeys) && kiasanKeys.map((key: string, i: number) => (
                                              <div key={i} className="w-8 h-8 flex items-center justify-center text-[#F97316] font-bold text-lg">{key}</div>
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
                                           <p className="text-xl font-bold text-[#F97316]">{item.jawaban}</p>
                                       </div>
                                       <div>
                                           <p className="text-xs text-gray-500 uppercase">Kunci Jawaban</p>
                                           <p className="text-xl font-bold text-gray-700">{item.soalLatihanKecermatan?.jawaban}</p>
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
