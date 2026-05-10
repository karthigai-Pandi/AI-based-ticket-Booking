require('dotenv').config();
const http = require('http');
const app = require('./app');
const db = require('./utils/db');
const { initSocketServer } = require('./utils/socketServer');

const PORT = process.env.PORT || 5000;

(async function init() {
  try {
    await db.initialize();
    const server = http.createServer(app);
    initSocketServer(server);
    server.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
})();
