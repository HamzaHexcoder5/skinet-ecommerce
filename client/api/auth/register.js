// Demo registration endpoint with validation and duplicate email checks.
const db = require('../_lib/db');
const { sign } = require('../_lib/auth');
const { validateRegister } = require('../_lib/validate');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ title: 'Method not allowed' });
  }

  const body = req.body || {};
  const errors = validateRegister(body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ title: 'Please fix the highlighted fields', errors });
  }

  const isSeller = body.storeName !== undefined;
  const user = db.createUser({
    firstName: String(body.firstName).trim(),
    lastName: String(body.lastName ?? '').trim(),
    email: String(body.email).trim(),
    password: String(body.password),
    role: isSeller ? 'seller' : 'customer',
    store: isSeller
      ? {
          name: String(body.storeName).trim(),
          slug: String(body.storeName).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          rating: 0,
          products: 0,
          joined: String(new Date().getFullYear())
        }
      : null
  });

  if (!user) {
    return res.status(409).json({
      title: 'An account with this email already exists',
      errors: { email: 'This email is already registered' }
    });
  }

  res.status(201).json({ token: sign({ sub: user.id, role: user.role }), user });
};
