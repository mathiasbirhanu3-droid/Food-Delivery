import { useState } from "react";
import { CATEGORIES } from "../menu/CategoryBar";
import Field from "../checkout/Field";
import Button from "../ui/Button";

const EMOJIS = ["🍲", "🍗", "🥘", "🥩", "🍛", "🥗", "🍕", "🍔", "☕", "🍵", "🥭", "🥑"];

const EMPTY = {
  name: "", category: CATEGORIES[0], price: "", prepTime: "20",
  emoji: "🍲", image: "", description: "", ingredients: "",
  veg: false, spicy: false, popular: false,
  inStock: true,
};

export default function DishForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(() =>
    initial
      ? {
          ...EMPTY,
          ...initial,
          price: String(initial.price),
          prepTime: String(initial.prepTime ?? 20),
          ingredients: (initial.ingredients ?? []).join(", "),
        }
      : EMPTY
  );
  const [errors, setErrors] = useState({});

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (form.name.trim().length < 2) errs.name = "Give the dish a name (2+ characters).";
    const price = Number(form.price);
    if (!form.price || Number.isNaN(price) || price <= 0) errs.price = "Enter a price above 0 ETB.";
    const prep = Number(form.prepTime);
    if (!form.prepTime || Number.isNaN(prep) || prep < 1) errs.prepTime = "Prep time must be at least 1 minute.";
    if (form.description.trim().length < 10) errs.description = "Write a short description (10+ characters).";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      name: form.name.trim(),
      category: form.category,
      price,
      prepTime: prep,
      emoji: form.emoji || "🍽️",
      image: form.image.trim(),
      description: form.description.trim(),
      ingredients: form.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
      rating: initial?.rating ?? 4.5,
      veg: form.veg,
      spicy: form.spicy,
      popular: form.popular,
      inStock: form.inStock,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <Field label="Dish name" htmlFor="dish-name" error={errors.name}>
          <input id="dish-name" value={form.name} onChange={setField("name")} placeholder="e.g. Firfir" />
        </Field>

        <Field label="Category" htmlFor="dish-category">
          <select id="dish-category" value={form.category} onChange={setField("category")}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <div className="form-grid form-grid--2">
          <Field label="Price (ETB)" htmlFor="dish-price" error={errors.price}>
            <input id="dish-price" type="number" min="1" step="1" value={form.price} onChange={setField("price")} placeholder="350" />
          </Field>
          <Field label="Prep time (min)" htmlFor="dish-prep" error={errors.prepTime}>
            <input id="dish-prep" type="number" min="1" step="1" value={form.prepTime} onChange={setField("prepTime")} />
          </Field>
        </div>

        <Field label="Description" htmlFor="dish-desc" error={errors.description}>
          <textarea id="dish-desc" rows={3} value={form.description} onChange={setField("description")} placeholder="What makes this dish special?" />
        </Field>

        <Field label="Ingredients (comma separated)" htmlFor="dish-ingredients" hint="Shown on the dish detail page.">
          <input id="dish-ingredients" value={form.ingredients} onChange={setField("ingredients")} placeholder="Injera, Berbere, Chicken" />
        </Field>

        <Field label="Photo URL (optional)" htmlFor="dish-image" hint="Leave empty to show the emoji fallback.">
          <input id="dish-image" value={form.image} onChange={setField("image")} placeholder="https://…" />
        </Field>

        <Field label="Icon" htmlFor="dish-emoji">
          <input id="dish-emoji" className="input-emoji" maxLength={2} value={form.emoji} onChange={setField("emoji")} />
          <div className="emoji-pick" role="group" aria-label="Pick an icon">
            {EMOJIS.map((e) => (
              <button key={e} type="button" onClick={() => setForm((f) => ({ ...f, emoji: e }))} aria-label={`Use ${e}`}>
                {e}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="toggle-row" role="group" aria-label="Dish flags">
        <label className="toggle"><input type="checkbox" checked={form.inStock} onChange={setField("inStock")} /> In stock</label>
        <label className="toggle"><input type="checkbox" checked={form.veg} onChange={setField("veg")} /> Vegetarian</label>
        <label className="toggle"><input type="checkbox" checked={form.spicy} onChange={setField("spicy")} /> Spicy</label>
        <label className="toggle"><input type="checkbox" checked={form.popular} onChange={setField("popular")} /> Today's special</label>
      </div>

      <div className="form-actions">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initial ? "Save changes" : "Add dish"}</Button>
      </div>
    </form>
  );
}