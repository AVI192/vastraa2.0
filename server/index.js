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

const categoryEmojiMap = {
  'Ethnic Wear': '👗',
  'Western': '👕',
  'Kids': '👶',
  'Footwear': '👟',
  'Jewellery': '💎',
  'Bags': '👜',
  'Beauty': '🧴',
  'Men': '👔',
  'Women': '🥻',
  'Accessories': '🧣',
  'Home & Living': '🧺'
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
  return String(value || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
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
app.get('/api/sellers/:id/dashboard', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const seller = data.sellers.find((item) => item.id === req.params.id);
    if (!seller) return res.status(404).json({ message: 'Seller not found.' });
    const store = data.stores.find((item) => item.sellerId === seller.id) || null;
    const sellerProducts = data.products.filter((item) => item.sellerId === seller.id);
    const sellerInventory = data.inventory.filter((item) => item.storeId === store?.id || sellerProducts.some((product) => product.id === item.productId));
    const sellerOrders = data.orders.filter((order) => order.items?.some((item) => item.sellerId === seller.id || item.storeId === store?.id));
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

    if (updates.city !== undefined) {
      const city = String(updates.city || '').trim();
      if (!city || city.length > 60) {
        return res.status(400).json({ message: 'Please provide a valid city name.' });
      }
      store.city = city;
    }

    if (updates.district !== undefined) {
      const district = String(updates.district || '').trim();
      if (district.length > 60) {
        return res.status(400).json({ message: 'District name cannot exceed 60 characters.' });
      }
      store.district = district;
    }

    if (updates.address !== undefined) {
      const address = String(updates.address || '').trim();
      if (!address || address.length > 200) {
        return res.status(400).json({ message: 'Please provide a valid store address.' });
      }
      store.address = address;
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
      store.email = email;
    }

    if (updates.openingHours !== undefined) {
      const openingHours = String(updates.openingHours || '').trim();
      if (openingHours.length > 100) {
        return res.status(400).json({ message: 'Opening hours cannot exceed 100 characters.' });
      }
      store.openingHours = openingHours;
    }

    await writeData(data);
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

    const defaultEmoji = categoryEmojiMap[updates.category] || '🛍️';
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

    const defaultEmoji = categoryEmojiMap[updates.category] || '🛍️';
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
app.get('/api/products/:id', async (req, res, next) => {
  try {
    const data = await readStoredData();
    const storedProduct = data.products.find((item) => item.id === req.params.id);
    if (storedProduct) {
      return res.json({ product: storedProduct });
    }
    const catalogProduct = catalog.find((item) => item.id === req.params.id);
    if (catalogProduct) {
      return res.json({ product: catalogProduct });
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
    const query = normalize(req.query.q);
    const category = normalize(req.query.category);
    const products = catalog.filter((item) => {
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
