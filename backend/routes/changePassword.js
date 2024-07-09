// routes/changePassword.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const sendPasswordChangeNotification = require('../emailUtil');

router.post('/change-password', async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare current password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);

        // If current password doesn't match, return error
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect current password' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password in the database
        user.password = hashedPassword;
        await user.save();

       // Send password change notification email
    await sendPasswordChangeNotification(email);

    res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
