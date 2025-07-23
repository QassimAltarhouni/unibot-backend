import { NextFunction, Request, Response } from 'express';
import { FindUserById } from '@/Service/index';
import { AppError, MsgWrapper } from '@/Utils/index';
import { VerifyUserInput } from '@/Schema/index';

const VerifyUserHandler = async (
  req: Request<VerifyUserInput>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  // find the user by id
  const user = await FindUserById(id);
  if (!user) {
    return next(new AppError(404, 'user not found!'));
  }

  // check to see if they are already verified
  if (user.verified) {
    return next(new AppError(400, 'user already verified'));
  }

  // check to see if the verificationCode matches
  if (user.verificationCode === verificationCode) {
    user.verified = true;

    await user.save();

    return res.send(MsgWrapper('user verify success', true));
  }

  return next(new AppError(401, 'verification failed'));
};

export default VerifyUserHandler;
