import NotFound from '@/pages/not-found';

import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import App from '@/App';
import { useEffect } from 'react';
import Login from '@/pages/auth/login';
import Register from '@/pages/auth/register';
import { useAuthStore } from '@/stores/auth-store';
import { adminRoutes } from '@/const';
import { userRoutes } from './route-user';
import ForgotPassword from '@/pages/auth/forgot-password';
import ResetPassword from '@/pages/auth/reset-password';

interface LayoutProps {
  children: React.ReactNode;
}

const AdminRoutesLayouts: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state?.user?.role);

  useEffect(() => {
    if (!token || role !== 'ADMIN') {
      localStorage.clear();
      navigate('/auth/login', { replace: true });
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
    if (!token || role !== 'USER') {
      localStorage.clear();
      navigate('/auth/login', { replace: true });
    }
  }, [location.pathname]);

  return <App>{children}</App>;
};

const UnAuthenticationLayouts: React.FC<LayoutProps> = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const role = useAuthStore((state) => state?.user?.role);

  useEffect(() => {
    if (token) {
      navigate(role === 'USER' ? '/' : '/Dashboard', { replace: true });
    }
  }, [location.pathname]);

  return <div>{children}</div>;
};

export default function RoutesList() {
  return (
    <Routes>
      <Route
        element={
          <AdminRoutesLayouts>
            <Outlet />
          </AdminRoutesLayouts>
        }
      >
        {adminRoutes}
      </Route>
      <Route
        element={
          <UserRoutesLayouts>
            <Outlet />
          </UserRoutesLayouts>
        }
      >
        {userRoutes}
      </Route>
      <Route
        element={
          <UnAuthenticationLayouts>
            <Outlet />
          </UnAuthenticationLayouts>
        }
      >
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password/:jwt" element={<ResetPassword />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
