import {
  IconBell,
  IconCircleCheck,
  IconCircleX,
  IconHourglassHigh,
  IconMenu2,
} from '@tabler/icons-react';

import LOGO from '@/assets/Logo.png';

import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { checkRouteActive } from './utils';
import { useAuthStore } from './stores/auth-store';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment/min/moment-with-locales';

interface LayoutProps {
  children: React.ReactNode;
}
import 'moment/min/moment-with-locales';
import { imageLink } from './utils/image-link';
import useGetList from './hooks/use-get-list';
import SideMenu from './components/side-menu';
import AlertTryout from './components/alert-tryout';
import { useHomeStore } from '@/stores/home-stores';
import { getData, postData } from './utils/axios';

const generateIcon = (status: string) => {
  switch (status) {
    case 'PAYMENT_PENDING':
      return <IconHourglassHigh className="text-warning" size={30} />;
    case 'PAYMENT_SUCCESS':
      return <IconCircleCheck className="text-success" size={30} />;
    case 'PAYMENT_FAILED':
      return <IconCircleX className="text-red-500" size={30} />;
  }
};
export default function App({ children }: LayoutProps) {
  moment.locale('id');
  const { setMyClass } = useAuthStore();
  const { id } = useParams();
  const data = useHomeStore((state) => state);

  const [showMenu, setShowMenu] = useState(false);
  const { logout } = useAuthStore();
  const dropdownProfile = useRef<HTMLDivElement | null>(null);
  const dropdownProfileMobile = useRef<HTMLDivElement | null>(null);
  const account = useAuthStore((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = () => {
    setShowMenu(showMenu ? false : true);
  };

  const [showDropdownProfile, setShowDropdownProfile] = useState(false);
  const [showDropdownProfileMobile, setShowDropdownProfileMobile] =
    useState(false);

  const toggleDropdownProfileMobile = () => {
    setShowDropdownProfileMobile(!showDropdownProfileMobile);
  };
  const toggleDropdownProfile = () => {
    setShowDropdownProfile(!showDropdownProfile);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (
      dropdownProfile.current &&
      !dropdownProfile?.current?.contains(target)
    ) {
      setShowDropdownProfile(false);
    }
  };

  const handleClickOutsideMobile = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (
      dropdownProfileMobile.current &&
      !dropdownProfileMobile?.current?.contains(target)
    ) {
      setShowDropdownProfileMobile(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('click', handleClickOutsideMobile);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('click', handleClickOutsideMobile);
    };
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  const getMyClass = useGetList({
    url: 'user/get-my-class',
    initialParams: {
      skip: 0,
      take: 0,
      disabled: account?.role === 'ADMIN',
    },
    handleSuccess: (res) => {
      setMyClass(res.list);
    },
  });

  useEffect(() => {
    getMyClass.refresh();
  }, [location.pathname]);

  const [menuOpened, setMenuOpened] = useState<number[]>([]);

  useEffect(() => {
    if (checkRouteActive(`my-class/${id}`, location.pathname)) {
      setMenuOpened([Number(id)]);
    } else {
      setMenuOpened([]);
    }
    setShowMenu(false);
  }, [location.pathname]);
  const [notificationTab, setNotificationTab] = useState('SYSTEM');

  const readData = async (id: number, url: string) => {
    await postData('user/notification/read', { id });

    window.location.href = url;
  };

  const setData = useHomeStore((state) => state.setData);
  const getDetail = async () => {
    getData(`dashboard/user`).then((res) => {
      setData(res);
    });
  };

  useEffect(() => {
    getDetail();
  }, [location.pathname]);

  const handleReadAll = async () => {
    await postData('user/notification/read-all');
    getDetail();
  };

  return (
    <body className="font-['Poppins'] bg-[#f5f5f5] scroll-smooth">
      <div className="flex flex-row justify-between md:hidden bg-white p-5">
        <div className="logo flex-row justify-center items-center gap-x-2 hidden md:flex">
          <img className="w-auto h-7" src={LOGO} alt="" />
        </div>
        <button
          id="btn-dropdown"
          onClick={toggleDropdown}
          className="flex flex-row items-center p-2 border border-gray-300 rounded-full"
        >
          <IconMenu2 />
        </button>
        <div
          className="user flex-row items-center gap-x-3  md:hidden flex relative"
          ref={dropdownProfileMobile}
        >
          {account?.role === 'USER' && (
            <div className="relative font-[sans-serif] w-max mx-auto group group-hover:opacity-100 ">
              <button
                type="button"
                className="w-10 h-10  border border-primary flex items-center justify-center group rounded-full text-sm font-semibold bg-white group-hover:bg-indigo-800 text-indigo-800 group-hover:text-white"
              >
                {data?.notifikasi?.filter((e: any) => !e?.isRead).length ? (
                  <div className="absolute inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-primary group-hover:bg-white group-hover:text-primary group-hover:border group-hover:border-primary rounded-full -top-1 -end-0">
                    {data.notifikasi.filter((e: any) => !e?.isRead).length}
                  </div>
                ) : null}

                <IconBell className="animate-swing" size={23} />
              </button>

              <div className="absolute pt-5 -right-32 md:-right-20 top-[-999px]  group-hover:top-10 overflow-hidden hover:overflow-auto  z-[1000] ">
                <div className=" group-hover:block  bg-white   shadow-2xl notification-container-mob  border border-[#DDD] overflow-hidden  min-w-full rounded-lg w-[410px] transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                  <nav
                    className="isolate flex divide-x divide-gray-200 rounded-lg shadow"
                    aria-label="Tabs"
                  >
                    <button
                      className="text-gray-900 rounded-l-lg group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10"
                      onClick={() => setNotificationTab('SYSTEM')}
                    >
                      <div className="flex justify-center gap-1">
                        <span>Untuk kamu </span>
                        {data?.notifikasi?.filter(
                          (e: any) => e?.type === 'SYSTEM' && !e?.isRead
                        )?.length! > 0 && (
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                          </span>
                        )}
                      </div>

                      <span
                        aria-hidden="true"
                        className={` ${
                          notificationTab == 'SYSTEM' && 'bg-indigo-500'
                        }  absolute inset-x-0 bottom-0 h-0.5`}
                      ></span>
                    </button>
                    <button
                      className="text-gray-900 rounded-r-lg group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10"
                      onClick={() => setNotificationTab('USER')}
                    >
                      <div className="flex justify-center gap-1">
                        <span>Terbaru & Update </span>
                        {data?.notifikasi
                          ?.filter((e: any) => e?.type === 'USER')
                          .filter((e: any) => !e?.isRead).length! > 0 && (
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                          </span>
                        )}
                      </div>
                      <span
                        aria-hidden="true"
                        className={` ${
                          notificationTab == 'USER' && 'bg-indigo-500'
                        }  absolute inset-x-0 bottom-0 h-0.5`}
                      ></span>
                    </button>
                  </nav>
                  <ul className="divide-y max-h-[350px] overflow-auto ">
                    {data?.notifikasi
                      ?.filter((e: any) => e?.type === notificationTab)
                      .map((e: any) => (
                        <li className="">
                          <button
                            onClick={() => {
                              readData(e?.id, e.url || e?.notification?.url);
                            }}
                            className={`py-4 px-4 flex items-center w-full hover:bg-gray-50 text-black text-sm cursor-pointer text-left ${
                              !e?.isRead ? 'bg-gray-100' : ''
                            }`}
                          >
                            {e?.notification?.icon ? (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: e?.notification?.icon,
                                }}
                              />
                            ) : (
                              generateIcon(e.status)
                            )}

                            <div className="ml-6 w-full">
                              <h3 className="text-sm text-[#333] font-semibold">
                                {e.title || e?.notification?.title}
                              </h3>
                              <p className="text-sm text-gray-700 mt-2">
                                {e.keterangan || e?.notification?.keterangan}
                              </p>
                              <p className="text-xs text-blue-500 leading-3 mt-2 w-full text-right">
                                {moment?.(
                                  e.createdAt || e?.notification?.createdAt
                                )?.fromNow()}
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}

                    {data?.notifikasi?.filter(
                      (e: any) => e?.type === notificationTab
                    ).length === 0 && (
                      <p className="text-center py-10 text-gray-600 italic">
                        Kamu telah membaca semua notifikasi
                      </p>
                    )}
                  </ul>
                  <p
                    onClick={handleReadAll}
                    className="text-sm p-3 text-center border-t border-gray-[#DDD] text-blue-500 cursor-pointer bg-white "
                  >
                    Tandai semua sudah dibaca
                  </p>
                </div>
              </div>
            </div>
          )}
          <img
            src={imageLink(account?.gambar || '')}
            alt=""
            className="h-[40px] w-[40px] rounded-full object-cover cursor-pointer"
            onClick={toggleDropdownProfileMobile}
          />
          <div
            className="flex flex-col text-right    "
            onClick={toggleDropdownProfileMobile}
          >
            <h3 className="text-indigo-950 font-semibold text-base">
              {account?.name}
            </h3>
          </div>
          {showDropdownProfileMobile && (
            <div className="profile-dropdown absolute right-0 mt-2 top-12 bg-white border rounded-md shadow-md py-2 w-36 z-[99]">
              <button
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                onClick={() => {
                  navigate('/profile');
                  toggleDropdownProfileMobile();
                }}
              >
                Profile
              </button>
              <button
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row justify-start">
        {showMenu && (
          <SideMenu
            classNames="md:hidden"
            menuOpened={menuOpened}
            setMenuOpened={setMenuOpened}
          />
        )}
        <SideMenu
          classNames="hidden md:flex"
          menuOpened={menuOpened}
          setMenuOpened={setMenuOpened}
        />

        <div
          className={`flex-auto w-screen ${showMenu && 'hidden'}`}
          style={{
            width: 'calc(100% - 20%)',
          }}
        >
          <div className="w-full navbar bg-white md:py-4 md:px-7">
            <div className="flex flex-row justify-between">
              <div className=""></div>
              <div
                className="user flex-row items-center gap-x-3 hidden md:flex relative"
                ref={dropdownProfile}
              >
                {account?.role === 'USER' && (
                  <div className="relative font-[sans-serif] w-max mx-auto group group-hover:opacity-100 ">
                    <button
                      type="button"
                      className="w-10 h-10  border border-primary flex items-center justify-center group rounded-full text-sm font-semibold bg-white group-hover:bg-indigo-800 text-indigo-800 group-hover:text-white"
                    >
                      {data?.notifikasi?.filter((e: any) => !e?.isRead)
                        .length ? (
                        <div className="absolute inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-primary group-hover:bg-white group-hover:text-primary group-hover:border group-hover:border-primary rounded-full -top-1 -end-0">
                          {
                            data.notifikasi.filter((e: any) => !e?.isRead)
                              .length
                          }
                        </div>
                      ) : null}

                      <IconBell className="animate-swing" size={23} />
                    </button>

                    <div className="absolute pt-4 -right-20 top-[-999px]  group-hover:top-10 overflow-hidden hover:overflow-auto  z-[1000] ">
                      <div className=" group-hover:block  bg-white   shadow-2xl notification-container  border border-[#DDD] overflow-hidden  min-w-full rounded-lg w-[410px] transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                        <nav
                          className="isolate flex divide-x divide-gray-200 rounded-lg shadow"
                          aria-label="Tabs"
                        >
                          <button
                            className="text-gray-900 rounded-l-lg group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10"
                            onClick={() => setNotificationTab('SYSTEM')}
                          >
                            <div className="flex justify-center gap-1">
                              <span>Untuk kamu </span>
                              {data?.notifikasi?.filter(
                                (e: any) => e?.type === 'SYSTEM' && !e?.isRead
                              )?.length! > 0 && (
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                </span>
                              )}
                            </div>

                            <span
                              aria-hidden="true"
                              className={` ${
                                notificationTab == 'SYSTEM' && 'bg-indigo-500'
                              }  absolute inset-x-0 bottom-0 h-0.5`}
                            ></span>
                          </button>
                          <button
                            className="text-gray-900 rounded-r-lg group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10"
                            onClick={() => setNotificationTab('USER')}
                          >
                            <div className="flex justify-center gap-1">
                              <span>Terbaru & Update </span>
                              {data?.notifikasi
                                ?.filter((e: any) => e?.type === 'USER')
                                .filter((e: any) => !e?.isRead).length! > 0 && (
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                </span>
                              )}
                            </div>
                            <span
                              aria-hidden="true"
                              className={` ${
                                notificationTab == 'USER' && 'bg-indigo-500'
                              }  absolute inset-x-0 bottom-0 h-0.5`}
                            ></span>
                          </button>
                        </nav>
                        <ul className="divide-y max-h-[350px] overflow-auto ">
                          {data?.notifikasi
                            ?.filter((e: any) => e?.type === notificationTab)
                            .map((e: any) => (
                              <li className="">
                                <button
                                  onClick={() => {
                                    readData(
                                      e?.id,
                                      e.url || e?.notification?.url
                                    );
                                  }}
                                  className={`py-4 px-4 flex items-center w-full hover:bg-gray-50 text-black text-sm cursor-pointer text-left ${
                                    !e?.isRead ? 'bg-gray-100' : ''
                                  }`}
                                >
                                  {e?.notification?.icon ? (
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: e?.notification?.icon,
                                      }}
                                    />
                                  ) : (
                                    generateIcon(e.status)
                                  )}

                                  <div className="ml-6 w-full">
                                    <h3 className="text-sm text-[#333] font-semibold">
                                      {e.title || e?.notification?.title}
                                    </h3>
                                    <p className="text-sm text-gray-700 mt-2">
                                      {e.keterangan ||
                                        e?.notification?.keterangan}
                                    </p>
                                    <p className="text-xs text-blue-500 leading-3 mt-2 w-full text-right">
                                      {moment?.(
                                        e.createdAt ||
                                          e?.notification?.createdAt
                                      )?.fromNow()}
                                    </p>
                                  </div>
                                </button>
                              </li>
                            ))}

                          {data?.notifikasi?.filter(
                            (e: any) => e?.type === notificationTab
                          ).length === 0 && (
                            <p className="text-center py-10 text-gray-600 italic">
                              Kamu telah membaca semua notifikasi
                            </p>
                          )}
                        </ul>
                        <p
                          onClick={handleReadAll}
                          className="text-sm p-3 text-center border-t border-gray-[#DDD] text-blue-500 cursor-pointer bg-white "
                        >
                          Tandai semua sudah dibaca
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <img
                  src={imageLink(account?.gambar || '')}
                  alt=""
                  className="h-[40px] w-[40px] rounded-full object-cover cursor-pointer"
                  onClick={toggleDropdownProfile}
                />
                <div className="flex flex-col text-right    ">
                  <h3 className="text-indigo-950 font-semibold text-base">
                    {account?.name}
                  </h3>
                </div>
                {showDropdownProfile && (
                  <div className="profile-dropdown absolute right-0 mt-2 top-12 bg-white border rounded-md shadow-md py-2 w-36 z-[99]">
                    <button
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                      onClick={() => {
                        navigate('/profile');
                        toggleDropdownProfile();
                      }}
                    >
                      Profile
                    </button>
                    <button
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {account?.role === 'USER' && <AlertTryout />}

          <div
            className={`min-h-[90vh]  bg-[#f6f8fd] border-t border-t-[#DDD] mb-10 ${
              location.pathname != '/' ? 'px-4  md:px-7 pt-4 md:pt-3' : ''
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </body>
  );
}
