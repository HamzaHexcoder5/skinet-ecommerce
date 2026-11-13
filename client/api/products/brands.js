// Demo catalog endpoint for the static Vercel deployment.
const { products } = require('../_data/catalog');

module.exports = (req, res) => {
  const brands = [...new Set(products.map((product) => product.brand))].sort((a, b) => a.localeCompare(b));
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  res.status(200).json(brands);
};
