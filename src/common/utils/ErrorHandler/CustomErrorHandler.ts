import { NextFunction, Request, Response } from 'express';
import AppError from '@/Utils/ErrorHandler/AppError';
import { ErrorWrapper } from '@/Utils/index';

const handleKnownExceptions = (
  err: any,
  res: Response,
  req: Request,
  next: NextFunction
) => {
  const { statusCode, message } = err;

  res.status(statusCode).json(ErrorWrapper([message]));
};

const handleUnknownExceptions = (
  err: any,
  res: Response,
  req: Request,
  next: NextFunction
) => {
  //log it
  res.status(500).json(ErrorWrapper('something went wrong'));
};

const CustomErrorHandler = (
  err: any,
  res: Response,
  req: Request,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    handleKnownExceptions(err, res, req, next);
  } else {
    handleUnknownExceptions(err, res, req, next);
  }
};

export default CustomErrorHandler;
