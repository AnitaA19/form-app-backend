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
      console.error('Database query error when checking existing email:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    try {
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      console.log('Password hashed successfully:', hashedPassword);  

      connection.query('INSERT INTO authUser (email, password) VALUES (?, ?)', [email, hashedPassword], (err, results) => {
        if (err) {
          console.error('Database query error when inserting user:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
        const token = jwt.sign({ userId: results.insertId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'Registration successful', token, email });
      });
    } catch (error) {
      console.error('Error while hashing password:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
});

module.exports = router;
