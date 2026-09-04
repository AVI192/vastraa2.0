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

The API persists orders and newsletter subscribers in `server/data.json`. Configure `PORT` or `VITE_API_URL` through `.env` when needed.
