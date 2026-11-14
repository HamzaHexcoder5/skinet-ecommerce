// Orders for the signed-in user. Requires a valid bearer token.
const db = require('../_lib/db');
const { session } = require('../_lib/auth');
const { validateOrder } = require('../_lib/validate');

module.exports = (req, res) => {
  const result = session(req);
  if (result.error) {
    return res.status(result.status).json(result.error);
  }

  const user = result.user;

  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(db.listOrders(user.id));
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const errors = validateOrder(body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ title: 'Please fix the highlighted fields', errors });
    }

    const order = db.addOrder(user.id, {
      placedAt: new Date().toISOString(),
      status: 'Processing',
      paymentMethod: body.paymentMethod === 'card' ? 'Card' : 'Cash on delivery',
      address: body.address,
      items: body.items,
      subtotal: Number(body.subtotal),
      shipping: Number(body.shipping),
      discount: Number(body.discount),
      total: Number(body.total)
    });

    return res.status(201).json(order);
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ title: 'Method not allowed' });
};
