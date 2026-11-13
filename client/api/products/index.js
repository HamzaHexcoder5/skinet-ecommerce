// Demo catalog endpoint for the static Vercel deployment.
// The production backend is the .NET 8 Web API in /API.
const { products } = require('../_data/catalog');

const toList = (value) => (value ? String(value).split(',').filter(Boolean) : []);
const num = (value) => (value === undefined || value === '' ? null : Number(value));

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ title: 'Method not allowed' });
  }

  const query = req.query || {};
  const brands = toList(query.brands);
  const types = toList(query.types);
  const categories = toList(query.categories);
  const search = String(query.search || '').trim().toLowerCase();
  const minPrice = num(query.minPrice);
  const maxPrice = num(query.maxPrice);
  const minRating = num(query.minRating);
  const onlyDeals = String(query.deals || '') === 'true';
  const pageIndex = Math.max(1, parseInt(query.pageIndex, 10) || 1);
  const pageSize = Math.max(1, parseInt(query.pageSize, 10) || 12);

  let items = products.filter((product) => {
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search) ||
      product.type.toLowerCase().includes(search);
    const matchesBrand = brands.length === 0 || brands.includes(product.brand);
    const matchesType = types.length === 0 || types.includes(product.type);
    const matchesCategory = categories.length === 0 || categories.includes(product.category);
    const matchesMin = minPrice === null || product.price >= minPrice;
    const matchesMax = maxPrice === null || product.price <= maxPrice;
    const matchesRating = minRating === null || product.rating >= minRating;
    const matchesDeals = !onlyDeals || product.discountPercent > 0;
    return (
      matchesSearch && matchesBrand && matchesType && matchesCategory &&
      matchesMin && matchesMax && matchesRating && matchesDeals
    );
  });

  switch (query.sort) {
    case 'priceAsc':
      items = items.sort((a, b) => a.price - b.price);
      break;
    case 'priceDesc':
      items = items.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      items = items.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      items = items.sort((a, b) => b.id - a.id);
      break;
    case 'popular':
      items = items.sort((a, b) => b.sold - a.sold);
      break;
    case 'discount':
      items = items.sort((a, b) => b.discountPercent - a.discountPercent);
      break;
    default:
      items = items.sort((a, b) => a.name.localeCompare(b.name));
  }

  const count = items.length;
  const start = pageSize * (pageIndex - 1);

  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  res.status(200).json({
    pageIndex,
    pageSize,
    count,
    totalPages: Math.max(1, Math.ceil(count / pageSize)),
    data: items.slice(start, start + pageSize)
  });
};
