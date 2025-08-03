// REASON: This middleware protects admin-only routes.
const adminMiddleware = (req, res, next) => {
  // REASON: It checks the user object that was attached by the previous authMiddleware.
  if (req.user && req.user.role === 'admin') {
    // REASON: If the user's role is 'admin', it allows the request to proceed to the controller.
    next();
  } else {
    // REASON: If the user is not an admin, it denies access with a 'Forbidden' error.
    res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
  }
};

module.exports = adminMiddleware;