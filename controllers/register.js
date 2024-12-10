const express = require('express');
const crypto = require('crypto');
const connection = require('../config/config');

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');

        const [rows] = await connection.execute('SELECT * FROM authUser WHERE email = ?', [email]);

        if (rows.length > 0) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        await connection.execute(
            'INSERT INTO authUser (email, password, salt) VALUES (?, ?, ?)',
            [email, hashedPassword, salt]
        );

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during registration', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
