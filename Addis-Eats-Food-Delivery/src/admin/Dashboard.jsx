import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAdminOrders, ORDER_STATUSES, STATUS_META } from "./adminOrderStore";
import { useAdminDishes } from "./adminDishStore";
import { formatCurrency } from "../utils/formatCurrency";
import Icon from "../ui/Icons";

const fmtDate = (iso) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function Dashboard() {
  const orders = useAdminOrders();
  const dishes = useAdminDishes();

  // Feature 3 — revenue, order count, average order value
  const revenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const avgOrder = orders.length ? revenue / orders.length : 0;

  // Feature 4 — top selling dishes (aggregated from every order's items)
  const topDishes = useMemo(() => {
    const tally = new Map();
    for (const order of orders) {
      for (const item of order.items ?? []) {
        const entry = tally.get(item.name) ?? { name: item.name, emoji: item.emoji ?? "🍽️", qty: 0 };
        entry.qty += item.qty;
        tally.set(item.name, entry);
      }
    }
    return [...tally.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders]);

  // Feature 5 — order status distribution
  const statusCounts = useMemo(
    () => ORDER_STATUSES.map((status) => ({ status, count: orders.filter((o) => o.status === status).length })),
    [orders]
  );
  const maxQty = Math.max(1, ...topDishes.map((d) => d.qty));
  const maxStatus = Math.max(1, ...statusCounts.map((s) => s.count));

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="page-sub">Live snapshot of the storefront.</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-card__label">Revenue</span>
          <span className="stat-card__value">{formatCurrency(revenue)}</span>
          <span className="stat-card__hint"><Icon name="trendingUp" size={13} /> all-time · ETB</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Orders</span>
          <span className="stat-card__value">{orders.length}</span>
          <span className="stat-card__hint">all statuses</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Avg order value</span>
          <span className="stat-card__value">{formatCurrency(Math.round(avgOrder))}</span>
          <span className="stat-card__hint">revenue ÷ orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Menu items</span>
          <span className="stat-card__value">{dishes.length}</span>
          <span className="stat-card__hint">in the admin menu</span>
        </div>
      </div>

      <div className="admin-grid-2">
        <section className="panel" aria-labelledby="top-dishes-h">
          <h2 id="top-dishes-h">Top selling dishes</h2>
          {topDishes.length === 0 ? (
            <p className="panel__empty">No orders yet — stats appear after the first sale.</p>
          ) : (
            topDishes.map((d) => (
              <div key={d.name} className="bar-row">
                <span className="bar-row__label">{d.emoji} {d.name}</span>
                <span className="bar-track">
                  <span className="bar-fill" style={{ width: `${(d.qty / maxQty) * 100}%` }} />
                </span>
                <span className="bar-row__value">{d.qty} sold</span>
              </div>
            ))
          )}
        </section>

        <section className="panel" aria-labelledby="status-dist-h">
          <h2 id="status-dist-h">Order status distribution</h2>
          {statusCounts.map(({ status, count }) => (
            <div key={status} className="bar-row">
              <span className="bar-row__label">
                <span className="dot" style={{ background: STATUS_META[status].color }} />
                {STATUS_META[status].label}
              </span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${(count / maxStatus) * 100}%`, background: STATUS_META[status].color }} />
              </span>
              <span className="bar-row__value">{count}</span>
            </div>
          ))}
        </section>
      </div>

      <section className="panel" aria-labelledby="recent-orders-h">
        <div className="panel__head">
          <h2 id="recent-orders-h">Recent orders</h2>
          <Link className="see-all" to="/admin/orders">All orders <Icon name="arrowRight" size={15} /></Link>
        </div>
        {orders.length === 0 ? (
          <p className="panel__empty">No orders yet — place one from the storefront to see it here.</p>
        ) : (
          <ul className="recent-orders">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id}>
                <div>
                  <strong>{o.id}</strong>
                  <span>{o.customer?.name} · {o.area} · {fmtDate(o.placedAt)}</span>
                </div>
                <div className="recent-orders__right">
                  <span className={`status-pill status-pill--${o.status}`}>
                    {STATUS_META[o.status]?.label ?? o.status}
                  </span>
                  <strong>{formatCurrency(o.total)}</strong>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}