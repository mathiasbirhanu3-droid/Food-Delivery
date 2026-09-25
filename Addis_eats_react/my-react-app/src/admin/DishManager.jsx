import { useState } from "react";
import { useAdminDishes, addDish, updateDish, deleteDish, setDishStock } from "./adminDishStore";
import { useDishes } from "../api/dishes";
import DishPhoto from "../menu/DishPhoto";
import DishForm from "./DishForm";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";
import Icon from "../ui/Icons";
import { formatCurrency } from "../utils/formatCurrency";
import { toast } from "../ui/toast";

export default function DishManager() {
  /* ── 1. ALL HOOKS — always before any return ─────────────────── */
  const dishes = useAdminDishes();
  const { status } = useDishes();
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState(null);   // null | { dish: null (add) | dish (edit) }
  const [deleting, setDeleting] = useState(null);

  const q = query.trim().toLowerCase();
  const filtered = dishes.filter(
    (d) => !q || d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
  );
  const hiddenCount = dishes.filter((d) => d.inStock === false).length;

  /* ── 2. RETURN 1 — LOADING (early return, skeleton) ──────────── */
  if (status === "loading") {
    return (
      <>
        <div className="admin-page-head">
          <div>
            <h1>Menu manager</h1>
            <p className="page-sub">Loading the menu…</p>
          </div>
          <Button disabled><Icon name="plus" size={16} /> Add dish</Button>
        </div>
        <TableSkeleton rows={6} />
      </>
    );
  }

  /* ── 3. RETURN 2 — MAIN SCREEN (always last) ─────────────────── */
  function handleSubmit(data) {
    if (editor?.dish) {
      updateDish(editor.dish.id, data);          // feature 8
      toast(`${data.name} updated`, "✏️");
    } else {
      addDish(data);                             // feature 7
      toast(`${data.name} added to the menu`, "✅");
    }
    setEditor(null);
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Menu manager</h1>
          <p className="page-sub">
            {dishes.length} dishes · {hiddenCount} hidden from customers · changes appear on the storefront instantly.
          </p>
        </div>
        <Button onClick={() => setEditor({ dish: null })}><Icon name="plus" size={16} /> Add dish</Button>
      </div>

      <div className="search-box admin-search">
        <Icon name="search" size={18} className="search-box__icon" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or category…"
          aria-label="Search dishes"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="state state--empty">
          <div className="state__icon"><Icon name="search" size={30} /></div>
          <h2>{dishes.length === 0 ? "No dishes yet" : "No dishes match"}</h2>
          <p>{dishes.length === 0 ? "Add your first dish to start the menu." : `Nothing matches “${query}”.`}</p>
          {dishes.length === 0 && (
            <Button onClick={() => setEditor({ dish: null })}><Icon name="plus" size={16} /> Add dish</Button>
          )}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Dish</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col">Prep</th>
                <th scope="col">Stock</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dish) => (
                <tr key={dish.id}>
                  <td>
                    <div className="dish-cell">
                      <div className="dish-thumb"><DishPhoto dish={dish} /></div>
                      <div>
                        <strong>{dish.name}</strong>{" "}
                        {dish.veg && <Icon name="leaf" size={13} className="tag-veg" />}
                        {dish.spicy && <Icon name="flame" size={13} className="tag-spicy" />}
                      </div>
                    </div>
                  </td>
                  <td>{dish.category}</td>
                  <td>{formatCurrency(dish.price)}</td>
                  <td>{dish.prepTime} min</td>
                  <td>
                    <button
                      type="button"
                      className={`stock-toggle${dish.inStock === false ? " stock-toggle--off" : ""}`}
                      onClick={() => {
                        const next = dish.inStock === false;
                        setDishStock(dish.id, next);
                        toast(
                          next ? `${dish.name} is visible again` : `${dish.name} hidden from the menu`,
                          next ? "👁️" : "🙈"
                        );
                      }}
                      aria-label={
                        dish.inStock === false
                          ? `Show ${dish.name} to customers`
                          : `Hide ${dish.name} from customers`
                      }
                    >
                      {dish.inStock === false ? "Hidden" : "In stock"}
                    </button>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="icon-btn"
                        onClick={() => setEditor({ dish })}
                        aria-label={`Edit ${dish.name}`}
                      >
                        <Icon name="edit" size={16} />
                      </button>
                      <button
                        className="icon-btn icon-btn--danger"
                        onClick={() => setDeleting(dish)}
                        aria-label={`Delete ${dish.name}`}
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Features 7 & 8 — add / edit dish modal */}
      <Modal
        open={!!editor}
        onClose={() => setEditor(null)}
        title={editor?.dish ? `Edit ${editor.dish.name}` : "Add a new dish"}
        wide
      >
        {editor && (
          <DishForm
            initial={editor.dish}
            onSubmit={handleSubmit}
            onCancel={() => setEditor(null)}
          />
        )}
      </Modal>

      {/* Feature 9 — delete with confirmation */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete this dish?"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button
              size="sm"
              onClick={() => {
                deleteDish(deleting.id);
                toast(`${deleting.name} deleted`, "🗑️");
                setDeleting(null);
              }}
            >
              Delete dish
            </Button>
          </>
        }
      >
        {deleting && (
          <><strong>{deleting.name}</strong> will be removed from the menu. This can't be undone.</>
        )}
      </Modal>
    </>
  );
}

/* Skeleton that mirrors the admin table's exact structure */
function TableSkeleton({ rows = 5 }) {
  return (
    <div className="table-wrap">
      <p className="sr-only" role="status">Loading dishes…</p>
      <table className="admin-table" aria-hidden="true">
        <thead>
          <tr><th>Dish</th><th>Category</th><th>Price</th><th>Prep</th><th>Stock</th><th /></tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, i) => (
            <tr key={i}>
              <td>
                <div className="dish-cell">
                  <Skeleton className="skeleton-thumb" />
                  <Skeleton style={{ width: "130px", height: ".9rem" }} />
                </div>
              </td>
              <td><Skeleton style={{ width: "90px", height: ".85rem" }} /></td>
              <td><Skeleton style={{ width: "70px", height: ".85rem" }} /></td>
              <td><Skeleton style={{ width: "55px", height: ".85rem" }} /></td>
              <td><Skeleton className="skeleton-btn" /></td>
              <td>
                <div className="row-actions">
                  <Skeleton className="skeleton-btn" />
                  <Skeleton className="skeleton-btn" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}