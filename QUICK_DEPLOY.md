# ⚡ Quick Deploy Checklist

Deploy CodeSync in 15 minutes! Follow this checklist:

## ☑️ Pre-Deployment Checklist

- [ ] GitHub repository is ready
- [ ] Code is committed and pushed to main branch
- [ ] You have a Gmail account (for MongoDB Atlas)

---

## 🚀 3-Step Deployment

### Step 1️⃣: Database (5 min)
1. **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas/register
   - Sign up with Google
   - Create FREE M0 Cluster
   - Add Database User (save username & password!)
   - Network Access → Allow 0.0.0.0/0
   - Get connection string → Replace `<password>` with your password
   - Add `/codesync` before the `?` in the connection string

**Connection String Format:**
```
mongodb+srv://username:YOUR_PASSWORD@cluster.xxxxx.mongodb.net/codesync?retryWrites=true&w=majority
```

✅ **Test**: Save this connection string - you'll need it!

---

### Step 2️⃣: Backend (5 min)
1. **Render.com**: https://render.com/
   - Sign up with GitHub
   - New → Web Service
   - Connect your repo
   - **Settings**:
     - Name: `codesync-backend`
     - Root Directory: `backend`
     - Environment: `Node`
     - Build: `npm install`
     - Start: `npm start`
     - Plan: **Free**
   
2. **Environment Variables** (click "Environment"):
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<generate-random-64-char-string>
   FRONTEND_URL=<leave-empty-for-now>
   GOOGLE_AI_API_KEY=<optional-get-from-google-ai-studio>
   ```

3. Click **Create Web Service**

✅ **Test**: Visit `https://your-backend.onrender.com/api/health`
   - Should see: `{"status":"OK",...}`
   - **Save your backend URL!**

---

### Step 3️⃣: Frontend (5 min)
1. **Vercel**: https://vercel.com/signup
   - Sign up with GitHub
   - New Project → Import your repo
   - **Settings**:
     - Framework: Create React App
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `build`
   
2. **Environment Variables**:
   ```
   REACT_APP_BACKEND_URL=https://your-backend.onrender.com
   ```
   *(Use the backend URL from Step 2)*

3. Click **Deploy**

✅ **Test**: Visit your Vercel URL
   - Should see the login/register page

---

## 🔄 Final Step: Connect Frontend & Backend

1. **Go back to Render** → Your backend service
2. **Add Environment Variable**:
   - Key: `FRONTEND_URL`
   - Value: Your Vercel URL (e.g., `https://your-app.vercel.app`)
3. Click **Save** (Render will auto-redeploy)

---

## 🎉 You're Live!

**Your URLs:**
- 🌐 **App**: `https://your-app.vercel.app`
- 🔧 **API**: `https://your-backend.onrender.com`

### Test Your Deployment
1. Open your app URL
2. Register a new account
3. Create a file and test editing
4. Try the AI assistant (if you added Google AI key)

---

## 📝 Add to Your CV

```
CodeSync - Collaborative Code Editor
Live Demo: https://your-app.vercel.app
GitHub: https://github.com/yourusername/CodeSync-Collaborative-Code-Editor

A real-time collaborative code editor with AI assistance built with:
• React, Monaco Editor, Node.js, Express, MongoDB
• WebSocket for real-time collaboration
• Google Gemini AI integration
• Deployed on Vercel (Frontend) & Render (Backend)
```

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check MongoDB connection string & env vars |
| Frontend shows errors | Verify `REACT_APP_BACKEND_URL` is correct |
| Can't login/register | Check browser console, verify backend is running |
| 502/503 errors | Backend is sleeping (free tier), wait 30-60 sec |
| CORS errors | Add frontend URL to `FRONTEND_URL` env var on Render |

---

## 💡 Optional but Recommended: Get Google AI Key (2 min)

**Why you should do this:**
- ✅ Enables AI code assistant features
- ✅ **Completely FREE** (1,500 requests/day)
- ✅ No credit card required
- ✅ Makes your project more impressive

**Quick Setup:**
1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)
5. Add to Render env vars: `GOOGLE_AI_API_KEY=your-key`

**Note about Ollama:**
- ❌ Ollama **CANNOT** run on Render's free tier (needs 4-8GB RAM)
- ✅ Google Gemini is the perfect free alternative
- ✅ Already integrated in your codebase!

See [FREE_AI_ALTERNATIVES.md](./FREE_AI_ALTERNATIVES.md) for more options.

---

## ⚠️ Important Notes

**Free Tier Limits:**
- **Render**: App sleeps after 15 min inactivity (first load takes 30-60s)
- **Vercel**: 100GB bandwidth/month
- **MongoDB**: 512MB storage

**To Keep Backend Awake:**
Use [UptimeRobot](https://uptimerobot.com/) to ping `/api/health` every 5 min

---

## 🆘 Still Having Issues?

See the detailed guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

Or check:
1. Render logs: Dashboard → Service → Logs
2. Browser console: F12 → Console tab
3. MongoDB connection: Atlas → Database → Collections

