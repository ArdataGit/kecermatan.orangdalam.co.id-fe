import BreadCrumb from '@/components/breadcrumb';
import CardProduct from '@/components/card-product';
import PaymentModal from '@/components/payment-modal';
import useGetList from '@/hooks/use-get-list';
import { useState } from 'react';

export default function MyClass() {
  const [paymentModal, setPaymentModal] = useState(false);

  const getMyClass = useGetList({
    url: 'user/get-my-class',
    initialParams: {
      skip: 0,
      take: 0,
    },
  });

  return (
    <div className="header min-h-[90vh]  ">
      <BreadCrumb page={[{ name: 'Paket saya', link: '/my-class' }]} />
      {paymentModal && <PaymentModal setVisible={setPaymentModal} />}
      <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full">
        <div className="title">
          <h1 className="text-2xl text-indigo-950 font-bold mb-5">
            Paket Saya
          </h1>
        </div>
      </div>
      <div className="hidden grid-cols-1 grid-cols-2 grid-cols-3 "></div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {getMyClass?.list?.map((item) => {
          return (
            <CardProduct
              setVisible={setPaymentModal}
              item={item.paketPembelian}
              isPurchasing
            />
          );
        })}
      </div>
    </div>
  );
}
