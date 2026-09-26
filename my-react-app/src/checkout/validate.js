//all checkout validation rules in one testable place.

export function isValidPhone(phone) {
  // Ethiopian mobile: +2519XXXXXXXX, 2519XXXXXXXX, 09XXXXXXXX or 9XXXXXXXX
  const cleaned = String(phone).replace(/[\s-]/g, "");
  return /^(?:\+?251|0)?9\d{8}$/.test(cleaned);
}

export function validateCheckout({ name, phone, area }) {
  const errors = {};

  if (!name?.trim()) errors.name = "Please tell us your name.";
  else if (name.trim().length < 2) errors.name = "That name looks too short.";

  if (!phone?.trim()) errors.phone = "We need a phone number to call you.";
  else if (!isValidPhone(phone)) errors.phone = "Enter a valid Ethiopian number, e.g. 0912345678.";

  if (!area) errors.area = "Please choose a delivery area.";

  return errors;
}