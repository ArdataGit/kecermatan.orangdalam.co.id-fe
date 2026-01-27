
import { getData, postData } from '@/utils/axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loading, Dialog, Textarea } from 'tdesign-react';
import { useAuthStore } from '@/stores/auth-store';
import toast from 'react-hot-toast';
import { IconArrowLeft } from '@tabler/icons-react';

export default function SoalIsianExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  
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
          const res = await getData('user/history-isian/generate-session-id');
          if (typeof res === 'number') {
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
      const catRes = await getData(`user/kategori-soal-isian/find/${id}`);
      if(catRes?.data) setTitle(catRes.data.judul_kategori);

      // Fetch Soal
      const res = await getData(`user/soal-isian/get?kategoriSoalIsianId=${id}&take=100`);
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

  const handleAnswerChange = (soalId: number, val: string) => {
       setAnswers((prev: any) => ({ 
          ...prev, 
          [soalId]: {
              ...prev[soalId],
              userAnswer: val
          } 
      }));
  };

  const handleAnswerBlur = async (soalId: number, val: string) => {
      // Submit history on blur (focus lost)
      if (user && sessionId) {
          try {
              await postData('user/history-isian/insert', {
                  soalIsianId: soalId,
                  jawaban: val,
                  kategoriSoalIsianId: Number(id),
                  isianHistoryId: sessionId
              });
              console.log("Saving answer for", soalId, val);
          } catch(err) {
              console.error("Failed to save history", err);
          }
      }
  };

  const calculateResults = () => {
      // Simple result calculation logic or just finish
      // For text answers, auto-grading might not be possible simply.
      // We'll just show completion.
      setFinished(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;
  if (!data?.length) return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500">Tidak ada soal dalam kategori ini.</p>
          <Button onClick={() => navigate(-1)}>Kembali</Button>
      </div>
  );

  if (finished) {
      const totalAnswered = Object.keys(answers).filter(k => answers[k]?.userAnswer?.trim()).length;
      
      return (
          <div className="max-w-4xl mx-auto p-6">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
                  <h2 className="text-3xl font-bold text-indigo-900 mb-4">Latihan Selesai!</h2>
                  <div className="text-6xl font-bold text-blue-500 mb-2">{totalAnswered}</div>
                  <p className="text-gray-500 mb-8">Soal Dijawab dari {data.length} Soal</p>
                  
                  <div className="flex justify-center gap-4">
                      <Button onClick={() => window.location.reload()} variant="outline">Ulangi Latihan</Button>
                      <Button onClick={() => navigate('/soal-isian')}>Kembali ke Daftar</Button>
                  </div>
              </div>
          </div>
      );
  }

  const answeredCount = Object.keys(answers).filter(k => answers[k]?.userAnswer?.trim()).length;

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
                       {answeredCount} dari {data.length} soal dijawab
                   </div>
               </div>
           </div>
           
           <Button theme="danger" variant="text" onClick={() => setShowConfirmFinish(true)}>
               Selesai
           </Button>
       </div>

       {/* Content */}
       <div className="flex-1 container mx-auto p-4 md:p-6 max-w-4xl">
            <div className="flex flex-col gap-6">
               <div className="flex flex-col gap-6">
                   {data.map((soal: any, idx: number) => {
                       const userAnswer = answers[soal.id]?.userAnswer || '';

                       return (
                           <div key={soal.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
                               <div className="flex gap-4">
                                   <span className="font-bold text-gray-500 min-w-[24px]">{idx + 1}.</span>
                                   <p className="text-lg font-medium text-gray-800 whitespace-pre-wrap">{soal.soal}</p>
                               </div>
                                
                               <div className="pl-10">
                                   <Textarea
                                      placeholder="Ketik jawaban anda disini..."
                                      value={userAnswer}
                                      onChange={(val) => handleAnswerChange(soal.id, val)}
                                      onBlur={() => handleAnswerBlur(soal.id, userAnswer)}
                                      autosize={{ minRows: 3, maxRows: 10 }}
                                      className="w-full"
                                   />
                               </div>
                           </div>
                       );
                   })}
               </div>

               <div className="flex justify-end pt-4 pb-12">
                   <Button 
                        size="large" 
                        onClick={() => setShowConfirmFinish(true)}
                    >
                       Selesai Latihan
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
                calculateResults();
            }}
        />
    </div>
  );
}
