const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const connection = require('../config/config');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        console.log('Checking if email exists...');

        const [rows] = await connection.execute(
            'SELECT id FROM authUser WHERE email = ?',
            [email]
        );

        if (rows.length > 0) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');

        console.log('Inserting new user...');

        const [insertResult] = await connection.execute(
            'INSERT INTO authUser (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );

        const token = jwt.sign({ id: insertResult.insertId, email }, JWT_SECRET, { expiresIn: '1h' });

        console.log("Generated Token:", token); 

        return res.status(201).json({
            message: 'User registered successfully',
            token: token  
        });

    } catch (error) {
        console.error('Error during registration:', error.message);
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
});

module.exports = router;
