# Backend Deployment Guide

## 🚀 Quick Deploy

### Prerequisites

- PostgreSQL database (cloud provider like Aiven, Railway, etc.)
- Node.js runtime environment (Render, Railway, Heroku, etc.)

### Environment Variables Required

```bash
PORT=8000
NODE_ENV=production
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your-super-secret-jwt-key
SECRET_KEY=your-secret-key
FRONTEND_URL=https://your-frontend-domain.com
```

### Deploy Steps

1. **Clone/Upload your code** to your hosting platform

2. **Set Environment Variables** in your hosting dashboard:

   - Copy variables from `.env.example`
   - Update `DATABASE_URL` with your PostgreSQL connection string
   - Update `FRONTEND_URL` with your deployed frontend URL
   - Generate secure `JWT_SECRET` (use a tool like `openssl rand -hex 32`)

3. **Build Command** (if needed):

   ```bash
   npm install && npm run build
   ```

4. **Start Command**:
   ```bash
   npm start
   ```

### Popular Hosting Platforms

#### Railway

1. Connect GitHub repository
2. Set environment variables in dashboard
3. Railway auto-detects Node.js and deploys

#### Render

1. Connect GitHub repository
2. Set environment variables
3. Build command: `npm install && npm run build`
4. Start command: `npm start`

#### Heroku

1. `heroku create your-app-name`
2. `heroku config:set` for each environment variable
3. `git push heroku main`

### Database Migration

The app will automatically run migrations on startup. For manual migration:

```bash
npm run db:migrate
```

### Sample Data (Optional)

To populate with sample data:

```bash
npm run db:seed
```

### Health Check

After deployment, verify at: `https://your-domain.com/health`

### CORS Configuration

Make sure `FRONTEND_URL` matches your frontend deployment URL exactly.

## 🔧 Troubleshooting

### Common Issues:

1. **CORS errors**: Check `FRONTEND_URL` environment variable
2. **Database connection**: Verify `DATABASE_URL` and network access
3. **Cookie issues**: Ensure `NODE_ENV=production` for HTTPS cookies
4. **Build failures**: Check Node.js version compatibility

### Logs:

Check your hosting platform's logs for detailed error messages.
