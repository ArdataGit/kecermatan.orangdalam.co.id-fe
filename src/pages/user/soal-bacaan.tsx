import BreadCrumb from '@/components/breadcrumb';
import useGetList from '@/hooks/use-get-list';
import { Card, Button, Loading } from 'tdesign-react';
import { Link } from 'react-router-dom';
import { IconBook } from '@tabler/icons-react';
import moment from 'moment';

export default function SoalBacaanUser() {
  const { list, isLoading } = useGetList({
    url: 'user/kategori-soal-bacaan/get',
    initialParams: {
      skip: 0,
      take: 100,
      sortBy: 'createdAt',
      descending: true,
    },
  });

  return (
    <div className="section-container">
      <BreadCrumb
        page={[
          { name: 'Dashboard', link: '/' },
          { name: 'Bank Soal Ya atau Tidak', link: '#' },
        ]}
      />

      <div className="bg-white p-8 rounded-2xl min-h-[400px]">
        <h1 className="text-2xl font-bold text-indigo-950 mb-6">
          Bank Soal Ya atau Tidak
        </h1>

        {isLoading ? (
          <div className="flex justify-center p-10">
            <Loading />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list?.map((item: any) => (
              <Card
                key={item.id}
                bordered
                hoverShadow
                className="w-full"
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                        <IconBook size={24} />
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{item.judul_kategori}</h3>
                        <p className="text-sm text-gray-500">{moment(item.createdAt).format('DD MMM YYYY')}</p>
                     </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                    {item.keterangan || 'Tidak ada keterangan'}
                  </p>

                  <div className="flex justify-between items-center mb-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                      <span>Jumlah Bacaan:</span>
                      <span className="font-bold text-gray-800">{item._count?.bacaan || 0}</span>
                  </div>

                  <Link to={`/soal-bacaan/${item.id}`} className="block">
                     <Button theme="primary" variant="base" block>
                        Kerjakan Soal
                     </Button>
                  </Link>
                </div>
              </Card>
            ))}
            
            {(!list || list.length === 0) && (
                <div className="col-span-full text-center py-10 text-gray-500">
                    Belum ada kategori soal tersedia.
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
