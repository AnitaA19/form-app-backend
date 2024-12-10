const express = require('express');
const bcrypt = require('bcryptjs');
const connection = require('../config/config'); 
const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [rows] = await connection.execute('SELECT * FROM authUser WHERE email = ?', [email]);

        if (rows.length > 0) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        await connection.execute('INSERT INTO authUser (email, password) VALUES (?, ?)', [email, hashedPassword]);

        return res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.error('Error during registration', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
