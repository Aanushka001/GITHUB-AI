// src/components/Footer.jsx

import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      GITHUB-AI &copy; {new Date().getFullYear()} | Built by 
      <a href="https://github.com/Aanushka001" target="_blank" rel="noopener noreferrer">
        Aanushka
      </a>
    </footer>
  );
};

export default Footer;
