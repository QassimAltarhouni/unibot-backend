import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { ErrorWrapper } from '@/Utils/index';

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      const errors = e.errors.map(
        (error: { message: string }) => error.message
      );
      return res.status(400).send(ErrorWrapper(errors));
    }
  };

export default validateResource;
