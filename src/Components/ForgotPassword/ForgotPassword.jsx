import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css'; // Import your CSS file for styling

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    try {
      
      const response = await axios.post('http://localhost:3000/auth/forget-password', { email});
     setSuccessMessage('Password Reset Mail Sent');

     
         
    } catch (error) {
      setError(error.response.data.error || 'Something went wrong');
      setSuccessMessage('');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSendResetLink}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={handleChange} required />
        </div>
        <button type="submit">Send Reset Link</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default ForgotPassword;
