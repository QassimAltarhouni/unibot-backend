import roleModel from '@/Model/role.model';
import userRoleRelationModel from '@/Model/userRoleRelation.model';
import mongoose from 'mongoose';

const CreateUserRole = async ({
  userId,
}: {
  userId: string | mongoose.Types.ObjectId;
}) => {
  const roleId = await roleModel.findOne({ name: 'client' }).exec();
  return userRoleRelationModel.create({ user: userId, role: roleId });
};

export default CreateUserRole;
