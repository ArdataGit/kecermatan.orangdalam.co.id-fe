import { useState, useEffect } from 'react';

import useGetList from '@/hooks/use-get-list';
import { useParams } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';
import moment from 'moment/min/moment-with-locales';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getData } from '@/utils/axios';

export default function HistoryDetailLatihanKecermatanAdmin() {
  const { id, userId } = useParams();
  const [configKiasans, setConfigKiasans] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      const filter = JSON.stringify({ kategoriLatihanKecermatanId: Number(id) });
      getData(`latihan-kiasan/get?filters=${filter}&includeSoal=false`)
        .then((res) => {
          if (res?.list) {
            setConfigKiasans(res.list);
          }
        })
        .catch((err) => console.error("Failed to fetch kiasans config", err));
    }
  }, [id]);

  const listHistory = useGetList({
    url: 'kategori-latihan-kecermatan/history/detail',
    initialParams: {
      kategoriLatihanKecermatanId: id,
      userId: userId,
      skip: 0,
      take: 100,
      sortBy: 'createdAt',
      descending: true,
    },
  });

  // Helper functions for category details with descriptions and suggestions
  const getPankerCategory = (score: number) => {
    if (score >= 80) return {
        label: "Tinggi",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        desc: "Kecepatan kerja Anda tinggi. Ritme kerja cepat dan alur pengerjaan lancar sehingga output dapat dicapai dengan baik.",
        saran: "Pertahankan tempo dan jaga konsistensi dari awal hingga akhir. Pastikan kecepatan tidak menurunkan ketelitian."
    };
    if (score >= 60) return {
        label: "Cukup Tinggi",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        desc: "Kecepatan kerja Anda sudah baik. Namun masih ada bagian yang melambat sehingga hasil belum maksimal.",
        saran: "Kurangi jeda-jeda kecil dan perkuat ritme yang stabil. Tingkatkan target secara bertahap agar tempo naik tanpa mengganggu kontrol."
    };
    if (score >= 40) return {
        label: "Sedang",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        desc: "Kecepatan kerja Anda berada pada tingkat cukup. Anda mampu menyelesaikan tugas, tetapi tempo masih mudah turun saat ragu atau ketika ritme tidak stabil.",
        saran: "Bangun alur kerja yang konsisten dan hindari berhenti untuk memeriksa di tengah pengerjaan. Setelah ritme stabil, tingkatkan output sedikit demi sedikit."
    };
    if (score >= 20) return {
        label: "Rendah",
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        desc: "Kecepatan kerja Anda masih rendah. Tempo cenderung lambat sehingga hasil mudah tertinggal.",
        saran: "Fokus pada kelancaran dan ritme. Kurangi kebiasaan berhenti, jaga tempo yang sama, dan lakukan latihan rutin dengan target peningkatan kecil namun konsisten."
    };
    return {
        label: "Sangat Rendah",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        desc: "Kecepatan kerja Anda masih di bawah harapan. Terdapat jeda singkat yang sering berulang sehingga menghambat tempo.",
        saran: "Latih transisi yang lebih cepat dan kurangi jeda. Tetapkan target minimal yang realistis, stabilkan ritme terlebih dahulu, lalu tingkatkan secara bertahap."
    };
  };

  const getTiankerCategory = (score: number) => {
    if (score >= 80) return {
        label: "Tinggi",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        desc: "Ketelitian kerja Anda tinggi. Kesalahan sangat sedikit, menunjukkan fokus dan kontrol yang baik saat mengerjakan.",
        saran: "Pertahankan cara kerja yang rapi dan konsisten. Saat meningkatkan kecepatan, pastikan pola kerja tetap sama agar ketelitian tidak turun."
    };
    if (score >= 60) return {
        label: "Cukup Tinggi",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        desc: "Ketelitian kerja Anda sudah baik. Masih ada beberapa kesalahan, tetapi secara umum akurasi terjaga.",
        saran: "Identifikasi jenis kesalahan yang paling sering dilakukan. Kurangi sumber kesalahan itu dengan menjaga ritme dan fokus, tanpa terlalu lama berhenti."
    };
    if (score >= 40) return {
        label: "Sedang",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        desc: "Ketelitian kerja Anda cukup, namun kesalahan masih muncul cukup sering sehingga akurasi belum stabil.",
        saran: "Prioritaskan ketelitian dulu sebelum menaikkan tempo. Gunakan alur kerja yang konsisten dan hindari tergesa-gesa pada bagian yang sering menimbulkan salah."
    };
    if (score >= 20) return {
        label: "Rendah",
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        desc: "Ketelitian kerja Anda rendah. Kesalahan relatif banyak, menandakan fokus mudah terpecah atau kontrol pengerjaan belum kuat.",
        saran: "Turunkan tempo sedikit agar lebih terkontrol, lalu latih akurasi. Fokus pada satu pola kerja yang sama dan perbaiki penyebab kesalahan utama secara bertahap."
    };
    return {
        label: "Sangat Rendah",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        desc: "Ketelitian kerja Anda masih kurang. Kesalahan terjadi berulang sehingga hasil belum dapat diandalkan.",
        saran: "Perkuat kebiasaan kerja yang rapi, seperti baca dengan jelas, hitung singkat, lalu jawab. Kurangi kebiasaan menebak atau terburu-buru. Setelah kesalahan turun, baru naikkan kecepatan secara bertahap."
    };
  };



  const getHankerCategory = (score: number) => {
    if (score >= 80) return {
        label: "Tinggi",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        desc: "Ketahanan kerja Anda tinggi. Ritme konstan dari awal hingga akhir tanpa penurunan berarti. Anda mampu menjaga fokus dan kecepatan dalam waktu yang lama.",
        saran: "Pertahankan stamina dan metode kerja yang terbukti efektif. Jika tugas lebih berat, atur istirahat mikro yang singkat tanpa mengganggu konsentrasi penuh."
    };
    if (score >= 60) return {
        label: "Cukup Tinggi",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        desc: "Ketahanan kerja Anda cukup baik. Ritme cenderung stabil meski sedikit menurun di bagian tengah atau akhir.",
        saran: "Perhatikan bagian mana yang paling sering drop, lalu atur tempo agar tidak terlalu cepat di awal. Jaga fokus secara bertahap agar energi tidak habis lebih awal."
    };
    if (score >= 40) return {
        label: "Sedang",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        desc: "Ketahanan kerja Anda sedang. Ritme mulai turun cukup jelas di bagian tengah atau akhir. Anda mulai butuh istirahat lebih banyak atau konsentrasi yang lebih sering terputus.",
        saran: "Latih stamina dengan durasi kerja yang lebih panjang secara bertahap. Hindari tempo terlalu cepat di awal agar tidak cepat lelah. Jaga pola kerja yang konsisten agar energi tidak terkuras terlalu cepat."
    };
    if (score >= 20) return {
        label: "Rendah",
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        desc: "Ketahanan kerja Anda rendah. Penurunan tempo dan ketelitian cukup besar di bagian tengah atau akhir. Stamina cepat tergerus dan output menurun signifikan seiring waktu.",
        saran: "Kurangi beban dari awal dengan tempo yang tidak terlalu tinggi. Latih ketahanan dengan target durasi yang panjang, mulai dari yang ringan. Atur pola makan dan tidur agar kondisi fisik mendukung konsentrasi lebih lama."
    };
    return {
        label: "Sangat Rendah",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        desc: "Ketahanan kerja Anda sangat rendah. Penurunan drastis sejak awal atau tengah, menunjukkan stamina mudah habis dan konsentrasi cepat terpecah.",
        saran: "Perbaiki kondisi fisik dan mental secara bertahap. Mulai dengan durasi kerja pendek yang dapat diselesaikan dengan baik, lalu tingkatkan perlahan. Jaga pola istirahat dan konsumsi gizi yang baik agar energi lebih tahan lama."
    };
  };

  const getFinalCategory = (score: number) => {
    if (score >= 80) return {
        label: "Sangat Baik",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        desc: "Hasil kerja Anda sangat baik. Menunjukkan kombinasi kecepatan, ketelitian, keajegan, dan ketahanan yang tinggi."
    };
    if (score >= 60) return {
        label: "Baik",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        desc: "Hasil kerja Anda baik. Ada satu atau dua aspek yang dapat ditingkatkan untuk hasil lebih optimal."
    };
    if (score >= 40) return {
        label: "Cukup",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        desc: "Hasil kerja Anda cukup. Masih ada beberapa aspek yang perlu ditingkatkan untuk mencapai hasil yang lebih konsisten."
    };
    if (score >= 20) return {
        label: "Kurang",
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        desc: "Hasil kerja Anda kurang. Perlu peningkatan pada beberapa aspek kunci untuk mencapai hasil yang diharapkan."
    };
    return {
        label: "Sangat Kurang",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        desc: "Hasil kerja Anda masih kurang. Perlu latihan intensif pada semua aspek untuk mencapai hasil yang baik."
    };
  };

  const panker = listHistory.metadata ? getPankerCategory(listHistory.metadata.pankerScore || 0) : null;
  const tianker = listHistory.metadata ? getTiankerCategory(listHistory.metadata.tiankerScore || 0) : null;
  const hanker = listHistory.metadata ? getHankerCategory(listHistory.metadata.hankerScore || 0) : null;
  const finalCategory = listHistory.metadata ? getFinalCategory(listHistory.metadata.finalScore || 0) : null;

  return (
    <section className="p-4 md:p-8 bg-gray-50 min-h-screen font-['Poppins']">
      <BreadCrumb
        page={[
          { name: 'Latihan Kecermatan', link: '/manage-latihan-kecermatan' },
          { name: 'Riwayat Pengerjaan', link: `/manage-latihan-kecermatan/${id}/history` },
          { name: 'Detail User', link: '#' },
        ]}
      />

      <div className="bg-white p-6 md:p-8 rounded-2xl min-w-[400px] shadow-sm border border-gray-100">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full mt-2 mb-6">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-xl text-indigo-950 font-bold mb-5 ">
              Detail Pengerjaan User (ID: {userId})
            </h1>
          </div>
        </div>

        {/* Ranking Scores Summary */}
        {listHistory.metadata && (
          <div className="mb-8 bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border-2 border-orange-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-orange-600">📊</span> Analisis & Nilai
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* PANKER */}
              <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">PANKER (Kecepatan)</p>
                <p className="text-2xl font-bold text-orange-600">{listHistory.metadata.pankerScore?.toFixed(2) || '0.00'}</p>
                <p className="text-sm font-semibold text-gray-600 mt-1">{listHistory.metadata.pankerCategory || '-'}</p>
              </div>

              {/* TIANKER */}
              <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">TIANKER (Ketelitian)</p>
                <p className="text-2xl font-bold text-orange-600">{listHistory.metadata.tiankerScore?.toFixed(2) || '0.00'}</p>
                <p className="text-sm font-semibold text-gray-600 mt-1">{listHistory.metadata.tiankerCategory || '-'}</p>
              </div>



              {/* HANKER */}
              <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">HANKER (Ketahanan)</p>
                <p className="text-2xl font-bold text-orange-600">{listHistory.metadata.hankerScore?.toFixed(2) || '0.00'}</p>
                <p className="text-sm font-semibold text-gray-600 mt-1">{listHistory.metadata.hankerCategory || '-'}</p>
              </div>

              {/* Total Scores */}
              <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-sm text-gray-600">Benar:</p>
                  <p className="text-lg font-bold text-green-600">{listHistory.metadata.totalBenar || 0}</p>
                  <p className="text-sm text-gray-600">/ {listHistory.metadata.totalSoal || 0}</p>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-sm text-gray-600">Salah:</p>
                  <p className="text-lg font-bold text-red-600">{listHistory.metadata.totalSalah || 0}</p>
                </div>
              </div>

              {/* Final Score */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg shadow-md text-white">
                <p className="text-xs uppercase tracking-wide mb-1 opacity-90">Nilai Akhir</p>
                <p className="text-3xl font-bold">{listHistory.metadata.finalScore?.toFixed(2) || '0.00'}</p>
                <p className="text-sm font-semibold mt-1">{listHistory.metadata.finalCategory || '-'}</p>
              </div>
            </div>

            <div className="text-xs text-gray-500 italic mt-2">
              * Skor dihitung berdasarkan: Kecepatan (PANKER), Ketelitian (TIANKER), dan Ketahanan (HANKER)
            </div>
          </div>
        )}

        {/* Detailed Descriptions and Suggestions */}
        {listHistory.metadata && panker && tianker && hanker && (
          <div className="mb-8 space-y-4">
            <h3 className="text-md font-bold text-gray-700 mb-4 border-b border-gray-200 pb-2">Analisis Detail & Saran Perbaikan</h3>
            
            {/* PANKER Details */}
            <div className={`p-5 rounded-lg border ${panker.bg} ${panker.border}`}>
              <h3 className={`font-bold text-md mb-2 ${panker.color} flex items-center gap-2`}>
                <span className="px-2 py-0.5 rounded bg-white/50 text-xs border border-current">PANKER</span> 
                {panker.label}
              </h3>
              <p className="text-gray-700 text-sm mb-2">{panker.desc}</p>
              <p className="text-gray-500 text-xs italic"><span className="font-semibold not-italic">Saran:</span> {panker.saran}</p>
            </div>

            {/* TIANKER Details */}
            <div className={`p-5 rounded-lg border ${tianker.bg} ${tianker.border}`}>
              <h3 className={`font-bold text-md mb-2 ${tianker.color} flex items-center gap-2`}>
                <span className="px-2 py-0.5 rounded bg-white/50 text-xs border border-current">TIANKER</span> 
                {tianker.label}
              </h3>
              <p className="text-gray-700 text-sm mb-2">{tianker.desc}</p>
              <p className="text-gray-500 text-xs italic"><span className="font-semibold not-italic">Saran:</span> {tianker.saran}</p>
            </div>


            {/* HANKER Details */}
            <div className={`p-5 rounded-lg border ${hanker.bg} ${hanker.border}`}>
              <h3 className={`font-bold text-md mb-2 ${hanker.color} flex items-center gap-2`}>
                <span className="px-2 py-0.5 rounded bg-white/50 text-xs border border-current">HANKER</span> 
                {hanker.label}
              </h3>
              <p className="text-gray-700 text-sm mb-2">{hanker.desc}</p>
              <p className="text-gray-500 text-xs italic"><span className="font-semibold not-italic">Saran:</span> {hanker.saran}</p>
            </div>

            {/* Final Score Details */}
            {finalCategory && (
              <div className={`p-5 rounded-lg border-2 ${finalCategory.bg} ${finalCategory.border}`}>
                <h3 className={`font-bold text-lg mb-2 ${finalCategory.color} flex items-center gap-2`}>
                  <span className="text-xl">🏆</span> Nilai Akhir: {finalCategory.label}
                </h3>
                <p className="text-gray-700 text-sm">{finalCategory.desc}</p>
              </div>
            )}
          </div>
        )}

        {/* Performance Progression Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-orange-600">📈</span> Grafik Performa Pengerjaan
            </h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={(() => {
                            // Ensure exactly 10 columns
                            const chartData = [];
                            
                            // Map existing history to their kiasan IDs for easier lookup
                            const historyByKiasanId = new Map();
                            listHistory.list.forEach((item: any) => {
                                const kiasanId = item.latihanKiasan?.id;
                                if (!kiasanId) return;
                                
                                if (!historyByKiasanId.has(kiasanId)) {
                                    historyByKiasanId.set(kiasanId, { correct: 0, answered: 0 });
                                }
                                
                                const stats = historyByKiasanId.get(kiasanId);
                                stats.answered++;
                                if (item.jawaban === item.soalLatihanKecermatan?.jawaban) {
                                    stats.correct++;
                                }
                            });

                            // Always create 10 data points
                            for (let i = 0; i < 10; i++) {
                                // Attempt to find the corresponding kiasan by order
                                const kiasan = configKiasans[i];
                                let correct = 0;
                                let answered = 0;

                                if (kiasan && historyByKiasanId.has(kiasan.id)) {
                                    const stats = historyByKiasanId.get(kiasan.id);
                                    correct = stats.correct;
                                    answered = stats.answered;
                                }

                                chartData.push({
                                    name: `Kolom ${i + 1}`,
                                    'Soal Terjawab': answered,
                                    'Soal Benar': correct,
                                    'Soal Salah': answered - correct
                                });
                            }

                            return chartData;
                        })()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="name" 
                            stroke="#666"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                            stroke="#666"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #ccc', 
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                        />
                        <Legend 
                            wrapperStyle={{ fontSize: '12px' }}
                            iconType="line"
                        />
                        <Line 
                            type="monotone" 
                            dataKey="Soal Terjawab" 
                            stroke="#3B82F6" 
                            strokeWidth={2.5}
                            dot={{ fill: '#3B82F6', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="Soal Benar" 
                            stroke="#10B981" 
                            strokeWidth={2.5}
                            dot={{ fill: '#10B981', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="Soal Salah" 
                            stroke="#EF4444" 
                            strokeWidth={2.5}
                            dot={{ fill: '#EF4444', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 italic mt-4 text-center">
                * Grafik menunjukkan perbandingan soal terjawab, benar, dan salah per kolom
            </p>
        </div>

        <h3 className="text-md font-bold text-gray-700 mb-4 border-b border-gray-200 pb-2">Detail Jawaban</h3>
        
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
                                           <p className="text-xs text-gray-500 uppercase">Jawaban User</p>
                                           <p className="text-xl font-bold text-indigo-900">{item.jawaban}</p>
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
