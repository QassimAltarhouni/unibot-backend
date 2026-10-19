import { FindRoleByUserId } from '@/Service/index';
import CheckPermission from '@/Middleware/CheckPermission';
import AppError from '@/Utils/ErrorHandler/AppError';
import {
  createMockRequest,
  createMockResponse,
  createNext,
} from '../support/http';

jest.mock('@/Service/index', () => ({
  FindRoleByUserId: jest.fn(),
}));

const findRoleByUserId = FindRoleByUserId as jest.MockedFunction<
  typeof FindRoleByUserId
>;

const editorRole = {
  name: 'editor',
  read: true,
  write: true,
  delete: false,
  softDelete: false,
  firstPage: true,
  secondPage: false,
  thirdPage: false,
};

const run = async (roleKeys: string[], user?: { _id: string }) => {
  const req = createMockRequest();
  const res = createMockResponse(user ? { user } : {});
  const next = createNext();
  await CheckPermission(roleKeys)(req, res, next);
  return next;
};

const expectPermissionDenied = (next: jest.Mock) => {
  expect(next).toHaveBeenCalledTimes(1);
  const error = next.mock.calls[0][0];
  expect(error).toBeInstanceOf(AppError);
  expect(error).toMatchObject({
    statusCode: 401,
    message: 'permission_denied',
  });
};

describe('CheckPermission middleware', () => {
  it('lets public routes through without looking up a role', async () => {
    const next = await run(['public']);

    expect(next).toHaveBeenCalledWith();
    expect(findRoleByUserId).not.toHaveBeenCalled();
  });

  it('rejects protected routes when no user is authenticated', async () => {
    const next = await run(['read']);

    expectPermissionDenied(next);
    expect(findRoleByUserId).not.toHaveBeenCalled();
  });

  it('allows the request when the role grants every required permission', async () => {
    findRoleByUserId.mockResolvedValue(editorRole);

    const next = await run(['read', 'write'], { _id: 'user-1' });

    expect(findRoleByUserId).toHaveBeenCalledWith('user-1');
    expect(next).toHaveBeenCalledWith();
  });

  it('rejects the request when any required permission is false', async () => {
    findRoleByUserId.mockResolvedValue(editorRole);

    const next = await run(['read', 'delete'], { _id: 'user-1' });

    expectPermissionDenied(next);
  });

  it('rejects the request when the user has no role assigned', async () => {
    findRoleByUserId.mockResolvedValue(null);

    const next = await run(['read'], { _id: 'user-1' });

    expectPermissionDenied(next);
  });

  it('rejects the request when the required permission does not exist on the role', async () => {
    findRoleByUserId.mockResolvedValue(editorRole);

    const next = await run(['manageUsers'], { _id: 'user-1' });

    expectPermissionDenied(next);
  });
});
