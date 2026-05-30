/* ======================================================
   VASTAAR – Main JavaScript
====================================================== */

const PRODUCTS = [
  { emoji: '🥻', bg: 'p-bg-1', badge: 'badge-sale', badgeText: '40% OFF', brand: 'Tibetan Arts', name: 'Traditional Dhaka Kurta', now: 'Rs. 1,899', was: 'Rs. 3,199', off: '40% off', rating: '4.5', count: '1,284', priceNum: 1899 },
  { emoji: '👔', bg: 'p-bg-2', badge: 'badge-new', badgeText: 'NEW', brand: 'NepalMen', name: 'Classic Daura Suruwal Set', now: 'Rs. 2,499', was: 'Rs. 3,800', off: '34% off', rating: '4.7', count: '2,891', priceNum: 2499 },
  { emoji: '💍', bg: 'p-bg-3', badge: 'badge-hot', badgeText: 'HOT', brand: 'KathmanduGems', name: 'Silver Filigree Necklace', now: 'Rs. 3,200', was: 'Rs. 5,000', off: '36% off', rating: '4.8', count: '956', priceNum: 3200 },
  { emoji: '👡', bg: 'p-bg-4', badge: 'badge-best', badgeText: 'BESTSELLER', brand: 'EverestSteps', name: 'Handcrafted Leather Heels', now: 'Rs. 2,150', was: 'Rs. 3,500', off: '39% off', rating: '4.6', count: '3,412', priceNum: 2150 },
  { emoji: '🧥', bg: 'p-bg-5', badge: 'badge-sale', badgeText: '50% OFF', brand: 'HimalWool', name: 'Premium Pashmina Jacket', now: 'Rs. 4,500', was: 'Rs. 9,000', off: '50% off', rating: '4.9', count: '5,020', priceNum: 4500 },
  { emoji: '👛', bg: 'p-bg-6', badge: 'badge-new', badgeText: 'NEW', brand: 'DhakaStyle', name: 'Woven Dhaka Clutch Bag', now: 'Rs. 1,350', was: 'Rs. 2,000', off: '32% off', rating: '4.4', count: '788', priceNum: 1350 },
  { emoji: '🧣', bg: 'p-bg-7', badge: 'badge-hot', badgeText: 'HOT', brand: 'SherpaKnit', name: 'Yak Wool Muffler Scarf', now: 'Rs. 890', was: 'Rs. 1,400', off: '36% off', rating: '4.6', count: '1,905', priceNum: 890 },
  { emoji: '🧢', bg: 'p-bg-8', badge: 'badge-best', badgeText: 'BESTSELLER', brand: 'NepalPeak', name: 'Trekking Cap Collection', now: 'Rs. 599', was: 'Rs. 999', off: '40% off', rating: '4.3', count: '4,110', priceNum: 599 },
];

const REELS = [
  { bg: 'reel-bg-1', emoji: '🥻', live: true, name: 'Traditional Dhaka Sari — Festival Edition', price: 'Rs. 3,500', hearts: '4.2k', views: '28k', priceNum: 3500 },
  { bg: 'reel-bg-3', emoji: '👔', live: false, name: "Men's Daura Suruwal — Modern Fit", price: 'Rs. 2,200', hearts: '3.7k', views: '21k', priceNum: 2200 },
  { bg: 'reel-bg-5', emoji: '💍', live: true, name: 'Himalayan Silver Jewellery Set', price: 'Rs. 4,800', hearts: '6.1k', views: '45k', priceNum: 4800 },
  { bg: 'reel-bg-4', emoji: '🧥', live: false, name: 'Pashmina Wool Winter Coat', price: 'Rs. 6,500', hearts: '5.4k', views: '38k', priceNum: 6500 },
  { bg: 'reel-bg-2', emoji: '👟', live: true, name: 'Handmade Lokta Leather Sneakers', price: 'Rs. 2,999', hearts: '2.9k', views: '17k', priceNum: 2999 },
  { bg: 'reel-bg-6', emoji: '🧣', live: false, name: 'Yak Wool Himalayan Scarf — 5 Colors', price: 'Rs. 1,200', hearts: '1.8k', views: '13k', priceNum: 1200 },
  { bg: 'reel-bg-1', emoji: '👜', live: true, name: 'Hand-loomed Dhaka Tote Bag', price: 'Rs. 1,750', hearts: '3.3k', views: '24k', priceNum: 1750 },
  { bg: 'reel-bg-3', emoji: '🕌', live: false, name: 'Newari Ethnic Kurta Set', price: 'Rs. 2,850', hearts: '4.8k', views: '32k', priceNum: 2850 },
];

let toastTimer;
let heroSlide = 0;
let heroAutoPlay = null;

const TOTAL_SLIDES = 3;
const REEL_BGS = ['reel-bg-1', 'reel-bg-2', 'reel-bg-3', 'reel-bg-4', 'reel-bg-5', 'reel-bg-6'];

function formatRs(n) {
  return `Rs. ${Number(n).toLocaleString('en-NP')}`;
}

function storeItemToProduct(item) {
  const off = item.priceWas && item.priceWas > item.price
    ? `${Math.round((1 - item.price / item.priceWas) * 100)}% off`
    : '';
  const imageUrl = typeof hasValidImage === 'function' && hasValidImage(item.imageUrl) ? item.imageUrl : '';
  return {
    id: item.id,
    emoji: imageUrl ? '' : (item.emoji || '👗'),
    bg: 'p-bg-1',
    imageUrl,
    isSellerItem: true,
    badge: item.badge || 'badge-new',
    badgeText: item.badgeText || 'NEW',
    brand: item.brand || item.shopName,
    name: item.name,
    now: formatRs(item.price),
    was: item.priceWas ? formatRs(item.priceWas) : '',
    off,
    rating: item.rating || '4.5',
    count: item.count || '0',
    priceNum: item.price,
  };
}

function storeItemToReel(item, i) {
  const imageUrl = typeof hasValidImage === 'function' && hasValidImage(item.imageUrl) ? item.imageUrl : '';
  const videoUrl = typeof hasValidVideo === 'function' && hasValidVideo(item.videoUrl) ? item.videoUrl : '';
  return {
    id: item.id,
    bg: REEL_BGS[i % REEL_BGS.length],
    emoji: imageUrl || videoUrl ? '' : (item.emoji || '👗'),
    imageUrl,
    videoUrl,
    isSellerItem: true,
    live: false,
    name: item.name,
    price: formatRs(item.price),
    hearts: '0',
    views: '0',
    priceNum: item.price,
    brand: item.brand || item.shopName,
  };
}

let cachedSellerProducts = [];
let cachedSellerReels = [];

async function loadSellerCatalog() {
  if (typeof fetchStoreProducts !== 'function') {
    cachedSellerProducts = [];
    cachedSellerReels = [];
    return;
  }
  try {
    const items = await fetchStoreProducts();
    cachedSellerProducts = items.filter((i) => !i.isReel).map(storeItemToProduct);
    cachedSellerReels = items.filter((i) => i.isReel).map((item, i) => storeItemToReel(item, i));
  } catch (err) {
    const fallback = typeof getLocalFallbackProducts === 'function' ? getLocalFallbackProducts() : [];
    cachedSellerProducts = fallback.filter((i) => !i.isReel).map(storeItemToProduct);
    cachedSellerReels = fallback.filter((i) => i.isReel).map((item, i) => storeItemToReel(item, i));
    if (fallback.length) console.info('Showing seller items from offline fallback storage.');
    else console.warn('No seller products. Run: cd backend && npm start — then open http://localhost:3000');
  }
}

function getSellerProducts() {
  return cachedSellerProducts;
}

function getAllProducts() {
  return [...cachedSellerProducts, ...PRODUCTS];
}

function getAllReels() {
  return [...cachedSellerReels, ...REELS];
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function attrEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function productMediaHtml(p) {
  if (p.imageUrl && (typeof hasValidImage === 'function' ? hasValidImage(p.imageUrl) : true)) {
    return `<img src="${p.imageUrl}" alt="${escapeHtml(p.name)}" class="prod-photo" />`;
  }
  if (p.emoji) {
    return `<div class="prod-img-placeholder ${p.bg}">${p.emoji}</div>`;
  }
  return `<div class="prod-img-placeholder ${p.bg}">👗</div>`;
}

function reelMediaHtml(r) {
  if (r.videoUrl && (typeof hasValidVideo === 'function' ? hasValidVideo(r.videoUrl) : true)) {
    return `<video src="${r.videoUrl}" class="reel-video" muted loop playsinline autoplay></video>`;
  }
  if (r.imageUrl && (typeof hasValidImage === 'function' ? hasValidImage(r.imageUrl) : true)) {
    return `<img src="${r.imageUrl}" alt="" class="reel-photo" />`;
  }
  return `<span class="reel-emoji-only">${r.emoji || '👗'}</span>`;
}

function prodImgClass(p) {
  const hasPhoto = p.imageUrl && (typeof hasValidImage !== 'function' || hasValidImage(p.imageUrl));
  return hasPhoto ? 'prod-img has-photo' : 'prod-img';
}

function reelVisualClass(r) {
  const hasMedia =
    (r.videoUrl && typeof hasValidVideo === 'function' && hasValidVideo(r.videoUrl)) ||
    (r.imageUrl && typeof hasValidImage === 'function' && hasValidImage(r.imageUrl));
  return hasMedia ? 'reel-product-visual has-media' : 'reel-product-visual';
}

/* -------------------- Render -------------------- */
function renderProductCard(p) {
  return `
    <div class="prod-card${p.isSellerItem ? ' prod-card-seller' : ''}">
      <div class="${prodImgClass(p)}">
        ${productMediaHtml(p)}
        <span class="prod-badge ${p.badge}">${p.badgeText}</span>
        <button type="button" class="prod-wish" aria-label="Add to wishlist"><i class="fa fa-heart"></i></button>
        <button type="button" class="prod-quick"
          data-add-cart
          data-id="${p.id || ''}"
          data-name="${attrEscape(p.name)}"
          data-brand="${attrEscape(p.brand)}"
          data-price="${p.priceNum}"
          data-emoji="${p.emoji}"
          data-image="${p.imageUrl || ''}">+ ADD TO BAG</button>
      </div>
      <div class="prod-info">
        <div class="prod-brand">${escapeHtml(p.brand)}</div>
        <div class="prod-name">${escapeHtml(p.name)}</div>
        <div class="prod-price">
          <span class="price-now">${p.now}</span>
          ${p.was ? `<span class="price-was">${p.was}</span>` : ''}
          ${p.off ? `<span class="price-off">${p.off}</span>` : ''}
        </div>
        <div class="prod-stars">
          <span class="star-badge"><i class="fa fa-star"></i> ${p.rating}</span>
          <span class="star-count">(${p.count})</span>
        </div>
      </div>
    </div>
  `;
}

function renderProducts() {
  const grid = document.getElementById('featuredProducts');
  if (!grid) return;
  grid.innerHTML = getAllProducts().map(renderProductCard).join('');

  const sellerSection = document.getElementById('sellerSection');
  const sellerGrid = document.getElementById('sellerProducts');
  const sellerItems = getSellerProducts();

  if (sellerSection && sellerGrid) {
    if (sellerItems.length > 0) {
      sellerSection.classList.remove('hidden');
      sellerGrid.innerHTML = sellerItems.map(renderProductCard).join('');
    } else {
      sellerSection.classList.add('hidden');
      sellerGrid.innerHTML = '';
    }
  }
}

function renderReels() {
  const track = document.getElementById('reelsTrack');
  if (!track) return;

  const all = getAllReels();

  track.innerHTML = all.map((r) => `
    <div class="reel-card ${r.bg}">
      <div class="reel-overlay">
        <div class="reel-top">
          <div class="reel-play"><i class="fa fa-play"></i></div>
          ${r.live ? '<div class="reel-live"><span class="live-dot"></span>LIVE</div>' : ''}
        </div>
        <div class="${reelVisualClass(r)}">${reelMediaHtml(r)}</div>
        <div class="reel-bottom">
          <div class="reel-product-name">${escapeHtml(r.name)}</div>
          <div class="reel-price">${r.price}</div>
          <div class="reel-actions">
            <button type="button" class="reel-add-btn"
              data-add-cart
              data-id="${r.id || ''}"
              data-name="${attrEscape(r.name)}"
              data-brand="${attrEscape(r.brand || '')}"
              data-price="${r.priceNum}"
              data-emoji="${r.emoji}">+ Bag</button>
            <div class="reel-stats">
              <span class="reel-stat"><i class="fa fa-heart"></i> ${r.hearts}</span>
              <span class="reel-stat"><i class="fa fa-eye"></i> ${r.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/* -------------------- Toast & Cart -------------------- */
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

async function updateCartBadge() {
  const cartBadge = document.getElementById('cartBadge');
  if (!cartBadge) return;
  const count = typeof getCartCount === 'function' ? await getCartCount() : 0;
  cartBadge.textContent = count;
}

async function addToCartFromButton(btn) {
  const product = {
    id: btn.dataset.id || undefined,
    name: btn.dataset.name,
    brand: btn.dataset.brand,
    price: Number(btn.dataset.price) || 0,
    priceLabel: formatRs(btn.dataset.price),
    emoji: btn.dataset.emoji,
    imageUrl: btn.dataset.image || '',
  };

  if (typeof addToCartStorage === 'function') {
    await addToCartStorage(product);
    await updateCartBadge();
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
      cartBadge.style.transform = 'scale(1.4)';
      setTimeout(() => { cartBadge.style.transform = 'scale(1)'; }, 200);
    }
  }
  const msg = typeof isLoggedIn === 'function' && isLoggedIn()
    ? '🛍️ Added to Bag!'
    : '🛍️ Added to Bag! View in Bag →';
  showToast(msg);
}

function toggleWish(btn) {
  btn.classList.toggle('active');
  showToast(btn.classList.contains('active') ? '❤️ Added to Wishlist!' : 'Removed from Wishlist');
}

function handleSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  const q = input.value.trim();
  if (q) showToast(`🔍 Searching for "${q}"…`);
}

/* -------------------- Hero Slider -------------------- */
function goSlide(n) {
  const track = document.getElementById('heroTrack');
  const dots = document.querySelectorAll('.hero-dot');
  if (!track) return;

  heroSlide = (n + TOTAL_SLIDES) % TOTAL_SLIDES;
  track.style.transform = `translateX(-${heroSlide * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === heroSlide));
}

function moveSlide(dir) {
  goSlide(heroSlide + dir);
}

function initHeroSlider() {
  const track = document.getElementById('heroTrack');
  if (!track) return;

  document.querySelectorAll('.hero-arr').forEach((btn) => {
    btn.addEventListener('click', () => moveSlide(Number(btn.dataset.dir)));
  });

  document.querySelectorAll('.hero-dot').forEach((dot) => {
    dot.addEventListener('click', () => goSlide(Number(dot.dataset.index)));
  });

  heroAutoPlay = setInterval(() => moveSlide(1), 5000);
  track.addEventListener('mouseenter', () => clearInterval(heroAutoPlay));
  track.addEventListener('mouseleave', () => {
    heroAutoPlay = setInterval(() => moveSlide(1), 5000);
  });
}

function scrollReels(dir) {
  const reelsTrack = document.getElementById('reelsTrack');
  if (!reelsTrack) return;
  reelsTrack.scrollBy({ left: dir * (200 + 16) * 3, behavior: 'smooth' });
}

function initGenzFilters() {
  document.querySelectorAll('.genz-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.genz-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      document.querySelectorAll('.genz-card').forEach((card) => {
        const cats = card.dataset.category || '';
        card.classList.toggle('hidden', filter !== 'all' && !cats.includes(filter));
      });
    });
  });
}

function initCountdown() {
  let h = 8;
  let m = 34;
  let s = 52;
  const elH = document.getElementById('t-h');
  const elM = document.getElementById('t-m');
  const elS = document.getElementById('t-s');
  if (!elH || !elM || !elS) return;

  setInterval(() => {
    s -= 1;
    if (s < 0) { s = 59; m -= 1; }
    if (m < 0) { m = 59; h -= 1; }
    if (h < 0) h = 23;
    elH.textContent = String(h).padStart(2, '0');
    elM.textContent = String(m).padStart(2, '0');
    elS.textContent = String(s).padStart(2, '0');
  }, 1000);
}

function initBackToTop() {
  const backTop = document.getElementById('backTop');
  if (!backTop) return;
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('show', window.scrollY > 400);
  });
}

function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
}

/* -------------------- Global Click Handler (fixed) -------------------- */
function initClickHandlers() {
  document.body.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add-cart]');
    if (addBtn) {
      e.preventDefault();
      e.stopPropagation();
      addToCartFromButton(addBtn).catch(() => showToast('Could not add to bag.', true));
      return;
    }

    const wishBtn = e.target.closest('.prod-wish');
    if (wishBtn) {
      e.preventDefault();
      toggleWish(wishBtn);
      return;
    }

    if (e.target.closest('#searchBtn')) {
      handleSearch();
      return;
    }

    if (e.target.closest('.genz-nav')) {
      document.getElementById('genz')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const reelsArr = e.target.closest('.reels-arr');
    if (reelsArr) {
      scrollReels(Number(reelsArr.dataset.dir));
      return;
    }

    const toastBtn = e.target.closest('[data-toast]');
    if (toastBtn) {
      showToast(toastBtn.dataset.toast);
      return;
    }

    if (e.target.closest('.banner-cta')) {
      showToast('✨ Opening collection…');
      return;
    }

    if (e.target.closest('.btn-primary') || e.target.closest('.sale-cta')) {
      showToast('🛍️ Taking you to shop…');
      return;
    }

    const catCard = e.target.closest('.cat-card');
    if (catCard) {
      const name = catCard.querySelector('.cat-name')?.textContent;
      if (name) showToast(`Browsing ${name}…`);
    }
  });

  document.getElementById('searchInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  document.querySelectorAll('.genz-card').forEach((card) => {
    const btn = card.querySelector('.genz-add');
    if (!btn) return;
    btn.setAttribute('data-add-cart', '');
    btn.dataset.name = card.querySelector('.genz-item-name')?.textContent?.trim() || 'Gen Z Item';
    btn.dataset.brand = 'VASTAAR Gen Z';
    btn.dataset.price = (card.querySelector('.genz-price')?.textContent || '').replace(/[^\d]/g, '') || '999';
    const imgBox = card.querySelector('.genz-card-img');
    const emojiNode = imgBox?.childNodes[imgBox.childNodes.length - 1];
    btn.dataset.emoji = (emojiNode?.textContent?.trim()) || '👗';
  });
}

async function initAuthUI() {
  if (typeof checkApiHealth === 'function') {
    const online = await checkApiHealth();
    if (!online && typeof showServerBanner === 'function') showServerBanner();
  }
  if (typeof loadCurrentUser === 'function') await loadCurrentUser();
  else if (typeof updateAuthHeader === 'function') updateAuthHeader();

  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn && typeof isLoggedIn === 'function') {
    settingsBtn.href = isLoggedIn() ? 'settings.html' : 'login.html?next=settings.html';
  }
}

async function refreshCatalog() {
  await loadSellerCatalog();
  renderProducts();
  renderReels();
  document.querySelectorAll('.genz-card').forEach((card) => {
    const btn = card.querySelector('.genz-add');
    if (!btn) return;
    btn.setAttribute('data-add-cart', '');
    btn.dataset.name = card.querySelector('.genz-item-name')?.textContent?.trim() || 'Gen Z Item';
    btn.dataset.brand = 'VASTAAR Gen Z';
    btn.dataset.price = (card.querySelector('.genz-price')?.textContent || '').replace(/[^\d]/g, '') || '999';
    const imgBox = card.querySelector('.genz-card-img');
    const emojiNode = imgBox?.childNodes[imgBox.childNodes.length - 1];
    btn.dataset.emoji = emojiNode?.textContent?.trim() || '👗';
  });
}

async function init() {
  await initAuthUI();
  await updateCartBadge();
  await refreshCatalog();
  initHeroSlider();
  initGenzFilters();
  initCountdown();
  initBackToTop();
  initFadeIn();
  initClickHandlers();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => init().catch(console.error));
} else {
  init().catch(console.error);
}

window.addEventListener('pageshow', () => {
  if (document.getElementById('featuredProducts')) refreshCatalog().catch(console.error);
});
