import CategoryModel from '@/Model/category.model';
import mongoose from 'mongoose';
import { ErrorResponse } from '@/Utils/ErrorHandler/ErrorResponse';

const RemoveCategory = async (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const Category = await CategoryModel.findByIdAndDelete(id);
    if (Category == null)
      throw new ErrorResponse(404, 'Category does not exist');
    return Category;
  } else {
    throw new ErrorResponse(400, 'Id is not valid');
  }
};

export default RemoveCategory;
