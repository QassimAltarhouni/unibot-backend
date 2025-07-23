import { object, string } from 'zod';

const ResetPasswordSchema = object({
  params: object({
    id: string(),
    passwordResetCode: string(),
  }),
  body: object({
    password: string({
      required_error: 'user_password_required',
    }).min(6, 'user_passwordShort_required'),
    passwordConfirmation: string({
      required_error: 'user_passwordConfirmation_required',
    }),
  }).refine(data => data.password === data.passwordConfirmation, {
    message: 'user_password_not_match',
    path: ['passwordConfirmation'],
  }),
});

export default ResetPasswordSchema;
