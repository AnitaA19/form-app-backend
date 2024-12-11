const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const connection = require('../config/config'); 
const router = express.Router();

router.post('/', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  connection.query('SELECT * FROM authUser WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database query error when checking email:', err);  
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    try {
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

      if (hashedPassword !== user.password) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user.ID, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({ message: 'Login successful', token, email: user.email });
    } catch (error) {
      console.error('Error while hashing password or generating token:', error);  
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
});

module.exports = router;
