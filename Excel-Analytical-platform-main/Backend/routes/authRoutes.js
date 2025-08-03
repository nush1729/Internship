const express = require('express');
const router = express.Router();

// REASON: Imports all required functions from the authController in a single, clean statement. This ensures no function is missed.
const {
    register,
    login,
    checkUser,
    getUserProfile,
    updateUserProfile
} = require('../controllers/authController');

// REASON: Imports the security middleware needed to protect routes.
const authMiddleware = require('../middleware/authMiddleware');

// --- Public Routes (No login required) ---
router.post('/register', register);
router.post('/login', login);
router.get('/check/:email', checkUser);

// --- Protected Routes (Login required) ---
// REASON: The 'authMiddleware' is placed before the controller function to protect the route.
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;