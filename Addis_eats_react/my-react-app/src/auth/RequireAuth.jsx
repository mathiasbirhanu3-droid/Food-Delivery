import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Route guard: sends visitors to /login, then returns them where they were.
export default function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}