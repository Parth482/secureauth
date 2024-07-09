const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String }, 
    antiPhishingCode: { type: String, }, 
    isDeleted: { type: Boolean, default: false },
    temporaryPassword: { type: String, default: null, },
    temporaryPasswordActive: { type: Boolean, default: false,},
    name: {type: String, },
    phoneNumber: { type: String},
    newpassword: { type: String },
    confirmpassword: { type: String },
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
    token: {type: String, default: ''},
  
});

const User = mongoose.model('User', userSchema);

module.exports = User;
