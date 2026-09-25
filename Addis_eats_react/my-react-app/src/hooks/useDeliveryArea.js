import { useEffect, useState } from "react";
import { DELIVERY_AREAS } from "../utils/deliveryEstimate";

const KEY = "addis.delivery-area";

// The chosen area is a lightweight preference saved to localStorage.
// Fee & ETA are always *derived* from it in utils/deliveryEstimate.js — never stored separately.
export function useDeliveryArea() {
  const [area, setArea] = useState(() => {
    try { return localStorage.getItem(KEY) ?? DELIVERY_AREAS[0].name; }
    catch { return DELIVERY_AREAS[0].name; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, area); } catch { /* private mode */ }
  }, [area]);

  return [area, setArea];
}