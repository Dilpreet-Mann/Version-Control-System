import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./createRepository.css";

const CreateRepository = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true); // true = public, false = private
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Repository name is required!");
      return;
    }

    let userId = localStorage.getItem("userId");
    if (!userId) {
      setError("You must be logged in to create a repository!");
      navigate("/auth");
      return;
    }

    // Ensure userId is a string (in case it was stored as an object)
    userId = String(userId).trim();
    if (!userId || userId === "null" || userId === "undefined") {
      setError("Invalid user session. Please log in again.");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3002/repo/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: userId,
          name: name.trim(),
          description: description.trim() || undefined,
          visibility: visibility,
          content: [],
          issues: [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create repository");
      }

      // Success - redirect to dashboard
      navigate("/");
    } catch (err) {
      console.error("Error creating repository:", err);
      setError(err.message || "Failed to create repository. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-repo-wrapper">
        <div className="create-repo-container">
          <h2>Create a new repository</h2>
          <p className="create-repo-subtitle">
            A repository contains all project files, including the revision history.
          </p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="create-repo-form">
            <div className="form-group">
              <label htmlFor="repo-name" className="form-label">
                Repository name <span className="required">*</span>
              </label>
              <input
                id="repo-name"
                type="text"
                className="form-input"
                placeholder="my-awesome-repo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <p className="form-hint">
                Great repository names are short and memorable.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="repo-description" className="form-label">
                Description <span className="optional">(optional)</span>
              </label>
              <textarea
                id="repo-description"
                className="form-textarea"
                placeholder="Add a description to help others understand what this repository is about..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Visibility</label>
              <div className="visibility-options">
                <label className="visibility-option">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={visibility === true}
                    onChange={() => setVisibility(true)}
                    disabled={loading}
                  />
                  <div className="visibility-option-content">
                    <strong>Public</strong>
                    <span>Anyone on the internet can see this repository.</span>
                  </div>
                </label>
                <label className="visibility-option">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={visibility === false}
                    onChange={() => setVisibility(false)}
                    disabled={loading}
                  />
                  <div className="visibility-option-content">
                    <strong>Private</strong>
                    <span>You choose who can see and commit to this repository.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-create"
                disabled={loading || !name.trim()}
              >
                {loading ? "Creating..." : "Create repository"}
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default CreateRepository;

