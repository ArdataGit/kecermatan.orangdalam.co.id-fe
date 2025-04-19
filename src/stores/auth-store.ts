import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserProps = {
  email: string;
  role: string;
  name: string;
  gambar: string | undefined;
};

type LoginDataProps = {
  refreshToken: string;
  token: string;
  tokenExpiresIn: string;
  user: UserProps;
};

export const loginStore = {
  isHasShow: false,
};

interface AuthProps {
  login: (data: LoginDataProps) => void;
  logout: () => void;
  user?: UserProps;
  token?: string;
  myClass?: any;
  setMyClass: (myClass: any) => void;
}

export const useAuthStore = create<AuthProps>()(
  persist(
    (set) => ({
      login: ({ data }: any) => {
        set({
          user: data.user,
          token: data.token,
        });
      },
      logout: () => {
        set({
          user: undefined,
          token: undefined,
        });
        const deleteLocalStorage = () => {
          const keys = Object.keys(localStorage);
          for (const key of keys) {
            localStorage.removeItem(key);
          }
        };
        deleteLocalStorage();
      },
      setMyClass: (myClass: any) => {
        set({ myClass });
      },
      // setUsername: (newUserName) => {
      //   set({ username: newUserName });
      // },
      // setServiceRating: (serviceProps) => {
      //   set({ serviceRating: serviceProps });
      // },
      // setServiceReview: (reviewStatus) => {
      //   set({ serviceReview: reviewStatus });
      // },
    }),
    { name: 'authentication' }
  )
);

export const getAllState = () => useAuthStore.getState();
