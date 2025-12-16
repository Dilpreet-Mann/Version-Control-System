const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createRepository(req, res) {
  const { owner, name, issues, content, description, visibility } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required!" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid User ID!" });
    }

    const newRepository = new Repository({
      name,
      description,
      visibility,
      owner,
      content,
      issues,
    });

    const result = await newRepository.save();

    // Update user's repositories array
    const user = await User.findById(owner);
    if (user) {
      user.repositories.push(result._id);
      await user.save();
    }

    res.status(201).json({
      message: "Repository created!",
      repositoryID: result._id,
    });
  } catch (err) {
    console.error("Error during repository creation : ", err.message);
    
    // Handle duplicate key error (unique constraint violation)
    if (err.code === 11000 || err.message.includes("duplicate")) {
      return res.status(409).json({ 
        error: "A repository with this name already exists. Please choose a different name." 
      });
    }
    
    res.status(500).json({ error: "Server error" });
  }
}

async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");

    res.json(repositories);
  } catch (err) {
    console.error("Error during fetching repositories : ", err.message);
    res.status(500).send("Server error");
  }
}

async function fetchRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.find({ _id: id })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function fetchRepositoryByName(req, res) {
  const { name } = req.params;
  try {
    const repository = await Repository.find({ name })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function fetchRepositoriesForCurrentUser(req, res) {
  console.log(req.params);
  const { userID } = req.params;

  try {
    const repositories = await Repository.find({ owner: userID });

    if (!repositories || repositories.length == 0) {
      return res.status(404).json({ error: "User Repositories not found!" });
    }
    console.log(repositories);
    res.json({ message: "Repositories found!", repositories });
  } catch (err) {
    console.error("Error during fetching user repositories : ", err.message);
    res.status(500).send("Server error");
  }
}

async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description } = req.body;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.content.push(content);
    repository.description = description;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during updating repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function toggleVisibilityById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.visibility = !repository.visibility;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository visibility toggled successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during toggling visibility : ", err.message);
    res.status(500).send("Server error");
  }
}

async function deleteRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    res.json({ message: "Repository deleted successfully!" });
  } catch (err) {
    console.error("Error during deleting repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function starRepository(req, res) {
  const { repoId } = req.params;
  const { userId, stars } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(repoId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid Repository or User ID!" });
    }

    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ error: "Stars must be between 1 and 5!" });
    }

    const repository = await Repository.findById(repoId);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Check if user already rated this repo
    const existingRating = repository.ratings.find(
      (r) => r.user.toString() === userId
    );

    if (existingRating) {
      // Update existing rating
      const oldStars = existingRating.stars;
      existingRating.stars = stars;
      repository.starCount = repository.starCount - oldStars + stars;
    } else {
      // Add new rating
      repository.ratings.push({ user: userId, stars });
      repository.starCount += stars;
      
      // Add to user's starRepos if not already there
      if (!user.starRepos.includes(repoId)) {
        user.starRepos.push(repoId);
        await user.save();
      }
    }

    await repository.save();

    res.json({
      message: "Repository rated successfully!",
      starCount: repository.starCount,
      averageStars: (repository.starCount / repository.ratings.length).toFixed(1),
    });
  } catch (err) {
    console.error("Error during rating repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function unstarRepository(req, res) {
  const { repoId } = req.params;
  const { userId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(repoId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid Repository or User ID!" });
    }

    const repository = await Repository.findById(repoId);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Find and remove rating
    const ratingIndex = repository.ratings.findIndex(
      (r) => r.user.toString() === userId
    );

    if (ratingIndex !== -1) {
      const removedStars = repository.ratings[ratingIndex].stars;
      repository.ratings.splice(ratingIndex, 1);
      repository.starCount = Math.max(0, repository.starCount - removedStars);
      await repository.save();
    }

    // Remove from user's starRepos
    user.starRepos = user.starRepos.filter(
      (id) => id.toString() !== repoId
    );
    await user.save();

    res.json({
      message: "Repository unstarred successfully!",
      starCount: repository.starCount,
    });
  } catch (err) {
    console.error("Error during unstarring repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function getRepositoryRating(req, res) {
  const { repoId } = req.params;
  const userId = req.query.userId;

  try {
    const repository = await Repository.findById(repoId);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    let userRating = null;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const rating = repository.ratings.find(
        (r) => r.user.toString() === userId
      );
      if (rating) {
        userRating = rating.stars;
      }
    }

    const averageStars = repository.ratings.length > 0
      ? (repository.starCount / repository.ratings.length).toFixed(1)
      : 0;

    res.json({
      starCount: repository.starCount,
      ratingCount: repository.ratings.length,
      averageStars: parseFloat(averageStars),
      userRating: userRating,
    });
  } catch (err) {
    console.error("Error during fetching repository rating : ", err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
  starRepository,
  unstarRepository,
  getRepositoryRating,
};
