import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; // Import CSS for styling
import Footer from '../Components/Footer/Footer';
import defaultavatar from '../Components/Assets/male-avatar.png';

const Profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '******', // Initial value for password field
    name: '',
    phoneNumber: '',
    avatar:'',
    // Add other profile fields as needed
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch user profile data from the backend
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Attach JWT token for authentication
          },
        });
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send updated user profile data to the backend
      await axios.put('http://localhost:3000/profile', userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Attach JWT token for authentication
        },
      });
      setMessage('Profile updated successfully'); // Success message set karein
    } catch (error) {
      console.error('Error updating user profile:', error);
      setMessage('Failed to update profile'); // Fail message set karein
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading placeholder
  }

  return (
    <div className="profile-container">
      <div className="card">
        <div className="avatar-selection">
          <h2>Profile</h2>
          <img src={defaultavatar} alt="Default Avatar" className="avatar" />
        </div>

        <div className="profile-details">
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" value={userData.username} readOnly />
            </div>
            <div className="input-field">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" value={userData.email} readOnly />
            </div>
            <div className="input-field">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" value={userData.password} readOnly />
            </div>
            <div className="input-field">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" value={userData.name} onChange={handleChange} />
            </div>
            <div className="input-field">
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input type="text" id="phoneNumber" name="phoneNumber" value={userData.phoneNumber} onChange={handleChange} />
            </div>
            <button type="submit">Update Profile</button>
            {message && <div className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</div>}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
