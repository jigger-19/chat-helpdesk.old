// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }  // Hiermee staat alle origins toe; pas dit later aan voor veiligheid.
});

// Middleware voor JSON-verwerking
app.use(express.json());

// Basisroute voor testen
app.get('/', (req, res) => {
  res.send('Chat Server is running');
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('Nieuwe client verbonden:', socket.id);

  // Luister naar een event om een specifieke kamer te joinen
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Luister naar chatberichten
  socket.on('chat message', ({ roomId, senderId, message }) => {
    console.log(`Bericht ontvangen van ${senderId} in room ${roomId}: ${message}`);
    
    // Verstuur het bericht naar alle clients in de kamer
    io.to(roomId).emit('chat message', { senderId, message, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start de server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
