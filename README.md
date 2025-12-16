# MannGit - A GitHub Clone with Custom Version Control

A full-stack web application that replicates GitHub's core functionality, built from scratch using the MERN stack. What makes this project unique is its **custom-built version control system** that works just like Git!

## What is this project?

Think of this as your own personal GitHub. You can:

- **Create an account** and manage your profile
- **Create repositories** to store your code
- **Track changes** using Git-like commands (init, add, commit, push, pull, revert)
- **Store your code in the cloud** using AWS S3
- **Explore and rate** other users' repositories (5-star rating system)
- **View your activity** with a contribution heatmap (just like GitHub!)

## How the Version Control Works

The custom version control system (called "MannGit") mimics how Git works:

1. **`init`** - Creates a new repository folder (`.mannGit`) to track your files
2. **`add <file>`** - Stages a file for the next commit (copies it to a staging area)
3. **`commit <message>`** - Saves your staged files as a snapshot with a unique ID
4. **`push`** - Uploads your commits to AWS S3 (like pushing to GitHub)
5. **`pull`** - Downloads commits from S3 to your local machine
6. **`revert <commitID>`** - Goes back to a previous version of your code

## Tech Stack

**Backend:**
- Node.js + Express.js (server)
- MongoDB + Mongoose (database)
- AWS S3 (cloud storage for commits)
- JWT (secure login)
- Socket.io (real-time features)

**Frontend:**
- React (user interface)
- Primer React (GitHub's design system)
- Vite (fast development)

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "Version Control System"
```

### 2. Set up the Backend
```bash
cd backend
npm install
```

Create a `.env` file with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=eu-north-1
S3_BUCKET=your_bucket_name
```

Start the server:
```bash
npm start
```

### 3. Set up the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Using the Version Control CLI

From the backend folder, you can use these commands:

```bash
# Initialize a new repository
node index.js init

# Add a file to staging
node index.js add myfile.txt

# Commit your changes
node index.js commit "My first commit"

# Push to cloud storage
node index.js push

# Pull from cloud storage
node index.js pull

# Revert to a previous commit
node index.js revert <commit-id>
```

## Features

### User Features
- Sign up / Login with secure authentication
- View and edit your profile
- See your contribution activity heatmap
- Follow other users

### Repository Features
- Create public/private repositories
- Add descriptions to your repos
- Rate other users' repositories (1-5 stars)
- Search through repositories

### Version Control Features
- Track file changes locally
- Create snapshots (commits) of your code
- Push/pull to cloud storage (AWS S3)
- Revert to any previous commit

## Project Structure

```
Version Control System/
├── backend/
│   ├── controllers/     # Business logic (init, add, commit, push, pull, revert)
│   ├── models/          # Database schemas (User, Repository, Issue)
│   ├── routes/          # API endpoints
│   ├── config/          # AWS configuration
│   └── index.js         # Server entry + CLI commands
│
└── frontend/
    └── src/
        ├── components/  # React components (Dashboard, Profile, Auth, etc.)
        └── App.jsx      # Main application
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create new account |
| POST | `/auth/login` | Login |
| GET | `/repo/all` | Get all repositories |
| POST | `/repo/create` | Create a repository |
| POST | `/repo/star/:id` | Rate a repository |
| GET | `/userProfile/:id` | Get user profile |

## What I Learned

Building this project taught me:
- How version control systems actually work under the hood
- Full-stack development with the MERN stack
- Cloud storage integration with AWS S3
- Building CLI tools with Node.js
- Authentication and authorization patterns
- Real-time features with Socket.io

## Future Improvements

- [ ] Branch support (like Git branches)
- [ ] Merge functionality
- [ ] Diff viewer to see file changes
- [ ] Collaborative features (pull requests)
- [ ] Better conflict resolution

---

Built with ❤️ as a learning project to understand how GitHub and Git work internally.
