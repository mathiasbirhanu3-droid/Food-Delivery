// Order history store — appended after every successful checkout, read by
// OrderHistory; each record powers the one-click Reorder action (feature 19).
import { createStore } from "../utils/createStore";
import { recordCustomerOrder } from "../admin/adminOrderStore";

const store = createStore([], { persistKey: "addis.orders" });

export function useOrders() {
  return store.useStore(); // newest first
}

export function placeOrder(order) {
  const record = {
    ...order,
    id: `AE-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 9 + 1)}`,
    placedAt: new Date().toISOString(),
    status: "pending",
  };
  store.setState((orders) => [record, ...orders]);
  recordCustomerOrder(record); // mirror into the admin order queue
  return record;
}