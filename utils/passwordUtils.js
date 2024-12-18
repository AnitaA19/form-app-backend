const crypto = require('crypto');

const generateSalt = () => crypto.randomBytes(16).toString('hex');

const hashPassword = (password, salt) => 
    crypto.scryptSync(password, salt, 64).toString('hex');

const validatePassword = (storedPassword, salt, inputPassword) => {
    const hashedInputPassword = hashPassword(inputPassword, salt);
    return crypto.timingSafeEqual(
        Buffer.from(storedPassword, 'hex'), 
        Buffer.from(hashedInputPassword, 'hex')
    );
};

module.exports = {
    generateSalt,
    hashPassword,
    validatePassword
};