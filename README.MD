# TaskManager-1

A full-stack Task Management application built with React and Node.js that allows users to create, manage, and track their daily tasks with user authentication.

![Task Manager Screenshot](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Task+Manager+Dashboard)

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Filtering**: Filter tasks by status (All, Completed, Pending)
- **Search Functionality**: Search tasks by title
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Instant UI updates for all operations
- **Dark Theme**: Professional dark-themed interface

## Tech Stack

### Frontend

- React 18 with Hooks
- React Router for navigation
- Fetch API for HTTP requests
- Tailwind CSS for styling
- Font Awesome for icons

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests

## Project Structure

```
task-tracker/
├── frontend/
│   ├── src/
│   │   ├── Pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── CreateTask.jsx
│   │   │   └── EditUserTask.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── Dockerfile
│   └── ...
├── backend/
│   ├── controller/
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── model/
│   │   ├── taskModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── taskRoute.js
│   │   └── userRoute.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── tests/
│   │   └── routes.test.js
│   ├── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js (v16 or higher) _or_ Docker
- MongoDB (local or Atlas) _or_ Docker
- Git

## Installation & Setup

### Quick Start with Docker 🐳

```bash
git clone https://github.com/SuvraneelSaha/TaskManager-1.git
cd TaskManager-1
docker-compose up --build
```

Access at: `http://localhost:3000` ✨

_Stop with `docker-compose down`_

### Manual Setup

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`**

   ```env
   MONGO_URL=mongodb://localhost:27017/tasktracker
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=8000
   NODE_ENV=development
   ```

5. **Start MongoDB** (if using local MongoDB)

   ```bash
   # On macOS with Homebrew
   brew services start mongodb/brew/mongodb-community

   # On Windows/Linux
   mongod
   ```

6. **Start the backend server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

   The backend will be running at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

   The frontend will be running at `http://localhost:3000`

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## API Endpoints

### User Routes

- `POST /api/user/registerUser` - Register new user
- `POST /api/user/loginUser` - Login user

### Task Routes

- `GET /api/tasks` - Get all tasks for authenticated user
- `GET /api/task/:id` - Get single task by ID
- `POST /api/createTask` - Create new task
- `PUT /api/task/:id` - Update task by ID
- `DELETE /api/task/:id` - Delete task by ID

## Usage Guide

1. **Registration**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: View all your tasks with filtering and search options
4. **Create Task**: Add new tasks with title and optional due date
5. **Edit Task**: Update task details and mark as complete/incomplete
6. **Delete Task**: Remove tasks with confirmation dialog

## Authentication Flow

1. User registers/logs in with credentials
2. Server validates and returns JWT token
3. Token is stored in localStorage
4. Token is sent with each protected API request
5. Server validates token and processes request
6. Token expires after 30 minutes, user redirected to login

## UI Features

- **Dark Theme**: Professional dark color scheme
- **Responsive Design**: Mobile-friendly interface
- **Loading States**: Visual feedback during operations
- **Error Handling**: Clear error messages
- **Confirmation Modals**: Safe delete operations
- **Animations**: Smooth transitions and hover effects

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGO_URL=mongodb://localhost:27017/tasktracker

# Authentication
JWT_SECRET=your_jwt_secret_key_should_be_very_long_and_complex

# Server
PORT=8000
NODE_ENV=development
```

## Troubleshooting

### General Issues

- **Connection refused**: Ensure MongoDB is running
- **JWT errors**: Check JWT_SECRET in environment variables
- **CORS errors**: Verify backend CORS configuration
- **Port conflicts**: Change PORT in .env if 8000 is occupied

### Docker-specific Issues

- **Container fails to start**: `docker-compose logs`
- **Port conflicts**: Stop services using ports 3000, 8000, 27017
- **Build issues**: `docker system prune` then rebuild

Set `NODE_ENV=development` in .env for detailed error messages.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Suvraneel Saha**

- GitHub: [@SuvraneelSaha](https://github.com/SuvraneelSaha)
- Email: suvroneel2001@gmail.com

## Acknowledgments

- React team for the amazing framework
- MongoDB team for the database solution
- Tailwind CSS for utility-first styling
- Font Awesome for beautiful icons

---

**Note**: This is a learning project created for educational purposes. Feel free to use it as a reference or starting point for your own projects!

Made with ❤️ by Suvraneel Saha
