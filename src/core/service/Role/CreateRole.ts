import RoleModel, { Role } from '@/Model/role.model';

const CreateRole = async (input: Partial<Role>) => {
  return RoleModel.create(input);
};

export default CreateRole;
