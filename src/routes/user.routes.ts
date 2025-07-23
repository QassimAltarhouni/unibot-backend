import express from 'express';
import { CheckPermission, ValidateResource } from '@/Middleware/index';
import {
  CreateUserSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyUserSchema,
} from '@/Schema/index';
import {
  CreateUserHandler,
  ForgotPasswordHandler,
  GetCurrentUserHandler,
  ResetPasswordHandler,
  VerifyUserHandler,
} from '@/PublicControllers/index';

const router = express.Router();

router.post(
  '/create',
  CheckPermission(['public']),
  ValidateResource(CreateUserSchema),
  CreateUserHandler
);

router.get(
  '/verify/:id/:verificationCode',
  CheckPermission(['public']),
  ValidateResource(VerifyUserSchema),
  VerifyUserHandler
);

router.post(
  '/forgotpassword',
  ValidateResource(ForgotPasswordSchema),
  ForgotPasswordHandler
);

router.post(
  '/resetpassword/:id/:passwordResetCode',
  ValidateResource(ResetPasswordSchema),
  ResetPasswordHandler
);

router.get('/me', CheckPermission(['read']), GetCurrentUserHandler);

export default router;
