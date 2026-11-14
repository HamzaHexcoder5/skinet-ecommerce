// In-memory demo data layer for the static Vercel deployment.
// Every serverless instance keeps its own copy, so writes are not shared
// between instances. The real persistence layer is the .NET API in /API.
const crypto = require('crypto');
const { products: seedProducts } = require('../_data/catalog');

const users = new Map();
const products = new Map();
const orders = new Map();

let nextProductId = 1000;

seedProducts.forEach((product) => {
  products.set(product.id, { ...product, ownerId: null, createdAt: Date.now() });
});

// Three starter products owned by the demo seller account.
[
  {
    id: 101,
    name: 'Alpine Pro Snowboard 155',
    description: 'All-mountain board with a poplar core and sintered base. Built for riders who want one setup for the whole season.',
    price: 320,
    category: 'Boards',
    stock: 12,
    pictureUrl: '/images/products/sb-ang1.png',
    brand: 'Skinet'
  },
  {
    id: 102,
    name: 'Thermal Grip Gloves',
    description: 'Waterproof shell with a grippy palm and touchscreen fingertips.',
    price: 24,
    category: 'Gloves',
    stock: 40,
    pictureUrl: '/images/products/glove-code1.png',
    brand: 'Skinet'
  },
  {
    id: 103,
    name: 'Summit Beanie',
    description: 'Merino blend beanie that keeps its shape after a full day on the mountain.',
    price: 18,
    category: 'Hats',
    stock: 0,
    pictureUrl: '/images/products/hat-core1.png',
    brand: 'Skinet'
  }
].forEach((item) => {
  products.set(item.id, {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    oldPrice: null,
    discountPercent: 0,
    pictureUrl: item.pictureUrl,
    images: [item.pictureUrl],
    type: item.category,
    brand: item.brand,
    category: item.category.toLowerCase(),
    quantityInStock: item.stock,
    rating: 0,
    ratingCount: 0,
    sold: 0,
    sellerId: 99,
    sellerName: 'Alpine Outfitters',
    freeShipping: item.price >= 120,
    ownerId: 'u_seller_demo',
    createdAt: Date.now()
  });
});

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return { salt, hash: crypto.scryptSync(password, salt, 64).toString('hex') };
}

function verifyPassword(password, salt, hash) {
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
}

function seedUser({ id, firstName, lastName, email, password, role, store }) {
  const { salt, hash } = hashPassword(password);
  users.set(email.toLowerCase(), {
    id,
    salt,
    hash,
    user: { id, firstName, lastName, email, role, store: store ?? null }
  });
}

seedUser({
  id: 'u_customer_demo',
  firstName: 'Demo',
  lastName: 'Customer',
  email: 'customer@skinet.dev',
  password: 'Customer@123',
  role: 'customer'
});

seedUser({
  id: 'u_seller_demo',
  firstName: 'Demo',
  lastName: 'Seller',
  email: 'seller@skinet.dev',
  password: 'Seller@123',
  role: 'seller',
  store: {
    name: 'Alpine Outfitters',
    slug: 'alpine-outfitters',
    rating: 4.6,
    products: 0,
    joined: '2025'
  }
});

function findUserByEmail(email) {
  return users.get(String(email).toLowerCase()) ?? null;
}

function findUserById(id) {
  for (const record of users.values()) {
    if (record.user.id === id) return record.user;
  }
  return null;
}

function createUser({ firstName, lastName, email, password, role, store }) {
  const normalised = String(email).toLowerCase();
  if (users.has(normalised)) return null;

  const id = `u_${crypto.randomBytes(6).toString('hex')}`;
  const { salt, hash } = hashPassword(password);
  const user = {
    id,
    firstName,
    lastName: lastName ?? '',
    email: normalised,
    role,
    store: store ?? null
  };

  users.set(normalised, { id, salt, hash, user });
  return user;
}

function listProducts() {
  return [...products.values()].sort((a, b) => a.id - b.id);
}

function getProduct(id) {
  return products.get(Number(id)) ?? null;
}

function createProduct(ownerId, data) {
  const product = {
    id: nextProductId++,
    name: data.name,
    description: data.description,
    price: data.price,
    oldPrice: data.oldPrice ?? null,
    discountPercent: data.discountPercent ?? 0,
    pictureUrl: data.pictureUrl,
    images: [data.pictureUrl],
    type: data.category,
    brand: data.brand ?? 'Skinet',
    category: String(data.category).toLowerCase(),
    quantityInStock: data.stock,
    rating: 0,
    ratingCount: 0,
    sold: 0,
    sellerId: 99,
    sellerName: data.sellerName,
    freeShipping: data.price >= 120,
    ownerId,
    createdAt: Date.now()
  };

  products.set(product.id, product);
  return product;
}

function updateProduct(ownerId, id, data) {
  const existing = products.get(Number(id));
  if (!existing || existing.ownerId !== ownerId) return null;

  const updated = {
    ...existing,
    name: data.name ?? existing.name,
    description: data.description ?? existing.description,
    price: data.price ?? existing.price,
    quantityInStock: data.stock ?? existing.quantityInStock,
    type: data.category ?? existing.type,
    category: data.category ? String(data.category).toLowerCase() : existing.category,
    pictureUrl: data.pictureUrl ?? existing.pictureUrl,
    images: [data.pictureUrl ?? existing.pictureUrl]
  };

  products.set(updated.id, updated);
  return updated;
}

function deleteProduct(ownerId, id) {
  const existing = products.get(Number(id));
  if (!existing || existing.ownerId !== ownerId) return false;
  return products.delete(Number(id));
}

function listProductsByOwner(ownerId) {
  return [...products.values()]
    .filter((product) => product.ownerId === ownerId)
    .sort((a, b) => b.id - a.id);
}

function addOrder(userId, order) {
  const list = orders.get(userId) ?? [];
  const record = { ...order, id: `SN-${Date.now().toString().slice(-8)}` };
  orders.set(userId, [record, ...list]);
  return record;
}

function listOrders(userId) {
  return orders.get(userId) ?? [];
}

// Orders that contain at least one product owned by this seller.
// Only the seller's own line items are returned so a store never sees
// another store's part of the same basket.
function listOrdersForSeller(ownerId) {
  const result = [];

  for (const list of orders.values()) {
    for (const order of list) {
      const items = order.items.filter((item) => {
        const product = products.get(Number(item.productId));
        return product && product.ownerId === ownerId;
      });

      if (items.length === 0) continue;

      result.push({
        ...order,
        items,
        sellerTotal: items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
      });
    }
  }

  return result.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  verifyPassword,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listProductsByOwner,
  addOrder,
  listOrders,
  listOrdersForSeller
};
