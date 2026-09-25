import { Link } from "react-router-dom";
import { useDishes } from "../api/dishes";
import DishCard from "../menu/DishCard";
import { DishGridSkeleton } from "../menu/DishCardSkeleton";
import Button from "../ui/Button";
import ErrorState from "../ui/ErrorState";
import Icon from "../ui/Icons";

const CATEGORIES = [
  { name: "Ethiopian", emoji: "🍲", blurb: "Wats, tibs & kitfo on injera" },
  { name: "Pizza",     emoji: "🍕", blurb: "Wood-fired, loaded toppings" },
  { name: "Burgers",   emoji: "🍔", blurb: "Juicy patties & crisp fries" },
  { name: "Drinks",    emoji: "☕", blurb: "Buna, spris & fresh juices" },
];

export default function Home() {
  const { dishes, status, error, retry } = useDishes();

  // Specials = popular AND in stock
  const specials = dishes.filter((d) => d.popular && d.inStock !== false).slice(0, 3);

  return (
    <main>
      <section className="hero">
        <div className="container">
          <p className="hero__eyebrow">Fresh food delivery · Addis Ababa</p>
          <h1>From doro wat to wood-fired pizza, <span>delivered hot</span> in about 30 minutes.</h1>
          <p className="hero__sub">
            Addis Eats brings the city's best Ethiopian classics, pizzas, burgers and drinks from our
            kitchens to your door — in Bole, Piassa, Merkato and beyond.
          </p>
          <div className="hero__actions">
            <Button as={Link} to="/menu" size="lg">Browse the menu <Icon name="arrowRight" size={18} /></Button>
            <Button as={Link} to="/cart" variant="outline" size="lg">View cart</Button>
          </div>
          <ul className="hero__stats">
            <li><strong>~30 min</strong><span>average delivery</span></li>
            <li><strong>4.8 ★</strong><span>from 2,300+ orders</span></li>
            <li><strong>7 areas</strong><span>covered across the city</span></li>
          </ul>
        </div>
      </section>

      <section className="container section" aria-labelledby="specials-heading">
        <div className="section-head">
          <h2 id="specials-heading">Today's specials</h2>
          <Link className="see-all" to="/menu">Full menu <Icon name="arrowRight" size={16} /></Link>
        </div>
        {status === "loading" && <DishGridSkeleton count={3} className="specials-grid" />}
        {status === "error" && <ErrorState title="We couldn't load today's specials" onRetry={retry} />}
        {status === "success" && (
          <div className="specials-grid">
            {specials.map((d) => <DishCard key={d.id} dish={d} />)}
          </div>
        )}
      </section>

      <section className="container section" aria-labelledby="categories-heading">
        <h2 id="categories-heading">Browse by category</h2>
        <div className="category-tiles">
          {CATEGORIES.map((c) => (
            <Link key={c.name} to={`/menu?category=${encodeURIComponent(c.name)}`} className="category-tile">
              <span className="category-tile__emoji" aria-hidden="true">{c.emoji}</span>
              <strong>{c.name}</strong>
              <span className="category-tile__blurb">{c.blurb}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section" aria-labelledby="how-heading">
        <h2 id="how-heading">How Addis Eats works</h2>
        <ol className="steps">
          <li className="step"><strong>Pick your dishes</strong><p>Browse the menu, search instantly and save favorites with a tap.</p></li>
          <li className="step"><strong>We cook it fresh</strong><p>Our kitchens start the moment your order is confirmed.</p></li>
          <li className="step"><strong>Rider at your gate</strong><p>Pay on delivery and track the ETA right up to your door.</p></li>
        </ol>
      </section>

      <section className="container section">
        <div className="cta-banner">
          <div>
            <h2>Hungry right now?</h2>
            <p>Order before 9 PM — we deliver until the last plate.</p>
          </div>
          <Button as={Link} to="/menu" size="lg">Order now</Button>
        </div>
      </section>
    </main>
  );
}