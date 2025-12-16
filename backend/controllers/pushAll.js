const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { s3, S3_BUCKET } = require("../config/aws-config");

dotenv.config();

// Import models
const Commit = require("../models/commitModel");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");

async function connectMongoDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  }
}

// Push to both S3 and MongoDB
async function pushAll() {
  const repoPath = path.resolve(process.cwd(), ".mannGit");
  const commitsPath = path.join(repoPath, "commits");
  const configPath = path.join(repoPath, "config.json");

  try {
    // Check if .mannGit directory exists
    try {
      await fs.access(repoPath);
    } catch {
      console.error("Error: Repository not initialized. Run 'node index.js init' first.");
      return;
    }

    // Check if commits directory exists
    try {
      await fs.access(commitsPath);
    } catch {
      console.error("Error: No commits found. Make commits first using 'node index.js commit <message>'");
      return;
    }

    // Read config to get repository info
    let config = {};
    try {
      const configData = await fs.readFile(configPath, "utf-8");
      config = JSON.parse(configData);
    } catch {
      console.log("Warning: No config.json found. Commits won't be linked to a repository.");
    }

    const commitDirs = await fs.readdir(commitsPath);
    
    if (commitDirs.length === 0) {
      console.log("No commits to push.");
      return;
    }

    // Connect to MongoDB
    await connectMongoDB();

    console.log(`Pushing ${commitDirs.length} commit(s) to S3 and MongoDB...`);

    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const stat = await fs.stat(commitPath);
      
      if (!stat.isDirectory()) continue;

      // Check if commit already exists in MongoDB
      const existingCommit = await Commit.findOne({ commitId: commitDir });
      if (existingCommit) {
        console.log(`  ⏭ Skipping ${commitDir} (already pushed)`);
        continue;
      }

      const files = await fs.readdir(commitPath);
      const commitFiles = [];
      let commitMessage = "No message";
      let commitDate = new Date();

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileStat = await fs.stat(filePath);
        
        if (!fileStat.isFile()) continue;

        const fileContent = await fs.readFile(filePath);
        const s3Key = `commits/${commitDir}/${file}`;

        // Upload to S3
        try {
          const params = {
            Bucket: S3_BUCKET,
            Key: s3Key,
            Body: fileContent,
          };
          await s3.upload(params).promise();
          console.log(`  ✓ S3: ${s3Key}`);
        } catch (s3Err) {
          console.log(`  ⚠ S3 upload failed for ${file}: ${s3Err.message}`);
        }

        // Parse commit.json for message
        if (file === "commit.json") {
          try {
            const commitData = JSON.parse(fileContent.toString());
            commitMessage = commitData.message || "No message";
            commitDate = commitData.date ? new Date(commitData.date) : new Date();
          } catch {
            // ignore parse errors
          }
        } else {
          // Store file info for MongoDB
          commitFiles.push({
            filename: file,
            content: fileContent.toString(),
            s3Key: s3Key,
          });
        }
      }

      // Fetch author username if userId exists
      let authorName = null;
      if (config.userId) {
        try {
          const user = await User.findById(config.userId);
          if (user) {
            authorName = user.username;
          }
        } catch {
          // ignore
        }
      }

      // Save to MongoDB
      const newCommit = new Commit({
        commitId: commitDir,
        message: commitMessage,
        repository: config.repositoryId || null,
        repositoryName: config.repositoryName || null,
        files: commitFiles,
        author: config.userId || null,
        authorName: authorName,
        committedAt: commitDate,
      });

      await newCommit.save();
      console.log(`  ✓ MongoDB: Commit ${commitDir.substring(0, 8)}... by ${authorName || 'unknown'} saved`);

      // Update repository's content array if linked
      if (config.repositoryId) {
        try {
          await Repository.findByIdAndUpdate(
            config.repositoryId,
            { $addToSet: { content: commitDir } }
          );
        } catch {
          // ignore if repo not found
        }
      }
    }

    console.log("\n✅ All commits pushed to S3 and MongoDB!");
    
    // Disconnect MongoDB when running as CLI
    await mongoose.disconnect();
  } catch (err) {
    if (err.code === "CredentialsError" || err.message?.includes("credentials")) {
      console.error("Error: AWS credentials not configured.");
      console.error("Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file.");
    } else {
      console.error("Error pushing: ", err.message);
    }
    await mongoose.disconnect();
  }
}

module.exports = { pushAll };

