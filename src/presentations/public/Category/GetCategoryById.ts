import { NextFunction, Request, Response } from 'express';
import { GetCategoryByIdService } from '@/Service/index';
import { GetCategoryByIdInput } from '@/Schema/index';
import { DataAndErrorWrapper, DataAndMsgWrapper } from '@/Utils/index';
import { ErrorResponse } from '@/Utils/ErrorHandler/ErrorResponse';

const GetCategoryById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const Category = await GetCategoryByIdService(id);

    return res.send(
      DataAndMsgWrapper(Category, 'Successfully returned requested Category')
    );
  } catch (e) {
    const errorMessage = e instanceof ErrorResponse ? e.message : String(e);
    const statusCode = e instanceof ErrorResponse ? e.statusCode : 500;
    return res
      .status(statusCode)
      .send(DataAndErrorWrapper(errorMessage, 'Failed to return Category'));
  }
};

export default GetCategoryById;
