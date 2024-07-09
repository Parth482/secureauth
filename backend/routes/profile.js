const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    
    const userProfile = await User.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    userProfile.password = '************';
    const { username, email, name, phoneNumber, password } = userProfile;

    res.json({ username, email, name, phoneNumber, password });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/', async (req, res) => {
  try {
   
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const { name, phoneNumber } = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, { name, phoneNumber }, { new: true });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
