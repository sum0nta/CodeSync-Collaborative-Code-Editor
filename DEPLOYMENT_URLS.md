# 🔗 Deployment URLs & Configuration

Fill this out as you deploy to keep track of all your URLs and settings.

## 📝 Your Deployment Information

### Frontend (Vercel)
- **Deployment URL**: `https://_____________________.vercel.app`
- **Dashboard**: https://vercel.com/dashboard
- **Status**: [ ] Not deployed [ ] Deployed ✅

### Backend (Render)
- **Deployment URL**: `https://_____________________.onrender.com`
- **Health Check**: `https://_____________________.onrender.com/api/health`
- **Dashboard**: https://dashboard.render.com/
- **Status**: [ ] Not deployed [ ] Deployed ✅

### Database (MongoDB Atlas)
- **Cluster Name**: `_____________________`
- **Database Name**: `codesync`
- **Connection String**: `mongodb+srv://_____________________`
- **Dashboard**: https://cloud.mongodb.com/
- **Status**: [ ] Not deployed [ ] Deployed ✅

---

## 🔐 Environment Variables

### Backend (Render)
Copy these to Render's Environment section:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codesync?retryWrites=true&w=majority
JWT_SECRET=<generate-random-64-char-string>
FRONTEND_URL=https://your-app.vercel.app
GOOGLE_AI_API_KEY=<optional-google-ai-key>
```

### Frontend (Vercel)
Copy this to Vercel's Environment Variables:

```env
REACT_APP_BACKEND_URL=https://your-backend.onrender.com
```

---

## 🔑 Credentials to Save

### MongoDB Atlas
- **Username**: `_____________________`
- **Password**: `_____________________`
- **Cluster**: `_____________________`

### Google AI Studio (Optional)
- **API Key**: `AIza_____________________`
- **Get from**: https://aistudio.google.com/app/apikey

### JWT Secret
- **Secret**: `_____________________`
- **Generate at**: https://www.random.org/passwords/?num=1&len=64&format=plain

---

## 📊 Deployment Checklist

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] All local tests passed
- [ ] Environment variables prepared

### Database
- [ ] MongoDB Atlas account created
- [ ] M0 Free cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained

### Backend
- [ ] Render account created
- [ ] Web service created
- [ ] Root directory set to `backend`
- [ ] Environment variables added
- [ ] Service deployed successfully
- [ ] Health check endpoint working

### Frontend
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Root directory set to `frontend`
- [ ] Backend URL environment variable added
- [ ] Frontend deployed successfully
- [ ] App accessible in browser

### Integration
- [ ] FRONTEND_URL added to backend env vars
- [ ] Backend redeployed
- [ ] Login/Register working
- [ ] File creation working
- [ ] Real-time collaboration working
- [ ] AI assistant working (if configured)

---

## 🎯 For Your CV

Use this template for your CV/Portfolio:

```
CodeSync - Real-time Collaborative Code Editor
🔗 Live Demo: https://your-app.vercel.app
💻 GitHub: https://github.com/yourusername/CodeSync-Collaborative-Code-Editor
📚 Tech Stack: React • Node.js • MongoDB • Socket.IO • AI Integration

Key Features:
• Real-time collaborative editing with Monaco Editor
• WebSocket-based presence and synchronization
• Google Gemini AI integration for code assistance
• JWT authentication and user management
• File/folder management system

Deployment:
• Frontend: Vercel (React, Monaco Editor)
• Backend: Render.com (Node.js, Express, Socket.IO)
• Database: MongoDB Atlas (Cloud Database)
• CI/CD: Automated deployment from GitHub
```

---

## 📈 Monitoring & Maintenance

### Health Checks
- Backend Health: `https://your-backend.onrender.com/api/health`
- Should return: `{"status":"OK","timestamp":"...","uptime":...}`

### Keep Backend Awake (Optional)
Use UptimeRobot to prevent free tier sleep:
1. Sign up at https://uptimerobot.com/
2. Add monitor:
   - Type: HTTP(s)
   - URL: `https://your-backend.onrender.com/api/health`
   - Monitoring Interval: 5 minutes
3. This keeps your backend from sleeping!

### View Logs
- **Render Backend Logs**: Dashboard → Service → Logs
- **Vercel Frontend Logs**: Dashboard → Project → Deployments → View Logs
- **MongoDB Logs**: Atlas → Database → Monitoring

---

## 🐛 Quick Troubleshooting

| Problem | Check This | Solution |
|---------|------------|----------|
| Backend won't start | MongoDB connection | Verify MONGODB_URI is correct |
| Frontend shows errors | Backend URL | Check REACT_APP_BACKEND_URL |
| CORS errors | Frontend URL | Add FRONTEND_URL to backend env |
| 502/503 errors | Backend status | Wait 30-60s (free tier wake-up) |
| Can't login | Database connection | Check MongoDB Atlas is accessible |
| AI not working | Google AI key | Verify GOOGLE_AI_API_KEY is set |

---

## 📱 Share Your Project

### Social Media Posts
```
🚀 Just deployed my collaborative code editor!

Features:
✅ Real-time editing
✅ AI code assistance
✅ Multiple users
✅ Monaco Editor

Try it: https://your-app.vercel.app

Built with React, Node.js, MongoDB, Socket.IO
#webdev #coding #opensource
```

### LinkedIn Post
```
Excited to share my latest project: CodeSync - A real-time collaborative code editor!

🔧 Tech Stack:
• Frontend: React.js with Monaco Editor
• Backend: Node.js & Express.js
• Database: MongoDB Atlas
• Real-time: Socket.IO
• AI: Google Gemini API

🌟 Features:
• Real-time collaborative editing
• AI-powered code assistance
• Syntax highlighting & error detection
• File management system
• User authentication

🚀 Fully deployed on:
• Vercel (Frontend)
• Render (Backend)
• MongoDB Atlas (Database)

Try it live: https://your-app.vercel.app
Source code: https://github.com/yourusername/CodeSync

#webdevelopment #reactjs #nodejs #mongodb #ai
```

---

## 🔄 Update Deployment

### Update Backend
```bash
git add .
git commit -m "Update backend"
git push origin main
# Render auto-deploys from main branch
```

### Update Frontend
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys from main branch
```

### Update Environment Variables
- Backend: Render Dashboard → Service → Environment
- Frontend: Vercel Dashboard → Project → Settings → Environment Variables

---

## 💡 Upgrade Options (When Ready)

### Render (Backend)
- Starter: $7/month - No sleep, faster, custom domain
- Standard: $25/month - More resources

### Vercel (Frontend)
- Pro: $20/month - More bandwidth, analytics
- Enterprise: Custom pricing

### MongoDB Atlas
- M10: $0.08/hour (~$57/month) - Dedicated cluster
- M20: $0.20/hour (~$144/month) - More storage & RAM

---

**Last Updated**: ___________________
**Deployment Date**: ___________________

