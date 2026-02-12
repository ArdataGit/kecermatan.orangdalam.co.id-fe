
import useGetList from '@/hooks/use-get-list';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import BreadCrumb from '@/components/breadcrumb';
import { getData } from '@/utils/axios';
import moment from 'moment/min/moment-with-locales';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Switch, Select } from 'tdesign-react';

export default function DetailRiwayatKecermatanUser() {
  const { id, kategoriId } = useParams();
  const [data, setData] = useState<any>({});
  const [showDetailJawaban, setShowDetailJawaban] = useState(false);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(0);


  const listHistory = useGetList({
    url: 'user/paket-pembelian-kecermatan/get-history',
    initialParams: {
      kategoriSoalKecermatanId: kategoriId,
      skip: 0,
      take: 100,
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

  // Helper functions for category details
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

  const getJankerCategory = (score: number) => {
    if (score >= 80) return {
        label: "Tinggi",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        desc: "Kestabilan kerja Anda tinggi. Hasil antar bagian cenderung merata dan tidak banyak naik-turun, menunjukkan ritme dan kontrol kerja yang baik.",
        saran: "Pertahankan ritme yang konsisten. Saat meningkatkan kecepatan, pastikan kenaikan dilakukan bertahap agar stabilitas tetap terjaga."
    };
    if (score >= 60) return {
        label: "Cukup Tinggi",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        desc: "Kestabilan kerja Anda sudah baik. Ada sedikit fluktuasi, tetapi secara umum ritme masih terkontrol.",
        saran: "Perkecil fluktuasi dengan menjaga tempo yang sama dan mengurangi jeda saat transisi. Fokus pada konsistensi, bukan mengejar lonjakan output di satu bagian."
    };
    if (score >= 40) return {
        label: "Sedang",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        desc: "Kestabilan kerja Anda cukup. Performa masih naik-turun, sehingga hasil belum sepenuhnya konsisten.",
        saran: "Bangun ritme yang lebih stabil. Jaga tempo yang sama di setiap bagian, hindari perubahan kecepatan yang terlalu drastis, dan fokus pada alur kerja yang terus mengalir."
    };
    if (score >= 20) return {
        label: "Rendah",
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        desc: "Kestabilan kerja Anda rendah. Fluktuasi hasil cukup besar, menandakan ritme mudah berubah dan fokus belum stabil.",
        saran: "Prioritaskan konsistensi tempo. Kurangi kebiasaan berhenti atau mempercepat secara tiba-tiba. Latih menjaga ritme konstan dan evaluasi bagian yang sering turun."
    };
    return {
        label: "Sangat Rendah",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        desc: "Kestabilan kerja Anda masih kurang. Hasil sering berubah-ubah sehingga kontrol ritme belum terbentuk.",
        saran: "Latih pola kerja yang sama dari awal sampai akhir. Pertahankan tempo yang realistis dan stabil, lalu tingkatkan secara bertahap setelah fluktuasi berkurang."
    };
  };

  const getHankerCategory = (score: number) => {
    if (score >= 80) return {
        label: "Tinggi",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        desc: "Ketahanan kerja Anda tinggi. Anda mampu menjaga performa sampai akhir tanpa penurunan berarti, menunjukkan daya tahan fokus yang baik.",
        saran: "Pertahankan pola kerja yang stabil. Pastikan ritme tetap sama dan hindari memaksakan tempo terlalu tinggi di awal agar tidak turun di akhir."
    };
    if (score >= 60) return {
        label: "Cukup Tinggi",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        desc: "Ketahanan kerja Anda cukup baik. Performa umumnya terjaga, meskipun ada sedikit penurunan pada bagian tertentu.",
        saran: "Perkuat daya tahan dengan menjaga ritme yang konsisten dan mengurangi jeda kecil saat mulai lelah. Tingkatkan durasi latihan secara bertahap agar fokus lebih tahan."
    };
    if (score >= 40) return {
        label: "Sedang",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        desc: "Ketahanan kerja Anda berada pada tingkat cukup. Performa masih dapat dipertahankan, tetapi mulai terlihat penurunan ketika pekerjaan berlangsung lebih lama.",
        saran: "Fokus pada menjaga tempo yang realistis sejak awal. Hindari terlalu cepat di awal lalu turun. Latih konsistensi ritme dan perbaiki kebiasaan yang membuat cepat lelah, seperti sering ragu atau berhenti."
    };
    if (score >= 20) return {
        label: "Rendah",
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        desc: "Ketahanan kerja Anda rendah. Penurunan performa terlihat jelas pada bagian akhir, menandakan fokus cepat menurun atau mudah lelah.",
        saran: "Bangun ketahanan bertahap. Mulai dari tempo yang lebih terkontrol, jaga ritme stabil, dan lakukan latihan rutin agar daya tahan meningkat. Evaluasi bagian akhir untuk melihat penyebab turunnya performa."
    };
    return {
        label: "Sangat Rendah",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        desc: "Ketahanan kerja Anda masih kurang. Performa cenderung turun cukup cepat sehingga hasil akhir tidak stabil.",
        saran: "Terapkan strategi menjaga tenaga, yakni ritme stabil, minim jeda yang tidak perlu, dan tidak memaksakan tempo tinggi di awal. Tingkatkan latihan secara bertahap sampai penurunan di akhir berkurang."
    };
  };

  // Calculate stats from history
  const stats = useMemo(() => {
    if (!listHistory.list || listHistory.list.length === 0) return null;

    // Group by kiasanId to identify columns
    const kiasanGroups = listHistory.list.reduce((acc: any, item: any) => {
      if (!acc[item.kiasanId]) acc[item.kiasanId] = [];
      acc[item.kiasanId].push(item);
      return acc;
    }, {});

    const totalColumns = Object.keys(kiasanGroups).length;
    let totalCorrectAll = 0;
    let totalQuestionsAll = listHistory.list.length;
    let sumCorrectPerColumn = 0;
    const correctCounts: number[] = [];

    Object.values(kiasanGroups).forEach((group: any) => {
      const correctInColumn = group.filter((item: any) => item.jawaban === item.soalKecermatan?.jawaban).length;
      correctCounts.push(correctInColumn);
      sumCorrectPerColumn += correctInColumn;
      totalCorrectAll += correctInColumn;
    });

    const rawScore = totalColumns > 0 ? (sumCorrectPerColumn / totalColumns) : 0;
    const avgQuestionsPerColumn = totalColumns > 0 ? (totalQuestionsAll / totalColumns) : 1;
    let convertedScore = (rawScore / avgQuestionsPerColumn) * 100;
    convertedScore = Math.min(Math.max(convertedScore, 0), 100);

    const totalWrong = totalQuestionsAll - totalCorrectAll;
    const rawScoreTianker = totalQuestionsAll > 0 ? (totalWrong / totalQuestionsAll) : 0;
    const convertedScoreTianker = Math.min(100, Math.max(0, (1 - rawScoreTianker) * 100));

    let variance = 0;
    if (totalColumns > 1) {
      const sumSqDiff = correctCounts.reduce((acc, val) => acc + Math.pow(val - rawScore, 2), 0);
      variance = sumSqDiff / (totalColumns - 1);
    }
    const rawScoreJanker = Math.sqrt(variance);
    const jankerDenominator = 26.3523138347;
    let convertedScoreJanker = (1 - (rawScoreJanker / jankerDenominator)) * 100;
    convertedScoreJanker = Math.min(100, Math.max(0, convertedScoreJanker));

    let rawScoreHanker = 0;
    if (totalColumns >= 3) {
      const avgFirst3 = (correctCounts[0] + correctCounts[1] + correctCounts[2]) / 3;
      const avgLast3 = (correctCounts[totalColumns - 1] + correctCounts[totalColumns - 2] + correctCounts[totalColumns - 3]) / 3;
      rawScoreHanker = avgLast3 - avgFirst3;
    }
    let convertedScoreHanker = Math.min(100, Math.max(0, rawScoreHanker + 50));

    const finalScore = (convertedScore * 0.35) + (convertedScoreTianker * 0.35) + (convertedScoreJanker * 0.20) + (convertedScoreHanker * 0.10);

    return {
      totalBenar: totalCorrectAll,
      totalSalah: totalWrong,
      totalSoal: totalQuestionsAll,
      finalScore,
      pankerScore: convertedScore,
      tiankerScore: convertedScoreTianker,
      jankerScore: convertedScoreJanker,
      hankerScore: convertedScoreHanker,
    };
  }, [listHistory.list]);

  const panker = stats ? getPankerCategory(stats.pankerScore) : null;
  const tianker = stats ? getTiankerCategory(stats.tiankerScore) : null;
  const janker = stats ? getJankerCategory(stats.jankerScore) : null;
  const hanker = stats ? getHankerCategory(stats.hankerScore) : null;


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
          { name: 'Riwayat', link: `/my-class/${id}/kecermatan/${kategoriId}/riwayat` },
          { name: 'Detail', link: '#' },
        ]}
      />

      <div className="bg-white p-6 md:p-8 rounded-2xl min-w-[400px] shadow-sm border border-gray-100">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full mt-2 mb-6">
          <div className="title border-b border-[#ddd] w-full flex justify-between">
            <h1 className="text-xl text-indigo-950 font-bold mb-5 ">
              Detail Riwayat Pengerjaan Kecermatan (Kategori ID: {kategoriId})
            </h1>
          </div>
        </div>

        {/* Analisis & Nilai Section */}
        {stats && panker && tianker && janker && hanker && (
          <>
            <div className="mb-8 bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border-2 border-orange-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-orange-600">📊</span> Analisis & Nilai
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* PANKER */}
                <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">PANKER (Kecepatan)</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pankerScore?.toFixed(2) || '0.00'}</p>
                  <p className="text-sm font-semibold text-gray-600 mt-1">{panker.label || '-'}</p>
                </div>

                {/* TIANKER */}
                <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">TIANKER (Ketelitian)</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.tiankerScore?.toFixed(2) || '0.00'}</p>
                  <p className="text-sm font-semibold text-gray-600 mt-1">{tianker.label || '-'}</p>
                </div>

                {/* JANKER */}
                <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">JANKER (Keajegan)</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.jankerScore?.toFixed(2) || '0.00'}</p>
                  <p className="text-sm font-semibold text-gray-600 mt-1">{janker.label || '-'}</p>
                </div>

                {/* HANKER */}
                <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">HANKER (Ketahanan)</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.hankerScore?.toFixed(2) || '0.00'}</p>
                  <p className="text-sm font-semibold text-gray-600 mt-1">{hanker.label || '-'}</p>
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
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg shadow-md text-white">
                  <p className="text-xs uppercase tracking-wide mb-1 opacity-90">Nilai Akhir</p>
                  <p className="text-3xl font-bold">{stats.finalScore?.toFixed(2) || '0.00'}</p>
                  <p className="text-sm font-semibold mt-1">{stats.finalScore >= 80 ? 'Sangat Baik' : stats.finalScore >= 60 ? 'Baik' : stats.finalScore >= 40 ? 'Cukup' : stats.finalScore >= 20 ? 'Kurang' : 'Sangat Kurang'}</p>
                </div>
              </div>

              <div className="text-xs text-gray-500 italic mt-2">
                * Skor dihitung berdasarkan: Kecepatan (PANKER), Ketelitian (TIANKER), Keajegan (JANKER), dan Ketahanan (HANKER)
              </div>
            </div>

            {/* Detailed Descriptions and Suggestions */}
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

              {/* JANKER Details */}
              <div className={`p-5 rounded-lg border ${janker.bg} ${janker.border}`}>
                <h3 className={`font-bold text-md mb-2 ${janker.color} flex items-center gap-2`}>
                  <span className="px-2 py-0.5 rounded bg-white/50 text-xs border border-current">JANKER</span> 
                  {janker.label}
                </h3>
                <p className="text-gray-700 text-sm mb-2">{janker.desc}</p>
                <p className="text-gray-500 text-xs italic"><span className="font-semibold not-italic">Saran:</span> {janker.saran}</p>
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
            </div>
          </>
        )}
        
        {/* Detail Jawaban Section with Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-2 mb-4 gap-4">
            <h3 className="text-md font-bold text-gray-700">Detail Jawaban</h3>
            <div className="flex flex-wrap items-center gap-4">
                <style>{`
                    .select-orange-small .t-input { border: 1px solid #ffb22c !important; height: 32px !important; width: 140px !important; }
                    .select-orange-small .t-input__inner { color: #ffb22c !important; font-size: 12px !important; font-weight: 600; }
                    .select-orange-small .t-fake-arrow { color: #ffb22c !important; }
                `}</style>
                {showDetailJawaban && (() => {
                    // Get unique kiasan IDs to create column options
                    const kiasanGroups = listHistory.list.reduce((acc: any, item: any) => {
                      if (!acc[item.kiasanId]) acc[item.kiasanId] = [];
                      acc[item.kiasanId].push(item);
                      return acc;
                    }, {});
                    const columnOptions = Object.keys(kiasanGroups).map((_, idx) => ({ 
                        label: `Kolom ${idx + 1}`, 
                        value: idx 
                    }));

                    return (
                        <Select 
                            value={selectedColumnIndex}
                            onChange={(val) => setSelectedColumnIndex(Number(val))}
                            options={columnOptions}
                            className="select-orange-small"
                            placeholder="Pilih Kolom"
                        />
                    );
                })()}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-600">Tampilkan Detail:</span>
                    <Switch 
                        value={showDetailJawaban}
                        onChange={(val) => setShowDetailJawaban(val as boolean)}
                    />
                </div>
            </div>
        </div>

        {showDetailJawaban ? (
            <>
                {/* Kiasan Reference for selected column */}
                {(() => {
                    const kiasanGroups = listHistory.list.reduce((acc: any, item: any) => {
                      if (!acc[item.kiasanId]) acc[item.kiasanId] = [];
                      acc[item.kiasanId].push(item);
                      return acc;
                    }, {});
                    const kiasanIds = Object.keys(kiasanGroups);
                    const selectedKiasanId = kiasanIds[selectedColumnIndex];
                    const selectedGroup = kiasanGroups[selectedKiasanId];
                    const kiasan = selectedGroup?.[0]?.kiasan;

                    if (!kiasan) return null;

                    const kiasanChar = kiasan.karakter || [];
                    const kiasanKeys = kiasan.kiasan || [];

                    return (
                        <div className="p-6 bg-gray-50 border-b border-gray-100 mb-6">
                            <div className="max-w-md mx-auto">
                                <p className="text-center text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Referensi Kunci Kolom {selectedColumnIndex + 1}</p>
                                <div className="grid grid-cols-5 divide-x divide-gray-200 border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
                                    {Array.isArray(kiasanChar) && kiasanChar.slice(0, 5).map((char: string, i: number) => (
                                        <div key={i} className="bg-gray-50 p-2 text-center font-bold text-xs text-gray-700 border-b border-gray-200">{char}</div>
                                    ))}
                                    {Array.isArray(kiasanKeys) && kiasanKeys.slice(0, 5).map((key: string, i: number) => (
                                        <div key={i} className="p-2 text-center font-bold text-xl text-indigo-600">{key}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* Filtered Detail Jawaban Table */}
                <div className="flex flex-col gap-4">
                    {(() => {
                        // Group by kiasanId and filter by selected column
                        const kiasanGroups = listHistory.list.reduce((acc: any, item: any) => {
                          if (!acc[item.kiasanId]) acc[item.kiasanId] = [];
                          acc[item.kiasanId].push(item);
                          return acc;
                        }, {});
                        const kiasanIds = Object.keys(kiasanGroups);
                        const selectedKiasanId = kiasanIds[selectedColumnIndex];
                        const filteredList = kiasanGroups[selectedKiasanId] || [];

                        if (filteredList.length === 0) {
                            return <div className="text-center text-gray-500 py-8">Tidak ada data untuk kolom ini.</div>;
                        }

                        return filteredList.map((item: any, index: number) => {
                            const kiasanChar = item.kiasan?.karakter || [];
                            const kiasanKeys = item.kiasan?.kiasan || [];
                            const soalChars = item.soalKecermatan?.soal || [];
                            const parsedSoal = typeof soalChars === 'string' ? JSON.parse(soalChars) : soalChars;

                            return (
                                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-2">
                                        <div>
                                            <span className="font-bold text-gray-500 mr-2">No. {index + 1}</span>
                                            <span className="text-sm text-gray-400">{moment(item.createdAt).locale('id').format('LL HH:mm:ss')}</span>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${item.jawaban === item.soalKecermatan?.jawaban ? 'bg-orange-100 text-[#ffb22c]' : 'bg-red-100 text-red-600'}`}>
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
                        });
                    })()}
                </div>
            </>
        ) : (
            <div className="text-center text-gray-500 py-8">
                <p>Aktifkan "Tampilkan Detail" untuk melihat detail jawaban per kolom.</p>
            </div>
        )}
       </div>
     </section>
   );
}
