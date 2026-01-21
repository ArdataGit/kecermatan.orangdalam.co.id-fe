import NotFound from "@/pages/not-found";

import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import App from "@/App";
import { useEffect } from "react";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import { useAuthStore } from "@/stores/auth-store";
import { adminRoutes } from "@/const";
import { userRoutes } from "./route-user";
import ForgotPassword from "@/pages/auth/forgot-password";
import ResetPassword from "@/pages/auth/reset-password";
import SoalKecermatanExam from "@/pages/user/soal-kecermatan-detail";

interface LayoutProps {
  children: React.ReactNode;
}

const AdminRoutesLayouts: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state?.user?.role);

  useEffect(() => {
    if (!token || role !== "ADMIN") {
      localStorage.clear();
      navigate("/auth/login", { replace: true });
    }
  }, [location.pathname]);

  return <App>{children}</App>;
};
const UserRoutesLayouts: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state?.user?.role);

  useEffect(() => {
    // tunggu sampai token/role ada, atau dianggap belum login
    if (token === undefined && role === undefined) return;

    if (!token || role !== "USER") {
      const redirectTo = location.pathname + location.search;
      navigate(`/auth/login?${redirectTo}`, { replace: true });
    }
  }, [token, role, location.pathname, location.search, navigate]);
  return <App>{children}</App>;
};

const UserExamLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state?.user?.role);

  useEffect(() => {
    if (token === undefined && role === undefined) return;

    if (!token || role !== "USER") {
      const redirectTo = location.pathname + location.search;
      navigate(`/auth/login?${redirectTo}`, { replace: true });
    }
  }, [token, role, location.pathname, location.search, navigate]);
  // No App wrapper here
  return <div className="font-['Poppins'] bg-[#f5f5f5] min-h-screen">{children}</div>;
};

const UnAuthenticationLayouts: React.FC<LayoutProps> = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const role = useAuthStore((state) => state?.user?.role);

  useEffect(() => {
    if (token) {
      navigate(role === "USER" ? "/" : "/Dashboard", { replace: true });
    }
  }, [location.pathname]);

  return <div>{children}</div>;
};

export default function RoutesList() {
  return (
    <Routes>
      {/* Admin routes */}
      <Route
        element={
          <AdminRoutesLayouts>
            <Outlet />
          </AdminRoutesLayouts>
        }
      >
        {adminRoutes}
      </Route>

      {/* User protected routes */}
      <Route
        element={
          <UserRoutesLayouts>
            <Outlet />
          </UserRoutesLayouts>
        }
      >
        {userRoutes} {/* Hanya route yang perlu login sebagai USER */}
      </Route>

       {/* User Exam Layout (No Sidebar/Navbar) */}
      <Route
        element={
          <UserExamLayout>
            <Outlet />
          </UserExamLayout>
        }
      >
        <Route path="/soal-kecermatan/:id" element={<SoalKecermatanExam />} />
      </Route>

      {/* Auth pages (login, register, forgot) - tidak di UserRoutesLayouts */}


      {/* Auth pages (login, register, forgot) - tidak di UserRoutesLayouts */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register/:affCode?" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password/:jwt" element={<ResetPassword />} />

      {/* Not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
