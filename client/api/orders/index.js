// Demo order endpoint for the static Vercel deployment.
// Orders are kept in memory per serverless instance.
const { readToken } = require('../_lib/auth');

const orders = new Map();

module.exports = (req, res) => {
  const session = readToken(req.headers.authorization);
  const key = session && session.sub ? session.sub : 'guest';

  if (req.method === 'GET') {
    return res.status(200).json(orders.get(key) || []);
  }

  if (req.method === 'POST') {
    const payload = req.body || {};
    if (!payload.items || payload.items.length === 0) {
      return res.status(400).json({ title: 'An order needs at least one item' });
    }

    const order = {
      id: `SN-${Date.now().toString().slice(-8)}`,
      placedAt: new Date().toISOString(),
      status: 'Processing',
      paymentMethod: payload.paymentMethod || 'Cash on delivery',
      address: payload.address || null,
      items: payload.items,
      subtotal: payload.subtotal || 0,
      shipping: payload.shipping || 0,
      discount: payload.discount || 0,
      total: payload.total || 0
    };

    const list = orders.get(key) || [];
    orders.set(key, [order, ...list]);
    return res.status(201).json(order);
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ title: 'Method not allowed' });
};
