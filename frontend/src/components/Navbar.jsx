import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PlusIcon, PersonIcon, SearchIcon, PeopleIcon, GearIcon, MoonIcon, SunIcon, XIcon } from "@primer/octicons-react";
import axios from "axios";
import "./navbar.css";

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isProfilePage = location.pathname === "/profile";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const res = await axios.get(`http://localhost:3002/userProfile/${userId}`);
          setUserDetails(res.data);
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleProfileClick = (e) => {
    e.preventDefault();
    if (isProfilePage) {
      navigate(-1);
    } else {
      navigate("/profile");
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <nav>
        <div className="nav-left">
          <button className="menu-toggle" aria-label="Menu" onClick={toggleSidebar}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 2.75A.75.75 0 011.75 2h12.5a.75.75 0 010 1.5H1.75A.75.75 0 011 2.75zm0 5A.75.75 0 011.75 7h12.5a.75.75 0 010 1.5H1.75A.75.75 0 011 7.75zM1.75 12a.75.75 0 000 1.5h12.5a.75.75 0 000-1.5H1.75z"></path>
            </svg>
          </button>
          <Link to="/" className="logo-link">
            <img
              src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
              alt="GitHub Logo"
              className="logo-img"
            />
            <span className="logo-text">Dashboard</span>
          </Link>
        </div>
        
        <div className="nav-center">
          <div className="search-container">
            <SearchIcon className="search-icon" size={16} />
            <input 
              type="text" 
              className="nav-search" 
              placeholder={searchQuery !== undefined ? "Find a repository..." : "Type / to search"}
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              readOnly={!setSearchQuery}
            />
          </div>
        </div>

        <div className="nav-right">
          <Link to="/explore" className="nav-icon-link" title="Explore Users">
            <PeopleIcon size={16} />
          </Link>
          <Link to="/create" className="nav-icon-link" title="Create a Repository">
            <PlusIcon size={16} />
          </Link>
          <button 
            className="nav-icon-link" 
            title="Profile"
            onClick={handleProfileClick}
          >
            <PersonIcon size={16} />
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`} onClick={toggleSidebar}></div>
      
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <XIcon size={16} />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="sidebar-user" onClick={() => { navigate("/profile"); toggleSidebar(); }}>
          <div className="sidebar-avatar">
            {userDetails?.profileImage ? (
              <img src={userDetails.profileImage} alt="Profile" />
            ) : (
              userDetails?.username?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-username">{userDetails?.username || "Guest"}</span>
            <span className="sidebar-email">{userDetails?.email || ""}</span>
          </div>
        </div>

        {userDetails?.description && (
          <p className="sidebar-bio">{userDetails.description}</p>
        )}

        <div className="sidebar-divider"></div>

        {/* Navigation Links */}
        <div className="sidebar-nav">
          <Link to="/" className="sidebar-link" onClick={toggleSidebar}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6.906.664a1.749 1.749 0 0 1 2.187 0l5.25 4.2c.415.332.657.835.657 1.367v7.019A1.75 1.75 0 0 1 13.25 15h-3.5a.75.75 0 0 1-.75-.75V9H7v5.25a.75.75 0 0 1-.75.75h-3.5A1.75 1.75 0 0 1 1 13.25V6.23c0-.531.242-1.034.657-1.366l5.25-4.2Z"></path>
            </svg>
            Dashboard
          </Link>
          <Link to="/profile" className="sidebar-link" onClick={toggleSidebar}>
            <PersonIcon size={16} />
            Profile
          </Link>
          <Link to="/explore" className="sidebar-link" onClick={toggleSidebar}>
            <PeopleIcon size={16} />
            Explore
          </Link>
          <Link to="/create" className="sidebar-link" onClick={toggleSidebar}>
            <PlusIcon size={16} />
            New Repository
          </Link>
        </div>

        <div className="sidebar-divider"></div>

        {/* Settings Section */}
        <div className="sidebar-section">
          <h4>Settings</h4>
          
          <div className="sidebar-setting">
            <span>
              {darkMode ? <MoonIcon size={16} /> : <SunIcon size={16} />}
              {darkMode ? "Dark Mode" : "Light Mode"}
            </span>
            <button 
              className={`theme-toggle ${darkMode ? "dark" : "light"}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>

          <Link to="/settings" className="sidebar-link" onClick={toggleSidebar}>
            <GearIcon size={16} />
            Settings
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
