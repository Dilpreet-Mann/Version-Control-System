import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./pages.css";

const Status = () => {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container">
          <h1>System Status</h1>
          <p className="last-updated">All systems operational</p>

          <section>
            <h2>Current Status</h2>
            
            <div className="status-list">
              <div className="status-item operational">
                <span className="status-indicator"></span>
                <span className="status-name">API Server</span>
                <span className="status-label">Operational</span>
              </div>

              <div className="status-item operational">
                <span className="status-indicator"></span>
                <span className="status-name">Database (MongoDB)</span>
                <span className="status-label">Operational</span>
              </div>

              <div className="status-item operational">
                <span className="status-indicator"></span>
                <span className="status-name">File Storage (S3)</span>
                <span className="status-label">Operational</span>
              </div>

              <div className="status-item operational">
                <span className="status-indicator"></span>
                <span className="status-name">Authentication</span>
                <span className="status-label">Operational</span>
              </div>

              <div className="status-item operational">
                <span className="status-indicator"></span>
                <span className="status-name">Web Application</span>
                <span className="status-label">Operational</span>
              </div>
            </div>
          </section>

          <section>
            <h2>Recent Incidents</h2>
            <div className="incident-list">
              <p className="no-incidents">No incidents reported in the last 30 days.</p>
            </div>
          </section>

          <section>
            <h2>Uptime</h2>
            <div className="uptime-stats">
              <div className="uptime-stat">
                <span className="uptime-value">99.9%</span>
                <span className="uptime-label">Last 30 days</span>
              </div>
              <div className="uptime-stat">
                <span className="uptime-value">99.95%</span>
                <span className="uptime-label">Last 90 days</span>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Status;

