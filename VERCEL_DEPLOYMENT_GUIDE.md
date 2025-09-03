# Vercel Deployment Guide for CodeSync with Ollama

This guide will help you deploy your CodeSync application to Vercel with **free AI capabilities using Ollama on Railway**.

## 🎉 Great News: Ollama CAN Run on Railway!

**Railway supports Ollama perfectly** because:
- ✅ Supports Docker containers
- ✅ Allows long-running processes
- ✅ Has persistent storage
- ✅ Free tier available
- ✅ No API costs or rate limits

## 🚀 Deployment Options

### **Option 1: Vercel + Railway with Ollama (Recommended)**
- **Frontend**: Vercel (Free tier)
- **Backend**: Railway (Free tier: 500 hours/month, $5 credit)
- **AI**: Ollama (Completely free, runs locally on Railway)

### **Option 2: Vercel + Render with Ollama**
- **Frontend**: Vercel (Free tier)
- **Backend**: Render (Free tier: 750 hours/month)
- **AI**: Ollama (Completely free)

### **Option 3: Vercel + Fly.io with Ollama**
- **Frontend**: Vercel (Free tier)
- **Backend**: Fly.io (Free tier: 3 shared-cpu VMs)
- **AI**: Ollama (Completely free)

## 📋 Prerequisites

1. **GitHub Account** with your CodeSync repository
2. **Vercel Account** (free at [vercel.com](https://vercel.com))
3. **Railway Account** (free at [railway.app](https://railway.app))
4. **MongoDB Atlas Account** (free tier available)
5. **No API keys needed** - Ollama is completely free!

## 🎯 Step-by-Step Deployment

### **Step 1: Prepare Your Repository**

1. **Push your code to GitHub** (if not already done)
2. **Ensure all dependencies are in package.json files**
3. **Test your application locally**

### **Step 2: Deploy Backend to Railway**

1. **Go to [Railway.app](https://railway.app)**
2. **Sign in with GitHub**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your CodeSync repository**
5. **Set the root directory to `/backend`**
6. **Railway will automatically detect the Dockerfile**
7. **Add environment variables**:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codesync
JWT_SECRET=your-super-secret-jwt-key
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=codellama:7b
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

8. **Deploy and get your Railway URL**

**Note**: The first deployment will take longer as it downloads the Ollama model (~4GB for codellama:7b)

### **Step 3: Deploy Frontend to Vercel**

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Import your CodeSync repository**
5. **Configure build settings**:
   - **Framework Preset**: Other
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

6. **Add environment variables**:
   - `REACT_APP_API_URL`: Your Railway backend URL

7. **Deploy**

### **Step 4: Update Configuration**

1. **Update `vercel.json`** with your Railway backend URL
2. **Redeploy if needed**

## 🔧 Configuration Files

### **vercel.json** (Frontend)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-railway-backend.railway.app/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### **Dockerfile** (Backend)
```dockerfile
# Multi-stage build for Ollama + Node.js backend
FROM ollama/ollama:latest as ollama

# Use Node.js 18 Alpine for the backend
FROM node:18-alpine

# Install dependencies for Ollama
RUN apk add --no-cache \
    curl \
    bash \
    && rm -rf /var/cache/apk/*

# Copy Ollama from the ollama stage
COPY --from=ollama /usr/bin/ollama /usr/bin/ollama
COPY --from=ollama /usr/local/bin/ollama /usr/local/bin/ollama

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create startup script
RUN echo '#!/bin/bash\n\
ollama serve &\n\
until curl -s http://localhost:11434/api/tags > /dev/null; do\n\
  sleep 1\n\
done\n\
if ! ollama list | grep -q "codellama:7b"; then\n\
  ollama pull codellama:7b\n\
fi\n\
exec node index.js\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose ports
EXPOSE 5001 11434

# Start the application
CMD ["/app/start.sh"]
```

### **railway.toml** (Backend)
```toml
[build]
builder = "dockerfile"

[deploy]
startCommand = "/app/start.sh"
healthcheckPath = "/api/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[env]
NODE_ENV = "production"
```

## 💰 Free Tier Limits

### **Vercel (Frontend)**
- ✅ **Unlimited deployments**
- ✅ **100GB bandwidth/month**
- ✅ **Custom domains**
- ✅ **HTTPS included**

### **Railway (Backend)**
- ✅ **500 hours/month free**
- ✅ **$5 credit monthly**
- ✅ **Custom domains**
- ✅ **Auto-scaling**

### **Ollama (AI)**
- 🎉 **Completely free**
- 🎉 **No API costs**
- 🎉 **No rate limits**
- 🎉 **Unlimited usage**

## 🚨 Common Issues & Solutions

### **Issue: Ollama Model Download Takes Long**
**Solution**: This is normal for first deployment. The model (~4GB) only downloads once.

### **Issue: CORS Errors**
**Solution**: Update `ALLOWED_ORIGINS` in Railway environment variables

### **Issue: API Routes Not Working**
**Solution**: Check `vercel.json` routing configuration

### **Issue: Build Failures**
**Solution**: Ensure all dependencies are in `package.json`

### **Issue: Ollama Not Starting**
**Solution**: Check Railway logs. The startup script waits for Ollama to be ready.

## 🔄 Updating Your Deployment

### **Automatic Updates**
- **Vercel**: Automatically deploys on git push
- **Railway**: Automatically deploys on git push

### **Manual Updates**
- **Vercel**: Redeploy from dashboard
- **Railway**: Redeploy from dashboard

## 📊 Monitoring & Analytics

### **Vercel Analytics**
- Page views and performance
- Real-time user monitoring
- Error tracking

### **Railway Metrics**
- CPU and memory usage
- Request logs
- Health check status
- Ollama model status

## 🎉 Post-Deployment

1. **Test all features** (login, file editing, AI)
2. **Verify Ollama is working** (check Railway logs)
3. **Set up custom domain** (optional)
4. **Configure monitoring** (optional)
5. **Share your app** with the world!

## 💡 Performance Tips

1. **Use smaller models** (7B instead of 13B) for faster responses
2. **Monitor Railway resource usage** to stay within free tier
3. **Consider upgrading** if you exceed free tier limits

## 🆘 Getting Help

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Ollama Docs**: [ollama.ai/docs](https://ollama.ai/docs)
- **GitHub Issues**: Your repository's issue tracker

---

**Happy Deploying! 🚀**

Your CodeSync app will be live on the internet with **completely free AI assistance** powered by Ollama!
