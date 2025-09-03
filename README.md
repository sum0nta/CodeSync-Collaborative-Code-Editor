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
- Google AI Studio (Gemini 1.5 Pro) integration
- Code generation and analysis
- Intelligent error detection and fixing
- Code explanation and documentation
- Interactive chat interface

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
- **Real-time**: WebSocket
- **AI**: Google AI Studio (Gemini 1.5 Pro)
- **Authentication**: JWT
- **Deployment**: Render.com

## Quick Start

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

## License

MIT
