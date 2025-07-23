import mongoose from 'mongoose';
import UserModel from '@/Model/user.model';

const FindUserById = async (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) return UserModel.findById(id).exec();
  else return null;
};

export default FindUserById;
