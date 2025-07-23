import { NextFunction, Request, Response } from 'express';
import { DataWrapper } from '@/Utils/index';
import { DeleteTodoListByIdInput } from '@/Schema/index';
import { DeleteTodoListByIdService } from '@/Service/index';

const DeleteTodoListById = async (
  req: Request<{}, {}, {}, DeleteTodoListByIdInput>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.query;
  const todoList = await DeleteTodoListByIdService(id);

  return res.send(DataWrapper(todoList));
};

export default DeleteTodoListById;
