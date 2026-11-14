// Token signing and verification for the demo API.
// Tokens are HMAC-SHA256 signed and expire after 24 hours.
const crypto = require('crypto');
const db = require('./db');

const SECRET = process.env.AUTH_SECRET || 'skinet-demo-signing-key-change-me';
const TTL_MS = 24 * 60 * 60 * 1000;

function sign(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(
    JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + TTL_MS })
  ).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verify(token) {
  if (!token) return null;
  const parts = String(token).split('.');
  if (parts.length !== 3) return null;

  const expected = crypto
    .createHmac('sha256', SECRET)
    .update(`${parts[0]}.${parts[1]}`)
    .digest('base64url');

  const a = Buffer.from(expected);
  const b = Buffer.from(parts[2]);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header) return null;
  const match = String(header).match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

/** Returns { user } when the request carries a valid session, otherwise { error, status }. */
function session(req) {
  const token = bearerToken(req);
  const payload = verify(token);
  if (!payload) {
    return { error: { title: 'Authentication required', status: 401 }, status: 401 };
  }

  const user = db.findUserById(payload.sub);
  if (!user) {
    return { error: { title: 'Session is no longer valid', status: 401 }, status: 401 };
  }

  return { user, token };
}

/** Same as session() but also enforces a role. */
function sessionWithRole(req, role) {
  const result = session(req);
  if (result.error) return result;
  if (result.user.role !== role) {
    return { error: { title: 'You do not have access to this resource', status: 403 }, status: 403 };
  }
  return result;
}

module.exports = { sign, verify, session, sessionWithRole };
