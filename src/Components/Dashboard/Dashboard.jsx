import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import Footer from '../Footer/Footer';
import dashicon from '../Assets/dashicon.png';


const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Fetch dashboard data from the backend
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://3.109.122.70:3000/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <nav className="nav-links">
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/security">Security</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
          <div className="logo">SecureAuth+</div>
        </nav>
      </header>
      <img src={dashicon} alt="Dashboard icon" className="dashboard-icon"/>
      <div className="main-content">
         </div>
         <div className="dashboard-text">
        <p className="first-text">Enhanced Security Against</p>
        <p className="second-text">Unauthorized Access</p>
        <p className="third-text">Advanced authentication methods to safeguard user credentials and shield against phishing and credential-based attacks.</p>
      </div>
      <Footer/>
    </div>
  );
};

export default Dashboard;
