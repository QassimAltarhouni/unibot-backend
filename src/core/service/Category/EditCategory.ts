import CategoryModel, { Category } from '@/Model/category.model';
import mongoose from 'mongoose';
import { ErrorResponse } from '@/Utils/ErrorHandler/ErrorResponse';

const editCategory = async ({
  id,
  editedData,
}: {
  id: string;
  editedData: Category;
}) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorResponse(400, 'Invalid id');
  }

  const existing = await CategoryModel.findById(id);
  if (!existing) {
    throw new ErrorResponse(404, 'Category does not exist');
  }

  try {
    const updated = await CategoryModel.findByIdAndUpdate(id, editedData, {
      new: true,
      runValidators: true,
    });

    return updated;
  } catch (err: any) {
    if (err.code === 11000 && err.keyPattern?.title) {
      throw new ErrorResponse(400, 'Category with this title already exists');
    }

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      throw new ErrorResponse(400, `Validation failed: ${messages.join(', ')}`);
    }
    console.error('EditCategoryService error:', err);
    throw new ErrorResponse(500, 'something went wrong');
  }
};

export default editCategory;
