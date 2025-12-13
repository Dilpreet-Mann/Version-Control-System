# Complete Project Analysis: GitHub Clone with Custom Version Control

## 📋 Project Overview

This is a **MERN Stack-based GitHub replica** with a **custom version control system** implemented from scratch. The project simulates core GitHub functionality including user management, repository management, issue tracking, and a custom Git-like version control system with commands like `init`, `add`, `commit`, `push`, `pull`, and `revert`.

---

## 🛠️ Technologies Used

### **Backend Technologies:**
- **Node.js** - Runtime environment
- **Express.js** (v4.19.2) - Web framework
- **MongoDB** (v6.8.0) - NoSQL database
- **Mongoose** (v8.5.0) - ODM for MongoDB
- **JWT** (jsonwebtoken v9.0.2) - Authentication tokens
- **bcryptjs** (v2.4.3) - Password hashing
- **AWS SDK** (v2.1657.0) - S3 integration for cloud storage
- **Socket.io** (v4.7.5) - Real-time communication
- **Yargs** (v17.7.2) - CLI argument parsing
- **UUID** (v10.0.0) - Unique ID generation for commits
- **dotenv** (v16.4.5) - Environment variables
- **CORS** (v2.8.5) - Cross-origin resource sharing

### **Frontend Technologies:**
- **React** (v18.3.1) - UI library
- **React Router DOM** (v6.25.1) - Client-side routing
- **Vite** (v5.3.4) - Build tool and dev server
- **Axios** (v1.7.3) - HTTP client
- **@primer/react** (v36.27.0) - GitHub's design system
- **@uiw/react-heat-map** (v2.2.2) - Activity heatmap visualization
- **CSS** - Styling

---

## 📁 Project Structure

```
Version Control System/
├── backend-main/          # Backend Server
│   ├── config/            # Configuration files
│   ├── controllers/       # Business logic handlers
│   ├── middleware/        # Authentication & authorization
│   ├── models/            # Database schemas
│   ├── routes/            # API route definitions
│   ├── index.js           # Server entry point
│   └── package.json       # Backend dependencies
│
└── frontend-main/         # Frontend Application
    ├── src/
    │   ├── components/    # React components
    │   ├── assets/        # Static assets
    │   ├── App.jsx        # Main app component
    │   ├── Routes.jsx     # Route configuration
    │   ├── authContext.jsx # Authentication context
    │   └── main.jsx       # React entry point
    └── package.json       # Frontend dependencies
```

---

## 🔍 Detailed Component Analysis

### **Backend Structure**

#### **1. Entry Point (`index.js`)**
- **Purpose**: Main server file that initializes Express, MongoDB, Socket.io, and CLI commands
- **Key Features**:
  - Sets up Express server with CORS
  - Connects to MongoDB database
  - Initializes Socket.io for real-time features
  - Implements CLI commands using Yargs:
    - `node index.js start` - Starts the server
    - `node index.js init` - Initialize repository
    - `node index.js add <file>` - Add file to staging
    - `node index.js commit <message>` - Commit staged files
    - `node index.js push` - Push commits to S3
    - `node index.js pull` - Pull commits from S3
    - `node index.js revert <commitID>` - Revert to a commit

#### **2. Models (`models/`)**

**`userModel.js`**
- **Schema**: User document structure
- **Fields**:
  - `username` (unique, required)
  - `email` (unique, required)
  - `password` (hashed)
  - `repositories` (array of ObjectIds referencing Repository)
  - `followedUsers` (array of ObjectIds for social features)
  - `starRepos` (array of ObjectIds for starred repositories)

**`repoModel.js`**
- **Schema**: Repository document structure
- **Fields**:
  - `name` (unique, required)
  - `description`
  - `content` (array of strings - file contents)
  - `visibility` (boolean - public/private)
  - `owner` (ObjectId reference to User)
  - `issues` (array of ObjectIds referencing Issue)

**`issueModel.js`**
- **Schema**: Issue document structure
- **Fields**:
  - `title` (required)
  - `description` (required)
  - `status` (enum: "open" or "closed", default: "open")
  - `repository` (ObjectId reference to Repository)

#### **3. Controllers (`controllers/`)**

**`userController.js`**
- **Functions**:
  - `signup()` - Creates new user with hashed password, returns JWT token
  - `login()` - Authenticates user, returns JWT token
  - `getAllUsers()` - Fetches all users
  - `getUserProfile(id)` - Gets user by ID
  - `updateUserProfile(id)` - Updates user email/password
  - `deleteUserProfile(id)` - Deletes user account
- **Database**: Uses MongoDB native driver (MongoClient)

**`repoController.js`**
- **Functions**:
  - `createRepository()` - Creates new repository
  - `getAllRepositories()` - Fetches all repos with populated owner and issues
  - `fetchRepositoryById(id)` - Gets repo by ID
  - `fetchRepositoryByName(name)` - Gets repo by name
  - `fetchRepositoriesForCurrentUser(userID)` - Gets user's repos
  - `updateRepositoryById(id)` - Updates repo content/description
  - `toggleVisibilityById(id)` - Toggles public/private
  - `deleteRepositoryById(id)` - Deletes repository
- **Database**: Uses Mongoose ODM

**`issueController.js`**
- **Functions**:
  - `createIssue()` - Creates issue for a repository
  - `updateIssueById(id)` - Updates issue title/description/status
  - `deleteIssueById(id)` - Deletes issue
  - `getAllIssues()` - Gets all issues for a repository
  - `getIssueById(id)` - Gets issue by ID
- **Database**: Uses Mongoose ODM

**Version Control Controllers:**

**`init.js`**
- **Purpose**: Initializes a local Git-like repository
- **Creates**:
  - `.apnaGit/` directory (hidden repository folder)
  - `.apnaGit/commits/` directory (stores commit history)
  - `.apnaGit/config.json` (S3 bucket configuration)

**`add.js`**
- **Purpose**: Adds files to staging area
- **Process**:
  - Creates `.apnaGit/staging/` directory
  - Copies specified file to staging area

**`commit.js`**
- **Purpose**: Commits staged files
- **Process**:
  - Generates unique commit ID (UUID)
  - Creates commit directory: `.apnaGit/commits/{commitID}/`
  - Copies all staged files to commit directory
  - Creates `commit.json` with message and timestamp
  - Clears staging area (implicitly)

**`push.js`**
- **Purpose**: Uploads commits to AWS S3
- **Process**:
  - Reads all commits from `.apnaGit/commits/`
  - Uploads each file to S3 bucket: `commits/{commitID}/{file}`
  - Enables cloud backup and collaboration

**`pull.js`**
- **Purpose**: Downloads commits from AWS S3
- **Process**:
  - Lists all objects in S3 bucket with `commits/` prefix
  - Downloads each file to local `.apnaGit/commits/` directory
  - Syncs local repository with remote

**`revert.js`**
- **Purpose**: Reverts working directory to a specific commit
- **Process**:
  - Finds commit by ID in `.apnaGit/commits/{commitID}/`
  - Copies all files from commit to parent directory
  - Restores project state to that commit

#### **4. Routes (`routes/`)**

**`main.router.js`**
- **Purpose**: Main router that combines all sub-routers
- **Routes**:
  - `/` - Welcome message
  - Mounts `userRouter`, `repoRouter`, `issueRouter`

**`user.router.js`**
- **Endpoints**:
  - `GET /allUsers` - Get all users
  - `POST /signup` - User registration
  - `POST /login` - User authentication
  - `GET /userProfile/:id` - Get user profile
  - `PUT /updateProfile/:id` - Update user profile
  - `DELETE /deleteProfile/:id` - Delete user profile

**`repo.router.js`**
- **Endpoints**:
  - `POST /repo/create` - Create repository
  - `GET /repo/all` - Get all repositories
  - `GET /repo/:id` - Get repo by ID
  - `GET /repo/name/:name` - Get repo by name
  - `GET /repo/user/:userID` - Get user's repositories
  - `PUT /repo/update/:id` - Update repository
  - `PATCH /repo/toggle/:id` - Toggle visibility
  - `DELETE /repo/delete/:id` - Delete repository

**`issue.router.js`**
- **Endpoints**:
  - `POST /issue/create` - Create issue
  - `PUT /issue/update/:id` - Update issue
  - `DELETE /issue/delete/:id` - Delete issue
  - `GET /issue/all` - Get all issues
  - `GET /issue/:id` - Get issue by ID

#### **5. Middleware (`middleware/`)**

**`authMiddleware.js`**
- **Purpose**: Currently empty (placeholder for JWT verification)
- **Intended Use**: Verify JWT tokens in protected routes

**`authorizeMiddleware.js`**
- **Purpose**: Currently empty (placeholder for authorization)
- **Intended Use**: Check user permissions for operations

#### **6. Configuration (`config/`)**

**`aws-config.js`**
- **Purpose**: AWS S3 configuration
- **Settings**:
  - Region: `ap-south-1` (Asia Pacific - Mumbai)
  - S3 bucket name (placeholder: "insert_bucket_name")
  - Exports S3 client and bucket name

---

### **Frontend Structure**

#### **1. Entry Point (`main.jsx`)**
- **Purpose**: React application entry point
- **Setup**:
  - Wraps app with `AuthProvider` (authentication context)
  - Wraps app with `BrowserRouter` (React Router)
  - Renders `ProjectRoutes` component

#### **2. Routing (`Routes.jsx`)**
- **Purpose**: Defines all application routes
- **Routes**:
  - `/` - Dashboard (protected)
  - `/auth` - Login page
  - `/signup` - Signup page
  - `/profile` - User profile (protected)
- **Features**:
  - Auto-redirects to `/auth` if not logged in
  - Auto-redirects to `/` if logged in and on auth pages
  - Persists user session from localStorage

#### **3. Context (`authContext.jsx`)**
- **Purpose**: Global authentication state management
- **Features**:
  - `currentUser` state - Stores logged-in user ID
  - `setCurrentUser` function - Updates current user
  - Persists user ID in localStorage
  - Provides `useAuth()` hook for components

#### **4. Components (`components/`)**

**Authentication Components:**

**`auth/Login.jsx`**
- **Purpose**: User login form
- **Features**:
  - Email and password input
  - Calls `/login` API endpoint
  - Stores JWT token and user ID in localStorage
  - Redirects to dashboard on success
  - Uses Primer React components for UI

**`auth/Signup.jsx`**
- **Purpose**: User registration form
- **Features**:
  - Username, email, and password input
  - Calls `/signup` API endpoint
  - Stores JWT token and user ID in localStorage
  - Redirects to dashboard on success
  - Link to login page

**Main Components:**

**`dashboard/Dashboard.jsx`**
- **Purpose**: Main dashboard showing user repositories
- **Features**:
  - Fetches user's repositories on load
  - Fetches all repositories for suggestions
  - Search functionality to filter repositories
  - Displays repository name and description
  - Three-column layout: Suggestions | Main | Events

**`user/Profile.jsx`**
- **Purpose**: User profile page
- **Features**:
  - Fetches and displays user details
  - Shows username and profile image placeholder
  - Displays follower/following counts (hardcoded)
  - Includes activity heatmap
  - Logout functionality
  - Uses Primer React navigation tabs

**`user/HeatMap.jsx`**
- **Purpose**: Activity heatmap visualization
- **Features**:
  - Generates random activity data (currently demo data)
  - Displays GitHub-style contribution graph
  - Color-coded by activity level (green gradient)
  - Shows weekly activity pattern

**`Navbar.jsx`**
- **Purpose**: Navigation bar component
- **Features**:
  - GitHub logo and branding
  - Links to:
    - Home (Dashboard)
    - Create Repository (placeholder)
    - Profile page
  - Used across multiple pages

---

## 🔄 Project Workflow

### **1. Application Startup Flow**

```
1. Backend Server (index.js)
   ├── Loads environment variables (.env)
   ├── Connects to MongoDB
   ├── Sets up Express middleware (CORS, body-parser)
   ├── Mounts route handlers
   ├── Initializes Socket.io server
   └── Listens on PORT (default: 3000)

2. Frontend Application (main.jsx)
   ├── Renders React app
   ├── Wraps with AuthProvider
   ├── Wraps with BrowserRouter
   └── Loads Routes component
```

### **2. User Authentication Flow**

```
Signup:
1. User fills form (username, email, password)
2. Frontend sends POST /signup
3. Backend hashes password with bcrypt
4. Backend creates user in MongoDB
5. Backend generates JWT token
6. Frontend stores token & userId in localStorage
7. Frontend redirects to Dashboard

Login:
1. User fills form (email, password)
2. Frontend sends POST /login
3. Backend verifies credentials
4. Backend generates JWT token
5. Frontend stores token & userId in localStorage
6. Frontend redirects to Dashboard
```

### **3. Repository Management Flow**

```
Create Repository:
1. User creates repo via frontend (or API)
2. POST /repo/create with owner, name, description
3. Backend creates Repository document
4. Backend links repo to user's repositories array
5. Frontend refreshes repository list

View Repositories:
1. Dashboard loads
2. GET /repo/user/:userID
3. Backend queries MongoDB for user's repos
4. Frontend displays repositories
5. User can search/filter repositories
```

### **4. Version Control Workflow (CLI)**

```
Initialize Repository:
1. User runs: node index.js init
2. Creates .apnaGit/ directory structure
3. Creates config.json with S3 bucket info

Add Files:
1. User runs: node index.js add <file>
2. Copies file to .apnaGit/staging/

Commit Changes:
1. User runs: node index.js commit "message"
2. Generates unique commit ID (UUID)
3. Creates commit directory: .apnaGit/commits/{commitID}/
4. Copies staged files to commit directory
5. Creates commit.json with message and timestamp

Push to Cloud:
1. User runs: node index.js push
2. Reads all commits from .apnaGit/commits/
3. Uploads each file to AWS S3 bucket
4. Maintains directory structure in S3

Pull from Cloud:
1. User runs: node index.js pull
2. Lists all objects in S3 bucket (commits/ prefix)
3. Downloads files to local .apnaGit/commits/
4. Syncs local repository with remote

Revert to Commit:
1. User runs: node index.js revert <commitID>
2. Finds commit in .apnaGit/commits/{commitID}/
3. Copies all files from commit to working directory
4. Restores project to that commit state
```

### **5. Issue Tracking Flow**

```
Create Issue:
1. User creates issue for repository
2. POST /issue/create with title, description, repository ID
3. Backend creates Issue document
4. Backend links issue to repository's issues array

Update Issue:
1. User updates issue (title, description, status)
2. PUT /issue/update/:id
3. Backend updates Issue document
4. Status can be "open" or "closed"

View Issues:
1. GET /issue/all or GET /issue/:id
2. Backend queries MongoDB
3. Frontend displays issues
```

### **6. Real-time Features (Socket.io)**

```
Connection:
1. Client connects to Socket.io server
2. Client emits "joinRoom" with userID
3. Server joins socket to user-specific room
4. Enables user-specific real-time updates (future feature)
```

---

## 🎯 Key Features

### **Implemented Features:**
1. ✅ User authentication (signup/login) with JWT
2. ✅ User profile management
3. ✅ Repository CRUD operations
4. ✅ Repository visibility toggle (public/private)
5. ✅ Issue tracking system
6. ✅ Custom version control system (init, add, commit, push, pull, revert)
7. ✅ AWS S3 integration for cloud storage
8. ✅ Activity heatmap visualization
9. ✅ Repository search functionality
10. ✅ Socket.io setup for real-time features

### **Potential Enhancements:**
- ⚠️ Authentication middleware not fully implemented
- ⚠️ Authorization middleware not implemented
- ⚠️ Real-time collaboration features (Socket.io rooms set up but not used)
- ⚠️ Branch management in version control
- ⚠️ Merge functionality
- ⚠️ Pull requests system
- ⚠️ Repository cloning
- ⚠️ File diff visualization
- ⚠️ Commit history visualization in UI

---

## 🔐 Security Considerations

1. **Password Hashing**: Uses bcryptjs with salt rounds
2. **JWT Tokens**: Token-based authentication
3. **CORS**: Configured to allow all origins (`*`) - should be restricted in production
4. **Environment Variables**: Uses dotenv for sensitive data
5. **MongoDB Injection**: Uses parameterized queries (Mongoose/MongoDB driver)

---

## 📊 Database Schema Relationships

```
User
├── repositories: [Repository] (one-to-many)
├── followedUsers: [User] (many-to-many)
└── starRepos: [Repository] (many-to-many)

Repository
├── owner: User (many-to-one)
└── issues: [Issue] (one-to-many)

Issue
└── repository: Repository (many-to-one)
```

---

## 🚀 Running the Project

### **Backend:**
```bash
cd backend-main
npm install
npm start  # Starts server on PORT 3000
```

### **Frontend:**
```bash
cd frontend-main
npm install
npm run dev  # Starts Vite dev server
```

### **Version Control Commands:**
```bash
cd backend-main
node index.js init
node index.js add <file>
node index.js commit "message"
node index.js push
node index.js pull
node index.js revert <commitID>
```

---

## 📝 Notes

- The project uses both MongoDB native driver (MongoClient) and Mongoose ODM
- Frontend API calls are hardcoded to `http://localhost:3002` (should use environment variables)
- S3 bucket name needs to be configured in `aws-config.js`
- Some features like authentication middleware are placeholders
- HeatMap uses demo data (should be connected to actual commit history)

---

**Project Status**: Functional MVP with core features implemented. Ready for enhancement and production deployment with proper security configurations.

