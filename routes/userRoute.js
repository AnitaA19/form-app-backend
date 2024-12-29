const express = require('express');
const { getUsers, deleteUser, makeAdmin, revokeAdmin } = require('../controllers/usersController');
const router = express.Router();

// Fetch all users
router.get('/users', getUsers);

// Delete a user
router.delete('/users/:userId', deleteUser);

// Make a user admin
router.put('/users/:userId/make-admin', makeAdmin);

// Revoke a user's admin role
router.put('/users/:userId/revoke-admin', revokeAdmin);

module.exports = router;
