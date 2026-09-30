import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDishes } from "../api/dishes";
import { addToCart } from "../cart/cartStore";
import { formatCurrency } from "../utils/formatCurrency";
import DishPhoto from "./DishPhoto";
import DishGrid from "./DishGrid";
import { DishDetailSkeleton } from "./DishCardSkeleton";
import FavoriteButton from "../favorites/FavoriteButton";
import QtyStepper from "../ui/QtyStepper";
import Button from "../ui/Button";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";
import Icon from "../ui/Icons";
import { toast } from "../ui/toast";

export default function Dish() {
  const { id } = useParams();
  const { dishes, status, error, retry } = useDishes();
  const [qty, setQty] = useState(1);

  // Reset quantity when navigating between dishes
  useEffect(() => { setQty(1); window.scrollTo({ top: 0 }); }, [id]);

  if (status === "loading") {
    return <main className="container page"><DishDetailSkeleton /></main>;
  }
  if (status === "error") {
    return <main className="container page"><ErrorState title="We couldn't load this dish" message={error.message} onRetry={retry} /></main>;
  }

  const dish = dishes.find((d) => String(d.id) === String(id));
  if (!dish) {
    return (
      <main className="container page">
        <EmptyState
          icon="search"
          title="Dish not found"
          message="It may have been removed from the menu."
          action={<Button as={Link} to="/menu">Back to the menu</Button>}
        />
      </main>
    );
  }

  const unavailable = dish.inStock === false;

  const related = dishes
    .filter((d) => d.category === dish.category && d.id !== dish.id && d.inStock !== false)
    .slice(0, 3);

  function handleAdd() {
    if (unavailable) return;
    addToCart(dish, qty);
    toast(`${qty} × ${dish.name} added to cart`, "🛒");
  }

  return (
    <main className="container page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/menu">Menu</Link> <span aria-hidden="true">/</span> <span aria-current="page">{dish.name}</span>
      </nav>

      <div className="dish-detail">
        <div className="dish-detail__media">
          <DishPhoto dish={dish} />
        </div>

        <div className="dish-detail__info">
          <div className="dish-detail__chips">
            <span className="chip chip--static">{dish.category}</span>
            {unavailable && <span className="badge badge--oos">Out of stock</span>}
            {dish.spicy && !unavailable && <span className="badge badge--spicy"><Icon name="flame" size={12} /> Spicy</span>}
            {dish.veg && !unavailable && <span className="badge badge--veg"><Icon name="leaf" size={12} /> Veg</span>}
            {dish.popular && !unavailable && <span className="badge badge--popular">Popular</span>}
          </div>

          <h1>{dish.name}</h1>
          <p className="dish-detail__meta">
            <span className="dish-card__rating"><Icon name="star" filled size={14} className="star" /> {dish.rating}</span>
            <span><Icon name="clock" size={14} /> {dish.prepTime} min prep</span>
          </p>
          <p className="dish-detail__desc">{dish.description}</p>

          <h2 className="dish-detail__subhead">Ingredients</h2>
          <ul className="ingredient-list">
            {dish.ingredients.map((i) => <li key={i}>{i}</li>)}
          </ul>

          {unavailable ? (
            <div className="oos-banner" role="status">
              😴 Currently out of stock — check back soon.
            </div>
          ) : (
            <div className="dish-detail__buy">
              <span className="dish-detail__price">{formatCurrency(dish.price)}</span>
              <QtyStepper value={qty} onChange={setQty} />
              <Button onClick={handleAdd}><Icon name="cart" size={17} /> Add to cart</Button>
              <FavoriteButton dishId={dish.id} name={dish.name} className="fav-btn--inline" />
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="section" aria-label="Related dishes">
          <h2>You might also like</h2>
          <DishGrid dishes={related} />
        </section>
      )}
    </main>
  );
}