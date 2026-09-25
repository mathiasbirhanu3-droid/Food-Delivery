import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Button from "../ui/Button";
import Icon from "../ui/Icons";
import Field from "../checkout/Field";
import { isValidPhone } from "../checkout/validate";
import { toast } from "../ui/toast";

export default function Login() {
  const { user, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  if (user) {
    return (
      <main className="container page auth-page">
        <div className="form-card auth-card">
          <div className="state__icon" aria-hidden="true">👋</div>
          <h1>You're signed in</h1>
          <p className="page-sub">Signed in as <strong>{user.name}</strong>.</p>
          <div className="auth-actions">
            <Button onClick={() => { signOut(); toast("Signed out", "👋"); }}>Sign out</Button>
            <Button variant="outline" onClick={() => navigate(from ?? "/")}>Continue</Button>
          </div>
        </div>
      </main>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (name.trim().length < 2) errs.name = "Please tell us your name.";
    if (!isValidPhone(phone)) errs.phone = "Enter a valid Ethiopian number, e.g. 0912345678.";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      signIn(name.trim());
      toast(`Welcome, ${name.trim().split(" ")[0]}!`, "👋");
      navigate(from ?? "/", { replace: true });
    }
  }

  return (
    <main className="container page auth-page">
      <div className="form-card auth-card">
        <h1>Sign in</h1>
        {from && <p className="page-sub">Please sign in to complete your order.</p>}
        <form onSubmit={handleSubmit} noValidate>
          <Field label="Full name" htmlFor="login-name" error={errors.name}>
            <input id="login-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Abebe Kebede" autoComplete="name" />
          </Field>
          <Field
            label="Phone number"
            htmlFor="login-phone"
            error={errors.phone}
            hint="Demo sign-in — no password needed."
          >
            <input id="login-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0912345678" autoComplete="tel" />
          </Field>
          <Button type="submit" size="lg" className="w-full">Sign in <Icon name="arrowRight" size={18} /></Button>
        </form>
      </div>
    </main>
  );
}  