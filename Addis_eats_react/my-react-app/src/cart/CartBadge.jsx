import { useCart } from "./cartStore";

export default function CartBadge() {
  const { count } = useCart(); // derived — no separate state (feature 24)
  if (count === 0) return null;
  return <span className="cart-badge">{count > 99 ? "99+" : count}</span>;
}