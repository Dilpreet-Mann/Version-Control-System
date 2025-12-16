const fs = require("fs").promises;
const path = require("path");
const readline = require("readline");

async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Initialize repository with web app linking
async function initLinked() {
  const repoPath = path.resolve(process.cwd(), ".mannGit");
  const commitsPath = path.join(repoPath, "commits");
  const stagingPath = path.join(repoPath, "staging");

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });
    await fs.mkdir(stagingPath, { recursive: true });

    // Ask for repository linking info
    console.log("\n📦 Initialize Repository (Linked to Web App)\n");
    console.log("To link this local repo with your web app, provide the following:");
    console.log("(You can find these IDs in your browser's localStorage after logging in)\n");

    const repoId = await prompt("Repository ID (from web app, or press Enter to skip): ");
    const repoName = await prompt("Repository Name (or press Enter to skip): ");
    const userId = await prompt("User ID (from web app, or press Enter to skip): ");

    const config = {
      bucket: process.env.S3_BUCKET,
      repositoryId: repoId.trim() || null,
      repositoryName: repoName.trim() || null,
      userId: userId.trim() || null,
      createdAt: new Date().toISOString(),
    };

    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify(config, null, 2)
    );

    console.log("\n✅ Repository initialised!");
    if (repoId || repoName) {
      console.log("📎 Linked to web app repository");
    }
    console.log("\nNext steps:");
    console.log("  1. node index.js add <file>      - Stage files");
    console.log("  2. node index.js commit <msg>    - Commit changes");
    console.log("  3. node index.js push            - Push to S3 only");
    console.log("  4. node index.js push-all        - Push to S3 AND MongoDB");
  } catch (err) {
    console.error("Error initialising repository", err);
  }
}

module.exports = { initLinked };

