import Button from "@/components/button";
import Form from "@/components/form";
import Input from "@/components/input";
import { useAuthStore } from "@/stores/auth-store";
import { postData } from "@/utils/axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LOGO from "@/assets/Logo.png";
import { useGoogleLogin } from '@react-oauth/google';

export default function Example() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const toastId = toast.loading("Memproses...");
    try {
      const response = await postData("auth/login", data);
      console.log(response);
      // Jika sukses
      if (response?.status === 200 || response?.status === 201) {
        toast.success(
          response?.msg || response?.data?.msg || "Proses Selesai",
          { id: toastId }
        );
        login(response.data);
        const params = new URLSearchParams(location.search);
        let redirect = params.get("redirect");

        if (!redirect) {
          redirect = location.search.substring(1);
        }

        setTimeout(() => {
          if (response.data.data.user.role === "ADMIN") {
             if (redirect && redirect !== "/") {
                navigate(redirect);
                return;
             }
             return navigate("/dashboard");
          }

          if (redirect) {
             navigate(redirect);
             return;
          }

          return navigate("/");
        }, 1000);
        return;
      }

      // Jika status bukan 200/201, tampilkan msg dari response jika bukan 500
      const status = response?.status;
      const message = response?.message || "Terjadi kesalahan.";

      if (status !== 500) {
        // Non-500, return/use msg
        toast.error(message, { id: toastId });
        return;
      } else {
        // 500, pesan generik
        toast.error("Cek ulang data anda, jika masih error, hubungi Admin", {
          id: toastId,
        });
        return;
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const backendMsg = err?.response?.message || err?.response?.data?.msg;
      let message = "";
      if (status === 500) {
        message = "Terjadi kesalahan, silakan coba lagi.";
      } else {
        // Non-500 di catch, gunakan msg dari backend
        message = backendMsg || err?.message || "Terjadi kesalahan.";
      }
      toast.error(message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // Google Login Handler
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      const toastId = toast.loading("Masuk dengan Google...");
      try {
        // Send access token to backend for verification
        const response = await postData("auth/google-login", {
          access_token: tokenResponse.access_token
        });
        
        if (response?.status === 200 || response?.status === 201) {
          toast.success(
            response?.msg || response?.data?.msg || "Login berhasil!",
            { id: toastId }
          );
          login(response.data);
          
          const params = new URLSearchParams(location.search);
          let redirect = params.get("redirect");
          
          if (!redirect) {
            redirect = location.search.substring(1);
          }
          
          setTimeout(() => {
            if (response.data.data.user.role === "ADMIN") {
              if (redirect && redirect !== "/") {
                navigate(redirect);
                return;
              }
              return navigate("/dashboard");
            }
            
            if (redirect) {
              navigate(redirect);
              return;
            }
            
            return navigate("/");
          }, 1000);
          return;
        }
        
        // Handle non-success status
        const status = response?.status;
        const message = response?.message || "Terjadi kesalahan saat login dengan Google.";
        
        if (status !== 500) {
          toast.error(message, { id: toastId });
        } else {
          toast.error("Gagal login dengan Google, silakan coba lagi.", { id: toastId });
        }
      } catch (err: any) {
        const status = err?.response?.status;
        const backendMsg = err?.response?.message || err?.response?.data?.msg;
        let message = "";
        
        if (status === 500) {
          message = "Terjadi kesalahan, silakan coba lagi.";
        } else {
          message = backendMsg || err?.message || "Gagal login dengan Google.";
        }
        toast.error(message, { id: toastId });
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Login dengan Google dibatalkan atau gagal.");
      setIsGoogleLoading(false);
    }
  });


  return (
    <>
      <div
        style={{ backgroundImage: `url('/img/bg.jpg')` }}
        className="min-h-[100vh] bg-no-repeat bg-cover bg-center pt-20"
      >
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto w-auto"
              style={{ height: "76px" }}
              src={LOGO}
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Masuk ke akun Anda
            </h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
              <Form onSubmit={onSubmit} className="space-y-6">
                <Input
                  title="Email address"
                  name="email"
                  type="email"
                  validation={{
                    required: "Email tidak boleh kosong",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Format email tidak sesuai",
                    },
                  }}
                />
                <Input
                  type="password"
                  name="password"
                  title="Password"
                  validation={{
                    required: "Password tidak boleh kosong",
                    minLength: {
                      value: 8,
                      message: "Password minimal 8 karakter",
                    },
                  }}
                />
                <Link
                  to="/auth/forgot-password"
                  className="!mt-2 text-sm text-right w-full block text-indigo-600 hover:text-indigo-500"
                >
                  Lupa password?
                </Link>
                <Button type="submit" isLoading={isLoading} className="!bg-[#F97316] !border-[#F97316]">
                  Login
                </Button>

                {/* Divider */}
                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">atau</span>
                  </div>
                </div>

                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  className="mt-6 w-full flex items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Login dengan Google
                </button>

                <div className="text-center mt-3">
                  <p className="mt-10 text-center text-sm text-gray-500">
                    <span
                      style={{
                        color: "#F97316",
                        padding: "0 4px",
                        borderRadius: "4px",
                      }}
                    >
                      Belum punya akun?{" "}
                      <Link
                        to={`/auth/register${location.search}`}
                        className="font-semibold leading-6 hover:text-gray-300"
                        style={{
                          textDecoration: "underline",
                          color: "#F97316",
                        }}
                      >
                        Daftar sekarang
                      </Link>
                    </span>
                  </p>
                </div>
              </Form>
            </div>
          </div>
        </div>
        {/* WhatsApp floating button */}
        <a
          href="https://api.whatsapp.com/send/?phone=628567854441&text=Halo+admin%2C+saya+butuh+bantuan+di+Fungsional&type=phone_number&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50"
        >
          <img
            src="/img/whatsapp.webp"
            alt="WhatsApp Admin"
            className="w-14 h-14 drop-shadow-lg hover:scale-110 transition-transform"
          />
        </a>
      </div>
    </>
  );
}
