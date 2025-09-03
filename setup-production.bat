@echo off
echo 🚀 Setting up CodeSync for Production Deployment with Ollama
echo =============================================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the root directory of CodeSync
    pause
    exit /b 1
)

echo 📋 Prerequisites Check:
echo 1. GitHub repository with your code ✓
echo 2. Vercel account (free) - https://vercel.com
echo 3. Railway account (free) - https://railway.app
echo 4. MongoDB Atlas account (free) - https://mongodb.com/cloud/atlas
echo 5. No API keys needed - Ollama is completely free! 🎉

echo.
echo 🔧 Configuration Steps:
echo.

echo Step 1: Update vercel.json with your Railway backend URL
echo    - Replace 'your-railway-backend-url.railway.app' with your actual Railway URL
echo.

echo Step 2: Set up Railway environment variables:
echo    NODE_ENV=production
echo    MONGODB_URI=your-mongodb-connection-string
echo    JWT_SECRET=your-super-secret-jwt-key
echo    AI_PROVIDER=ollama
echo    OLLAMA_BASE_URL=http://localhost:11434
echo    OLLAMA_MODEL=codellama:7b
echo    ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
echo.

echo Step 3: Set up Vercel environment variables:
echo    REACT_APP_API_URL=your-railway-backend-url.railway.app
echo.

echo 📁 Files Created:
echo    ✓ vercel.json - Vercel configuration
echo    ✓ railway.json - Railway configuration
echo    ✓ backend/railway.toml - Backend Railway config
echo    ✓ backend/Dockerfile - Docker configuration with Ollama
echo    ✓ backend/.dockerignore - Docker optimization
echo    ✓ backend/env.production - Production environment template
echo    ✓ backend/services/aiService.production.js - Production AI service with Ollama
echo    ✓ VERCEL_DEPLOYMENT_GUIDE.md - Complete deployment guide
echo.

echo 🎯 Next Steps:
echo 1. Push your code to GitHub
echo 2. Deploy backend to Railway (will auto-detect Dockerfile)
echo 3. Deploy frontend to Vercel
echo 4. Update configuration files with your URLs
echo 5. Test your deployed application
echo.

echo 📚 For detailed instructions, see: VERCEL_DEPLOYMENT_GUIDE.md
echo.

echo 🎉 Benefits of Ollama on Railway:
echo - Completely free AI (no API costs)
echo - No rate limits or usage quotas
echo - Runs locally on Railway
echo - Supports multiple AI models
echo.

echo ⚠️  Important Notes:
echo - First deployment takes longer (downloads ~4GB Ollama model)
echo - Railway supports Docker and long-running processes
echo - Free tier has usage limits (see guide for details)
echo.

echo 🚀 Ready to deploy with free AI! Good luck!
pause
