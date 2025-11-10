import { ReactNode, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isInitialCheck = useRef(true);

  useEffect(() => {
    if (requireAuth) {
      const adminToken = localStorage.getItem('adminToken');
      const adminUser = localStorage.getItem('adminUser');

      if (!adminToken || !adminUser) {
        // Only show error message on initial load or direct access, not on navigation
        if (isInitialCheck.current) {
          toast.error('Access denied. Please log in as administrator.');
        }
        navigate('/admin/login', { replace: true });
        return;
      }

      // Optional: Verify token expiry
      try {
        const user = JSON.parse(adminUser);
        const loginTime = new Date(user.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);

        // Auto logout after 8 hours
        if (hoursSinceLogin > 8) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          toast.error('Session expired. Please log in again.');
          navigate('/admin/login', { replace: true });
          return;
        }
      } catch (error) {
        console.error('Error parsing admin user data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login', { replace: true });
        return;
      }
    }
    
    // Mark that initial check is complete
    isInitialCheck.current = false;
  }, [requireAuth, navigate, location.pathname]);

  return <>{children}</>;
};

export default ProtectedRoute;