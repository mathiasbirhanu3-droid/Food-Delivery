// Favorites store — dish ids persisted to localStorage.
import { createStore } from "../utils/createStore";

const store = createStore([], { persistKey: "addis.favorites" });

export function useFavorites() {
  const ids = store.useStore();
  return { ids, has: (id) => ids.includes(id) };
}

export function toggleFavorite(id) {
  store.setState((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
}