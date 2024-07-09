// Signup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Signup.css';
import imageright from '../Assets/signup-right.png'

import userIcon from '../Assets/person.png';
import emailIcon from '../Assets/email.png';
import passwordIcon from '../Assets/password.png';

const Signup = ({ setAction }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      //signup logic...
      const response = await axios.post('http://3.109.122.70:3000/auth/signup', {
        username,
        email,
        password,
      });

      console.log(response.data);

      // Show OTP popup after successful signup
      setShowOtpPopup(true);
    } catch (error) {
      console.error(error.response.data);
      // Handle signup error, e.g., display an error message to the user
    }
  };

  const handleVerifyOtp = async () => {
    try {
      // Verify OTP
      const response = await axios.post('http://3.109.122.70:3000/auth/verify-otp', { email, otp });
      console.log('Sending OTP verification request with data:', { email, otp });
      // If OTP is verified, close the popup and proceed to the dashboard
      setShowOtpPopup(false);
      navigate('/login');
    } catch (error) {
      console.error(error);
      // Handle OTP verification error
    }
  };

  const redirectToLogin = () => {
    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="split-screen-signup-container">
    <div className="ssplit-screen-signup-form">
      <div className="split-screen-signup-header">
        <div className="signup-text">Sign Up</div>
        <div></div>
        <div className="split-screen-signup-text1">Let's get started!</div>
      </div>
      <div className="split-screen-signup-inputs">
        <div className="split-screen-signup-input">
          <img src={userIcon} alt="" />
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="split-screen-signup-input">
          <img src={emailIcon} alt="" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="split-screen-signup-input">
          <img src={passwordIcon} alt="" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
      <div className="split-screen-signup-submit-container">
        <div className="split-screen-signup-submit" onClick={handleSignUp}>
          Sign Up
        </div>
        <div className="split-screen-signup-submit signup-gray" onClick={redirectToLogin}>
          Login
        </div>
      </div>
    </div>

    <div className="split-screen-right-side-content">
   <img src={imageright} alt="signup-image"/>
    </div>

    {/* OTP Popup */}
    {showOtpPopup && (
      <div className="split-screen-signup-otp-overlay">
        <div className="split-screen-signup-otp-popup">
          <input type="text" className='split-screen-signup-otp-input' placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      </div>
    )}
  </div>

  );
};

Signup.propTypes = {
  setAction: PropTypes.func.isRequired,
};

export default Signup;
