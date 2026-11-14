// Single seller entry point: /api/seller/products, /api/seller/products/:id and
// /api/seller/orders. Vercel's Hobby plan allows 12 functions per deployment,
// so the seller surface is routed from one catch-all function.
const db = require('../_lib/db');
const { sessionWithRole } = require('../_lib/auth');
const { validateProduct } = require('../_lib/validate');

function segmentsOf(req) {
  const raw = req.query?.path;
  let parts;

  if (Array.isArray(raw) && raw.length) parts = raw.filter(Boolean);
  else if (typeof raw === 'string' && raw) parts = raw.split('/').filter(Boolean);
  else parts = String(req.url || '').split('?')[0].split('/').filter(Boolean);

  // Depending on how the function is mounted the leading segments differ:
  // /api/seller/products -> ['products'] or ['api','seller','products'].
  while (parts.length && (parts[0] === 'api' || parts[0] === 'seller')) parts.shift();

  return parts;
}

module.exports = (req, res) => {
  const result = sessionWithRole(req, 'seller');
  if (result.error) {
    return res.status(result.status).json(result.error);
  }

  const user = result.user;
  const [resource, id] = segmentsOf(req);

  if (resource === 'orders') return orders(req, res, user);
  if (resource === 'products') return products(req, res, user, id);

  return res.status(404).json({ title: 'Not found' });
};

function orders(req, res, user) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ title: 'Method not allowed' });
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(db.listOrdersForSeller(user.id));
}

function products(req, res, user, id) {
  if (id === undefined) {
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(db.listProductsByOwner(user.id));
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const errors = validateProduct(body);
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ title: 'Please fix the highlighted fields', errors });
      }

      const product = db.createProduct(user.id, {
        name: String(body.name).trim(),
        description: String(body.description ?? '').trim(),
        price: Number(body.price),
        stock: Number(body.stock),
        category: String(body.category),
        pictureUrl: String(body.pictureUrl),
        brand: String(body.brand ?? 'Skinet'),
        sellerName: user.store?.name ?? `${user.firstName}'s store`
      });

      return res.status(201).json(product);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ title: 'Method not allowed' });
  }

  const productId = Number(id);
  if (!Number.isFinite(productId)) {
    return res.status(400).json({ title: 'A valid product id is required' });
  }

  if (req.method === 'PUT') {
    const body = req.body || {};
    const errors = validateProduct(body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ title: 'Please fix the highlighted fields', errors });
    }

    const updated = db.updateProduct(user.id, productId, {
      name: String(body.name).trim(),
      description: String(body.description ?? '').trim(),
      price: Number(body.price),
      stock: Number(body.stock),
      category: String(body.category),
      pictureUrl: String(body.pictureUrl)
    });

    if (!updated) {
      return res.status(404).json({ title: 'Product not found in your store', status: 404 });
    }

    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const removed = db.deleteProduct(user.id, productId);
    if (!removed) {
      return res.status(404).json({ title: 'Product not found in your store', status: 404 });
    }
    return res.status(204).end();
  }

  res.setHeader('Allow', 'PUT, DELETE');
  return res.status(405).json({ title: 'Method not allowed' });
}
