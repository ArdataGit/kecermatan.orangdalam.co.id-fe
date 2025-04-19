import { getData } from '@/utils/axios';
import { imageLink } from '@/utils/image-link';
import { IconBuildingBank, IconUsersGroup } from '@tabler/icons-react';
import moment from 'moment/min/moment-with-locales';
import { useEffect, useState } from 'react';
import { Tag } from 'tdesign-react';

export default function DashboardAdmin() {
  const [data, setData] = useState({
    soal: 0,
    pembelian: 0,
    event: 0,
    voucher: 0,
    user: 0,
    users: [],
    pembelians: [],
  });

  const getDetail = async () => {
    getData(`dashboard/admin`).then((res) => {
      setData(res);
    });
  };

  useEffect(() => {
    getDetail();
  }, []);
  return (
    <>
      <section className="header ">
        <div className="flex flex-col gap-y-5 md:flex-row md:items-center justify-start md:justify-between header-section w-full">
          <div className="title">
            <h1 className="text-2xl text-indigo-950 font-bold mb-1">
              Dashboard
            </h1>
          </div>
        </div>
      </section>

      <section className="stats pt-10 ">
        <h3 className="text-xl font-semibold text-indigo-950 mb-3">
          Statistics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-7 gap-y-7">
          <div className="item-stat bg-white rounded-2xl p-5">
            <div className="flex flex-row mb-7 justify-between">
              <div className="bg-violet-700 rounded-full w-fit p-3">
                <IconBuildingBank className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl text-indigo-950 font-bold">{data?.soal}</h3>
            <p className="text-sm text-gray-500">Bank Soal</p>
          </div>
          <div className="item-stat bg-white rounded-2xl p-5">
            <div className="flex flex-row mb-7 justify-between">
              <div className="bg-blue-700 rounded-full w-fit p-3">
                <IconUsersGroup className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl text-indigo-950 font-bold">{data?.user}</h3>
            <p className="text-sm text-gray-500">Pengguna</p>
          </div>
          <div className="item-stat bg-white rounded-2xl p-5">
            <div className="flex flex-row mb-7 justify-between">
              <div className="bg-orange-500 rounded-full w-fit p-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.17004 7.43994L12 12.5499L20.77 7.46991"
                    stroke="#fff    "
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 21.6099V12.5399"
                    stroke="#fff  "
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.92999 2.48L4.59 5.45003C3.38 6.12003 2.39001 7.80001 2.39001 9.18001V14.83C2.39001 16.21 3.38 17.89 4.59 18.56L9.92999 21.53C11.07 22.16 12.94 22.16 14.08 21.53L19.42 18.56C20.63 17.89 21.62 16.21 21.62 14.83V9.18001C21.62 7.80001 20.63 6.12003 19.42 5.45003L14.08 2.48C12.93 1.84 11.07 1.84 9.92999 2.48Z"
                    stroke="#fff    "
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 13.24V9.58002L7.51001 4.09998"
                    stroke="#fff    "
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl text-indigo-950 font-bold">
              {data?.pembelian}
            </h3>
            <p className="text-sm text-gray-500">Pembelian</p>
          </div>
          <div className="item-stat bg-white rounded-2xl p-5">
            <div className="flex flex-row mb-7 justify-between">
              <div className="bg-cyan-700 rounded-full w-fit p-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 2V5"
                    stroke="#fff"
                    strokeWidth="2"
                    stroke-miterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 2V5"
                    stroke="#fff"
                    strokeWidth="2"
                    stroke-miterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 13H15"
                    stroke="#fff"
                    strokeWidth="2"
                    stroke-miterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 17H12"
                    stroke="#fff"
                    strokeWidth="2"
                    stroke-miterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 3.5C19.33 3.68 21 4.95 21 9.65V15.83C21 19.95 20 22.01 15 22.01H9C4 22.01 3 19.95 3 15.83V9.65C3 4.95 4.67 3.69 8 3.5H16Z"
                    stroke="#fff"
                    strokeWidth="2"
                    stroke-miterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl text-indigo-950 font-bold">{data.event}</h3>
            <p className="text-sm text-gray-500">Event</p>
          </div>
        </div>
      </section>

      <section className="sales pt-10  grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-7">
        <div className="flex flex-col gap-y-3">
          <h3 className="text-xl font-semibold text-indigo-950">
            Pengguna Terbaru
          </h3>
          <div className="flex flex-col bg-white rounded-2xl p-5">
            <table>
              <tbody className="flex flex-col gap-y-6">
                {data?.users?.map((item: any, index) => (
                  <tr
                    className="flex flex-row items-center 2xl:justify-start justify-between"
                    key={index}
                  >
                    <td className="flex justify-between w-full ">
                      <div className="flex xl:basis-5/12 flex-row gap-x-3 items-center">
                        <img
                          className="h-[50px] w-[50px] rounded-2xl object-cover"
                          src={imageLink(item?.gambar)}
                          alt=""
                        />
                        <div>
                          <a href="#">
                            <h3 className="text-indigo-950 font-semibold text-base">
                              {item?.name}
                            </h3>
                          </a>
                          <p className="text-sm text-gray-500">
                            {moment(item?.createdAt).fromNow()}
                          </p>
                        </div>
                      </div>
                      <div className="self-center">
                        <Tag
                          theme={item?.verifyAt ? 'success' : 'warning'}
                          size="large"
                          variant="light"
                        >
                          {item?.verifyAt
                            ? 'Terverifikasi'
                            : 'Belum Verifikasi'}
                        </Tag>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col gap-y-3">
          <h3 className="text-xl font-semibold text-indigo-950">
            Pembelian Terbaru
          </h3>
          <div className="flex flex-col bg-white rounded-2xl p-5">
            <table>
              <tbody className="flex flex-col gap-y-6">
                {data?.pembelians?.map((item: any, index) => (
                  <tr
                    className="flex flex-row items-center 2xl:justify-start justify-between"
                    key={index}
                  >
                    <td className="flex justify-between w-full ">
                      <div className="flex xl:basis-5/12 flex-row gap-x-3 items-center">
                        <img
                          className="h-[50px] w-[50px] rounded-2xl object-cover"
                          alt=""
                          src={imageLink(item?.paketPembelian?.gambar)}
                        />
                        <div>
                          <a href="#">
                            <h3 className="text-indigo-950 font-semibold text-base">
                              {item?.namaPaket}
                            </h3>
                          </a>
                          <p className="text-sm text-gray-500">
                            {moment(item?.createdAt).fromNow()}
                          </p>
                        </div>
                      </div>
                      <div className="self-center">
                        <Tag
                          theme={
                            item?.status === 'PAID'
                              ? 'success'
                              : item?.status === 'UNPAID'
                              ? 'warning'
                              : 'danger'
                          }
                          size="large"
                          variant="light"
                        >
                          {item?.status}
                        </Tag>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
