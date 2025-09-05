<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# MERN Stack Application Instructions

This is a full-stack MERN application with the following tech stack:

## Frontend

- **Vite** - Build tool and development server
- **React** - JavaScript UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

## Backend

- **Express.js** - Node.js web framework
- **Prisma ORM** - Database toolkit and ORM
- **PostgreSQL** - Database
- **CORS** - Cross-origin resource sharing

## Project Structure

- `/frontend` - React application with Vite
- `/backend` - Express.js API server with Prisma

## Development Guidelines

- Use ES6+ JavaScript features
- Follow React hooks pattern for state management
- Use Tailwind CSS classes for styling
- Implement proper error handling in API calls
- Follow RESTful API conventions
- Use Prisma for all database operations

## Database Schema

- **User** model with id, email, name, posts relation
- **Post** model with id, title, content, author relation

When generating code:

- Use modern JavaScript/React patterns
- Implement responsive design with Tailwind CSS
- Include proper error handling and loading states
- Follow the existing code style and structure
