import SessionModel from '@/Model/session.model';
import { SignJwt } from '@/Utils/index';
import mongoose from 'mongoose';

const createSession = async (id: string | mongoose.Types.ObjectId) => {
  return SessionModel.create({ user: id });
};

const findSessionByUserId = async (id: string | mongoose.Types.ObjectId) => {
  return SessionModel.findOne({ user: id }).exec();
};

const SignRefreshToken = async ({
  userId,
}: {
  userId: string | mongoose.Types.ObjectId;
}) => {
  let session = await findSessionByUserId(userId);

  if (!session) {
    session = await createSession(userId);
  }

  return SignJwt(
    {
      session: session._id,
    },
    'refreshTokenPrivateKey',
    {
      expiresIn: '1y',
    }
  );
};

export default SignRefreshToken;
