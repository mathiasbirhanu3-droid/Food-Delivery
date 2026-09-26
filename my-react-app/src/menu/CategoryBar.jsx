import { Link, useSearchParams } from "react-router-dom";

// Canonical categories (also used by the admin DishForm)
export const CATEGORIES = ["Ethiopian", "Pizza", "Burgers", "Drinks"];

// Feature 3 — the selected category lives in the URL (?category=…),
// so filtered views are shareable and survive a refresh.
// Chips = the canonical four PLUS any extra categories found in the live
// data, each with a live count — so every dish is always reachable.
// Clicking a chip also clears any active search (clear mental model).
export default function CategoryBar({ dishes = [] }) {
  const [params] = useSearchParams();
  const active = params.get("category") || "All";

  const countFor = (cat) =>
    cat === "All"
      ? dishes.length
      : dishes.filter(
          (d) => String(d.category ?? "").trim().toLowerCase() === cat.toLowerCase()
        ).length;

  // Extra categories present in the data but not in the canonical list
  const extras = [...new Set(dishes.map((d) => String(d.category ?? "").trim()))]
    .filter((c) => c && !CATEGORIES.some((k) => k.toLowerCase() === c.toLowerCase()));

  const chips = ["All", ...CATEGORIES, ...extras];

  return (
    <nav className="category-bar" aria-label="Filter dishes by category">
      {chips.map((cat) => {
        const isActive = active.toLowerCase() === cat.toLowerCase();
        return (
          <Link
            key={cat}
            to={cat === "All" ? "/menu" : `/menu?category=${encodeURIComponent(cat)}`}
            className={`chip${isActive ? " chip--active" : ""}`}
            aria-current={isActive ? "true" : undefined}
          >
            {cat} <span className="chip__count">{countFor(cat)}</span>
          </Link>
        );
      })}
    </nav>
  );
}