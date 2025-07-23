import CategoryModel, { Category } from '@/Model/category.model';
import { ErrorResponse } from '@/Utils/ErrorHandler/ErrorResponse';

const AddCategory = async (Category: Category) => {
  try {
    const count = await CategoryModel.countDocuments({ title: Category.title });
    console.log(
      '📊 Existing categories with title:',
      Category.title,
      '→',
      count
    );

    return await CategoryModel.create(Category);
  } catch (e: any) {
    console.error('⚠️ MongoDB error:', e);
    console.error('📝 Attempted title:', Category.title);
    if (e.code === 11000) {
      throw new ErrorResponse(400, 'Category with this title already exists');
    }
    throw new ErrorResponse(500, 'Category failed to upload');
  }
};

export default AddCategory;
