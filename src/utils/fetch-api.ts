import toast from 'react-hot-toast';

const FetchAPI = async (promise: Promise<any>) => {
  const id = toast.loading('Memproses...');
  try {
    const result = await promise;

    if (result?.status === 200 || result?.status === 201) {
      toast.success(result?.msg || result?.data?.msg || 'Proses Selesai', {
        id,
      });
      return result;
    } else {
      toast.error(
        result?.data?.msg ||
          'Ada kesalahan, silahkan coba lagi nanti atau hubungi admin',
        {
          id,
        }
      );
      throw result;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export default FetchAPI;
