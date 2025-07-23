import { omit } from 'lodash';
import { privateFields, User } from '@/Model/user.model';
import { DocumentType } from '@typegoose/typegoose';
import { SignJwt } from '@/Utils/index';

const SignAccessToken = async (user: DocumentType<User>) => {
  const payload = omit(user.toJSON(), privateFields);

  return SignJwt(payload, 'accessTokenPrivateKey', {
    expiresIn: '15m',
  });
};

export default SignAccessToken;
