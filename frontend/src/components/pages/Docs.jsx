import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./pages.css";

const Docs = () => {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container docs-page">
          <h1>Documentation</h1>
          <p className="last-updated">Learn how to use GitHub Clone</p>

          <section>
            <h2>Getting Started</h2>
            
            <div className="doc-card">
              <h3>1. Create an Account</h3>
              <p>Sign up with your email and create a secure password to get started.</p>
            </div>

            <div className="doc-card">
              <h3>2. Create a Repository</h3>
              <p>Click the + button in the navigation bar to create your first repository.</p>
            </div>

            <div className="doc-card">
              <h3>3. Initialize Locally</h3>
              <pre><code>node index.js init-linked</code></pre>
              <p>Link your local folder to your web repository.</p>
            </div>
          </section>

          <section>
            <h2>CLI Commands</h2>
            
            <div className="command-list">
              <div className="command-item">
                <code>node index.js init</code>
                <p>Initialize a new local repository</p>
              </div>

              <div className="command-item">
                <code>node index.js init-linked</code>
                <p>Initialize and link to web app repository</p>
              </div>

              <div className="command-item">
                <code>node index.js add &lt;file&gt;</code>
                <p>Stage a file for commit</p>
              </div>

              <div className="command-item">
                <code>node index.js commit "message"</code>
                <p>Commit staged files with a message</p>
              </div>

              <div className="command-item">
                <code>node index.js push</code>
                <p>Push commits to S3 storage</p>
              </div>

              <div className="command-item">
                <code>node index.js push-all</code>
                <p>Push to S3 AND MongoDB (shows on web)</p>
              </div>

              <div className="command-item">
                <code>node index.js pull</code>
                <p>Pull commits from S3</p>
              </div>

              <div className="command-item">
                <code>node index.js revert &lt;commitId&gt;</code>
                <p>Revert to a specific commit</p>
              </div>
            </div>
          </section>

          <section>
            <h2>Web Features</h2>
            <ul>
              <li><strong>Dashboard</strong> - View your repositories and recent commits</li>
              <li><strong>Explore</strong> - Find and follow other users</li>
              <li><strong>Repository View</strong> - See commits and file contents</li>
              <li><strong>Star Rating</strong> - Rate repositories you like</li>
              <li><strong>Profile</strong> - Manage your account and see stats</li>
            </ul>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Docs;

