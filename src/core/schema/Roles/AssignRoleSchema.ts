import { object, string } from 'zod';

const AssignRoleSchema = object({
  body: object({
    userId: string(),
    roleId: string(),
  }),
});

export default AssignRoleSchema;
