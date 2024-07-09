// backend/emailUtils.js
const nodemailer = require('nodemailer');
const emailConfig = require('./emailConfig');
const User = require('./models/user');

const sendOtpEmail = async (email, antiPhishingCode) => {
  // Generate a random OTP (you may use a library for this)
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Save the OTP (you may want to store it in a database or in-memory cache)
  // For simplicity, let's assume you save it to a variable
  const otpStorage = { [email]: otp };

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },
  });

  // Send the OTP email
  const info = await transporter.sendMail({
    from: 'your_email@gmail.com',
    to: email,
    subject: 'Your OTP for 2FA',
    text: `Your OTP is: ${otp}\n\nAnti-Phishing Code: ${antiPhishingCode}`,
  });

  console.log('Email sent: ', info.response);

  return otp;
};

// Function to send password change notification
const sendPasswordChangeNotification = async (email, antiPhishingCode) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },
  });

  // Send the password change notification email
  const info = await transporter.sendMail({
    from: 'your_email@gmail.com',
    to: email,
    subject: 'Password Change Notification',
    text: `Dear User,\n\nWe are writing to inform you that your password has been successfully changed for your account with us.\n\nIf you did not initiate this password change, please contact our support team immediately to investigate this matter further.\n\nAnti-Phishing Code: ${antiPhishingCode}\n\nThank you for your attention to this matter.\n\nSincerely,\nSecureAuthPlus Support Team`,
  });

  console.log('Password Change Notification Email sent: ', info.response);
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.user, // Your Gmail email address
    pass: emailConfig.pass, // Your Gmail password
  }
});

const sendResetPasswordMail = async (email, token) => {
  try {
    // Find the user by email to get the latest anti-phishing code
    const userData = await User.findOne({ email });
    if (!userData || !userData.antiPhishingCode) {
      console.error('User data or anti-phishing code not found.');
      return;
    }
    
    const antiPhishingCode = userData.antiPhishingCode;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });

    // Construct the reset link with token
    const resetLink = `http://localhost:3001/resetpassword?token=${token}`;

    // Send the password change notification email
    const info = {
      from: 'your_email@gmail.com',
      to: email,
      subject: 'Reset Your Password',
      html: `<p> Hi, Click here <a href="${resetLink}"> to reset your password  </a>. Your anti-phishing code is: ${antiPhishingCode} </p>`
    };

    transporter.sendMail(info, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent:- ", info.response);
      }
    });
  } catch (error) {
    console.error('Error sending reset password email:', error);
  }
};





module.exports = {

  sendOtpEmail,
  sendPasswordChangeNotification,
  sendResetPasswordMail,

};
