import { IconBrandWhatsapp, IconMail, IconPhone } from '@tabler/icons-react';

export default function Contact() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-10 shadow-sm max-w-4xl mx-auto my-6">
      <h1 className="text-3xl font-bold text-indigo-950 dark:text-indigo-200 mb-6">Kontak Service</h1>
      
      <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
        Kami siap membantu Anda. Jika Anda memiliki pertanyaan, kendala, atau masukan mengenai layanan kami, silakan hubungi tim dukungan kami melalui salah satu saluran di bawah ini.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp */}
        <div className="bg-[#f8fafc] dark:bg-gray-700/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-start gap-4 hover:shadow-md transition">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400">
            <IconBrandWhatsapp size={28} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">WhatsApp</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Respon cepat via Chat WhatsApp</p>
            <a 
              href="https://api.whatsapp.com/send/?phone=6285158891028&text=Halo+admin%2C+saya+butuh+bantuan+di+Kecermatan&type=phone_number&app_absent=0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-green-600 dark:text-green-400 hover:underline"
            >
              Hubungi Whatsapp Admin &rarr;
            </a>
          </div>
        </div>

        {/* Email */}
        {/* <div className="bg-[#f8fafc] dark:bg-gray-700/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-start gap-4 hover:shadow-md transition">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
            <IconMail size={28} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Email</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Kirimkan pertanyaan Anda via email</p>
            <a 
              href="mailto:support@temanasn.com" 
              className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              support@temanasn.com &rarr;
            </a>
          </div>
        </div> */}

        {/* Telepon / CS */}
        {/* <div className="bg-[#f8fafc] dark:bg-gray-700/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-start gap-4 hover:shadow-md transition col-span-1 md:col-span-2">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full text-purple-600 dark:text-purple-400">
            <IconPhone size={28} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Layanan Pelanggan</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Jam Kerja: Senin - Jumat, 09:00 - 17:00 WIB</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Tim kami akan membalas pesan Anda dalam kurun waktu 1x24 jam pada hari kerja.
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
