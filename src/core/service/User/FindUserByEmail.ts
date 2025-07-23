import UserModel from '@/Model/user.model';

const FindUserByEmail = async (email: string) => {
  return UserModel.findOne({ email }).exec();
};

export default FindUserByEmail;
