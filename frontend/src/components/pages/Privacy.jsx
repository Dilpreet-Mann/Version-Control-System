import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./pages.css";

const Privacy = () => {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: December 2024</p>

          <section>
            <h2>Information We Collect</h2>
            <h3>Account Information</h3>
            <ul>
              <li>Username and email address</li>
              <li>Password (encrypted)</li>
              <li>Profile information you provide</li>
            </ul>

            <h3>Usage Data</h3>
            <ul>
              <li>Repositories you create</li>
              <li>Commits and code you upload</li>
              <li>Interactions with other users</li>
            </ul>
          </section>

          <section>
            <h2>How We Use Your Information</h2>
            <ul>
              <li>To provide and maintain our service</li>
              <li>To authenticate your identity</li>
              <li>To store and display your repositories</li>
              <li>To enable collaboration features</li>
              <li>To improve our platform</li>
            </ul>
          </section>

          <section>
            <h2>Data Storage</h2>
            <p>
              Your data is stored securely using MongoDB for metadata and AWS S3 for 
              file storage. We implement industry-standard security measures to protect 
              your information.
            </p>
          </section>

          <section>
            <h2>Data Sharing</h2>
            <p>
              We do not sell your personal information. Your public repositories are 
              visible to other users. Private repositories are only accessible to you.
            </p>
          </section>

          <section>
            <h2>Your Rights</h2>
            <ul>
              <li>Access your personal data</li>
              <li>Delete your account and data</li>
              <li>Export your repositories</li>
              <li>Update your information</li>
            </ul>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              For privacy-related questions, contact us at privacy@githubclone.com
            </p>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Privacy;

