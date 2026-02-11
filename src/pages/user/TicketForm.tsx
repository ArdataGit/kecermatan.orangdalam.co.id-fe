import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postData } from '@/utils/axios';

interface FormData {
  title: string;
  description: string;
  category: string;
  image: string; // ubah ke string (link)
}

interface TicketFormProps {
  closeModal: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ closeModal }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    image: '', // default kosong
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setIsLoading(true);

  if (!formData.title || !formData.description) {
    setError('Title and description are required.');
    setIsLoading(false);
    return;
  }

  try {
    // Ambil auth dari localStorage
    const auth = localStorage.getItem("authentication");
    if (!auth) {
      setError("Authentication not found. Please login again.");
      setIsLoading(false);
      return;
    }

    const parsed = JSON.parse(auth);
    const userId = parsed?.state?.user?.id;

    if (!userId) {
      setError("User ID tidak ditemukan. Silakan login ulang.");
      setIsLoading(false);
      return;
    }

    // Kirim userId ke backend
    const payload = {
      ...formData,
      userId,
    };

    const response = await postData('admin/ticket', payload);

    if ('error' in response) {
      setError(response.message || 'Failed to create ticket. Please try again.');
      setIsLoading(false);
      return;
    }

    setSuccess('Ticket created successfully!');
    setFormData({ title: '', description: '', category: '', image: '' });
    setTimeout(() => {
      closeModal();
      navigate('/my-tickets');
    }, 2000);
  } catch (err) {
    console.error(err);
    setError('An error occurred. Please try again.');
    setIsLoading(false);
  }
};

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-orange-100 text-[#C2410C] rounded">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter ticket title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe your issue in detail"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            <option value="Saran">Saran</option>
            <option value="Komplain">Komplain</option>
          </select>
        </div>

        {/* Ubah file upload jadi text input link */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image Link (Optional)
          </label>
          <input
            type="text"
            name="image"
            id="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/image.png"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={closeModal}
            className="py-2 px-4 border border-[#F97316] text-[#F97316] rounded-md hover:bg-[#F97316] hover:text-white transition-all"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`py-2 px-4 bg-[#F97316] text-white rounded-md hover:bg-[#EA580C] transition-all ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;
