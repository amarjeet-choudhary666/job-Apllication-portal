# Employer Credentials
email: amarjeetchoudhary647@gmail.com
password: Manish@786

# Developer Credentails
email: amarjeetchoudhary647111@gmail.com
password: Manish@786


# Job Application Platform

A full-stack web application that allows users to post jobs, apply for jobs, and manage job applications. Built with a modern tech stack for scalability and user experience.

## Features

- User authentication and authorization
- Job posting and management
- Job application system
- Responsive UI with modern design
- Secure API with JWT authentication
- MongoDB database for data persistence

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Date-fns** - Date utility library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd centcage-assignment
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../server
   npm install
   ```

## Environment Setup

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobapp
JWT_SECRET=your-secret-key
```

## Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Production Mode

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Build the backend:
   ```bash
   cd server
   npm run build
   npm start
   ```

## Project Structure

```
centcage-assignment/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── services/    # API service functions
│   │   └── lib/         # Utility functions
│   ├── public/          # Static assets
│   └── package.json
├── server/             # Node.js backend application
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── middlewares/  # Express middlewares
│   │   ├── validation/   # Input validation schemas
│   │   ├── utils/        # Utility functions
│   │   ├── services/     # Business logic services
│   │   ├── types/        # TypeScript type definitions
│   │   └── db/           # Database connection
│   ├── scripts/          # Utility scripts
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create a new job (authenticated)
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job (authenticated)
- `DELETE /api/jobs/:id` - Delete job (authenticated)

### Applications
- `POST /api/applications` - Apply for a job (authenticated)
- `GET /api/applications` - Get user's applications (authenticated)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the ISC License.
