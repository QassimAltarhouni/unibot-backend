import config from 'config';
import jwt from 'jsonwebtoken';

const VerifyJwt = <T>(
  token: string,
  keyName:
    | 'accessTokenPrivateKey'
    | 'refreshTokenPrivateKey'
    | 'forgetTokenPrivateKey'
): T | null => {
  const publicKey = Buffer.from(
    config.get<{
      accessTokenPrivateKey: string;
      refreshTokenPrivateKey: string;
      forgetTokenPrivateKey: string;
    }>('jwt')[keyName],
    'base64'
  ).toString('ascii');

  try {
    return jwt.verify(token, publicKey) as T;
  } catch (e) {
    return null;
  }
};

export default VerifyJwt;
