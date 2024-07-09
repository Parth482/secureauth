// dashboardRoutes.js

const express = require('express');
const router = express.Router();
const authenticateToken = require('./authMiddleware'); // Import the authentication middleware

// Dashboard route with middleware applied
router.get('/', authenticateToken, (req, res) => {
  // This code will only execute if the request has a valid JWT token
  // You can access the user ID from req.userId, which was set by the middleware
  
  // Example: Return a welcome message along with the user ID
  res.json({ message: 'Welcome to the dashboard!', userId: req.userId });
});

// Other routes and middleware for the dashboard...

module.exports = router;
