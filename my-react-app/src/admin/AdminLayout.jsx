import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth";
import ThemeToggle from "../theme/ThemeToggle";
import Icon from "../ui/Icons";
import { Toaster, toast } from "../ui/toast";

const NAV = [
  { to: "/admin", end: true, icon: "grid", label: "Dashboard" },
  { to: "/admin/menu", icon: "list", label: "Menu manager" },
  { to: "/admin/orders", icon: "box", label: "Orders" },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Close the mobile drawer on navigation
  useEffect(() => { setOpen(false); }, [pathname]);

  // Escape closes the drawer
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Feature 17 — logout ends the session and returns to /admin/login
  function handleLogout() {
    logout();
    toast("Signed out of admin", "👋");
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin-shell">
      {open && <div className="admin-overlay" onClick={() => setOpen(false)} aria-hidden="true" />}

      <aside
        id="admin-sidebar"
        className={`admin-sidebar${open ? " admin-sidebar--open" : ""}`}
        aria-label="Admin navigation"
      >
        <div className="admin-sidebar__head">
          <Link to="/" className="brand" aria-label="Addis Eats — storefront">
            <span className="brand__mark" aria-hidden="true">🍲</span>
            <span className="brand__name">Addis<em>Eats</em></span>
          </Link>
          <span className="admin-tag">Admin</span>
        </div>

        <nav className="admin-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-link${isActive ? " admin-nav-link--active" : ""}`}
            >
              <Icon name={item.icon} size={18} /> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__foot">
          <Link to="/" className="admin-nav-link">
            <Icon name="arrowRight" size={17} /> View storefront
          </Link>
          <button type="button" className="admin-nav-link admin-logout" onClick={handleLogout}>
            <Icon name="logOut" size={17} /> Sign out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="icon-btn admin-burger"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="admin-sidebar"
            aria-label={open ? "Close admin menu" : "Open admin menu"}
          >
            <Icon name={open ? "x" : "menu"} />
          </button>
          <p className="admin-topbar__title">Addis Eats Admin</p>
          <div className="admin-topbar__actions">
            <ThemeToggle />
            <span className="admin-user" title={`Signed in as ${admin.username}`}>
              <Icon name="eye" size={14} /> {admin.username}
            </span>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      <Toaster />
    </div>
  );
}