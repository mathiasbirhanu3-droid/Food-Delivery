// Cart store — the single source of truth for the order.
// Read by Menu, Dish, Cart and Checkout; persisted to localStorage (feature 8).
// Cart badge count is DERIVED here — it has no state of its own (feature 24).

import { createStore } from "../utils/createStore";

const store = createStore([], { persistKey: "addis.cart" });

export function useCart() {
  const items = store.useStore();
  return {
    items,
    count: items.reduce((n, i) => n + i.qty, 0),                        // feature 24
    subtotal: items.reduce((sum, i) => sum + i.price * i.qty, 0),       // feature 7 (live ETB total)
  };
}

export function addToCart(dish, qty = 1) {
  store.setState((items) => {
    const existing = items.find((i) => i.id === dish.id);
    if (existing) {
      return items.map((i) => (i.id === dish.id ? { ...i, qty: Math.min(i.qty + qty, 99) } : i));
    }
    return [...items, {
      id: dish.id, name: dish.name, price: dish.price,
      image: dish.image, emoji: dish.emoji, category: dish.category, qty,
    }];
  });
}

export function updateQty(id, qty) {
  // Dropping to 0 removes the line (feature 6)
  store.setState((items) =>
    qty <= 0
      ? items.filter((i) => i.id !== id)
      : items.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 99) } : i))
  );
}

export function removeFromCart(id) {
  store.setState((items) => items.filter((i) => i.id !== id)); // feature 6
}

export function clearCart() {
  store.setState([]);
}