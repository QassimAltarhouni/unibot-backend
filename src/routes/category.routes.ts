import express from 'express';
import {
  AddCategoryHandler,
  EditCategoryHandler,
  GetCategoryByIdHandler,
  GetCategorysHandler,
  RemoveCategorysHandler,
} from '@/PublicControllers/index';
import { ValidateResource } from '@/Middleware/index';
import {
  AddCategorySchema,
  EditCategoryByIdSchema,
  GetCategoryByIdSchema,
} from '@/Schema/index';
import RemoveCategoryByIdSchema from '@/Schema/Category/RemoveCategoryByIdSchema';

const router = express.Router();

// Import the socket server instance (you'll need to export it from your main app)
let socketServer: any = null;

// Method to set socket server reference
export const setSocketServer = (server: any) => {
  socketServer = server;
};

// Middleware to refresh chatbot categories after category changes
const refreshChatbotCategories = (req: any, res: any, next: any) => {
  const originalSend = res.send;
  res.send = function (data: any) {
    // Call original send
    originalSend.call(this, data);

    // Refresh chatbot categories if the operation was successful
    if (socketServer && res.statusCode === 200) {
      setTimeout(() => {
        socketServer.broadcastCategoryUpdate();
      }, 1000); // Small delay to ensure DB is updated
    }
  };
  next();
};

router.get('/get-Categories', GetCategorysHandler);

router.get(
  '/get-Category-by-id/:id',
  ValidateResource(GetCategoryByIdSchema),
  GetCategoryByIdHandler
);

router.put(
  '/edit-Category-by-id/:id',
  ValidateResource(EditCategoryByIdSchema),
  refreshChatbotCategories,
  EditCategoryHandler
);

router.delete(
  '/delete-Category-by-id/:id',
  ValidateResource(RemoveCategoryByIdSchema),
  refreshChatbotCategories,
  RemoveCategorysHandler
);

router.post(
  '/add-Category',
  ValidateResource(AddCategorySchema),
  refreshChatbotCategories,
  AddCategoryHandler
);

export default router;
