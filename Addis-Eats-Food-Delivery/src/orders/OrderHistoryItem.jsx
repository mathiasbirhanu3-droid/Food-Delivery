import { useNavigate } from "react-router-dom";
import { addToCart } from "../cart/cartStore";
import { useDishes } from "../api/dishes";
import { formatCurrency } from "../utils/formatCurrency";
import Button from "../ui/Button";
import Icon from "../ui/Icons";
import { toast } from "../ui/toast";

export default function OrderHistoryItem({ order }) {
  const navigate = useNavigate();
  const { dishes } = useDishes(); // live menu — so stock tags update the moment an admin hides/restocks

  // ⚠️ The order record itself is NEVER modified — history is immutable.
  // We only JOIN each order item against the live menu to know its
  // CURRENT availability for display and for the reorder action.
  const itemsWithStatus = order.items.map((item) => {
    const dish = dishes.find((d) => String(d.id) === String(item.id));
    return {
      ...item,
      available: !!dish && dish.inStock !== false, // deleted OR hidden → unavailable
    };
  });

  const availableItems = itemsWithStatus.filter((i) => i.available);
  const outOfStockCount = itemsWithStatus.length - availableItems.length;
  const addedCount = availableItems.reduce((n, i) => n + i.qty, 0);
  const itemCount = order.items.reduce((n, i) => n + i.qty, 0);

  // Feature 19 — reorder, but ONLY the in-stock items. Out-of-stock items
  // are skipped (not ordered); all other items and orders are untouched.
  function handleReorder() {
    if (availableItems.length === 0) {
      toast("All items in this order are currently out of stock", "🙈");
      return; // nothing was added, nothing was changed
    }

    availableItems.forEach((item) => addToCart(item, item.qty));

    if (outOfStockCount > 0) {
      toast(
        `${addedCount} item${addedCount === 1 ? "" : "s"} added · ${outOfStockCount} skipped (out of stock)`,
        "🔁"
      );
    } else {
      toast(`${itemCount} item${itemCount === 1 ? "" : "s"} added to your cart`, "🔁");
    }

    navigate("/cart");
  }

  const date = new Date(order.placedAt).toLocaleString("en-GB", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });

  return (
    <article className="order-card">
      <div className="order-card__head">
        <div>
          <h2>{order.id}</h2>
          <p className="order-card__date">{date} · {order.area}</p>
        </div>
        <span className="status-pill">{order.status}</span>
      </div>

      {/* Every item stays listed — out-of-stock ones are just tagged */}
      <ul className="order-items">
        {itemsWithStatus.map((i) => (
          <li key={i.id} className={i.available ? "" : "order-item--oos"}>
            <span>{i.qty} × {i.name}</span>
            {!i.available && <span className="oos-tag">out of stock</span>}
          </li>
        ))}
      </ul>

      {outOfStockCount > 0 && (
        <p className="order-card__note" role="status">
          {outOfStockCount} {outOfStockCount === 1 ? "item is" : "items are"} unavailable and will be skipped on reorder.
        </p>
      )}

      {order.instructions && <p className="order-card__note">📝 {order.instructions}</p>}

      <div className="order-card__foot">
        <strong>{formatCurrency(order.total)}</strong>
        <Button size="sm" onClick={handleReorder}>
          <Icon name="cart" size={15} /> Reorder
        </Button>
      </div>
    </article>
  );
}