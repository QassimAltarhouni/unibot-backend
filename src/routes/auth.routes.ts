import express from 'express';
const router = express.Router();
import { CheckPermission, ValidateResource } from '@/Middleware/index';
import { CreateSessionSchema } from '@/Schema/index';
import {
  CheckAccessToken,
  CreateSessionHandler,
  RefreshAccessTokenHandler,
} from '@/PublicControllers/index';

router.post(
  '/login',
  CheckPermission(['public']),
  ValidateResource(CreateSessionSchema),
  CreateSessionHandler
);

router.post('/refresh', CheckPermission(['public']), RefreshAccessTokenHandler);

router.post('/checkAccessToken', CheckPermission(['public']), CheckAccessToken);

export default router;
