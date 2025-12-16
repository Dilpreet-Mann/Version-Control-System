import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import StarRating from "../StarRating";

const Dashboard = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedSearchQuery, setSuggestedSearchQuery] = useState("");
  const [filteredSuggestedRepos, setFilteredSuggestedRepos] = useState([]);
  const [recentCommits, setRecentCommits] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repoCommits, setRepoCommits] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/repo/user/${userId}`
        );
        const data = await response.json();
        // Handle case where user has no repositories (404) or data.repositories is undefined
        setRepositories(data.repositories || []);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
        setRepositories([]);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3002/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
        setSuggestedRepositories([]);
      }
    };

    const fetchRecentCommits = async () => {
      try {
        const response = await fetch(`http://localhost:3002/commit/all`);
        const data = await response.json();
        console.log("Fetched commits:", data); // Debug log
        setRecentCommits(Array.isArray(data) ? data.slice(0, 10) : []);
      } catch (err) {
        console.error("Error fetching commits: ", err);
        setRecentCommits([]);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
    fetchRecentCommits();
  }, []);

  const handleRepoClick = async (repo) => {
    if (selectedRepo?._id === repo._id) {
      setSelectedRepo(null);
      setRepoCommits([]);
      return;
    }
    setSelectedRepo(repo);
    try {
      const response = await fetch(`http://localhost:3002/commit/repo/${repo._id}`);
      const data = await response.json();
      setRepoCommits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching repo commits: ", err);
      setRepoCommits([]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    if (searchQuery == "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  useEffect(() => {
    if (suggestedSearchQuery == "") {
      setFilteredSuggestedRepos(suggestedRepositories);
    } else {
      const filtered = suggestedRepositories.filter((repo) =>
        repo.name.toLowerCase().includes(suggestedSearchQuery.toLowerCase())
      );
      setFilteredSuggestedRepos(filtered);
    }
  }, [suggestedSearchQuery, suggestedRepositories]);

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <section id="dashboard">
        <aside className="left-sidebar">
          <div className="top-repositories-section">
            <h3>Suggested Repositories</h3>
            <div className="sidebar-search-container">
              <input
                type="text"
                className="sidebar-search-input"
                placeholder="Find a repository..."
                value={suggestedSearchQuery}
                onChange={(e) => setSuggestedSearchQuery(e.target.value)}
              />
            </div>
            {filteredSuggestedRepos.length > 0 ? (
              filteredSuggestedRepos.slice(0, 5).map((repo) => {
                return (
                  <div key={repo._id} className="suggested-repo">
                    <div className="suggested-repo-header">
                      <h4>{repo.name}</h4>
                      <StarRating repoId={repo._id} />
                    </div>
                    <p>{repo.description || "No description"}</p>
                  </div>
                );
              })
            ) : (
              <p style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                {suggestedSearchQuery ? "No repositories found" : "No suggestions available"}
              </p>
            )}
          </div>
        </aside>

        <main>
          <h2>Your Repositories</h2>
          {searchResults.length > 0 ? (
            <div className="repo-list">
              {searchResults.map((repo) => {
                const isSelected = selectedRepo?._id === repo._id;
                return (
                  <div key={repo._id}>
                    <div 
                      className={`repo-card ${isSelected ? 'repo-card-selected' : ''}`}
                      onClick={() => handleRepoClick(repo)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h4 onClick={(e) => { e.stopPropagation(); navigate(`/repo/${repo._id}`); }}>
                        {repo.name}
                      </h4>
                      <p>{repo.description || "No description provided"}</p>
                      <span className="repo-card-hint">Click name to open • Click card to view commits</span>
                    </div>
                    {isSelected && (
                      <div className="repo-commits-section">
                        <h5>Commits for {repo.name}</h5>
                        {repoCommits.length > 0 ? (
                          <div className="commits-list">
                            {repoCommits.map((commit) => (
                              <div key={commit._id} className="commit-item">
                                <div className="commit-header">
                                  <span className="commit-id">{commit.commitId?.substring(0, 7)}</span>
                                  <span className="commit-date">{formatDate(commit.committedAt)}</span>
                                </div>
                                <p className="commit-message">{commit.message}</p>
                                <div className="commit-meta">
                                  {commit.authorName && (
                                    <span className="commit-author">by {commit.authorName}</span>
                                  )}
                                  {commit.files && commit.files.length > 0 && (
                                    <div className="commit-files">
                                      {commit.files.map((file, idx) => (
                                        <span key={idx} className="commit-file">{file.filename}</span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="no-commits">No commits yet. Use CLI to push commits.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No repositories found</h3>
              <p>
                {searchQuery
                  ? `No repositories match "${searchQuery}"`
                  : "You don't have any repositories yet"}
              </p>
            </div>
          )}
          <Footer />
        </main>

        <aside className="right-sidebar">
          <div className="updates-section">
            <h3>Recent Commits</h3>
            {recentCommits.length > 0 ? (
              <div className="recent-commits-list">
                {recentCommits.map((commit) => (
                  <div key={commit._id} className="recent-commit-item">
                    <div className="recent-commit-header">
                      <span className="recent-commit-id">{commit.commitId?.substring(0, 7)}</span>
                      <span className="recent-commit-date">{formatDate(commit.committedAt)}</span>
                    </div>
                    <p className="recent-commit-message">{commit.message}</p>
                    {commit.files && commit.files.length > 0 && (
                      <div className="recent-commit-files">
                        {commit.files.map((file, idx) => (
                          <span key={idx} className="recent-commit-file">{file.filename}</span>
                        ))}
                      </div>
                    )}
                    <div className="recent-commit-meta">
                      {commit.authorName && (
                        <span className="recent-commit-author">by {commit.authorName}</span>
                      )}
                      {commit.repositoryName && (
                        <span className="recent-commit-repo">{commit.repositoryName}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                No commits yet
              </p>
            )}
          </div>

          <div className="updates-section">
            <h3>Upcoming Events</h3>
            <ul className="events-list">
              <li>
                <p>Tech Conference - Dec 17</p>
              </li>
              <li>
                <p>Developer Meetup - Dec 25</p>
              </li>
              <li>
                <p>React Summit - Jan 5</p>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
