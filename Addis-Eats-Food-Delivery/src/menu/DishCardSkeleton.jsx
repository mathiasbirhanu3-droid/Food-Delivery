import Skeleton from "../ui/Skeleton";

// Mirrors DishCard's structure 1:1 — media, title row, meta, two
// description lines, price + button footer — so the swap from skeleton
// to real card causes no layout shift.
export function DishCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <Skeleton className="skeleton-card__media" />
      <div className="skeleton-card__body">
        <div className="skeleton-row">
          <Skeleton className="skeleton-line skeleton-line--title" />
          <Skeleton className="skeleton-line skeleton-line--rating" />
        </div>
        <Skeleton className="skeleton-line skeleton-line--meta" />
        <Skeleton className="skeleton-line skeleton-line--desc" />
        <Skeleton className="skeleton-line skeleton-line--desc skeleton-line--desc2" />
        <div className="skeleton-card__footer">
          <Skeleton className="skeleton-line skeleton-line--price" />
          <Skeleton className="skeleton-btn" />
        </div>
      </div>
    </div>
  );
}

// Fills the same grid the real cards use (.dish-grid / .specials-grid),
// so the 1 → 2 → 3-column responsive rule applies to skeletons too.
export function DishGridSkeleton({ count = 6, className = "dish-grid" }) {
  return (
    <>
      <p className="sr-only" role="status">Loading dishes…</p>
      <ul className={className} aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <li key={i}><DishCardSkeleton /></li>
        ))}
      </ul>
    </>
  );
}

// Mirrors the dish detail page layout (media + info column).
export function DishDetailSkeleton() {
  return (
    <>
      <p className="sr-only" role="status">Loading dish…</p>
      <div className="dish-detail" aria-hidden="true">
        <Skeleton className="skeleton-detail__media" />
        <div className="skeleton-detail__info">
          <div className="skeleton-row">
            <Skeleton className="skeleton-pill" />
            <Skeleton className="skeleton-pill" />
          </div>
          <Skeleton className="skeleton-line skeleton-line--h1" />
          <Skeleton className="skeleton-line skeleton-line--meta2" />
          <Skeleton className="skeleton-line skeleton-line--para" />
          <Skeleton className="skeleton-line skeleton-line--para2" />
          <div className="skeleton-row">
            <Skeleton className="skeleton-line skeleton-line--ing" />
            <Skeleton className="skeleton-line skeleton-line--ing" />
            <Skeleton className="skeleton-line skeleton-line--ing" />
          </div>
          <Skeleton className="skeleton-line skeleton-line--buy" />
        </div>
      </div>
    </>
  );
}