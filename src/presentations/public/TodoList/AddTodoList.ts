import { NextFunction, Request, Response } from 'express';
import { DataAndMsgWrapper } from '@/Utils/index';
import { AddTodoListService } from '@/Service/index';
import { AddTodoListInput } from '@/Schema/index';

const AddTodoList = async (
  req: Request<{}, {}, AddTodoListInput>,
  res: Response,
  next: NextFunction
) => {
  const todoList = await AddTodoListService(req.body);

  return res.send(DataAndMsgWrapper(todoList, 'User creat success'));
};

export default AddTodoList;
