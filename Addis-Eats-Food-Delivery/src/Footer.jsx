import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./ui/Icons";
import Button from "./ui/Button";
import { toast } from "./ui/toast";

// Social media addresses — swap in your real handles when they go live
const SOCIALS = [
  { name: "Facebook",   icon: "facebook",  href: "https://www.facebook.com/addiseats" },
  { name: "Instagram",  icon: "instagram", href: "https://www.instagram.com/addiseats" },
  { name: "X (Twitter)",icon: "twitterX",  href: "https://x.com/addiseats" },
  { name: "TikTok",     icon: "tiktok",    href: "https://www.tiktok.com/@addiseats" },
  { name: "Telegram",   icon: "telegram",  href: "https://t.me/addiseats" },
  { name: "YouTube",    icon: "youtube",   href: "https://www.youtube.com/@addiseats" },
];

const LINK_GROUPS = [
  {
    title: "Explore",
    links: [
      { label: "Full menu", to: "/menu" },
      { label: "Ethiopian classics", to: "/menu?category=Ethiopian" },
      { label: "Pizza", to: "/menu?category=Pizza" },
      { label: "Burgers", to: "/menu?category=Burgers" },
      { label: "Drinks", to: "/menu?category=Drinks" },
      { label: "Today's specials", to: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us" },
      { label: "Careers" },
      { label: "Partner with us" },
      { label: "Press kit" },
      { label: "Blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center" },
      { label: "Track my order", to: "/orders" },
      { label: "Delivery areas" },
      { label: "Privacy policy" },
      { label: "Terms of service" },
    ],
  },
];

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setEmail("");
    toast("You're subscribed — welcome to the family!", "📬");
  }

  return (
    <form className="footer-form" onSubmit={handleSubmit} noValidate>
      <div className="footer-form__row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-label="Email address for deals and specials"
          aria-invalid={!!error}
        />
        <Button type="submit">Subscribe</Button>
      </div>
      {error && <p className="footer-form__error" role="alert">{error}</p>}
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* ── Newsletter strip ── */}
      <div className="footer-newsletter">
        <div className="container footer-newsletter__inner">
          <div className="footer-newsletter__copy">
            <h2>Craving deals?</h2>
            <p>Weekly specials, new dishes and 10% off your first order — straight to your inbox.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* ── Main columns ── */}
      <div className="container footer-main">
        <div className="footer-brand">
          <Link to="/" className="brand" aria-label="Addis Eats — home">
            <span className="brand__mark" aria-hidden="true">🍲</span>
            <span className="brand__name">Addis<em>Eats</em></span>
          </Link>
          <p className="footer-brand__blurb">
            Addis Ababa's hometown food delivery — injera classics, wood-fired pizza and burgers,
            delivered hot in about 30 minutes.
          </p>

          <div className="footer-social" aria-label="Addis Eats on social media">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                className="social-link"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Addis Eats on ${s.name}`}
                title={s.name}
              >
                <Icon name={s.icon} size={17} />
              </a>
            ))}
          </div>

          <ul className="footer-contact">
            <li>
              <Icon name="phone" size={15} />
              <a href="tel:+251911234567">+251 911 234 567</a>
            </li>
            <li>
              <Icon name="mail" size={15} />
              <a href="mailto:hello@addiseats.com">hello@addiseats.com</a>
            </li>
            <li>
              <Icon name="pin" size={15} />
              <span>Bole Road, Golden Plaza, Addis Ababa</span>
            </li>
          </ul>
          <p className="footer-brand__areas">
            Serving: Bole · Kazanchis · Piassa · Haya Hulet · Merkato · Saris · Yeka
          </p>
        </div>

        {LINK_GROUPS.map((group) => (
          <nav key={group.title} className="footer-col" aria-label={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to}>{link.label}</Link>
                  ) : (
                    <a href="#" onClick={(e) => e.preventDefault()}>{link.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <div className="container footer-bottom__inner">
          <p>© {new Date().getFullYear()} Addis Eats. All rights reserved.</p>
          <ul className="footer-pay" aria-label="Accepted payment methods">
            <li>Cash on delivery</li>
            <li>Telebirr</li>
            <li>CBE Birr</li>
            <li>M-Pesa</li>
          </ul>
          <p className="footer-made">
            Made with <span aria-hidden="true">❤️</span><span className="sr-only">love</span> in Addis Ababa
          </p>
        </div>
      </div>
    </footer>
  );
}