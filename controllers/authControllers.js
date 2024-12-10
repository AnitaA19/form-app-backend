const bcrypt = require('bcrypt');
const db = require('../config/config.js');

// Регистрация пользователя
const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Проверяем, существует ли уже пользователь с таким email
        const checkQuery = 'SELECT * FROM users WHERE email = ?';
        const [existingUser] = await db.promise().query(checkQuery, [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Вставляем нового пользователя в базу данных
        const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
        await db.promise().query(query, [email, hashedPassword]);

        res.status(201).json({ message: 'Пользователь зарегистрирован успешно' });
    } catch (err) {
        console.error('Ошибка при регистрации:', err);
        res.status(500).json({ message: 'Ошибка при регистрации' });
    }
};

// Логин пользователя
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [user] = await db.promise().query(query, [email]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Сравниваем пароли
        const isMatch = await bcrypt.compare(password, user[0].password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Неверный пароль' });
        }

        res.status(200).json({ message: 'Вход успешен' });
    } catch (err) {
        console.error('Ошибка при входе:', err);
        res.status(500).json({ message: 'Ошибка при входе' });
    }
};

module.exports = { registerUser, loginUser };
