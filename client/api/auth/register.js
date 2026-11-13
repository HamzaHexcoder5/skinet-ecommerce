// Demo registration endpoint for the static Vercel deployment.
const { issueToken } = require('../_lib/auth');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ title: 'Method not allowed' });
  }

  const { firstName, lastName, email, password, storeName } = req.body || {};
  if (!firstName || !email || !password) {
    return res.status(400).json({ title: 'Name, email and password are required' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ title: 'Password must be at least 6 characters' });
  }

  const isSeller = Boolean(storeName);
  const user = {
    id: `u_${Buffer.from(String(email)).toString('base64url').slice(0, 10)}`,
    firstName: String(firstName),
    lastName: String(lastName || ''),
    email: String(email),
    role: isSeller ? 'seller' : 'customer',
    store: isSeller
      ? {
          name: String(storeName),
          slug: String(storeName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          rating: 0,
          products: 0,
          joined: String(new Date().getFullYear())
        }
      : null
  };

  res.status(201).json({ token: issueToken({ sub: user.id, role: user.role }), user });
};
