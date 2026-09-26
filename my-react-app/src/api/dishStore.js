// The single source of truth for dishes, shared by the storefront and the
// admin area. Admin CRUD writes here, customer screens subscribe here — so
// every admin change appears on the user side instantly and survives a
// refresh (localStorage). Seeded once from public/dish.json on first run.
import { createStore } from "../utils/createStore";

const DISHES_URL = "/dish.json";
const NETWORK_DELAY = 450; // ms — keeps loading states visible, like a real API

const dishStore = createStore([], { persistKey: "addis.dishes" });

export const useDishesSync = dishStore.useStore;      // live subscription hook
export const getDishesSnapshot = dishStore.getSnapshot;

/* ------------------------------------------------------------------ */
/* Category normalization                                              */
/* ------------------------------------------------------------------ */
const CANONICAL_CATEGORIES = ["Ethiopian", "Pizza", "Burgers", "Drinks"];

export function fixCategory(raw) {
  const c = String(raw ?? "").trim();
  return (
    CANONICAL_CATEGORIES.find((k) => k.toLowerCase() === c.toLowerCase()) ?? c
  );
}

/* ------------------------------------------------------------------ */
/* Normalization — fills safe defaults for every field the UI renders  */
/* ------------------------------------------------------------------ */
function normalizeDish(data, existing = {}) {
  return {
    ...existing,                                   // keep fields not being changed
    ...data,                                       // apply the incoming fields
    id: existing.id ?? data.id,                    // resolved explicitly by callers
    name: String(data.name ?? existing.name ?? "").trim(),
    category: fixCategory(data.category ?? existing.category),
    price: Number(data.price ?? existing.price ?? 0),
    prepTime: Number(data.prepTime ?? existing.prepTime ?? 20),
    emoji: data.emoji || existing.emoji || "🍽️",
    image: String(data.image ?? existing.image ?? "").trim(),
    description: String(data.description ?? existing.description ?? "").trim(),
    ingredients: Array.isArray(data.ingredients)
      ? data.ingredients
      : String(data.ingredients ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
    veg: Boolean(data.veg ?? existing.veg ?? false),
    spicy: Boolean(data.spicy ?? existing.spicy ?? false),
    popular: Boolean(data.popular ?? existing.popular ?? false),
    inStock: data.inStock ?? existing.inStock ?? true, // visible by default
    rating: Number(data.rating ?? existing.rating ?? 4.5),
  };
}

/* ------------------------------------------------------------------ */
/* Mutators — called by the admin feature folder (adminDishStore.js)   */
/* ------------------------------------------------------------------ */

// CREATE — "Add dish" (admin feature 7)
export function addDishData(data) {
  const dish = normalizeDish(data);
  dish.id = data.id ?? Date.now();
  dishStore.setState((dishes) => [...dishes, dish]);
  return dish;
}

// UPDATE — "Edit dish" (admin feature 8). Partial-safe merge, immutable id.
export function updateDishData(id, data) {
  let updated = null;
  dishStore.setState((dishes) =>
    dishes.map((d) => {
      if (String(d.id) !== String(id)) return d;
      updated = normalizeDish(data, d);
      updated.id = d.id;
      return updated;
    })
  );
  return updated;
}

// STOCK TOGGLE — hide/show a dish from the customer menu in one click.
// A separate single-field mutator used directly from the admin table row.
export function setDishStock(id, inStock) {
  let updated = null;
  dishStore.setState((dishes) =>
    dishes.map((d) => {
      if (String(d.id) !== String(id)) return d;
      updated = { ...d, inStock };
      return updated;
    })
  );
  return updated;
}

// DELETE — "Delete dish" (admin feature 9)
export function deleteDishData(id) {
  dishStore.setState((dishes) => dishes.filter((d) => String(d.id) !== String(id)));
}

/* ------------------------------------------------------------------ */
/* Seeding — public/dish.json → store, once, on first run              */
/* ------------------------------------------------------------------ */
async function fetchSeed() {
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY));
  const res = await fetch(`${DISHES_URL}?t=${Date.now()}`);
  if (!res.ok) throw new Error(`Could not load the menu (HTTP ${res.status})`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Menu data was malformed.");
  return data.map((d) => ({
    ...d,
    category: fixCategory(d.category),
    inStock: d.inStock ?? true,
  }));
}

let seeding = null;

export function seedDishes() {
  if (getDishesSnapshot().length > 0) return Promise.resolve(getDishesSnapshot());
  if (!seeding) {
    seeding = (async () => {
      // One-time migration from the old admin-only key
      try {
        const old = JSON.parse(localStorage.getItem("addis.admin.dishes"));
        if (Array.isArray(old) && old.length > 0) {
          dishStore.setState(old);
          return old;
        }
      } catch { /* ignore */ }
      const dishes = await fetchSeed();
      if (getDishesSnapshot().length === 0) dishStore.setState(dishes);
      return getDishesSnapshot();
    })().catch((error) => {
      seeding = null; // allow a later retry
      throw error;
    });
  }
  return seeding;
}

// Dev helper — wipe the local copy and re-seed from dish.json
export function reseedFromDishJson() {
  dishStore.setState([]);
  seeding = null;
  return seedDishes();
}