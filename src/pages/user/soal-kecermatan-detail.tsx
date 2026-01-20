
import { getData, postData } from '@/utils/axios';
import { IconClock } from '@tabler/icons-react';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Loading, Dialog } from 'tdesign-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth-store';
import toast from 'react-hot-toast';

export default function SoalKecermatanExam() {
  const { id } = useParams();
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
          handleNextKiasan();
      }
      // eslint-disable-next-line
  }, [timer, finished, data.length]);

  useEffect(() => {
    if (finished && !hasSubmitted.current && user) {
        submitResult();
    }
  }, [finished, user]);

  const submitResult = async () => {
    hasSubmitted.current = true;
    const totalBenzo = Object.values(answers).filter((a: any) => a.isCorrect).length;
    // Calculate total questions from data (all kiasans)
    const totalQuestions = data.reduce((acc: number, kiasan: any) => acc + (kiasan.SoalKecermatan?.length || 0), 0);
    
    const payload = {
        kategoriSoalKecermatanId: Number(id),
        userId: user?.id,
        score: totalBenzo,
        totalSoal: totalQuestions,
        totalBenar: totalBenzo,
        totalSalah: totalQuestions - totalBenzo
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
             prepareKiasan(0, res.list);
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
      if (currentKiasanIndex < data.length - 1) {
          prepareKiasan(currentKiasanIndex + 1);
      } else {
          setFinished(true);
      }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loading /></div>;
  if (!data.length) return <div className="p-8 text-center text-gray-500">Data Soal tidak ditemukan.</div>;

  if (finished) {
      const totalScore = Object.values(answers).filter((a: any) => a.isCorrect).length;
      const totalQuestions = Object.keys(answers).length; 

      return (
          <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 text-center">
                  <h2 className="text-3xl font-bold mb-2 text-indigo-900">Hasil Kecermatan</h2>
                  <div className="text-6xl font-bold text-indigo-600 mb-2">{totalScore}</div>
                  <p className="text-gray-500">dari {totalQuestions} soal</p>
                  <div className="mt-6 flex justify-center gap-4">
                        <Button href="/soal-kecermatan" variant="outline">Unlangi Latihan</Button>
                        <Button href="/soal-kecermatan">Kembali ke Daftar</Button>
                  </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-bold text-gray-800">Pembahasan</h3>
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
                              {Object.keys(answers).map((key, idx) => {
                                  const ans = answers[key];
                                  return (
                                      <tr key={key}>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-800">
                                              {Array.isArray(ans.soal) ? ans.soal.join(' ') : ans.soal}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold">
                                              {ans.userAnswer}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-indigo-600">
                                              {ans.correctAnswer}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-center">
                                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ans.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                  {ans.isCorrect ? 'Benar' : 'Salah'}
                                              </span>
                                          </td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              </div>
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

  if (!currentSoal) return <div>Loading Soal...</div>;

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-6 min-h-screen flex flex-col">
       {/* Header Info */}
       <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
           <div className="w-32"></div>
           
           <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-indigo-600 flex items-center gap-2">
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
                    <div key={`key-${idx}`} className="p-3 text-center font-bold text-2xl text-indigo-600 bg-white">
                        {key}
                    </div>
                ))}
           </div>

           {/* Question Display */}
           <div className="flex justify-center mb-8">
               <div className="flex flex-wrap gap-3 justify-center bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                   {/* Soal is a JSON array string usually, need to parse if it comes as string, but Prisma returning JSON usually handles it. 
                       Wait, in typical implementation 'soal' is array of strings. 
                   */}
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
                        className="py-4 rounded-xl bg-indigo-600 text-white font-bold text-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg hover:shadow-indigo-200"
                   >
                       {key}
                   </button>
               ))}
           </div>
           <Dialog
            header="Konfirmasi Selesaikan Ujian"
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
