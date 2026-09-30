import Icon from "./Icons";

export default function QtyStepper({ value, onChange, min = 1, max = 99, small = false }) {
  return (
    <div className={`qty${small ? " qty--sm" : ""}`} role="group" aria-label="Quantity">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Icon name="minus" size={14} />
      </button>
      <span className="qty__value" aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}