import { Link } from "react-router-dom";
import { useDishes } from "../api/dishes";
import { useFavorites } from "./favoritesStore";
import DishGrid from "../menu/DishGrid";
import { DishGridSkeleton } from "../menu/DishCardSkeleton";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";

export default function Favorites() {
  const { dishes, status, error, retry } = useDishes();
  const { ids } = useFavorites();

  // Join: favorite ids → live dish data
  const saved = dishes.filter((d) => ids.includes(d.id));

  // Out-of-stock favorites are HIDDEN — but we tell the user how many,
  // so a shrinking list never looks like lost data.
  const available = saved.filter((d) => d.inStock !== false);
  const hiddenCount = saved.length - available.length;

  return (
    <main className="container page">
      <h1>Favorites</h1>
      {status === "loading" && <DishGridSkeleton count={3} />}
      {status === "error" && (
        <ErrorState title="We couldn't load your favorites" message={error.message} onRetry={retry} />
      )}
      {status === "success" && (
        available.length === 0 ? (
          <EmptyState
            icon="heart"
            title={saved.length > 0 ? "All favorites unavailable" : "No favorites yet"}
            message={
              saved.length > 0
                ? `${saved.length} saved ${saved.length === 1 ? "dish is" : "dishes are"} currently out of stock — they'll reappear here when the kitchen restocks them.`
                : "Tap the heart on any dish to save it here for next time."
            }
            action={<Button as={Link} to="/menu">Find something tasty</Button>}
          />
        ) : (
          <>
            {hiddenCount > 0 && (
              <p className="hidden-note" role="status">
                {hiddenCount} saved {hiddenCount === 1 ? "dish is" : "dishes are"} currently out of stock and hidden.
              </p>
            )}
            <DishGrid dishes={available} />
          </>
        )
      )}
    </main>
  );
}