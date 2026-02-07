import { getData, postData } from '@/utils/axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loading, Dialog } from 'tdesign-react';
import { useAuthStore } from '@/stores/auth-store';
import toast from 'react-hot-toast';
import { IconArrowLeft, IconCheck, IconX, IconBook } from '@tabler/icons-react';
import classNames from 'classnames';

export default function SoalBacaanExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  
  const [currentIndex, setCurrentIndex] = useState(0); // Index of Reading
  
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<any>({});
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);

  const [sessionId, setSessionId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
        fetchData();
        fetchSessionId();
    }
  }, [id]);

  const fetchSessionId = async () => {
      try {
          const res = await getData('user/history-bacaan/generate-session-id');
          if (typeof res?.data === 'number') {
              setSessionId(res.data);
          } else if (typeof res === 'number') {
               setSessionId(res);
          }
      } catch(err) {
          console.error("Failed to generate session ID", err);
      }
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Category Info first
      const catRes = await getData(`user/kategori-soal-bacaan/find/${id}`);
      if(catRes?.data) setTitle(catRes.data.judul_kategori);

      // Fetch Bacaan and Soal
      const res = await getData(`user/bacaan/get?kategoriSoalBacaanId=${id}&includeSoal=true&take=100`);
      if (res?.list) {
          setData(res.list);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data soal");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (soalId: number, val: string, index: number) => {
      const currentBacaan = data[currentIndex];
      const currentSoal = currentBacaan?.soalBacaan?.find((s: any) => s.id === soalId);

      if (!currentSoal) return;

      const isCorrect = val === currentSoal.jawaban;

      // Optimistic UI update
      setAnswers((prev: any) => ({ 
          ...prev, 
          [`${currentBacaan.id}-${soalId}`]: {
              userAnswer: val,
              isCorrect: isCorrect,
              correctAnswer: currentSoal.jawaban,
              soal: currentSoal.soal 
          } 
      }));

      // Submit history
      if (user && sessionId) {
          try {
              await postData('user/history-bacaan/insert', {
                  soalBacaanId: soalId,
                  jawaban: val,
                  bacaanId: currentBacaan.id,
                  kategoriSoalBacaanId: Number(id),
                  bacaanHistoryId: sessionId
              });
          } catch(err) {
              console.error("Failed to save history", err);
          }
      }
  };

  const handleNextReading = () => {
      if (currentIndex < data.length - 1) {
          setCurrentIndex(prev => prev + 1);
          window.scrollTo(0, 0);
      } else {
          setFinished(true);
      }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;
  if (!data?.length) return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500">Tidak ada soal dalam kategori ini.</p>
          <Button onClick={() => navigate(-1)}>Kembali</Button>
      </div>
  );

  if (finished) {
      const totalCorrect = Object.values(answers).filter((a: any) => a.isCorrect).length;
      const totalAnswered = Object.keys(answers).length;
      
      return (
          <div className="max-w-4xl mx-auto p-6">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
                  <h2 className="text-3xl font-bold text-indigo-900 mb-4">Latihan Selesai!</h2>
                  <div className="text-6xl font-bold text-[#F97316] mb-2">{totalCorrect}</div>
                  <p className="text-gray-500 mb-8">Jawaban Benar dari {totalAnswered} Soal Dijawab</p>
                  
                  <div className="flex justify-center gap-4">
                      <Button onClick={() => window.location.reload()} variant="outline">Ulangi Latihan</Button>
                      <Button onClick={() => navigate('/soal-bacaan')}>Kembali ke Daftar</Button>
                  </div>
              </div>
          </div>
      );
  }

  const currentBacaan = data[currentIndex];
  // Ensure soalBacaan exists
  const currentSoalList = currentBacaan?.soalBacaan || [];
  
  // Check if all questions in current reading are answered
  const currentAnswerCount = currentSoalList.reduce((acc: number, soal: any) => {
      if (answers[`${currentBacaan.id}-${soal.id}`]) return acc + 1;
      return acc;
  }, 0);
  const isAllAnswered = currentAnswerCount === currentSoalList.length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       {/* Header */}
       <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
           <div className="flex items-center gap-4">
               <button onClick={() => setShowConfirmFinish(true)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                   <IconArrowLeft size={24} className="text-gray-600" />
               </button>
               <div>
                   <h1 className="font-bold text-gray-800 text-lg">{title}</h1>
                   <div className="text-xs text-gray-500">
                       Bacaan {currentIndex + 1} dari {data.length}
                   </div>
               </div>
           </div>
           
           <Button theme="danger" variant="text" onClick={() => setShowConfirmFinish(true)}>
               Selesai
           </Button>
       </div>

       {/* Content */}
       <div className="flex-1 container mx-auto p-4 md:p-6 max-w-6xl">
            <div className="flex flex-col gap-6">
               
               {/* Top: Reading Material */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                   <div className="p-4 bg-indigo-50 border-b border-indigo-100 font-bold text-indigo-800 flex items-center gap-2">
                       <IconBook size={20} />
                       Bacaan
                   </div>
                   <div className="p-6 text-lg leading-relaxed text-gray-700 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                       {currentBacaan?.bacaan}
                   </div>
               </div>

               {/* Bottom: Questions List */}
               <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-indigo-900 border-b pb-2">Daftar Pertanyaan</h3>
                   {currentSoalList.length > 0 ? (
                       currentSoalList.map((soal: any, idx: number) => {
                           const answerState = answers[`${currentBacaan.id}-${soal.id}`];
                           const userAnswer = answerState?.userAnswer;

                           return (
                               <div key={soal.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between gap-6">
                                   <div className="flex gap-4 flex-1">
                                       <span className="font-bold text-gray-500 min-w-[24px]">{idx + 1}.</span>
                                       <p className="text-lg font-medium text-gray-800">{soal.soal}</p>
                                   </div>
                                    
                                   <div className="flex gap-4 min-w-fit">
                                        <button 
                                            onClick={() => handleAnswer(soal.id, 'Ya', idx)}
                                            className={classNames(
                                                "flex items-center gap-2 px-6 py-2 rounded-lg border-2 transition-all",
                                                userAnswer === 'Ya' 
                                                    ? "bg-orange-100 border-[#F97316] text-[#C2410C] font-bold"
                                                    : "bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-orange-50"
                                            )}
                                        >
                                            <IconCheck size={18} />
                                            YA
                                        </button>

                                        <button 
                                            onClick={() => handleAnswer(soal.id, 'Tidak', idx)}
                                            className={classNames(
                                                "flex items-center gap-2 px-6 py-2 rounded-lg border-2 transition-all",
                                                userAnswer === 'Tidak' 
                                                    ? "bg-red-100 border-red-500 text-red-700 font-bold"
                                                    : "bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50"
                                            )}
                                        >
                                            <IconX size={18} />
                                            TIDAK
                                        </button>
                                   </div>
                               </div>
                           );
                       })
                   ) : (
                       <div className="text-center text-gray-500 py-8">Tidak ada pertanyaan untuk bacaan ini.</div>
                   )}
               </div>

               <div className="flex justify-end pt-4 pb-12">
                   <Button 
                        size="large" 
                        onClick={handleNextReading}
                        disabled={!isAllAnswered}
                    >
                       {currentIndex < data.length - 1 ? "Bacaan Selanjutnya" : "Selesai Latihan"}
                   </Button>
               </div>
           </div>
       </div>

       <Dialog
            header="Selesai Latihan"
            body="Apakah anda yakin ingin mengakhiri latihan ini?"
            visible={showConfirmFinish}
            onClose={() => setShowConfirmFinish(false)}
            onConfirm={() => {
                setShowConfirmFinish(false);
                setFinished(true);
            }}
        />
    </div>
  );
}
