const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectId;

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
  }
}

async function signup(req, res) {
  const { username, password, email } = req.body;
  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await usersCollection.insertOne(newUser);

    const userIdString = result.insertedId.toString();
    const jwtSecret = process.env.JWT_SECRET_KEY || "fallback_secret_key_for_dev";
    const token = jwt.sign(
      { id: userIdString },
      jwtSecret,
      { expiresIn: "1h" }
    );
    res.json({ token, userId: userIdString });
  } catch (err) {
    console.error("Error during signup : ", err.message);
    res.status(500).send("Server error");
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const userIdString = user._id.toString();
    const jwtSecret = process.env.JWT_SECRET_KEY || "fallback_secret_key_for_dev";
    const token = jwt.sign({ id: userIdString }, jwtSecret, {
      expiresIn: "1h",
    });
    res.json({ token, userId: userIdString });
  } catch (err) {
    console.error("Error during login : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function getAllUsers(req, res) {
  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    
    // Calculate followers count for each user
    const usersWithFollowers = users.map(user => {
      const followersCount = users.filter(u => 
        u.followedUsers?.some(id => id.toString() === user._id.toString())
      ).length;
      return { ...user, followersCount };
    });
    
    res.json(usersWithFollowers);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function searchUsers(req, res) {
  const { query } = req.query;
  
  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const users = await usersCollection.find(
      { username: { $regex: query || "", $options: "i" } },
      { projection: { password: 0 } }
    ).limit(20).toArray();
    
    res.json(users);
  } catch (err) {
    console.error("Error searching users: ", err.message);
    res.status(500).send("Server error!");
  }
}

async function followUser(req, res) {
  const { userId, targetUserId } = req.body;
  
  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    if (userId === targetUserId) {
      return res.status(400).json({ message: "Cannot follow yourself!" });
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    const targetUser = await usersCollection.findOne({ _id: new ObjectId(targetUserId) });

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if already following
    const isFollowing = user.followedUsers?.some(
      (id) => id.toString() === targetUserId
    );

    if (isFollowing) {
      return res.status(400).json({ message: "Already following this user!" });
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { followedUsers: new ObjectId(targetUserId) } }
    );

    res.json({ message: "Successfully followed user!", following: true });
  } catch (err) {
    console.error("Error following user: ", err.message);
    res.status(500).send("Server error!");
  }
}

async function unfollowUser(req, res) {
  const { userId, targetUserId } = req.body;
  
  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { followedUsers: new ObjectId(targetUserId) } }
    );

    res.json({ message: "Successfully unfollowed user!", following: false });
  } catch (err) {
    console.error("Error unfollowing user: ", err.message);
    res.status(500).send("Server error!");
  }
}

async function getFollowingStatus(req, res) {
  const { userId, targetUserId } = req.query;
  
  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isFollowing = user.followedUsers?.some(
      (id) => id.toString() === targetUserId
    );

    res.json({ following: isFollowing });
  } catch (err) {
    console.error("Error checking follow status: ", err.message);
    res.status(500).send("Server error!");
  }
}

async function getUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      _id: new ObjectId(currentID),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(user);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { email, password, profileImage, description } = req.body;

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    let updateFields = {};
    if (email) updateFields.email = email;
    if (profileImage !== undefined) updateFields.profileImage = profileImage;
    if (description !== undefined) updateFields.description = description;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const result = await usersCollection.findOneAndUpdate(
      {
        _id: new ObjectId(currentID),
      },
      { $set: updateFields },
      { returnDocument: "after" }
    );
    
    // Handle both old and new MongoDB driver versions
    const updatedUser = result.value || result;
    if (!updatedUser || !updatedUser._id) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(updatedUser);
  } catch (err) {
    console.error("Error during updating : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function deleteUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(currentID),
    });

    if (result.deleteCount == 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User Profile Deleted!" });
  } catch (err) {
    console.error("Error during updating : ", err.message);
    res.status(500).send("Server error!");
  }
}

module.exports = {
  getAllUsers,
  searchUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  followUser,
  unfollowUser,
  getFollowingStatus,
};
