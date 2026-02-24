import CKeditor from "@/components/ckeditor";
import { useHomeStore } from "@/stores/home-stores";
import { useAuthStore } from "@/stores/auth-store";
import { imageLink } from "@/utils/image-link";
import { IconBook, IconBrandWhatsapp, IconExternalLink, IconUsers } from "@tabler/icons-react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getData, postData } from "@/utils/axios";
import { MessagePlugin } from "tdesign-react";
import { useEffect, useState } from "react";
import Form from "@/components/form";
import Input from "@/components/input";
import Button from "@/components/button";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const data = useHomeStore((state) => state);
  const { user, token, isHasShow, setIsHasShow } = useAuthStore();
  const [notification, setNotification] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

   useEffect(() => {
    const load = async () => {
      try {
        // Fetch notification
        const notificationRes = await getData("dashboard-notification");
        const list = notificationRes?.list || [];
        const activeNotification = list.find((item) => item.status === "active") || null;
        setNotification(activeNotification);

        // Debug log
        console.log("Auth State:", { isLoggedIn, user, isHasShow });

        // Check feedback only if logged in, user exists, and modal hasn't been shown
        if (isLoggedIn && user?.id && !isHasShow) {
          const [settingsRes, feedbackRes] = await Promise.all([
            getData("/user/feedback-settings"),
            getData(`/user/feedbacksUser?userId=${user.id}`),
          ]);

          // Debug respons mentah
          console.log("Raw feedback settings response:", settingsRes);
          console.log("Raw feedback user response:", feedbackRes);

          const isFeedbackActive = settingsRes?.[0]?.isActive || false;
          const hasFeedback = feedbackRes?.hasFeedback || false;

          // Debug hasil parsing
          console.log("Parsed values:", {
            isFeedbackActive,
            hasFeedback,
            settingsRes,
            feedbackRes,
          });

          if (isFeedbackActive && !hasFeedback) {
            console.log("➡️ Kondisi terpenuhi: Feedback modal akan ditampilkan");
            setFeedbackModal({
              title: "Berikan Feedback Anda",
              message: "Kami ingin mendengar pendapat Anda untuk meningkatkan layanan kami!",
            });
            setIsHasShow(true);
          } else {
            console.log("❌ Kondisi tidak terpenuhi, modal tidak ditampilkan", {
              isFeedbackActive,
              hasFeedback,
            });
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
        MessagePlugin.error("Gagal ambil data");
      }
    };

    load();
  }, [isLoggedIn, user?.id, isHasShow, setIsHasShow]);


  // Handle feedback form submission
  const handleFeedbackSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        userId: user.id,
        pekerjaan: formData.pekerjaan || "",
        rating: Number(formData.rating),
        saran: formData.saran || "",
      };
      await postData("/user/feedbacks", payload);
      MessagePlugin.success("Feedback berhasil disimpan");
      setFeedbackModal(null); // Close modal on success
    } catch (err) {
      console.error("Error submitting feedback:", err);
      MessagePlugin.error(err.message || "Gagal menyimpan feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render feedback modal with form
  const renderFeedbackModal = () => {
  if (!feedbackModal) return null;

  const createdAt = user?.createdAt ? new Date(user.createdAt) : null;
  const now = new Date();
  const daysUsed = createdAt ? Math.floor((now - createdAt) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">{feedbackModal.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{feedbackModal.message}</p>

        {/* Tambahan: Lama penggunaan */}
        <p className="text-sm text-gray-500 mb-4">
          Kamu sudah menggunakan website ini selama <b>{daysUsed}</b> hari
        </p>

        <Form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <Input
            title="Pekerjaan"
            name="pekerjaan"
            type="text"
            placeholder="Masukkan pekerjaan (opsional)"
            validation={{ required: false }}
          />
          <Input
            title="Rating (1-5)"
            name="rating"
            type="number"
            placeholder="Masukkan rating (1-5)"
            validation={{
              required: "Rating wajib diisi",
              min: { value: 1, message: "Rating minimal 1" },
              max: { value: 5, message: "Rating maksimal 5" },
            }}
          />
          <Input
            title="Saran"
            name="saran"
            type="textarea"
            placeholder="Masukkan saran (opsional)"
            validation={{ required: false }}
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              theme="default"
              onClick={() => setFeedbackModal(null)}
              disabled={isSubmitting}
            >
              Tutup
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Kirim Feedback
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};


  return (
    <div className="w-[100%] overflow-hidden">
      {renderFeedbackModal()}
      {notification && (
        <div className="mx-5 my-4 p-3 rounded-lg bg-[#ffb22c]/10 border border-[#ffb22c]/30">
          <h2 className="text-lg font-semibold text-indigo-950 mb-1">{notification.title}</h2>
          <p className="text-sm text-gray-600 mb-2">{notification.description}</p>
          {notification.link && (
            <a
              href={notification.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#ffb22c] underline"
            >
              Lihat selengkapnya
            </a>
          )}
        </div>
      )}
      <Carousel
        autoPlay
        infiniteLoop
        swipeable
        emulateTouch
        interval={2000}
        showArrows={false}
        showThumbs={false}
        className="p-5 rounded-sm"
      >
        {data?.section
          ?.filter((e) => e.tipe === "BANNER")
          ?.map((e) => (
            <div
              className="cursor-grab"
              onClick={() => {
                if (e.url) window.open(e.url, "_blank");
              }}
              key={e.id}
            >
              <img className="rounded-md" src={imageLink(e.gambar)} alt={e.title || "Banner"} />
            </div>
          ))}
      </Carousel>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-7 gap-y-7 mx-5">
  {/* Paket Saya */}
        <div
          className="item-stat bg-white rounded-2xl p-5 cursor-pointer hover:shadow-lg transition flex flex-col items-start gap-y-3 text-left"
          onClick={() => navigate("/my-class")}
        >
          <div className="bg-[#ffb22c] rounded-full w-fit p-3 flex-shrink-0">
            <IconBook className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl text-indigo-950 font-bold">{data?.paketSaya}</h3>
            <p className="text-sm text-gray-500 font-medium">Paket Saya</p>
          </div>
        </div>

        {/* Total Pengguna */}
        <div
          className="item-stat bg-white rounded-2xl p-5 hover:shadow-lg transition flex flex-col items-start gap-y-3 text-left"
        >
          <div className="bg-[#ffb22c] rounded-full w-fit p-3 flex-shrink-0">
            <IconUsers className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl text-indigo-950 font-bold">{data?.user}</h3>
            <p className="text-sm text-gray-500 font-medium">Total Pengguna</p>
          </div>
        </div>

        {/* Kembali ke Aplikasi Utama */}
        <div
          className="item-stat bg-white rounded-2xl p-5 cursor-pointer hover:shadow-lg transition flex flex-col items-start gap-y-3 text-left"
          onClick={() => window.open("https://orangdalam.co.id", "_blank")}
        >
          <div className="bg-[#ffb22c] rounded-full w-fit p-3 flex-shrink-0">
            <IconExternalLink className="text-white" />
          </div>
          <div>
            {/* <h3 className="text-lg text-indigo-950 font-bold leading-tight">Kembali ke aplikasi orangdalam.co.id</h3> */}
            <p className="text-sm text-gray-500 font-medium">Kembali ke aplikasi orangdalam.co.id</p>
          </div>
        </div>

        {/* Hubungi Whatsapp Admin */}
        <div
          className="item-stat bg-white rounded-2xl p-5 cursor-pointer hover:shadow-lg transition flex flex-col items-start gap-y-3 text-left"
          onClick={() => window.open("https://api.whatsapp.com/send/?phone=6285158891028&text=Halo+admin%2C+saya+butuh+bantuan+di+Kecermatan&type=phone_number&app_absent=0", "_blank")}
        >
          <div className="bg-[#ffb22c] rounded-full w-fit p-3 flex-shrink-0">
            <IconBrandWhatsapp className="text-white" />
          </div>
          <div>
            {/* <h3 className="text-lg text-indigo-950 font-bold leading-tight">Hubungi Whatsapp Admin</h3> */}
            <p className="text-sm text-gray-500 font-medium">Hubungi Whatsapp Admin</p>
          </div>
        </div>
      </div>
      <div className="grid rounded-xl md:grid-cols-2 gap-2">
        {data?.section
          ?.filter((e) => e.tipe === "CUSTOM")
          ?.map((e) => (
            <div className="mx-5 bg-white mt-5 px-10 rounded-xl" key={e.id}>
              <h3 className="pt-10 text-xl text-center font-medium mb-5">{e.title}</h3>
              <CKeditor
                content={e.keterangan}
                readOnly
                className="mb-5 inline-block w-full"
              />
            </div>
          ))}
      </div>
    </div>
  );
}