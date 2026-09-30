//every price in the app is formatted through this one function.
export function formatCurrency(amount) {
  return `ETB ${Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}