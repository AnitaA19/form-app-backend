const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('../config/config'); 
const router = express.Router();

router.post('/api/login', (req, res) => {
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

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (isMatch) {
        return res.status(200).json({ message: 'Login successful' });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    });
  });
});

module.exports = router;
