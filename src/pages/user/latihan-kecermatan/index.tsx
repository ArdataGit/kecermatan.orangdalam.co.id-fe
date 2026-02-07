
import { IconCheck, IconRotateClockwise, IconRobot, IconPlayerPlay, IconHistory } from '@tabler/icons-react';
import { useState } from 'react';
import { Button, Select, Dialog, Switch } from 'tdesign-react';
import toast from 'react-hot-toast';
import { postData } from '@/utils/axios';
import { useNavigate } from 'react-router-dom';

export default function LatihanKecermatan() {
  const [metronom, setMetronom] = useState('60');
  const [showAutoModal, setShowAutoModal] = useState(false);
  const [autoOptions, setAutoOptions] = useState({
    huruf: true,
    angka: true,
    simbol: true
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock data for 10 soal slots
  const [soalList, setSoalList] = useState(Array(10).fill({
    simbol: '',
    filled: false
  }));

  const generateRandomString = (length: number, options: { huruf?: boolean; angka?: boolean; simbol?: boolean }) => {
    let pool: string[] = [];
    if (options.huruf !== false) pool = pool.concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
    if (options.angka !== false) pool = pool.concat('0123456789'.split(''));
    // Symbols must be treated as whole strings, not split by char if they contain surrogates/variants
    if (options.simbol !== false) pool = pool.concat(['☘︎', '☀︎', '☁︎', '☂︎', '☃︎']);

    if (pool.length === 0 || pool.length < length) return '';

    // Shuffle pool and slice to ensure uniqueness
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, length).join('');
  };

  const handleSelectSimbol = (index: number) => {
    // Generate 5 random characters using the helper
    const result = generateRandomString(5, { huruf: true, angka: true, simbol: true });

    const newSoalList = [...soalList];
    newSoalList[index] = {
      simbol: result, 
      filled: true
    };
    setSoalList(newSoalList);
  };

  const handleReset = () => {
    setSoalList(Array(10).fill({ simbol: '', filled: false }));
  };

  const handleConfirmAuto = () => {
    if (!autoOptions.huruf && !autoOptions.angka && !autoOptions.simbol) {
      toast.error('Pilih minimal satu jenis karakter');
      return;
    }

    const autoList = Array(10).fill(null).map(() => {
      // Typically kecermatan is 4-5 chars? detailed spec not provided, using 5 to match max input.
      const str = generateRandomString(5, autoOptions);
      return {
        simbol: str, 
        filled: true
      };
    });
    setSoalList(autoList);
    setShowAutoModal(false);
    toast.success('Soal otomatis berhasil dibuat');
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-['Poppins']">
       {/* Breadcrumb would go here if needed, but mockup shows clean header */}
      
      {/* Header Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Waktu</label>
           <Select 
             value={metronom} 
             onChange={(val) => setMetronom(val as string)}
             options={[
               { label: 'Durasi 1 detik', value: '1' },
               { label: 'Durasi 2 detik', value: '2' },
               { label: 'Durasi 3 detik', value: '3' },
               { label: 'Durasi 60 detik', value: '60' }
             ]}
             className="w-full"
           />
        </div>
      </div>

      {/* Soal Grid */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {soalList.map((item, index) => (
              <div key={index} className="flex flex-col gap-2">
                 <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Soal {index + 1}</span>
                    <button 
                      onClick={() => handleSelectSimbol(index)}
                      className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded transition-colors"
                    >
                      Pilih Simbol
                    </button>
                 </div>
                 <div className={`
                    border-2 rounded-lg px-3 h-12 flex items-center justify-between transition-colors
                    ${item.filled ? 'border-green-400 bg-white' : 'border-gray-200 bg-white'}
                    focus-within:border-blue-400
                 `}>
                    <input
                      type="text"
                      value={item.simbol}
                      onChange={(e) => {
                         const val = e.target.value;
                         const chars = Array.from(val);
                         const len = chars.length;
                         
                         if (len > 5) {
                            toast.error('Maksimal input 5 karakter');
                            return;
                         }

                         // Check for duplicates
                         const unique = new Set(chars);
                         if (unique.size !== len) {
                            toast.error('Karakter tidak boleh sama');
                            return;
                         }

                         const newSoalList = [...soalList];
                         newSoalList[index] = {
                            simbol: val,
                            filled: len === 5
                         };
                         setSoalList(newSoalList);
                      }}
                      className="w-full h-full outline-none font-mono text-lg tracking-widest text-gray-600 bg-transparent placeholder-gray-300"
                      placeholder="Input manual..."
                    />
                    {item.filled && (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                         <IconCheck size={14} className="text-white" stroke={3} />
                      </div>
                    )}
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col md:flex-row justify-end items-center gap-4">
         <Button variant="outline" theme="default" onClick={handleReset} icon={<IconRotateClockwise />}>
            Reset
         </Button>
         <Button variant="outline" theme="default" onClick={() => navigate('/latihan-kecermatan/riwayat')} icon={<IconHistory />}>
            Riwayat
         </Button>
         <Button variant="outline" theme="default" onClick={() => setShowAutoModal(true)} icon={<IconRobot />}>
            Soal otomatis
         </Button>
         <Button variant="outline" theme="default">
            Gunakan Soal Sebelumnya?
         </Button>
         <Button 
            theme="primary" 
            className="bg-[#1e293b] border-[#1e293b]" 
            icon={<IconPlayerPlay />}
            loading={loading}
            onClick={async () => {
              // 1. Validate all filled
              const notFilled = soalList.some(s => !s.filled);
              if (notFilled) {
                toast.error('Mohon lengkapi semua 10 soal terlebih dahulu');
                return;
              }

              setLoading(true);
              try {
                // 2. Create Category
                const currentDate = new Date();
                const title = `Latihan ${currentDate.toLocaleDateString('id-ID')} ${currentDate.toLocaleTimeString('id-ID')}`;
                
                const catRes = await postData('kategori-latihan-kecermatan/insert', {
                  judul_kategori: title,
                  keterangan: 'Latihan Mandiri'
                });
                
                if ('error' in catRes) {
                  throw new Error(catRes.message);
                }
                
                // response structure { data: { id: ... } } based on backend controller
                // catRes is AxiosResponse, so catRes.data is the body
                const categoryId = catRes.data?.data?.id; 

                if (!categoryId) {
                  throw new Error('Gagal membuat kategori latihan');
                }

                // 3. Create Kiasan (Loop)
                const promises = soalList.map(soal => {
                   return postData('latihan-kiasan/insert', {
                      kategoriSoalKecermatanId: categoryId,
                      kiasan: Array.from(soal.simbol),
                      waktu: parseInt(metronom) || 1
                   });
                });

                await Promise.all(promises);

                toast.success('Latihan berhasil dibuat!');
                
                // 4. Redirect
                navigate(`/latihan-soal-kecermatan/${categoryId}`);

              } catch (err) {
                console.error(err);
                toast.error('Terjadi kesalahan saat memulai tes');
              } finally {
                setLoading(false);
              }
            }}
         >
            Mulai Tes
         </Button>
      </div>

       <Dialog
        header={null}
        visible={showAutoModal}
        onClose={() => setShowAutoModal(false)}
        footer={null}
        width={500}
        destroyOnClose
      >
        <div className="text-center p-4">
           <div className="w-16 h-16 rounded-full border-4 border-indigo-900 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-indigo-900">!</span>
           </div>
           
           <h2 className="text-xl font-bold text-black mb-4">Soal Otomatis</h2>
           <p className="text-gray-600 mb-8 max-w-sm mx-auto">
             Kolom soal akan terisi otomatis berdasarkan huruf, angka dan symbol yang dipilih.
           </p>

           <div className="flex justify-center gap-8 mb-8">
              <div className="flex flex-col items-center gap-2">
                 <span className="font-medium text-gray-700">Huruf</span>
                 <Switch 
                   size="large"
                   value={autoOptions.huruf} 
                   onChange={(val) => setAutoOptions({...autoOptions, huruf: val})}
                 />
              </div>
              <div className="flex flex-col items-center gap-2">
                 <span className="font-medium text-gray-700">Angka</span>
                 <Switch 
                   size="large"
                   value={autoOptions.angka} 
                   onChange={(val) => setAutoOptions({...autoOptions, angka: val})}
                 />
              </div>
              <div className="flex flex-col items-center gap-2">
                 <span className="font-medium text-gray-700">Simbol</span>
                 <Switch 
                   size="large"
                   value={autoOptions.simbol} 
                   onChange={(val) => setAutoOptions({...autoOptions, simbol: val})}
                 />
              </div>
           </div>

           <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                theme="default" 
                onClick={() => setShowAutoModal(false)}
                className="min-w-[100px]"
              >
                Batal
              </Button>
              <Button 
                theme="primary" 
                className="bg-[#1e293b] border-[#1e293b] min-w-[100px]"
                onClick={handleConfirmAuto}
              >
                Lanjut
              </Button>
           </div>
        </div>
      </Dialog>

    </div>
  );
}
