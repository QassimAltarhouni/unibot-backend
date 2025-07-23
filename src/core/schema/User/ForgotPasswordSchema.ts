import { object, string } from 'zod';

const ForgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: 'user_email_required',
    }).email('user_emailNotValid_required'),
  }),
});

export default ForgotPasswordSchema;
