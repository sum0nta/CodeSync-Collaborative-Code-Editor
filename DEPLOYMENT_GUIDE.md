# 🚀 Free Deployment Guide for CodeSync

Deploy your collaborative code editor **completely FREE** using industry-standard platforms!

## 📋 Prerequisites

1. GitHub account (to connect with deployment platforms)
2. Google account (for MongoDB Atlas)
3. Email address for Render & Vercel accounts

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create Free Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with your Google account
3. Create a **FREE M0 Cluster**:
   - Choose **AWS** as provider
   - Select region closest to you (e.g., `us-east-1`)
   - Cluster name: `codesync-cluster`

### 1.2 Configure Database Access
1. Click **Database Access** → **Add New Database User**
   - Username: `codesync-admin`
   - Password: Generate a secure password (SAVE THIS!)
   - User Privileges: **Atlas admin**

2. Click **Network Access** → **Add IP Address**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Confirm

### 1.3 Get Connection String
1. Click **Database** → **Connect** → **Connect your application**
2. Copy the connection string (looks like):
   ```
   mongodb+srv://codesync-admin:<password>@codesync-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. **IMPORTANT**: Replace `<password>` with your actual password
4. Add database name at the end: `/codesync` before the `?`
   ```
   mongodb+srv://codesync-admin:YOUR_PASSWORD@codesync-cluster.xxxxx.mongodb.net/codesync?retryWrites=true&w=majority
   ```

---

## 🔧 Step 2: Setup Google AI (Recommended for AI Features)

**Important:** Your codebase uses **Ollama** for local development, but Ollama **cannot run on free cloud hosting**. Use Google Gemini instead!

### Why Google Gemini?
- ✅ **FREE** (1,500 requests/day, 60/minute)
- ✅ No credit card required
- ✅ Better than Ollama's CodeLlama for code generation
- ✅ **Already integrated** in your backend!
- ❌ Ollama needs 4-8GB RAM (Render free = 512MB)

### Get Your Free API Key:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google account
3. Click **"Create API Key"**
4. Copy and save the API key (starts with `AIza...`)

**Don't have a Google account?** See [FREE_AI_ALTERNATIVES.md](./FREE_AI_ALTERNATIVES.md) for other options like Groq, Hugging Face, etc.

---

## ⚡ Step 3: Deploy Backend to Render

### 3.1 Create Render Account
1. Go to [Render.com](https://render.com/)
2. Sign up with GitHub account
3. Authorize Render to access your repositories

### 3.2 Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select **`CodeSync-Collaborative-Code-Editor`** repo
4. Configure:
   - **Name**: `codesync-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free**

### 3.3 Add Environment Variables
Click **"Environment"** and add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | Your MongoDB connection string from Step 1.3 |
| `JWT_SECRET` | Generate random string at [Random.org](https://www.random.org/passwords/?num=1&len=64&format=plain) |
| `GOOGLE_AI_API_KEY` | Your Google AI API key from Step 2 (optional) |

### 3.4 Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Your backend URL will be: `https://codesync-backend.onrender.com`
4. **SAVE THIS URL!** You'll need it for frontend

### 3.5 Verify Backend
Visit: `https://codesync-backend.onrender.com/api/health`

You should see:
```json
{
  "status": "OK",
  "timestamp": "...",
  "uptime": 123
}
```

---

## 🎨 Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account
1. Go to [Vercel.com](https://vercel.com/signup)
2. Sign up with GitHub account
3. Authorize Vercel

### 4.2 Update Frontend Config
Before deploying, you need to update one file locally:

**Update `frontend/src/utils/config.js`:**
1. Open the file
2. Update the backend URL to your Render backend URL
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update backend URL for production"
   git push
   ```

### 4.3 Deploy to Vercel
1. Click **"Add New Project"**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 4.4 Add Environment Variable
Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `REACT_APP_BACKEND_URL` | Your Render backend URL (e.g., `https://codesync-backend.onrender.com`) |

### 4.5 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your frontend URL will be: `https://codesync-xxx.vercel.app`

---

## 🔄 Step 5: Update CORS Settings

### 5.1 Update Backend CORS
1. Go to Render dashboard → Your backend service
2. Add/Update environment variable:
   - Key: `FRONTEND_URL`
   - Value: Your Vercel frontend URL (e.g., `https://codesync-xxx.vercel.app`)
3. The backend will automatically allow this origin

**OR** manually update `backend/index.js`:
```javascript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',  // Add your Vercel URL
    'http://localhost:3000'
  ],
  // ... rest of config
}));
```

### 5.2 Redeploy Backend
If you manually updated the code:
1. Commit changes: `git add . && git commit -m "Update CORS for production"`
2. Push: `git push`
3. Render will auto-deploy

---

## ✅ Step 6: Test Your Deployment

### 6.1 Test Backend
Visit: `https://your-backend.onrender.com/api/health` ✅

### 6.2 Test Frontend
1. Visit: `https://your-frontend.vercel.app` ✅
2. Try to register a new account
3. Login and test features

---

## 🎯 Important Notes

### Free Tier Limitations
- **Render Free**: 
  - App sleeps after 15 min of inactivity
  - First request after sleep takes 30-60 seconds
  - 750 hours/month of runtime
  
- **Vercel Free**:
  - Unlimited deployments
  - 100GB bandwidth/month
  
- **MongoDB Atlas Free**:
  - 512MB storage
  - Shared cluster

### Keep Your App Awake (Optional)
To prevent Render from sleeping:
1. Use [UptimeRobot](https://uptimerobot.com/) (free)
2. Add your backend URL: `https://your-backend.onrender.com/api/health`
3. Set to ping every 5 minutes

---

## 🔗 URLs for Your CV

After deployment, you'll have:
- **Live App**: `https://your-app.vercel.app`
- **API Docs**: `https://your-backend.onrender.com/api/health`
- **GitHub Repo**: `https://github.com/yourusername/CodeSync-Collaborative-Code-Editor`

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string is correct
- Verify all environment variables are set
- Check Render logs: Dashboard → Your Service → Logs

### Frontend can't connect to backend
- Verify backend URL in environment variables
- Check CORS settings in backend
- Open browser console for errors

### Database connection failed
- Verify MongoDB password is correct
- Check IP whitelist includes 0.0.0.0/0
- Ensure database name is in connection string

### AI features not working
- Check if `GOOGLE_AI_API_KEY` is set
- Verify API key is valid at [Google AI Studio](https://aistudio.google.com/)

---

## 📧 Need Help?

If you encounter issues:
1. Check the deployment platform logs
2. Verify all environment variables
3. Test each service independently
4. Check browser console for frontend errors

---

## 🎉 Success!

Your collaborative code editor is now live and FREE! Share the link on your CV and with potential employers.

**Pro Tips for CV:**
- Add screenshots of the app
- List the tech stack: React, Node.js, MongoDB, WebSocket, AI Integration
- Mention deployment skills: Vercel, Render, MongoDB Atlas
- Highlight real-time collaboration and AI features

