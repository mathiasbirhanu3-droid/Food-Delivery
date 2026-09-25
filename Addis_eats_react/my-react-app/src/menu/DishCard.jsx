import { Link } from "react-router-dom";
import DishPhoto from "./DishPhoto";
import FavoriteButton from "../favorites/FavoriteButton";
import { addToCart } from "../cart/cartStore";
import { formatCurrency } from "../utils/formatCurrency";
import Icon from "../ui/Icons";
import { toast } from "../ui/toast";

export default function DishCard({ dish }) {
  const unavailable = dish.inStock === false;

  // Feature 4 — add to cart straight from the card (blocked when out of stock)
  function quickAdd() {
    if (unavailable) return;
    addToCart(dish);
    toast(`${dish.name} added to cart`, "🛒");
  }

  return (
    <article className={`dish-card${unavailable ? " dish-card--oos" : ""}`}>
      <Link to={`/menu/${dish.id}`} className="dish-card__media" aria-label={`View details for ${dish.name}`}>
        <DishPhoto dish={dish} />
        <div className="dish-card__badges">
          {unavailable && <span className="badge badge--oos">Out of stock</span>}
          {dish.popular && !unavailable && <span className="badge badge--popular">Popular</span>}
          {dish.spicy && <span className="badge badge--spicy"><Icon name="flame" size={11} /> Spicy</span>}
        </div>
      </Link>

      <FavoriteButton dishId={dish.id} name={dish.name} />

      <div className="dish-card__body">
        <div className="dish-card__top">
          <h3><Link to={`/menu/${dish.id}`}>{dish.name}</Link></h3>
          <span className="dish-card__rating"><Icon name="star" filled size={13} className="star" /> {dish.rating}</span>
        </div>
        <p className="dish-card__meta">{dish.category} · {dish.prepTime} min · {dish.veg ? "Veg" : "Non-veg"}</p>
        <p className="dish-card__desc">{dish.description}</p>
        <div className="dish-card__footer">
          <span className="dish-card__price">{formatCurrency(dish.price)}</span>
          <button
            className="btn btn--primary btn--sm"
            onClick={quickAdd}
            disabled={unavailable}
            aria-label={unavailable ? `${dish.name} is out of stock` : `Add ${dish.name} to cart`}
          >
            <Icon name="plus" size={14} /> {unavailable ? "N/A" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}