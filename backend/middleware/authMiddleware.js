const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token || !token.startsWith('Bearer ')) return res.status(403).json({ error: 'No token provided' });

  const actualToken = token.split(' ')[1];

  try {
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') return res.status(403).json({ error: 'Access denied' });
  next();
};

const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Access denied' });
    next();
};

module.exports = { verifyToken, isAdmin, isSuperAdmin };