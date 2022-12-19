import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className=" custom-nav" id="navbar">
    <div className="flex-nav-container container">
      <Link to="/main" style={{
        color: 'white',
        textDecoration: 'none'
      }}>
        <div className="flexItem img-container">
          <img src={`${process.env.PUBLIC_URL}/icons/message-circle.svg`} alt="ChitChat Icon"/>
        </div>
      </Link>
      <div className="spacer">
        Chitchat
      </div>
      <div style={{ marginRight: '10px' }} className="flexItem"/>
      <div className="flexItem " style={{ cursor: 'pointer' }}>
        <i className="fas fa-shopping-cart"/>
      </div>
    </div>
  </nav>
);

export default Navbar;
