import { object, string } from 'zod';

const CreateUserSchema = object({
  body: object({
    firstName: string({
      required_error: 'user_firstName_required',
    }),
    lastName: string({
      required_error: 'user_lastName_required',
    }),
    password: string({
      required_error: 'user_password_required',
    }).min(6, 'user_passwordShort_required'),
    passwordConfirmation: string({
      required_error: 'user_passwordConfirmation_required',
    }),
    email: string({
      required_error: 'user_email_required',
    }).email('user_emailNotValid_required'),
  }).refine(data => data.password === data.passwordConfirmation, {
    message: 'user_password_not_match',
    path: ['passwordConfirmation'],
  }),
});

export default CreateUserSchema;
