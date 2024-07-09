// Login.jsx
import React, { Component, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import emailIcon from '../Assets/email.png';
import passwordIcon from '../Assets/password.png';
import image from '../Assets/image-right.png';
import {Link} from 'react-router-dom';





const Login = ({ setAction }) => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);

  const handleSignup = () => {
    // Redirect to the signup page
    navigate('/signup');
  };

  

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://3.109.122.70:3000/auth/login', {
        identifier,
        password,
      });
  
      console.log(response.data);
  
      // Handle successful login, e.g., store the token in state or localStorage
      const token = response.data.token;
if (token) {
  console.log('Token:', token);
  localStorage.setItem('token', token);
}



  
      // Assuming setAction is a function passed as a prop
    if (typeof setAction === 'function') {
      // Show the OTP popup
      setShowOtpPopup(true);
    } else {
      // Redirect to the dashboard
      navigate('/dashboard');
    
      }
    } catch (error) {
      console.error(error.response.data);
      // Handle login error, e.g., display an error message to the user
    }
  };
  const handleVerifyOtp = async () => {
    try {
      // Send a request to verify the OTP
      const response = await axios.post('http://localhost:3000/auth/verify-login-otp', {
        identifier,
        otp,
      });
  
      // Handle successful OTP verification
      const { message, token } = response.data;
  
      // Store the token in state or localStorage
      console.log('Token:', token);
      localStorage.setItem('token', token);
  
      // Redirect to the dashboard or perform other actions as needed
  
      // Hide the OTP popup
      setShowOtpPopup(false);
      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error(error.response.data);
      // Handle OTP verification error, e.g., display an error message to the user
    }
  };
  

  return (
    <div className="split-screen">
      <div className="left">
        <div className="login-form">
          <div className="header">
            <div className="text">Login</div>
          </div>
          <div className="inputs">
            <div className="input">
              <img src={emailIcon} alt="" />
              <input
                type="text"
                placeholder="Email or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
            <div className="input">
              <img src={passwordIcon} alt="" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="forgotpassword">
        <Link to="/forgotpassword">Forgot Password?</Link>
      </div>
          <div className="submit-container">
            <div className="submit" onClick={handleLogin}>
              Login
            </div>
            <div className="submit gray" onClick={handleSignup}>
              Sign Up
            </div>
          </div>
         
          {showOtpPopup && (
            <div className="otp-overlay">
              <div className="otp-popup">
                <input
                  type="text"
                  className="otp-input"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={handleVerifyOtp}>Verify OTP</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="image">
          <img src={image} alt="Right side image" />
        </div>
    </div>
    
  );
};

export default Login;
