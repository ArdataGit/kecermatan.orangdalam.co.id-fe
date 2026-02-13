
import { IconCheck, IconRotateClockwise, IconRobot, IconPlayerPlay, IconHistory, IconLock } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { Button, Select, Dialog, Switch } from 'tdesign-react';
import toast from 'react-hot-toast';
import { postData } from '@/utils/axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';

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
  const myClass = useAuthStore((state) => state.myClass);

  // Check access
  const hasAccess = myClass?.some(
    (item: any) => item.paketPembelian?.includeLatihanKecermatan === true
  );

  // Mock data for 10 soal slots
  const [soalList, setSoalList] = useState(Array(10).fill({
    simbol: '',
    filled: false
  }));

  const generateRandomString = (length: number, options: { huruf?: boolean; angka?: boolean; simbol?: boolean }) => {
    let pool: string[] = [];
    if (options.huruf !== false) pool = pool.concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
    if (options.angka !== false) pool = pool.concat('0123456789'.split(''));
    if (options.simbol === true) pool = pool.concat('!@#$%^&*()+{}|:<>?-=[]\\;\',./'.split(''));

    if (pool.length === 0 || pool.length < length) return '';

    // Shuffle pool and slice to ensure uniqueness
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, length).join('');
  };

  const handleRandomizeSoal = (index: number) => {
    // Generate 5 random characters using the helper
    const result = generateRandomString(5, { huruf: true, angka: true });

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
    const autoList = Array(10).fill(null).map(() => {
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
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-['Poppins'] relative">
      {!hasAccess && (
        <div className="absolute inset-0 z-50 bg-gray-900/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconLock size={40} className="text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Akses Terkunci</h2>
              <p className="text-gray-600 mb-8">
                Fitur ini hanya tersedia untuk paket pembelian tertentu. <br/>
                <span className="font-semibold text-[#ffb22c]">Harap melakukan pembelian paket yang sesuai.</span>
              </p>
              <Button 
                theme="warning"
                size="large" 
                block
                className="!bg-[#ffb22c] !border-[#ffb22c] font-medium"
                onClick={() => navigate('/paket-pembelian')}
              >
                Lihat Paket
              </Button>
           </div>
        </div>
      )}
       {/* Breadcrumb would go here if needed, but mockup shows clean header */}
      
      {/* Header Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Waktu</label>
            <style>{`
              .select-orange .t-input {
                border: 1px solid #ffb22c !important;
                color: #ffb22c !important;
                transition: all 0.2s linear;
              }
              .select-orange .t-input:hover, 
              .select-orange .t-input--focused,
              .select-orange.t-select-input--focused .t-input {
                border-color: #ffb22c !important;
                box-shadow: 0 0 0 2px rgba(255, 178, 44, 0.2) !important;
              }
              .select-orange .t-input__inner {
                color: #ffb22c !important;
                font-weight: 500;
              }
              .select-orange .t-fake-arrow {
                color: #ffb22c !important;
              }
            `}</style>
            <Select 
              value={metronom} 
              onChange={(val) => setMetronom(val as string)}
              options={[
                { label: 'Durasi 1 Menit', value: '60' },
                { label: 'Durasi 5 Menit', value: '300' },
                { label: 'Durasi 10 Menit', value: '600' },
                { label: 'Durasi 30 Menit', value: '1800' },
                { label: 'Durasi 60 Menit', value: '3600' }
              ]}
              className="w-full md:w-[300px] select-orange"
              disabled
            />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" theme="warning" onClick={() => navigate('/latihan-kecermatan/riwayat')} icon={<IconHistory />}>
              Riwayat
            </Button>
          </div>
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
                      className="text-xs bg-[#ffb22c]/10 hover:bg-[#ffb22c]/20 text-[#ffb22c] px-3 py-1 rounded transition-colors"
                      onClick={() => handleRandomizeSoal(index)}
                    >
                      Acak Karakter
                    </button>
                 </div>
                 <div className={`
                    border-2 rounded-lg px-3 h-12 flex items-center justify-between transition-colors
                    ${item.filled ? 'border-[#ffb22c] bg-white' : 'border-gray-200 bg-white'}
                    focus-within:border-[#ffb22c]
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
                      <div className="w-5 h-5 bg-[#ffb22c] rounded-full flex items-center justify-center flex-shrink-0 ml-2">
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
         <Button variant="outline" theme="warning" onClick={handleReset} icon={<IconRotateClockwise />} className="!text-[#ffb22c] !border-[#ffb22c] hover:!bg-[#ffb22c] hover:!text-white">
            Reset
         </Button>
         <Button variant="outline" theme="warning" onClick={() => setShowAutoModal(true)} icon={<IconRobot />} className="!text-[#ffb22c] !border-[#ffb22c] hover:!bg-[#ffb22c] hover:!text-white">
            Soal otomatis
         </Button>
         <Button variant="outline" theme="warning" className="!text-[#ffb22c] !border-[#ffb22c] hover:!bg-[#ffb22c] hover:!text-white">
            Gunakan Soal Sebelumnya?
         </Button>
         <Button 
            theme="warning" 
            className="!bg-[#ffb22c] !border-[#ffb22c] hover:!bg-[#ffb22c] hover:!border-[#ffb22c]" 
            icon={<IconPlayerPlay />}
            loading={loading}
            onClick={async () => {
              const notFilled = soalList.some(s => !s.filled);
              if (notFilled) {
                toast.error('Mohon lengkapi semua 10 soal terlebih dahulu');
                return;
              }

              setLoading(true);
              try {
                const currentDate = new Date();
                const title = `Latihan ${currentDate.toLocaleDateString('id-ID')} ${currentDate.toLocaleTimeString('id-ID')}`;
                
                const catRes = await postData('kategori-latihan-kecermatan/insert', {
                  judul_kategori: title,
                  keterangan: 'Latihan Mandiri'
                });
                
                if ('error' in catRes) {
                  throw new Error(catRes.message);
                }
                
                const categoryId = catRes.data?.data?.id; 

                if (!categoryId) {
                  throw new Error('Gagal membuat kategori latihan');
                }

                const promises = soalList.map(soal => {
                   return postData('latihan-kiasan/insert', {
                      kategoriLatihanKecermatanId: categoryId,
                      kiasan: Array.from(soal.simbol),
                      waktu: parseInt(metronom) || 1
                   });
                });

                await Promise.all(promises);
                toast.success('Latihan berhasil dibuat!');
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
           <div className="w-16 h-16 rounded-full border-4 border-[#ffb22c] flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-[#ffb22c]">!</span>
           </div>
           
           <h2 className="text-xl font-bold text-black mb-4">Soal Otomatis</h2>
           <p className="text-gray-600 mb-8 max-w-sm mx-auto">
             Kolom soal akan terisi otomatis berdasarkan huruf dan angka yang dipilih.
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
                theme="warning" 
                onClick={() => setShowAutoModal(false)}
                className="min-w-[100px]"
              >
                Batal
              </Button>
              <Button 
                theme="warning" 
                className="bg-[#ffb22c] border-[#ffb22c] min-w-[100px]"
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
