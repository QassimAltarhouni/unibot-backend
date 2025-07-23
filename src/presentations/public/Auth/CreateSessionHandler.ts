import { NextFunction, Request, Response } from 'express';
import {
  FindUserByEmailWithPassword,
  SignAccessToken,
  SignRefreshToken,
} from '@/Service/index';
import { AppError, DataAndMsgWrapper } from '@/Utils/index';
import { CreateSessionInput } from '@/Schema/index';

const CreateSessionHandler = async (
  req: Request<{}, {}, CreateSessionInput>,
  res: Response,
  next: NextFunction
) => {
  const message = 'Invalid email or password';
  const { email, password } = req.body;

  const user = await FindUserByEmailWithPassword(email);

  if (!user) {
    return next(new AppError(400, message));
  }

  if (!user.verified) {
    return next(new AppError(400, 'Please verify your email'));
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return next(new AppError(400, message));
  }

  //sign an access token
  const accessToken = await SignAccessToken(user);

  // sign a refresh token
  const refreshToken = await SignRefreshToken({ userId: user._id });

  return res.send(
    DataAndMsgWrapper(
      {
        user,
        accessToken,
        refreshToken,
      },
      'sign in successful',
      true
    )
  );
};

export default CreateSessionHandler;
