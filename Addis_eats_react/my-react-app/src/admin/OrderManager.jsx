import { useState } from "react";
import { useAdminOrders, setOrderStatus, deleteOrder, ORDER_STATUSES, STATUS_META } from "./adminOrderStore";
import { formatCurrency } from "../utils/formatCurrency";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Icon from "../ui/Icons";
import { toast } from "../ui/toast";

const fmtDate = (iso) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function OrderManager() {
  const orders = useAdminOrders();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [details, setDetails] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const q = query.trim().toLowerCase();
  const filtered = orders.filter((o) => {
    const matchesQuery =
      !q ||
      [o.id, o.customer?.name, o.customer?.phone, o.area].some((f) =>
        String(f ?? "").toLowerCase().includes(q)
      );
    return matchesQuery && (statusFilter === "All" || o.status === statusFilter);
  });

  const countFor = (status) => orders.filter((o) => o.status === status).length;

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Orders</h1>
          <p className="page-sub">
            {orders.length} total · move orders through pending → preparing → delivering → delivered.
          </p>
        </div>
        <div className="search-box">
          <Icon name="search" size={18} className="search-box__icon" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search id, customer, area…"
            aria-label="Search orders"
          />
        </div>
      </div>

      <div className="filter-chips" role="group" aria-label="Filter orders by status">
        {["All", ...ORDER_STATUSES].map((s) => (
          <button
            key={s}
            className={`chip${statusFilter === s ? " chip--active" : ""}`}
            onClick={() => setStatusFilter(s)}
          >
            {s === "All" ? `All (${orders.length})` : `${STATUS_META[s].label} (${countFor(s)})`}
          </button>
        ))}
      </div>

      {/* Feature 11 — view all orders */}
      {filtered.length === 0 ? (
        <div className="state state--empty">
          <div className="state__icon"><Icon name="box" size={30} /></div>
          <h2>No orders match</h2>
          <p>Try a different search or status filter.</p>
        </div>
      ) : (
        <div className="orders-list">
          {filtered.map((o) => (
            <article key={o.id} className="order-card">
              <div className="order-card__head">
                <div>
                  <h2>{o.id}</h2>
                  <p className="order-card__date">{fmtDate(o.placedAt)} · {o.area}</p>
                </div>
                {/* Feature 12 — update order status */}
                <select
                  className="status-select"
                  value={o.status}
                  onChange={(e) => {
                    setOrderStatus(o.id, e.target.value);
                    toast(`${o.id} → ${STATUS_META[e.target.value].label}`, "🚚");
                  }}
                  aria-label={`Update status for order ${o.id}`}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_META[s].label}</option>
                  ))}
                </select>
              </div>

              <p className="order-card__meta"><Icon name="phone" size={13} /> {o.customer?.name} · {o.customer?.phone}</p>

              <ul className="order-items">
                {o.items?.map((i) => <li key={i.id}>{i.qty} × {i.name}</li>)}
              </ul>
              {o.instructions && <p className="order-card__note">📝 {o.instructions}</p>}

              <div className="order-card__foot">
                <strong>{formatCurrency(o.total)}</strong>
                <div className="row-actions">
                  <Button size="sm" variant="outline" onClick={() => setDetails(o)}>
                    <Icon name="eye" size={15} /> Details
                  </Button>
                  <button
                    className="icon-btn icon-btn--danger"
                    onClick={() => setDeleting(o)}
                    aria-label={`Delete order ${o.id}`}
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Feature 14 — order details view */}
      <Modal open={!!details} onClose={() => setDetails(null)} title={details ? `Order ${details.id}` : ""}>
        {details && (
          <>
            <div className="detail-block">
              <h3>Customer</h3>
              <p>{details.customer?.name}</p>
              <p>{details.customer?.phone}</p>
              <p>{details.area} · placed {fmtDate(details.placedAt)}</p>
              {details.eta && <p>Estimated delivery: {details.eta}</p>}
              {details.instructions && <p className="order-card__note">📝 {details.instructions}</p>}
            </div>
            <div className="detail-block">
              <h3>Items</h3>
              <ul className="summary-items">
                {details.items?.map((i) => (
                  <li key={i.id}>
                    <span>{i.qty} × {i.name}</span>
                    <span>{formatCurrency(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="summary-row"><span>Subtotal</span><span>{formatCurrency(details.subtotal)}</span></div>
              <div className="summary-row"><span>Delivery ({details.area})</span><span>{formatCurrency(details.deliveryFee ?? 0)}</span></div>
              <div className="summary-row summary-row--total"><span>Total</span><span>{formatCurrency(details.total)}</span></div>
            </div>
          </>
        )}
      </Modal>

      {/* Feature 13 — delete order */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete this order?"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button
              size="sm"
              onClick={() => {
                deleteOrder(deleting.id);
                toast(`Order ${deleting.id} deleted`, "🗑️");
                setDeleting(null);
              }}
            >
              Delete order
            </Button>
          </>
        }
      >
        {deleting && (
          <>Order <strong>{deleting.id}</strong> from {deleting.customer?.name} will be permanently removed.</>
        )}
      </Modal>
    </>
  );
}