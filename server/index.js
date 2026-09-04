import express from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, 'data.json');
const app = express();
const port = Number(process.env.PORT || 3000);

const catalog = [
  { id: 'p1', emoji: '🥻', image: 'https://images.unsplash.com/photo-1610030469983-98e550d4d0f4?auto=format&fit=crop&w=700&q=85', gradient: 'rose', badge: '40% OFF', badgeType: 'sale', brand: 'Tibetan Arts', name: 'Traditional Dhaka Kurta', price: 1899, was: 3199, rating: 4.5, reviews: 1284, category: 'Ethnic Wear', keywords: ['kurta', 'men wear', 'menswear'] },
  { id: 'p2', emoji: '👔', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=85', gradient: 'sky', badge: 'NEW', badgeType: 'new', brand: 'NepalMen', name: 'Classic Daura Suruwal Set', price: 2499, was: 3800, rating: 4.7, reviews: 2891, category: 'Men', keywords: ['men wear', 'menswear', 'daura', 'suruwal'] },
  { id: 'p3', emoji: '💍', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=85', gradient: 'lilac', badge: 'HOT', badgeType: 'hot', brand: 'KathmanduGems', name: 'Silver Filigree Necklace', price: 3200, was: 5000, rating: 4.8, reviews: 956, category: 'Jewellery', keywords: ['jewelry', 'jewellery', 'necklace', 'women'] },
  { id: 'p4', emoji: '👡', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=85', gradient: 'sun', badge: 'BESTSELLER', badgeType: 'best', brand: 'EverestSteps', name: 'Handcrafted Leather Heels', price: 2150, was: 3500, rating: 4.6, reviews: 3412, category: 'Footwear', keywords: ['shoes', 'women'] },
  { id: 'p5', emoji: '🧥', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=700&q=85', gradient: 'mint', badge: '50% OFF', badgeType: 'sale', brand: 'HimalWool', name: 'Premium Pashmina Jacket', price: 4500, was: 9000, rating: 4.9, reviews: 5020, category: 'Women', keywords: ['women wear', 'womenswear', 'jacket', 'pashmina'] },
  { id: 'p6', emoji: '👛', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=85', gradient: 'pink', badge: 'NEW', badgeType: 'new', brand: 'DhakaStyle', name: 'Woven Dhaka Clutch Bag', price: 1350, was: 2000, rating: 4.4, reviews: 788, category: 'Bags', keywords: ['bag', 'women'] },
  { id: 'p7', emoji: '🧣', image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=700&q=85', gradient: 'aqua', badge: 'HOT', badgeType: 'hot', brand: 'SherpaKnit', name: 'Yak Wool Muffler Scarf', price: 890, was: 1400, rating: 4.6, reviews: 1905, category: 'Accessories', keywords: ['scarf', 'winter', 'men', 'women'] },
  { id: 'p8', emoji: '🧢', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=700&q=85', gradient: 'indigo', badge: 'BESTSELLER', badgeType: 'best', brand: 'NepalPeak', name: 'Trekking Cap Collection', price: 599, was: 999, rating: 4.3, reviews: 4110, category: 'Accessories', keywords: ['cap', 'trekking', 'men'] },
  { id: 'p9', emoji: '🧒', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=85', gradient: 'mint', badge: 'NEW', badgeType: 'new', brand: 'Little Kathmandu', name: 'Dhaka Kids Hoodie', price: 1299, was: 1800, rating: 4.6, reviews: 342, category: 'Kids', keywords: ['children', 'kids wear'] },
  { id: 'p10', emoji: '👚', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85', gradient: 'pink', badge: 'TRENDING', badgeType: 'hot', brand: 'KTM Street', name: 'Everyday Western Overshirt', price: 1799, was: 2400, rating: 4.5, reviews: 611, category: 'Western', keywords: ['western wear', 'streetwear'] },
  { id: 'p11', emoji: '💄', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85', gradient: 'lilac', badge: 'NEW', badgeType: 'new', brand: 'HerbalNep', name: 'Himalayan Beauty Essentials', price: 999, was: 1400, rating: 4.7, reviews: 285, category: 'Beauty', keywords: ['cosmetics', 'skincare'] },
  { id: 'p12', emoji: '🧺', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=700&q=85', gradient: 'sun', badge: 'EDIT', badgeType: 'best', brand: 'VASTAAR Home', name: 'Handwoven Himalayan Throw', price: 2199, was: 3000, rating: 4.8, reviews: 154, category: 'Home & Living', keywords: ['home', 'living', 'decor'] }
];

const categoryAliases = {
  men: ['men', 'mens', 'menswear', 'men wear'],
  women: ['women', 'womens', 'womenswear', 'women wear'],
  jewellery: ['jewellery', 'jewelry'],
  accessories: ['accessory', 'accessories']
};

function normalize(value) {
  return String(value || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

function matchesCategory(item, category) {
  if (!category) return true;
  const wanted = normalize(category);
  const aliases = Object.entries(categoryAliases).find(([, values]) => values.includes(wanted))?.[1] || [wanted];
  return aliases.some((alias) => normalize(item.category) === normalize(alias) || (item.keywords || []).some((keyword) => normalize(keyword) === normalize(alias)));
}

async function readData() {
  const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
  return { ...data, products: [...catalog, ...(data.products || [])] };
}

async function readStoredData() {
  const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
  return {
    sellers: Array.isArray(data.sellers) ? data.sellers : [],
    stores: Array.isArray(data.stores) ? data.stores : [],
    products: Array.isArray(data.products) ? data.products : [],
    inventory: Array.isArray(data.inventory) ? data.inventory : [],
    orders: Array.isArray(data.orders) ? data.orders : [],
    subscribers: Array.isArray(data.subscribers) ? data.subscribers : []
  };
}

async function writeData(data) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.post('/api/sellers', async (req, res, next) => {
  try {
    const sellerInput = req.body?.seller || {};
    const storeInput = req.body?.store || {};
    const seller = {
      name: String(sellerInput.name || '').trim(),
      email: String(sellerInput.email || '').trim().toLowerCase(),
      phone: String(sellerInput.phone || '').trim()
    };
    const store = {
      name: String(storeInput.name || '').trim(),
      description: String(storeInput.description || '').trim(),
      city: String(storeInput.city || '').trim(),
      address: String(storeInput.address || '').trim(),
      phone: String(storeInput.phone || seller.phone).trim()
    };

    if (!seller.name || !seller.email || !seller.phone || !store.name || !store.city || !store.address) {
      return res.status(400).json({ message: 'Please complete all required seller and store fields.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(seller.email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }
    if (!/^[0-9+()\-\s]{7,20}$/.test(seller.phone) || !/^[0-9+()\-\s]{7,20}$/.test(store.phone)) {
      return res.status(400).json({ message: 'Please provide a valid phone number.' });
    }

    const data = await readStoredData();
    if (data.sellers.some((item) => String(item.email).toLowerCase() === seller.email)) {
      return res.status(409).json({ message: 'A seller account with this email already exists.' });
    }

    const createdAt = new Date().toISOString();
    const sellerRecord = {
      id: `seller-${randomUUID()}`,
      ...seller,
      status: 'pending',
      verification: { submittedAt: createdAt },
      createdAt
    };
    const storeRecord = {
      id: `store-${randomUUID()}`,
      sellerId: sellerRecord.id,
      ...store,
      status: 'pending',
      createdAt
    };

    data.sellers.push(sellerRecord);
    data.stores.push(storeRecord);
    await writeData(data);
    res.status(201).json({ seller: sellerRecord, store: storeRecord });
  } catch (error) { next(error); }
});
app.patch('/api/sellers/:id/verification', async (req, res, next) => {
  try {
    const requestedStatus = String(req.body?.status || '').trim().toLowerCase();
    const reason = String(req.body?.reason || '').trim();
    const allowedStatuses = ['approved', 'rejected'];
    if (!allowedStatuses.includes(requestedStatus)) {
      return res.status(400).json({ message: 'Verification status must be approved or rejected.' });
    }
    if (requestedStatus === 'rejected' && reason.length < 10) {
      return res.status(400).json({ message: 'A meaningful rejection reason is required.' });
    }

    const data = await readStoredData();
    const seller = data.sellers.find((item) => item.id === req.params.id);
    if (!seller) return res.status(404).json({ message: 'Seller not found.' });
    if (seller.status !== 'pending') {
      return res.status(409).json({ message: 'Only pending sellers can be reviewed.' });
    }

    const reviewedAt = new Date().toISOString();
    seller.status = requestedStatus;
    seller.verification = {
      ...(seller.verification || {}),
      reviewedAt,
      reviewedBy: String(req.body?.reviewedBy || 'internal-reviewer').trim()
    };
    if (requestedStatus === 'rejected') seller.verification.rejectionReason = reason;
    else delete seller.verification.rejectionReason;

    await writeData(data);
    res.json({ seller });
  } catch (error) { next(error); }
});
app.get('/api/sellers', async (_req, res, next) => {
  try {
    const data = await readStoredData();
    res.json({ sellers: data.sellers });
  } catch (error) { next(error); }
});
app.get('/api/sellers/:id', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const seller = data.sellers.find((item) => item.id === req.params.id);
    if (!seller) return res.status(404).json({ message: 'Seller not found.' });
    res.json({ seller });
  } catch (error) { next(error); }
});
app.get('/api/stores', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const stores = req.query.sellerId
      ? data.stores.filter((item) => item.sellerId === req.query.sellerId)
      : data.stores;
    res.json({ stores });
  } catch (error) { next(error); }
});
app.get('/api/stores/:id', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const store = data.stores.find((item) => item.id === req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found.' });
    res.json({ store });
  } catch (error) { next(error); }
});
app.get('/api/sellers/:id/products', async (req, res, next) => {
  try {
    const data = await readStoredData();
    if (!data.sellers.some((item) => item.id === req.params.id)) {
      return res.status(404).json({ message: 'Seller not found.' });
    }
    res.json({ products: data.products.filter((item) => item.sellerId === req.params.id) });
  } catch (error) { next(error); }
});
app.get('/api/stores/:id/products', async (req, res, next) => {
  try {
    const data = await readStoredData();
    if (!data.stores.some((item) => item.id === req.params.id)) {
      return res.status(404).json({ message: 'Store not found.' });
    }
    res.json({ products: data.products.filter((item) => item.storeId === req.params.id) });
  } catch (error) { next(error); }
});
app.get('/api/products', async (req, res, next) => {
  try {
    const data = await readData();
    const query = normalize(req.query.q);
    const category = normalize(req.query.category);
    const products = data.products.filter((item) => {
      const searchable = normalize(`${item.name} ${item.brand} ${item.category} ${(item.keywords || []).join(' ')}`);
      const searchableWords = searchable.split(' ');
      const queryMatches = !query || query.split(' ').every((term) => searchableWords.some((word) => word.startsWith(term)));
      return queryMatches && matchesCategory(item, category);
    });
    res.json({ products });
  } catch (error) { next(error); }
});
app.post('/api/orders', async (req, res, next) => {
  try {
    const { customer, items, paymentMethod, promoCode } = req.body;
    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address || !customer?.city || !customer?.postalCode || !Array.isArray(items) || items.length === 0 || !paymentMethod) {
      return res.status(400).json({ message: 'Please complete all customer, delivery, and payment fields.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(customer.email)) return res.status(400).json({ message: 'Please provide a valid email.' });
    if (!/^[0-9+()\-\s]{7,20}$/.test(customer.phone)) return res.status(400).json({ message: 'Please provide a valid phone number.' });
    if (!/^\d{4,10}$/.test(String(customer.postalCode))) return res.status(400).json({ message: 'Please provide a valid postal code.' });
    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const delivery = subtotal >= 1500 ? 0 : 100;
    const discount = String(promoCode || '').trim().toUpperCase() === 'VASTAAR20' ? Math.round(subtotal * 0.2) : 0;
    const total = subtotal + delivery - discount;
    const data = await readStoredData();
    const order = { id: `VST-${Date.now().toString(36).toUpperCase()}`, customer, items, paymentMethod, promoCode: promoCode || '', summary: { subtotal, delivery, discount, total }, createdAt: new Date().toISOString(), status: 'confirmed' };
    data.orders = [...(data.orders || []), order];
    await writeData(data);
    res.status(201).json({ order });
  } catch (error) { next(error); }
});
app.post('/api/subscribers', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Please provide a valid email.' });
    const data = await readStoredData();
    if (!data.subscribers.includes(email)) {
      data.subscribers = [...(data.subscribers || []), email];
      await writeData(data);
    }
    res.status(201).json({ message: 'You are on the list.' });
  } catch (error) { next(error); }
});
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

app.listen(port, () => console.log(`VASTAAR API listening on http://localhost:${port}`));
