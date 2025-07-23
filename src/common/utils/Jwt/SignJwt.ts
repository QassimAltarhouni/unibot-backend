import config from 'config';
import jwt from 'jsonwebtoken';

const SignJwt = (
  object: any,
  keyName:
    | 'accessTokenPrivateKey'
    | 'refreshTokenPrivateKey'
    | 'forgetTokenPrivateKey',
  options?: jwt.SignOptions | undefined
) => {
  const signingKey = Buffer.from(
    config.get<{
      accessTokenPrivateKey: string;
      refreshTokenPrivateKey: string;
      forgetTokenPrivateKey: string;
    }>('jwt')[keyName],
    'base64'
  ).toString('ascii');

  return jwt.sign(object, signingKey);
};

export default SignJwt;
