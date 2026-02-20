
import useGetList from '@/hooks/use-get-list';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';
import moment from 'moment/min/moment-with-locales';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function HistoryDetailKecermatanAdmin() {
  const { id, userId } = useParams();

  const listHistory = useGetList({
    url: 'admin/kategori-soal-kecermatan/history/detail',
    initialParams: {
      kategoriSoalKecermatanId: id,
      userId: userId,
      skip: 0,
      take: 100,
      sortBy: 'createdAt',
      descending: true,
    },
  });

  // Helper functions for category details - UPDATED THRESHOLDS
  const getPankerCategory = (score: number) => {
    if (score >= 88) return { label: "Tinggi", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", desc: "Kecepatan kerja Anda tinggi. Ritme kerja cepat dan alur pengerjaan lancar sehingga output dapat dicapai dengan baik.", saran: "Pertahankan tempo dan jaga konsistensi dari awal hingga akhir. Pastikan kecepatan tidak menurunkan ketelitian." };
    if (score >= 77) return { label: "Cukup Tinggi", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", desc: "Kecepatan kerja Anda sudah baik. Namun masih ada bagian yang melambat sehingga hasil belum maksimal.", saran: "Kurangi jeda-jeda kecil and perkuat ritme yang stabil. Tingkatkan target secara bertahap agar tempo naik tanpa mengganggu kontrol." };
    if (score >= 60) return { label: "Sedang", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", desc: "Kecepatan kerja Anda berada pada tingkat cukup. Anda mampu menyelesaikan tugas, tetapi tempo masih mudah turun saat ragu atau ketika ritme tidak stabil.", saran: "Bangun alur kerja yang konsisten and hindari berhenti untuk memeriksa di tengah pengerjaan. Setelah ritme stabil, tingkatkan output sedikit demi sedikit." };
    if (score >= 50) return { label: "Rendah", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", desc: "Kecepatan kerja Anda masih rendah. Tempo cenderung lambat sehingga hasil mudah tertinggal.", saran: "Fokus pada kelancaran and ritme. Kurangi kebiasaan berhenti, jaga tempo yang sama, and lakukan latihan rutin dengan target peningkatan kecil namun konsisten." };
    return { label: "Sangat Rendah", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", desc: "Kecepatan kerja Anda masih di bawah harapan. Terdapat jeda singkat yang sering berulang sehingga menghambat tempo.", saran: "Latih transisi yang lebih cepat and kurangi jeda. Tetapkan target minimal yang realistis, stabilkan ritme terlebih dahulu, lalu tingkatkan secara bertahap." };
  };

  const getTiankerCategory = (score: number) => {
    if (score >= 88) return { label: "Tinggi", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", desc: "Ketelitian kerja Anda tinggi. Kesalahan sangat sedikit, menunjukkan fokus and kontrol yang baik saat mengerjakan.", saran: "Pertahankan cara kerja yang rapi and konsisten. Saat meningkatkan kecepatan, pastikan pola kerja tetap sama agar ketelitian tidak turun." };
    if (score >= 77) return { label: "Cukup Tinggi", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", desc: "Ketelitian kerja Anda sudah baik. Masih ada beberapa kesalahan, tetapi secara umum akurasi terjaga.", saran: "Identifikasi jenis kesalahan yang paling sering dilakukan. Kurangi sumber kesalahan itu with menjaga ritme and fokus, tanpa terlalu lama berhenti." };
    if (score >= 60) return { label: "Sedang", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", desc: "Ketelitian kerja Anda cukup, namun kesalahan masih muncul cukup sering sehingga akurasi belum stabil.", saran: "Prioritaskan ketelitian dulu sebelum menaikkan tempo. Gunakan alur kerja yang konsisten and hindari tergesa-gesa pada bagian yang sering menimbulkan salah." };
    if (score >= 50) return { label: "Rendah", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", desc: "Ketelitian kerja Anda rendah. Kesalahan relatif banyak, menandakan fokus mudah terpecah or kontrol pengerjaan belum kuat.", saran: "Turunkan tempo sedikit agar lebih terkontrol, lalu latih akurasi. Fokus pada satu pola kerja yang sama and perbaiki penyebab kesalahan utama secara bertahap." };
    return { label: "Sangat Rendah", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", desc: "Ketelitian kerja Anda masih kurang. Kesalahan terjadi berulang sehingga hasil belum dapat diandalkan.", saran: "Perkuat kebiasaan kerja yang rapi, seperti baca with jelas, hitung singkat, lalu jawab. Kurangi kebiasaan menebak or terburu-buru. Setelah kesalahan turun, baru naikkan kecepatan secara bertahap." };
  };



  const getHankerCategory = (score: number) => {
    if (score >= 88) return { label: "Tinggi", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", desc: "Ketahanan kerja Anda tinggi. Ritme konstan dari awal hingga akhir tanpa penurunan berarti. Anda mampu menjaga fokus and kecepatan dalam waktu yang lama.", saran: "Pertahankan stamina and metode kerja yang terbukti efektif. Jika tugas lebih berat, atur istirahat mikro yang singkat tanpa mengganggu konsentrasi penuh." };
    if (score >= 77) return { label: "Cukup Tinggi", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", desc: "Ketahanan kerja Anda cukup baik. Performa umumnya terjaga, meskipun ada sedikit penurunan pada bagian tertentu.", saran: "Perhatikan bagian mana yang paling sering drop, lalu atur tempo agar tidak terlalu cepat di awal. Jaga fokus secara bertahap agar energi tidak habis lebih awal." };
    if (score >= 60) return { label: "Sedang", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", desc: "Ketahanan kerja Anda sedang. Ritme mulai turun cukup jelas di bagian tengah or akhir. Anda mulai butuh istirahat lebih banyak or konsentrasi yang lebih sering terputus.", saran: "Latih stamina with durasi kerja yang lebih panjang secara bertahap. Hindari tempo terlalu cepat di awal agar tidak cepat lelah. Jaga pola kerja yang konsisten agar energi tidak terkuras terlalu cepat." };
    if (score >= 50) return { label: "Rendah", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", desc: "Ketahanan kerja Anda rendah. Penurunan tempo and ketelitian cukup besar di bagian tengah or akhir. Stamina cepat tergerus and output menurun signifikan seiring waktu.", saran: "Kurangi beban dari awal with tempo yang tidak terlalu tinggi. Latih ketahanan with target durasi yang panjang, mulai dari yang ringan. Atur pola makan and tidur agar kondisi fisik mendukung konsentrasi lebih lama." };
    return { label: "Sangat Rendah", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", desc: "Ketahanan kerja Anda sangat rendah. Penurunan drastis sejak awal or tengah, menunjukkan stamina mudah habis and konsentrasi cepat terpecah.", saran: "Perbaiki kondisi fisik and mental secara bertahap. Mulai with durasi kerja pendek yang dapat diselesaikan with baik, lalu tingkatkan perlahan. Jaga pola istirahat and konsumsi gizi yang baik agar energi lebih tahan lama." };
  };

  const getFinalCategory = (score: number) => {
    if (score >= 88) return { label: "Tinggi", color: "text-green-700", bg: "bg-green-100", border: "border-green-300", desc: "Hasil akhir sangat kuat. Konsistensi terjaga with baik." };
    if (score >= 77) return { label: "Cukup Tinggi", color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-300", desc: "Hasil akhir sudah baik. Performa stabil di sebagian besar bagian." };
    if (score >= 60) return { label: "Sedang", color: "text-yellow-700", bg: "bg-yellow-100", border: "border-yellow-300", desc: "Hasil akhir cukup. Masih ada ruang untuk peningkatan performa secara keseluruhan." };
    if (score >= 50) return { label: "Rendah", color: "text-orange-700", bg: "bg-orange-100", border: "border-orange-300", desc: "Hasil akhir masih rendah. Fokus pada peningkatan akurasi and kecepatan." };
    return { label: "Sangat Rendah", color: "text-red-700", bg: "bg-red-100", border: "border-red-300", desc: "Hasil akhir masih di bawah target. Perlu latihan intensif untuk membangun ritme." };
  };

  // Calculate stats from history using 10-bucket logic
  const stats = useMemo(() => {
    if (!listHistory.list || listHistory.list.length === 0) return null;

    // Group by kiasanId to identify columns
    const kiasanGroups: any = {};
    listHistory.list.forEach((item: any) => {
        const kid = item.kiasanId;
        if (!kiasanGroups[kid]) kiasanGroups[kid] = [];
        kiasanGroups[kid].push(item);
    });

    // Sort kiasan IDs to determine column order
    const kiasanIds = Object.keys(kiasanGroups).sort((a,b) => Number(a) - Number(b));
    const totalColumnsFound = kiasanIds.length;
    
    // Standardize into 10 buckets
    const buckets = Array.from({ length: 10 }, () => ({ sumCorrect: 0, sumAnswered: 0, count: 0 }));
    
    kiasanIds.forEach((kid, idx) => {
        const group = kiasanGroups[kid];
        const correctInColumn = group.filter((item: any) => item.jawaban === item.soalKecermatan?.jawaban).length;
        const answeredInColumn = group.length;
        
        const bucketIdx = Math.floor((idx / totalColumnsFound) * 10);
        if (bucketIdx < 10) {
            buckets[bucketIdx].sumCorrect += correctInColumn;
            buckets[bucketIdx].sumAnswered += answeredInColumn;
            buckets[bucketIdx].count++;
        }
    });

    // Standard Deviation Helper
    const calculateStdev = (array: number[]) => {
        const n = array.length;
        if (n === 0) return 0;
        const mean = array.reduce((a, b) => a + b, 0) / n;
        const variance = array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n;
        return Math.sqrt(variance);
    };

    // 1. PANKER (Kecepatan)
    const bucketAverages = buckets.map(b => b.count > 0 ? (b.sumCorrect / b.count) : 0);
    const bucketScoresPanker = bucketAverages.map(avg => (avg / 50) * 100);
    let convertedScore = bucketScoresPanker.reduce((sum, s) => sum + s, 0) / 10;
    convertedScore = Math.min(Math.max(convertedScore, 0), 100);

    // 2. TIANKER (Ketelitian)
    const totalCorrectAcrossAll = listHistory.list.filter((item: any) => item.jawaban === item.soalKecermatan?.jawaban).length;
    const totalAnswered = listHistory.list.length;
    const totalWrong = totalAnswered - totalCorrectAcrossAll;
    let convertedScoreTianker = 0;
    if (totalAnswered > 0) {
        convertedScoreTianker = ((totalCorrectAcrossAll / totalAnswered) * 100) - (totalWrong * 2);
    }
    convertedScoreTianker = Math.max(0, convertedScoreTianker);

    // 3. HANKER (Ketahanan)
    // Formula: MAX(0; (MIN(100; (AVERAGE(soal terjawab)/45)*100)) - (STDEV(soal terjawab)*8))
    const bucketAnsweredAverages = buckets.map(b => b.count > 0 ? (b.sumAnswered / b.count) : 0);
    const avgAnswered = bucketAnsweredAverages.reduce((a, b) => a + b, 0) / 10;
    const stdevAnswered = calculateStdev(bucketAnsweredAverages);
    
    let normalizedAvg = (avgAnswered / 45) * 100;
    normalizedAvg = Math.min(100, normalizedAvg);
    
    let convertedScoreHanker = normalizedAvg - (stdevAnswered * 8);
    convertedScoreHanker = Math.max(0, convertedScoreHanker);

    const finalScore = (convertedScore * 0.45) + (convertedScoreTianker * 0.45) + (convertedScoreHanker * 0.10);

    return {
      totalBenar: totalCorrectAcrossAll,
      totalSalah: totalWrong,
      totalSoal: totalAnswered,
      finalScore,
      pankerScore: convertedScore,
      tiankerScore: convertedScoreTianker,
      hankerScore: convertedScoreHanker,
    };
  }, [listHistory.list]);

  const panker = stats ? getPankerCategory(stats.pankerScore) : null;
  const tianker = stats ? getTiankerCategory(stats.tiankerScore) : null;
  const hanker = stats ? getHankerCategory(stats.hankerScore) : null;
  const finalCategory = stats ? getFinalCategory(stats.finalScore) : null;

  return (
    <section className="p-4 md:p-8 bg-gray-50 min-h-screen font-['Poppins']">
      <BreadCrumb
        page={[
          { name: 'Bank Soal Kecermatan', link: '/manage-soal-kecermatan' },
          { name: 'Riwayat Pengerjaan', link: `/manage-soal-kecermatan/${id}/history` },
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
        {stats && (
          <div className="mb-8 bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border-2 border-orange-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-orange-600">📊</span> Analisis & Nilai
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* PANKER */}
              <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">PANKER (Kecepatan)</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pankerScore?.toFixed(0) || '0'}</p>
                <p className="text-sm font-semibold text-gray-600 mt-1">{panker?.label || '-'}</p>
              </div>

              {/* TIANKER */}
              <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">TIANKER (Ketelitian)</p>
                <p className="text-2xl font-bold text-orange-600">{stats.tiankerScore?.toFixed(0) || '0'}</p>
                <p className="text-sm font-semibold text-gray-600 mt-1">{tianker?.label || '-'}</p>
              </div>

              {/* HANKER */}
              <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">HANKER (Ketahanan)</p>
                <p className="text-2xl font-bold text-orange-600">{stats.hankerScore?.toFixed(0) || '0'}</p>
                <p className="text-sm font-semibold text-gray-600 mt-1">{hanker?.label || '-'}</p>
              </div>

              {/* Total Scores */}
              <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-sm text-gray-600">Benar:</p>
                  <p className="text-lg font-bold text-green-600">{stats.totalBenar || 0}</p>
                  <p className="text-sm text-gray-600">/ {stats.totalSoal || 0}</p>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-sm text-gray-600">Salah:</p>
                  <p className="text-lg font-bold text-red-600">{stats.totalSalah || 0}</p>
                </div>
              </div>

              {/* Final Score */}
              <div className="bg-gradient-to-br from-[#d97706] to-[#b45309] p-4 rounded-lg shadow-md text-white">
                <p className="text-xs uppercase tracking-wide mb-1 opacity-90">Nilai Akhir</p>
                <p className="text-3xl font-bold">{stats.finalScore?.toFixed(0) || '0'}</p>
                <p className="text-sm font-semibold mt-1">{finalCategory?.label || '-'}</p>
              </div>
            </div>

            <div className="text-xs text-gray-500 italic mt-2">
              * Skor dihitung berdasarkan: Kecepatan (PANKER), Ketelitian (TIANKER), dan Ketahanan (HANKER)
            </div>
          </div>
        )}

        {stats && panker && tianker && hanker && (
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
        {listHistory.list.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-orange-600">📈</span> Grafik Performa Pengerjaan
              </h3>
              <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                          data={(() => {
                              // Group answers by kiasanId to calculate stats per column
                              const kiasanMap = new Map();
                              
                              listHistory.list.forEach((item: any) => {
                                  const kiasanId = item.kiasan?.id;
                                  if (!kiasanId) return;
                                  
                                  if (!kiasanMap.has(kiasanId)) {
                                      kiasanMap.set(kiasanId, {
                                          kiasan: item.kiasan,
                                          answered: 0,
                                          correct: 0,
                                          wrong: 0
                                      });
                                  }
                                  
                                  const stats = kiasanMap.get(kiasanId);
                                  stats.answered++;
                                  
                                  if (item.jawaban === item.soalKecermatan?.jawaban) {
                                      stats.correct++;
                                  } else {
                                      stats.wrong++;
                                  }
                              });
                              
                              // Convert to array and sort by kiasan order
                              return Array.from(kiasanMap.values())
                                  .map((stats, idx) => ({
                                      name: `Kolom ${idx + 1}`,
                                      'Soal Terjawab': stats.answered,
                                      'Soal Benar': stats.correct,
                                      'Soal Salah': stats.wrong
                                  }));
                          })()}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                              dataKey="name" 
                              stroke="#666"
                              style={{ fontSize: '12px' }}
                              label={{ value: 'Jumlah Kolom', position: 'insideBottom', offset: -5, style: { fontSize: '12px', fill: '#666' } }}
                          />
                          <YAxis 
                              stroke="#666"
                              style={{ fontSize: '12px' }}
                              label={{ value: 'Jumlah Soal', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#666' } }}
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
        )}

        <h3 className="text-md font-bold text-gray-700 mb-4 border-b border-gray-200 pb-2">Detail Jawaban</h3>
        
        <div className="flex flex-col gap-4">
             {listHistory.isLoading && <div>Loading...</div>}
             {!listHistory.isLoading && listHistory.list.length === 0 && <div>Belum ada data detail.</div>}
             
             {listHistory.list.map((item: any, index: number) => {
                 const kiasanChar = item.kiasan?.karakter || []; 
                 const kiasanKeys = item.kiasan?.kiasan || [];
                 const soalChars = item.soalKecermatan?.soal || [];
                 const parsedSoal = typeof soalChars === 'string' ? JSON.parse(soalChars) : soalChars;

                 const isCorrect = item.jawaban === item.soalKecermatan?.jawaban;

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
                                  <p className="font-semibold text-sm mb-2 text-gray-600">Kiasan (ID: {item.kiasanId})</p>
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
