// Returns the signed-in user for the current bearer token.
const { session } = require('../_lib/auth');

module.exports = (req, res) => {
  const result = session(req);
  if (result.error) {
    return res.status(result.status).json(result.error);
  }

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(result.user);
};
