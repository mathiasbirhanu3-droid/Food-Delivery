// store factory shared by the cart, favorites and
// order-history stores.

import { useSyncExternalStore } from "react";

export function createStore(initialState, { persistKey } = {}) {
  let state = initialState;
  const listeners = new Set();

  function load() {
    if (!persistKey) return null;
    try {
      const raw = localStorage.getItem(persistKey);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  state = load() ?? state;

  function persist() {
    if (!persistKey) return;
    try { localStorage.setItem(persistKey, JSON.stringify(state)); } catch { /* private mode */ }
  }

  function getSnapshot() { return state; }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function setState(updater) {
    state = typeof updater === "function" ? updater(state) : updater;
    persist();
    listeners.forEach((l) => l());
  }

  function useStore() {
    return useSyncExternalStore(subscribe, getSnapshot);
  }

  return { useStore, setState, getSnapshot };
}