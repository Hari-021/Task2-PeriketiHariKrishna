const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Expect Bearer <token> format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token format is invalid (should be Bearer <token>)' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_cyber_fintech_key_99812');
    req.user = decoded; // Contains id, email, etc.
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
