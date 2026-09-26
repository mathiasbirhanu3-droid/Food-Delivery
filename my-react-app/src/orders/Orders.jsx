import { Link } from "react-router-dom";
import { useOrders } from "./orderHistoryStore";
import OrderHistoryItem from "./OrderHistoryItem";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";

export default function Orders() {
  const orders = useOrders();

  if (orders.length === 0) {
    return (
      <main className="container page">
        <h1>My orders</h1>
        <EmptyState
          icon="clock"
          title="No orders yet"
          message="Once you order, it will show up here — with a one-click Reorder button."
          action={<Button as={Link} to="/menu">Browse the menu</Button>}
        />
      </main>
    );
  }

  return (
    <main className="container page">
      <h1>My orders</h1>
      <p className="page-sub">{orders.length} order{orders.length > 1 ? "s" : ""} — tap Reorder to fill your cart again.</p>
      <div className="orders-list">
        {orders.map((o) => <OrderHistoryItem key={o.id} order={o} />)}
      </div>
    </main>
  );
}