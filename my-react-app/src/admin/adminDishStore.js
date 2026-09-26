// Admin dish CRUD (features 6–10 + stock hide). The admin edits the SHARED
// dish store (src/api/dishStore.js) — the same one the storefront reads —
// so every change is visible to customers immediately and persists.
import {
  seedDishes,
  useDishesSync,
  addDishData,
  updateDishData,
  deleteDishData,
  setDishStock as setDishStockData,
} from "../api/dishStore";

export function useAdminDishes() {
  return useDishesSync();
}

export const addDish = addDishData;          // feature 7
export const updateDish = updateDishData;    // feature 8
export const deleteDish = deleteDishData;    // feature 9
export const setDishStock = setDishStockData; // hide/show toggle

// Non-throwing wrapper: RequireAdmin just needs "dishes or []"
export function seedDishesIfEmpty() {
  return seedDishes().catch(() => []);
}