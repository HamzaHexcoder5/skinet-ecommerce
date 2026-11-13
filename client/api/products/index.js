// Demo catalog endpoint for the static Vercel deployment.
// The production backend is the .NET 8 Web API in /API.
const products = require('../_data/products');

const toList = (value) => (value ? String(value).split(',').filter(Boolean) : []);

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ title: 'Method not allowed' });
  }

  const query = req.query || {};
  const brands = toList(query.brands);
  const types = toList(query.types);
  const search = String(query.search || '').trim().toLowerCase();
  const pageIndex = Math.max(1, parseInt(query.pageIndex, 10) || 1);
  const pageSize = Math.max(1, parseInt(query.pageSize, 10) || 6);

  let items = products.filter((product) => {
    const matchesSearch = !search || product.name.toLowerCase().includes(search);
    const matchesBrand = brands.length === 0 || brands.includes(product.brand);
    const matchesType = types.length === 0 || types.includes(product.type);
    return matchesSearch && matchesBrand && matchesType;
  });

  if (query.sort === 'priceAsc') {
    items = items.sort((a, b) => a.price - b.price);
  } else if (query.sort === 'priceDesc') {
    items = items.sort((a, b) => b.price - a.price);
  } else {
    items = items.sort((a, b) => a.name.localeCompare(b.name));
  }

  const count = items.length;
  const start = pageSize * (pageIndex - 1);

  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  res.status(200).json({
    pageIndex,
    pageSize,
    count,
    data: items.slice(start, start + pageSize)
  });
};
