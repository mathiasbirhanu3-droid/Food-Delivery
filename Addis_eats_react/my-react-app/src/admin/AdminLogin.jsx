import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth";
import Button from "../ui/Button";
import Icon from "../ui/Icons";
import Field from "../checkout/Field";
import { toast } from "../ui/toast";

export default function AdminLogin() {
  const { admin, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  if (admin) return <Navigate to="/admin" replace />;

  function handleSubmit(e) {
    e.preventDefault();
    if (login(form.username, form.password)) {
      toast("Welcome back, Admin", "🔐");
      navigate(from ?? "/admin", { replace: true });
    } else {
      setError("Invalid username or password. Try the demo credentials below.");
    }
  }

  return (
    <main className="container page auth-page">
      <div className="form-card auth-card">
        <h1>Admin sign in</h1>
        {from && <p className="page-sub">Please sign in to open the admin area.</p>}
        <form onSubmit={handleSubmit} noValidate>
          <Field label="Username" htmlFor="admin-user">
            <input
              id="admin-user"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="admin"
              autoComplete="username"
            />
          </Field>
          <Field label="Password" htmlFor="admin-pass">
            <input
              id="admin-pass"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Field>
          {error && <p className="field__error" role="alert">{error}</p>}
          <Button type="submit" size="lg" className="w-full">
            Sign in to admin <Icon name="arrowRight" size={18} />
          </Button>
        </form>
        <div className="admin-hint">
          <strong>Demo credentials</strong>
          <p>Username: <code>admin</code> · Password: <code>addis123</code></p>
        </div>
      </div>
    </main>
  );
}