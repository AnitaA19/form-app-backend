const express = require('express');
const crypto = require('crypto');
const connection = require('../config/config');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const query = 'SELECT * FROM authUser WHERE email = ?';
  connection.execute(query, [email], (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    const { password: storedHash, salt } = user; 

    try {
      const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');

      if (hashedPassword === storedHash) {
        return res.status(200).json({ message: 'Login successful' });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (err) {
      console.error('Error during password verification', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });
});

module.exports = router;
