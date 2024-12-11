const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');  // Генерирует случайную строку длиной 64 байта
console.log('Generated Secret Key:', secretKey);
