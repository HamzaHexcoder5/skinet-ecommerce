// Demo category endpoint for the static Vercel deployment.
const { categories } = require('../_data/catalog');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  res.status(200).json(categories);
};
