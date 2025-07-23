import { object, string } from 'zod';

const VerifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string(),
  }),
});

export default VerifyUserSchema;
