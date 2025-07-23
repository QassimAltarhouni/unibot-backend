import UserModel, { User } from '@/Model/user.model';

const CreateUser = async (input: Partial<User>) => {
  return UserModel.create(input);
};

export default CreateUser;
