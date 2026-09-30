import Icon from "./Icons";

export default function EmptyState({ icon = "search", title, message, action }) {
  return (
    <div className="state state--empty">
      <div className="state__icon"><Icon name={icon} size={32} /></div>
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}