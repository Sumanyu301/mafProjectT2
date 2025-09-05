# MERN Stack Application

A modern full-stack web application built with the MERN stack using PostgreSQL and Prisma ORM.

## 🚀 Tech Stack

### Frontend

- **React** - JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - Promise-based HTTP client

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma ORM** - Next-generation ORM for PostgreSQL
- **PostgreSQL** - Advanced open-source relational database

## 📁 Project Structure

```
mafProject/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js     # API service functions
│   │   ├── index.css  # Tailwind CSS imports
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/           # Express.js backend API
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   ├── server.js      # Express server
│   ├── package.json
│   └── .env          # Environment variables
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Prisma database:

   ```bash
   npx prisma dev
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the development server:
   ```bash
   npm run dev
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

### Users

- `GET /api/users` - Get all users with their posts
- `POST /api/users` - Create a new user

### Posts

- `GET /api/posts` - Get all posts with author information
- `POST /api/posts` - Create a new post

### Health

- `GET /health` - Health check endpoint

## 🎨 Features

- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Real-time Data**: Live connection status indicator
- **Database Integration**: Full CRUD operations with PostgreSQL
- **Type-safe Database**: Prisma ORM for type-safe database operations
- **Development Tools**: Hot reload with Vite and Nodemon

## 🚀 Development

### Running in Development Mode

1. Start the Prisma database:

   ```bash
   cd backend && npx prisma dev
   ```

2. Start the backend server:

   ```bash
   cd backend && npm run dev
   ```

3. Start the frontend server:
   ```bash
   cd frontend && npm run dev
   ```

### Database Management

- **Prisma Studio**: Visual database browser

  ```bash
  cd backend && npx prisma studio
  ```

- **Reset Database**: Reset and reseed the database
  ```bash
  cd backend && npx prisma migrate reset
  ```

## 📝 Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
# mafProjectT2
