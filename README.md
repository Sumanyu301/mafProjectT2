# MERN Project Management System

A comprehensive full-stack project management application built with the MERN stack, featuring employee management, project tracking, task assignment, and milestone monitoring.

## 🚀 Tech Stack

### Frontend

- **React** - JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Axios** - Promise-based HTTP client for API communication

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Prisma ORM** - Type-safe database client and query builder
- **PostgreSQL** - Advanced open-source relational database
- **JWT** - JSON Web Tokens for secure authentication
- **bcryptjs** - Password hashing library
- **cookie-parser** - Cookie parsing middleware

## 📁 Project Structure

```
mafProject/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   └── AuthForm.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── services/            # API service functions
│   │   │   └── authAPI.js
│   │   ├── App.jsx              # Main application component
│   │   ├── api.js               # API configuration
│   │   └── main.jsx             # Application entry point
│   ├── package.json
│   └── vite.config.js
├── backend/                     # Express.js backend API
│   ├── controllers/             # Business logic controllers
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── milestoneController.js
│   │   ├── projectController.js
│   │   ├── projectEmployeeController.js
│   │   ├── skillController.js
│   │   ├── taskController.js
│   │   └── usersController.js
│   ├── middlewares/             # Express middlewares
│   │   └── authMiddlewares.js
│   ├── routes/                  # API route definitions
│   │   ├── auth.js
│   │   ├── employees.js
│   │   ├── milestones.js
│   │   ├── projects.js
│   │   ├── projectEmployees.js
│   │   ├── skills.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── prisma/                  # Database schema and migrations
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── server.js                # Express server configuration
│   ├── prismaClient.js          # Prisma client instance
│   ├── package.json
│   ├── full_api_test.sh         # Comprehensive API testing script
│   └── .env                     # Environment variables
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   # Create .env file with the following variables:
   DATABASE_URL="postgresql://username:password@localhost:5432/mafproject"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=5000
   ```

4. Initialize Prisma and run migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the development server:
   ```bash
   npm start
   # or
   node server.js
   ```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## 🔗 API Endpoints

### 🔐 Authentication

- `POST /api/auth/signup` - User registration (requires username, email, password)
- `POST /api/auth/login` - User login (returns JWT in httpOnly cookie)
- `POST /api/auth/logout` - User logout

### 👤 Users

- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user information
- `DELETE /api/users/:id` - Delete user

### 👥 Employees

- `POST /api/employees` - Create new employee
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### � Skills

- `POST /api/skills` - Create new skill
- `GET /api/skills` - Get all skills
- `GET /api/skills/:id` - Get skill by ID
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### 📂 Projects

- `POST /api/projects` - Create new project (Admin only)
- `GET /api/projects` - Get all projects with filters (status, priority)
- `GET /api/projects/:id` - Get project details with employees, tasks, milestones
- `PUT /api/projects/:id` - Update project information (Admin only)
- `DELETE /api/projects/:id` - Delete project (Admin only)

### 👨‍👩‍👧 Project Employees

- `POST /api/projects/:id/employees` - Assign employee(s) to project (Admin only)
- `GET /api/projects/:id/employees` - Get list of employees in a project
- `DELETE /api/projects/:id/employees/:employeeId` - Remove employee from project (Admin only)

### ✅ Tasks

- `POST /api/projects/:id/tasks` - Create task under project (Admin only)
- `GET /api/projects/:id/tasks` - List all tasks of project
- `GET /api/tasks/:taskId` - Get task details
- `PUT /api/tasks/:taskId` - Update task (status, deadline, assignment) (Admin only)
- `DELETE /api/tasks/:taskId` - Delete task (Admin only)

### 🎯 Milestones

- `POST /api/projects/:id/milestones` - Create milestone for project (Admin only)
- `GET /api/projects/:id/milestones` - List milestones of project
- `PUT /api/milestones/:milestoneId` - Update milestone (title, due_date) (Admin only)
- `DELETE /api/milestones/:milestoneId` - Delete milestone (Admin only)

## 🧪 API Testing

Run the comprehensive API test suite:

```bash
cd backend
chmod +x full_api_test.sh
./full_api_test.sh
```

This script tests all 20 endpoints with proper authentication and provides detailed feedback.

### Manual Testing Examples

```bash
# Register a new user
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}' \
  http://localhost:5000/api/auth/signup

# Login user (saves JWT to cookies)
curl -c cookies.txt -X POST -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  http://localhost:5000/api/auth/login

# Get all projects (authenticated)
curl -b cookies.txt http://localhost:5000/api/projects

# Create a project (Admin only)
curl -b cookies.txt -X POST -H "Content-Type: application/json" \
  -d '{"title":"New Project","description":"Project description","priority":"HIGH","startDate":"2025-09-10T00:00:00Z","deadline":"2025-12-31T23:59:59Z"}' \
  http://localhost:5000/api/projects
```

## � Database Schema

### Core Models

**User** - System authentication and user management

```prisma
model User {
  id           Int       @id @default(autoincrement())
  username     String    @unique
  email        String    @unique
  passwordHash String
  systemRole   Role      @default(EMPLOYEE)
  employee     Employee?
  createdAt    DateTime  @default(now())
  lastLogin    DateTime?
}
```

**Employee** - Employee information and profiles

```prisma
model Employee {
  id           Int      @id @default(autoincrement())
  userId       Int      @unique
  name         String
  contact      String
  designation  String?
  department   String?
  joiningDate  DateTime?
  user         User     @relation(fields: [userId], references: [id])
  skills       EmployeeSkill[]
  projects     ProjectEmployee[]
  tasks        Task[]
  createdProjects Project[] @relation("ProjectCreator")
}
```

**Project** - Project management and tracking

```prisma
model Project {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  status      Status    @default(PLANNING)
  priority    Priority  @default(MEDIUM)
  startDate   DateTime?
  deadline    DateTime?
  createdBy   Int
  creator     Employee  @relation("ProjectCreator", fields: [createdBy], references: [id])
  members     ProjectEmployee[]
  tasks       Task[]
  milestones  Milestone[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### Enums

```prisma
enum Role {
  ADMIN
  EMPLOYEE
}

enum Status {
  PLANNING
  IN_PROGRESS
  COMPLETED
  ON_HOLD
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  COMPLETED
  BLOCKED
}
```

## 🎨 Features

- **🔐 Secure Authentication**: JWT-based authentication with role-based access control
- **👥 Employee Management**: Complete CRUD operations for employee profiles
- **📂 Project Management**: Create, track, and manage projects with status and priority
- **✅ Task Management**: Assign tasks to employees with deadlines and status tracking
- **🎯 Milestone Tracking**: Set and monitor project milestones
- **🛡️ Role-Based Access**: Admin and Employee roles with different permissions
- **🔍 Advanced Filtering**: Filter projects by status, priority, and other criteria
- **📊 Comprehensive Relationships**: Many-to-many relationships between projects, employees, and skills

## 🚀 Development

### Running in Development Mode

1. Start the backend server:

   ```bash
   cd backend && node server.js
   ```

2. Start the frontend server:
   ```bash
   cd frontend && npm run dev
   ```

### Database Management

- **Prisma Studio**: Visual database browser

  ```bash
  cd backend && npx prisma studio
  ```

- **Generate Prisma Client**: After schema changes

  ```bash
  cd backend && npx prisma generate
  ```

- **Reset Database**: Reset and reseed the database
  ```bash
  cd backend && npx prisma migrate reset
  ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

**Total API Endpoints: 20** | **Authentication: JWT** | **Database: PostgreSQL** | **ORM: Prisma**
