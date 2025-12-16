import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon, PencilIcon } from "@primer/octicons-react";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const [followersCount, setFollowersCount] = useState(0);
  const { setCurrentUser } = useAuth();
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3002/userProfile/${userId}`
          );
          setUserDetails(response.data);
          setDescription(response.data.description || "");
          
          // Fetch all users to calculate followers count
          const allUsersRes = await axios.get(`http://localhost:3002/allUsers`);
          const allUsers = allUsersRes.data;
          
          // Count how many users are following current user
          const followers = allUsers.filter(u => 
            u.followedUsers?.some(id => id.toString() === userId || id === userId)
          ).length;
          setFollowersCount(followers);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      setUploading(true);
      const base64Image = reader.result;
      const userId = localStorage.getItem("userId");
      
      try {
        await axios.put(`http://localhost:3002/updateProfile/${userId}`, {
          profileImage: base64Image,
        });
        setUserDetails((prev) => ({ ...prev, profileImage: base64Image }));
      } catch (err) {
        console.error("Error uploading image:", err);
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDescriptionSave = async () => {
    const userId = localStorage.getItem("userId");
    try {
      await axios.put(`http://localhost:3002/updateProfile/${userId}`, {
        description,
      });
      setUserDetails((prev) => ({ ...prev, description }));
      setIsEditingDesc(false);
    } catch (err) {
      console.error("Error updating description:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 var(--spacing-lg)" }}>
        <UnderlineNav aria-label="Repository" style={{ marginBottom: "var(--spacing-lg)" }}>
          <UnderlineNav.Item
            aria-current="page"
            icon={BookIcon}
            sx={{
              backgroundColor: "transparent",
              color: "var(--color-text-primary)",
              "&:hover": {
                color: "var(--color-text-primary)",
              },
            }}
          >
            Overview
          </UnderlineNav.Item>

          <UnderlineNav.Item
            onClick={() => navigate("/repo")}
            icon={RepoIcon}
            sx={{
              backgroundColor: "transparent",
              color: "var(--color-text-secondary)",
              "&:hover": {
                color: "var(--color-text-primary)",
              },
            }}
          >
            Starred Repositories
          </UnderlineNav.Item>
        </UnderlineNav>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setCurrentUser(null);
          window.location.href = "/auth";
        }}
        id="logout"
      >
        Logout
      </button>

      <div className="profile-page-wrapper">
        <div className="user-profile-section">
          <div 
            className="profile-image-container"
            onClick={() => fileInputRef.current?.click()}
          >
            {userDetails.profileImage ? (
              <img src={userDetails.profileImage} alt="Profile" className="profile-image-img" />
            ) : (
              <div className="profile-image">
                {userDetails.username ? userDetails.username.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="profile-image-overlay">
              {uploading ? "Uploading..." : "Change Photo"}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>

          <div className="name">
            <h3>{userDetails.username || "Username"}</h3>
          </div>

          <div className="description-section">
            {isEditingDesc ? (
              <div className="description-edit">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a bio..."
                  maxLength={200}
                />
                <div className="description-actions">
                  <button onClick={handleDescriptionSave} className="save-btn">Save</button>
                  <button onClick={() => { setIsEditingDesc(false); setDescription(userDetails.description || ""); }} className="cancel-btn">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="description-view" onClick={() => setIsEditingDesc(true)}>
                <p>{userDetails.description || "Add a bio..."}</p>
                <PencilIcon size={14} />
              </div>
            )}
          </div>

          <div className="follower">
            <p>
              <strong>{followersCount}</strong> followers
            </p>
            <p>
              <strong>{userDetails.followedUsers?.length || 0}</strong> following
            </p>
          </div>
        </div>

        <div className="profile-content">
          <div className="heat-map-section">
            <HeatMapProfile />
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Profile;
