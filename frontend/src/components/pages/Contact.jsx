import React, { useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./pages.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-container">
          <h1>Contact Us</h1>
          <p className="last-updated">We'd love to hear from you</p>

          <div className="contact-grid">
            <section className="contact-form-section">
              <h2>Send us a message</h2>
              
              {submitted ? (
                <div className="success-message">
                  <p>Thank you for your message. We will get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="bug">Report a Bug</option>
                      <option value="feature">Feature Request</option>
                      <option value="billing">Billing Question</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows="5"
                      required
                    />
                  </div>

                  <button type="submit" className="submit-btn">Send Message</button>
                </form>
              )}
            </section>

            <section className="contact-info-section">
              <h2>Other ways to reach us</h2>
              
              <div className="contact-card">
                <h3>Email</h3>
                <p>support@githubclone.com</p>
              </div>

              <div className="contact-card">
                <h3>Community</h3>
                <p>Join our Discord server for community support</p>
              </div>

              <div className="contact-card">
                <h3>Bug Reports</h3>
                <p>Report issues on our GitHub repository</p>
              </div>

              <div className="contact-card">
                <h3>Location</h3>
                <p>San Francisco, CA</p>
              </div>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Contact;

