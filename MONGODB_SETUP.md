# VASTAAR + MongoDB Setup

The site no longer uses **localStorage** for users, sellers, or products. Everything goes through **Node.js + MongoDB**.

## 1. Install MongoDB

**Option A – Local**

- Install [MongoDB Community](https://www.mongodb.com/try/download/community)
- Start the service, then use:  
  `MONGODB_URI=mongodb://127.0.0.1:27017/vastaar`

**Option B – MongoDB Atlas (cloud, free tier)**

1. Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Database Access → create a user
3. Network Access → allow your IP (or `0.0.0.0/0` for testing)
4. Connect → copy connection string, e.g.  
   `mongodb+srv://USER:PASSWORD@cluster.mongodb.net/vastaar`

## 2. Backend setup

```bash
cd backend
copy .env.example .env
```

Edit `backend/.env`:

```env
MONGODB_URI=your_connection_string_here
JWT_SECRET=any-long-random-string-here
PORT=3000
ADMIN_EMAIL=admin@vastaar.com
ADMIN_PASSWORD=admin123
```

Install and run:

```bash
npm install
npm start
```

You should see:

```
MongoDB connected
Admin ready: admin@vastaar.com
VASTAAR running at http://localhost:3000
```

## 3. Open the website

Use **only**:

**http://localhost:3000**

Do **not** open `index.html` as `file://` — login and products will not work.

## 4. Accounts

| Role | Where | Credentials |
|------|--------|-------------|
| Admin | `http://localhost:3000/admin.html` | `admin@vastaar.com` / `admin123` |
| Customer | Register on `login.html` | Your email + password |
| Seller | Settings → Register as Seller → admin approves → `seller-dashboard.html` | Same login |

## 5. What is stored in MongoDB

| Collection | Contents |
|------------|----------|
| `users` | Accounts, seller applications, hashed passwords |
| `products` | Seller listings (photos/videos as base64 strings) |
| `carts` | Bag items per logged-in user |

Login uses an **httpOnly cookie** (not localStorage).

## 6. Troubleshooting

- **“Start the server” toast** → run `npm start` in `backend/`
- **MongoDB connection error** → check `MONGODB_URI` in `.env`
- **Seller products not showing** → approve seller in admin, then refresh shop page
- **Cart only saves when logged in** → guest adds work until refresh; log in to persist bag in MongoDB
