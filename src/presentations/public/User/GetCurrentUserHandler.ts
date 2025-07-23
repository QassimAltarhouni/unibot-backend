import { Request, Response } from 'express';
import { DataWrapper } from '@/Utils/index';

const GetCurrentUserHandler = async (req: Request, res: Response) => {
  return res.send(DataWrapper(res.locals.user));
};

export default GetCurrentUserHandler;
