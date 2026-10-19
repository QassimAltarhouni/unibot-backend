import request from 'supertest';
import { createApp } from '../../src/app';
import {
  FindUserByEmailWithPassword,
  SignAccessToken,
  SignRefreshToken,
} from '@/Service/index';

jest.mock('@/Service/index', () => ({
  ...(jest.requireActual('@/Service/index') as object),
  FindUserByEmailWithPassword: jest.fn(),
  SignAccessToken: jest.fn(),
  SignRefreshToken: jest.fn(),
}));

const findUser = FindUserByEmailWithPassword as jest.Mock;
const signAccessToken = SignAccessToken as jest.Mock;
const signRefreshToken = SignRefreshToken as jest.Mock;

const app = createApp();
const LOGIN_URL = '/api/v1/sessions/login';
const credentials = { email: 'student@example.com', password: 'secret123' };

const buildUser = (overrides: Record<string, unknown> = {}) => ({
  _id: 'user-1',
  email: credentials.email,
  firstName: 'Test',
  lastName: 'Student',
  verified: true,
  validatePassword: jest.fn().mockResolvedValue(true),
  ...overrides,
});

describe('GET /api/v1/healthcheck', () => {
  it('responds with 200', async () => {
    await request(app).get('/api/v1/healthcheck').expect(200);
  });
});

describe('unknown routes', () => {
  it('respond with 404 not_found', async () => {
    const res = await request(app).get('/api/v1/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: ['not_found'], success: false });
  });
});

describe(`POST ${LOGIN_URL}`, () => {
  it('rejects an invalid body before touching the database', async () => {
    const res = await request(app)
      .post(LOGIN_URL)
      .send({ email: 'not-an-email', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toEqual([
      'user_emailNotValid_required',
      'user_passwordShort_required',
    ]);
    expect(findUser).not.toHaveBeenCalled();
  });

  it('returns a generic error when the user does not exist', async () => {
    findUser.mockResolvedValue(null);

    const res = await request(app).post(LOGIN_URL).send(credentials);

    expect(findUser).toHaveBeenCalledWith(credentials.email);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: ['Invalid email or password'],
      success: false,
    });
  });

  it('refuses to log in a user who has not verified their email', async () => {
    const user = buildUser({ verified: false });
    findUser.mockResolvedValue(user);

    const res = await request(app).post(LOGIN_URL).send(credentials);

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual(['Please verify your email']);
    expect(user.validatePassword).not.toHaveBeenCalled();
    expect(signAccessToken).not.toHaveBeenCalled();
  });

  it('returns the same generic error for a wrong password', async () => {
    const user = buildUser({
      validatePassword: jest.fn().mockResolvedValue(false),
    });
    findUser.mockResolvedValue(user);

    const res = await request(app).post(LOGIN_URL).send(credentials);

    expect(user.validatePassword).toHaveBeenCalledWith(credentials.password);
    expect(res.status).toBe(400);
    expect(res.body.error).toEqual(['Invalid email or password']);
    expect(signAccessToken).not.toHaveBeenCalled();
  });

  it('returns access and refresh tokens for valid credentials', async () => {
    const user = buildUser();
    findUser.mockResolvedValue(user);
    signAccessToken.mockResolvedValue('access-token');
    signRefreshToken.mockResolvedValue('refresh-token');

    const res = await request(app).post(LOGIN_URL).send(credentials);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      message: 'sign in successful',
      data: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: { _id: 'user-1', email: credentials.email },
      },
    });
    expect(signAccessToken).toHaveBeenCalledWith(user);
    expect(signRefreshToken).toHaveBeenCalledWith({ userId: 'user-1' });
  });
});
