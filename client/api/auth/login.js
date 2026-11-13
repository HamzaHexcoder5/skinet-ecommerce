// Demo login endpoint for the static Vercel deployment.
const { issueToken } = require('../_lib/auth');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ title: 'Method not allowed' });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ title: 'Email and password are required' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ title: 'Password must be at least 6 characters' });
  }

  const isSeller = String(email).toLowerCase().startsWith('seller');
  const name = String(email).split('@')[0].replace(/[._-]/g, ' ');
  const user = {
    id: `u_${Buffer.from(String(email)).toString('base64url').slice(0, 10)}`,
    firstName: isSeller ? 'Demo' : name.charAt(0).toUpperCase() + name.slice(1),
    lastName: isSeller ? 'Seller' : 'Customer',
    email: String(email),
    role: isSeller ? 'seller' : 'customer',
    store: isSeller
      ? { name: 'Demo Store', slug: 'demo-store', rating: 4.6, products: 12, joined: '2024' }
      : null
  };

  res.status(200).json({ token: issueToken({ sub: user.id, role: user.role }), user });
};
