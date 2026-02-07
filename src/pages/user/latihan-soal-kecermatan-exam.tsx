
import { getData, postData } from '@/utils/axios';
import { IconClock } from '@tabler/icons-react';
import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button, Loading, Dialog } from 'tdesign-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth-store';
import toast from 'react-hot-toast';

// Adapted from SoalKecermatanExam
export default function LatihanSoalKecermatanExam() {
  const { id } = useParams(); // This is the KategoriLatihanKecermatan ID
  const navigate = useNavigate();
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
          if (currentKiasanIndex < data.length - 1) {
              prepareKiasan(currentKiasanIndex + 1);
          } else {
              setFinished(true);
          }
      }
      // eslint-disable-next-line
  }, [timer, finished, data.length, currentKiasanIndex]);

  useEffect(() => {
    // If finished, we could auto-submit or just show results locally since this is "Latihan Mandiri"
    // For now, let's just show local results.
    if (finished && !hasSubmitted.current) {
         // Maybe save later?
         hasSubmitted.current = true; 
    }
  }, [finished]);

  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch LatihanKiasan by Category ID
      // NOTE: backend controller 'get' accepts filters via query params usually parse to JSON
      // But based on previous update, we can pass filters.
      // We need to fetch all Kiasan for this category.
      // Assuming 'get' supports standard filter or we use custom find logic.
      // Let's rely on standard filter logic provided by 'get'.
      // URL: /api/latihan-kiasan/get?filters={"kategoriLatihanKecermatanId":ID}&includeSoal=true
      
      const filter = JSON.stringify({ kategoriLatihanKecermatanId: Number(id) });
      const res = await getData(`latihan-kiasan/get?filters=${filter}&includeSoal=true`);
      
      if (res?.list) {
          setData(res.list);
          if (res.list.length > 0) {
             prepareKiasan(0, res.list);
          }
      } else {
        toast.error('Gagal mengambil data soal');
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal mengambil data soal');
    } finally {
      setLoading(false);
    }
  };

  const prepareKiasan = (index: number, listData: any[] = data) => {
      setCurrentKiasanIndex(index);
      setCurrentSoalIndex(0);
      if (listData[index]) {
          // Set timer per Kiasan 
          setTimer(listData[index].waktu || 60); 
      }
  }

  const handleAnswer = (val: string) => {
      const currentKiasan = data[currentKiasanIndex];
      const currentSoal = currentKiasan.soalLatihanKecermatan[currentSoalIndex];
      const isCorrect = val === currentSoal.jawaban;

      // We don't necessarily save every click to DB for "Latihan" unless requested.
      // Keeping it local for speed for now.

      setAnswers((prev: any) => ({ 
          ...prev, 
          [`${currentKiasanIndex}-${currentSoalIndex}`]: {
              userAnswer: val,
              isCorrect: isCorrect,
              correctAnswer: currentSoal.jawaban,
              soal: currentSoal.soal 
          } 
      }));

      // Non-blocking save to history
      postData('latihan-kiasan/history', {
          kategoriLatihanKecermatanId: Number(id),
          latihanKiasanId: currentKiasan.id,
          soalLatihanKecermatanId: currentSoal.id,
          jawaban: val
      }).catch(err => console.error("Failed to save history", err));

      handleNext();
  };

  const handleNext = () => {
      const currentKiasan = data[currentKiasanIndex];
      if (currentSoalIndex < currentKiasan.soalLatihanKecermatan.length - 1) {
          const nextIndex = currentSoalIndex + 1;
          setCurrentSoalIndex(nextIndex);
      } else {
          handleNextKiasan();
      }
  };

  const handleNextKiasan = () => {
      if (currentKiasanIndex < data.length - 1) {
          prepareKiasan(currentKiasanIndex + 1);
      } else {
          setShowConfirmFinish(true);
      }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loading /></div>;
  if (!data.length) return <div className="p-8 text-center text-gray-500">Data Soal tidak ditemukan.</div>;

  if (finished) {
      const totalScore = Object.values(answers).filter((a: any) => a.isCorrect).length;
      const totalQuestions = Object.keys(answers).length; 

      return (
          <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-8 font-['Poppins']">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 text-center">
                  <h2 className="text-3xl font-bold mb-2 text-indigo-900">Hasil Latihan Kecermatan</h2>
                  <div className="text-6xl font-bold text-indigo-600 mb-2">{totalScore}</div>
                  <p className="text-gray-500">dari {totalQuestions} soal</p>
                  <div className="mt-6 flex justify-center gap-4">
                        <Button onClick={() => window.location.reload()} variant="outline">Ulangi Latihan</Button>
                        <Button onClick={() => navigate('/latihan-kecermatan')}>Kembali ke Menu</Button>
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
                                  // Find the Key (A, B...) for the answer
                                  // Need to reconstruct context from `key` "KiasanIndex-SoalIndex"
                                  // But `ans` has `userAnswer` (Symbol) and `correctAnswer` (Symbol)
                                  // Ideally we show the Key (Label) if we can.
                                  // But simplified view showing Symbols is also fine for now.
                                  
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
                                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ans.isCorrect ? 'bg-orange-100 text-[#C2410C]' : 'bg-red-100 text-red-800'}`}>
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
  const currentSoal = currentKiasan?.soalLatihanKecermatan?.[currentSoalIndex];

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!currentSoal) return <div>Loading Soal...</div>;

  // Symbols from the Kiasan data
  const symbols = currentKiasan.kiasan; // Array of 5 chars
  // Since we don't have separate "Keys" (Header), we can generate standard ones A-E or 1-5, or just show Symbols.
  // Standard format usually has Map Row (Key -> Symbol).
  // Let's generate Keys A, B, C, D, E
  const keys = ['A', 'B', 'C', 'D', 'E'].slice(0, symbols.length);

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-6 min-h-screen flex flex-col font-['Poppins']">
       {/* Header Info */}
       <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
           <div className="w-32 font-bold text-gray-700 text-lg">
               Kolom {currentKiasanIndex + 1} / {data.length}
           </div>
           
           <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-indigo-600 flex items-center gap-2">
                    <IconClock /> {formatTime(timer)}
                </div>
           </div>

           <div className="w-32 text-right">
               <Button theme="danger" variant="outline" onClick={() => setShowConfirmFinish(true)}>Selesai</Button>
           </div>
       </div>

       {/* Kiasan Table (Answer Key) */}
       <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
           <div className="grid grid-cols-5 divide-x divide-gray-200 border border-gray-200 rounded-lg overflow-hidden mb-6">
                {/* Headers (Keys) */}
                {keys.map((char: string, idx: number) => (
                    <div key={`char-${idx}`} className="bg-gray-50 p-3 text-center font-bold text-lg text-gray-700">
                        {char}
                    </div>
                ))}
                {/* Values (Symbols) */}
                {symbols.map((key: string, idx: number) => (
                    <div key={`key-${idx}`} className="p-3 text-center font-bold text-2xl text-indigo-600 bg-white">
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
               {symbols.map((symbol: string, idx: number) => (
                   <button 
                        key={idx}
                        onClick={() => handleAnswer(symbol)}
                        className="py-4 rounded-xl bg-indigo-600 text-white font-bold text-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg hover:shadow-indigo-200"
                   >
                       {keys[idx]} {/* Show Key (A, B...) on button instead of symbol? Usually user selects the Key */}
                   </button>
               ))}
           </div>
           
           {/* Alternative: If the user needs to select the SYMBOL itself, use symbol.
               But standard Kecermatan is: Look at symbols, find missing one.
               If Question is missing B, then Answer is B (which maps to specific symbol).
               
               In my logic: `jawaban` is the CHAR (Symbol).
               `handleAnswer(val)` checks `val === jawaban`.
               So we should pass the SYMBOL to `handleAnswer`.
               
               BUT, on the button, usually tests show the KEY (A, B, C...) corresponding to that symbol.
               So:
               <button onClick={() => handleAnswer(symbol)}> {keys[idx]} </button>
               This works. The user clicks "A" (which corresponds to symbol[0]), and we send symbol[0] to check.
           */}
           
           <Dialog
            header="Selesai Mengerjakan"
            body="Apakah anda yakin untuk menyelesaikan latihan ini?"
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
