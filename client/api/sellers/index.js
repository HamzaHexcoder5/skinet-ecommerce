// Demo seller endpoint for the static Vercel deployment.
const { sellers, products } = require('../_data/catalog');

module.exports = (req, res) => {
  const id = req.query && req.query.id ? Number(req.query.id) : null;

  if (!id) {
    return res.status(200).json(
      sellers.map((seller) => ({
        ...seller,
        productCount: products.filter((product) => product.sellerId === seller.id).length
      }))
    );
  }

  const seller = sellers.find((item) => item.id === id);
  if (!seller) {
    return res.status(404).json({ title: 'Seller not found', status: 404 });
  }

  res.status(200).json({
    ...seller,
    products: products.filter((product) => product.sellerId === seller.id)
  });
};
