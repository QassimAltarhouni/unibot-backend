import { NextFunction, Request, Response } from 'express';
import { AppError, DataAndMsgWrapper } from '@/Utils/index';
import { CreateSessionInput } from '@/Schema/index';

const CheckAccessToken = (
  req: Request<{}, {}, CreateSessionInput>,
  res: Response,
  next: NextFunction
) => {
  if (res.locals.user) {
    return res.send(
      DataAndMsgWrapper({ user: res.locals.user }, 'token ture', true)
    );
  }
  return next(new AppError(404, 'token false'));
};

export default CheckAccessToken;
