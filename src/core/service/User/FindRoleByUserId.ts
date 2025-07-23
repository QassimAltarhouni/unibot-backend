import UserRoleRelationModel from '@/Model/userRoleRelation.model';
import { Role } from '@/Model/role.model';

const FindRoleByUserId = async (userId: string) => {
  const roleRelation = await UserRoleRelationModel.findOne({ user: userId })
    .lean()
    .populate('role')
    .exec();
  if (roleRelation) {
    return roleRelation.role as Role;
  } else {
    return null;
  }
};

export default FindRoleByUserId;
