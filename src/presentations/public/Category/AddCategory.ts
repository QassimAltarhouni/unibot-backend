import { NextFunction, Request, Response } from 'express';
import { AddCategoryInput } from '@/Schema/index';
import { AddCategoryService } from '@/Service/index';
import { DataAndErrorWrapper, DataAndMsgWrapper } from '@/Utils/index';

const AddCategory = async (
  req: Request<{}, {}, AddCategoryInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const addCategory = await AddCategoryService(req.body);

    return res.send(
      DataAndMsgWrapper(addCategory, 'Successfully added new Category!')
    );
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return res
      .status(400)
      .send(DataAndErrorWrapper(errorMessage, 'Category failed to upload'));
  }
};

export default AddCategory;
