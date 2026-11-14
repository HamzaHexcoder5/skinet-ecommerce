// Demo login endpoint with real password verification and signed tokens.
const db = require('../_lib/db');
const { sign } = require('../_lib/auth');
const { validateLogin } = require('../_lib/validate');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ title: 'Method not allowed' });
  }

  const body = req.body || {};
  const errors = validateLogin(body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ title: 'Please fix the highlighted fields', errors });
  }

  const record = db.findUserByEmail(body.email);
  if (!record || !db.verifyPassword(String(body.password), record.salt, record.hash)) {
    return res.status(401).json({ title: 'Email or password is incorrect', status: 401 });
  }

  res.status(200).json({
    token: sign({ sub: record.user.id, role: record.user.role }),
    user: record.user
  });
};
