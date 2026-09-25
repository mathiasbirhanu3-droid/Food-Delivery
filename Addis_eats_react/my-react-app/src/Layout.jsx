import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { useCart } from "./cart/cartStore";
import ThemeToggle from "./theme/ThemeToggle";
import CartBadge from "./cart/CartBadge";
import Button from "./ui/Button";
import Icon from "./ui/Icons";
import { Toaster } from "./ui/toast";
import Footer from "./Footer";   // ← add at the top with the other imports

export default function Layout() {
  const [navOpen, setNavOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { count } = useCart();
  const { pathname } = useLocation();

  // Close the mobile drawer whenever the route changes
  useEffect(() => { setNavOpen(false); }, [pathname]);

  const navLink = ({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to main content</a>

      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand" aria-label="Addis Eats — home">
            <span className="brand__mark" aria-hidden="true">🍲</span>
            <span className="brand__name">Addis<em>Eats</em></span>
          </Link>

          <nav id="main-nav" className={`site-nav${navOpen ? " site-nav--open" : ""}`} aria-label="Primary">
            <NavLink to="/menu" className={navLink}>Menu</NavLink>
            <NavLink to="/favorites" className={navLink}>Favorites</NavLink>
            <NavLink to="/orders" className={navLink}>My Orders</NavLink>
          </nav>

          <div className="site-header__actions">
            <ThemeToggle />
            <Link to="/cart" className="icon-btn cart-btn" aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}>
              <Icon name="cart" />
              <CartBadge />
            </Link>
            {user ? (
              <button
                className="user-chip"
                onClick={signOut}
                title={`Sign out (${user.name})`}
                aria-label={`Signed in as ${user.name}. Click to sign out`}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
            ) : (
              <Button as={Link} to="/login" variant="outline" size="sm">Sign in</Button>
            )}
            <button
              className="icon-btn nav-burger"
              onClick={() => setNavOpen((o) => !o)}
              aria-expanded={navOpen}
              aria-controls="main-nav"
              aria-label={navOpen ? "Close menu" : "Open menu"}
            >
              <Icon name={navOpen ? "x" : "menu"} />
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        <Outlet />
      </main>

      

      <Toaster />
      <Footer />
    </div>
  );
}