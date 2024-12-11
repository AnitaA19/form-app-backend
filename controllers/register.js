const express = require('express');
const crypto = require('crypto');
const connection = require('../config/config');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const [existingUsers] = await connection.execute(
            'SELECT id FROM authUser WHERE email = ?', 
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');

        await connection.execute(
            'INSERT INTO authUser (email, password, salt) VALUES (?, ?, ?)', 
            [email, hashedPassword, salt]
        );

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;