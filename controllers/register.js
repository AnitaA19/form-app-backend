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
      console.error('Database query error when checking existing email:', err);
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Email already in use' });
    }

    User.create(email, password, (err, user) => {
      if (err) {
        console.error('Error creating user:', err);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }

      const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(STATUS_CODES.CREATED).json({ message: 'Registration successful', token, email });
    });
  });
});

module.exports = router;
