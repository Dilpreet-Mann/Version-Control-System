import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./pages.css";

const Community = () => {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container">
          <h1>Community</h1>
          <p className="last-updated">Connect with developers worldwide</p>

          <section>
            <h2>Join Our Community</h2>
            <p>
              GitHub Clone is built by developers, for developers. Join thousands of 
              developers who are using our platform to collaborate and build amazing projects.
            </p>
          </section>

          <section>
            <h2>Community Links</h2>
            <div className="community-links">
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="community-card">
                <h3>Discord</h3>
                <p>Chat with other developers in real-time</p>
              </a>

              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="community-card">
                <h3>Twitter</h3>
                <p>Follow us for updates and news</p>
              </a>

              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="community-card">
                <h3>GitHub</h3>
                <p>Contribute to our open source project</p>
              </a>

              <Link to="/explore" className="community-card">
                <h3>Explore Users</h3>
                <p>Find and follow developers on our platform</p>
              </Link>
            </div>
          </section>

          <section>
            <h2>Community Stats</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">1,000+</span>
                <span className="stat-label">Developers</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">5,000+</span>
                <span className="stat-label">Repositories</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">50,000+</span>
                <span className="stat-label">Commits</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">100+</span>
                <span className="stat-label">Countries</span>
              </div>
            </div>
          </section>

          <section>
            <h2>Top Contributors</h2>
            <p>
              Our community is powered by amazing contributors. 
              <Link to="/explore"> Explore users</Link> to find top developers and their projects.
            </p>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Community;

