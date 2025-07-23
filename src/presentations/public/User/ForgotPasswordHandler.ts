import { NextFunction, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { FindUserByEmail } from '@/Service/index';
import { AppError, DataAndMsgWrapper, Logger } from '@/Utils/index';
import { ForgotPasswordInput } from '@/Schema/index';

const ForgotPasswordHandler = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const user = await FindUserByEmail(email);

  if (!user) {
    return next(new AppError(400, 'user_email_no_exists'));
  }

  if (!user.verified) {
    return next(new AppError(400, 'user_verify_pending'));
  }

  const passwordResetCode = nanoid();

  user.passwordResetCode = passwordResetCode;

  await user.save();

  try {
    // await SendMail({
    //     to: user.email,
    //     from: config.get("smtp.user"),
    //     // from: "test@example.com",
    //     subject: "Reset your password",
    //     text: `Password reset link: https://blabla.com/passwordreset?passwordResetCode=${passwordResetCode}&UserId=${user._id}`,
    // });
    Logger.debug(`Password reset email sent to ${email}`);
    return res.send(
      DataAndMsgWrapper(
        { passwordResetCode },
        'forget password mail sent',
        true
      )
    );
  } catch (e) {
    return next(new AppError(500, 'something went wrong'));
  }
};

export default ForgotPasswordHandler;
