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
  IconX,
  IconUsers,
  IconBrandCashapp,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

type MenuItem = {
  link: string;
  title: string;
  icon: JSX.Element;
  count?: 'pembelian' | 'event';
  exact?: boolean;
};

interface SideMenuProps {
  classNames: string;
  menuOpened: number[];
  setMenuOpened: (value: number[]) => void;
  toggleMenu?: () => void;
}

export default function SideMenu({
  classNames,
  menuOpened,
  setMenuOpened,
  toggleMenu,
}: SideMenuProps) {
  const myClass = useAuthStore((state) => state.myClass);
  const account = useAuthStore((state) => state.user);
  const data = useHomeStore((state) => state);
  const location = useLocation();

  const menuList =
    account?.role === 'USER'
      ? menuListUser
      : account?.role === 'ADMIN'
      ? menuListAdmin
      : [];

  return (
    <aside
      className={`flex flex-col w-full h-full py-0 px-6 md:w-[300px] md:py-8 overflow-y-auto 
        bg-white dark:bg-gray-900 
        border-r dark:border-gray-700 
        rtl:border-r-0 rtl:border-l 
        md:sticky md:top-0 z-[98] ${classNames}`}
    >
      {/* Navbar top */}
      <div className="flex flex-row justify-between bg-white dark:bg-gray-900 p-5 md:py-4 md:px-7">
        <div className="logo flex-row justify-center items-center gap-x-2">
          <img className="w-auto h-7" src={LOGO} alt="logo" />
        </div>
      </div>

      {/* Close button for mobile */}
      <div className="flex justify-end md:hidden py-5">
        <button
          onClick={toggleMenu}
          className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
        >
          <IconX size={24} />
        </button>
      </div>

      <div className="flex flex-col justify-between mt-0">
        <nav className="-mx-3 space-y-4">
          {menuList.map((menu: any) => {
            const menuItem = menu.pages.map((page: MenuItem) => (
              <Link
                key={page.link}
                className={`flex items-center group !mb-4 px-4 py-3 justify-between transition-colors duration-300 transform rounded-lg 
                  text-gray-700 dark:text-gray-300 
                  hover:bg-indigo-100 dark:hover:bg-gray-800
                  ${
                    checkRouteActive(page.link, location.pathname, 0, page.exact) &&
                    'bg-[#F97316] text-white'
                  }`}
                to={page.link}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    toggleMenu && toggleMenu();
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{page.icon}</span>
                  <span className="text-base font-medium">{page.title}</span>
                </div>
                {page.count && data?.[page.count] ? (
                  <span
                    className={`text-xs w-[22px] h-[22px] flex justify-center items-center rounded-full 
                      bg-[#F97316] text-white
                      dark:bg-[#F97316] dark:text-gray-900
                      ${
                        checkRouteActive(page.link, location.pathname, 0, page.exact) &&
                        'bg-white text-[#F97316] dark:bg-gray-100'
                      }`}
                  >
                    {data?.[page.count]}
                  </span>
                ) : null}
              </Link>
            ));

            menuItem.unshift(
              <h6
                key={menu.title}
                className="text-sm text-gray-500 dark:text-gray-400 ml-3 mt-6 mb-3 uppercase tracking-wide"
              >
                {menu.title}
              </h6>
            );
            return menuItem;
          })}
        </nav>

        {/* Affiliate Section (admin only) */}
        {account?.role === 'ADMIN' && (
          <div>
            <h6 className="text-sm text-gray-500 dark:text-gray-400 ml-3 mt-6 mb-3 uppercase tracking-wide">
              Affiliate
            </h6>
            <nav className="-mx-3 space-y-3">
              <Link
                to="/affiliate"
                className={`flex items-center group !mb-4 px-4 py-3 justify-between transition-colors duration-300 transform rounded-lg 
                  text-gray-700 dark:text-gray-300 
                  hover:bg-indigo-100 dark:hover:bg-gray-800
                  ${
                    checkRouteActive('/affiliate', location.pathname) &&
                    'bg-[#F97316] text-white'
                  }`}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    toggleMenu && toggleMenu();
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <IconUsers size={20} />
                  <span className="text-base font-medium">Affiliate</span>
                </div>
              </Link>
              <Link
                to="/affiliate-commission"
                className={`flex items-center group !mb-4 px-4 py-3 justify-between transition-colors duration-300 transform rounded-lg 
                  text-gray-700 dark:text-gray-300 
                  hover:bg-indigo-100 dark:hover:bg-gray-800
                  ${
                    checkRouteActive('/affiliate-commission', location.pathname) &&
                    'bg-[#F97316] text-white'
                  }`}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    toggleMenu && toggleMenu();
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <IconBrandCashapp size={20} />
                  <span className="text-base font-medium">Affiliate Commission</span>
                </div>
              </Link>
            </nav>
          </div>
        )}

        {/* Affiliate Section (user only) - ✅ BARU */}
        {account?.role === 'USER' && account?.affiliateCode && (
          <div>
            <h6 className="text-sm text-gray-500 dark:text-gray-400 ml-3 mt-6 mb-3 uppercase tracking-wide">
              Affiliate
            </h6>
            <nav className="-mx-3 space-y-3">
              <Link
                to="/profile?tab=affiliate"
                className={`flex items-center group !mb-4 px-4 py-3 justify-between transition-colors duration-300 transform rounded-lg 
                  text-gray-700 dark:text-gray-300 
                  hover:bg-indigo-100 dark:hover:bg-gray-800
                  ${
                    location.pathname === '/profile' && location.search.includes('tab=affiliate') &&
                    'bg-[#F97316] text-white'
                  }`}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    toggleMenu && toggleMenu();
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <IconBrandCashapp size={20} />
                  <span className="text-base font-medium">My Affiliate</span>
                </div>
              </Link>
            </nav>
          </div>
        )}
            {/* Riwayat Pembelian (user only) */}
      

        {/* Paket Saya (user only) */}
        {account?.role === 'USER' && (
          <div>
            <div className="flex items-center justify-between">
              <h6 className="text-sm text-gray-500 dark:text-gray-400 mt-6 mb-3 uppercase tracking-wide">
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
                  >
                    <button
                      className={`flex items-center justify-between w-full px-4 py-3 group 
                        text-base font-medium rounded-lg transition-colors duration-300
                        text-gray-700 dark:text-gray-300
                        hover:bg-indigo-100 dark:hover:bg-gray-800
                        ${
                          checkRouteActive(
                            `my-class/${item.paketPembelianId}`,
                            location.pathname,
                            item.paketPembelianId
                          ) && 'bg-[#F97316] text-white'
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
                      <div className="flex items-center gap-x-3">
                        <IconBook2 size={20} />
                        <span className="text-left text-base">
                          {item.paketPembelian?.nama}
                        </span>
                      </div>

                      {menuOpened?.includes(item.paketPembelianId) ? (
                        <IconChevronRight size={20} className="text-white" />
                      ) : (
                        <IconChevronDown
                          size={20}
                          className="text-gray-400 dark:text-gray-500 group-hover:text-white"
                        />
                      )}
                    </button>

                    {/* Dropdown content */}
                    {menuOpened?.includes(item.paketPembelianId) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="pl-6"
                      >
                        {/* Materi */}
                        {item.paketPembelian?._count?.paketPembelianMateri > 0 && (
                          <Link
                            to={`/my-class/${item.paketPembelianId}/materi`}
                            className={`flex items-center mt-2 justify-between w-full px-4 py-2.5 text-base font-medium rounded-lg
                              text-gray-700 dark:text-gray-300 
                              hover:bg-gray-100 dark:hover:bg-gray-800
                              ${
                                checkRouteActive(
                                  `my-class/${item.paketPembelianId}/materi`,
                                  location.pathname
                                ) && 'text-[#F97316]'
                              }`}
                          >
                            <div className="flex items-center gap-x-3">
                              <IconBook size={18} />
                              <span>Materi</span>
                            </div>
                          </Link>
                        )}

                        {/* Bimbel */}
                        {item.paketPembelian?._count?.paketPembelianBimbel > 0 && (
                          <Link
                            to={`/my-class/${item.paketPembelianId}/bimbel`}
                            className={`flex items-center mt-2 justify-between w-full px-4 py-2 text-base font-medium rounded-lg
                              text-gray-700 dark:text-gray-300 
                              hover:bg-gray-100 dark:hover:bg-gray-800
                              ${
                                checkRouteActive(
                                  `my-class/${item.paketPembelianId}/bimbel`,
                                  location.pathname
                                ) && 'text-[#F97316] bg-gray-50 dark:bg-gray-800'
                              }`}
                          >
                            <div className="flex items-center gap-x-3">
                              <IconBooks size={18} />
                              <span>Bimbel</span>
                            </div>
                          </Link>
                        )}

                        {/* Tryout */}
                        {item.paketPembelian?._count?.paketPembelianTryout > 0 && (
                          <Link
                            to={`/my-class/${item.paketPembelianId}/tryout`}
                            className={`flex items-center mt-2 justify-between w-full px-4 py-2 text-base font-medium rounded-lg
                              text-gray-700 dark:text-gray-300 
                              hover:bg-gray-100 dark:hover:bg-gray-800
                              ${
                                checkRouteActive(
                                  `my-class/${item.paketPembelianId}/tryout`,
                                  location.pathname
                                ) && 'text-[#F97316] bg-gray-50 dark:bg-gray-800'
                              }`}
                          >
                            <div className="flex items-center gap-x-3">
                              <IconChartAreaLine size={18} />
                              <span>Tryout</span>
                            </div>
                          </Link>
                        )}

                        {/* Kecermatan */}
                        {item.paketPembelian?._count?.paketPembelianKecermatan > 0 && (
                          <Link
                            to={`/my-class/${item.paketPembelianId}/kecermatan`}
                            className={`flex items-center mt-2 justify-between w-full px-4 py-2 text-base font-medium rounded-lg
                              text-gray-700 dark:text-gray-300 
                              hover:bg-gray-100 dark:hover:bg-gray-800
                              ${
                                checkRouteActive(
                                  `my-class/${item.paketPembelianId}/kecermatan`,
                                  location.pathname
                                ) && 'text-[#F97316] bg-gray-50 dark:bg-gray-800'
                              }`}
                          >
                            <div className="flex items-center gap-x-3">
                              <IconChartAreaLine size={18} />
                              <span>Kecermatan</span>
                            </div>
                          </Link>
                        )}

                        {/* Bacaan */}
                        {item.paketPembelian?._count?.paketPembelianBacaan > 0 && (
                          <Link
                            to={`/my-class/${item.paketPembelianId}/bacaan`}
                            className={`flex items-center mt-2 justify-between w-full px-4 py-2 text-base font-medium rounded-lg
                              text-gray-700 dark:text-gray-300 
                              hover:bg-gray-100 dark:hover:bg-gray-800
                              ${
                                checkRouteActive(
                                  `my-class/${item.paketPembelianId}/bacaan`,
                                  location.pathname
                                ) && 'text-[#F97316] bg-gray-50 dark:bg-gray-800'
                              }`}
                          >
                            <div className="flex items-center gap-x-3">
                              <IconBook size={18} />
                              <span>Bacaan</span>
                            </div>
                          </Link>
                        )}

                        {/* Isian */}
                        {item.paketPembelian?._count?.paketPembelianIsian > 0 && (
                          <Link
                            to={`/my-class/${item.paketPembelianId}/isian`}
                            className={`flex items-center mt-2 justify-between w-full px-4 py-2 text-base font-medium rounded-lg
                              text-gray-700 dark:text-gray-300 
                              hover:bg-gray-100 dark:hover:bg-gray-800
                              ${
                                checkRouteActive(
                                  `my-class/${item.paketPembelianId}/isian`,
                                  location.pathname
                                ) && 'text-[#F97316] bg-gray-50 dark:bg-gray-800'
                              }`}
                          >
                            <div className="flex items-center gap-x-3">
                              <IconBook size={18} />
                              <span>Isian</span>
                            </div>
                          </Link>
                        )}
                        
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