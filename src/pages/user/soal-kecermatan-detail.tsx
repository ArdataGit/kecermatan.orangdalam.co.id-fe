import { getData, postData } from '@/utils/axios';
import { IconClock } from '@tabler/icons-react';
import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button, Loading, Dialog, Select, Switch } from 'tdesign-react';
import { AnimatePresence, motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '@/stores/auth-store';
import toast from 'react-hot-toast';

export default function SoalKecermatanExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const classId = location.state?.classId;
  const { user } = useAuthStore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentKiasanIndex, setCurrentKiasanIndex] = useState(0);
  const [currentSoalIndex, setCurrentSoalIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [timer, setTimer] = useState(0);
  const [finished, setFinished] = useState(false);
  const hasSubmitted = useRef(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  
  // New States for Results
  const [showPembahasan, setShowPembahasan] = useState(false);
  const [reviewColumnIndex, setReviewColumnIndex] = useState(0);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    let interval: any;
    if (!finished && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
             if (prev <= 0) return 0;
             return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [finished, timer]);

  useEffect(() => {
      if (timer === 0 && !finished && data.length > 0) {
          console.log("Timer hit 0", { currentKiasanIndex, dataLength: data.length });
          // Use handleNextKiasan to properly handle empty kiasans
          handleNextKiasan();
      }
      // eslint-disable-next-line
  }, [timer, finished, data.length, currentKiasanIndex]);

  useEffect(() => {
    if (finished && !hasSubmitted.current && user) {
        submitResult();
    }
  }, [finished, user]);

  const calculateStats = () => {
      const totalColumns = data.length;
      let totalCorrectAll = 0;
      let totalQuestionsAll = 0;
      
      // Standardize into 10 buckets (columns) for performance analysis
      const buckets = Array.from({ length: 10 }, () => ({ sumCorrect: 0, sumAnswered: 0, count: 0 }));
      
      data.forEach((kiasan, kiasanIndex) => {
          let correctInKiasan = 0;
          let answeredInKiasan = 0;
          // Note: Property name is SoalKecermatan in this component, not soalLatihanKecermatan
          const questionsInKiasan = kiasan.SoalKecermatan?.length || 0;

          for (let i = 0; i < questionsInKiasan; i++) {
              const key = `${kiasanIndex}-${i}`;
              if (answers[key]) {
                  answeredInKiasan++;
                  if (answers[key].isCorrect) {
                      correctInKiasan++;
                  }
              }
          }

          totalCorrectAll += correctInKiasan;
          totalQuestionsAll += questionsInKiasan;

          const bucketIdx = Math.floor((kiasanIndex / totalColumns) * 10);
          if (bucketIdx < 10) {
              buckets[bucketIdx].sumCorrect += correctInKiasan;
              buckets[bucketIdx].sumAnswered += answeredInKiasan;
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
      // Formula: MIN(100;MAX(0;AVERAGE(average(jawaban benar dari kolom 1 hingga 10)/50*100)))
      const bucketAverages = buckets.map(b => b.count > 0 ? (b.sumCorrect / b.count) : 0);
      const bucketScoresPanker = bucketAverages.map(avg => (avg / 50) * 100);
      let convertedScore = bucketScoresPanker.reduce((sum, s) => sum + s, 0) / 10;
      convertedScore = Math.min(Math.max(convertedScore, 0), 100);

      const getPankerCategory = (score: number) => {
          if (score >= 88) return { label: "Tinggi", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", desc: "Kecepatan kerja Anda tinggi. Ritme kerja cepat dan alur pengerjaan lancar sehingga output dapat dicapai dengan baik.", saran: "Pertahankan tempo dan jaga konsistensi dari awal hingga akhir. Pastikan kecepatan tidak menurunkan ketelitian." };
          if (score >= 77) return { label: "Cukup Tinggi", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", desc: "Kecepatan kerja Anda sudah baik. Namun masih ada bagian yang melambat sehingga hasil belum maksimal.", saran: "Kurangi jeda-jeda kecil dan perkuat ritme yang stabil. Tingkatkan target secara bertahap agar tempo naik tanpa mengganggu kontrol." };
          if (score >= 60) return { label: "Sedang", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", desc: "Kecepatan kerja Anda berada pada tingkat cukup. Anda mampu menyelesaikan tugas, tetapi tempo masih mudah turun saat ragu atau ketika ritme tidak stabil.", saran: "Bangun alur kerja yang konsisten dan hindari berhenti untuk memeriksa di tengah pengerjaan. Setelah ritme stabil, tingkatkan output sedikit demi sedikit." };
          if (score >= 50) return { label: "Rendah", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", desc: "Kecepatan kerja Anda masih rendah. Tempo cenderung lambat sehingga hasil mudah tertinggal.", saran: "Fokus pada kelancaran dan ritme. Kurangi kebiasaan berhenti, jaga tempo yang sama, and lakukan latihan rutin dengan target peningkatan kecil namun konsisten." };
          return { label: "Sangat Rendah", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", desc: "Kecepatan kerja Anda masih di bawah harapan. Terdapat jeda singkat yang sering berulang sehingga menghambat tempo.", saran: "Latih transisi yang lebih cepat and kurangi jeda. Tetapkan target minimal yang realistis, stabilkan ritme terlebih dahulu, lalu tingkatkan secara bertahap." };
      };
      const panker = getPankerCategory(convertedScore);

      // 2. TIANKER (Ketelitian)
      const totalAnsweredAcrossAll = Object.keys(answers).length;
      const totalWrong = totalAnsweredAcrossAll - totalCorrectAll;
      // Formula TIANKER: MAX(0;((sum(jawaban benar)/sum(jawaban terjawab))*100) - (SUM(jawaban salah)*2))
      let convertedScoreTianker = 0;
      if (totalAnsweredAcrossAll > 0) {
          convertedScoreTianker = ((totalCorrectAll / totalAnsweredAcrossAll) * 100) - (totalWrong * 2);
      }
      convertedScoreTianker = Math.max(0, convertedScoreTianker);

      const getTiankerCategory = (score: number) => {
           if (score >= 88) return { label: "Tinggi", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", desc: "Ketelitian kerja Anda tinggi. Kesalahan sangat sedikit, menunjukkan fokus and kontrol yang baik saat mengerjakan.", saran: "Pertahankan cara kerja yang rapi and konsisten. Saat meningkatkan kecepatan, pastikan pola kerja tetap sama agar ketelitian tidak turun." };
           if (score >= 77) return { label: "Cukup Tinggi", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", desc: "Ketelitian kerja Anda sudah baik. Masih ada beberapa kesalahan, tetapi secara umum akurasi terjaga.", saran: "Identifikasi jenis kesalahan yang paling sering dilakukan. Kurangi sumber kesalahan itu with menjaga ritme and fokus, tanpa terlalu lama berhenti." };
           if (score >= 60) return { label: "Sedang", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", desc: "Ketelitian kerja Anda cukup, namun kesalahan masih muncul cukup sering sehingga akurasi belum stabil.", saran: "Prioritaskan ketelitian dulu sebelum menaikkan tempo. Gunakan alur kerja yang konsisten and hindari tergesa-gesa pada bagian yang sering menimbulkan salah." };
           if (score >= 50) return { label: "Rendah", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", desc: "Ketelitian kerja Anda rendah. Kesalahan relatif banyak, menandakan fokus mudah terpecah or kontrol pengerjaan belum kuat.", saran: "Turunkan tempo sedikit agar lebih terkontrol, lalu latih akurasi. Fokus pada satu pola kerja yang sama and perbaiki penyebab kesalahan utama secara bertahap." };
           return { label: "Sangat Rendah", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", desc: "Ketelitian kerja Anda masih kurang. Kesalahan terjadi berulang sehingga hasil belum dapat diandalkan.", saran: "Perkuat kebiasaan kerja yang rapi, seperti baca with jelas, hitung singkat, lalu jawab. Kurangi kebiasaan menebak or terburu-buru. Setelah kesalahan turun, baru naikkan kecepatan secara bertahap." };
      };
      const tianker = getTiankerCategory(convertedScoreTianker);

      // 3. HANKER (Ketahanan)
      // Formula: MAX(0; (MIN(100; (AVERAGE(soal terjawab)/45)*100)) - (STDEV(soal terjawab)*8))
      const bucketAnsweredAverages = buckets.map(b => b.count > 0 ? (b.sumAnswered / b.count) : 0);
      const avgAnswered = bucketAnsweredAverages.reduce((a, b) => a + b, 0) / 10;
      const stdevAnswered = calculateStdev(bucketAnsweredAverages);
      
      let normalizedAvg = (avgAnswered / 45) * 100;
      normalizedAvg = Math.min(100, normalizedAvg);
      
      let convertedScoreHanker = normalizedAvg - (stdevAnswered * 8);
      convertedScoreHanker = Math.max(0, convertedScoreHanker);

      const getHankerCategory = (score: number) => {
           if (score >= 88) return { label: "Tinggi", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", desc: "Ketahanan kerja Anda tinggi. Ritme konstan dari awal hingga akhir tanpa penurunan berarti. Anda mampu menjaga fokus and kecepatan dalam waktu yang lama.", saran: "Pertahankan stamina and metode kerja yang terbukti efektif. Jika tugas lebih berat, atur istirahat mikro yang singkat tanpa mengganggu konsentrasi penuh." };
           if (score >= 77) return { label: "Cukup Tinggi", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", desc: "Ketahanan kerja Anda cukup baik. Performa umumnya terjaga, meskipun ada sedikit penurunan pada bagian tertentu.", saran: "Perhatikan bagian mana yang paling sering drop, lalu atur tempo agar tidak terlalu cepat di awal. Jaga fokus secara bertahap agar energi tidak habis lebih awal." };
           if (score >= 60) return { label: "Sedang", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", desc: "Ketahanan kerja Anda sedang. Ritme mulai turun cukup jelas di bagian tengah or akhir. Anda mulai butuh istirahat lebih banyak or konsentrasi yang lebih sering terputus.", saran: "Latih stamina with durasi kerja yang lebih panjang secara bertahap. Hindari tempo terlalu cepat di awal agar tidak cepat lelah. Jaga pola kerja yang konsisten agar energi tidak terkuras terlalu cepat." };
           if (score >= 50) return { label: "Rendah", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", desc: "Ketahanan kerja Anda rendah. Penurunan tempo and ketelitian cukup besar di bagian tengah or akhir. Stamina cepat tergerus and output menurun signifikan seiring waktu.", saran: "Kurangi beban dari awal with tempo yang tidak terlalu tinggi. Latih ketahanan with target durasi yang panjang, mulai dari yang ringan. Atur pola makan and tidur agar kondisi fisik mendukung konsentrasi lebih lama." };
           return { label: "Sangat Rendah", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", desc: "Ketahanan kerja Anda sangat rendah. Penurunan drastis sejak awal or tengah, menunjukkan stamina mudah habis and konsentrasi cepat terpecah.", saran: "Perbaiki kondisi fisik and mental secara bertahap. Mulai with durasi kerja pendek yang dapat diselesaikan with baik, lalu tingkatkan perlahan. Jaga pola istirahat and konsumsi gizi yang baik agar energi lebih tahan lama." };
      };
      const hanker = getHankerCategory(convertedScoreHanker);

      const finalScore = (convertedScore * 0.45) + (convertedScoreTianker * 0.45) + (convertedScoreHanker * 0.10);
      const getFinalCategory = (score: number) => {
          if (score >= 88) return { label: "Tinggi", color: "text-green-700", bg: "bg-green-100", border: "border-green-300", desc: "Hasil akhir sangat kuat. Pertahankan konsistensi agar tetap stabil." };
          if (score >= 77) return { label: "Cukup Tinggi", color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-300", desc: "Hasil akhir sudah baik. Sedikit perbaikan pada bagian terlemah akan membuatnya lebih optimal." };
          if (score >= 60) return { label: "Sedang", color: "text-yellow-700", bg: "bg-yellow-100", border: "border-yellow-300", desc: "Hasil akhir cukup. Dengan latihan terarah, performa bisa naik ke level baik." };
          if (score >= 50) return { label: "Rendah", color: "text-orange-700", bg: "bg-orange-100", border: "border-orange-300", desc: "Hasil akhir masih rendah. Mulai dari perbaikan dasar and tingkatkan bertahap. Hasil biasanya cepat terlihat." };
          return { label: "Sangat Rendah", color: "text-red-700", bg: "bg-red-100", border: "border-red-300", desc: "Hasil akhir masih di bawah target. Fokus pada ritme and konsistensi. Kenaikan akan lebih mudah jika dilakukan rutin." };
      };
      const finalCategory = getFinalCategory(finalScore);

      return { finalScore, finalCategory, panker, tianker, hanker, convertedScore, convertedScoreTianker, convertedScoreHanker, totalQuestionsAll, totalCorrectAll, totalWrong };
  };

  const submitResult = async () => {
    hasSubmitted.current = true;
    const stats = calculateStats();
    
    // Original payload structure required by backend
    const payload = {
        kategoriSoalKecermatanId: Number(id),
        userId: user?.id,
        score: Math.round(stats.finalScore),
        totalSoal: stats.totalQuestionsAll,
        totalBenar: stats.totalCorrectAll,
        totalSalah: stats.totalWrong,
        // Optional: sending extended stats if backend supports it someday
        pankerScore: Number(stats.convertedScore.toFixed(2)),
        finalScore: Number(stats.finalScore.toFixed(2))
    };

    try {
        await postData('user/paket-pembelian-kecermatan/kecermatan-ranking', payload);
        toast.success('Hasil latihan berhasil disimpan');
    } catch (error) {
        console.error("Failed to submit ranking", error);
        toast.error('Gagal menyimpan hasil latihan');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getData(`admin/kiasan/get?kategoriSoalKecermatanId=${id}&includeSoal=true`);
      if (res?.list) {
          setData(res.list);
          if (res.list.length > 0) {
             // Find first non-empty kiasan
             let startIndex = 0;
             while (startIndex < res.list.length && (!res.list[startIndex].SoalKecermatan || res.list[startIndex].SoalKecermatan.length === 0)) {
                 console.log(`Skipping empty kiasan at index ${startIndex} during init`);
                 startIndex++;
             }
             
             if (startIndex < res.list.length) {
                 prepareKiasan(startIndex, res.list);
             } else {
                 // All kiasans are empty, show error
                 console.error("All kiasans are empty!");
             }
          }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const prepareKiasan = (index: number, listData: any[] = data) => {
      setCurrentKiasanIndex(index);
      setCurrentSoalIndex(0);
      if (listData[index]) {
          // Set timer per Kiasan (total_waktu is from backend)
          setTimer(listData[index].total_waktu || 60); 
      }
  }

  const handleAnswer = (val: string) => {
      const currentKiasan = data[currentKiasanIndex];
      const currentSoal = currentKiasan.SoalKecermatan[currentSoalIndex];
      const isCorrect = val === currentSoal.jawaban;

      // Save history asynchronously
      if (user) {
          postData('user/paket-pembelian-kecermatan/kecermatan-history', {
              kategoriSoalKecermatanId: Number(id),
              userId: user.id,
              soalKecermatanId: currentSoal.id,
              kiasanId: currentKiasan.id,
              jawaban: val
          }).catch(err => console.error("Failed to save history", err));
      }

      setAnswers((prev: any) => ({ 
          ...prev, 
          [`${currentKiasanIndex}-${currentSoalIndex}`]: {
              userAnswer: val,
              isCorrect: isCorrect,
              correctAnswer: currentSoal.jawaban,
              soal: currentSoal.soal 
          } 
      }));
      handleNext();
  };

  const handleNext = () => {
      const currentKiasan = data[currentKiasanIndex];
      if (currentSoalIndex < currentKiasan.SoalKecermatan.length - 1) {
          const nextIndex = currentSoalIndex + 1;
          setCurrentSoalIndex(nextIndex);
          // Timer does NOT reset here anymore
      } else {
          handleNextKiasan();
      }
  };

  const handleNextKiasan = () => {
      // Find next kiasan with questions
      let nextIndex = currentKiasanIndex + 1;
      while (nextIndex < data.length && (!data[nextIndex].SoalKecermatan || data[nextIndex].SoalKecermatan.length === 0)) {
          console.log(`Skipping empty kiasan at index ${nextIndex}`);
          nextIndex++;
      }
      
      if (nextIndex < data.length) {
          // Found a kiasan with questions
          prepareKiasan(nextIndex);
      } else {
          // No more kiasans with questions, finish exam
          setFinished(true);
      }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loading /></div>;
  if (!data.length) return <div className="p-8 text-center text-gray-500">Data Soal tidak ditemukan.</div>;

  if (finished) {
      let stats;
      try {
          stats = calculateStats();
      } catch (e: any) {
          console.error("Error calculating stats:", e);
          return <div className="p-10 text-center text-red-600 font-bold">Error calculating stats: {e.message}</div>;
      }
      
      const { finalScore, finalCategory, panker, tianker, hanker, convertedScore, convertedScoreTianker, convertedScoreHanker } = stats;

      return (
          <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-8 font-['Poppins']">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 text-center">
                  <h2 className="text-3xl font-bold mb-6 text-[#000000]">Hasil Ujian Kecermatan</h2>
                  {/* Final Score Section */}
                  <div className={`mb-8 p-6 rounded-xl border ${finalCategory.bg} ${finalCategory.border} flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm`}>
                      <div className="text-center md:text-left min-w-[200px]">
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">NILAI AKHIR</p>
                          <div className="text-6xl font-extrabold text-[#d97706]">{finalScore.toFixed(0)}</div>
                      </div>
                      <div className="text-center md:text-right flex-1 border-l-0 md:border-l border-gray-200/50 pl-0 md:pl-8">
                           <div className={`text-2xl font-bold ${finalCategory.color} mb-3`}>{finalCategory.label}</div>
                           <p className="text-gray-700 text-base leading-relaxed">{finalCategory.desc}</p>
                      </div>
                  </div>

                  {/* Detailed Stats Rows */}
                  <div className="flex flex-col gap-6 mb-8">
                      {/* PANKER */}
                      <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-full md:w-48 bg-gray-50 rounded-xl border border-gray-100 p-6 flex flex-col items-center justify-center shadow-sm shrink-0">
                              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">PANKER</p>
                              <div className="text-4xl font-bold text-[#000000]">{convertedScore.toFixed(0)}</div>
                          </div>
                          <div className={`flex-1 p-6 rounded-xl border ${panker.bg} ${panker.border} text-left`}>
                              <div className="flex items-center gap-3 mb-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${panker.color.replace('text-', 'border-')} ${panker.color} bg-white uppercase tracking-wider`}>PANKER</span>
                                  <span className={`font-bold text-lg ${panker.color}`}>{panker.label}</span>
                              </div>
                              <p className="text-gray-700 text-sm mb-3 leading-relaxed">{panker.desc}</p>
                              <p className="text-gray-500 text-xs"><span className="font-bold text-gray-600">Saran:</span> <span className="italic">{panker.saran}</span></p>
                          </div>
                      </div>

                      {/* TIANKER */}
                      <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-full md:w-48 bg-gray-50 rounded-xl border border-gray-100 p-6 flex flex-col items-center justify-center shadow-sm shrink-0">
                              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">TIANKER</p>
                              <div className="text-4xl font-bold text-[#000000]">{convertedScoreTianker.toFixed(0)}</div>
                          </div>
                          <div className={`flex-1 p-6 rounded-xl border ${tianker.bg} ${tianker.border} text-left`}>
                              <div className="flex items-center gap-3 mb-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tianker.color.replace('text-', 'border-')} ${tianker.color} bg-white uppercase tracking-wider`}>TIANKER</span>
                                  <span className={`font-bold text-lg ${tianker.color}`}>{tianker.label}</span>
                              </div>
                              <p className="text-gray-700 text-sm mb-3 leading-relaxed">{tianker.desc}</p>
                              <p className="text-gray-500 text-xs"><span className="font-bold text-gray-600">Saran:</span> <span className="italic">{tianker.saran}</span></p>
                          </div>
                      </div>

                      {/* HANKER */}
                      <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-full md:w-48 bg-gray-50 rounded-xl border border-gray-100 p-6 flex flex-col items-center justify-center shadow-sm shrink-0">
                              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">HANKER</p>
                              <div className="text-4xl font-bold text-[#000000]">{convertedScoreHanker.toFixed(0)}</div>
                          </div>
                          <div className={`flex-1 p-6 rounded-xl border ${hanker.bg} ${hanker.border} text-left`}>
                              <div className="flex items-center gap-3 mb-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${hanker.color.replace('text-', 'border-')} ${hanker.color} bg-white uppercase tracking-wider`}>HANKER</span>
                                  <span className={`font-bold text-lg ${hanker.color}`}>{hanker.label}</span>
                              </div>
                              <p className="text-gray-700 text-sm mb-3 leading-relaxed">{hanker.desc}</p>
                              <p className="text-gray-500 text-xs"><span className="font-bold text-gray-600">Saran:</span> <span className="italic">{hanker.saran}</span></p>
                          </div>
                      </div>
                  </div>
              </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="text-[#000000]">📈</span> Grafik Performa Pengerjaan
                      </h3>
                      <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={data.map((_: any, idx: number) => {
                                  const kiasanAnswers = Object.entries(answers).filter(([key]) => key.startsWith(`${idx}-`)).map(([_, value]: any) => value);
                                  const correctInKiasan = kiasanAnswers.filter((ans: any) => ans.isCorrect).length;
                                  return { name: `Kolom ${idx + 1}`, 'Soal Terjawab': kiasanAnswers.length, 'Soal Benar': correctInKiasan, 'Soal Salah': kiasanAnswers.length - correctInKiasan };
                              })} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                  <XAxis dataKey="name" stroke="#666" style={{ fontSize: '12px' }} />
                                  <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', fontSize: '12px' }} />
                                  <Legend wrapperStyle={{ fontSize: '12px' }} iconType="line" />
                                  <Line type="monotone" dataKey="Soal Terjawab" stroke="#3B82F6" strokeWidth={2.5} dot={{ fill: '#3B82F6', r: 4 }} activeDot={{ r: 6 }} />
                                  <Line type="monotone" dataKey="Soal Benar" stroke="#10B981" strokeWidth={2.5} dot={{ fill: '#10B981', r: 4 }} activeDot={{ r: 6 }} />
                                  <Line type="monotone" dataKey="Soal Salah" stroke="#EF4444" strokeWidth={2.5} dot={{ fill: '#EF4444', r: 4 }} activeDot={{ r: 6 }} />
                              </LineChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  <div className="flex flex-col items-center justify-center mb-8 gap-4">
                        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
                             <span className="text-sm font-bold text-gray-700">Tampilkan Pembahasan?</span>
                             <Switch 
                                value={showPembahasan}
                                onChange={(val) => setShowPembahasan(val as boolean)}
                             />
                        </div>
                        <div className="mt-6 flex justify-center gap-4">
                            <Button onClick={() => window.location.reload()} variant="outline">Ulangi Latihan</Button>
                            <Button onClick={() => navigate(-1)}>Kembali</Button>
                            {classId && (
                               <Button onClick={() => navigate(`/my-class/${classId}/kecermatan/${id}/riwayat`)}>Lihat Riwayat</Button>
                            )}
                        </div>
                  </div>

                  {/* PEMBAHASAN DROPDOWN */}
                  {showPembahasan && (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-left animate-in fade-in slide-in-from-top-4 duration-500">
                           <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                               <h3 className="text-xl font-bold text-gray-800">Pembahasan</h3>
                               <div className="w-full md:w-64">
                                    <style>{`
                                        .select-orange .t-input { border: 1px solid #ffb22c !important; color: #ffb22c !important; }
                                        .select-orange .t-input__inner { color: #ffb22c !important; font-weight: 600; }
                                        .select-orange .t-fake-arrow { color: #ffb22c !important; }
                                    `}</style>
                                    <Select 
                                        value={reviewColumnIndex}
                                        onChange={(val) => setReviewColumnIndex(Number(val))}
                                        options={data.map((_, idx) => ({ label: `Kolom ${idx + 1}`, value: idx }))}
                                        className="select-orange"
                                        placeholder="Pilih Kolom"
                                    />
                               </div>
                           </div>

                           <div className="p-6 bg-gray-50 border-b border-gray-100">
                                <div className="max-w-md mx-auto">
                                    <p className="text-center text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Referensi Kunci Kolom {reviewColumnIndex + 1}</p>
                                    <div className="grid grid-cols-5 divide-x divide-gray-200 border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
                                        {['A', 'B', 'C', 'D', 'E'].slice(0, data[reviewColumnIndex]?.kiasan?.length).map((char, idx) => (
                                            <div key={idx} className="bg-gray-50 p-2 text-center font-bold text-xs text-gray-700 border-b border-gray-200">{char}</div>
                                        ))}
                                        {data[reviewColumnIndex]?.kiasan?.map((sym: string, idx: number) => (
                                            <div key={idx} className="p-2 text-center font-bold text-xl text-[#000000]">{sym}</div>
                                        ))}
                                    </div>
                                </div>
                           </div>

                           <div className="overflow-x-auto">
                               <table className="w-full">
                                   <thead className="bg-gray-50">
                                       <tr>
                                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Soal</th>
                                           <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Jawaban Kamu</th>
                                           <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Kunci</th>
                                           <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                       </tr>
                                   </thead>
                                   <tbody className="bg-white divide-y divide-gray-200">
                                       {Object.keys(answers).filter(key => key.startsWith(`${reviewColumnIndex}-`)).map((key, idx) => {
                                           const ans = answers[key];
                                           return (
                                               <tr key={key} className="hover:bg-gray-50 transition-colors">
                                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">{idx + 1}</td>
                                                   <td className="px-6 py-4 whitespace-nowrap text-2xl font-bold text-gray-800 tracking-widest">{Array.isArray(ans.soal) ? ans.soal.join(' ') : ans.soal}</td>
                                                   <td className="px-6 py-4 whitespace-nowrap text-center text-lg font-bold text-gray-700">{ans.userAnswer}</td>
                                                   <td className="px-6 py-4 whitespace-nowrap text-center text-lg font-bold text-[#000000]">{ans.correctAnswer}</td>
                                                   <td className="px-6 py-4 whitespace-nowrap text-center">
                                                       <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${ans.isCorrect ? 'bg-orange-100 text-[#ffb22c]' : 'bg-red-100 text-red-600'}`}>{ans.isCorrect ? 'Benar' : 'Salah'}</span>
                                                   </td>
                                               </tr>
                                           );
                                       })}
                                       {Object.keys(answers).filter(key => key.startsWith(`${reviewColumnIndex}-`)).length === 0 && (
                                           <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">Tidak ada data jawaban untuk kolom ini.</td></tr>
                                       )}
                                   </tbody>
                               </table>
                           </div>
                      </div>
                  )}

          </div>
      )
  }

  const currentKiasan = data[currentKiasanIndex];
  const currentSoal = currentKiasan?.SoalKecermatan?.[currentSoalIndex];

   const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!currentSoal) {
      console.log("Soal Loading State", {
          currentKiasanIndex,
          currentSoalIndex,
          dataLength: data.length,
          kiasanExists: !!currentKiasan,
          soalCount: currentKiasan?.SoalKecermatan?.length,
          finished
      });
      // Safety check: if somehow finished is true here but we rendered loading
      if (finished) return null; 

      return (
          <div className="p-8 text-center">
              <div>Loading Soal...</div>
              <div className="text-xs text-gray-400 mt-2">
                  Debug: Kiasan {currentKiasanIndex + 1}, Soal {currentSoalIndex + 1}
              </div>
          </div>
      );
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-6 min-h-screen flex flex-col">
       {/* Header Info */}
       <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
           <div className="w-32 font-bold text-gray-700 text-lg">
               Kolom {currentKiasanIndex + 1} / {data.length}
           </div>
           
           <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-[#000000] flex items-center gap-2">
                    <IconClock /> {formatTime(timer)}
                </div>
           </div>

           <div className="w-32 text-right">
               <Button theme="danger" variant="outline" onClick={() => setShowConfirmFinish(true)}>Selesaikan Ujian</Button>
           </div>
       </div>

       {/* Kiasan Table (Answer Key) */}
       <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
           <div className="grid grid-cols-5 divide-x divide-gray-200 border border-gray-200 rounded-lg overflow-hidden mb-6">
                {/* Headers (Karakter) */}
                {currentKiasan.karakter.map((char: string, idx: number) => (
                    <div key={`char-${idx}`} className="bg-gray-50 p-3 text-center font-bold text-lg text-gray-700">
                        {char}
                    </div>
                ))}
                {/* Values (Kiasan/Keys) */}
                {currentKiasan.kiasan.map((key: string, idx: number) => (
                    <div key={`key-${idx}`} className="p-3 text-center font-bold text-2xl text-[#000000] bg-white">
                        {key}
                    </div>
                ))}
           </div>

           {/* Question Display */}
           <div className="flex justify-center mb-8">
               <div className="flex flex-wrap gap-3 justify-center bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                   <AnimatePresence mode='wait'>
                        <motion.div 
                            key={`${currentKiasanIndex}-${currentSoalIndex}`}
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.05, ease: "linear" }}
                            className="flex gap-4 md:gap-8"
                        >
                            {(Array.isArray(currentSoal.soal) ? currentSoal.soal : []).map((char: string, idx: number) => (
                                <div key={idx} className="font-bold text-4xl md:text-5xl text-gray-800">
                                    {char}
                                </div>
                            ))}
                        </motion.div>
                   </AnimatePresence>
               </div>
           </div>

            {/* Answer Options */}
           <div className="grid grid-cols-5 gap-4">
               {currentKiasan.kiasan.map((key: string, idx: number) => (
                   <button 
                        key={idx}
                        onClick={() => handleAnswer(key)}
                        className="py-4 rounded-xl bg-[#000000] text-white font-bold text-2xl hover:bg-[#333333] active:scale-95 transition-all shadow-lg hover:shadow-gray-200"
                   >
                       {key}
                   </button>
               ))}
           </div>
           <Dialog
            header="Selesai Mengerjakan"
            body="Jika anda menyelesaikan ujian, anda tidak dapat lagi mengubah jawaban sebelumnya. Apakah anda yakin untuk menyelesaikan ujian ini?"
            visible={showConfirmFinish}
            onClose={() => setShowConfirmFinish(false)}
            onConfirm={() => {
                setShowConfirmFinish(false);
                setFinished(true);
            }}
        />

    </div>

    </div>
  );
}
