import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./pages.css";

const Terms = () => {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last updated: December 2024</p>

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using GitHub Clone, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              GitHub Clone is a version control platform that allows users to:
            </p>
            <ul>
              <li>Create and manage code repositories</li>
              <li>Track changes with commits</li>
              <li>Collaborate with other developers</li>
              <li>Store code securely in the cloud</li>
            </ul>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials 
              and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2>4. User Content</h2>
            <p>
              You retain ownership of content you create. By uploading content, you grant us 
              a license to store and display your content as necessary to provide the service.
            </p>
          </section>

          <section>
            <h2>5. Prohibited Activities</h2>
            <ul>
              <li>Uploading malicious code or malware</li>
              <li>Violating intellectual property rights</li>
              <li>Harassing other users</li>
              <li>Attempting to breach security measures</li>
            </ul>
          </section>

          <section>
            <h2>6. Termination</h2>
            <p>
              We reserve the right to terminate accounts that violate these terms or 
              engage in harmful activities.
            </p>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Terms;

