import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-contact-group">
        <div className="footer-contact-item">
          <span className="footer-icon">{/* ไอคอนโทรศัพท์ */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="10" fill="#E6F6FF"/>
              <path d="M6 7C6 10 10 14 13 14V12.5C13 12.2239 13.2239 12 13.5 12H15C15.2761 12 15.5 12.2239 15.5 12.5V15C15.5 15.2761 15.2761 15.5 15 15.5C8.64873 15.5 4.5 11.3513 4.5 5C4.5 4.72386 4.72386 4.5 5 4.5H7.5C7.77614 4.5 8 4.72386 8 5V6.5C8 6.77614 7.77614 7 7.5 7H6Z" fill="#3B82F6"/>
            </svg>
          </span>
          <span className="footer-contact-text">+123-456-7890</span>
        </div>
        <div className="footer-contact-item">
          <span className="footer-icon">{/* ไอคอน location */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="10" fill="#E6F6FF"/>
              <path d="M10 5C7.79086 5 6 6.79086 6 9C6 12.3137 10 15 10 15C10 15 14 12.3137 14 9C14 6.79086 12.2091 5 10 5ZM10 11C9.44772 11 9 10.5523 9 10C9 9.44772 9.44772 9 10 9C10.5523 9 11 9.44772 11 10C11 10.5523 10.5523 11 10 11Z" fill="#3B82F6"/>
            </svg>
          </span>
          <span className="footer-contact-text">สอบถามข้อมูลเพิ่มเติม</span>
        </div>
      </div>
      <div className="footer-map-group">
        <div className="footer-map-placeholder">
          {/* สามารถแทนที่ด้วย Google Maps Embed หรือ SVG แผนที่ */}
          <img src="/public/globe.svg" alt="map" style={{width:'100px',height:'100px'}} />
        </div>
      </div>
    </footer>
  );
} 