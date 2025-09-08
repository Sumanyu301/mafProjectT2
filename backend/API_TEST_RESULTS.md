# API Testing Commands - MERN Project Management System

## 🚀 Basic Tests (Working)

# 1. Test server

curl http://localhost:5000/

# 2. Create user (note: uses 'username' not 'name')

curl -X POST -H "Content-Type: application/json" \
 -d '{"username":"testuser","email":"testuser@example.com","password":"password123"}' \
 http://localhost:5000/api/auth/signup

# 3. Login user (saves JWT to cookie)

curl -c cookies.txt -X POST -H "Content-Type: application/json" \
 -d '{"email":"testuser@example.com","password":"password123"}' \
 http://localhost:5000/api/auth/login

# 4. Create skills (no auth required)

curl -X POST -H "Content-Type: application/json" \
 -d '{"name":"JavaScript","category":"Programming"}' \
 http://localhost:5000/api/skills

# 5. Get skills

curl http://localhost:5000/api/skills

## 🔴 Protected Endpoints (Need Cookie Parser Fix)

# These will show "No token provided" until cookie-parser is installed:

# Get projects

curl -b cookies.txt http://localhost:5000/api/projects

# Create project (Admin only)

curl -b cookies.txt -X POST -H "Content-Type: application/json" \
 -d '{"title":"Test Project","description":"Test description","priority":"HIGH","startDate":"2025-09-10T00:00:00Z","deadline":"2025-12-31T23:59:59Z"}' \
 http://localhost:5000/api/projects

## 🛠️ Fix Required

# Install cookie-parser:

# npm install cookie-parser

# Add to server.js:

# import cookieParser from 'cookie-parser';

# app.use(cookieParser());

## 📊 Endpoint Status:

✅ GET / - Base route
✅ POST /api/auth/signup - User registration  
✅ POST /api/auth/login - User login
✅ POST /api/skills - Create skill
✅ GET /api/skills - Get skills
❌ All protected routes (need cookie-parser fix)

## 🔧 Next Steps:

1. Install cookie-parser package
2. Add cookie parser middleware to server.js
3. Test protected endpoints
4. Create test data for comprehensive testing
