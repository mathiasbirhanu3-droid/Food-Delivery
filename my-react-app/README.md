Overview
Addis Eats is a complete food-delivery web application for Addis Ababa, built as a single React (Vite) app with two parts:

Customer storefront — browse, search and filter the menu, view dish details, manage a persistent cart, sign in, check out with a validated delivery form, save favorites and reorder past orders.
Admin extension — a nested, guarded /admin route group with dashboard analytics, full dish CRUD and complete order management (status flow, details, delete).
All data is seeded from public/dish.json (standing in for an API) into a shared, localStorage-persisted store, so every admin change is reflected on the storefront instantly and survives page refreshes.

Features

Customer-Facing Features (26)

1	Browse Menu (fetched & seeded from the JSON "API")	Menu, shared dishStore
2	Live Search (debounced, reflected in the URL)	Menu.jsx
3	Category Filter (URL-based, with live counts)	CategoryBar.jsx
4	Add to Cart (card quick-add + detail page)	DishCard, Dish
5	Update Quantity (+/− controls, 0 removes)	QtyStepper
6	Remove from Cart	Cart.jsx
7	Live ETB Total (recalculates instantly)	cartStore.js
8	Cart Persistence (context/store + localStorage)	cartStore.js
9	Checkout Form (name, phone, delivery area)	Checkout.jsx
10	Form Validation (Ethiopian phone format, etc.)	checkout/validate.js
11	Order Confirmation screen	OrderConfirmation.jsx
12	Loading States (skeleton-free spinners with labels)	Spinner
13	Empty States (cart, menu, favorites, orders)	EmptyState
14	Error Handling with retry	ErrorState, useDishes
15	Responsive Design (mobile-first, 1→2→3-column menu grid)	index.css
16	Order History	Orders.jsx
17	Favorites / Wishlist (heart on every dish card)	favorites/
18	Dish Detail View (ingredients, description, related)	Dish.jsx
19	One-Click Reorder	OrderHistoryItem.jsx
20	Delivery Fee Calculator (derived from area)	utils/deliveryEstimate.js
21	Estimated Delivery Time (derived from area)	utils/deliveryEstimate.js
22	Dark / Light Theme Toggle (persisted, no flash)	theme/
23	Special Instructions (order note)	Checkout.jsx
24	Cart Badge Count (derived — no separate state)	CartBadge.jsx
25	Keyboard Accessibility (skip link, focus rings, Escape-closing modals, aria)	cross-cutting
26	Formatted Currency (ETB) via one utility	utils/formatCurrency.js

Admin Features (17) — optional extension, built

1	Admin Login (username/password gate)	AdminLogin.jsx
2	Session Management (context + sessionStorage)	useAdminAuth.jsx
3	Dashboard Analytics (revenue, orders, avg order value)	Dashboard.jsx
4	Top Selling Dishes (aggregated bar chart)	Dashboard.jsx
5	Order Status Distribution (colored bar chart)	Dashboard.jsx
6	View All Dishes (searchable table)	DishManager.jsx
7	Add New Dish (validated modal form + emoji picker)	DishForm.jsx
8	Edit Dish (partial-safe updates, immutable id)	DishForm.jsx
9	Delete Dish (confirmation modal)	DishManager.jsx
10	Search Dishes	DishManager.jsx
11	View All Orders	OrderManager.jsx
12	Update Order Status (pending → preparing → delivering → delivered)	OrderManager.jsx
13	Delete Order (with confirmation)	OrderManager.jsx
14	Order Details View (customer, items, totals)	OrderManager.jsx
15	Data Persistence (dishes + orders → localStorage)	dishStore.js, adminOrderStore.js
16	Data Seeding from JSON on first run	dishStore.js, RequireAdmin.jsx
17	Logout (ends session → /admin/login)	AdminLayout.jsx

Getting Started:- 
Prerequisites
Node.js ≥ 18
npm (bundled with Node)
Install & Run
#1. Clone / download the projectcd addis-eats #2. Install dependenciesnpm install #3. Start the dev servernpm run dev
Open http://localhost:5173 

Design System
Mobile-first CSS with custom-property tokens in index.css (:root / [data-theme="dark"]).
Menu grid: 1 column → 2 → exactly 3 on desktop (project requirement).
System: Inter (body) + Fraunces (display), Ethiopian-inspired amber/terracotta palette.
Dark/light themes persist and are applied pre-paint (no flash).
Components: buttons, chips, cards, badges, tables, modals (pinned header/footer + scrollable body, bottom-sheet on mobile), toasts, skeletons-free spinners.

Accessibility
Skip-to-content link · visible :focus-visible rings everywhere · semantic landmarks & labelled navs · aria-labels on icon-only buttons · aria-pressed favorites · aria-live totals, counts & toasts · labels + inline role="alert" errors on forms · Escape closes modals/drawers · full keyboard operability.

Manual Test Script
Menu — search "doro" (debounced), filter Pizza, refresh → filter persists (URL).
Cart — add items, adjust +/− to 0 (removes), refresh → cart survives.
Checkout — submit empty → inline errors; enter 0912345678 → sign-in required first (guard returns you to checkout).
Orders — Reorder a past order → cart refills.
Favorites — heart a dish → appears in /favorites.
Theme — toggle → persists across refresh.
Admin — /admin/login → admin / addis123 → dashboard stats; add/edit/delete a dish → storefront updates instantly; advance an order's status; refresh → everything persisted.

Author
Mathais Birhanu