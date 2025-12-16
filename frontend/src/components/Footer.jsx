import React from "react";
import "./footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <img 
            src="https://github.githubassets.com/favicons/favicon.svg" 
            alt="Logo" 
            className="footer-logo"
          />
          <span className="footer-copyright">© {currentYear} GitHub Clone, Inc.</span>
        </div>
        <div className="footer-links">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/security">Security</a>
          <a href="/status">Status</a>
          <a href="/docs">Docs</a>
          <a href="/community">Community</a>
          <a href="/contact">Contact</a>
          <a href="/manage-cookies">Manage cookies</a>
        </div>
        <div className="footer-secondary">
          <a href="/not-share">Do not share my personal information</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
