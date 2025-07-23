import { object, string } from 'zod';

const CreateSessionSchema = object({
  body: object({
    email: string({
      required_error: 'user_email_required',
    }).email('user_emailNotValid_required'),

    password: string({
      required_error: 'user_password_required',
    }).min(6, 'user_passwordShort_required'),
  }),
});

export default CreateSessionSchema;
