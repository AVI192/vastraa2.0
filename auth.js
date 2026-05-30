/* ======================================================
   VASTAAR – Auth & API (MongoDB backend)
   Run: cd backend && npm install && npm start
   Open: http://localhost:3000
====================================================== */

const ADMIN_EMAIL = 'admin@vastaar.com';
const GUEST_CART_KEY = 'vastaar_guest_cart';

function getApiBase() {
  if (window.location.port === '3000') return '/api';
  return 'http://localhost:3000/api';
}

const API_BASE = getApiBase();

let currentUser = null;
let authToastTimer = null;
let apiOnline = false;

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = { message: 'Server error' };
  }

  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    apiOnline = res.ok;
    return res.ok;
  } catch {
    apiOnline = false;
    return false;
  }
}

function showServerBanner() {
  if (document.getElementById('serverBanner')) return;
  const bar = document.createElement('div');
  bar.id = 'serverBanner';
  bar.className = 'server-banner';
  bar.innerHTML = `
    ⚠️ Server not running — seller products &amp; cart need MongoDB.
    Run <code>cd backend && npm start</code> then open
    <a href="http://localhost:3000">http://localhost:3000</a>
  `;
  document.body.prepend(bar);
}

async function loadCurrentUser() {
  try {
    const data = await api('/auth/me');
    currentUser = data.user || null;
  } catch {
    currentUser = null;
  }
  updateAuthHeader();
  return currentUser;
}

function getCurrentUser() {
  return currentUser;
}

function isLoggedIn() {
  return !!currentUser;
}

async function register(data) {
  const res = await api('/auth/register', {
    method: 'POST',
    body: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
    },
  });
  currentUser = res.user;
  updateAuthHeader();
  return { ok: true, user: res.user };
}

async function login(email, password) {
  try {
    const res = await api('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    currentUser = res.user;
    updateAuthHeader();
    return { ok: true, user: res.user };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}

async function clearSession() {
  try {
    await api('/auth/logout', { method: 'POST' });
  } catch {
    /* ignore */
  }
  currentUser = null;
}

async function logout() {
  await clearSession();
  window.location.href = 'index.html';
}

async function updateUser(updates) {
  const body = {};
  if (updates.name) body.name = updates.name;
  if (updates.phone !== undefined) body.phone = updates.phone;
  if (updates.password) body.password = updates.password;

  try {
    const res = await api('/auth/profile', { method: 'PATCH', body });
    currentUser = res.user;
    return { ok: true, user: res.user };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}

async function registerSeller(sellerData) {
  try {
    const res = await api('/auth/seller/register', { method: 'POST', body: sellerData });
    currentUser = res.user;
    return { ok: true, user: res.user };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}

function isAdmin(user) {
  return user && (user.role === 'admin' || user.email === ADMIN_EMAIL);
}

async function ensureAdminAccount() {
  await checkApiHealth();
}

async function getPendingSellers() {
  const res = await api('/admin/sellers/pending');
  return res.sellers;
}

async function getApprovedSellers() {
  const res = await api('/admin/sellers/approved');
  return res.sellers;
}

async function approveSeller(email) {
  try {
    await api(`/admin/sellers/${encodeURIComponent(email)}/approve`, { method: 'POST' });
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}

async function rejectSeller(email) {
  try {
    await api(`/admin/sellers/${encodeURIComponent(email)}/reject`, { method: 'POST' });
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}

function isApprovedSeller(user) {
  return user?.isSeller && user.seller?.status === 'approved';
}

function hasValidImage(url) {
  return typeof url === 'string' && url.length > 50 && (url.startsWith('data:image') || url.startsWith('http'));
}

function hasValidVideo(url) {
  return typeof url === 'string' && url.length > 50 && (url.startsWith('data:video') || url.startsWith('http'));
}

function compressImageFile(file, maxWidth = 720, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Not an image'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxWidth) {
          h = Math.round((h * maxWidth) / w);
          w = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

function getLocalFallbackProducts() {
  try {
    const items = JSON.parse(localStorage.getItem('vastaar_store_items') || '[]');
    const users = JSON.parse(localStorage.getItem('vastaar_users') || '[]');
    const approved = new Set(
      users.filter((u) => u.isSeller && u.seller?.status === 'approved').map((u) => u.email)
    );
    return items.filter((i) => approved.has(i.sellerEmail));
  } catch {
    return [];
  }
}

async function fetchStoreProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    const data = await res.json();
    if (res.ok) {
      const apiProducts = data.products || [];
      if (apiProducts.length > 0) return apiProducts;
      const fallback = getLocalFallbackProducts();
      if (fallback.length > 0) return fallback;
      return [];
    }
  } catch {
    /* server offline */
  }
  return getLocalFallbackProducts();
}

async function fetchSellerProducts() {
  const res = await api('/products/mine');
  return res.products || [];
}

async function addStoreItem(item) {
  try {
    const res = await api('/products', {
      method: 'POST',
      body: {
        name: item.name,
        brand: item.brand,
        price: item.price,
        priceWas: item.priceWas,
        emoji: item.emoji,
        imageUrl: item.imageUrl,
        videoUrl: item.videoUrl,
        isReel: item.isReel,
        badge: item.badge,
        badgeText: item.badgeText,
        category: item.category,
      },
    });
    return { ok: true, item: res.item };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}

async function getApprovedStoreItems() {
  return fetchStoreProducts();
}

async function getSellerItems() {
  if (!isLoggedIn()) return [];
  try {
    return await fetchSellerProducts();
  } catch {
    return [];
  }
}

async function deleteStoreItem(id) {
  try {
    await api(`/products/${id}`, { method: 'DELETE' });
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}

function getGuestCart() {
  try {
    return JSON.parse(sessionStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveGuestCart(items) {
  sessionStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

async function getCartItems() {
  if (isLoggedIn()) {
    try {
      const res = await api('/cart');
      return res.items || [];
    } catch {
      return getGuestCart();
    }
  }
  return getGuestCart();
}

async function getCartCount() {
  const items = await getCartItems();
  return items.reduce((sum, line) => sum + (line.qty || 1), 0);
}

async function addToCartStorage(product) {
  const line = {
    key: product.id || product.name,
    productId: product.id || '',
    name: product.name,
    brand: product.brand || '',
    price: Number(product.price) || 0,
    priceLabel: product.priceLabel || `Rs. ${Number(product.price).toLocaleString()}`,
    emoji: product.emoji || '',
    imageUrl: product.imageUrl || '',
    qty: 1,
  };

  if (isLoggedIn()) {
    try {
      const res = await api('/cart/add', {
        method: 'POST',
        body: {
          id: line.productId,
          name: line.name,
          brand: line.brand,
          price: line.price,
          priceLabel: line.priceLabel,
          emoji: line.emoji,
          imageUrl: line.imageUrl,
        },
      });
      return res.count;
    } catch {
      /* fall through to guest cart */
    }
  }

  const cart = getGuestCart();
  const existing = cart.find((c) => c.key === line.key);
  if (existing) existing.qty = (existing.qty || 1) + 1;
  else cart.push(line);
  saveGuestCart(cart);
  return cart.reduce((sum, c) => sum + (c.qty || 1), 0);
}

async function removeFromCart(key) {
  if (isLoggedIn()) {
    try {
      await api('/cart/remove', { method: 'POST', body: { key } });
      return await getCartCount();
    } catch {
      /* guest fallback */
    }
  }
  const cart = getGuestCart().filter((c) => c.key !== key);
  saveGuestCart(cart);
  return cart.reduce((sum, c) => sum + (c.qty || 1), 0);
}

async function requireAuth(redirectTo = 'login.html') {
  await loadCurrentUser();
  if (!isLoggedIn()) {
    const next = encodeURIComponent(window.location.pathname.split('/').pop() || 'profile.html');
    window.location.href = `${redirectTo}?next=${next}`;
    return false;
  }
  return true;
}

function updateAuthHeader() {
  const profileBtn = document.getElementById('profileBtn');
  if (!profileBtn) return;

  const user = getCurrentUser();
  const label = profileBtn.querySelector('span');

  if (user) {
    profileBtn.href = 'profile.html';
    if (label) label.textContent = user.name.split(' ')[0];
    profileBtn.title = `Hi, ${user.name}`;
  } else {
    profileBtn.href = 'login.html';
    if (label) label.textContent = 'Login';
    profileBtn.title = 'Login or sign up';
  }
}

function showAuthToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.toggle('toast-error', isError);
  toast.classList.add('show');
  clearTimeout(authToastTimer);
  authToastTimer = setTimeout(() => {
    toast.classList.remove('show', 'toast-error');
  }, 2800);
}

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-NP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const online = await checkApiHealth();
  if (!online) showServerBanner();
  await loadCurrentUser();
});
