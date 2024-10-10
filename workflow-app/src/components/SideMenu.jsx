// import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Make sure to install react-router-dom for routing
import { useAuth } from '../context-providers/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSignOutAlt } from 'react-icons/fa'; // Importing icons


const SideMenu = () => {
  
  const { logout } = useAuth();
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout(); 
    setTimeout(() => { navigate('/'); }, 100);   
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{ width: '200px' }}>
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
        <span className="fs-4">App</span>
      </a>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/" className="text-dark">
          <FaHome /> Home
        </Nav.Link> 
        <Nav.Link as={Link} to="#" onClick={handleLogout} className="text-dark">
          <FaSignOutAlt /> Logout
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default SideMenu;
