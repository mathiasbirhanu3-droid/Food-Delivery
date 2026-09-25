import Button from "./Button";

export default function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <div className="state__icon" aria-hidden="true">⚠️</div>
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
  );
}