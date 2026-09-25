import { useEffect, useState } from "react";

// Lightweight toast notifications (e.g. "Added to cart"), no state library needed.
export function toast(message, icon = "✅") {
  window.dispatchEvent(new CustomEvent("addis:toast", { detail: { message, icon } }));
}

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function onToast(e) {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, ...e.detail }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
    }
    window.addEventListener("addis:toast", onToast);
    return () => window.removeEventListener("addis:toast", onToast);
  }, []);

  return (
    <div className="toaster" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <span aria-hidden="true">{t.icon}</span> {t.message}
        </div>
      ))}
    </div>
  );
}