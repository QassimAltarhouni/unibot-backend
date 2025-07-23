import { NextFunction, Request, Response } from 'express';
import { GetAllTodoLists } from '@/Service/index';
import { DataWrapper } from '@/Utils/index';

const GetTodolists = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const allTodoLists = await GetAllTodoLists();

  return res.send(DataWrapper(allTodoLists));
};

export default GetTodolists;
