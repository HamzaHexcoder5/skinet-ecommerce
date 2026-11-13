// Demo catalog endpoint for the static Vercel deployment.
const products = require('../_data/products');

module.exports = (req, res) => {
  const types = [...new Set(products.map((product) => product.type))].sort((a, b) => a.localeCompare(b));
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  res.status(200).json(types);
};
