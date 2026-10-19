import express from 'express';
import type { ErrorRequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { DeserializeUser } from '@/Middleware/index';
import { AppError, Logger, CustomErrorHandler } from '@/Utils/index';
import router from './routes';
import { swaggerSpec } from '../swagger';
import categoryRoutes from './routes/category.routes';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  CustomErrorHandler(err, res, req, next);
};

/**
 * Builds the Express application (middleware, routes, error handling)
 * without connecting to the database or opening a port, so it can be
 * reused by the server entry point and by HTTP tests.
 */
export const createApp = () => {
  const app = express();

  /** Log the request */
  app.use((req, res, next) => {
    Logger.info(
      `Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on('finish', () => {
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

  return app;
};

export default createApp;
