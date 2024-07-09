// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const { sendOtpEmail, sendPasswordChangeNotification, sendResetPasswordMail} = require('../emailUtil');
const { $or } = require('sift');
const changePassword = require('./changePassword');
const authenticateToken = require('./authMiddleware');
const { user } = require('../emailConfig');
const antiPhishingCode = 'fetched_anti_phishing_code';
const Randomstring = require('randomstring')






const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Generate and save OTP...
        const otp = await sendOtpEmail(email);

        //For hashing password 
        const hashedPassword = await bcrypt.hash(password, 10);

        //Creating new user
        const user = new User({ email, username, password: hashedPassword,otp });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route for verifying OTP during signup
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Fetch user from the database based on email
        const user = await User.findOne({ email });

        // Check if the user's OTP matches the entered OTP
        if (user && user.otp === otp) {
            // Clear or invalidate the OTP after successful verification
            user.otp = null;
            await user.save();

            if (process.env.NODE_ENV !== 'production') {
                console.log(`OTP verified for email: ${email}`);
            }

            // Generate JWT token for authentication
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.status(200).json({ message: 'OTP verified successfully', token });
        } else {
            // Respond with an error message for invalid OTP
            res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (error) {
        console.error(error);

        // Log only if not in production
        if (process.env.NODE_ENV !== 'production') {
            console.error(`Error during OTP verification: ${error.message}`);
        }

        res.status(500).json({ error: 'Internal server error' });
    }
});



// Route for verifying OTP during login
router.post('/verify-login-otp', async (req, res) => {
    try {
        const { identifier, otp } = req.body;

        console.log('Received OTP Verification Request:', identifier, otp);


        // Fetch user from the database based on identifier (email or username)
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });

        // Check if the user's OTP matches the entered OTP
        if (user && user.otp === otp) {
            // Clear or invalidate the OTP after successful verification
            user.otp = null;
            await user.save();

            if (process.env.NODE_ENV !== 'production') {
                console.log(`Login OTP verified for identifier: ${identifier}`);
            }

            // Generate JWT token for authentication
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.status(200).json({ message: 'Login OTP verified successfully', token });
        } else {
            // Respond with an error message for invalid OTP
            res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (error) {
        console.error(error);

        // Log only if not in production
        if (process.env.NODE_ENV !== 'production') {
            console.error(`Error during login OTP verification for identifier: ${identifier}`);
        }

        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Assuming you have the sendOtpEmail function for sending OTP
    const otp = await sendOtpEmail(user.email, user.antiPhishingCode);

    // Save the OTP to the user document
    user.otp = otp;
    await user.save();

    res.json({ message: 'Login successful. OTP sent for verification' });

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/change-password', async (req, res) => {
    try {
      // Extract password fields from request body
      const { password, newpassword, confirmpassword } = req.body;
  
      // Ensure all required fields are provided
      if (!password || !newpassword || !confirmpassword) {
        return res.status(400).json({ error: 'All password fields are required.' });
      }
  
      // Retrieve user ID from JWT token if Authorization header is present
      let userId;
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        userId = decodedToken.userId;
      } else {
        return res.status(401).json({ error: 'Authorization header missing.' });
      }
  
      // Fetch user from database
      const user = await User.findById(userId);
  
      // Validate current password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ error: 'Invalid current password.' });
      }
  
      // Validate new password and confirm password
      if (newpassword !== confirmpassword) {
        return res.status(400).json({ error: 'New password and confirm password must match.' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newpassword, 10);
  
      // Update user's password in the database
      user.password = hashedPassword;
      await user.save();
  
      // Assuming user email is stored in the user object
      const email = user.email;
  
      // Send password change notification
      await sendPasswordChangeNotification(email, user.antiPhishingCode);
  
      // Return success message
      res.json({ message: 'Password updated successfully.' });
    } catch (error) {
      console.error('Error changing password:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  router.post('/update-email', async (req, res) => {
    try {
        // Extract email fields from request body
        const { email, newemail } = req.body;

        // Ensure all required fields are provided
        if (!email || !newemail) {
            return res.status(400).json({ error: 'Both current email and new email are required.' });
        }

        // Retrieve user ID from JWT token
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        // Fetch user from database
        const user = await User.findById(userId);

        // Verify if the current email matches the user's email
        if (user.email !== email) {
            return res.status(400).json({ error: 'Current email does not match user email.' });
        }

        // Update user's email in the database
        user.email = newemail;
        await user.save();

        // Return success message
        res.json({ message: 'Email updated successfully.' });
    } catch (error) {
        console.error('Error updating email:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});
  
router.post('/update-anti-phishing-code', async (req, res) => {
    try {
      // Extract anti-phishing code from request body
      const { antiPhishingCode } = req.body;
  
      // Ensure anti-phishing code is provided
      if (!antiPhishingCode) {
        return res.status(400).json({ error: 'Anti-phishing code is required.' });
      }
  
      // Retrieve user ID from JWT token
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;
  
      // Fetch user from database
      const user = await User.findById(userId);
  
      // Update user's anti-phishing code in the database
      user.antiPhishingCode = antiPhishingCode;
      await user.save();
  
      // Return success message
      res.json({ message: 'Anti-phishing code updated successfully.' });
    } catch (error) {
      console.error('Error updating anti-phishing code:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

 
  router.delete('/delete-account', async (req, res) => {
    try {
        const { email } = req.body;
        // Find user by email and delete
        const deletedUser = await User.findOneAndDelete({ email });
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route for sending reset password link to user's email
router.post('/forget-password', async (req, res) => {
    try {
        const email = req.body.email;

        // Fetch the user data and anti-phishing code from the database
        let userData;
        try {
            userData = await User.findOne({ email: email });
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw new Error('Failed to fetch user data');
        }

        if (!userData) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const antiPhishingCode = userData.antiPhishingCode;

        // Generate a random token for password reset
        const randomString = Randomstring.generate();

        // Update the user's token in the database
        await User.updateOne({ email: email }, { $set: { token: randomString } });

        // Send the reset password email with the anti-phishing code
        await sendResetPasswordMail(userData.email, randomString, antiPhishingCode);

        return res.status(200).json({ success: true, msg: 'Please check your inbox' });
    } catch (error) {
        console.error('Error sending reset password link:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Route for resetting password using the token
// Route for resetting the password
router.post('/resetpassword', async (req, res) => {
    try {
        const { token, password: newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password are required.' });
        }

        // Retrieve the user data based on the token
        const userData = await User.findOne({ token });

        if (!userData) {
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }

        // Get the hashed password from the user data
        const hashedPasswordFromDB = userData.password;

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Compare the new password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(newPassword, hashedPasswordFromDB);

        if (passwordMatch) {
            return res.status(400).json({ error: 'New password must be different from the current password.' });
        }

        // Update the user's password in the database with the new password
        userData.password = hashedNewPassword;
        await userData.save();

        return res.status(200).json({ success: true, msg: "User Password has been reset" });

    } catch (error) {
        console.error('Error in reset password:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



  
module.exports = router;
