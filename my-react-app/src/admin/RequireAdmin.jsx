import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth";
import { seedDishesIfEmpty } from "./adminDishStore";
import { seedOrdersIfEmpty } from "./adminOrderStore";

// Guard for the whole /admin group — one gate, every admin page protected.
export default function RequireAdmin() {
  const { admin } = useAdminAuth();
  const location = useLocation();

  // Features 15–16 — make sure the persisted admin data exists (first run only)
  useEffect(() => {
    if (!admin) return;
    let alive = true;
    seedDishesIfEmpty().then((dishes) => {
      if (alive) seedOrdersIfEmpty(dishes);
    });
    return () => { alive = false; };
  }, [admin]);

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }
  return <Outlet />;
}