import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDishes } from "../api/dishes";
import { useDebounce } from "../hooks/useDebounce";
import CategoryBar from "./CategoryBar";
import DishGrid from "./DishGrid";
import { DishGridSkeleton } from "./DishCardSkeleton";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";
import Icon from "../ui/Icons";

export default function Menu() {
  const [params, setParams] = useSearchParams();
  const { dishes, status, error, retry } = useDishes();

  // Search + category live in the URL — shareable, survive refresh.
  const query = params.get("q") ?? "";
  const category = params.get("category") || "All";
  const debouncedQuery = useDebounce(query, 250);

  function setQuery(value) {
    const next = new URLSearchParams(params);
    if (value) next.set("q", value);
    else next.delete("q");
    setParams(next, { replace: true });
  }

  // Out-of-stock dishes are hidden from the customer menu entirely.
  const visible = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const cat = category.trim().toLowerCase();
    return dishes.filter((d) => {
      const inStock = d.inStock !== false;
      const dishCat = String(d.category ?? "").trim().toLowerCase();
      const inCategory = category === "All" || dishCat === cat;
      const inSearch =
        !q ||
        [d.name, d.description, d.category].some((f) =>
          String(f ?? "").toLowerCase().includes(q)
        );
      return inStock && inCategory && inSearch;
    });
  }, [dishes, debouncedQuery, category]);

  return (
    <main className="container page">
      <header className="page-head">
        <div>
          <h1>Our menu</h1>
          <p className="page-sub">Fresh from our kitchens in Addis Ababa.</p>
        </div>
        <div className="search-box">
          <Icon name="search" size={18} className="search-box__icon" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes… e.g. doro, pizza"
            aria-label="Search the menu"
          />
          {query && (
            <button className="search-box__clear" onClick={() => setQuery("")} aria-label="Clear search">
              <Icon name="x" size={14} />
            </button>
          )}
        </div>
      </header>

      <CategoryBar dishes={dishes} />

      {status === "loading" && <DishGridSkeleton count={6} />}
      {status === "error" && (
        <ErrorState title="We couldn't load the menu" message={error.message} onRetry={retry} />
      )}
      {status === "success" && (
        dishes.length === 0 ? (
          <EmptyState
            icon="search"
            title="The menu is empty"
            message="Nothing has been added to the menu yet — check back soon."
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon="search"
            title="No dishes found"
            message={`Nothing matches "${debouncedQuery || category}". Try a different search or category.`}
            action={<Button as={Link} to="/menu">Clear filters</Button>}
          />
        ) : (
          <>
            <p className="results-count" aria-live="polite">
              {visible.length} {visible.length === 1 ? "dish" : "dishes"}
            </p>
            <DishGrid dishes={visible} />
          </>
        )
      )}
    </main>
  );
}