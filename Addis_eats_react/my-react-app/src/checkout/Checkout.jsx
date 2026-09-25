import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart, clearCart } from "../cart/cartStore";
import { useAuth } from "../auth/AuthContext";
import { useDeliveryArea } from "../hooks/useDeliveryArea";
import { DELIVERY_AREAS, deliveryFee, estimateDeliveryTime } from "../utils/deliveryEstimate";
import { validateCheckout } from "./validate";
import Field from "./Field";
import { placeOrder } from "../orders/orderHistoryStore";
import { formatCurrency } from "../utils/formatCurrency";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import Icon from "../ui/Icons";
import { toast } from "../ui/toast";

export default function Checkout() {
  const { items, count, subtotal } = useCart();
  const { user } = useAuth();
  const [area, setArea] = useDeliveryArea();
  const navigate = useNavigate();

  // Checkout form state lives here — and nowhere else (per the plan)
  const [form, setForm] = useState({ name: user?.name ?? "", phone: "", instructions: "" });
  const [errors, setErrors] = useState({});

  const fee = deliveryFee(area);            // feature 20
  const eta = estimateDeliveryTime(area);   // feature 21
  const total = subtotal + fee;

  if (count === 0) {
    return (
      <main className="container page">
        <h1>Checkout</h1>
        <EmptyState
          icon="cart"
          title="Nothing to check out"
          message="Your cart is empty — add a few dishes first."
          action={<Button as={Link} to="/menu">Browse the menu</Button>}
        />
      </main>
    );
  }

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validateCheckout({ name: form.name, phone: form.phone, area });
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      document.getElementById(`checkout-${Object.keys(errs)[0]}`)?.focus(); // keyboard-friendly errors
      return;
    }

    const order = placeOrder({
      customer: { name: form.name.trim(), phone: form.phone.trim() },
      area,
      eta,
      instructions: form.instructions.trim(),
      items: items.map(({ id, name, price, image, emoji, category, qty }) => ({ id, name, price, image, emoji, category, qty })),
      subtotal,
      deliveryFee: fee,
      total,
    });

    clearCart();
    toast("Order placed — thank you!", "🎉");
    navigate(`/order-confirmation/${order.id}`, { replace: true });
  }

  return (
    <main className="container page">
      <h1>Checkout</h1>
      <p className="page-sub">Almost there — where should we deliver?</p>

      <div className="checkout-layout">
        <form className="form-card" onSubmit={handleSubmit} noValidate>
          <Field label="Full name" htmlFor="checkout-name" error={errors.name}>
            <input id="checkout-name" value={form.name} onChange={setField("name")} placeholder="Abebe Kebede" autoComplete="name" />
          </Field>

          <Field
            label="Phone number"
            htmlFor="checkout-phone"
            error={errors.phone}
            hint="We call when the rider is close — e.g. 0912345678 or +251912345678"
          >
            <input id="checkout-phone" type="tel" value={form.phone} onChange={setField("phone")} placeholder="0912345678" autoComplete="tel" />
          </Field>

          <Field label="Delivery area" htmlFor="checkout-area" error={errors.area}>
            <select id="checkout-area" value={area} onChange={(e) => setArea(e.target.value)}>
              {DELIVERY_AREAS.map((a) => (
                <option key={a.name} value={a.name}>{a.name} — delivery {a.fee} ETB</option>
              ))}
            </select>
          </Field>

          {/* Feature 23 — special instructions */}
          <Field label="Special instructions (optional)" htmlFor="checkout-notes" hint="Allergies, spice level, gate code…">
            <textarea
              id="checkout-notes"
              rows={3}
              value={form.instructions}
              onChange={setField("instructions")}
              placeholder="Extra berbere on the side, please."
            />
          </Field>

          <Button type="submit" size="lg" className="w-full">
            Place order · {formatCurrency(total)}
          </Button>
        </form>

        <aside className="summary-card" aria-label="Order summary">
          <h2>Order summary</h2>
          <ul className="summary-items">
            {items.map((i) => (
              <li key={i.id}>
                <span>{i.qty} × {i.name}</span>
                <span>{formatCurrency(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="summary-row"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="summary-row"><span>Delivery ({area})</span><span>{formatCurrency(fee)}</span></div>
          <div className="summary-row summary-row--total" aria-live="polite">
            <span>Total</span><span>{formatCurrency(total)}</span>
          </div>
          <p className="eta"><Icon name="clock" size={16} /> Estimated delivery: <strong>{eta}</strong></p>
        </aside>
      </div>
    </main>
  );
}