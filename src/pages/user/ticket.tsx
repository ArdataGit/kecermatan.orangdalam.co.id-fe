import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData } from '@/utils/axios';
import TicketForm from './TicketForm';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Ticket {
  id: number;
  userId: number;
  title: string;
  description: string;
  category?: string | null;
  status: string;
  image?: string | null;
  adminResponse?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

const TicketList: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const fetchTickets = async () => {
  try {
    const auth = localStorage.getItem("authentication");
    console.log("Auth Data:", auth);
    let userId = null;

    if (auth) {
      const parsed = JSON.parse(auth);
      console.log("Parsed Auth:", parsed);
      userId = parsed.state?.user?.id;
      console.log("User ID:", userId);
    }

    if (!userId) {
      setError("User ID tidak ditemukan. Silakan login ulang.");
      return;
    }

    const res = await getData(
      `admin/ticket/user?userId=${userId}&sortBy=updatedAt&descending=true&_=${Date.now()}`
    );
    console.log("Raw API Response:", res);

    // Ubah pengecekan dan akses data
    if (!res || !res.list) {
      setError(res.msg || "Failed to fetch tickets.");
      return;
    }

    console.log("Tickets Data:", res.list);
    setTickets(res.list);
  } catch (err) {
    console.error("Fetch tickets error:", err.message, err.stack);
    setError("An error occurred while fetching tickets.");
  }
};

useEffect(() => {
  console.log("Updated Tickets:", tickets);
}, [tickets]);


  // hanya sekali jalan saat mount
  useEffect(() => {
    fetchTickets();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    fetchTickets(); // refresh lagi setelah modal close
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-950">My Tickets</h1>
        <button
          onClick={openModal}
          className="py-2 px-4 bg-indigo-900 text-white rounded-md hover:bg-indigo-800 transition-all"
        >
          Create New Ticket
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="text-center text-gray-600">No tickets found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">ID</th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Title</th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Category</th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Status</th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Admin Response</th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Lampiran</th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Created At</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{ticket.id}</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{ticket.title}</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{ticket.category || 'N/A'}</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold
                        ${ticket.status === 'open' ? 'bg-blue-100 text-blue-700' : ''}
                        ${ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${ticket.status === 'resolved' ? 'bg-orange-100 text-[#C2410C]' : ''}
                        ${ticket.status === 'closed' ? 'bg-gray-100 text-gray-700' : ''}`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {ticket.adminResponse || 'No response'}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                      {ticket.image ? (
                        <a
                          href={ticket.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Image
                        </a>
                      ) : (
                        'No Image'
                      )}
                    </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-indigo-950">Create a New Ticket</h2>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <TicketForm closeModal={closeModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;
