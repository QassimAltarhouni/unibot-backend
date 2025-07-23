import UserModel from '@/Model/user.model';

const FindUserByEmailWithPassword = async (email: string) => {
  return UserModel.findOne({ email }).select('+password').exec();
};

export default FindUserByEmailWithPassword;
