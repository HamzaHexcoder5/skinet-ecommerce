// Demo account endpoint for the static Vercel deployment.
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ isAuthenticated: false });
};
