import BreadCrumb from "@/components/breadcrumb";
import CardProduct from "@/components/card-product";
import PaymentModal from "@/components/payment-modal";
import useGetList from "@/hooks/use-get-list";
import useDebounce from "@/hooks/useDebounce";
import { getData } from "@/utils/axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
// helper buat ambil query params
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
export default function PaketPembelian() {
  const query = useQuery();
  const searchFromUrl = query.get("search") || "";
  const [paymentModal, setPaymentModal] = useState(false);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<{ nama: string }[]>([]);
  const [search, setSearch] = useState(searchFromUrl); // ✅ initial dari query
  const [alumniVoucher, setAlumniVoucher] = useState({});
  const [itemDetail, setItemDetail] = useState({});
  const { ref, inView } = useInView();
  const searchQ = useDebounce(search, 1000);
  const getClass = useGetList({
    initialParams: {
      take: page * 10,
    },
    url: "user/tryout/my-tryout",
  });
  console.log("getClass", getClass);
  const getCategories = async () => {
    getData(`user/category/get`).then((res) => {
      setCategory(res);
    });
  };
  useEffect(() => {
    getClass.setParams((param: any) => ({ ...param, search: searchQ || "" }));
  }, [searchQ]);
  useEffect(() => {
    getCategories();
  }, []);
  const getAlumniVoucher = async () => {
    getData(`user/get-voucher-alumni`).then((res) => {
      setAlumniVoucher(res);
    });
  };
  useEffect(() => {
    getAlumniVoucher();
  }, []);
  useEffect(() => {
    if (inView) return setPage(page + 1);
  }, [inView]);
  useEffect(() => {
    getClass.setParams((param: any) => ({ ...param, take: page * 10 }));
  }, [page]);

  return (
    <div>
      {paymentModal && (
        <PaymentModal
          setVisible={setPaymentModal}
          itemDetail={itemDetail}
          alumniVoucher={alumniVoucher}
        />
      )}
      <BreadCrumb
        page={[{ name: "Paket Pembelian", link: "/paket-pembelian" }]}
      />
      {/* header section */}
      <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full">
        <div className="title flex justify-between w-full items-start">
          <h1 className="text-2xl text-indigo-900 font-bold mb-5">
            Paket Tryout
          </h1>
          <Link
            to={"riwayat"}
            className="text-sm md:text-md text-blue-700 items-center mb-5"
          >
            Riwayat <span className="max-sm:hidden">Pembelian</span>
          </Link>
        </div>
      </div>
      {/* category filter */}
      <div className="flex flex-nowrap overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap sm:pb-0 gap-x-3 mb-5">
        <button
          className={`
            py-3 px-6
            border
            rounded
            text-primary
            border-indigo-900
            hover:bg-indigo-900
            hover:shadow-[5px_5px_rgb(255,_0,_108,_0.4),_10px_10px_rgb(255,_0,_109,_0.22)]
            whitespace-nowrap flex-shrink-0
            sm:whitespace-normal sm:flex-shrink sm:mr-2 sm:mb-5
            ${
              getClass.params.category === ""
                ? " shadow-[5px_5px_rgb(255,_0,_108,_0.4),_10px_10px_rgb(255,_0,_109,_0.22)] bg-indigo-900 text-white"
                : " bg-white"
            }
            hover:text-white`}
          onClick={() => {
            getClass.setParams({
              ...getClass.params,
              category: "",
            });
          }}
        >
          Semua Kelas
        </button>
        {category?.map((item) => (
          <button
            key={item.nama}
            onClick={() => {
              getClass.setParams({
                ...getClass.params,
                category: item?.nama,
              });
            }}
            className={`
              py-3 px-6
              border
              rounded
              text-primary
              border-indigo-900
              hover:bg-indigo-900
              hover:shadow-[5px_5px_rgb(255,_0,_108,_0.4),_10px_10px_rgb(255,_0,_109,_0.22)]
              whitespace-nowrap flex-shrink-0
              sm:whitespace-normal sm:flex-shrink sm:mr-2 sm:mb-5
              ${
                getClass.params.category === item.nama
                  ? " shadow-[5px_5px_rgb(255,_0,_108,_0.4),_10px_10px_rgb(255,_0,_109,_0.22)] bg-indigo-900 text-white"
                  : " bg-white"
              }
              hover:text-white`}
          >
            {item.nama}
          </button>
        ))}
      </div>
      {/* search bar */}
      <div className="flex *:bg-slate-200 mt-4 mb-8 rounded-md border border-slate-300 mx-sm:w-fit w-full max-w-[25rem] overflow-hidden items-stretch">
        <input
          placeholder={"Cari disini"}
          type="text"
          value={search}
          onChange={(e) => setSearch(e?.target?.value)}
          className="px-3 py-2.5 flex-grow text-[0.9rem]"
        />
        <div className="px-3 py-2 flex items-center">
          <svg
            className="size-[1.1rem]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
      </div>
      {/* product list */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {getClass?.list?.map((item) => (
          <CardProduct
            key={item.id}
            setVisible={setPaymentModal}
            item={item}
            alumniVoucher={alumniVoucher}
            setItemDetail={setItemDetail}
          />
        ))}
        <div ref={ref}></div>
      </div>
    </div>
  );
}
