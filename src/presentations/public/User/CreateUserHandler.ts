import { NextFunction, Request, Response } from 'express';
import { CreateUser, CreateUserRole } from '@/Service/index';
import { AppError, DataAndMsgWrapper, Logger } from '@/Utils/index';
import { CreateUserInput } from '@/Schema/index';

const CreateUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  try {
    const user = await CreateUser(body);

    // assign auto role
    if (user) {
      //await CreateUserRole({userId: user._id});
    }

    // await SendMail({
    //    to: user.email,
    //    from: config.get("smtp.user"),
    //    subject: "Verify your email",
    //    text: `Verify email https://blabla.com/login?UserId=${user._id}&ActivationCode=${user.verificationCode}`,
    //     html: `<p>verification code: ${user.verificationCode}</p><p>Id: ${user._id}</p>`,
    // });

    return res.send(
      DataAndMsgWrapper(
        { activationCode: user.verificationCode },
        'user creat success',
        true
      )
    );
  } catch (e: any) {
    if (e.code === 11000) {
      next(new AppError(409, 'Account already exists!'));
    }
    Logger.error(e, 'Create User Error');
    next(
      new AppError(500, "something went wrong. Probably email couldn't sent")
    );
  }
};

export default CreateUserHandler;
