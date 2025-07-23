import CategoryModel from '@/Model/category.model';

const GetAllCategories = async () => {
  try {
    return await CategoryModel.find({}).exec();
  } catch (e) {
    throw new Error('Categorys not found');
  }
};

export default GetAllCategories;
