import express from 'express';
const router = express.Router();
import { CheckPermission, ValidateResource } from '@/Middleware/index';
import { AddTodoListSchema, GetTodoListByIdSchema } from '@/Schema/index';
import {
  AddTodoList,
  GetTodolists,
  GetTodoListById,
} from '@/PublicControllers/index';

router.get(
  '/alltodolist',
  CheckPermission(['read', 'firstPage']),
  GetTodolists
);

router.get(
  '/get-todolist-by-id',
  CheckPermission(['read', 'secondPage']),
  ValidateResource(GetTodoListByIdSchema),
  GetTodoListById
);

router.post(
  '/addtodolist',
  CheckPermission(['write']),
  ValidateResource(AddTodoListSchema),
  AddTodoList
);

export default router;
