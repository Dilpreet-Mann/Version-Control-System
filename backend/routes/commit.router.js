const express = require("express");
const commitController = require("../controllers/commitController");

const commitRouter = express.Router();

commitRouter.get("/commit/all", commitController.getAllCommits);
commitRouter.get("/commit/repo/:repoId", commitController.getCommitsByRepository);
commitRouter.get("/commit/reponame/:repoName", commitController.getCommitsByRepositoryName);
commitRouter.get("/commit/:commitId", commitController.getCommitById);
commitRouter.get("/commit/user/:userId", commitController.getCommitsByUser);

module.exports = commitRouter;

