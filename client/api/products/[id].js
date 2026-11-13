// Demo catalog endpoint for the static Vercel deployment.
const products = require('../_data/products');

module.exports = (req, res) => {
  const id = parseInt(req.query.id, 10);
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ title: 'Product not found', status: 404 });
  }

  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  res.status(200).json(product);
};
