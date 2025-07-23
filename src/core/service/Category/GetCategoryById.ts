import CategoryModel from '@/Model/category.model';
import mongoose from 'mongoose';
import { ErrorResponse } from '@/Utils/ErrorHandler/ErrorResponse';

const GetCategoryById = async (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const Category = await CategoryModel.findById(id);
    if (Category == null)
      throw new ErrorResponse(404, 'Category does not exist');
    return Category;
  } else {
    throw new ErrorResponse(400, 'Invalid id');
  }
};

export default GetCategoryById;
