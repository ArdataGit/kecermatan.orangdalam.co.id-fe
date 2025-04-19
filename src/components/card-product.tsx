import { imageLink } from '@/utils/image-link';
import { formatCurrency } from '@/utils/number-format';
import { IconCheck } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { countDiscount } from '@/const';

const getTotalNonZeroCount = (count: any) => {
  const nonZeroCount = Object.values(count).filter((value) => value !== 0);

  return nonZeroCount.length;
};

export default function CardProduct({
  setVisible,
  isPurchasing,
  item,
  setItemDetail,
  alumniVoucher,
}: any) {
  return (
    <div className="relative flex w-full flex-col rounded-xl bg-white h-fit bg-clip-border text-gray-700 shadow-lg">
      <div className="relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-xl bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40">
        <img src={imageLink(item?.gambar)} alt={item?.nama} />
        <div className="absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-tr from-transparent via-transparent to-black/60"></div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h5 className="block font-sans text-xl antialiased font-medium leading-snug tracking-normal text-blue-gray-900">
            {item?.nama}
          </h5>
          {!isPurchasing && (
            <div className=" self-start text-right">
              {alumniVoucher?.value ? (
                <>
                  <p className="line-through text-xs text-red-500">
                    {formatCurrency(item?.harga)}
                  </p>
                  <motion.span
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 5, x: 0 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    key={alumniVoucher?.value}
                  >
                    <p className="font-semibold text-green-600">
                      {formatCurrency(
                        item?.harga -
                          countDiscount(
                            alumniVoucher?.tipePotongan,
                            item.harga,
                            alumniVoucher?.value
                          )
                      )}
                    </p>
                  </motion.span>
                </>
              ) : (
                <p className="font-bold">{formatCurrency(item?.harga)}</p>
              )}
            </div>
          )}
        </div>
        <div
          className="block font-sans text-base antialiased font-light leading-relaxed text-gray-700"
          dangerouslySetInnerHTML={{ __html: item?.keterangan }}
        />

        {item?.paketPembelianFitur.length ? (
          <ul className="flex flex-col gap-1 mt-5">
            {item?.paketPembelianFitur.map((item: any) => (
              <li className="flex gap-2">
                <span className=" h-fit mt-0.5 border rounded-full  bg-[#def6ee]">
                  <IconCheck size={14} className="text-green-500" />
                </span>
                <p className="block font-sans text-sm antialiased font-normal leading-relaxed text-inherit">
                  {item?.nama}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="p-6 pt-3">
        {!isPurchasing ? (
          <button
            className="block w-full select-none rounded-lg bg-primary py-3.5 px-7 text-center align-middle font-sans text-sm font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            disabled={item._count.Pembelian}
            onClick={() => {
              setVisible(true);
              setItemDetail(item);
            }}
          >
            {item._count.Pembelian ? 'Sudah Diambil' : 'Ambil Sekarang!'}
          </button>
        ) : (
          <div
            className={`grid md:grid-cols-2  xl:grid-cols-${getTotalNonZeroCount(
              item?._count
            )} gap-2`}
          >
            {item?._count.paketPembelianMateri ? (
              <Link
                to={`/my-class/${item.id}/materi`}
                className="block w-full select-none rounded-lg bg-gray-900 py-3.5 text-center align-middle font-sans text-sm font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                Materi
              </Link>
            ) : null}
            {item?._count.paketPembelianBimbel ? (
              <Link
                to={`/my-class/${item.id}/bimbel`}
                className="block w-full select-none rounded-lg bg-gray-900 py-3.5 text-center align-middle font-sans text-sm font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                onClick={() => setVisible(true)}
              >
                Bimbel
              </Link>
            ) : null}
            {item?._count.paketPembelianTryout ? (
              <Link
                to={`/my-class/${item.id}/tryout`}
                className="block w-full select-none rounded-lg bg-gray-900 py-3.5 text-center align-middle font-sans text-sm font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                onClick={() => setVisible(true)}
              >
                Tryout
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
