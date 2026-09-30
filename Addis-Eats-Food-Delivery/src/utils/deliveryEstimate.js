// delivery fee and estimated time are DERIVED from the
// selected area, never stored as state of their own.
export const DELIVERY_AREAS = [
  { name: "Bole",      fee: 45, minMinutes: 25, maxMinutes: 35 },
  { name: "Kazanchis", fee: 35, minMinutes: 30, maxMinutes: 40 },
  { name: "Piassa",    fee: 30, minMinutes: 30, maxMinutes: 45 },
  { name: "Haya Hulet",fee: 40, minMinutes: 30, maxMinutes: 45 },
  { name: "Merkato",   fee: 45, minMinutes: 35, maxMinutes: 50 },
  { name: "Saris",     fee: 50, minMinutes: 40, maxMinutes: 55 },
  { name: "Yeka",      fee: 45, minMinutes: 40, maxMinutes: 55 },
];

export function getArea(name) {
  return DELIVERY_AREAS.find((a) => a.name === name) ?? null;
}

export function deliveryFee(areaName) {
  return getArea(areaName)?.fee ?? 0;
}

export function estimateDeliveryTime(areaName) {
  const area = getArea(areaName);
  return area ? `${area.minMinutes}–${area.maxMinutes} min` : null;
}
