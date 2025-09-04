import React from 'react';

export default function Header() {
  return (
    <header className="header-container">
      <div className="header-logo-group">
        <span className="header-logo">{/* โลโก้ SVG */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#E6F6FF"/>
            <rect x="12" y="18" width="16" height="4" rx="2" fill="#3B82F6"/>
            <rect x="18" y="12" width="4" height="16" rx="2" fill="#3B82F6"/>
          </svg>
        </span>
        <span className="header-title">General Clinic</span>
      </div>
      <div className="header-right-group">
        <span className="header-logo-text">GENERAL CLINIC</span>
        <span className="header-logo-small">{/* โลโก้ซ้ำขนาดเล็ก */}
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#E6F6FF"/>
            <rect x="12" y="18" width="16" height="4" rx="2" fill="#3B82F6"/>
            <rect x="18" y="12" width="4" height="16" rx="2" fill="#3B82F6"/>
          </svg>
        </span>
      </div>
    </header>
  );
} 