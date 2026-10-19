import jwt from 'jsonwebtoken';
import DeserializeUser from '@/Middleware/DeserializeUser';
import { TEST_SECRETS } from '../support/config';
import {
  createMockRequest,
  createMockResponse,
  createNext,
} from '../support/http';

const run = async (authorization?: string) => {
  const req = createMockRequest({
    headers: authorization ? { authorization } : {},
  });
  const res = createMockResponse();
  const next = createNext();
  await DeserializeUser(req, res, next);
  return { res, next };
};

describe('DeserializeUser middleware', () => {
  it('continues without a user when no Authorization header is sent', async () => {
    const { res, next } = await run();

    expect(next).toHaveBeenCalledWith();
    expect(res.locals.user).toBeUndefined();
  });

  it('attaches the decoded payload of a valid access token', async () => {
    const token = jwt.sign(
      { _id: 'user-1', email: 'student@example.com' },
      TEST_SECRETS.access
    );

    const { res, next } = await run(`Bearer ${token}`);

    expect(next).toHaveBeenCalledWith();
    expect(res.locals.user).toMatchObject({
      _id: 'user-1',
      email: 'student@example.com',
    });
  });

  it('ignores a token signed with a different secret', async () => {
    const token = jwt.sign({ _id: 'user-1' }, 'some-other-secret');

    const { res, next } = await run(`Bearer ${token}`);

    expect(next).toHaveBeenCalledWith();
    expect(res.locals.user).toBeUndefined();
  });

  it('does not accept a refresh token as an access token', async () => {
    const token = jwt.sign({ session: 'session-1' }, TEST_SECRETS.refresh);

    const { res } = await run(`Bearer ${token}`);

    expect(res.locals.user).toBeUndefined();
  });

  it('ignores a malformed token', async () => {
    const { res, next } = await run('Bearer not-a-jwt');

    expect(next).toHaveBeenCalledWith();
    expect(res.locals.user).toBeUndefined();
  });
});
