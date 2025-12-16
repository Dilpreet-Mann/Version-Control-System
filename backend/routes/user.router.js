const express = require("express");
const userController = require("../controllers/userController");

const userRouter = express.Router();

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.get("/searchUsers", userController.searchUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateProfile/:id", userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", userController.deleteUserProfile);
userRouter.post("/follow", userController.followUser);
userRouter.post("/unfollow", userController.unfollowUser);
userRouter.get("/followStatus", userController.getFollowingStatus);

module.exports = userRouter;
