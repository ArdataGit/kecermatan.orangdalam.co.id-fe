import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 px-4 md:px-7 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {currentYear} Orang Dalam. Semua hak dilindungi.
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link 
            to="/kebijakan-privasi" 
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Kebijakan Privasi
          </Link>
          <Link 
            to="/ketentuan-layanan" 
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Ketentuan Layanan
          </Link>
          <Link 
            to="/kontak" 
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Kontak Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
