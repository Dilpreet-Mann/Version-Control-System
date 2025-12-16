import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./pages.css";

const Settings = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const res = await axios.get(`http://localhost:3002/userProfile/${userId}`);
          setUserDetails(res.data);
          setEmail(res.data.email || "");
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    if (password && password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const updateData = { email };
      if (password) updateData.password = password;

      await axios.put(`http://localhost:3002/updateProfile/${userId}`, updateData);
      setMessage("Settings saved successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage("Error saving settings");
      console.error(err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/auth");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      return;
    }
    const userId = localStorage.getItem("userId");
    try {
      await axios.delete(`http://localhost:3002/deleteProfile/${userId}`);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/auth");
    } catch (err) {
      setMessage("Error deleting account");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="settings-page">
        <div className="settings-container">
          <h2>Settings</h2>

          <div className="settings-section">
            <h3>Account</h3>
            
            <div className="settings-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className="settings-field">
              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
              />
            </div>

            <div className="settings-field">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            {message && <p className="settings-message">{message}</p>}

            <button className="save-btn" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="settings-section danger-zone">
            <h3>Danger Zone</h3>
            <p>Once you delete your account, there is no going back.</p>
            <button className="logout-btn" onClick={handleLogout}>
              Log Out
            </button>
            <button className="delete-btn" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Settings;

