import {
  IconBell,
  IconCircleCheck,
  IconCircleX,
  IconHourglassHigh,
  IconMenu2,
  IconMoon,
  IconSun,
} from '@tabler/icons-react';
import LOGO from '@/assets/Logo.png';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { checkRouteActive } from './utils';
import { useAuthStore } from './stores/auth-store';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment/min/moment-with-locales';
import 'moment/min/moment-with-locales';
import { imageLink } from './utils/image-link';
import useGetList from './hooks/use-get-list';
import SideMenu from './components/side-menu';
import AlertTryout from './components/alert-tryout';
import { useHomeStore } from '@/stores/home-stores';
import { getData, postData } from './utils/axios';

interface LayoutProps {
  children: React.ReactNode;
}

const generateIcon = (status: string) => {
  switch (status) {
    case 'PAYMENT_PENDING':
      return <IconHourglassHigh className="text-warning" size={30} />;
    case 'PAYMENT_SUCCESS':
      return <IconCircleCheck className="text-success" size={30} />;
    case 'PAYMENT_FAILED':
      return <IconCircleX className="text-red-500" size={30} />;
    default:
      return null;
  }
};

export default function App({ children }: LayoutProps) {
  moment.locale('id');
  const { setMyClass } = useAuthStore();
  const { id } = useParams();
  const data = useHomeStore((state) => state);
  const [showMenu, setShowMenu] = useState<boolean>(() => {
    // Set initial showMenu state based on screen size (md breakpoint = 768px)
    return window.innerWidth >= 768;
  });
  const { logout } = useAuthStore();
  const dropdownProfile = useRef<HTMLDivElement | null>(null);
  const dropdownProfileMobile = useRef<HTMLDivElement | null>(null);
  const account = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  // Dark mode state
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('theme') || 'light';
  });
  // Toggle theme and persist in localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  // Apply theme on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  // Update showMenu on window resize
  useEffect(() => {
    const handleResize = () => {
      setShowMenu(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const toggleDropdown = () => {
    setShowMenu((prev) => !prev);
  };
  const [showDropdownProfile, setShowDropdownProfile] = useState(false);
  const [showDropdownProfileMobile, setShowDropdownProfileMobile] = useState(false);
  const toggleDropdownProfileMobile = () => {
    setShowDropdownProfileMobile(!showDropdownProfileMobile);
  };
  const toggleDropdownProfile = () => {
    setShowDropdownProfile(!showDropdownProfile);
  };
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (dropdownProfile.current && !dropdownProfile.current.contains(target)) {
      setShowDropdownProfile(false);
    }
  };
  const handleClickOutsideMobile = (event: MouseEvent) => {
    
  	if (!showDropdownProfileMobile) return;
    const target = event.target as HTMLElement;
    if (dropdownProfileMobile.current && !dropdownProfileMobile.current.contains(target)) {
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
  }, [location.pathname, id]);
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
  // Handle profile toggle based on screen size
  const handleProfileClick = () => {
    if (window.innerWidth < 768) {
      toggleDropdownProfileMobile();
    } else {
      toggleDropdownProfile();
    }
  };
  return (
    <div className="font-['Poppins'] bg-[#f5f5f5] dark:bg-gray-800 scroll-smooth min-h-screen">
      <div className="flex flex-row justify-start">
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 w-full h-full bg-white dark:bg-gray-900 z-50 md:static md:w-[20%] md:flex"
            >
              <SideMenu
                classNames="flex h-full md:h-auto"
                menuOpened={menuOpened}
                setMenuOpened={setMenuOpened}
                toggleMenu={toggleDropdown}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div
          className={`flex-auto w-screen transition-all duration-300 ${
            showMenu ? 'md:block' : 'block'
          }`}
          style={{
            width: showMenu ? 'calc(100% - 20%)' : '100%',
          }}
        >
          <div className="w-full navbar bg-white dark:bg-gray-900 md:py-4 md:px-7 relative">
            <div className="flex flex-row justify-between">
              <div className="flex items-center p-2 space-x-2">
                <button
                  id="btn-dropdown"
                  onClick={toggleDropdown}
                  className="flex flex-row items-center p-2 border border-gray-300 dark:border-gray-600 rounded-full"
                >
                  <IconMenu2 className="text-gray-700 dark:text-gray-200" />
                </button>
                <button
                  onClick={toggleTheme}
                  className="flex flex-row items-center p-2 border border-gray-300 dark:border-gray-600 rounded-full"
                  title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                  {theme === 'light' ? (
                    <IconMoon className="text-gray-700 dark:text-gray-200" size={20} />
                  ) : (
                    <IconSun className="text-gray-700 dark:text-gray-200" size={20} />
                  )}
                </button>
              </div>
              <div
                className="flex items-center gap-3 p-3 relative"
                ref={dropdownProfile}
              >
                {account?.role === 'USER' && (
                  <div className="relative font-[sans-serif] w-max mx-auto group group-hover:opacity-100 hidden md:block">
                    <button
                      type="button"
                      className="w-10 h-10 border border-[#ffb22c] flex items-center justify-center group rounded-full text-sm font-semibold bg-white dark:bg-gray-800 group-hover:bg-[#ffb22c] dark:group-hover:bg-[#ffb22c] text-[#ffb22c] dark:text-[#ffb22c] group-hover:text-white"
                    >
                      {data?.notifikasi?.filter((e: any) => !e?.isRead).length ? (
                        <div className="absolute inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-[#ffb22c] dark:bg-[#ffb22c] group-hover:bg-white group-hover:text-[#ffb22c] group-hover:border group-hover:border-[#ffb22c] rounded-full -top-1 -end-0">
                          {data.notifikasi.filter((e: any) => !e?.isRead).length}
                        </div>
                      ) : null}
                      <IconBell className="animate-swing" size={23} />
                    </button>
                    <div className="absolute pt-4 -right-20 top-[-999px] group-hover:top-10 overflow-hidden hover:overflow-auto z-[1000]">
                      <div className="group-hover:block bg-white dark:bg-gray-800 shadow-2xl notification-container border border-[#DDD] dark:border-gray-600 overflow-hidden min-w-full rounded-lg w-full max-w-sm md:w-[410px] transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                        <nav
                          className="isolate flex flex-col sm:flex-row divide-y sm:divide-x sm:divide-y-0 divide-gray-200 dark:divide-gray-600 rounded-lg shadow"
                          aria-label="Tabs"
                        >
                          <button
                            className="text-gray-900 dark:text-gray-200 rounded-l-lg group relative min-w-0 flex-1 overflow-hidden bg-white dark:bg-gray-800 py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-10"
                            onClick={() => setNotificationTab('SYSTEM')}
                          >
                            <div className="flex justify-center gap-1">
                              <span>Untuk kamu</span>
                              {data?.notifikasi?.filter((e: any) => e?.type === 'SYSTEM' && !e?.isRead).length! > 0 && (
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                </span>
                              )}
                            </div>
                            <span
                              aria-hidden="true"
                              className={`${notificationTab === 'SYSTEM' && 'bg-indigo-500'} absolute inset-x-0 bottom-0 h-0.5`}
                            ></span>
                          </button>
                          <button
                            className="text-gray-900 dark:text-gray-200 rounded-r-lg group relative min-w-0 flex-1 overflow-hidden bg-white dark:bg-gray-800 py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-10"
                            onClick={() => setNotificationTab('USER')}
                          >
                            <div className="flex justify-center gap-1">
                              <span>Terbaru & Update</span>
                              {data?.notifikasi?.filter((e: any) => e?.type === 'USER' && !e?.isRead).length! > 0 && (
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                </span>
                              )}
                            </div>
                            <span
                              aria-hidden="true"
                              className={`${notificationTab === 'USER' && 'bg-indigo-500'} absolute inset-x-0 bottom-0 h-0.5`}
                            ></span>
                          </button>
                        </nav>
                        <ul className="divide-y max-h-[350px] overflow-auto">
                          {data?.notifikasi
                            ?.filter((e: any) => e?.type === notificationTab)
                            .map((e: any) => (
                              <li key={e.id}>
                                <button
                                  onClick={() => readData(e?.id, e.url || e?.notification?.url)}
                                  className={`py-4 px-4 flex items-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 text-black dark:text-gray-200 text-sm cursor-pointer text-left ${!e?.isRead ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                >
                                  {e?.notification?.icon ? (
                                    <span dangerouslySetInnerHTML={{ __html: e?.notification?.icon }} />
                                  ) : (
                                    generateIcon(e.status)
                                  )}
                                  <div className="ml-6 w-full">
                                    <h3 className="text-sm text-[#333] dark:text-gray-200 font-semibold">
                                      {e.title || e?.notification?.title}
                                    </h3>
                                    <p className="text-sm text-gray-700 dark:text-gray-400 mt-2">
                                      {e.keterangan || e?.notification?.keterangan}
                                    </p>
                                    <p className="text-xs text-blue-500 dark:text-blue-300 leading-3 mt-2 w-full text-right">
                                      {moment(e.createdAt || e?.notification?.createdAt).fromNow()}
                                    </p>
                                  </div>
                                </button>
                              </li>
                            ))}
                          {data?.notifikasi?.filter((e: any) => e?.type === notificationTab).length === 0 && (
                            <p className="text-center py-10 text-gray-600 dark:text-gray-400 italic">
                              Kamu telah membaca semua notifikasi
                            </p>
                          )}
                        </ul>
                        <p
                          onClick={handleReadAll}
                          className="text-sm p-3 text-center border-t border-gray-[#DDD] dark:border-gray-600 text-blue-500 dark:text-blue-300 cursor-pointer bg-white dark:bg-gray-800"
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
                  className="h-[44px] w-[44px] md:h-[40px] md:w-[40px] rounded-full object-cover cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();   
                    handleProfileClick();
                  }}
                />
                <div className="flex flex-col text-right hidden md:block">
                  <h3 className="text-indigo-950 dark:text-indigo-200 font-semibold text-base">
                    {account?.name}
                  </h3>
                </div>
                {/* Desktop Profile Dropdown */}
                {showDropdownProfile && (
                  <div
                    className="profile-dropdown absolute right-0 mt-2 top-12 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md shadow-md py-2 w-36 z-[99] hidden md:block"
                  >
                    <button
                      className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-left"
                      onClick={() => {
                        navigate('/profile');
                        toggleDropdownProfile();
                      }}
                    >
                      Profile
                    </button>
                    <button
                      className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-left"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
                {/* Mobile Profile Dropdown */}
                {showDropdownProfileMobile && (
                  <div
                    className="md:hidden fixed inset-x-0 mt-2 top-[68px] bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md shadow-md py-2 z-[99] px-4"
                    ref={dropdownProfileMobile}
                  >
                    <button
                      className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-left text-sm"
                      onClick={() => {
                        navigate('/profile');
                        toggleDropdownProfileMobile();
                      }}
                    >
                      Profile
                    </button>
                    <button
                      className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-left text-sm"
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
            className={`min-h-[90vh] bg-[#f6f8fd] dark:bg-gray-700 border-t border-t-[#DDD] dark:border-t-gray-600 mb-10 ${
              location.pathname !== '/' ? 'px-4 md:px-7 pt-4 md:pt-3' : ''
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
    </div>
  );
}