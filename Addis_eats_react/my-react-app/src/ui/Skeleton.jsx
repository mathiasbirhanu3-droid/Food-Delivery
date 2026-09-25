// Generic skeleton primitive — a shimmering placeholder block.
// Purely presentational and aria-hidden; screen users get a live
// "loading" announcement from the component that composes it.
export default function Skeleton({ className = "", style }) {
  return <span className={`skeleton ${className}`} style={style} aria-hidden="true" />;
}