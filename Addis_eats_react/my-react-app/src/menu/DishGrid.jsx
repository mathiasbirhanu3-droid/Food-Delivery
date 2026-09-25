import DishCard from "./DishCard";

// NOTE: the menu grid is capped at exactly THREE columns on desktop
// (2 on tablet, 1 on phone) — see .dish-grid in index.css.
export default function DishGrid({ dishes }) {
  return (
    <ul className="dish-grid">
      {dishes.map((dish) => (
        <li key={dish.id}><DishCard dish={dish} /></li>
      ))}
    </ul>
  );
}