import { NextFunction, Request, Response } from 'express';
import { CreateRole } from '@/Service/index';
import { AppError, DataAndMsgWrapper } from '@/Utils/index';
import { AddRolesInput } from '@/Schema/index';

const AddRoleHandler = async (
  req: Request<{}, {}, AddRolesInput>,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  try {
    const role = await CreateRole(body);

    return res.send(DataAndMsgWrapper({ role }, 'role created', true));
  } catch (e: any) {
    next(new AppError(500, 'something went wrong'));
  }
};

export default AddRoleHandler;
