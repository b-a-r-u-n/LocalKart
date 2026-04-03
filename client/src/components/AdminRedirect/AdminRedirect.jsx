import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const AdminRedirect = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn && user?.isAdmin) {
      // prevent infinite loop
      if (!location.pathname.startsWith("/admin")) {
        navigate("/admin", { replace: true });
      }
    }
  }, [isLoggedIn, user, location.pathname]);

  return null;
};

export default AdminRedirect;