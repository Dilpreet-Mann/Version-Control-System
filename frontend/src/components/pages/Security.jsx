import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./pages.css";

const Security = () => {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container">
          <h1>Security</h1>
          <p className="last-updated">Your code security is our priority</p>

          <section>
            <h2>How We Protect Your Data</h2>
            
            <div className="security-card">
              <h3>Encryption</h3>
              <p>All data is encrypted in transit using TLS/SSL and at rest using AES-256 encryption.</p>
            </div>

            <div className="security-card">
              <h3>Password Security</h3>
              <p>Passwords are hashed using bcrypt with salt, ensuring they cannot be reversed.</p>
            </div>

            <div className="security-card">
              <h3>Secure Storage</h3>
              <p>Code and files are stored in AWS S3 with server-side encryption enabled.</p>
            </div>

            <div className="security-card">
              <h3>Authentication</h3>
              <p>JWT tokens are used for secure session management with automatic expiration.</p>
            </div>
          </section>

          <section>
            <h2>Security Best Practices</h2>
            <ul>
              <li>Use a strong, unique password</li>
              <li>Never share your credentials</li>
              <li>Review repository access permissions regularly</li>
              <li>Keep sensitive data out of public repositories</li>
              <li>Use environment variables for secrets</li>
            </ul>
          </section>

          <section>
            <h2>Report a Vulnerability</h2>
            <p>
              If you discover a security vulnerability, please report it responsibly to 
              security@githubclone.com. We appreciate your help in keeping our platform secure.
            </p>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Security;

