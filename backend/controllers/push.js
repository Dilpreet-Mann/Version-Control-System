const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".mannGit");
  const commitsPath = path.join(repoPath, "commits");

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

    const commitDirs = await fs.readdir(commitsPath);
    
    if (commitDirs.length === 0) {
      console.log("No commits to push.");
      return;
    }

    console.log(`Pushing ${commitDirs.length} commit(s) to S3...`);

    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const stat = await fs.stat(commitPath);
      
      if (!stat.isDirectory()) continue;

      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileStat = await fs.stat(filePath);
        
        if (!fileStat.isFile()) continue;

        const fileContent = await fs.readFile(filePath);
        const params = {
          Bucket: S3_BUCKET,
          Key: `commits/${commitDir}/${file}`,
          Body: fileContent,
        };

        await s3.upload(params).promise();
        console.log(`  ✓ Uploaded: commits/${commitDir}/${file}`);
      }
    }

    console.log("All commits pushed to S3 successfully!");
  } catch (err) {
    if (err.code === "CredentialsError" || err.message.includes("credentials")) {
      console.error("Error: AWS credentials not configured.");
      console.error("Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file,");
      console.error("or run 'aws configure' to set up credentials.");
    } else {
      console.error("Error pushing to S3 : ", err.message);
    }
  }
}

module.exports = { pushRepo };
