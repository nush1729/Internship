const jwt = require('jsonwebtoken');

// REASON: This function acts as a gatekeeper for protected API routes.
module.exports = function(req, res, next) {
  // REASON: It gets the token from the request header. This is the standard way to send tokens.
  const token = req.header('x-auth-token');

  // REASON: If no token is provided, it denies access immediately.
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // REASON: This block tries to verify the token is valid and hasn't expired.
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // REASON: If the token is valid, it attaches the user's information (like their ID) to the request object, so controllers can use it.
    req.user = decoded.user;
    next();
  } catch (err) {
    // REASON: If the token is invalid (e.g., tampered with or expired), it sends an error.
    res.status(401).json({ msg: 'Token is not valid' });
  }
};