// Demo basket endpoint for the static Vercel deployment.
// State is kept in memory per serverless instance, so it is reset on a cold start.
const carts = new Map();

module.exports = (req, res) => {
  const id = req.query && req.query.id ? String(req.query.id) : null;

  if (req.method === 'GET') {
    const cart = id ? carts.get(id) : null;
    if (!cart) {
      // Return an empty basket instead of a 404 so a stale id in localStorage
      // cannot break the storefront on a cold start.
      return res.status(200).json(id ? { id, items: [] } : null);
    }
    return res.status(200).json(cart);
  }

  if (req.method === 'POST') {
    const cart = req.body;
    if (!cart || !cart.id) {
      return res.status(400).json({ title: 'A cart with an id is required', status: 400 });
    }
    carts.set(String(cart.id), cart);
    return res.status(200).json(cart);
  }

  if (req.method === 'DELETE') {
    if (id) carts.delete(id);
    return res.status(204).end();
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).json({ title: 'Method not allowed' });
};
