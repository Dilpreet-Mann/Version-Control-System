const Commit = require("../models/commitModel");
const mongoose = require("mongoose");

// Get all commits
async function getAllCommits(req, res) {
  try {
    const commits = await Commit.find({})
      .populate("repository")
      .populate("author")
      .sort({ committedAt: -1 });
    res.json(commits);
  } catch (err) {
    console.error("Error fetching commits:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

// Get commits by repository ID
async function getCommitsByRepository(req, res) {
  const { repoId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(repoId)) {
      return res.status(400).json({ error: "Invalid Repository ID" });
    }

    const commits = await Commit.find({ repository: repoId })
      .populate("author")
      .sort({ committedAt: -1 });

    res.json(commits);
  } catch (err) {
    console.error("Error fetching commits:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

// Get commits by repository name
async function getCommitsByRepositoryName(req, res) {
  const { repoName } = req.params;

  try {
    const commits = await Commit.find({ repositoryName: repoName })
      .populate("author")
      .sort({ committedAt: -1 });

    res.json(commits);
  } catch (err) {
    console.error("Error fetching commits:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

// Get single commit by commit ID
async function getCommitById(req, res) {
  const { commitId } = req.params;

  try {
    const commit = await Commit.findOne({ commitId })
      .populate("repository")
      .populate("author");

    if (!commit) {
      return res.status(404).json({ error: "Commit not found" });
    }

    res.json(commit);
  } catch (err) {
    console.error("Error fetching commit:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

// Get commits by user ID
async function getCommitsByUser(req, res) {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const commits = await Commit.find({ author: userId })
      .populate("repository")
      .sort({ committedAt: -1 });

    res.json(commits);
  } catch (err) {
    console.error("Error fetching commits:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  getAllCommits,
  getCommitsByRepository,
  getCommitsByRepositoryName,
  getCommitById,
  getCommitsByUser,
};

