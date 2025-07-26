const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

function authMiddleware(handler) {
  return async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

function requireRole(role) {
  return function (handler) {
    return authMiddleware(async (req, res) => {
      if (req.user.role !== role) {
        return res.status(403).json({ error: 'Forbidden: insufficient role' });
      }
      return handler(req, res);
    });
  };
}

module.exports = authMiddleware;
module.exports.requireRole = requireRole; 