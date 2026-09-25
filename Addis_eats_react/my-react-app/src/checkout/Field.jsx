export default function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div className={`field${error ? " field--invalid" : ""}`}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && !error && <p className="field__hint">{hint}</p>}
      {error && <p className="field__error" role="alert">{error}</p>}
    </div>
  );
}