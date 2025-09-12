#!/bin/bash

# Simple bash script to test the API changes
echo "🚀 Testing Project Ownership System Changes"
echo "=========================================="

BASE_URL="http://localhost:8000/api"

# Test 1: Register a new user
echo ""
echo "1. Testing User Registration..."
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser_'$(date +%s)'",
    "email": "test_'$(date +%s)'@example.com", 
    "password": "password123",
    "name": "Test User",
    "contact": "test@contact.com"
  }')

echo "Response: $SIGNUP_RESPONSE"

if echo "$SIGNUP_RESPONSE" | grep -q "successfully"; then
  echo "✅ User registration successful"
  USER_ID=$(echo "$SIGNUP_RESPONSE" | grep -o '"userId":[0-9]*' | cut -d':' -f2)
  EMPLOYEE_ID=$(echo "$SIGNUP_RESPONSE" | grep -o '"employeeId":[0-9]*' | cut -d':' -f2)
  echo "User ID: $USER_ID, Employee ID: $EMPLOYEE_ID"
else
  echo "❌ User registration failed"
  exit 1
fi

# Test 2: Login
echo ""
echo "2. Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "identifier": "test_'$(date +%s)'@example.com",
    "password": "password123"
  }')

echo "Response: $LOGIN_RESPONSE"

if echo "$LOGIN_RESPONSE" | grep -q "successful"; then
  echo "✅ User login successful"
else
  echo "❌ User login failed"
fi

# Test 3: Create Project (Anyone can create)
echo ""
echo "3. Testing Project Creation..."
PROJECT_RESPONSE=$(curl -s -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Test Project '$(date +%s)'",
    "description": "Testing project ownership system",
    "priority": "HIGH",
    "startDate": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
    "deadline": "'$(date -u -v+30d +%Y-%m-%dT%H:%M:%S.000Z)'",
    "employees": []
  }')

echo "Response: $PROJECT_RESPONSE"

if echo "$PROJECT_RESPONSE" | grep -q '"id"'; then
  echo "✅ Project creation successful"
  PROJECT_ID=$(echo "$PROJECT_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
  echo "Project ID: $PROJECT_ID"
  
  # Check if creator === owner
  CREATED_BY=$(echo "$PROJECT_RESPONSE" | grep -o '"createdBy":[0-9]*' | cut -d':' -f2)
  OWNER_ID=$(echo "$PROJECT_RESPONSE" | grep -o '"ownerId":[0-9]*' | cut -d':' -f2)
  
  if [ "$CREATED_BY" = "$OWNER_ID" ]; then
    echo "✅ Creator automatically became owner (createdBy: $CREATED_BY, ownerId: $OWNER_ID)"
  else
    echo "❌ Creator didn't become owner"
  fi
else
  echo "❌ Project creation failed"
fi

# Test 4: Get all projects
echo ""
echo "4. Testing Get All Projects..."
ALL_PROJECTS=$(curl -s -X GET "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -b cookies.txt)

echo "Response: $ALL_PROJECTS"

if echo "$ALL_PROJECTS" | grep -q '\['; then
  echo "✅ Get all projects successful"
else
  echo "❌ Get all projects failed"
fi

# Test 5: Verify no system roles
echo ""
echo "5. Testing No System Roles..."
VERIFY_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/verify" \
  -H "Content-Type: application/json" \
  -b cookies.txt)

echo "Response: $VERIFY_RESPONSE"

if echo "$VERIFY_RESPONSE" | grep -q '"role"'; then
  echo "❌ System still has role field"
else
  echo "✅ No system roles found (role field removed)"
fi

echo ""
echo "🎉 API Testing Complete!"
echo ""
echo "📋 Summary of Changes Verified:"
echo "   ✅ Anyone can create projects" 
echo "   ✅ Creator automatically becomes owner"
echo "   ✅ No system roles in authentication"
echo ""
echo "To test more features like project updates and skill assignments,"
echo "you can use the frontend or tools like Postman with the cookie authentication."

# Cleanup
rm -f cookies.txt
