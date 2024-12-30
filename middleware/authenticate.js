const jwt = require('jsonwebtoken');
const { STATUS_CODES } = require('../constants');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Access Denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid Token' });
  }
};

module.exports = authenticate;
