export default function TermsOfService() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-10 shadow-sm max-w-4xl mx-auto my-6">
      <h1 className="text-3xl font-bold text-indigo-950 dark:text-indigo-200 mb-6">Ketentuan Layanan</h1>
      
      <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300 mb-3">1. Penerimaan Ketentuan</h2>
          <p>
            Dengan mengakses dan menggunakan layanan kami, Anda setuju untuk terikat oleh Ketentuan Layanan ini dan semua hukum serta peraturan yang berlaku. Jika Anda tidak setuju dengan ketentuan ini, Anda dilarang menggunakan atau mengakses situs ini.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300 mb-3">2. Lisensi Penggunaan</h2>
          <p>
            Izin diberikan untuk mengunduh sementara satu salinan materi (informasi atau perangkat lunak) di situs web kami untuk tampilan pribadi, non-komersial, dan sementara saja. Ini adalah pemberian lisensi, bukan pengalihan hak milik.
          </p>
          <p className="mt-2">Di bawah lisensi ini Anda tidak boleh:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Memodifikasi atau menyalin materi.</li>
            <li>Menggunakan materi untuk tujuan komersial apa pun, atau untuk tampilan publik (komersial atau non-komersial).</li>
            <li>Berusaha mendekompilasi atau merekayasa balik perangkat lunak apa pun yang ada di situs web kami.</li>
            <li>Menghilangkan hak cipta atau notasi kepemilikan lainnya dari materi.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300 mb-3">3. Penafian</h2>
          <p>
            Materi di situs web kami disediakan "sebagaimana adanya". Kami tidak memberikan jaminan, tersurat maupun tersirat, dan dengan ini menyangkal dan meniadakan semua jaminan lainnya termasuk, tanpa batasan, jaminan tersirat atau kondisi kelayakan untuk diperdagangkan, kesesuaian untuk tujuan tertentu, atau non-pelanggaran hak kekayaan intelektual atau pelanggaran hak lainnya.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300 mb-3">4. Batasan Tanggung Jawab</h2>
          <p>
            Dalam hal apa pun kami atau pemasok kami tidak bertanggung jawab atas kerusakan apa pun (termasuk, tanpa batasan, kerusakan karena hilangnya data atau keuntungan, atau karena gangguan bisnis) yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan materi di situs web kami.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300 mb-3">5. Perubahan Ketentuan</h2>
          <p>
            Kami dapat merevisi Ketentuan Layanan ini untuk situs webnya kapan saja tanpa pemberitahuan. Dengan menggunakan situs web ini, Anda setuju untuk terikat oleh versi Ketentuan Layanan yang berlaku saat itu.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">Terakhir diperbarui: Maret 2026</p>
      </div>
    </div>
  );
}
