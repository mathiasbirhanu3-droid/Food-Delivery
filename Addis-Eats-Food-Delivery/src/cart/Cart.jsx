import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart, updateQty, removeFromCart, clearCart } from "./cartStore";
import { useDeliveryArea } from "../hooks/useDeliveryArea";
import { DELIVERY_AREAS, deliveryFee, estimateDeliveryTime } from "../utils/deliveryEstimate";
import { formatCurrency } from "../utils/formatCurrency";
import DishPhoto from "../menu/DishPhoto";
import QtyStepper from "../ui/QtyStepper";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import Modal from "../ui/Modal";
import Icon from "../ui/Icons";
import { toast } from "../ui/toast";

export default function Cart() {
  const { items, count, subtotal } = useCart();
  const [area, setArea] = useDeliveryArea();
  const [confirmClear, setConfirmClear] = useState(false);

  const fee = deliveryFee(area);              // feature 20 — derived from area
  const eta = estimateDeliveryTime(area);     // feature 21 — derived from area
  const total = subtotal + fee;

  if (count === 0) {
    return (
      <main className="container page">
        <h1>Your cart</h1>
        <EmptyState
          icon="cart"
          title="Your cart is empty"
          message="Looks like you haven't added anything yet — the kitchen is waiting."
          action={<Button as={Link} to="/menu">Browse the menu</Button>}
        />
      </main>
    );
  }

  return (
    <main className="container page">
      <h1>Your cart</h1>
      <p className="page-sub">{count} item{count === 1 ? "" : "s"} ready for delivery.</p>

      <div className="cart-layout">
        <section aria-label="Items in your cart">
          <ul className="cart-lines">
            {items.map((item) => (
              <li key={item.id} className="cart-line">
                <Link to={`/menu/${item.id}`} className="cart-line__photo" tabIndex={-1} aria-hidden="true">
                  <DishPhoto dish={item} />
                </Link>
                <div className="cart-line__info">
                  <Link to={`/menu/${item.id}`} className="cart-line__name">{item.name}</Link>
                  <span className="cart-line__unit">{formatCurrency(item.price)} each</span>
                  <div className="cart-line__controls">
                    {/* +/- quantity controls (feature 5); 0 removes the line (feature 6) */}
                    <QtyStepper small value={item.qty} min={0} onChange={(q) => updateQty(item.id, q)} />
                    <button
                      className="icon-btn icon-btn--danger"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                </div>
                <strong className="cart-line__total">{formatCurrency(item.price * item.qty)}</strong>
              </li>
            ))}
          </ul>

          <Button variant="ghost" size="sm" onClick={() => setConfirmClear(true)}>
            <Icon name="trash" size={15} /> Clear cart
          </Button>
        </section>

        <aside className="summary-card" aria-label="Order summary">
          <h2>Summary</h2>
          <div className="summary-field">
            <label htmlFor="cart-area">Deliver to</label>
            <select id="cart-area" value={area} onChange={(e) => setArea(e.target.value)}>
              {DELIVERY_AREAS.map((a) => (
                <option key={a.name} value={a.name}>{a.name} — delivery {a.fee} ETB</option>
              ))}
            </select>
          </div>
          <div className="summary-row"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="summary-row"><span>Delivery fee</span><span>{formatCurrency(fee)}</span></div>
          <p className="eta"><Icon name="clock" size={16} /> Arrives in about <strong>{eta}</strong></p>
          <div className="summary-row summary-row--total" aria-live="polite">
            <span>Total</span><span>{formatCurrency(total)}</span>
          </div>
          <Button as={Link} to="/checkout" size="lg" className="w-full">
            Continue to checkout <Icon name="arrowRight" size={16} />
          </Button>
        </aside>
      </div>

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear the cart?"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setConfirmClear(false)}>Keep items</Button>
            <Button size="sm" onClick={() => { clearCart(); setConfirmClear(false); toast("Cart cleared", "🧹"); }}>
              Clear cart
            </Button>
          </>
        }
      >
        This removes all {count} item{count === 1 ? "" : "s"}. You can always add them again.
      </Modal>
    </main>
  );
}