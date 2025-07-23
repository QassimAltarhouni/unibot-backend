import { RemoveCategoryService } from '@/Service/index';
import { NextFunction, Request, Response } from 'express';
import { RemoveCategoryByIdInput } from '@/Schema/index';
import { DataAndErrorWrapper, DataAndMsgWrapper } from '@/Utils/index';
import { ErrorResponse } from '@/Utils/ErrorHandler/ErrorResponse';

const RemoveCategory = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const removedCategory = await RemoveCategoryService(id);
    return res.send(
      DataAndMsgWrapper(removedCategory, 'Successfully removed Category')
    );
  } catch (e) {
    const errorMessage = e instanceof ErrorResponse ? e.message : String(e);
    const statusCode = e instanceof ErrorResponse ? e.statusCode : 500;
    return res
      .status(statusCode)
      .send(DataAndErrorWrapper(errorMessage, 'Failed to remove Category'));
  }
};

export default RemoveCategory;
