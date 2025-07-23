import { Request, Response } from 'express';
import { EditCategoryBody, EditCategoryQuery } from '@/Schema/index';
import { EditCategoryService } from '@/Service/index';
import { DataAndErrorWrapper, DataAndMsgWrapper } from '@/Utils/index';
import { ErrorResponse } from '@/Utils/ErrorHandler/ErrorResponse';

const EditCategory = async (
  req: Request<{ id: string }, {}, EditCategoryBody, EditCategoryQuery>,
  res: Response
) => {
  try {
    const { id } = req.params;
    await EditCategoryService({
      id: id,
      editedData: req.body,
    });

    return res.send(
      DataAndMsgWrapper(req.body, 'Successfully edited Category!')
    );
  } catch (e) {
    const errorMessage = e instanceof ErrorResponse ? e.message : String(e);
    const statusCode = e instanceof ErrorResponse ? e.statusCode : 500;
    return res
      .status(statusCode)
      .send(DataAndErrorWrapper(errorMessage, 'Failed to edit Category'));
  }
};

export default EditCategory;
