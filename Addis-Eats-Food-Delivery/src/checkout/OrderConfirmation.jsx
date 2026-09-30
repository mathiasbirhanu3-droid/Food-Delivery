import { Link, useParams } from "react-router-dom";
import { useOrders } from "../orders/orderHistoryStore";
import { formatCurrency } from "../utils/formatCurrency";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";
import Icon from "../ui/Icons";

export default function OrderConfirmation() {
  const { id } = useParams();
  const orders = useOrders();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <main className="container page">
        <EmptyState
          icon="search"
          title="Order not found"
          message="We couldn't find that order — it may have been cleared."
          action={<Button as={Link} to="/menu">Back to the menu</Button>}
        />
      </main>
    );
  }

  return (
    <main className="container page confirmation">
      <div className="confirmation__icon" aria-hidden="true"><Icon name="check" size={34} /></div>
      <h1>Thank you, {order.customer.name.split(" ")[0]}!</h1>
      <p className="page-sub">
        Your order <strong>{order.id}</strong> is confirmed. We'll call {order.customer.phone} when the rider is close.
      </p>

      <div className="confirmation__card form-card">
        <ul className="summary-items">
          {order.items.map((i) => (
            <li key={i.id}>
              <span>{i.qty} × {i.name}</span>
              <span>{formatCurrency(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="summary-row"><span>Delivery to {order.area}</span><span>{formatCurrency(order.deliveryFee)}</span></div>
        <div className="summary-row summary-row--total"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
        <p className="eta"><Icon name="clock" size={16} /> Arriving in about <strong>{order.eta}</strong></p>
        {order.instructions && <p className="eta">📝 Note: {order.instructions}</p>}
      </div>

      <div className="confirmation__actions">
        <Button as={Link} to="/orders">View my orders</Button>
        <Button as={Link} to="/menu" variant="outline">Order something else</Button>
      </div>
    </main>
  );
}