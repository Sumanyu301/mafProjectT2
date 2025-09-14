# Frontend Deployment Guide

## 🚀 Quick Deploy Options

### **Option 1: Vercel (Recommended)**
1. **Connect GitHub**: Go to [vercel.com](https://vercel.com) → Import Project
2. **Select Repository**: `mafProjectT2`
3. **Root Directory**: Set to `frontend`
4. **Environment Variables**: 
   ```
   VITE_API_URL=https://mafprojectt2.onrender.com
   ```
5. **Deploy**: Vercel auto-detects Vite and deploys!

### **Option 2: Netlify**
1. **Connect GitHub**: Go to [netlify.com](https://netlify.com) → New Site
2. **Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
3. **Environment Variables**:
   ```
   VITE_API_URL=https://mafprojectt2.onrender.com
   ```

### **Option 3: Render Static Site**
1. **Connect GitHub**: Create new Static Site
2. **Settings**:
   - **Root directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. **Environment Variables**:
   ```
   VITE_API_URL=https://mafprojectt2.onrender.com
   ```

## 🔧 Build Configuration

- **Framework**: Vite + React
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18+ recommended

## 🌐 Environment Variables Required

```bash
VITE_API_URL=https://mafprojectt2.onrender.com
```

## ✅ Post-Deployment

1. **Test your app** at the deployed URL
2. **Verify API connection** by trying to log in
3. **Check browser console** for any CORS issues

## 🔧 Troubleshooting

- **API errors**: Verify `VITE_API_URL` is correct
- **Build fails**: Check Node.js version compatibility
- **CORS issues**: Backend already configured for all origins
