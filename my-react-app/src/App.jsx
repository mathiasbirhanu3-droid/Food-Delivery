import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./Layout";
import ThemeProvider from "./theme/ThemeContext";
import AuthProvider from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import Home from "./pages/Home";
import Menu from "./menu/Menu";
import Dish from "./menu/Dish";
import Cart from "./cart/Cart";
import Checkout from "./checkout/Checkout";
import OrderConfirmation from "./checkout/OrderConfirmation";
import Favorites from "./favorites/Favorites";
import Orders from "./orders/Orders";
import Login from "./auth/Login";
import NotFound from "./pages/NotFound";
// ---- Admin extension ----
import { AdminAuthProvider } from "./admin/useAdminAuth";
import RequireAdmin from "./admin/RequireAdmin";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import DishManager from "./admin/DishManager";
import OrderManager from "./admin/OrderManager";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* ---------- Customer routes ---------- */}
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="menu" element={<Menu />} />
                <Route path="menu/:id" element={<Dish />} />
                <Route path="cart" element={<Cart />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="orders" element={<Orders />} />
                <Route path="login" element={<Login />} />
                <Route path="checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
                <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* ---------- Admin: nested, guarded route group ---------- */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<RequireAdmin />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="menu" element={<DishManager />} />
                  <Route path="orders" element={<OrderManager />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}