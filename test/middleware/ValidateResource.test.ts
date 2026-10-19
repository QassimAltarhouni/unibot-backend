import ValidateResource from '@/Middleware/ValidateResource';
import CreateSessionSchema from '@/Schema/Auth/CreateSessionSchema';
import {
  createMockRequest,
  createMockResponse,
  createNext,
} from '../support/http';

const run = (body: unknown) => {
  const req = createMockRequest({ body });
  const res = createMockResponse();
  const next = createNext();
  ValidateResource(CreateSessionSchema)(req, res, next);
  return { res, next };
};

describe('ValidateResource middleware', () => {
  it('calls next when the request matches the schema', () => {
    const { res, next } = run({
      email: 'student@example.com',
      password: 'secret123',
    });

    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('responds with 400 and the validation messages for an invalid body', () => {
    const { res, next } = run({ email: 'not-an-email', password: '123' });

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      error: ['user_emailNotValid_required', 'user_passwordShort_required'],
      success: false,
    });
  });

  it('reports required fields that are missing', () => {
    const { res } = run({});

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      error: ['user_email_required', 'user_password_required'],
      success: false,
    });
  });
});
