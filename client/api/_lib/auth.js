// Demo-only token helper. This is NOT authentication: the storefront runs
// without a backend on Vercel, so sessions are simulated on the client.
function issueToken(payload) {
  const body = Buffer.from(JSON.stringify({ ...payload, iat: Date.now() })).toString('base64url');
  return `demo.${body}.signature`;
}

function readToken(header) {
  if (!header) return null;
  const token = String(header).replace(/^Bearer\s+/i, '');
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

module.exports = { issueToken, readToken };
