const bcrypt = require('bcrypt');
const db = require('../config/config.js');

const registerUser = (req, res) => {
    const { email, password } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка при хэшировании пароля' });
        }

        const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.query(query, [email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Ошибка при регистрации' });
            }
            res.status(201).json({ message: 'Пользователь зарегистрирован успешно' });
        });
    });
};

const loginUser = (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка при поиске пользователя' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Ошибка при сравнении паролей' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Неверный пароль' });
            }

            res.status(200).json({ message: 'Вход успешен' });
        });
    });
};

module.exports = { registerUser, loginUser };
