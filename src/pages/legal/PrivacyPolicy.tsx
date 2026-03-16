export default function PrivacyPolicy() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-10 shadow-sm max-w-4xl mx-auto my-6">
      <h1 className="text-3xl font-bold text-indigo-950 dark:text-indigo-200 mb-6">Kebijakan Privasi</h1>
      
      <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300 mb-3">1. Informasi yang Kami Kumpulkan</h2>
          <p>
            Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami saat mendaftar akun, menggunakan layanan kami, atau berkomunikasi dengan kami. Informasi ini dapat mencakup nama, alamat email, nomor telepon, dan data profil lainnya.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300 mb-3">2. Penggunaan Informasi</h2>
          <p>Kami menggunakan informasi yang kami kumpulkan untuk:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Menyediakan, memelihara, dan meningkatkan layanan kami.</li>
            <li>Memproses transaksi dan mengirimkan pemberitahuan terkait.</li>
            <li>Mengirimkan komunikasi teknis, pembaruan, keamanan, dan dukungan.</li>
            <li>Menyampaikan konten yang dipersonalisasi dan iklan yang relevan.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300 mb-3">3. Perlindungan data</h2>
          <p>
            Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang wajar untuk melindungi informasi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300 mb-3">4. Cookies</h2>
          <p>
            Kami menggunakan cookies dan teknologi serupa untuk mengumpulkan informasi tentang aktivitas Anda di situs kami dan mengingat preferensi Anda untuk meningkatkan pengalaman pengguna.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300 mb-3">5. Perubahan Kebijakan</h2>
          <p>
            Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan apa pun dengan memposting kebijakan baru di halaman ini.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">Terakhir diperbarui: Maret 2026</p>
      </div>
    </div>
  );
}
