import { NextFunction, Request, Response } from 'express';
import {
  FindSessionById,
  FindUserById,
  SignAccessToken,
} from '@/Service/index';
import { AppError, DataAndMsgWrapper, VerifyJwt } from '@/Utils/index';

const RefreshAccessTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refresh_token: string = req.header('x-refresh') || '';

  const decoded = VerifyJwt<{ session: string }>(
    refresh_token,
    'refreshTokenPrivateKey'
  );

  if (!decoded) {
    return next(new AppError(401, 'Could not refresh access token'));
  }

  const session = await FindSessionById(decoded.session);

  if (!session || !session.valid) {
    return next(new AppError(401, 'Could not refresh access token'));
  }

  const user = await FindUserById(String(session.user));

  if (!user) {
    return next(new AppError(401, 'Could not refresh access token'));
  }

  const accessToken = await SignAccessToken(user);

  return res.send(
    DataAndMsgWrapper({ accessToken, user }, 'refresh token successful', true)
  );
};

export default RefreshAccessTokenHandler;
