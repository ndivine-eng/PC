const express = require('express');
const router = express.Router(); // Initialize a new Express router

// Import controller functions
const { registerUser, loginUser, getAllUsers } = require('../controllers/userController');

// Define routes and bind controller functions

// POST /api/users/register → Handles user registration
router.post('/register', registerUser);

// POST /api/users/login → Handles user login
router.post('/login', loginUser);

// GET /api/users → Retrieves all users
router.get('/', getAllUsers);

// Export the router to be used in your main server file
module.exports = router;
