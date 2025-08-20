const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { connectToDatabase } = require('./database');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const messageRoutes = require('./routes/messageRoutes');
const syntaxRoutes = require('./routes/syntaxRoutes');
const presenceRoutes = require('./routes/presenceRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
connectToDatabase().catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', fileRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/syntax', syntaxRoutes);
app.use('/api', presenceRoutes);

// Create HTTP server and initialize Socket.IO for real-time collaboration
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Expose io instance to routes/controllers via app
app.set('io', io);

// Socket.IO events for collaborative file editing
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room for a specific file to receive updates
  socket.on('join_file', ({ fileId, userId }) => {
    if (!fileId) return;
    const room = `file:${fileId}`;
    socket.join(room);
    socket.to(room).emit('user_joined_file', { fileId, userId, socketId: socket.id });
    console.log(`User ${userId} joined file room: ${room}`);
  });

  // Leave the file room explicitly
  socket.on('leave_file', ({ fileId, userId }) => {
    if (!fileId) return;
    const room = `file:${fileId}`;
    socket.leave(room);
    socket.to(room).emit('user_left_file', { fileId, userId, socketId: socket.id });
    console.log(`User ${userId} left file room: ${room}`);
  });

  // Broadcast content changes to other collaborators in the same file
  socket.on('content_change', ({ fileId, content, version, userId }) => {
    if (!fileId) return;
    const room = `file:${fileId}`;
    socket.to(room).emit('content_change', { fileId, content, version, userId, fromSocketId: socket.id });
    console.log(`Content change broadcasted for file: ${fileId}`);
  });

  // Clean up on disconnect
  socket.on('disconnecting', () => {
    // Inform other members of rooms this socket was part of
    const rooms = Array.from(socket.rooms || []);
    rooms.forEach((room) => {
      if (room.startsWith('file:')) {
        socket.to(room).emit('collaborator_disconnected', { room, socketId: socket.id });
      }
    });
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));