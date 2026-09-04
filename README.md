# VASTAAR

A responsive Nepali fashion storefront rebuilt from the provided reference design.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite frontend proxies `/api` to the Express API on port 3000.

For a production-style check:

```bash
npm run build
npm start
```

The API persists orders, newsletter subscribers, and marketplace foundation collections in `server/data.json`. Configure `PORT` or `VITE_API_URL` through `.env` when needed.

## Phase 2.1 marketplace foundation

The backend now reserves migration-friendly collections for `sellers`, `stores`, `products`, and `inventory`. Existing customer products remain compatible and seller/store collections start empty until seller registration is implemented.

Read-only foundation endpoints:

```text
GET /api/sellers
GET /api/sellers/:id
GET /api/sellers/:id/products
GET /api/stores
GET /api/stores/:id
GET /api/stores/:id/products
```

Seller registration, authentication, inventory mutations, and seller dashboards are intentionally deferred to later Phase 2 sub-phases.

## Phase 2.2 seller registration

Seller registration is available through the existing VASTAAR footer action and the following API:

```text
POST /api/sellers
```

The request accepts nested `seller` and `store` objects, creates linked records with `pending` status, and rejects duplicate seller emails with HTTP `409`.
