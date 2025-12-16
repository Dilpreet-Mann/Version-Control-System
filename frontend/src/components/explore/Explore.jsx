import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./explore.css";

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRepos, setUserRepos] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    // Fetch all users on load
    fetchUsers("");
  }, []);

  const fetchUsers = async (query) => {
    try {
      setLoading(true);
      // Try allUsers endpoint first, then filter by query
      const response = await fetch(`http://localhost:3002/allUsers`);
      const data = await response.json();
      console.log("Fetched users:", data);
      
      // Filter by search query and exclude current user
      let filteredUsers = Array.isArray(data) ? data : [];
      
      if (query) {
        filteredUsers = filteredUsers.filter(u => 
          u.username?.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      // Exclude current user
      filteredUsers = filteredUsers.filter(u => u._id !== currentUserId);
      
      setUsers(filteredUsers);
      
      // Fetch following status for all users
      if (currentUserId && filteredUsers.length > 0) {
        const statuses = {};
        for (const user of filteredUsers) {
          try {
            const statusRes = await fetch(
              `http://localhost:3002/followStatus?userId=${currentUserId}&targetUserId=${user._id}`
            );
            const statusData = await statusRes.json();
            statuses[user._id] = statusData.following;
          } catch {
            statuses[user._id] = false;
          }
        }
        setFollowingStatus(statuses);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchUsers(query);
  };

  const handleUserClick = async (user) => {
    if (selectedUser?._id === user._id) {
      setSelectedUser(null);
      setUserRepos([]);
      return;
    }
    
    setSelectedUser(user);
    try {
      const response = await fetch(`http://localhost:3002/repo/user/${user._id}`);
      const data = await response.json();
      setUserRepos(data.repositories || []);
    } catch (err) {
      console.error("Error fetching user repos:", err);
      setUserRepos([]);
    }
  };

  const handleFollow = async (targetUserId) => {
    console.log("handleFollow called", { currentUserId, targetUserId });
    
    if (!currentUserId) {
      console.log("No currentUserId, redirecting to auth");
      navigate("/auth");
      return;
    }

    try {
      const isFollowing = followingStatus[targetUserId];
      const endpoint = isFollowing ? "/unfollow" : "/follow";
      
      console.log("Calling API:", endpoint, { userId: currentUserId, targetUserId });
      
      const response = await fetch(`http://localhost:3002${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, targetUserId }),
      });

      const data = await response.json();
      console.log("API response:", response.status, data);

      if (response.ok) {
        // Update following status
        setFollowingStatus(prev => ({
          ...prev,
          [targetUserId]: !isFollowing
        }));
        
        // Update followers count in real-time
        setUsers(prev => prev.map(user => {
          if (user._id === targetUserId) {
            return {
              ...user,
              followersCount: isFollowing 
                ? (user.followersCount || 1) - 1 
                : (user.followersCount || 0) + 1
            };
          }
          return user;
        }));
      } else {
        console.error("API error:", data);
      }
    } catch (err) {
      console.error("Error following/unfollowing:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="explore-wrapper">
        <div className="explore-container">
          <h2>Explore Users</h2>
          <p className="explore-subtitle">Find developers and explore their repositories</p>

          <div className="search-section">
            <input
              type="text"
              className="user-search-input"
              placeholder="Search users by username..."
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
            />
          </div>

          {loading ? (
            <div className="loading-state">Loading...</div>
          ) : (
            <div className="users-list">
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user._id} className="user-card-wrapper">
                    <div 
                      className={`user-card ${selectedUser?._id === user._id ? 'user-card-selected' : ''}`}
                    >
                      <div className="user-card-main" onClick={() => handleUserClick(user)}>
                        <div className="user-avatar">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.username} />
                          ) : (
                            user.username?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="user-info">
                          <h4>{user.username}</h4>
                          {user.description && <p className="user-bio">{user.description}</p>}
                          <p className="user-email">{user.email}</p>
                          <div className="user-stats">
                            <span><span className="stat-count">{user.followersCount || 0}</span> followers</span>
                            <span><span className="stat-count">{user.followedUsers?.length || 0}</span> following</span>
                            <span><span className="stat-count">{user.repositories?.length || 0}</span> repos</span>
                          </div>
                        </div>
                      </div>
                      <button
                        className={`follow-btn ${followingStatus[user._id] ? 'following' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollow(user._id);
                        }}
                      >
                        {followingStatus[user._id] ? 'Unfollow' : 'Follow'}
                      </button>
                    </div>
                    
                    {selectedUser?._id === user._id && (
                      <div className="user-repos-section">
                        <h5>{user.username}'s Repositories</h5>
                        {userRepos.length > 0 ? (
                          <div className="user-repos-list">
                            {userRepos.map((repo) => (
                              <div 
                                key={repo._id} 
                                className="user-repo-item"
                                onClick={() => navigate(`/repo/${repo._id}`)}
                                style={{ cursor: "pointer" }}
                              >
                                <span className="repo-name">{repo.name}</span>
                                <span className="repo-desc">{repo.description || "No description"}</span>
                                <span className="view-repo-hint">Click to view →</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="no-repos">No repositories yet</p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>{searchQuery ? `No users found for "${searchQuery}"` : "No users found"}</p>
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Explore;

