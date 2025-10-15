# 🏗️ CodeSync - Deployment Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         USER'S BROWSER                          │
│                  (Chrome, Firefox, Safari, etc.)                │
│                                                                 │
└────────────────┬────────────────────────────────┬───────────────┘
                 │                                │
                 │ HTTPS                          │ WebSocket
                 │                                │
         ┌───────▼────────┐              ┌────────▼───────┐
         │                │              │                │
         │   FRONTEND     │◄─────────────┤    BACKEND     │
         │   (Vercel)     │    REST API  │   (Render)     │
         │                │              │                │
         │  React App     │              │  Node.js API   │
         │  Monaco Editor │              │  Express.js    │
         │  Socket.IO     │              │  Socket.IO     │
         │                │              │                │
         └────────────────┘              └────────┬───────┘
                                                  │
                                                  │ MongoDB
                                                  │ Driver
                                         ┌────────▼────────┐
                                         │                 │
                                         │    DATABASE     │
                                         │ (MongoDB Atlas) │
                                         │                 │
                                         │  User Data      │
                                         │  Files          │
                                         │  Messages       │
                                         │                 │
                                         └─────────────────┘
```

## 🔄 Data Flow

### 1. User Registration/Login
```
Browser → Frontend (Vercel) → Backend (Render) → MongoDB Atlas
                                     ↓
                                 JWT Token
                                     ↓
Browser ← Frontend (Vercel) ← Backend (Render)
```

### 2. Real-time Collaboration
```
User A's Browser                      User B's Browser
      ↓                                     ↑
   WebSocket                             WebSocket
      ↓                                     ↑
      └─────→ Backend (Socket.IO) ─────────┘
                      ↓
              MongoDB Atlas
              (Store changes)
```

### 3. AI Code Assistance
```
Browser → Frontend → Backend → Google AI Studio (Gemini)
                       ↓               ↓
                MongoDB Atlas    AI Response
                       ↓               ↓
Browser ← Frontend ← Backend ←────────┘
```

## 🌍 Deployment Platforms

### Frontend: Vercel
```
┌──────────────────────────────────────┐
│           VERCEL CDN                 │
├──────────────────────────────────────┤
│                                      │
│  • Global Edge Network               │
│  • Automatic HTTPS                   │
│  • Instant deployments               │
│  • Serverless Functions              │
│  • 100GB bandwidth/month (free)      │
│                                      │
│  Serves:                             │
│  - React application                 │
│  - Static assets                     │
│  - Monaco Editor files               │
│                                      │
└──────────────────────────────────────┘
```

**Why Vercel?**
- ✅ Optimized for React apps
- ✅ Global CDN (fast worldwide)
- ✅ Free SSL certificates
- ✅ Auto-deployment from GitHub
- ✅ No sleep/downtime

### Backend: Render
```
┌──────────────────────────────────────┐
│         RENDER.COM SERVER            │
├──────────────────────────────────────┤
│                                      │
│  • Managed Node.js hosting           │
│  • Automatic HTTPS                   │
│  • Health checks                     │
│  • Auto-restart on failure           │
│  • 750 hours/month (free)            │
│                                      │
│  Runs:                               │
│  - Express.js API                    │
│  - Socket.IO server                  │
│  - Authentication logic              │
│  - AI integration                    │
│                                      │
│  ⚠️ Sleeps after 15 min inactivity   │
│                                      │
└──────────────────────────────────────┘
```

**Why Render?**
- ✅ Simple Node.js deployment
- ✅ WebSocket support (Socket.IO)
- ✅ Free tier with auto-sleep
- ✅ Auto-deployment from GitHub
- ✅ Built-in health checks

### Database: MongoDB Atlas
```
┌──────────────────────────────────────┐
│       MONGODB ATLAS CLUSTER          │
├──────────────────────────────────────┤
│                                      │
│  • Managed MongoDB cloud service     │
│  • Automatic backups                 │
│  • Built-in security                 │
│  • 512MB storage (free)              │
│  • Shared M0 cluster                 │
│                                      │
│  Collections:                        │
│  - users                             │
│  - files                             │
│  - folders                           │
│  - messages                          │
│  - userfiles                         │
│                                      │
└──────────────────────────────────────┘
```

**Why MongoDB Atlas?**
- ✅ Generous free tier (512MB)
- ✅ No sleep/downtime
- ✅ Automatic scaling
- ✅ Built-in security
- ✅ Global distribution

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. TRANSPORT SECURITY                                       │
│     • HTTPS everywhere (TLS 1.3)                             │
│     • Secure WebSocket (WSS)                                 │
│     • Automatic SSL certificates                             │
│                                                              │
│  2. AUTHENTICATION                                           │
│     • JWT tokens                                             │
│     • Bcrypt password hashing                                │
│     • Secure session management                              │
│                                                              │
│  3. AUTHORIZATION                                            │
│     • Route protection middleware                            │
│     • File ownership verification                            │
│     • User permission checks                                 │
│                                                              │
│  4. DATABASE SECURITY                                        │
│     • MongoDB Atlas encryption at rest                       │
│     • Network IP whitelisting                                │
│     • Database user authentication                           │
│                                                              │
│  5. CORS PROTECTION                                          │
│     • Whitelist frontend origin                              │
│     • Credential validation                                  │
│     • Request method restrictions                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Request Flow Examples

### Example 1: User Creates a File
```
1. User clicks "New File" in browser
   ↓
2. Frontend sends POST /api/files
   Headers: { Authorization: "Bearer <JWT>" }
   Body: { name: "app.js", content: "console.log('hello')" }
   ↓
3. Backend validates JWT token
   ↓
4. Backend creates file in MongoDB
   ↓
5. Backend returns file data
   ↓
6. Frontend updates UI
   ↓
7. Frontend emits Socket.IO event 'file_created'
   ↓
8. Backend broadcasts to all connected users
   ↓
9. Other users see new file in real-time
```

### Example 2: Real-time Code Editing
```
1. User types in Monaco Editor
   ↓
2. Frontend debounces input (300ms)
   ↓
3. Frontend emits Socket.IO 'content_change'
   Data: { fileId, content, version, userId }
   ↓
4. Backend receives event
   ↓
5. Backend broadcasts to file room (other collaborators)
   ↓
6. Other users receive update via Socket.IO
   ↓
7. Their editors update in real-time
   ↓
8. Backend saves to MongoDB (async)
```

### Example 3: AI Code Assistance
```
1. User types AI prompt: "Create a React component"
   ↓
2. Frontend sends POST /api/ai/generate
   Headers: { Authorization: "Bearer <JWT>" }
   Body: { prompt: "Create a React component" }
   ↓
3. Backend validates JWT
   ↓
4. Backend forwards to Google AI Studio
   ↓
5. Google Gemini generates code
   ↓
6. Backend receives AI response
   ↓
7. Backend returns to frontend
   ↓
8. Frontend inserts code into editor
```

## 🌐 Environment Configuration

### Frontend Environment Variables
```javascript
// Vercel Environment Variables
REACT_APP_BACKEND_URL=https://your-backend.onrender.com

// Used in: frontend/src/utils/config.js
export const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
```

### Backend Environment Variables
```javascript
// Render Environment Variables
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/codesync
JWT_SECRET=random-64-char-string
FRONTEND_URL=https://your-app.vercel.app
GOOGLE_AI_API_KEY=AIza...

// Used throughout backend for:
// - Database connection
// - JWT signing/verification
// - CORS configuration
// - AI API calls
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Password reset

### Files
- `GET /api/files` - Get all user files
- `POST /api/files` - Create new file
- `GET /api/files/:id` - Get specific file
- `PUT /api/files/:id` - Update file
- `DELETE /api/files/:id` - Delete file

### Collaboration
- `GET /api/presence` - Get active users
- Socket.IO events:
  - `join_file` - Join file editing session
  - `content_change` - Broadcast code changes
  - `leave_file` - Leave file session

### AI Assistant
- `POST /api/ai/generate` - Generate code
- `POST /api/ai/explain` - Explain code
- `POST /api/ai/fix` - Fix code errors

### Code Execution
- `POST /api/execution/run` - Execute code

## 💾 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  avatar: String
}
```

### Files Collection
```javascript
{
  _id: ObjectId,
  name: String,
  content: String,
  language: String,
  owner: ObjectId (ref: User),
  sharedWith: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Messages Collection
```javascript
{
  _id: ObjectId,
  fileId: ObjectId,
  userId: ObjectId,
  content: String,
  timestamp: Date
}
```

## 🔄 Deployment Workflow

### Continuous Deployment
```
Developer                  GitHub              Vercel/Render
    │                         │                      │
    │ 1. Code changes         │                      │
    │────────────────────────>│                      │
    │                         │                      │
    │ 2. git push            │                      │
    │────────────────────────>│                      │
    │                         │                      │
    │                         │ 3. Webhook trigger   │
    │                         │─────────────────────>│
    │                         │                      │
    │                         │ 4. Build & deploy    │
    │                         │                      │
    │                         │ 5. Deployment done   │
    │ 6. Notification        │<─────────────────────│
    │<────────────────────────│                      │
```

### Build Process

**Frontend (Vercel)**
```bash
1. npm install          # Install dependencies
2. npm run build        # Create production build
3. Upload to CDN        # Deploy to edge network
4. Generate preview URL # Create deployment URL
5. Update production    # Switch to new version
```

**Backend (Render)**
```bash
1. npm install          # Install dependencies
2. npm start           # Start Node.js server
3. Health check        # Verify /api/health
4. Route traffic       # Switch to new instance
5. Monitor logs        # Check for errors
```

## 📈 Scalability Considerations

### Current Architecture (Free Tier)
- **Users**: Up to ~100 concurrent users
- **Storage**: 512MB database (thousands of files)
- **Bandwidth**: 100GB/month frontend
- **Backend**: Single instance (sleeps when idle)

### When to Upgrade

**Signs you need to upgrade**:
1. Backend sleeping affects UX (upgrade Render)
2. Database storage > 400MB (upgrade MongoDB)
3. Bandwidth > 80GB/month (upgrade Vercel)
4. Response time > 2 seconds (add caching)

**Upgrade Path**:
1. **Render Starter** ($7/month) - No sleep, faster
2. **MongoDB M10** (~$57/month) - Dedicated cluster
3. **Vercel Pro** ($20/month) - More bandwidth
4. **Add Redis** - Caching layer
5. **Add CDN** - Static asset delivery

## 🎯 Performance Optimization

### Frontend
- ✅ Code splitting (React.lazy)
- ✅ Monaco Editor lazy loading
- ✅ Asset optimization
- ✅ Gzip compression
- ✅ Browser caching

### Backend
- ✅ Database indexing
- ✅ Request rate limiting
- ✅ Gzip compression
- ✅ Keep-alive connections
- 💡 Add Redis caching (future)

### Database
- ✅ Indexed queries
- ✅ Connection pooling
- ✅ Lean queries
- 💡 Add read replicas (when scaling)

## 🔍 Monitoring & Debugging

### Logs
- **Frontend**: Browser Dev Tools (F12 → Console)
- **Backend**: Render Dashboard → Logs
- **Database**: MongoDB Atlas → Monitoring

### Metrics to Watch
- Response time (< 500ms ideal)
- Error rate (< 1% ideal)
- Database connections (< 100)
- Memory usage (< 512MB backend)
- Bandwidth usage (< 100GB/month)

---

## 📚 Further Reading

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [React Best Practices](https://react.dev/)

---

**Need help?** See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for deployment instructions.

