import { NextFunction, Request, Response } from 'express';
import { FindRoleByUserId } from '@/Service/index';
import { Role } from '@/Model/role.model';
import { AppError } from '@/Utils/index';

const checkPermission =
  (roleKeys: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (roleKeys.includes('public')) {
      return next();
    } else if (res.locals.user) {
      const role: Role | null = await FindRoleByUserId(res.locals.user._id);
      const permission: boolean[] = [];
      roleKeys.map(roleKey => {
        if (role && Object.keys(role).includes(roleKey)) {
          permission.push(role[roleKey as keyof Role] as boolean);
        }
      });
      if (permission.length > 0 && permission.every(v => v)) {
        return next();
      }
    }

    return next(new AppError(401, 'permission_denied'));
  };

export default checkPermission;
