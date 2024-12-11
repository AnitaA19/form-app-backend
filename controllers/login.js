const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const connection = require('../config/config');
const router = express.Router();

router.post('/', (req, res) => {
  const { email, password } = req.body;

  connection.query('SELECT * FROM authUser WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    if (hashedPassword !== user.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.ID, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, email: user.email });
  });
});

module.exports = router;
