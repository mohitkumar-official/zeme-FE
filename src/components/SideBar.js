import React from 'react';

const SideBar = () => {
  return (
    <div className="sidebar">
      <a href="/" className="sidebar-item active">
        <i className="icon">🏠</i>
        <span>Home</span>
      </a>
      <a href="/" className="sidebar-item">
        <i className="icon">🔖</i>
        <span>Saved Listings</span>
      </a>
    </div>
  );
};

export default SideBar;
