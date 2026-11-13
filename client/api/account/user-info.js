// Demo account endpoint for the static Vercel deployment.
// The storefront is browse-only here, so an anonymous session is always returned.
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(204).end();
};
