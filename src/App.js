import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import PrivateRoute from './Util/PrivateRoute';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AboutPage from './Pages/AboutPage';
import Profile from './Pages/Profile';
import Security from './Pages/Security';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';



function App() {
  const [action, setAction] = useState('login');

  return (
    <Routes>
    <Route path="/signup" element={<Signup setAction={setAction} />} />
    <Route path="/login" element={<Login setAction={setAction} />} />
    <Route path="/forgotpassword" element={<ForgotPassword setAction={setAction}/>}/>
    <Route path="/resetpassword" element={<ResetPassword setAction={setAction}/>}/>
    <Route path="/dashboard" element={<Dashboard setAction={setAction} />} />
    <Route path="/about" element={<AboutPage setAction={setAction}/>} />
    <Route path="/profile" element={<Profile setAction={setAction}/>} />
    <Route path="/security" element={<Security setAction={setAction}/>} />
    
    <Route path="/*" element={<Navigate to="/login" />} />
  </Routes>
  
  );
}

export default App;
