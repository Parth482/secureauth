import React, { useState } from 'react';
import axios from 'axios';
import './Security.css';
import Footer from '../Components/Footer/Footer';

const Security = () => {
  const [passwordData, setPasswordData] = useState({
    password: '',
    newpassword: '',
    confirmpassword: ''
  });
  const [emailData, setEmailData] = useState({
    email:'',
    newemail:'',
  });
  const [antiPhishingCodeData, setantiPhishingCodeData] = useState({
    antiPhishingCode:''
  }
  )
  
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUpdateEmail, setShowUpdateEmail] = useState(false); 
  const [showDeleteAccountForm, setShowDeleteAccountForm] = useState(false);
  const [showUpdateantiPhishingCode, setShowUpdateantiPhishingCode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setEmailData({ ...emailData, [name]: value });
    setantiPhishingCodeData({ ...antiPhishingCodeData, [name]:value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/auth/change-password', passwordData, {  
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccessMessage(response.data.message);
      setError(null);
    } catch (error) {
      setError(error.response.data.error);
      setSuccessMessage('');
    }
  };

    const handleUpdateEmail = async (e) =>{
      e.preventDefault();
  try {
    const response = await axios.post('http://localhost:3000/auth/update-email', emailData, {  
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setSuccessMessage(response.data.message);
    setError(null);
  } catch (error) {
    setError(error.response.data.error);
    setSuccessMessage('');
  }
};

const handleUpdateantiPhishingCode = async (e) =>{
  e.preventDefault();
try {
const response = await axios.post('http://localhost:3000/auth/update-anti-phishing-code', antiPhishingCodeData, {  
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
setSuccessMessage(response.data.message);
setError(null);
} catch (error) {
setError(error.response.data.error);
setSuccessMessage('');
}
};



const handleDeleteAccount = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.delete('http://localhost:3000/auth/delete-account', {
      data: { email: emailData.email } // Send email in request body
    });
    setSuccessMessage(response.data.message);
    setError('');
  } catch (error) {
    setError(error.response.data.error || 'Something went wrong');
    setSuccessMessage('');
  }
};
  

  const handleToggleChangePassword = () => {
    setShowChangePassword(!showChangePassword);
  };

  const handleToggleUpdateEmail = () => {
    setShowUpdateEmail(!showUpdateEmail);
  };

  const handleToggleUpdateantiPhishingCode = () => {
    setShowUpdateantiPhishingCode(!showUpdateantiPhishingCode);
  }

  const handleToggleDeleteAccountForm = () => {
    setShowDeleteAccountForm(!showDeleteAccountForm);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  

  return (
    <div className="security-page-container">
      <div className="card">
        <div className="feature-section">
          <h2>Security Settings</h2>
          <div className="security-options">
            <div className="security-option" onClick={handleToggleChangePassword}>
              Change Password
            </div>
            <div className="security-option" onClick={handleToggleUpdateEmail}>
              Update Email
            </div>
            <div className="security-option" onClick={handleToggleUpdateantiPhishingCode}>
              Update anti-Phishing Code
            </div>
       
            <div className="security-option" onClick={handleToggleDeleteAccountForm}>
              Delete Account
            </div>
          </div>
        </div>
        <div className="form-section">
          {showChangePassword && (
            <form onSubmit={handleSubmit}>
              <div className="security-option">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={passwordData.password} onChange={handleChange} required />
                <label htmlFor="newpassword">New Password:</label>
                <input type="password" id="newpassword" name="newpassword" value={passwordData.newpassword} onChange={handleChange} required />
                <label htmlFor="confirmpassword">Confirm New Password:</label>
                <input type="password" id="confirmpassword" name="confirmpassword" value={passwordData.confirmpassword} onChange={handleChange} required />
                <button type="submit" >Change Password</button>
                {successMessage && <div className="success-message">{successMessage}</div>}
              </div>
            </form>
          )}

          {showUpdateEmail && (
            <form onSubmit={handleUpdateEmail}>
              <div className="security-option">
                <label htmlFor="email">Current Email:</label>
                <input type="email" id="email" name="email" value={emailData.email} onChange={handleChange} required />
                <label htmlFor="newemail">New Email:</label>
                <input type="email" id="newemail" name="newemail" value={emailData.newemail} onChange={handleChange} required />
                <button type="submit">Update Email</button>
                {successMessage && <div className="success-message">{successMessage}</div>}
              </div>
            </form>
          )}

            {showUpdateantiPhishingCode && (
            <form onSubmit={handleUpdateantiPhishingCode}>
              <div className="security-option">
              <label htmlFor="antiPhishingCode">Anti-Phishing Code:</label>
                <input type="antiPhishingCode" id="antiPhishingCode" name="antiPhishingCode" value={antiPhishingCodeData.antiPhishingCode} onChange={handleChange} required />
                <button type="submit">Update Anti-Phishing Code</button>
                {successMessage && <div className="success-message">{successMessage}</div>}
              </div>
            </form>
          )}

          {showDeleteAccountForm && (
            <form onSubmit={handleDeleteAccount}>
              <div className="security-option">
              <label htmlFor="email">Current Email:</label>
                <input type="email" id="email" name="email" value={emailData.email} onChange={handleChange} required />
                <button type="submit">Delete Account</button>
                {successMessage && <div className="success-message">{successMessage}</div>}
              </div>
            </form>
          )}

        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Security;
