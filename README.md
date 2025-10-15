# CodeSync - Collaborative Code Editor

A real-time collaborative code editor with built-in AI assistance and code execution capabilities.

## Features

### Core Features ✅
- Real-time collaborative editing with VS Code-like interface
- File and folder management system
- User authentication and profile management
- WebSocket-based messaging
- Multiple theme support
- Syntax highlighting and error detection

### AI Assistant ✅
- **Production**: Google AI Studio (Gemini) - FREE API, no hosting needed!
- **Local Dev**: Ollama support (optional)
- Code generation and analysis
- Intelligent error detection and fixing
- Code explanation and documentation
- Interactive chat interface

**Note:** Ollama cannot run on free cloud hosting (needs 4-8GB RAM). Use Google Gemini API instead (FREE, already integrated). See [AI_SETUP_GUIDE.md](./AI_SETUP_GUIDE.md).

### Code Management ✅
- Monaco Editor integration
- Syntax highlighting with error detection
- Multiple language support
- Code execution capabilities
- Real-time collaboration

## Tech Stack

- **Frontend**: React.js, Monaco Editor
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time**: WebSocket (Socket.IO)
- **AI**: Google AI Studio (Gemini 1.5 Pro)
- **Authentication**: JWT
- **Deployment**: Vercel (Frontend) + Render.com (Backend) + MongoDB Atlas (Database)

## 🚀 Quick Deploy (FREE!)

Deploy your own instance in 15 minutes:

1. **Quick Start**: Follow [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Simple 3-step guide
2. **Detailed Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Comprehensive instructions
3. **Checklist**: Print [deploy-checklist.txt](./deploy-checklist.txt) - Step-by-step checklist

**Free Hosting Stack:**
- Frontend: Vercel (free tier)
- Backend: Render.com (free tier)
- Database: MongoDB Atlas (free tier)

---

## 💻 Local Development

1. Clone and install:
   ```bash
   git clone https://github.com/sum0nta/CodeSync-Collaborative-Code-Editor.git
   cd CodeSync-Collaborative-Code-Editor
   
   # Install dependencies
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Set up environment variables:

   Backend (.env):
   ```
   PORT=5001
   MONGODB_URI=mongodb+srv://[your-mongodb-uri]
   JWT_SECRET=[your-jwt-secret]
   GOOGLE_AI_API_KEY=[your-google-ai-api-key]
   ```

   Frontend (.env):
   ```
   REACT_APP_BACKEND_URL=http://localhost:5001
   REACT_APP_WS_URL=ws://localhost:5001
   ```

3. Start development servers:
   ```bash
   # Backend
   cd backend
   npm start

   # Frontend (new terminal)
   cd frontend
   npm start
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## Features in Detail

### Real-time Collaboration
- Multiple users can edit the same file simultaneously
- Cursor tracking and user presence
- Real-time updates using WebSocket

### File Management
- Create, edit, and delete files and folders
- File tree navigation
- File sharing between users

### Code Execution
- Support for multiple programming languages
- Real-time compilation and execution
- Output and error display

### AI Assistant
- Code generation from natural language descriptions
- Code analysis and error detection
- Automatic code fixing and optimization
- Test generation
- Code documentation

### User Management
- JWT-based authentication
- User profiles
- Password reset functionality
- Session management

### Editor Features
- Syntax highlighting
- Error detection
- Multiple themes
- Code formatting
- Auto-completion

## 🏗️ Architecture

See [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md) for detailed system architecture and data flow.

---

## 📚 Documentation

- **[START_HERE.md](./START_HERE.md)** - New to the project? Start here!
- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - 15-minute deployment guide
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Comprehensive deployment instructions
- **[deploy-checklist.txt](./deploy-checklist.txt)** - Printable deployment checklist
- **[DEPLOYMENT_URLS.md](./DEPLOYMENT_URLS.md)** - Track your deployment URLs
- **[DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)** - System architecture details
- **[AI_SETUP_GUIDE.md](./AI_SETUP_GUIDE.md)** - Setup AI features (Gemini vs Ollama)
- **[FREE_AI_ALTERNATIVES.md](./FREE_AI_ALTERNATIVES.md)** - Free AI API options

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT
