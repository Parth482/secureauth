// AboutPage.jsx

import React from 'react';
import './AboutPage.css';
import about from '../Components/Assets/aboutuss.png';
import Footer from '../Components/Footer/Footer';

const AboutPage = () => {
  return (
    <div className="about-container">      
      <img src={about} alt="About us" className="about-us-image"/>    
    <Footer/>
    </div>
  );
};

export default AboutPage;
