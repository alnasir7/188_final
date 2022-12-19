/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import '../../style/About.css';

function About({ group }) {
  return (
    <div className="about-wrapper">
      <div className="about-text-wrapper">
        <div id="about-title">
          About
          {' '}
          {group.name}
        </div>
        <hr/>
        <div id="about-content">
          {group.description}
        </div>
      </div>
    </div>
  );
}

export default About;
