const { Server } = require('socket.io');

let io;

function initSocketServer(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('joinRoom', (room) => {
      socket.join(room);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}

function getSocketServer() {
  if (!io) {
    throw new Error('Socket server is not initialized');
  }
  return io;
}

module.exports = {
  initSocketServer,
  getSocketServer,
};
