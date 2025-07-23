import { object, string, boolean } from 'zod';

const CreateSessionSchema = object({
  body: object({
    name: string({
      required_error: 'role name required',
    }),
    write: boolean().optional(),
    delete: boolean().optional(),
    softDelete: boolean().optional(),
    read: boolean().optional(),
    firstPage: boolean().optional(),
    secondPage: boolean().optional(),
    thirdPage: boolean().optional(),
  }),
});

export default CreateSessionSchema;
