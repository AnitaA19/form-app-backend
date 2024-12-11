const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const connection = require('../config/config');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Check if the user exists in the database
        const [results] = await connection.execute('SELECT * FROM authUser WHERE email = ?', [email]);

        // Log the result to check its structure
        console.log("Query Results:", results);

        // Ensure the results are an array and not empty
        if (!results || results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0]; // Access the first user from results array
        const { password: storedHash, salt, id } = user;

        if (!storedHash || !salt) {
            return res.status(500).json({ message: 'Server error: Invalid password data' });
        }

        const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');

        if (hashedPassword === storedHash) {
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ message: 'Login successful', token });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ message: 'Server error', details: err.message });
    }
});

module.exports = router;
