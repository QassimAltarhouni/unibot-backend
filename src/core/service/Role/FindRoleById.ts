import mongoose from 'mongoose';
import RoleModel from '@/Model/role.model';

const FindRoleById = async (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) return RoleModel.findById(id).exec();
  else return null;
};

export default FindRoleById;
