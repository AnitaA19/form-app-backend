const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('../config/config'); 
const router = express.Router();

router.post('/register', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password', err);
            return res.status(500).json({ message: 'Server error' });
        }

        const checkEmailQuery = 'SELECT * FROM authUser WHERE email = ?';
        connection.execute(checkEmailQuery, [email], (err, results) => {
            if (err) {
                console.error('Error executing query', err);
                return res.status(500).json({ message: 'Server error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'Email is already in use' });
            }

            const insertUserQuery = 'INSERT INTO authUser (email, password) VALUES (?, ?)';
            connection.execute(insertUserQuery, [email, hashedPassword], (err, results) => {
                if (err) {
                    console.error('Error inserting user into database', err);
                    return res.status(500).json({ message: 'Server error' });
                }

                return res.status(201).json({ message: 'User registered successfully' });
            });
        });
    });
});

module.exports = router;
