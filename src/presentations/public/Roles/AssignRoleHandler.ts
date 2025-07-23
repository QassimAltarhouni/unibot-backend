import { NextFunction, Request, Response } from 'express';
import {
  AssignRoleByRoleId,
  FindRoleById,
  FindUserById,
} from '@/Service/index';
import { AppError, DataAndMsgWrapper } from '@/Utils/index';
import { AssignRoleInput } from '@/Schema/index';

const AssignRoleHandler = async (
  req: Request<{}, {}, AssignRoleInput>,
  res: Response,
  next: NextFunction
) => {
  const { userId, roleId } = req.body;

  const user = await FindUserById(userId);
  const role = await FindRoleById(roleId);

  if (!user || !role) {
    return next(new AppError(404, 'user or role not found!'));
  }

  try {
    const assignRole = await AssignRoleByRoleId({
      userId: user._id.toString(),
      roleId: role._id.toString(),
    });

    return res.send(
      DataAndMsgWrapper({ assignRole }, 'user creat success', true)
    );
  } catch (error) {
    next(new AppError(500, 'something went wrong.'));
  }
};

export default AssignRoleHandler;
