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
        console.log('Checking if email exists...');

        connection.execute(
            'SELECT id FROM authUser WHERE email = ?',
            [email],
            async (err, results) => {
                if (err) {
                    console.error('Error checking email:', err.message);
                    return res.status(500).json({ error: 'Server error while checking email' });
                }
                
                if (results.length > 0) {
                    return res.status(409).json({ error: 'Email already in use' });
                }
    
                const salt = crypto.randomBytes(16).toString('hex');
                const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');
    
                console.log('Inserting new user...');
                try {
                    await connection.execute(
                        'INSERT INTO authUser (email, password) VALUES (?, ?)',
                        [email, hashedPassword]
                    );
                    return res.status(201).json({ message: 'User registered successfully' });
                } catch (insertError) {
                    console.error('Error inserting new user:', insertError.message);
                    return res.status(500).json({ error: 'Server error while inserting user' });
                }
            }
        );
    } catch (error) {
        console.error('Error during registration:', error.message);
        console.error('Stack trace:', error.stack);
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
});

module.exports = router;
