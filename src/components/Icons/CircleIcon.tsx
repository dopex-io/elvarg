import React from 'react';

const CircleIcon = ({ className, onClick }) => (
  <svg className={className} onClick={onClick}>
    <circle cx="5" cy="5" r="4" />
  </svg>
);

export default CircleIcon;
