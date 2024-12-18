const connection = require('../config/config');
const { generateSalt, hashPassword, validatePassword } = require('../utils/passwordUtil');

exports.registerUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const [existingUsers] = await connection.execute(
            'SELECT id FROM authUser WHERE email = ?', 
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const salt = generateSalt();
        const hashedPassword = hashPassword(password, salt);

        await connection.execute(
            'INSERT INTO authUser (email, password, salt) VALUES (?, ?, ?)', 
            [email, hashedPassword, salt]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
};

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const [users] = await connection.execute(
            'SELECT id, email, password, salt FROM authUser WHERE email = ?', 
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const isValidPassword = validatePassword(user.password, user.salt, password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', userId: user.id });
    } catch (error) {
        next(error);
    }
};
