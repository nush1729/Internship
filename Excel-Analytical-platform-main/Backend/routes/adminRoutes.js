const express = require('express');
const router = express.Router();
// REASON: Imports the new admin controller logic.
const { getAllUsers, deleteUser } = require('../controllers/adminController');
// REASON: Imports both security middlewares.
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// REASON: Defines the endpoint to get all users. It's protected by two middlewares:
// 1. authMiddleware: Ensures the user is logged in.
// 2. adminMiddleware: Ensures the logged-in user is an admin.
router.get('/users', [authMiddleware, adminMiddleware], getAllUsers);

// REASON: Defines the endpoint to delete a user, also protected by both middlewares.
router.delete('/users/:id', [authMiddleware, adminMiddleware], deleteUser);

module.exports = router;