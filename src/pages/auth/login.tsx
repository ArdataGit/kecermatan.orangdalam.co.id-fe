import Button from "@/components/button";
import Form from "@/components/form";
import Input from "@/components/input";
import { useAuthStore } from "@/stores/auth-store";
import { postData } from "@/utils/axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LOGO from "@/assets/Logo.png";

export default function Example() {
  const [isLoading, setIsLoading] = useState(false);
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
                <Button type="submit" isLoading={isLoading}>
                  Login
                </Button>
                <div className="text-center mt-3">
                  <p className="mt-10 text-center text-sm text-gray-500">
                    <span
                      style={{
                        color: "rgb(73 193 191 / 1)",
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
                          color: "rgb(73 193 191 / 1)",
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
