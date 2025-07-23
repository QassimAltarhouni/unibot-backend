import { GetAllCategoriesService } from '@/Service/index';
import { NextFunction, Request, Response } from 'express';
import { DataAndErrorWrapper, DataAndMsgWrapper } from '@/Utils/index';

const GetCategories = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const Categories = await GetAllCategoriesService();
    return res.send(
      DataAndMsgWrapper(Categories, 'Successfully returned Categories')
    );
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return res
      .status(404)
      .send(DataAndErrorWrapper(errorMessage, 'Failed to return Categories'));
  }
};

export default GetCategories;
