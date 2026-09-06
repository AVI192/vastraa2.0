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
  { id: 'p1', emoji: 'ðŸ¥»', image: 'https://images.unsplash.com/photo-1610030469983-98e550d4d0f4?auto=format&fit=crop&w=700&q=85', gradient: 'rose', badge: '40% OFF', badgeType: 'sale', brand: 'Tibetan Arts', name: 'Traditional Dhaka Kurta', price: 1899, was: 3199, rating: 4.5, reviews: 1284, category: 'Ethnic Wear', keywords: ['kurta', 'men wear', 'menswear'] },
  { id: 'p2', emoji: 'ðŸ‘”', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=85', gradient: 'sky', badge: 'NEW', badgeType: 'new', brand: 'NepalMen', name: 'Classic Daura Suruwal Set', price: 2499, was: 3800, rating: 4.7, reviews: 2891, category: 'Men', keywords: ['men wear', 'menswear', 'daura', 'suruwal'] },
  { id: 'p3', emoji: 'ðŸ’', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=85', gradient: 'lilac', badge: 'HOT', badgeType: 'hot', brand: 'KathmanduGems', name: 'Silver Filigree Necklace', price: 3200, was: 5000, rating: 4.8, reviews: 956, category: 'Jewellery', keywords: ['jewelry', 'jewellery', 'necklace', 'women'] },
  { id: 'p4', emoji: 'ðŸ‘¡', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=85', gradient: 'sun', badge: 'BESTSELLER', badgeType: 'best', brand: 'EverestSteps', name: 'Handcrafted Leather Heels', price: 2150, was: 3500, rating: 4.6, reviews: 3412, category: 'Footwear', keywords: ['shoes', 'women'] },
  { id: 'p5', emoji: 'ðŸ§¥', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=700&q=85', gradient: 'mint', badge: '50% OFF', badgeType: 'sale', brand: 'HimalWool', name: 'Premium Pashmina Jacket', price: 4500, was: 9000, rating: 4.9, reviews: 5020, category: 'Women', keywords: ['women wear', 'womenswear', 'jacket', 'pashmina'] },
  { id: 'p6', emoji: 'ðŸ‘›', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=85', gradient: 'pink', badge: 'NEW', badgeType: 'new', brand: 'DhakaStyle', name: 'Woven Dhaka Clutch Bag', price: 1350, was: 2000, rating: 4.4, reviews: 788, category: 'Bags', keywords: ['bag', 'women'] },
  { id: 'p7', emoji: 'ðŸ§£', image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=700&q=85', gradient: 'aqua', badge: 'HOT', badgeType: 'hot', brand: 'SherpaKnit', name: 'Yak Wool Muffler Scarf', price: 890, was: 1400, rating: 4.6, reviews: 1905, category: 'Accessories', keywords: ['scarf', 'winter', 'men', 'women'] },
  { id: 'p8', emoji: 'ðŸ§¢', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=700&q=85', gradient: 'indigo', badge: 'BESTSELLER', badgeType: 'best', brand: 'NepalPeak', name: 'Trekking Cap Collection', price: 599, was: 999, rating: 4.3, reviews: 4110, category: 'Accessories', keywords: ['cap', 'trekking', 'men'] },
  { id: 'p9', emoji: 'ðŸ§’', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=85', gradient: 'mint', badge: 'NEW', badgeType: 'new', brand: 'Little Kathmandu', name: 'Dhaka Kids Hoodie', price: 1299, was: 1800, rating: 4.6, reviews: 342, category: 'Kids', keywords: ['children', 'kids wear'] },
  { id: 'p10', emoji: 'ðŸ‘š', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85', gradient: 'pink', badge: 'TRENDING', badgeType: 'hot', brand: 'KTM Street', name: 'Everyday Western Overshirt', price: 1799, was: 2400, rating: 4.5, reviews: 611, category: 'Western', keywords: ['western wear', 'streetwear'] },
  { id: 'p11', emoji: 'ðŸ’„', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85', gradient: 'lilac', badge: 'NEW', badgeType: 'new', brand: 'HerbalNep', name: 'Himalayan Beauty Essentials', price: 999, was: 1400, rating: 4.7, reviews: 285, category: 'Beauty', keywords: ['cosmetics', 'skincare'] },
  { id: 'p12', emoji: 'ðŸ§º', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=700&q=85', gradient: 'sun', badge: 'EDIT', badgeType: 'best', brand: 'VASTAAR Home', name: 'Handwoven Himalayan Throw', price: 2199, was: 3000, rating: 4.8, reviews: 154, category: 'Home & Living', keywords: ['home', 'living', 'decor'] }
];

const NEPAL_PROVINCES = [
  'Koshi',
  'Madhesh',
  'Bagmati',
  'Gandaki',
  'Lumbini',
  'Karnali',
  'Sudurpashchim'
];

const categoryAliases = {
  men: ['men', 'mens', 'menswear', 'men wear'],
  women: ['women', 'womens', 'womenswear', 'women wear'],
  jewellery: ['jewellery', 'jewelry'],
  accessories: ['accessory', 'accessories']
};

const categoryEmojiMap = {
  'Ethnic Wear': 'ðŸ‘—',
  'Western': 'ðŸ‘•',
  'Kids': 'ðŸ‘¶',
  'Footwear': 'ðŸ‘Ÿ',
  'Jewellery': 'ðŸ’Ž',
  'Bags': 'ðŸ‘œ',
  'Beauty': 'ðŸ§´',
  'Men': 'ðŸ‘”',
  'Women': 'ðŸ¥»',
  'Accessories': 'ðŸ§£',
  'Home & Living': 'ðŸ§º'
};

function validateProductInput(body, isUpdate = false, existingProduct = null) {
  const errors = [];
  const updates = {};

  if (!isUpdate || body.name !== undefined) {
    const name = String(body.name || '').trim();
    if (!name || name.length < 2 || name.length > 120) {
      errors.push('Product name must be between 2 and 120 characters.');
    } else {
      updates.name = name;
    }
  }

  if (!isUpdate || body.price !== undefined) {
    const price = Number(body.price);
    if (isNaN(price) || price <= 0 || price > 1000000) {
      errors.push('Please provide a valid price between Rs. 1 and Rs. 1,000,000.');
    } else {
      updates.price = Math.round(price);
    }
  }

  const effectivePrice = updates.price !== undefined ? updates.price : (existingProduct ? existingProduct.price : undefined);

  if (body.was !== undefined && body.was !== null && body.was !== '') {
    const was = Number(body.was);
    if (isNaN(was) || (effectivePrice !== undefined && was < effectivePrice)) {
      errors.push('Original price (was) must be greater than or equal to current price.');
    } else {
      updates.was = Math.round(was);
    }
  } else if (isUpdate && (body.was === null || body.was === '')) {
    updates.was = null;
  } else if (isUpdate && updates.price !== undefined && existingProduct?.was !== undefined && existingProduct?.was !== null) {
    if (existingProduct.was < updates.price) {
      errors.push('Current price cannot exceed existing original price. Please update or clear original price.');
    }
  }

  if (!isUpdate || body.category !== undefined) {
    const category = String(body.category || '').trim();
    if (!category || category.length < 2 || category.length > 50) {
      errors.push('Please select or provide a valid product category.');
    } else {
      updates.category = category;
    }
  }

  if (body.brand !== undefined) {
    const brand = String(body.brand || '').trim();
    if (brand && (brand.length < 2 || brand.length > 60)) {
      errors.push('Brand name must be between 2 and 60 characters.');
    } else if (brand) {
      updates.brand = brand;
    } else if (isUpdate && brand === '') {
      updates.brand = null;
    }
  }

  if (body.description !== undefined) {
    const description = String(body.description || '').trim();
    if (description.length > 1000) {
      errors.push('Description cannot exceed 1000 characters.');
    } else {
      updates.description = description;
    }
  }

  if (body.status !== undefined) {
    const status = String(body.status || '').trim().toLowerCase();
    if (!['active', 'inactive'].includes(status)) {
      errors.push('Status must be either "active" or "inactive".');
    } else {
      updates.status = status;
    }
  }

  if (body.image !== undefined) {
    const image = String(body.image || '').trim();
    updates.image = image || null;
  }

  if (body.emoji !== undefined) {
    const emoji = String(body.emoji || '').trim();
    if (emoji) updates.emoji = emoji;
  }

  if (body.gradient !== undefined) {
    const validGradients = ['rose', 'sky', 'lilac', 'sun', 'mint', 'pink', 'aqua', 'indigo'];
    const gradient = String(body.gradient || '').trim().toLowerCase();
    if (gradient && !validGradients.includes(gradient)) {
      errors.push('Gradient must be one of: rose, sky, lilac, sun, mint, pink, aqua, indigo.');
    } else if (gradient) {
      updates.gradient = gradient;
    }
  }

  if (body.badge !== undefined) {
    const badge = String(body.badge || '').trim();
    if (badge.length > 30) {
      errors.push('Badge text cannot exceed 30 characters.');
    } else if (badge) {
      updates.badge = badge;
    } else if (isUpdate && badge === '') {
      updates.badge = null;
      updates.badgeType = null;
    }
  }

  if (body.badgeType !== undefined) {
    const validBadgeTypes = ['new', 'sale', 'hot', 'best'];
    const badgeType = String(body.badgeType || '').trim().toLowerCase();
    if (badgeType && !validBadgeTypes.includes(badgeType)) {
      errors.push('Badge type must be one of: new, sale, hot, best.');
    } else if (badgeType) {
      updates.badgeType = badgeType;
    }
  }

  if (body.keywords !== undefined) {
    if (Array.isArray(body.keywords)) {
      updates.keywords = body.keywords.map((k) => String(k).trim()).filter(Boolean);
    } else if (typeof body.keywords === 'string') {
      updates.keywords = body.keywords.split(',').map((k) => k.trim()).filter(Boolean);
    }
  }

  return { errors, updates };
}

function normalize(value) {
  return String(value || '').toLowerCase().replace(/[â€™']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

function matchesCategory(item, category) {
  if (!category) return true;
  const wanted = normalize(category);
  const aliases = Object.entries(categoryAliases).find(([, values]) => values.includes(wanted))?.[1] || [wanted];
  return aliases.some((alias) => normalize(item.category) === normalize(alias) || (item.keywords || []).some((keyword) => normalize(keyword) === normalize(alias)));
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
      country: 'Nepal',
      city: String(storeInput.city || '').trim(),
      address: String(storeInput.address || '').trim(),
      phone: String(storeInput.phone || seller.phone).trim()
    };

    if (storeInput.district !== undefined && storeInput.district !== null && String(storeInput.district).trim() !== '') {
      const district = String(storeInput.district).trim();
      if (district.length > 60) {
        return res.status(400).json({ message: 'District name cannot exceed 60 characters.' });
      }
      store.district = district;
    }

    if (storeInput.province !== undefined && storeInput.province !== null && String(storeInput.province).trim() !== '') {
      const provStr = String(storeInput.province).trim();
      const matched = NEPAL_PROVINCES.find((p) => p.toLowerCase() === provStr.toLowerCase());
      if (!matched) {
        return res.status(400).json({ message: 'Invalid province. Supported Nepal provinces: Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim.' });
      }
      store.province = matched;
    }

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
app.get('/api/sellers/:id/dashboard', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const seller = data.sellers.find((item) => item.id === req.params.id);
    if (!seller) return res.status(404).json({ message: 'Seller not found.' });
    const store = data.stores.find((item) => item.sellerId === seller.id) || null;
    const sellerProducts = data.products.filter((item) => item.sellerId === seller.id);
    const sellerProductIds = new Set(sellerProducts.map((p) => p.id));
    const sellerInventory = data.inventory.filter((item) => item.storeId === store?.id || sellerProductIds.has(item.productId));
    const sellerOrders = data.orders.filter((order) => order.items?.some((item) => item.sellerId === seller.id || (store && item.storeId === store.id) || sellerProductIds.has(item.productId || item.id)));
    res.json({
      seller: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        status: seller.status,
        verification: seller.verification || {},
        createdAt: seller.createdAt
      },
      store,
      stats: {
        products: sellerProducts.length,
        inventory: sellerInventory.length,
        orders: sellerOrders.length
      }
    });
  } catch (error) { next(error); }
});
app.get('/api/stores', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const stores = (req.query.sellerId
      ? data.stores.filter((item) => item.sellerId === req.query.sellerId)
      : data.stores
    ).map((store) => ({ country: 'Nepal', ...store }));
    res.json({ stores });
  } catch (error) { next(error); }
});
app.get('/api/stores/:id', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const store = data.stores.find((item) => item.id === req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found.' });
    res.json({ store: { country: 'Nepal', ...store } });
  } catch (error) { next(error); }
});
app.patch('/api/stores/:id', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const store = data.stores.find((item) => item.id === req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found.' });

    const updates = req.body || {};

    if (updates.name !== undefined) {
      const name = String(updates.name || '').trim();
      if (name.length < 2 || name.length > 100) {
        return res.status(400).json({ message: 'Store name must be between 2 and 100 characters.' });
      }
      store.name = name;
    }

    if (updates.description !== undefined) {
      const description = String(updates.description || '').trim();
      if (description.length > 500) {
        return res.status(400).json({ message: 'Description cannot exceed 500 characters.' });
      }
      store.description = description;
    }

    if (updates.country !== undefined) {
      if (updates.country !== null && updates.country !== '') {
        const country = String(updates.country).trim();
        if (country.length > 60) {
          return res.status(400).json({ message: 'Country name cannot exceed 60 characters.' });
        }
        if (country.toLowerCase() !== 'nepal') {
          return res.status(400).json({ message: 'VASTAAR currently only supports stores in Nepal.' });
        }
        store.country = 'Nepal';
      } else {
        store.country = 'Nepal';
      }
    }

    if (updates.province !== undefined) {
      if (updates.province !== null && updates.province !== '') {
        const provStr = String(updates.province).trim();
        const matched = NEPAL_PROVINCES.find((p) => p.toLowerCase() === provStr.toLowerCase());
        if (!matched) {
          return res.status(400).json({ message: 'Invalid province. Supported Nepal provinces: Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim.' });
        }
        store.province = matched;
      } else {
        delete store.province;
      }
    }

    if (updates.city !== undefined) {
      const city = String(updates.city || '').trim();
      if (!city || city.length > 60) {
        return res.status(400).json({ message: 'Please provide a valid city name (max 60 characters).' });
      }
      store.city = city;
    }

    if (updates.district !== undefined) {
      if (updates.district !== null && updates.district !== '') {
        const district = String(updates.district).trim();
        if (district.length > 60) {
          return res.status(400).json({ message: 'District name cannot exceed 60 characters.' });
        }
        store.district = district;
      } else {
        delete store.district;
      }
    }

    if (updates.address !== undefined) {
      const address = String(updates.address || '').trim();
      if (!address || address.length > 200) {
        return res.status(400).json({ message: 'Please provide a valid store address (max 200 characters).' });
      }
      store.address = address;
    }

    if (updates.latitude !== undefined) {
      if (updates.latitude === null || updates.latitude === '' || (typeof updates.latitude === 'string' && updates.latitude.trim() === '')) {
        delete store.latitude;
      } else if (typeof updates.latitude === 'boolean') {
        return res.status(400).json({ message: 'Latitude must be a valid numeric value.' });
      } else {
        const lat = Number(updates.latitude);
        if (isNaN(lat) || !isFinite(lat) || typeof updates.latitude === 'object') {
          return res.status(400).json({ message: 'Latitude must be a valid numeric value.' });
        }
        if (lat < -90 || lat > 90) {
          return res.status(400).json({ message: 'Latitude must be between -90 and 90 degrees.' });
        }
        store.latitude = lat;
      }
    }

    if (updates.longitude !== undefined) {
      if (updates.longitude === null || updates.longitude === '' || (typeof updates.longitude === 'string' && updates.longitude.trim() === '')) {
        delete store.longitude;
      } else if (typeof updates.longitude === 'boolean') {
        return res.status(400).json({ message: 'Longitude must be a valid numeric value.' });
      } else {
        const lng = Number(updates.longitude);
        if (isNaN(lng) || !isFinite(lng) || typeof updates.longitude === 'object') {
          return res.status(400).json({ message: 'Longitude must be a valid numeric value.' });
        }
        if (lng < -180 || lng > 180) {
          return res.status(400).json({ message: 'Longitude must be between -180 and 180 degrees.' });
        }
        store.longitude = lng;
      }
    }

    if (updates.phone !== undefined) {
      const phone = String(updates.phone || '').trim();
      if (!/^[0-9+()\-\s]{7,20}$/.test(phone)) {
        return res.status(400).json({ message: 'Please provide a valid store phone number.' });
      }
      store.phone = phone;
    }

    if (updates.email !== undefined) {
      const email = String(updates.email || '').trim().toLowerCase();
      if (email && (!/^\S+@\S+\.\S+$/.test(email) || email.length > 100)) {
        return res.status(400).json({ message: 'Please provide a valid store email address.' });
      }
      store.email = email || null;
    }

    if (updates.openingHours !== undefined) {
      const openingHours = String(updates.openingHours || '').trim();
      if (openingHours.length > 100) {
        return res.status(400).json({ message: 'Opening hours cannot exceed 100 characters.' });
      }
      store.openingHours = openingHours;
    }

    await writeData(data);
    res.json({ store: { country: 'Nepal', ...store } });
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
app.post('/api/sellers/:id/products', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const seller = data.sellers.find((item) => item.id === req.params.id);
    if (!seller) return res.status(404).json({ message: 'Seller not found.' });
    const store = data.stores.find((item) => item.sellerId === seller.id);
    if (!store) return res.status(404).json({ message: 'Store not found for this seller.' });

    const { errors, updates } = validateProductInput(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const defaultEmoji = categoryEmojiMap[updates.category] || 'ðŸ›ï¸';
    const product = {
      id: `prod-${randomUUID().slice(0, 8)}`,
      sellerId: seller.id,
      storeId: store.id,
      name: updates.name,
      brand: updates.brand || store.name,
      category: updates.category,
      price: updates.price,
      description: updates.description || '',
      emoji: updates.emoji || defaultEmoji,
      gradient: updates.gradient || 'rose',
      keywords: updates.keywords || [updates.category.toLowerCase(), updates.name.toLowerCase()],
      status: updates.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (updates.was !== undefined && updates.was !== null) {
      product.was = updates.was;
    }
    if (updates.badge) {
      product.badge = updates.badge;
      product.badgeType = updates.badgeType || 'new';
    }
    if (updates.image) {
      product.image = updates.image;
    }

    const inventoryRecord = {
      id: `inv-${randomUUID().slice(0, 8)}`,
      productId: product.id,
      sellerId: seller.id,
      storeId: store.id,
      quantity: 0,
      reservedQuantity: 0,
      availableQuantity: 0,
      updatedAt: new Date().toISOString()
    };

    data.products = [...(data.products || []), product];
    data.inventory = [...(data.inventory || []), inventoryRecord];
    await writeData(data);
    res.status(201).json({ product });
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
app.post('/api/stores/:id/products', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const store = data.stores.find((item) => item.id === req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found.' });
    const seller = data.sellers.find((item) => item.id === store.sellerId);
    if (!seller) return res.status(404).json({ message: 'Seller not found for this store.' });

    const { errors, updates } = validateProductInput(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const defaultEmoji = categoryEmojiMap[updates.category] || 'ðŸ›ï¸';
    const product = {
      id: `prod-${randomUUID().slice(0, 8)}`,
      sellerId: store.sellerId,
      storeId: store.id,
      name: updates.name,
      brand: updates.brand || store.name,
      category: updates.category,
      price: updates.price,
      description: updates.description || '',
      emoji: updates.emoji || defaultEmoji,
      gradient: updates.gradient || 'rose',
      keywords: updates.keywords || [updates.category.toLowerCase(), updates.name.toLowerCase()],
      status: updates.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (updates.was !== undefined && updates.was !== null) {
      product.was = updates.was;
    }
    if (updates.badge) {
      product.badge = updates.badge;
      product.badgeType = updates.badgeType || 'new';
    }
    if (updates.image) {
      product.image = updates.image;
    }

    const inventoryRecord = {
      id: `inv-${randomUUID().slice(0, 8)}`,
      productId: product.id,
      sellerId: store.sellerId,
      storeId: store.id,
      quantity: 0,
      reservedQuantity: 0,
      availableQuantity: 0,
      updatedAt: new Date().toISOString()
    };

    data.products = [...(data.products || []), product];
    data.inventory = [...(data.inventory || []), inventoryRecord];
    await writeData(data);
    res.status(201).json({ product });
  } catch (error) { next(error); }
});
app.get('/api/sellers/:id/inventory', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const seller = data.sellers.find((item) => item.id === req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found.' });
    }

    const sellerProducts = data.products.filter((item) => item.sellerId === seller.id);
    const productMap = new Map(sellerProducts.map((item) => [item.id, item]));

    let inventoryModified = false;
    for (const prod of sellerProducts) {
      if (!data.inventory.some((inv) => inv.productId === prod.id)) {
        const newInv = {
          id: `inv-${randomUUID().slice(0, 8)}`,
          productId: prod.id,
          sellerId: prod.sellerId,
          storeId: prod.storeId,
          quantity: 0,
          reservedQuantity: 0,
          availableQuantity: 0,
          updatedAt: new Date().toISOString()
        };
        data.inventory.push(newInv);
        inventoryModified = true;
      }
    }
    if (inventoryModified) {
      await writeData(data);
    }

    const sellerInventory = data.inventory
      .filter((inv) => inv.sellerId === seller.id || productMap.has(inv.productId))
      .map((inv) => {
        const prod = productMap.get(inv.productId);
        return {
          id: inv.id,
          productId: inv.productId,
          sellerId: inv.sellerId,
          storeId: inv.storeId,
          quantity: inv.quantity,
          reservedQuantity: inv.reservedQuantity || 0,
          availableQuantity: inv.availableQuantity,
          updatedAt: inv.updatedAt,
          product: prod ? {
            id: prod.id,
            name: prod.name,
            brand: prod.brand,
            category: prod.category,
            price: prod.price,
            status: prod.status,
            emoji: prod.emoji,
            image: prod.image,
            gradient: prod.gradient
          } : null
        };
      });

    res.json({ inventory: sellerInventory });
  } catch (error) { next(error); }
});
app.get('/api/products/:id/inventory', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const product = data.products.find((item) => item.id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    let inventory = data.inventory.find((inv) => inv.productId === product.id);
    if (!inventory) {
      inventory = {
        id: `inv-${randomUUID().slice(0, 8)}`,
        productId: product.id,
        sellerId: product.sellerId,
        storeId: product.storeId,
        quantity: 0,
        reservedQuantity: 0,
        availableQuantity: 0,
        updatedAt: new Date().toISOString()
      };
      data.inventory.push(inventory);
      await writeData(data);
    }

    res.json({ inventory });
  } catch (error) { next(error); }
});
app.patch('/api/products/:id/inventory', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const product = data.products.find((item) => item.id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (req.body?.quantity === undefined || req.body?.quantity === null) {
      return res.status(400).json({ message: 'Quantity is required.' });
    }

    const qty = req.body.quantity;
    if (typeof qty !== 'number' || !Number.isInteger(qty) || !isFinite(qty) || qty < 0 || qty > 1000000) {
      return res.status(400).json({ message: 'Quantity must be an integer between 0 and 1,000,000.' });
    }

    let inventoryIndex = data.inventory.findIndex((item) => item.productId === product.id);
    let inventory = inventoryIndex !== -1 ? data.inventory[inventoryIndex] : null;

    const reservedQuantity = inventory ? (Number(inventory.reservedQuantity) || 0) : 0;
    if (qty < reservedQuantity) {
      return res.status(400).json({ message: 'Quantity cannot be less than reserved quantity.' });
    }

    const availableQuantity = qty - reservedQuantity;
    const now = new Date().toISOString();

    const updatedInventory = {
      id: inventory?.id || `inv-${randomUUID().slice(0, 8)}`,
      productId: product.id,
      sellerId: product.sellerId,
      storeId: product.storeId,
      quantity: qty,
      reservedQuantity,
      availableQuantity,
      updatedAt: now
    };

    if (inventoryIndex !== -1) {
      data.inventory[inventoryIndex] = updatedInventory;
    } else {
      data.inventory.push(updatedInventory);
    }

    await writeData(data);
    res.json({ inventory: updatedInventory });
  } catch (error) { next(error); }
});
function extractSellerOrderItems(order, sellerId, storeId, productMap) {
  if (!Array.isArray(order.items)) return [];
  return order.items
    .filter((item) => {
      const pid = item.productId || item.id;
      return item.sellerId === sellerId || (storeId && item.storeId === storeId) || productMap.has(pid);
    })
    .map((item) => {
      const pid = item.productId || item.id;
      const prod = productMap.get(pid);
      return {
        productId: pid,
        name: item.name || prod?.name || 'Product',
        price: Number(item.price !== undefined ? item.price : prod?.price || 0),
        quantity: Number(item.quantity || 1),
        sellerId: sellerId,
        storeId: item.storeId || prod?.storeId || storeId || null
      };
    });
}
app.get('/api/sellers/:sellerId/orders', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const seller = data.sellers.find((item) => item.id === req.params.sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found.' });
    }

    const sellerProducts = data.products.filter((item) => item.sellerId === seller.id);
    const productMap = new Map(sellerProducts.map((p) => [p.id, p]));
    const store = data.stores.find((s) => s.sellerId === seller.id);

    const sellerOrders = [];
    for (const order of data.orders) {
      const sellerItems = extractSellerOrderItems(order, seller.id, store?.id, productMap);
      if (sellerItems.length > 0) {
        const subtotal = sellerItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
        const status = order.sellerStatuses?.[seller.id] || sellerItems[0]?.status || order.status || 'confirmed';
        sellerOrders.push({
          id: order.id,
          orderId: order.id,
          sellerId: seller.id,
          storeId: store?.id || null,
          customer: order.customer ? {
            name: order.customer.name || '',
            email: order.customer.email || '',
            phone: order.customer.phone || '',
            address: order.customer.address || '',
            city: order.customer.city || '',
            postalCode: order.customer.postalCode || ''
          } : {},
          items: sellerItems,
          subtotal,
          status,
          paymentMethod: order.paymentMethod || 'Cash on Delivery',
          createdAt: order.createdAt
        });
      }
    }

    res.json({ orders: sellerOrders });
  } catch (error) { next(error); }
});
app.get('/api/sellers/:sellerId/orders/:orderId', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const seller = data.sellers.find((item) => item.id === req.params.sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found.' });
    }

    const order = data.orders.find((item) => item.id === req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const sellerProducts = data.products.filter((item) => item.sellerId === seller.id);
    const productMap = new Map(sellerProducts.map((p) => [p.id, p]));
    const store = data.stores.find((s) => s.sellerId === seller.id);

    const sellerItems = extractSellerOrderItems(order, seller.id, store?.id, productMap);
    if (sellerItems.length === 0) {
      return res.status(404).json({ message: 'Order not found for this seller.' });
    }

    const subtotal = sellerItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const status = order.sellerStatuses?.[seller.id] || sellerItems[0]?.status || order.status || 'confirmed';

    const sellerOrder = {
      id: order.id,
      orderId: order.id,
      sellerId: seller.id,
      storeId: store?.id || null,
      customer: order.customer ? {
        name: order.customer.name || '',
        email: order.customer.email || '',
        phone: order.customer.phone || '',
        address: order.customer.address || '',
        city: order.customer.city || '',
        postalCode: order.customer.postalCode || ''
      } : {},
      items: sellerItems,
      subtotal,
      status,
      paymentMethod: order.paymentMethod || 'Cash on Delivery',
      createdAt: order.createdAt
    };

    res.json({ order: sellerOrder });
  } catch (error) { next(error); }
});
app.patch('/api/sellers/:sellerId/orders/:orderId/status', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const seller = data.sellers.find((item) => item.id === req.params.sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found.' });
    }

    const orderIndex = data.orders.findIndex((item) => item.id === req.params.orderId);
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    const order = data.orders[orderIndex];

    const sellerProducts = data.products.filter((item) => item.sellerId === seller.id);
    const productMap = new Map(sellerProducts.map((p) => [p.id, p]));
    const store = data.stores.find((s) => s.sellerId === seller.id);

    const sellerItems = extractSellerOrderItems(order, seller.id, store?.id, productMap);
    if (sellerItems.length === 0) {
      return res.status(404).json({ message: 'Order not found for this seller.' });
    }

    const rawStatus = req.body?.status;
    if (typeof rawStatus !== 'string' || !rawStatus.trim()) {
      return res.status(400).json({ message: 'Status is required.' });
    }
    const requestedStatus = rawStatus.trim().toLowerCase();
    const allowedStatuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(requestedStatus)) {
      return res.status(400).json({ message: 'Invalid order status. Allowed values: PLACED, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED.' });
    }

    const currentStatus = (order.sellerStatuses?.[seller.id] || order.status || 'confirmed').toLowerCase();
    if (currentStatus === 'delivered' && requestedStatus !== 'delivered') {
      return res.status(400).json({ message: 'Delivered orders cannot be updated.' });
    }
    if (currentStatus === 'cancelled' && requestedStatus !== 'cancelled') {
      return res.status(400).json({ message: 'Cancelled orders cannot be updated.' });
    }

    order.sellerStatuses = { ...(order.sellerStatuses || {}), [seller.id]: requestedStatus };
    if (Array.isArray(order.items)) {
      for (const item of order.items) {
        const pid = item.productId || item.id;
        if (item.sellerId === seller.id || (store && item.storeId === store.id) || productMap.has(pid)) {
          item.status = requestedStatus;
        }
      }
    }

    const allOrderSellerIds = new Set();
    let allSameStatus = true;
    for (const item of order.items || []) {
      const pid = item.productId || item.id;
      const p = data.products.find((prod) => prod.id === pid);
      const sId = item.sellerId || p?.sellerId;
      if (sId) allOrderSellerIds.add(sId);
      const itStatus = (item.status || order.status || 'confirmed').toLowerCase();
      if (itStatus !== requestedStatus) {
        allSameStatus = false;
      }
    }
    if (allOrderSellerIds.size <= 1 || allSameStatus) {
      order.status = requestedStatus;
    }

    await writeData(data);

    const subtotal = sellerItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const updatedSellerOrder = {
      id: order.id,
      orderId: order.id,
      sellerId: seller.id,
      storeId: store?.id || null,
      customer: order.customer ? {
        name: order.customer.name || '',
        email: order.customer.email || '',
        phone: order.customer.phone || '',
        address: order.customer.address || '',
        city: order.customer.city || '',
        postalCode: order.customer.postalCode || ''
      } : {},
      items: sellerItems.map((it) => ({ ...it, status: requestedStatus })),
      subtotal,
      status: requestedStatus,
      paymentMethod: order.paymentMethod || 'Cash on Delivery',
      createdAt: order.createdAt
    };

    res.json({ order: updatedSellerOrder });
  } catch (error) { next(error); }
});

export function sanitizeStoreCoordinate(val, type = 'lat') {
  if (val === null || val === undefined) {
    return null;
  }
  if (typeof val === 'boolean' || typeof val === 'object' || Array.isArray(val)) {
    return null;
  }
  if (typeof val === 'string' && val.trim() === '') {
    return null;
  }
  const num = Number(val);
  if (!Number.isFinite(num) || isNaN(num)) {
    return null;
  }
  if (type === 'lat') {
    return num >= -90 && num <= 90 ? num : null;
  }
  if (type === 'lng' || type === 'lon') {
    return num >= -180 && num <= 180 ? num : null;
  }
  return null;
}

export function sanitizeStoreCoordinates(store) {
  if (!store || typeof store !== 'object') {
    return { latitude: null, longitude: null };
  }

  let latitude = sanitizeStoreCoordinate(store.latitude, 'lat');
  let longitude = sanitizeStoreCoordinate(store.longitude, 'lng');

  // Both-or-none rule: if either coordinate is invalid or missing, both must be null
  if (latitude === null || longitude === null) {
    latitude = null;
    longitude = null;
  }

  return { latitude, longitude };
}

export function sanitizeLocationValue(val) {
  if (val === null || val === undefined) {
    return '';
  }
  if (typeof val !== 'string') {
    return '';
  }
  const trimmed = val.trim();
  return trimmed === '' ? '' : trimmed;
}

export function normalizeStoreLocation(store) {
  if (!store || typeof store !== 'object') {
    return {
      storeCountry: 'Nepal',
      storeProvince: '',
      storeDistrict: '',
      storeCity: '',
      storeLatitude: null,
      storeLongitude: null
    };
  }

  const storeCountry = (typeof store.country === 'string' && store.country.trim()) ? store.country.trim() : 'Nepal';
  const storeProvince = sanitizeLocationValue(store.province);
  const storeDistrict = sanitizeLocationValue(store.district);
  const storeCity = sanitizeLocationValue(store.city);
  const { latitude, longitude } = sanitizeStoreCoordinates(store);

  return {
    storeCountry,
    storeProvince,
    storeDistrict,
    storeCity,
    storeLatitude: latitude,
    storeLongitude: longitude
  };
}

function enrichMarketplaceProduct(prod, store, inv) {
  const defaultEmoji = categoryEmojiMap[prod.category] || 'ðŸ›ï¸';
  const loc = normalizeStoreLocation(store);
  return {
    id: prod.id,
    name: prod.name,
    brand: prod.brand || (store && typeof store.name === 'string' ? sanitizeLocationValue(store.name) : '') || 'VASTAAR Partner',
    category: prod.category,
    price: Number(prod.price),
    was: prod.was !== undefined && prod.was !== null ? Number(prod.was) : undefined,
    description: prod.description || '',
    emoji: prod.emoji || defaultEmoji,
    gradient: prod.gradient || 'rose',
    image: prod.image || undefined,
    badge: prod.badge || undefined,
    badgeType: prod.badgeType || undefined,
    rating: Number(prod.rating || 4.5),
    reviews: Number(prod.reviews || 0),
    keywords: Array.isArray(prod.keywords) ? prod.keywords : [prod.category.toLowerCase(), prod.name.toLowerCase()],
    sellerId: prod.sellerId,
    storeId: prod.storeId,
    storeName: (store && typeof store.name === 'string' ? sanitizeLocationValue(store.name) : '') || 'Store',
    storeCountry: loc.storeCountry,
    storeProvince: loc.storeProvince,
    storeCity: loc.storeCity,
    storeDistrict: loc.storeDistrict,
    storeLatitude: loc.storeLatitude,
    storeLongitude: loc.storeLongitude,
    isSellerProduct: true,
    inStock: inv ? inv.availableQuantity > 0 : true,
    availableQuantity: inv ? inv.availableQuantity : 999
  };
}

function getEligibleSellerProducts(data) {
  const approvedSellers = new Map(
    (data.sellers || [])
      .filter((s) => s.status === 'approved')
      .map((s) => [s.id, s])
  );
  const activeStores = new Map(
    (data.stores || [])
      .filter((st) => approvedSellers.has(st.sellerId) && st.status !== 'inactive' && st.status !== 'suspended' && st.status !== 'rejected')
      .map((st) => [st.id, st])
  );
  const inventoryMap = new Map();
  for (const inv of data.inventory || []) {
    const qty = Number(inv.quantity) || 0;
    const reserved = Number(inv.reservedQuantity) || 0;
    const avail = Math.max(0, qty - reserved);
    inventoryMap.set(inv.productId, {
      id: inv.id,
      quantity: qty,
      reservedQuantity: reserved,
      availableQuantity: avail
    });
  }

  const eligibleProducts = [];
  for (const prod of data.products || []) {
    if (prod.status !== 'active') continue;
    if (!prod.sellerId || !approvedSellers.has(prod.sellerId)) continue;
    if (!prod.storeId || !activeStores.has(prod.storeId)) continue;

    const store = activeStores.get(prod.storeId);
    if (store.sellerId !== prod.sellerId) continue;

    const inv = inventoryMap.get(prod.id);
    if (!inv || inv.availableQuantity <= 0) continue;

    eligibleProducts.push(enrichMarketplaceProduct(prod, store, inv));
  }
  return eligibleProducts;
}

app.get('/api/products/:id', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const catalogProduct = catalog.find((item) => item.id === req.params.id);
    if (catalogProduct) {
      return res.json({ product: catalogProduct });
    }

    const storedProduct = data.products.find((item) => item.id === req.params.id);
    if (storedProduct) {
      const seller = data.sellers.find((s) => s.id === storedProduct.sellerId);
      const store = data.stores.find((st) => st.id === storedProduct.storeId);
      const invRecord = data.inventory.find((inv) => inv.productId === storedProduct.id);

      const qty = Number(invRecord?.quantity) || 0;
      const reserved = Number(invRecord?.reservedQuantity) || 0;
      const avail = Math.max(0, qty - reserved);
      const inv = { quantity: qty, reservedQuantity: reserved, availableQuantity: avail };

      const isEligible =
        storedProduct.status === 'active' &&
        seller && seller.status === 'approved' &&
        store && store.sellerId === seller.id && store.status !== 'inactive' && store.status !== 'suspended' && store.status !== 'rejected' &&
        avail > 0;

      if (isEligible) {
        return res.json({ product: enrichMarketplaceProduct(storedProduct, store, inv) });
      }
      return res.status(404).json({ message: 'Product not found or currently unavailable.' });
    }

    res.status(404).json({ message: 'Product not found.' });
  } catch (error) { next(error); }
});
app.patch('/api/products/:id', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const productIndex = data.products.findIndex((item) => item.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const existingProduct = data.products[productIndex];
    const { errors, updates } = validateProductInput(req.body, true, existingProduct);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const updatedProduct = {
      ...existingProduct,
      ...updates,
      id: existingProduct.id,
      sellerId: existingProduct.sellerId,
      storeId: existingProduct.storeId,
      createdAt: existingProduct.createdAt,
      updatedAt: new Date().toISOString()
    };

    if (updates.was === null) {
      delete updatedProduct.was;
    }
    if (updates.badge === null) {
      delete updatedProduct.badge;
      delete updatedProduct.badgeType;
    }
    if (updates.brand === null) {
      delete updatedProduct.brand;
    }
    if (updates.image === null) {
      delete updatedProduct.image;
    }

    data.products[productIndex] = updatedProduct;
    await writeData(data);
    res.json({ product: updatedProduct });
  } catch (error) { next(error); }
});
app.get('/api/products', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const query = normalize(req.query.q);
    const category = normalize(req.query.category);

    const eligibleSellerProducts = getEligibleSellerProducts(data);
    const combinedCatalog = [...catalog, ...eligibleSellerProducts];

    const products = combinedCatalog.filter((item) => {
      const searchable = normalize(`${item.name} ${item.brand || ''} ${item.category} ${item.storeName || ''} ${(item.keywords || []).join(' ')}`);
      const searchableWords = searchable.split(' ');
      const queryMatches = !query || query.split(' ').every((term) => searchableWords.some((word) => word.startsWith(term)));
      return queryMatches && matchesCategory(item, category);
    });
    res.json({ products });
  } catch (error) { next(error); }
});
app.post('/api/orders', async (req, res, next) => {
  try {
    const { customer, items, paymentMethod, promoCode } = req.body || {};
    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address || !customer?.city || !customer?.postalCode || !Array.isArray(items) || items.length === 0 || !paymentMethod) {
      return res.status(400).json({ message: 'Please complete all customer, delivery, and payment fields.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(customer.email)) return res.status(400).json({ message: 'Please provide a valid email.' });
    if (!/^[0-9+()\-\s]{7,20}$/.test(customer.phone)) return res.status(400).json({ message: 'Please provide a valid phone number.' });
    if (!/^\d{4,10}$/.test(String(customer.postalCode))) return res.status(400).json({ message: 'Please provide a valid postal code.' });

    const data = await readStoredData();
    const verifiedItems = [];
    const inventoryUpdates = [];

    for (const rawItem of items) {
      const pid = rawItem.productId || rawItem.id;
      if (!pid) {
        return res.status(400).json({ message: 'Each item must have a valid product identifier.' });
      }

      const qty = Number(rawItem.quantity);
      if (!Number.isInteger(qty) || qty <= 0 || qty > 1000) {
        return res.status(400).json({ message: 'Item quantity must be a positive integer.' });
      }

      // 1. Check if it's a stored seller product
      const storedProduct = data.products.find((p) => p.id === pid);
      if (storedProduct) {
        if (storedProduct.status !== 'active') {
          return res.status(400).json({ message: `Product "${storedProduct.name}" is not active for purchase.` });
        }

        const seller = data.sellers.find((s) => s.id === storedProduct.sellerId);
        if (!seller || seller.status !== 'approved') {
          return res.status(400).json({ message: `Seller for product "${storedProduct.name}" is not approved.` });
        }

        const store = data.stores.find((st) => st.id === storedProduct.storeId);
        if (!store || store.sellerId !== seller.id || store.status === 'inactive' || store.status === 'suspended' || store.status === 'rejected') {
          return res.status(400).json({ message: `Store for product "${storedProduct.name}" is currently unavailable.` });
        }

        const invIndex = data.inventory.findIndex((inv) => inv.productId === storedProduct.id);
        const invRecord = invIndex !== -1 ? data.inventory[invIndex] : null;
        const currentQty = Number(invRecord?.quantity) || 0;
        const currentReserved = Number(invRecord?.reservedQuantity) || 0;
        const availableQty = currentQty - currentReserved;

        if (availableQty < qty) {
          return res.status(400).json({ message: `Product "${storedProduct.name}" is out of stock or does not have sufficient quantity available (Available: ${Math.max(0, availableQty)}).` });
        }

        verifiedItems.push({
          id: storedProduct.id,
          productId: storedProduct.id,
          name: storedProduct.name,
          price: Number(storedProduct.price),
          quantity: qty,
          sellerId: storedProduct.sellerId,
          storeId: storedProduct.storeId,
          status: 'confirmed'
        });

        const newReserved = currentReserved + qty;
        const newAvailable = Math.max(0, currentQty - newReserved);
        const updatedInv = {
          id: invRecord?.id || `inv-${randomUUID().slice(0, 8)}`,
          productId: storedProduct.id,
          sellerId: storedProduct.sellerId,
          storeId: storedProduct.storeId,
          quantity: currentQty,
          reservedQuantity: newReserved,
          availableQuantity: newAvailable,
          updatedAt: new Date().toISOString()
        };
        inventoryUpdates.push({ index: invIndex, record: updatedInv });
        continue;
      }

      // 2. Check if it's a legacy MVP catalog product
      const catalogProduct = catalog.find((p) => p.id === pid);
      if (catalogProduct) {
        verifiedItems.push({
          id: catalogProduct.id,
          productId: catalogProduct.id,
          name: catalogProduct.name,
          price: Number(catalogProduct.price),
          quantity: qty,
          status: 'confirmed'
        });
        continue;
      }

      // 3. Dynamic landing page items (e.g. reels / arrivals)
      const name = String(rawItem.name || '').trim();
      const clientPrice = Number(rawItem.price);
      if (name && !isNaN(clientPrice) && clientPrice > 0) {
        verifiedItems.push({
          id: String(pid),
          productId: String(pid),
          name: name.slice(0, 120),
          price: Math.round(clientPrice),
          quantity: qty,
          status: 'confirmed'
        });
        continue;
      }

      return res.status(400).json({ message: `Product "${pid}" could not be found in the catalog.` });
    }

    // Apply inventory updates
    for (const { index, record } of inventoryUpdates) {
      if (index !== -1) {
        data.inventory[index] = record;
      } else {
        data.inventory.push(record);
      }
    }

    const subtotal = verifiedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = subtotal >= 1500 ? 0 : 100;
    const discount = String(promoCode || '').trim().toUpperCase() === 'VASTAAR20' ? Math.round(subtotal * 0.2) : 0;
    const total = subtotal + delivery - discount;

    const sellerStatuses = {};
    for (const item of verifiedItems) {
      if (item.sellerId) {
        sellerStatuses[item.sellerId] = 'confirmed';
      }
    }

    const order = {
      id: `VST-${Date.now().toString(36).toUpperCase()}`,
      customer: {
        name: String(customer.name).trim(),
        email: String(customer.email).trim().toLowerCase(),
        phone: String(customer.phone).trim(),
        address: String(customer.address).trim(),
        city: String(customer.city).trim(),
        postalCode: String(customer.postalCode).trim()
      },
      items: verifiedItems,
      paymentMethod: String(paymentMethod).trim(),
      promoCode: String(promoCode || '').trim(),
      summary: { subtotal, delivery, discount, total },
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      ...(Object.keys(sellerStatuses).length > 0 ? { sellerStatuses } : {})
    };

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

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`VASTAAR API listening on http://localhost:${port}`));
}
