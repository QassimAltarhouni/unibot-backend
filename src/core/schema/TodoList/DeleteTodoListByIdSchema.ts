import { object, string } from 'zod';

const DeleteTodoListByIdSchema = object({
  query: object({
    id: string(),
  }),
});

export default DeleteTodoListByIdSchema;
