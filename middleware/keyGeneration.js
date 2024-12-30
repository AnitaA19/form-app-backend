const crypto = require('crypto');
const { SIZE_FOR_KEY_GENERATION } = require('../constants');
const secretKey = crypto.randomBytes(SIZE_FOR_KEY_GENERATION).toString('hex');  
console.log('Generated Secret Key:', secretKey);
