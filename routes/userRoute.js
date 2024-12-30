const express = require('express');
const { getUsers, deleteUser, makeAdmin, revokeAdmin } = require('../controllers/usersController');
const router = express.Router();

router.get('/users', getUsers);

router.delete('/users/:userId', deleteUser);

router.put('/users/:userId/make-admin', makeAdmin);

router.put('/users/:userId/revoke-admin', revokeAdmin);

module.exports = router;
