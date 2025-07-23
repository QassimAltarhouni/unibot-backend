import { Request, Response, NextFunction } from 'express';
import { VerifyJwt } from '@/Utils/index';
const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = (req.headers.authorization || '').replace(
    /^Bearer\s/,
    ''
  );

  if (!accessToken) {
    return next();
  }

  const decoded = VerifyJwt(accessToken, 'accessTokenPrivateKey');

  if (decoded) {
    res.locals.user = decoded;
  }

  return next();
};

export default deserializeUser;
