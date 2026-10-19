import { createServer } from 'http';
import { Logger, ConnectToDb } from '@/Utils/index';
import { createApp } from './app';
import { SocketServer } from './socketServer';
import { setSocketServer } from './routes/category.routes';

/** Only Start Server if Mongoose Connects */
const StartServer = () => {
  const app = createApp();
  const server = createServer(app);

  // Register Socket.io
  const socketServer = new SocketServer(server);

  // Set socket server reference for category routes
  setSocketServer(socketServer);

  // Start server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    Logger.info(`Server is running on port ${PORT}`);
    Logger.info(`WebSocket server ready for chatbot connections`);
    Logger.info(`ChatBot configured with dynamic category integration`);
  });
};

/** Connect Database */
ConnectToDb()
  .then(() => {
    Logger.info('Connected to MongoDB');
    StartServer();
  })
  .catch(error => {
    Logger.error('Error connecting to MongoDB ');
    Logger.error(error);
  });
