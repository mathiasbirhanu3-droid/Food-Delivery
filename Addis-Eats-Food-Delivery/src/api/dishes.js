// Customer-facing data layer. The admin manages the live menu through the
// shared dish store, so getDishes() reads from it (seeding from dish.json on
// first run) instead of hitting the static file on every visit.
import { useEffect, useState } from "react";
import { seedDishes, getDishesSnapshot, useDishesSync } from "./dishStore";

export async function getDishes() {
  await seedDishes();
  return getDishesSnapshot();
}

// Live hook — any component using this re-renders the moment the admin
// adds, edits or deletes a dish. No refresh needed.
export function useDishes() {
  const dishes = useDishesSync();
  const [state, setState] = useState(() =>
    getDishesSnapshot().length > 0
      ? { status: "success", error: null }
      : { status: "loading", error: null }
  );

  useEffect(() => {
    let alive = true;
    if (getDishesSnapshot().length > 0) return;
    seedDishes()
      .then(() => alive && setState({ status: "success", error: null }))
      .catch((error) => alive && setState({ status: "error", error }));
    return () => { alive = false; };
  }, []);

  function retry() {
    setState({ status: "loading", error: null });
    seedDishes()
      .then(() => setState({ status: "success", error: null }))
      .catch((error) => setState({ status: "error", error }));
  }

  return { dishes, ...state, retry };
}