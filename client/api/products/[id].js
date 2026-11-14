// Demo catalog item endpoint. Also answers /api/products/brands and
// /api/products/types so the catalog stays inside the function limit.
const db = require('../_lib/db');
const { products } = require('../_data/catalog');

module.exports = (req, res) => {
  const raw = req.query.id;

  if (raw === 'brands' || raw === 'types') {
    const values = [...new Set(products.map((product) => (raw === 'brands' ? product.brand : product.type)))];
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    return res.status(200).json(values.sort((a, b) => a.localeCompare(b)));
  }

  const product = db.getProduct(parseInt(raw, 10));

  if (!product) {
    return res.status(404).json({ title: 'Product not found', status: 404 });
  }

  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  res.status(200).json(product);
};
