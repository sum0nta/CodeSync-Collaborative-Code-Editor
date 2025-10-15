# 🚀 CodeSync - Quick Reference Card

## One-Page Deployment Reference

### 📋 Required Accounts
| Service | URL | Purpose | Cost |
|---------|-----|---------|------|
| MongoDB Atlas | mongodb.com/cloud/atlas | Database | FREE |
| Render.com | render.com | Backend API | FREE |
| Vercel | vercel.com | Frontend | FREE |
| Google AI (optional) | aistudio.google.com | AI Features | FREE |

---

## 🔗 Important URLs

### After Deployment - Fill These In:
```
Frontend URL: https://_________________.vercel.app
Backend URL:  https://_________________.onrender.com
Health Check: https://_________________.onrender.com/api/health
MongoDB URL:  mongodb+srv://_________________.mongodb.net/codesync
```

---

## ⚙️ Environment Variables

### Backend (Render.com)
```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codesync?retryWrites=true&w=majority
JWT_SECRET=<64-char-random-string>
FRONTEND_URL=https://your-app.vercel.app
GOOGLE_AI_API_KEY=<optional>
```

### Frontend (Vercel)
```bash
REACT_APP_BACKEND_URL=https://your-backend.onrender.com
```

---

## 📝 Deployment Sequence

```
1. MongoDB Atlas (5 min)
   ├── Create account
   ├── Create M0 cluster
   ├── Add database user
   ├── Allow IP: 0.0.0.0/0
   └── Copy connection string
        ↓
2. Render Backend (5 min)
   ├── Connect GitHub repo
   ├── Root dir: backend
   ├── Add env variables
   └── Deploy
        ↓
3. Vercel Frontend (5 min)
   ├── Import GitHub repo
   ├── Root dir: frontend
   ├── Add backend URL
   └── Deploy
        ↓
4. Connect (2 min)
   ├── Add FRONTEND_URL to Render
   └── Backend auto-redeploys
        ↓
    ✅ DONE!
```

---

## 🔧 Backend Configuration (Render)

```yaml
Name: codesync-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
Environment: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

---

## 🎨 Frontend Configuration (Vercel)

```yaml
Framework: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
```

---

## 🧪 Testing Checklist

```
After deployment, test:
☐ Visit frontend URL → See login page
☐ Visit backend/api/health → See {"status":"OK"}
☐ Register new account → Success
☐ Login → Success
☐ Create file → Success
☐ Edit code → Syntax highlighting works
☐ Open 2 tabs → Real-time sync works
☐ AI assistant → Works (if configured)
```

---

## 🚨 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Backend 502/503 | Wait 60s (free tier wake-up) |
| Can't login | Check MongoDB URI is correct |
| CORS error | Add FRONTEND_URL to backend env |
| AI not working | Add GOOGLE_AI_API_KEY |
| Frontend blank | Check browser console (F12) |

---

## 📊 Free Tier Limits

| Service | Limit | Notes |
|---------|-------|-------|
| Vercel | 100GB/month | No sleep |
| Render | 750hrs/month | Sleeps after 15min |
| MongoDB | 512MB storage | No sleep |

---

## 🔄 Update Deployment

```bash
# Make changes locally
git add .
git commit -m "Update message"
git push origin main

# Both Vercel and Render auto-deploy from main branch!
```

---

## 🔐 Security Checklist

```
☐ Use strong MongoDB password
☐ Generate random JWT_SECRET (64+ chars)
☐ Keep API keys secret
☐ Use HTTPS (automatic on Vercel/Render)
☐ Enable MongoDB IP whitelist
☐ Don't commit .env files
```

---

## 📈 Monitoring

### Health Check
```bash
curl https://your-backend.onrender.com/api/health
# Should return: {"status":"OK","timestamp":"...","uptime":123}
```

### View Logs
- Backend: Render Dashboard → Service → Logs
- Frontend: Vercel Dashboard → Project → Logs
- Database: MongoDB Atlas → Monitoring

---

## 💡 Keep Backend Awake

**UptimeRobot Setup:**
1. Go to uptimerobot.com
2. Add new monitor:
   - Type: HTTP(s)
   - URL: `https://your-backend.onrender.com/api/health`
   - Interval: 5 minutes
3. Backend stays awake 24/7!

---

## 🎯 For Your CV

```
CodeSync - Real-time Collaborative Code Editor
Live: https://your-app.vercel.app
GitHub: github.com/yourusername/CodeSync

Tech Stack:
• Frontend: React, Monaco Editor, Socket.IO
• Backend: Node.js, Express, Socket.IO
• Database: MongoDB Atlas
• AI: Google Gemini API
• Deployment: Vercel + Render + MongoDB Atlas

Features:
• Real-time multi-user collaboration
• AI-powered code assistance
• Syntax highlighting & error detection
• File/folder management
• JWT authentication
```

---

## 🆘 Need Help?

**Documentation:**
- Quick guide: `QUICK_DEPLOY.md`
- Detailed guide: `DEPLOYMENT_GUIDE.md`
- Checklist: `deploy-checklist.txt`
- Architecture: `DEPLOYMENT_ARCHITECTURE.md`

**Troubleshooting:**
1. Check service status:
   - Vercel: status.vercel.com
   - Render: status.render.com
   - MongoDB: status.cloud.mongodb.com
2. View logs in respective dashboards
3. Check browser console (F12)
4. Verify environment variables

---

## 🎓 Tech Stack at a Glance

```
┌─────────────┐
│   Browser   │ ← User Interface
└──────┬──────┘
       │
┌──────▼──────┐
│   Vercel    │ ← React Frontend
│  (Frontend) │    Monaco Editor
└──────┬──────┘    Socket.IO Client
       │
┌──────▼──────┐
│   Render    │ ← Node.js Backend
│  (Backend)  │    Express API
└──────┬──────┘    Socket.IO Server
       │
┌──────▼──────┐
│  MongoDB    │ ← Database
│   Atlas     │    User Data, Files
└─────────────┘
```

---

## 🌟 Next Steps After Deployment

1. **Add to Portfolio**
   - Update CV/Resume
   - Add to LinkedIn
   - Share on Twitter/X
   - Add to GitHub profile

2. **Customize**
   - Change branding/colors
   - Add more themes
   - Add more AI features
   - Optimize performance

3. **Learn More**
   - Explore the codebase
   - Add new features
   - Fix bugs
   - Contribute improvements

---

## 📞 Support Resources

- **Vercel Docs**: vercel.com/docs
- **Render Docs**: render.com/docs
- **MongoDB Docs**: docs.atlas.mongodb.com
- **React Docs**: react.dev
- **Socket.IO Docs**: socket.io/docs

---

**🎉 Happy Deploying!**

Print this card and keep it handy during deployment.

