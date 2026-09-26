import { useState } from "react";

// Photos fail gracefully: if an image can't load we show the dish's emoji on
// a category-colored gradient instead of a broken-image icon.
export default function DishPhoto({ dish, className = "" }) {
  const [failed, setFailed] = useState(false);
  const catClass = `cat-${(dish.category || "default").toLowerCase()}`;

  if (failed || !dish.image) {
    return (
      <div className={`dish-photo-fallback ${catClass} ${className}`} aria-hidden="true">
        <span>{dish.image || "🍽️"}</span>
      </div>
    );
  }

   return (
    <img
      className={`dish-photo ${className}`}
      src={dish.image}
      alt={dish.name}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
  
}