import config from 'config';
import express from 'express';
import { DeserializeUser } from '@/Middleware/index';
import {
  AppError,
  Logger,
  ConnectToDb,
  CustomErrorHandler,
} from '@/Utils/index';
import router from './routes';
import { createServer } from 'http';
import type { ErrorRequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import cors from 'cors';
import { SocketServer } from './socketServer';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../swagger';
import categoryRoutes, { setSocketServer } from './routes/category.routes';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  CustomErrorHandler(err, res, req, next);
};

const app = express();
const server = createServer(app);

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

/** Only Start Server if Mongoose Connects */
const StartServer = () => {
  /** Log the request */
  app.use((req, res, next) => {
    /** Log the req */
    Logger.info(
      `Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on('finish', () => {
      /** Log the res */
      Logger.info(
        `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
      );
    });

    next();
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // CORS configuration
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use(
    '/api-docs',
    swaggerUi.serve as any,
    swaggerUi.setup(swaggerSpec) as any
  );

  // wrap is for async error handling
  app.use(DeserializeUser);

  app.use('/api/v1', asyncHandler(router));
  app.use('/api/v1/category', categoryRoutes);

  /** Error handling */
  app.use((req, res, next) => {
    next(new AppError(404, 'not_found'));
  });

  app.use(errorHandler);

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

export default app;
