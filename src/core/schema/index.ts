import { TypeOf } from 'zod';
import CreateSessionSchema from './Auth/CreateSessionSchema';
import CreateUserSchema from './User/CreateUserSchema';
import VerifyUserSchema from './User/VerifyUserSchema';
import ForgotPasswordSchema from './User/ForgotPasswordSchema';
import ResetPasswordSchema from './User/ResetPasswordSchema';
import GetTodoListSchema from './TodoList/GetTodoListSchema';
import GetTodoListByIdSchema from './TodoList/GetTodoListByIdSchema';
import AddTodoListSchema from './TodoList/AddTodoListSchema';
import DeleteTodoListById from './TodoList/DeleteTodoListByIdSchema';
import AddRoles from './Roles/AddRolesSchema';
import AssignRole from './Roles/AssignRoleSchema';
import AddCategorySchema from './Category/AddCategorySchema';
import EditCategoryByIdSchema from './Category/EditCategoryByIdSchema';
import GetCategoryByIdSchema from './Category/GetCategoryByIdSchema';
import RemoveCategoryByIdSchema from './Category/RemoveCategoryByIdSchema';

/** SCHEMAS */
export { default as CreateSessionSchema } from './Auth/CreateSessionSchema';
export { default as CreateUserSchema } from './User/CreateUserSchema';
export { default as VerifyUserSchema } from './User/VerifyUserSchema';
export { default as ForgotPasswordSchema } from './User/ForgotPasswordSchema';
export { default as ResetPasswordSchema } from './User/ResetPasswordSchema';

export { default as GetTodoListSchema } from './TodoList/GetTodoListSchema';
export { default as GetTodoListByIdSchema } from './TodoList/GetTodoListByIdSchema';
export { default as AddTodoListSchema } from './TodoList/AddTodoListSchema';
export { default as DeleteTodoListByIdSchema } from './TodoList/DeleteTodoListByIdSchema';

// Role
export { default as AddRolesSchema } from './Roles/AddRolesSchema';
export { default as AssignRoleSchema } from './Roles/AssignRoleSchema';

// Category
export { default as AddCategorySchema } from './Category/AddCategorySchema';
export { default as GetCategoryByIdSchema } from './Category/GetCategoryByIdSchema';
export { default as EditCategoryByIdSchema } from './Category/EditCategoryByIdSchema';
export { default as RemoveCategoryByIdSchema } from './Category/RemoveCategoryByIdSchema';
/** TYPES */
export type CreateSessionInput = TypeOf<typeof CreateSessionSchema>['body'];
export type CreateUserInput = TypeOf<typeof CreateUserSchema>['body'];
export type VerifyUserInput = TypeOf<typeof VerifyUserSchema>['params'];
export type ForgotPasswordInput = TypeOf<typeof ForgotPasswordSchema>['body'];
export type ResetPasswordInput = TypeOf<typeof ResetPasswordSchema>;
export type GetTodoListInput = TypeOf<typeof GetTodoListSchema>['params'];
export type GetTodoListByIdInput = TypeOf<
  typeof GetTodoListByIdSchema
>['query'];
export type DeleteTodoListByIdInput = TypeOf<
  typeof DeleteTodoListById
>['query'];
export type AddTodoListInput = TypeOf<typeof AddTodoListSchema>['body'];

export type AddRolesInput = TypeOf<typeof AddRoles>['body'];
export type AssignRoleInput = TypeOf<typeof AssignRole>['body'];

export type AddCategoryInput = TypeOf<typeof AddCategorySchema>['body'];
export type EditCategoryQuery = TypeOf<typeof EditCategoryByIdSchema>['params'];
export type EditCategoryBody = TypeOf<typeof EditCategoryByIdSchema>['body'];
export type GetCategoryByIdInput = TypeOf<
  typeof GetCategoryByIdSchema
>['params'];
export type RemoveCategoryByIdInput = TypeOf<
  typeof RemoveCategoryByIdSchema
>['params'];
