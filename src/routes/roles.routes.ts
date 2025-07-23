import express from 'express';
import { CheckPermission, ValidateResource } from '@/Middleware/index';
import { AddRolesSchema, AssignRoleSchema } from '@/Schema/index';
import { AddRoleHandler, AssignRoleHandler } from '@/PublicControllers/index';

const router = express.Router();

router.post(
  '/add-role',
  CheckPermission(['public']),
  ValidateResource(AddRolesSchema),
  AddRoleHandler
);

router.post(
  '/assign-role',
  CheckPermission(['public']),
  ValidateResource(AssignRoleSchema),
  AssignRoleHandler
);

export default router;
