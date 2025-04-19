import { menuListUser, menuListAdmin } from '@/const';
import { useAuthStore } from '@/stores/auth-store';
import { useHomeStore } from '@/stores/home-stores';
import { checkRouteActive } from '@/utils';

import LOGO from '@/assets/Logo.png';

import {
  IconBook,
  IconBook2,
  IconBooks,
  IconChartAreaLine,
  IconChevronDown,
  IconChevronRight,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

type MenuItem = {
  link: string;
  title: string;
  icon: JSX.Element;
  count?: 'pembelian' | 'event';
};

export default function SideMenu({
  classNames,
  menuOpened,
  setMenuOpened,
}: any) {
  const myClass = useAuthStore((state) => state.myClass);
  const account = useAuthStore((state) => state.user);
  const data = useHomeStore((state) => state);

  const menuList =
    account?.role === 'USER'
      ? menuListUser
      : account?.role === 'ADMIN'
      ? menuListAdmin
      : [];

  return (
    <aside
      className={`flex flex-col w-[70%] md:w-[30%] md:max-w-[280px] py-0 h-screen px-5 md:py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l sticky top-0 z-[98]   ${classNames}`}
    >
      <Link to="/" className="hidden md:block">
        <img className="w-auto h-7" src={LOGO} alt="" />
      </Link>

      <div className="flex flex-col justify-between  mt-6">
        <nav className="-mx-3 space-y-1 ">
          {menuList.map((menu: any) => {
            const menuItem = menu.pages.map((page: MenuItem) => (
              <Link
                className={`flex items-center group !mb-3 px-3 py-3 text-black justify-between transition-colors duration-300 transform rounded-lg  hover:bg-indigo-900 hover:text-white hover:shadow-xl ${
                  checkRouteActive(page.link, location.pathname) &&
                  ' bg-indigo-900 text-white'
                }`}
                to={page.link}
              >
                <div className="flex">
                  {page.icon}
                  <span className="mx-2 text-sm font-medium">{page.title}</span>
                </div>
                {page.count && data?.[page.count] ? (
                  <span
                    className={`bg-indigo-900 group-hover:text-indigo-900 group-hover:bg-white text-[10px] w-[25px] h-[25px] flex justify-center items-center text-white rounded-full border-none  whitespace-nowrap text-center align-baseline  ${
                      checkRouteActive(page.link, location.pathname) &&
                      ' !bg-white !text-indigo-900'
                    }`}
                  >
                    {data?.[page.count]}
                  </span>
                ) : null}
              </Link>
            ));

            menuItem.unshift(
              <h6 className="text-sm text-gray-400 ml-2 md:!mt-10 !mb-2">
                {menu.title}
              </h6>
            );
            return menuItem;
          })}
        </nav>
        {account?.role === 'USER' && (
          <div>
            <div className="flex items-center justify-between">
              <h6 className="text-sm text-gray-400  md:!mt-5 mb-2">
                Paket Saya
              </h6>
            </div>

            <nav className="-mx-3 space-y-3">
              <AnimatePresence>
                {myClass?.map((item: any) => (
                  <motion.div
                    key={item.paketPembelianId}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className=""
                  >
                    <button
                      className={`flex items-center justify-between w-full px-3 py-3 group hover:text-white text-base font-medium text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-indigo-900 hover:shadow-xl ${
                        checkRouteActive(
                          `my-class/${item.paketPembelianId}`,
                          location.pathname,
                          item.paketPembelianId
                        ) && ' bg-indigo-900 text-white'
                      }`}
                      onClick={() => {
                        if (menuOpened?.includes(item.paketPembelianId)) {
                          setMenuOpened(
                            menuOpened?.filter(
                              (id: number) => id !== item.paketPembelianId
                            )
                          );
                        } else {
                          setMenuOpened([...menuOpened, item.paketPembelianId]);
                        }
                      }}
                    >
                      <div className="flex items-center gap-x-2">
                        <IconBook2 />
                        <span className="text-left">
                          {item.paketPembelian?.nama}
                        </span>
                      </div>

                      {menuOpened?.includes(item.paketPembelianId) ? (
                        <IconChevronRight className="text-white" />
                      ) : (
                        <IconChevronDown className="text-gray-400 group-hover:text-white" />
                      )}
                    </button>
                    {menuOpened?.includes(item.paketPembelianId) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="pl-4"
                      >
                        {item.paketPembelian?._count?.paketPembelianMateri >
                        0 ? (
                          <Link
                            to={`/my-class/${item.paketPembelianId}/materi`}
                            className={`flex items-center mt-2 justify-between w-full px-3 py-2.5 text-base font-medium text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 ${
                              checkRouteActive(
                                `my-class/${item.paketPembelianId}/materi`,
                                location.pathname
                              ) && '  text-primary'
                            }`}
                          >
                            <div className="flex items-center gap-x-2">
                              <IconBook />
                              <span>Materi</span>
                            </div>
                          </Link>
                        ) : null}
                        {item.paketPembelian?._count?.paketPembelianBimbel >
                        0 ? (
                          <Link
                            to={`/my-class/${item.paketPembelianId}/bimbel`}
                            className={`flex items-center mt-2 justify-between w-full px-3 py-2 text-base font-medium text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 ${
                              checkRouteActive(
                                `my-class/${item.paketPembelianId}/bimbel`,
                                location.pathname
                              ) && ' text-primary bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-x-2">
                              <IconBooks />
                              <span>Bimbel</span>
                            </div>
                          </Link>
                        ) : null}
                        {item.paketPembelian?._count?.paketPembelianTryout >
                        0 ? (
                          <Link
                            to={`/my-class/${item.paketPembelianId}/tryout`}
                            className={`flex items-center mt-2 justify-between w-full px-3 py-2 text-base font-medium text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 ${
                              checkRouteActive(
                                `my-class/${item.paketPembelianId}/tryout`,
                                location.pathname
                              ) && ' text-primary bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-x-2">
                              <IconChartAreaLine />
                              <span>Tryout</span>
                            </div>
                          </Link>
                        ) : null}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
}
