const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { STATUS_CODES } = require('../constants'); 
const router = express.Router();

router.post('/', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Email and password are required' });
  }

  User.findByEmail(email, (err, results) => {
    if (err) {
      console.error('Database query error when checking email:', err);
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }

      if (!isMatch) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user.ID, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(STATUS_CODES.SUCCESS).json({ message: 'Login successful', token, email: user.email });
    });
  });
});

module.exports = router;
