import userRoleRelationModel from '@/Model/userRoleRelation.model';

const AssignRoleByRoleId = async ({
  userId,
  roleId,
}: {
  userId: string;
  roleId: string;
}) => {
  return userRoleRelationModel.create({ user: userId, role: roleId });
};

export default AssignRoleByRoleId;
