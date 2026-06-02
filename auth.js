/* ======================================================
   VASTRAA – Auth & API (MongoDB backend)
   Run: cd backend && npm install && npm start
   Open: http://localhost:3000
====================================================== */

const ADMIN_EMAIL = 'admin@vastraa.com';
const ADMIN_PASSWORD = 'admin123';
const GUEST_CART_KEY = 'vastraa_guest_cart';
const LOCAL_USER_KEY = 'vastraa_users';
const LOCAL_SESSION_KEY = 'vastraa_user_session';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isAdminEmail(email) {
  return normalizeEmail(email) === ADMIN_EMAIL.toLowerCase();
}

function createAdminUser() {
  return {
    id: 'admin',
    name: 'Administrator',
    email: ADMIN_EMAIL,
    role: 'admin',
    isSeller: false,
  };
}

function getApiBase() {
  if (window.location.port === '3000') return '/api';
  return 'http://localhost:3000/api';
}

const API_BASE = getApiBase();

let currentUser = null;
let authToastTimer = null;
let apiOnline = false;

async function api(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    apiOnline = false;
    throw new Error('Server offline');
  }

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

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USER_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalUsers(users) {
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(users));
}

function getAdminContent() {
  try {
    return JSON.parse(localStorage.getItem('vastraa_admin_content') || '{}');
  } catch {
    return {};
  }
}

function saveAdminContent(content) {
  localStorage.setItem('vastraa_admin_content', JSON.stringify(content));
}

function getLocalUserSession() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

function saveLocalUserSession(user) {
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
}

function getLocalStoreItems() {
  try {
    return JSON.parse(localStorage.getItem('vastraa_store_items') || '[]');
  } catch {
    return [];
  }
}

function saveLocalStoreItems(items) {
  localStorage.setItem('vastraa_store_items', JSON.stringify(items));
}

function clearLocalUserSession() {
  localStorage.removeItem(LOCAL_SESSION_KEY);
}

async function loadCurrentUser() {
  try {
    const data = await api('/auth/me');
    currentUser = data.user || null;
  } catch {
    currentUser = getLocalUserSession();
    if (currentUser && isAdminEmail(currentUser.email)) {
      currentUser.role = 'admin';
    }
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
  try {
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
  } catch (err) {
    if (!apiOnline) {
      const users = getLocalUsers();
      if (users.some((user) => user.email.toLowerCase() === data.email.toLowerCase())) {
        return { ok: false, message: 'Email already registered.' };
      }
      const newUser = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: 'customer',
        isSeller: false,
      };
      users.push(newUser);
      saveLocalUsers(users);
      saveLocalUserSession(newUser);
      currentUser = newUser;
      updateAuthHeader();
      return { ok: true, user: newUser };
    }
    return { ok: false, message: err.message || 'Registration failed.' };
  }
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
    if (!apiOnline) {
      if (isAdminEmail(email) && password === ADMIN_PASSWORD) {
        const adminUser = createAdminUser();
        currentUser = adminUser;
        saveLocalUserSession(adminUser);
        updateAuthHeader();
        return { ok: true, user: adminUser };
      }
      const users = getLocalUsers();
      const user = users.find(
        (user) =>
          normalizeEmail(user.email) === normalizeEmail(email) &&
          user.password === password
      );
      if (user) {
        currentUser = user;
        saveLocalUserSession(user);
        updateAuthHeader();
        return { ok: true, user };
      }
      return { ok: false, message: 'Invalid email or password.' };
    }
    return { ok: false, message: err.message || 'Login failed.' };
  }
}

async function clearSession() {
  try {
    await api('/auth/logout', { method: 'POST' });
  } catch {
    /* ignore */
  }
  currentUser = null;
  clearLocalUserSession();
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
    if (!apiOnline && currentUser) {
      const users = getLocalUsers();
      const idx = users.findIndex((user) => user.email.toLowerCase() === currentUser.email.toLowerCase());
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...updates };
        currentUser = { ...currentUser, ...updates };
        users[idx] = currentUser;
        saveLocalUsers(users);
        saveLocalUserSession(currentUser);
        return { ok: true, user: currentUser };
      }
    }
    return { ok: false, message: err.message };
  }
}

async function registerSeller(sellerData) {
  try {
    const res = await api('/auth/seller/register', { method: 'POST', body: sellerData });
    currentUser = res.user;
    return { ok: true, user: res.user };
  } catch (err) {
    if (!apiOnline && currentUser) {
      const users = getLocalUsers();
      const idx = users.findIndex((user) => normalizeEmail(user.email) === normalizeEmail(currentUser.email));
      if (idx >= 0) {
        const updatedUser = {
          ...currentUser,
          isSeller: true,
          seller: {
            ...sellerData,
            status: 'pending',
            appliedAt: new Date().toISOString(),
          },
        };
        users[idx] = updatedUser;
        currentUser = updatedUser;
        saveLocalUsers(users);
        saveLocalUserSession(currentUser);
        return { ok: true, user: updatedUser };
      }
    }
    return { ok: false, message: err.message };
  }
}

function isAdmin(user) {
  return user && (user.role === 'admin' || isAdminEmail(user.email));
}

async function ensureAdminAccount() {
  await checkApiHealth();
}

async function getPendingSellers() {
  try {
    const res = await api('/admin/sellers/pending');
    return res.sellers;
  } catch {
    if (!apiOnline) {
      return getLocalUsers().filter(
        (user) => user.isSeller && user.seller?.status === 'pending'
      );
    }
    return [];
  }
}

async function getApprovedSellers() {
  try {
    const res = await api('/admin/sellers/approved');
    return res.sellers;
  } catch {
    if (!apiOnline) {
      return getLocalUsers().filter(
        (user) => user.isSeller && user.seller?.status === 'approved'
      );
    }
    return [];
  }
}

async function approveSeller(email) {
  try {
    await api(`/admin/sellers/${encodeURIComponent(email)}/approve`, { method: 'POST' });
    return { ok: true };
  } catch (err) {
    if (!apiOnline) {
      const users = getLocalUsers();
      const idx = users.findIndex((user) => normalizeEmail(user.email) === normalizeEmail(email));
      if (idx >= 0 && users[idx].seller) {
        users[idx].seller.status = 'approved';
        saveLocalUsers(users);
        return { ok: true };
      }
    }
    return { ok: false, message: err.message };
  }
}

async function rejectSeller(email) {
  try {
    await api(`/admin/sellers/${encodeURIComponent(email)}/reject`, { method: 'POST' });
    return { ok: true };
  } catch (err) {
    if (!apiOnline) {
      const users = getLocalUsers();
      const idx = users.findIndex((user) => normalizeEmail(user.email) === normalizeEmail(email));
      if (idx >= 0 && users[idx].seller) {
        users[idx].seller.status = 'rejected';
        saveLocalUsers(users);
        return { ok: true };
      }
    }
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
    const items = JSON.parse(localStorage.getItem('vastraa_store_items') || '[]');
    const users = JSON.parse(localStorage.getItem('vastraa_users') || '[]');
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
  try {
    const res = await api('/products/mine');
    return res.products || [];
  } catch {
    if (!apiOnline && isLoggedIn()) {
      const user = getCurrentUser();
      const items = getLocalStoreItems();
      return items.filter((item) => item.sellerEmail === user?.email);
    }
    return [];
  }
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
    if (!apiOnline && isLoggedIn()) {
      const user = getCurrentUser();
      if (!user?.isSeller) {
        return { ok: false, message: 'Only sellers can add items.' };
      }
      const items = getLocalStoreItems();
      const newItem = {
        id: item.id || Date.now().toString(),
        sellerEmail: user.email,
        name: item.name,
        brand: item.brand,
        price: Number(item.price) || 0,
        priceWas: item.priceWas ? Number(item.priceWas) : null,
        emoji: item.emoji || '',
        imageUrl: item.imageUrl || '',
        videoUrl: item.videoUrl || '',
        isReel: !!item.isReel,
        badge: item.badge || 'badge-new',
        badgeText: item.badgeText || 'NEW',
        category: item.category || 'uncategorized',
        createdAt: new Date().toISOString(),
      };
      items.push(newItem);
      saveLocalStoreItems(items);
      return { ok: true, item: newItem };
    }
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
    const user = getCurrentUser();
    const items = getLocalStoreItems();
    return items.filter((item) => item.sellerEmail === user?.email);
  }
}

async function deleteStoreItem(id) {
  try {
    await api(`/products/${id}`, { method: 'DELETE' });
    return { ok: true };
  } catch (err) {
    if (!apiOnline) {
      const items = getLocalStoreItems().filter((item) => item.id !== id);
      saveLocalStoreItems(items);
      return { ok: true };
    }
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
