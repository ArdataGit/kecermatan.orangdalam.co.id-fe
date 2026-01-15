import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserProps = {
  email: string;
  role: string;
  name: string;
  gambar: string | undefined;
  id: number;
};

type LoginDataProps = {
  refreshToken: string;
  token: string;
  tokenExpiresIn: string;
  user: UserProps;
};

interface AuthProps {
  login: (data: LoginDataProps) => void;
  logout: () => void;
  user?: UserProps;
  token?: string;
  myClass?: any;
  setMyClass: (myClass: any) => void;
  isHasShow: boolean; // Add isHasShow to the store
  setIsHasShow: (value: boolean) => void; // Add setter for isHasShow
}

export const useAuthStore = create<AuthProps>()(
  persist(
    (set) => ({
      isHasShow: false, // Initialize isHasShow
      login: ({ data }: any) => {
        set({
          user: data.user,
          token: data.token,
          isHasShow: false, // Reset isHasShow on login
        });
      },
      logout: () => {
        set({
          user: undefined,
          token: undefined,
          myClass: undefined,
          isHasShow: false, // Reset isHasShow on logout
        });
        const deleteLocalStorage = () => {
          const keys = Object.keys(localStorage);
          for (const key of keys) {
            if (key !== "authentication") {
              localStorage.removeItem(key); // Clear other keys, preserve Zustand state
            }
          }
        };
        deleteLocalStorage();
      },
      setMyClass: (myClass: any) => {
        set({ myClass });
      },
      setIsHasShow: (value: boolean) => {
        set({ isHasShow: value });
      },
    }),
    { name: "authentication" }
  )
);

export const getAllState = () => useAuthStore.getState();
