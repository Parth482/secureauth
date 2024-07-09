import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './ResetPassword.css';

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        if (token) {
            // Set the token in the component state if it exists in the URL
            // You can use it later when submitting the form
            // setToken(token);
        }
    }, [location.search]);

    const handleResetPassword = async () => {
        try {
            const searchParams = new URLSearchParams(location.search);
            const token = searchParams.get('token');
            if (!token) {
                throw new Error('Token not found in URL');
            }

            const response = await axios.post('http://3.109.122.70:3000/auth/resetpassword', {
                token: token,
                password: newPassword
            });
            setMessage(response.data.msg);
        } catch (error) {
            setMessage(error.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <button onClick={handleResetPassword}>Reset Password</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ResetPassword;
