const express = require('express');
const loginRouter = require('../controllers/login');
const registerRouter = require('../controllers/register');

const router = express.Router();

router.use('/login', loginRouter);
router.use('/register', registerRouter);

module.exports = router;
