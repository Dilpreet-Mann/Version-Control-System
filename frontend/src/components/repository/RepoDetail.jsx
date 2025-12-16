import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./repoDetail.css";

const RepoDetail = () => {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [commits, setCommits] = useState([]);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch repository details
        const repoRes = await fetch(`http://localhost:3002/repo/${repoId}`);
        const repoData = await repoRes.json();
        setRepo(Array.isArray(repoData) ? repoData[0] : repoData);

        // Fetch commits for this repository
        const commitsRes = await fetch(`http://localhost:3002/commit/repo/${repoId}`);
        const commitsData = await commitsRes.json();
        setCommits(Array.isArray(commitsData) ? commitsData : []);
      } catch (err) {
        console.error("Error fetching repo details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (repoId) {
      fetchRepoDetails();
    }
  }, [repoId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCommitClick = (commit) => {
    if (selectedCommit?.commitId === commit.commitId) {
      setSelectedCommit(null);
    } else {
      setSelectedCommit(commit);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="repo-detail-wrapper">
          <div className="loading">Loading repository...</div>
        </div>
      </>
    );
  }

  if (!repo) {
    return (
      <>
        <Navbar />
        <div className="repo-detail-wrapper">
          <div className="not-found">
            <h2>Repository not found</h2>
            <button onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="repo-detail-wrapper">
        <div className="repo-detail-container">
          {/* Repository Header */}
          <div className="repo-header">
            <div className="repo-header-top">
              <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back
              </button>
              <span className="repo-visibility">
                {repo.visibility ? "Public" : "Private"}
              </span>
            </div>
            <h1 className="repo-title">{repo.name}</h1>
            {repo.description && (
              <p className="repo-description">{repo.description}</p>
            )}
            <div className="repo-meta">
              {repo.owner && (
                <span className="repo-owner">
                  Owner: {repo.owner.username || "Unknown"}
                </span>
              )}
              <span className="repo-stats">
                ⭐ {repo.starCount || 0} stars
              </span>
            </div>
          </div>

          {/* Commits Section */}
          <div className="repo-commits">
            <h2>
              Commits
              <span className="commit-count">{commits.length}</span>
            </h2>

            {commits.length > 0 ? (
              <div className="commits-timeline">
                {commits.map((commit) => (
                  <div key={commit._id} className="commit-entry">
                    <div
                      className={`commit-card ${selectedCommit?.commitId === commit.commitId ? "expanded" : ""}`}
                      onClick={() => handleCommitClick(commit)}
                    >
                      <div className="commit-card-header">
                        <div className="commit-info">
                          <span className="commit-hash">
                            {commit.commitId?.substring(0, 7)}
                          </span>
                          <span className="commit-msg">{commit.message}</span>
                        </div>
                        <div className="commit-right">
                          {commit.authorName && (
                            <span className="commit-author">{commit.authorName}</span>
                          )}
                          <span className="commit-time">
                            {formatDate(commit.committedAt)}
                          </span>
                        </div>
                      </div>

                      {commit.files && commit.files.length > 0 && (
                        <div className="commit-files-preview">
                          {commit.files.slice(0, 3).map((file, idx) => (
                            <span key={idx} className="file-badge">
                              {file.filename}
                            </span>
                          ))}
                          {commit.files.length > 3 && (
                            <span className="file-badge more">
                              +{commit.files.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expanded File View */}
                    {selectedCommit?.commitId === commit.commitId && commit.files && (
                      <div className="commit-files-expanded">
                        <h4>Files in this commit</h4>
                        {commit.files.map((file, idx) => (
                          <div key={idx} className="file-content-card">
                            <div className="file-header">
                              <span className="file-name">{file.filename}</span>
                            </div>
                            <pre className="file-content">
                              <code>{file.content || "No content available"}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-commits">
                <p>No commits yet</p>
                <span>Push commits using the CLI to see them here</span>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default RepoDetail;

