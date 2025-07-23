import { NextFunction, Request, Response } from 'express';
import { FindUserById } from '@/Service/index';
import { AppError, MsgWrapper } from '@/Utils/index';
import { ResetPasswordInput } from '@/Schema/index';

const ResetPasswordHandler = async (
  req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>,
  res: Response,
  next: NextFunction
) => {
  const { id, passwordResetCode } = req.params;

  const { password } = req.body;

  const user = await FindUserById(id);

  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return next(new AppError(400, 'Could not reset user password'));
  }

  user.passwordResetCode = null;

  user.password = password;

  await user.save();

  return res.send(MsgWrapper('user reset password success'));
};

export default ResetPasswordHandler;
