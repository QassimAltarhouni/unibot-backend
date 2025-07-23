import { NextFunction, Request, Response } from 'express';
import { GetTodoListByIdService } from '@/Service/index';
import { DataWrapper } from '@/Utils/index';
import { GetTodoListByIdInput } from '@/Schema/index';

const GetTodoListById = async (
  req: Request<{}, {}, {}, GetTodoListByIdInput>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.query;
  const todoList = await GetTodoListByIdService(id);

  return res.send(DataWrapper(todoList));
};

export default GetTodoListById;
