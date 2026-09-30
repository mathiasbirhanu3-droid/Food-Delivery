// Admin order store — every customer order, with the status lifecycle
// pending → preparing → delivering → delivered (features 11–15).
import { createStore } from "../utils/createStore";
import { deliveryFee, estimateDeliveryTime } from "../utils/deliveryEstimate";

export const ORDER_STATUSES = ["pending", "preparing", "delivering", "delivered"];

export const STATUS_META = {
  pending:    { label: "Pending",    color: "#e8b04d" },
  preparing:  { label: "Preparing",  color: "#4dabf7" },
  delivering: { label: "Delivering", color: "#9775fa" },
  delivered:  { label: "Delivered",  color: "#51cf66" },
};

const orderStore = createStore([], { persistKey: "addis.admin.orders" });

export function useAdminOrders() {
  return orderStore.useStore();
}

// Feature 12 — move an order through the lifecycle
export function setOrderStatus(id, status) {
  orderStore.setState((orders) => orders.map((o) => (o.id === id ? { ...o, status } : o)));
}

// Feature 13 — remove an order from the system
export function deleteOrder(id) {
  orderStore.setState((orders) => orders.filter((o) => o.id !== id));
}

// Called by the customer checkout so real orders appear in the admin queue
export function recordCustomerOrder(order) {
  orderStore.setState((orders) => [{ ...order }, ...orders]);
}

// Feature 16 — seed demo orders on first run (plus any orders the customer
// already placed in this browser), so the dashboard has data to show.
export function seedOrdersIfEmpty(dishes = []) {
  if (orderStore.getSnapshot().length > 0) return;

  let customerOrders = [];
  try {
    customerOrders = JSON.parse(localStorage.getItem("addis.orders")) ?? [];
  } catch { /* ignore */ }

  orderStore.setState([...customerOrders, ...buildDemoOrders(dishes)]);
}

const DEMO_CUSTOMERS = [
  { name: "Abebe Kebede",    phone: "0911234567", area: "Bole" },
  { name: "Tigist Haile",    phone: "0922345678", area: "Piassa" },
  { name: "Dawit Mengistu",  phone: "0933456789", area: "Kazanchis" },
  { name: "Hanna Girma",     phone: "0944567890", area: "Haya Hulet" },
  { name: "Yonas Tesfaye",   phone: "0955678901", area: "Merkato" },
  { name: "Selam Bekele",    phone: "0966789012", area: "Yeka" },
  { name: "Meron Alemu",     phone: "0977890123", area: "Saris" },
  { name: "Bereket Solomon", phone: "0988901234", area: "Bole" },
];

// Deterministic demo data — newest first (i = 0 is the most recent)
function buildDemoOrders(dishes) {
  if (dishes.length === 0) return [];

  return Array.from({ length: 14 }, (_, i) => {
    const customer = DEMO_CUSTOMERS[i % DEMO_CUSTOMERS.length];
    const lineCount = 1 + (i % 3); // 1–3 lines per order

    const items = [];
    let subtotal = 0;
    for (let j = 0; j < lineCount; j++) {
      const dish = dishes[(i * 3 + j * 5) % dishes.length];
      if (items.some((it) => it.id === dish.id)) continue;
      const qty = 1 + ((i + j) % 3);
      items.push({
        id: dish.id, name: dish.name, price: dish.price,
        image: dish.image, emoji: dish.emoji, category: dish.category, qty,
      });
      subtotal += dish.price * qty;
    }
    if (items.length === 0) {
      items.push({ ...dishes[0], qty: 1 });
      subtotal = dishes[0].price;
    }

    const fee = deliveryFee(customer.area);
    return {
      id: `AE-${7300 + i * 3}`,
      customer: { name: customer.name, phone: customer.phone },
      area: customer.area,
      eta: estimateDeliveryTime(customer.area),
      instructions: i % 4 === 0 ? "Extra berbere on the side, please." : "",
      items,
      subtotal,
      deliveryFee: fee,
      total: subtotal + fee,
      placedAt: new Date(Date.now() - i * 19 * 3600e3 - (i % 5) * 45 * 60e3).toISOString(),
      status: i < 3 ? "pending" : i < 6 ? "preparing" : i < 9 ? "delivering" : "delivered",
    };
  });
}